import HeartSettings, { HeartRemoveStages, HeartState } from "src/settings/hearts.settings";

export default interface IHeartsService {
  initHearts: () => Promise<void>;
  resetHeartState: () => Promise<void>;
  removeHearts: (count: number) => Promise<void>;
  addHearts: (count: number) => Promise<void>;
  getHeartImage: () => Promise<Buffer>;
  getHeartState: () => Promise<HeartState>;
  getHeartCountMessage: () => Promise<string>;
  setLastHeartRemoveDate: (dateISO: string) => Promise<void>;
  getHeartSettings: () => HeartSettings;
  setStage: (stage: HeartRemoveStages) => Promise<void>;
  setNextStage: () => Promise<void>;
  getTimeForState: (stage: HeartRemoveStages) => number | undefined;
}
