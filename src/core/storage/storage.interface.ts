export default interface Storage {
  init: (options?: Record<string, unknown>) => void;
  setItem: (key: string, value: unknown) => void;
  getItem: (key: string) => unknown;
}
