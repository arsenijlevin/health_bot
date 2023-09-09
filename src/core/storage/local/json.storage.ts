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
    return this.localStorage?.getItem(key) as Promise<T>;
  }

  public async updateItem(key: string, value: unknown) {
    return this.localStorage?.updateItem(key, value);
  }

  public async setChatId(id: number) {
    await this.setItem("chatId", id)
  }

  public async getChatId() {
    const chatId = this.getItem<number>("chatId");

    return chatId;
  }
}
