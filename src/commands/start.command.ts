import { CommandsContext } from "@context/commands.context";
import Command from "@abstract/command.class";
import { inject, injectable } from "inversify";
import TYPES from "@container/types";
import JSONStorage from "@core/storage/local/local.storage";

@injectable()
export default class StartCommand extends Command {
  constructor(@inject(TYPES.JSONStorage) private readonly storage: JSONStorage) {
    super("start");
  }

  public handle(ctx: CommandsContext) {
    this.handleUserStart(ctx);
  }

  private handleUserStart(_: CommandsContext) {
    return;
  }
}
