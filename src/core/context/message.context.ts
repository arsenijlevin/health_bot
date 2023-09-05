import { Context, NarrowedContext } from "telegraf";
import { Update, Message } from "typegram";

export type MessagesContext = NarrowedContext<
  Context,
  Update.MessageUpdate<Record<"text", unknown> & Message.TextMessage & Message.ContactMessage>
>;
