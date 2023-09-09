import { ChannelPostContext } from "@context/channel-post.context";
import { injectable } from "inversify";

@injectable()
export default abstract class ChannelPost {
  public abstract handle(ctx: ChannelPostContext): Promise<void> | void;
}
