import Bot from "@core/bot";
import TYPES from "@container/types";
import { container } from "@container/container";

const bot = container.get<Bot>(TYPES.Bot);

void bot.start();
