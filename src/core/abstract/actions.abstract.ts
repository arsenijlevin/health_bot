import { ActionsContext } from "@context/actions.context";
import { injectable } from "inversify";

@injectable()
export default abstract class Action {
  constructor(public triggerText: string | RegExp) {}

  public abstract handle(ctx: ActionsContext): Promise<void>;
}
