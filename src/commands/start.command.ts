import { CommandsContext } from "@context/commands.context";
import { Command } from "@abstract/command.class";
import { injectable } from "inversify";
import { SessionData } from "@context/bot.context";
import Localization from "@core/locale/i18next";

@injectable()
export class StartCommand extends Command {
  constructor() {
    super("start");
  }

  public async handle(ctx: CommandsContext): Promise<void> {
    if (!ctx.session?.id) {
      ctx.session = {} as SessionData;
      ctx.session.id = ctx.from.id;
    }
    await this.handleUserStart(ctx);
  }

  private async handleUserStart(ctx: CommandsContext): Promise<void> {
    await ctx.reply(Localization.t("info:key"));
  }
}
