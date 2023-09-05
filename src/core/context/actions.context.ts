import { Context, NarrowedContext } from "telegraf";
import { Update, CallbackQuery } from "typegram";

export type ActionsContext = NarrowedContext<
  Context & {
    match: RegExpExecArray;
  },
  Update.CallbackQueryUpdate<CallbackQuery>
>;
