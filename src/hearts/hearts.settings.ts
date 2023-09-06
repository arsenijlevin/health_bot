import { injectable } from "inversify";

export interface HeartState {
  count: HeartCount;
  lastHeartRemoveDate: number;
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
    lastHeartRemoveDate: 123,
  };

  private heartImages: HeartImages = {
    full: "",
    empty: "",
  };

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
