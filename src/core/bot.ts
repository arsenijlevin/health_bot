import { Telegraf } from "telegraf";
import Command from "@abstract/command.class";
import Action from "@abstract/actions.class";
import IConfigService from "@config/config.interface";
import { inject, injectable, multiInject } from "inversify";
import TYPES from "@container/types";
import Trigger from "@abstract/trigger.class";
import Localization from "@core/locale/i18next";
import JSONStorage from "@core/storage/local/local.storage";
import IHeartsService from "@hearts/hearts.interface";

export interface BotSettings {
  hearts: number;
  fullHeartImage: string;
  emptyHeartImage: string;
}

@injectable()
export default class Bot {
  private bot: Telegraf;

  constructor(
    @inject(TYPES.IConfigService)
    private readonly configService: IConfigService,
    @inject(TYPES.JSONStorage) private readonly storage: JSONStorage,
    @multiInject(TYPES.Action) private readonly actions: Action[],
    @multiInject(TYPES.Command) private readonly commands: Command[],
    @multiInject(TYPES.Trigger) private readonly triggers: Trigger[],
    @inject(TYPES.IHeartService) private readonly heartService: IHeartsService
  ) {
    this.bot = new Telegraf(this.configService.getBotToken());
  }

  public async start(settings: BotSettings): Promise<void> {
    await this.initStorage();
    await this.heartService.initHearts(settings);

    this.initCommands();
    this.initActions();
    this.initOnTriggers();

    /**
     * Bot.launch does not resolve a promise.
     * .then(...) or `await` won't work.
     * https://github.com/telegraf/telegraf/issues/1749#issuecomment-1326816944
     */
    void this.bot.launch();

    await this.printBotStatus();
  }

  public getBotContext() {
    return this.bot;
  }

  private initCommands(): void {
    for (const command of this.commands) {
      this.bot.command(command.triggerText, (ctx) => command.handle(ctx));
    }

    console.log(Localization.t("info:commandsInitializedSuccessful", { count: this.commands.length }));
  }

  private initActions(): void {
    for (const action of this.actions) {
      this.bot.action(action.triggerText, async (ctx) => {
        await ctx.answerCbQuery();
        await action.handle(ctx);
      });
    }

    console.log(Localization.t("info:actionsInitializedSuccessful", { count: this.actions.length }));
  }

  private initOnTriggers(): void {
    for (const trigger of this.triggers) {
      this.bot.on(trigger.triggerText, (ctx) => trigger.handle(ctx));
    }

    console.log(Localization.t("info:triggersInitializedSuccessful", { count: this.triggers.length }));
  }

  private async initStorage(): Promise<void> {
    await this.storage.init();
  }

  private async printBotStatus(): Promise<void> {
    const isBotStarted = await this.isBotStarted();

    if (isBotStarted) {
      console.log(Localization.t("info:botStartSuccessful"));
    } else {
      console.error(Localization.t("errors:botStartFailed"));
    }
  }

  private async isBotStarted(): Promise<boolean> {
    const getMe = await this.bot.telegram.getMe();

    return !!getMe;
  }
}
