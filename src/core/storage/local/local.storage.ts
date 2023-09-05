import Storage from "@core/storage/storage.interface";
import { injectable } from "inversify";
import storage from "node-persist";

@injectable()
export default class JSONStorage implements Storage {
  private localStorage;

  constructor() {
    this.localStorage = storage;
  }

  public async init() {
    await this.localStorage.init();
  }

  public async setItem(key: string, value: unknown) {
    await this.localStorage.setItem(key, value);
  }

  public async getItem<T>(key: string): Promise<T> {
    return (await this.localStorage.getItem(key)) as T;
  }

  public async updateItem(key: string, value: unknown) {
    return this.localStorage.updateItem(key, value);
  }
}
