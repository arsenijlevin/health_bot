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

    if (!chatId) return;

    if (state.heartRemove.stage === HeartRemoveStages.HOURS_24 || state.heartRemove.stage === HeartRemoveStages.END) {
      await telegram.setChatPhoto(chatId, {
        source: heartImageBuffer,
        filename: "currentChannelHearts.jpg",
      });
    }

    await this.deleteLastHeartMessage(telegram);

    const messageId = await telegram.sendMessage(chatId, heartCountMessage, {
      disable_notification: true,
    });

    await this.setLastHeartMessage(messageId.message_id);
  }

  public async handlePost(ctx: ChannelPostContext) {
    await this.heartService.resetHeartState();

    const heartImageBuffer = await this.heartService.getHeartImage();

    await ctx.setChatPhoto({
      source: heartImageBuffer,
      filename: "currentChannelHearts.jpg",
    });

    await this.deleteLastHeartMessage(ctx.telegram);

    await this.setLastHeartMessage(undefined);
  }

  private async setLastHeartMessage(messageId: number | undefined) {
    await this.storage.setItem("lastHeartMessage", messageId);
  }

  private async getLastHeartMessage() {
    return await this.storage.getItem<number>("lastHeartMessage");
  }

  private async deleteLastHeartMessage(telegram: Telegram) {
    const chatId = await this.storage.getChatId();
    const lastHeartMessage = await this.getLastHeartMessage();

    if (!chatId || !lastHeartMessage) return;

    try {
      await telegram.deleteMessage(chatId, lastHeartMessage);
    } catch (err) {
      console.log("Error while deleting last heart message!");
    }
  }
}
