import { injectable } from "inversify";
import { Context, MiddlewareFn } from "telegraf";
import LocalSessionTelegraf from "telegraf-session-local";
import { SessionData } from "@context/bot.context";
import { ISession } from "@session/session.interface";

@injectable()
export class LocalSession implements ISession {
  private session: LocalSessionTelegraf<SessionData>;

  constructor() {
    this.session = new LocalSessionTelegraf({
      database: "sessions.json",
    });
  }

  public getMiddleware(): MiddlewareFn<Context> {
    return this.session.middleware();
  }

  public getSessionKey(ctx: Context): string {
    return this.session.getSessionKey(ctx);
  }

  public getSessionByCtx(ctx: Context): SessionData {
    return this.session.getSession(this.getSessionKey(ctx));
  }
}
