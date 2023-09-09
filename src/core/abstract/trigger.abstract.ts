import { injectable } from "inversify";
import { Context } from "telegraf";
import { Message, Update } from "typegram";

@injectable()
export default abstract class Trigger {
  constructor(
    public triggerText:
      | ((update: Update) => update is Update.MessageUpdate<Record<"text", unknown> & Message.TextMessage>)
      | "message"
      | "channel_post"
  ) {}

  public abstract handle(ctx: Context): void;
}
