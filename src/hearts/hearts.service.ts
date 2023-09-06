import TYPES from "@container/types";
import { BotSettings } from "@core/bot";
import Localization from "@core/locale/i18next";
import JSONStorage from "@core/storage/local/local.storage";
import HeartSettings, { HeartCount, HeartState } from "@hearts/hearts.settings";
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

    this.setSettings(settings);

    if (!heartState) {
      await this.resetHeartState();
    }
  }

  public setSettings(settings: BotSettings) {
    this.settings.setInitState({
      ...this.settings.getHeartInitState(),
      count: {
        empty: 0,
        max: settings.hearts,
        full: settings.hearts,
      },
    });

    this.settings.setHeartImages({
      full: settings.fullHeartImage,
      empty: settings.emptyHeartImage,
    });
  }

  public async removeHearts(count = 1) {
    const heartState = await this.getHeartState();

    const fullHeartsAfter = heartState.count.full - count;
    const emptyHeartsAfter = heartState.count.empty + count;

    const newHeartState: HeartState = {
      ...heartState,
      count: {
        ...heartState.count,
        full: fullHeartsAfter >= 0 ? fullHeartsAfter : 0,
        empty: emptyHeartsAfter <= heartState.count.max ? emptyHeartsAfter : heartState.count.max,
      },
    };

    await this.updateHeartState(newHeartState);
  }

  public async addHearts(count = 1) {
    const heartState = await this.getHeartState();

    const fullHeartsAfter = heartState.count.empty + count;
    const emptyHeartsAfter = heartState.count.full - count;

    const newHeartState: HeartState = {
      ...heartState,
      count: {
        ...heartState.count,
        full: fullHeartsAfter <= heartState.count.max ? fullHeartsAfter : heartState.count.max,
        empty: emptyHeartsAfter >= 0 ? emptyHeartsAfter : 0,
      },
    };

    await this.updateHeartState(newHeartState);
  }

  public async getHeartCountMessage(): Promise<string> {
    const heartState = await this.getHeartState();

    let heartCountMessage = Localization.t("logic:loseHP");

    if (heartState.count.full === 2) {
      heartCountMessage = Localization.t("logic:loseHPWithWarning");
    }

    if (heartState.count.full === 1) {
      heartCountMessage = Localization.t("logic:loseHPWithLastWarning");
    }

    return heartCountMessage;
  }

  public async getHeartImage() {
    const heartState = await this.getHeartState();
    const images = this.settings.getHeartImages();

    const img = sharp({
      create: {
        width: 500,
        height: 500,
        channels: 3,
        background: { r: 255, g: 255, b: 255 },
      },
    }).png();

    const fullHeartImg = await sharp(images.full).toBuffer();
    const emptyHeartImg = await sharp(images.empty).toBuffer();

    console.log(heartState.count);

    const heartPositionData = this.calculateHeartPositionData(heartState.count);

    const composite = heartPositionData.positions.map((position) => ({
      input: position.isEmpty ? emptyHeartImg : fullHeartImg,
      left: position.left,
      top: position.top,
    }));

    return img.composite(composite).toBuffer();
  }

  private calculateHeartPositionData(hearts: HeartCount): HeartPositionData {
    const heartRows = hearts.max / 5;

    const positions: {
      top: number;
      left: number;
      isEmpty: boolean;
    }[] = [];

    let row = 0;

    for (let i = 0; i < hearts.max; i++) {
      const heartCount = i % 5;

      positions.push({
        top: 500 / 2 - this.settings.imageSize / 2 + this.settings.imageSize * row,
        left: 100 * heartCount,
        isEmpty: i >= hearts.full,
      });

      if (heartCount === 4) row++;
    }

    // offset

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
