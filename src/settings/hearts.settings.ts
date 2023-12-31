import { IHeartsSettings } from "@core/bot";
import { injectable } from "inversify";
import { DateTime } from "luxon";

// Minutes
export const enum HeartRemoveStages {
  HOURS_24,
  HOURS_8,
  HOURS_4,
  HOURS_1,
  MINUTES_10,
  END,
}

export interface HeartState {
  count: HeartCount;
  heartRemove: {
    stage: HeartRemoveStages;
    lastDateISO: string;
  };
}

export interface HeartCount {
  max: number;
  full: number;
  empty: number;
}

export interface HeartImages {
  full: string;
  empty: string;
}

@injectable()
export default class HeartSettings {
  public readonly heartStateKey = "hearts";
  public readonly imageSize = 80;

  private heartInitState: HeartState = {
    count: {
      max: 5,
      full: 5,
      empty: 0,
    },
    heartRemove: {
      lastDateISO: DateTime.now().toISO() ?? "",
      stage: HeartRemoveStages.HOURS_24,
    },
  };

  private heartImages: HeartImages = {
    full: "",
    empty: "",
  };

  public setSettings(settings: IHeartsSettings) {
    this.setInitState({
      ...this.getHeartInitState(),
      count: {
        empty: 0,
        max: settings.hearts,
        full: settings.hearts,
      },
    });

    this.setHeartImages({
      full: settings.fullHeartImage,
      empty: settings.emptyHeartImage,
    });
  }

  public setInitState(heartInitState: HeartState) {
    this.heartInitState = heartInitState;
  }

  public setHeartImages(heartImages: HeartImages) {
    this.heartImages = heartImages;
  }

  public getHeartInitState(): HeartState {
    return this.heartInitState;
  }

  public getHeartImages(): HeartImages {
    return this.heartImages;
  }
}
