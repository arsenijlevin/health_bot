import Trigger from "@abstract/trigger.class";
import { MessagesContext } from "@context/message.context";
import { injectable, multiInject } from "inversify";
import TYPES from "@container/types";
import Message from "@abstract/triggers/message.class";

@injectable()
export default class MessageTrigger extends Trigger {
  constructor(@multiInject(TYPES.Message) private readonly messages: Message[]) {
    super("message");
  }

  public async handle(ctx: MessagesContext): Promise<void> {
    if (ctx.from.is_bot) {
      await ctx.deleteMessage();
      return;
    }

    await Promise.all(
      this.messages.map(async (message) => {
        await message.handle(ctx);
      })
    );
  }
}
