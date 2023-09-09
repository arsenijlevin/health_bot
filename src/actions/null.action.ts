import Action from "@abstract/actions.abstract";
import { ActionsContext } from "@context/actions.context";

export default class NullAction extends Action {
  constructor() {
    super("null");
  }

  public async handle(ctx: ActionsContext): Promise<void> {
    await ctx.answerCbQuery(undefined);
  }
}
