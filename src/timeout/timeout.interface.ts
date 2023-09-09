import { Telegram } from "telegraf";

export default interface Timeout {
  add(telegram : Telegram): Promise<void>;
}