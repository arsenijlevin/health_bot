import { Action } from "@abstract/actions.class";
import { ActionsContext } from "@context/actions.context";

export class NullAction extends Action {
  constructor() {
    super("null");
  }

  public async handle(ctx: ActionsContext): Promise<void> {
    await ctx.answerCbQuery(undefined);
  }
}
