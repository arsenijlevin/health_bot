import { inject, injectable } from "inversify";
import Timeout from "./timeout.interface";
import TYPES from "@container/types";
import { DateTime } from "luxon";
import PostsHandler from "@posts/posts.manager";
import IHeartsService from "@hearts/hearts.interface";
import { HeartRemoveStages } from "@hearts/hearts.settings";
import { Telegram } from "telegraf";
import JSONStorage from "@core/storage/local/json.storage";

@injectable()
export default class HeartTimeout implements Timeout {
  private timeout: NodeJS.Timeout | null = null;

  constructor(
    @inject(TYPES.PostsHandler) private readonly postHandler: PostsHandler,
    @inject(TYPES.IHeartService) private readonly heartService: IHeartsService,
    @inject(TYPES.JSONStorage) private readonly storage: JSONStorage
  ) {}

  public async add(telegram: Telegram): Promise<void> {
    const chatId = await this.storage.getChatId();
    if (!chatId) return;

    if (this.timeout) clearTimeout(this.timeout);

    const state = await this.heartService.getHeartState();

    if (state.heartRemove.stage === HeartRemoveStages.END) return;

    const lastHeartRemoveDate = DateTime.fromISO(state.heartRemove.lastDateISO);

    const endTime = DateTime.fromISO(state.heartRemove.lastDateISO).plus({ minutes: state.heartRemove.stage });

    let timeoutTime = Math.abs(lastHeartRemoveDate.diff(endTime).toMillis());

    if (timeoutTime < state.heartRemove.stage * 60 * 1000) {
      timeoutTime = 0; // TODO
    }

    const timeout = setTimeout(async () => {
      await this.heartService.setNextStage();
      await this.postHandler.handleWithoutPost(telegram);

      await this.add(telegram);
      console.log(`Timeout set ended!`);
    }, timeoutTime);

    if (timeout) console.log(`Timeout set for ${timeoutTime / 1000 / 60} minutes`);

    this.timeout = timeout;
  }
}
