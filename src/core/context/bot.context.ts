import { Context } from "telegraf";

export interface SessionData {
  id: number;
}
export interface IBotContext extends Context {
  session: SessionData | undefined;
}
