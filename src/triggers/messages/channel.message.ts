import Message from "@abstract/triggers/message.class";
import TYPES from "@container/types";
import { MessagesContext } from "@context/message.context";
import IHeartsService from "@hearts/hearts.interface";
import { inject } from "inversify";

export default class ChannelMessage extends Message {
  constructor(@inject(TYPES.IHeartService) private readonly heartService: IHeartsService) {
    super();
  }

  public async handle(ctx: MessagesContext) {
    if (ctx.chat.type !== "group") return;
    if (ctx.from.is_bot) return;

    await this.heartService.removeHearts(1);

    const heartCountMessage = await this.heartService.getHeartCountMessage();
    const heartImageBuffer = await this.heartService.getHeartImage();

    await ctx.reply(heartCountMessage);

    await ctx.setChatPhoto({
      source: heartImageBuffer,
      filename: "currentChannelHearts.jpg",
    });
  }
}
