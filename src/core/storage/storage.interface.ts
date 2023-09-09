export default interface Storage {
  init: (options?: Record<string, unknown>) => Promise<void>;
  setItem: (key: string, value: unknown) => Promise<void>;
  getItem: (key: string) => Promise<unknown>;
  getChatId: () => Promise<number>;
  setChatId: (id: number) => Promise<void>;
}
