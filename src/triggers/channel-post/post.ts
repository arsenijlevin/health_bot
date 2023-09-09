import ChannelPost from "@abstract/triggers/channel-post.abstract";
import TYPES from "@container/types";
import { ChannelPostContext } from "@context/channel-post.context";
import JSONStorage from "@core/storage/local/json.storage";
import IHeartsService from "@hearts/hearts.interface";
import { HeartRemoveStages } from "@hearts/hearts.settings";
import HeartTimeout from "@timeout/heart.timeout";
import { inject } from "inversify";
import { DateTime } from "luxon";

export default class AnyPost extends ChannelPost {
  constructor(
    @inject(TYPES.JSONStorage) private readonly storage: JSONStorage,
    @inject(TYPES.IHeartService) private readonly heartService: IHeartsService,
    @inject(TYPES.HeartTimeout) private readonly heartTimeout: HeartTimeout
  ) {
    super();
  }

  public async handle(ctx: ChannelPostContext) {
    console.log(ctx.update.channel_post);

    if ("text" in ctx.update.channel_post) {
      if (ctx.update.channel_post.text === "/start") {
        await ctx.deleteMessage();

        const chatId = ctx.chat.id;

        if (!chatId) return;

        await this.storage.setChatId(chatId);

        console.log(`Успешно установлен chatId ${chatId}`);
      }

      if (ctx.update.channel_post.text === "/reset") {
        await ctx.deleteMessage();

        await this.heartService.resetHeartState();

        await this.heartService.setLastHeartRemoveDate(DateTime.now().toISO() ?? "");
        await this.heartService.setStage(HeartRemoveStages.HOURS_24);

        await this.heartTimeout.add(ctx.telegram);

        const heartImageBuffer = await this.heartService.getHeartImage();

        await ctx.setChatPhoto({
          source: heartImageBuffer,
          filename: "currentChannelHearts.jpg",
        });
      }
    }
  }
}
