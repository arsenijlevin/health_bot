import Trigger from "@abstract/trigger.abstract";
import { ChannelPostContext } from "@context/channel-post.context";
import { injectable, multiInject } from "inversify";
import TYPES from "@container/types";
import ChannelPost from "@abstract/triggers/channel-post.abstract";

@injectable()
export default class ChannelPostTrigger extends Trigger {
  constructor(
    @multiInject(TYPES.ChannelPost) private readonly channelPosts: ChannelPost[]
      ) {
    super("channel_post");
  }

  public async handle(ctx: ChannelPostContext): Promise<void> {
    await Promise.all(
      this.channelPosts.map(async (message) => {
        await message.handle(ctx);
      })
    );
  }
}
