import Bot, { BotSettings } from "@core/bot";
import TYPES from "@container/types";
import { container } from "@container/container";

const botSettings: BotSettings = {
  hearts: 5,
  fullHeartImage: "assets/img/full-heart.png",
  emptyHeartImage: "assets/img/empty-heart.png",
};

const bot = container.get<Bot>(TYPES.Bot);

void bot.start(botSettings);
