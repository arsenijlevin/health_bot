import { MiddlewareFn, Context } from "telegraf";
import { SessionData } from "@context/bot.context";

export interface ISession {
  getSessionByCtx(ctx: Context): SessionData;
  getSessionKey(ctx: Context): string;
  getMiddleware(): MiddlewareFn<Context>;
}
