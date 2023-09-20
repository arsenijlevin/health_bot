import TYPES from "@container/types";
import { ChannelPostContext } from "@context/channel-post.context";
import JSONStorage from "@core/storage/local/json.storage";
import IHeartsService from "@hearts/hearts.interface";
import { HeartRemoveStages } from "../settings/hearts.settings";
import { inject, injectable } from "inversify";
import { DateTime } from "luxon";
import { Telegram } from "telegraf";

@injectable()
export default class PostsHandler {
  constructor(
    @inject(TYPES.IHeartService) private readonly heartService: IHeartsService,
    @inject(TYPES.JSONStorage) private readonly storage: JSONStorage
  ) {}

  public async handleWithoutPost(telegram: Telegram) {
    const state = await this.heartService.getHeartState();

    if (state.heartRemove.stage === HeartRemoveStages.HOURS_24 || state.heartRemove.stage === HeartRemoveStages.END) {
      await this.heartService.removeHearts(1);
    }

    await this.heartService.setLastHeartRemoveDate(DateTime.now().toISO() ?? "");

    const heartCountMessage = await this.heartService.getHeartCountMessage();
    const heartImageBuffer = await this.heartService.getHeartImage();

    const chatId = await this.storage.getChatId();

    if (state.count.full === 0) return;

    if (!chatId) return;

    void telegram.sendMessage(chatId, heartCountMessage, {
      disable_notification: true,
    });

    void telegram.setChatPhoto(chatId, {
      source: heartImageBuffer,
      filename: "currentChannelHearts.jpg",
    });
  }

  public async handlePost(ctx: ChannelPostContext) {
    await this.heartService.resetHeartState();

    const heartImageBuffer = await this.heartService.getHeartImage();

    await ctx.setChatPhoto({
      source: heartImageBuffer,
      filename: "currentChannelHearts.jpg",
    });
  }
}
