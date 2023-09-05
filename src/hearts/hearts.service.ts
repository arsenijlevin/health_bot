import TYPES from "@container/types";
import JSONStorage from "@core/storage/local/local.storage";
import { inject } from "inversify";
import IHeartsService from "src/hearts/hearts.interface";

interface HeartState {
  count: number;
  lastHeartRemoveDate: number;
}

export default class HeartsService implements IHeartsService {
  private readonly heartStateKey = "hearts";
  private readonly heartInitState: HeartState = {
    count: 5,
    lastHeartRemoveDate: 123,
  };

  constructor(@inject(TYPES.JSONStorage) private readonly storage: JSONStorage) {}

  public async removeHearts(count = 1) {
    const heartState = await this.getHeartState();
    const newHeartState: HeartState = {
      ...heartState,
      count: heartState.count - count,
    };

    await this.updateHeartState(newHeartState);
  }

  public async restoreHearts(count = 1) {
    const heartState = await this.getHeartState();
    const newHeartState: HeartState = {
      ...heartState,
      count: heartState.count + count,
    };

    await this.updateHeartState(newHeartState);
  }

  public async resetHeartState() {
    await this.storage.setItem(this.heartStateKey, this.heartInitState);
  }

  public getHeartImagePath() {
    return "";
  }

  private async getHeartState(): Promise<HeartState> {
    return this.storage.getItem(this.heartStateKey);
  }

  private async updateHeartState(heartState: HeartState) {
    return this.storage.updateItem(this.heartStateKey, heartState);
  }
}
