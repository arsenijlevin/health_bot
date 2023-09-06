import "reflect-metadata";
import TYPES from "./types";

import { Container } from "inversify";

import Action from "@abstract/actions.class";
import Command from "@abstract/command.class";

import StartCommand from "@commands/start.command";
import RestartCommand from "@commands/restart.command";

import IConfigService from "@config/config.interface";
import ConfigService from "@config/config.service";

import Bot from "../bot";

import Trigger from "@abstract/trigger.class";

import Message from "@abstract/triggers/message.class";
import MessageTrigger from "@triggers/message.trigger";

import NullAction from "@actions/null.action";
import ChannelMessage from "@triggers/messages/channel.message";

import JSONStorage from "@core/storage/local/local.storage";
import IHeartsService from "@hearts/hearts.interface";
import HeartsService from "@hearts/hearts.service";
import HeartSettings from "@hearts/hearts.settings";
import ResetHeartsCommand from "@commands/reset-hearts.command";

const container = new Container({
  autoBindInjectable: true,
  skipBaseClassChecks: true,
  defaultScope: "Singleton",
});

container.bind<Action>(TYPES.Action).to(NullAction);

container.bind<Command>(TYPES.Command).to(StartCommand);
container.bind<Command>(TYPES.Command).to(RestartCommand);
container.bind<Command>(TYPES.Command).to(ResetHeartsCommand);

container.bind<Message>(TYPES.Message).to(ChannelMessage);

container.bind<Trigger>(TYPES.Trigger).to(MessageTrigger);

container.bind<IConfigService>(TYPES.IConfigService).to(ConfigService);
container.bind<JSONStorage>(TYPES.JSONStorage).to(JSONStorage);
container.bind<IHeartsService>(TYPES.IHeartService).to(HeartsService);

container.bind<HeartSettings>(TYPES.HeartSettings).to(HeartSettings);

container.bind<Bot>(TYPES.Bot).to(Bot);
export { container };
