import { Message } from "@abstract/triggers/message.class";
import { MessagesContext } from "@context/message.context";

export class BotMessage extends Message {
  constructor() {
    super();
  }

  public handle(ctx: MessagesContext): void {
    if (ctx.from.is_bot) return;
  }
}
