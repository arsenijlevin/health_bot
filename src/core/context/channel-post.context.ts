import { Context, NarrowedContext } from "telegraf";
import { Message, Update } from "telegraf/types";

export type ChannelPostContext = NarrowedContext<Context<Update>, Update.ChannelPostUpdate<Message>>;
