import { inject, injectable } from "inversify";
import Timeout from "./timeout.interface";
import TYPES from "@container/types";
import { DateTime } from "luxon";
import PostsHandler from "@posts/posts.handler";
import IHeartsService from "@hearts/hearts.interface";
import { HeartRemoveStages } from "@hearts/hearts.settings";
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

  public async add(telegram: Telegram): Promise<void> {
    const chatId = await this.storage.getChatId();
    if (!chatId) return;

    if (this.timeout) clearTimeout(this.timeout);

    const state = await this.heartService.getHeartState();

    if (state.heartRemove.stage === HeartRemoveStages.END) return;

    const timeoutTime = state.heartRemove.stage * 60 * 1000;

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
