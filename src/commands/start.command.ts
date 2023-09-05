import { CommandsContext } from "@context/commands.context";
import { Command } from "@abstract/command.class";
import { inject, injectable } from "inversify";
import Localization from "@core/locale/i18next";
import TYPES from "@container/types";
import JSONStorage from "@core/storage/local/local.storage";

@injectable()
export class StartCommand extends Command {
  constructor(@inject(TYPES.JSONStorage) private readonly storage: JSONStorage) {
    super("start");
  }

  public async handle(ctx: CommandsContext): Promise<void> {
    await this.handleUserStart(ctx);
  }

  private async handleUserStart(ctx: CommandsContext): Promise<void> {
    await ctx.reply(Localization.t("info:key"));

    await this.storage.setItem("123", 5);

    console.log(await this.storage.getItem("123"));
  }
}
