import { injectable } from "inversify";
import fs from "fs";

interface BotConfigJSON {
  maxHearts: number;
  heartsImgPath: {
    full: string;
    empty: string;
  };
  heartRemoveTime: {
    HOURS_24: number;
    HOURS_8: number;
    HOURS_4: number;
    HOURS_1: number;
    MINUTES_10: number;
    END: number;
  };
}

@injectable()
export default class ParsedBotSettings {
  private readonly FILEPATH = "config/bot-config.json";

  private SETTINGS: BotConfigJSON | undefined;

  public setupSettingFromFile(filepath = this.FILEPATH) {
    const fileText = fs.readFileSync(filepath).toString();

    const json = JSON.parse(fileText) as BotConfigJSON;

    this.SETTINGS = json;

    console.log(json);
  }

  public getSettings() {
    return this.SETTINGS;
  }

  public getHeartRemoveTimesAsArray() {
    return [
      this.SETTINGS?.heartRemoveTime.HOURS_24,
      this.SETTINGS?.heartRemoveTime.HOURS_8,
      this.SETTINGS?.heartRemoveTime.HOURS_4,
      this.SETTINGS?.heartRemoveTime.HOURS_1,
      this.SETTINGS?.heartRemoveTime.MINUTES_10,
      this.SETTINGS?.heartRemoveTime.END,
    ];
  }
}
