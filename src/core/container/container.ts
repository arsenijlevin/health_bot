import "reflect-metadata";
import TYPES from "./types";

import { Container } from "inversify";

import Action from "@abstract/actions.abstract";

import IConfigService from "@config/config.interface";
import ConfigService from "@config/config.service";

import Bot from "../bot";

import Trigger from "@abstract/trigger.abstract";

import ChannelPost from "@abstract/triggers/channel-post.abstract";
import ChannelPostTrigger from "@triggers/channel-post.trigger";

import NullAction from "@actions/null.action";

import JSONStorage from "@core/storage/local/json.storage";
import IHeartsService from "@hearts/hearts.interface";
import HeartsService from "@hearts/hearts.service";
import HeartSettings from "../../settings/hearts.settings";
import PostsHandler from "@posts/posts.handler";
import HeartTimeout from "@timeout/heart.timeout";
import AnyPost from "@triggers/channel-post/post";
import ParsedBotSettings from "../../settings/parser.settings";

const container = new Container({
  autoBindInjectable: true,
  skipBaseClassChecks: true,
  defaultScope: "Singleton",
});

container.bind<Action>(TYPES.Action).to(NullAction);

container.bind<ChannelPost>(TYPES.ChannelPost).to(AnyPost);

container.bind<Trigger>(TYPES.Trigger).to(ChannelPostTrigger);

container.bind<IConfigService>(TYPES.IConfigService).to(ConfigService);
container.bind<JSONStorage>(TYPES.JSONStorage).to(JSONStorage);
container.bind<IHeartsService>(TYPES.IHeartService).to(HeartsService);

container.bind<HeartSettings>(TYPES.HeartSettings).to(HeartSettings);
container.bind<PostsHandler>(TYPES.PostsHandler).to(PostsHandler);
container.bind<HeartTimeout>(TYPES.HeartTimeout).to(HeartTimeout);

container.bind<ParsedBotSettings>(TYPES.ParsedBotSettings).to(ParsedBotSettings);

container.bind<Bot>(TYPES.Bot).to(Bot);
export { container };
