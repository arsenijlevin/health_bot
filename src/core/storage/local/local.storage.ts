import Storage from "@core/storage/storage.interface";
import { injectable } from "inversify";
import storage, { LocalStorage } from "node-persist";

@injectable()
export default class JSONStorage implements Storage {
  private localStorage: LocalStorage | undefined = undefined;

  public async init() {
    this.localStorage = storage;
    await this.localStorage.init();
  }

  public async setItem(key: string, value: unknown) {
    await this.localStorage?.setItem(key, value);
  }

  public async getItem<T>(key: string): Promise<T> {
    return (await this.localStorage?.getItem(key)) as T;
  }

  public async updateItem(key: string, value: unknown) {
    return this.localStorage?.updateItem(key, value);
  }
}
