import ChannelPost from "@abstract/triggers/channel-post.abstract";
import TYPES from "@container/types";
import { ChannelPostContext } from "@context/channel-post.context";
import JSONStorage from "@core/storage/local/json.storage";
import IHeartsService from "@hearts/hearts.interface";
import { HeartRemoveStages } from "../../settings/hearts.settings";
import PostsHandler from "@posts/posts.handler";
import HeartTimeout from "@timeout/heart.timeout";
import { inject } from "inversify";
import { DateTime } from "luxon";

export default class AnyPost extends ChannelPost {
  constructor(
    @inject(TYPES.JSONStorage) private readonly storage: JSONStorage,
    @inject(TYPES.IHeartService) private readonly heartService: IHeartsService,
    @inject(TYPES.HeartTimeout) private readonly heartTimeout: HeartTimeout,
    @inject(TYPES.PostsHandler) private readonly postsHandler: PostsHandler
  ) {
    super();
  }

  public async handle(ctx: ChannelPostContext) {
    if ("pinned_message" in ctx.update.channel_post || "new_chat_title" in ctx.update.channel_post) {
      return;
    }

    if ("new_chat_photo" in ctx.update.channel_post) {
      await ctx.deleteMessage();
      return;
    }

    if ("text" in ctx.update.channel_post) {
      if (ctx.update.channel_post.text === "/stop") {
        this.heartTimeout.remove();

        await this.heartService.resetHeartState();

        await this.heartService.setLastHeartRemoveDate(DateTime.now().toISO() ?? "");
        await this.heartService.setStage(HeartRemoveStages.HOURS_24);

        const heartImageBuffer = await this.heartService.getHeartImage();

        await ctx.setChatPhoto({
          source: heartImageBuffer,
          filename: "currentChannelHearts.jpg",
        });

        await ctx.deleteMessage();

        return;
      }

      if (ctx.update.channel_post.text === "/start") {
        await ctx.deleteMessage();

        const chatId = ctx.chat.id;

        if (!chatId) return;

        await this.storage.setChatId(chatId);

        console.log(`Успешно установлен chatId ${chatId}`);

        return;
      }

      if (ctx.update.channel_post.text === "/reset") {
        await this.heartService.resetHeartState();

        await this.heartService.setLastHeartRemoveDate(DateTime.now().toISO() ?? "");
        await this.heartService.setStage(HeartRemoveStages.HOURS_24);

        await this.heartTimeout.add(ctx.telegram);

        const heartImageBuffer = await this.heartService.getHeartImage();

        await ctx.setChatPhoto({
          source: heartImageBuffer,
          filename: "currentChannelHearts.jpg",
        });

        await ctx.deleteMessage();

        return;
      }
    }

    await this.postsHandler.handlePost(ctx);
    await this.heartTimeout.add(ctx.telegram);
  }
}
