export default interface IConfigService {
  get(key: string): string;
  getBotToken(): string;
}
