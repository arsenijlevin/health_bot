import { inject, injectable } from "inversify";
import Timeout from "./timeout.interface";
import TYPES from "@container/types";
import { DateTime } from "luxon";
import PostsHandler from "@posts/posts.handler";
import IHeartsService from "@hearts/hearts.interface";
import { HeartRemoveStages } from "../settings/hearts.settings";
import { Telegram } from "telegraf";
import JSONStorage from "@core/storage/local/json.storage";

@injectable()
export default class HeartTimeout implements Timeout {
  private timeout: NodeJS.Timeout | null = null;
  private startTime: DateTime | null = null;
  private endTime: DateTime | null = null;

  constructor(
    @inject(TYPES.PostsHandler) private readonly postHandler: PostsHandler,
    @inject(TYPES.IHeartService) private readonly heartService: IHeartsService,
    @inject(TYPES.JSONStorage) private readonly storage: JSONStorage
  ) {}

  public remove() {
    if (this.timeout) clearTimeout(this.timeout);
  }

  public async add(telegram: Telegram): Promise<void> {
    const chatId = await this.storage.getChatId();
    if (!chatId) return;

    this.remove();

    const state = await this.heartService.getHeartState();

    if (state.heartRemove.stage === HeartRemoveStages.END) return;

    const stageTime = this.heartService.getTimeForState(state.heartRemove.stage);

    if (!stageTime) return;

    const timeoutTime = stageTime * 60 * 1000;

    this.setTimeout(async () => {
      await this.heartService.setNextStage();
      await this.postHandler.handleWithoutPost(telegram);

      await this.add(telegram);
    }, timeoutTime);
  }

  public setTimeout(callback: () => void, millis: number) {
    const now = DateTime.now();
    this.timeout = setTimeout(callback, millis);
    this.startTime = DateTime.fromISO(now.toISO() ?? "");
    this.endTime = DateTime.fromISO(now.plus({ milliseconds: millis }).toISO() ?? "");
  }
}
