import TYPES from "@container/types";
import { BotSettings } from "@core/bot";
import Localization from "@core/locale/i18next";
import JSONStorage from "@core/storage/local/json.storage";
import HeartSettings, { HeartCount, HeartRemoveStages, HeartState } from "@hearts/hearts.settings";
import { inject, injectable } from "inversify";
import sharp from "sharp";
import IHeartsService from "src/hearts/hearts.interface";

interface HeartPositionData {
  count: HeartCount;
  positions: {
    top: number;
    left: number;
    isEmpty: boolean;
  }[];
}

@injectable()
export default class HeartsService implements IHeartsService {
  constructor(
    @inject(TYPES.JSONStorage) private readonly storage: JSONStorage,
    @inject(TYPES.HeartSettings) private readonly settings: HeartSettings
  ) {}

  public async setStage(stage: HeartRemoveStages) {
    const heartState = await this.getHeartState();

    await this.updateHeartState({
      ...heartState,
      heartRemove: {
        ...heartState.heartRemove,
        stage: stage,
      },
    });
  }

  public async setLastHeartRemoveDate(dateISO: string) {
    const heartState = await this.getHeartState();

    await this.updateHeartState({
      ...heartState,
      heartRemove: {
        ...heartState.heartRemove,
        lastDateISO: dateISO,
      },
    });
  }

  public getHeartSettings() {
    return this.settings;
  }

  public async resetHeartState() {
    await this.storage.setItem(this.settings.heartStateKey, this.settings.getHeartInitState());
  }

  public async getHeartState(): Promise<HeartState> {
    return this.storage.getItem(this.settings.heartStateKey);
  }

  private async updateHeartState(heartState: HeartState) {
    return this.storage.updateItem(this.settings.heartStateKey, heartState);
  }

  public async initHearts(settings: BotSettings) {
    const heartState = await this.getHeartState();

    this.settings.setSettings(settings);

    if (!heartState) {
      await this.resetHeartState();
    }
  }

  public async removeHearts(heartCount = 1) {
    if (heartCount <= 0) return;

    const heartState = await this.getHeartState();

    const fullHeartsAfter = heartState.count.full - heartCount;
    const emptyHeartsAfter = heartState.count.empty + heartCount;

    await this.updateHeartState({
      ...heartState,
      count: {
        ...heartState.count,
        full: fullHeartsAfter >= 0 ? fullHeartsAfter : 0,
        empty: emptyHeartsAfter <= heartState.count.max ? emptyHeartsAfter : heartState.count.max,
      },
    });
  }

  public async addHearts(heartCount = 1) {
    if (heartCount <= 0) return;

    const heartState = await this.getHeartState();

    const fullHeartsAfter = heartState.count.empty + heartCount;
    const emptyHeartsAfter = heartState.count.full - heartCount;

    await this.updateHeartState({
      ...heartState,
      count: {
        ...heartState.count,
        full: fullHeartsAfter <= heartState.count.max ? fullHeartsAfter : heartState.count.max,
        empty: emptyHeartsAfter >= 0 ? emptyHeartsAfter : 0,
      },
    });
  }

  public async getHeartCountMessage(): Promise<string> {
    const heartState = await this.getHeartState();
    const stage = heartState.heartRemove.stage;

    let heartCountMessage = Localization.t("logic:loseHP");

    switch (stage) {
      case HeartRemoveStages.HOURS_24: {
        if (heartState.count.full === 2) {
          heartCountMessage = Localization.t("logic:loseHPWithWarning");
        }

        if (heartState.count.full === 1) {
          heartCountMessage = Localization.t("logic:loseHPWithLastWarning");
        }

        break;
      }

      case HeartRemoveStages.HOURS_8: {
        heartCountMessage = Localization.t("logic:8hoursWarning");
        break;
      }

      case HeartRemoveStages.HOURS_4: {
        heartCountMessage = Localization.t("logic:4hoursWarning");
        break;
      }

      case HeartRemoveStages.HOURS_1: {
        heartCountMessage = Localization.t("logic:1hoursWarning");
        break;
      }

      case HeartRemoveStages.MINUTES_10: {
        heartCountMessage = Localization.t("logic:10minWarning");
        break;
      }
    }

    return heartCountMessage;
  }

  public async setNextStage(): Promise<void> {
    const heartState = await this.getHeartState();
    const stage = heartState.heartRemove.stage;

    switch (stage) {
      case HeartRemoveStages.HOURS_24: {
        if (heartState.count.full === 1) {
          await this.setStage(HeartRemoveStages.HOURS_8);
        }
        break;
      }

      case HeartRemoveStages.HOURS_8: {
        await this.setStage(HeartRemoveStages.HOURS_4);
        break;
      }

      case HeartRemoveStages.HOURS_4: {
        await this.setStage(HeartRemoveStages.HOURS_1);
        break;
      }

      case HeartRemoveStages.HOURS_1: {
        await this.setStage(HeartRemoveStages.MINUTES_10);
        break;
      }

      case HeartRemoveStages.MINUTES_10: {
        await this.setStage(HeartRemoveStages.END);
        break;
      }
    }
  }

  public async getHeartImage() {
    const heartState = await this.getHeartState();
    const images = this.settings.getHeartImages();

    const blankImage = sharp({
      create: {
        width: 500,
        height: 500,
        channels: 3,
        background: { r: 255, g: 255, b: 255 },
      },
    }).png();

    const fullHeartImg = await sharp(images.full).toBuffer();
    const emptyHeartImg = await sharp(images.empty).toBuffer();

    const heartPositionData = this.calculateHeartPositionData(heartState.count);

    const composite = heartPositionData.positions.map((position) => ({
      input: position.isEmpty ? emptyHeartImg : fullHeartImg,
      left: position.left,
      top: position.top,
    }));

    const heartImage = blankImage.composite(composite).toBuffer();

    return heartImage;
  }

  /*
   * Calculate heart positions on image.
   * By default, 5 hearts in row, img is 500x500px, 1 heart is 80x80px.
   */
  private calculateHeartPositionData(hearts: HeartCount): HeartPositionData {
    const heartInOneRow = 5;
    const heartRows = hearts.max / heartInOneRow;

    const positions: {
      top: number;
      left: number;
      isEmpty: boolean;
    }[] = [];

    let row = 0;

    for (let currentHeartIndex = 0; currentHeartIndex < hearts.max; currentHeartIndex++) {
      const heartInRowIndex = currentHeartIndex % 5;

      positions.push({
        top: 500 / 2 - this.settings.imageSize / 2 + this.settings.imageSize * row,
        left: 100 * heartInRowIndex,
        isEmpty: currentHeartIndex >= hearts.full,
      });

      if (heartInRowIndex === 4) row++; // If added last heart in row, set row to row++
    }

    // Adding offset: left is "margin" between each images, top is centering all hearts in vertical axis.
    const offsetPositions = positions.map((position) => ({
      ...position,
      left: Math.round(position.left + 10),
      top: Math.round(position.top - 40 * (heartRows - 1)),
    }));

    return {
      count: {
        max: hearts.max,
        full: hearts.full,
        empty: hearts.empty,
      },
      positions: offsetPositions,
    };
  }
}
