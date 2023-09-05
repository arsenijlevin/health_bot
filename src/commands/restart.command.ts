import { CommandsContext } from "@context/commands.context";
import { Command } from "@abstract/command.class";
import { injectable } from "inversify";
import { Markup } from "telegraf";
import Localization from "@core/locale/i18next";

@injectable()
export class RestartCommand extends Command {
  constructor() {
    super("restart");
  }

  public async handle(ctx: CommandsContext): Promise<void> {
    await ctx.reply(Localization.t("info:restart"), {
      reply_markup: Markup.removeKeyboard().reply_markup,
      parse_mode: "HTML",
    });
  }
}
