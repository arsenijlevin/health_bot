import { BotSettings } from "@core/bot";
import HeartSettings, { HeartRemoveStages, HeartState } from "@hearts/hearts.settings";

export default interface IHeartsService {
  initHearts: (settings: BotSettings) => Promise<void>;
  resetHeartState: () => Promise<void>;
  removeHearts: (count: number) => Promise<void>;
  addHearts: (count: number) => Promise<void>;
  getHeartImage: () => Promise<Buffer>;
  getHeartState: () => Promise<HeartState>;
  getHeartCountMessage: () => Promise<string>;
  setLastHeartRemoveDate: (dateISO : string) => Promise<void>;
  getHeartSettings: () => HeartSettings
  setStage: (stage : HeartRemoveStages) => Promise<void>
  setNextStage: () => Promise<void>
}
