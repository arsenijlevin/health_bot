import { CommandsContext } from "@context/commands.context";
import Command from "@abstract/command.class";
import { inject, injectable } from "inversify";
import TYPES from "@container/types";
import IHeartsService from "@hearts/hearts.interface";

@injectable()
export default class ResetHeartsCommand extends Command {
  constructor(@inject(TYPES.IHeartService) private readonly heartService: IHeartsService) {
    super("reset");
  }

  public async handle(ctx: CommandsContext): Promise<void> {
    this.heartService.resetHeartState();

    const heartImageBuffer = await this.heartService.getHeartImage();

    await ctx.setChatPhoto({
      source: heartImageBuffer,
      filename: "currentChannelHearts.jpg",
    });
  }
}
