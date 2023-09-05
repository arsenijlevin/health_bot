import Localization from "@core/locale/i18next";
import { config, DotenvParseOutput } from "dotenv";
import { injectable } from "inversify";
import { IConfigService } from "./config.interface";

@injectable()
export class ConfigService implements IConfigService {
  private config: DotenvParseOutput;

  constructor() {
    const { error, parsed } = config();

    if (error) {
      throw new Error(Localization.t("errors:loadingFile", { file: ".env" }));
    }

    if (!parsed) {
      throw new Error(Localization.t("errors:emptyFile", { file: ".env" }));
    }

    this.config = parsed;
  }

  public get(key: string): string {
    const res = this.config[key];

    if (!res) {
      throw new Error(Localization.t("errors:missingEnvVariable", { env_var: key }));
    }

    return res;
  }

  public getBotToken(): string {
    return this.get("BOT_TOKEN");
  }
}
