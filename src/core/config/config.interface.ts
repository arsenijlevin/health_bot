export interface IConfigService {
  get(key: string): string;
  getBotToken(): string;
}
