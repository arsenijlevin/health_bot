import { BotSettings } from "@core/bot";
import { HeartState } from "@hearts/hearts.settings";

export default interface IHeartsService {
  initHearts: (settings: BotSettings) => Promise<void>;
  resetHeartState: () => void;
  removeHearts: (count: number) => Promise<void>;
  addHearts: (count: number) => Promise<void>;
  getHeartImage: () => Promise<Buffer>;
  getHeartState: () => Promise<HeartState>;
  getHeartCountMessage: () => Promise<string>;
}
