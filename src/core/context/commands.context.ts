import { Context, NarrowedContext } from "telegraf";
import { Update, Message } from "typegram";

export type CommandsContext = NarrowedContext<
  Context,
  {
    message: Update.New & Update.NonChannel & Message.TextMessage;
    update_id: number;
  }
>;
