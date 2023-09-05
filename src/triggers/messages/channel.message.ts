import { Message } from "@abstract/triggers/message.class";
import { MessagesContext } from "@context/message.context";
import Localization from "@core/locale/i18next";
import joinImages from "join-images";
import sharp from "sharp";

export class ChannelMessage extends Message {
  constructor() {
    super();
  }

  public async handle(ctx: MessagesContext) {
    if (ctx.from.is_bot) return;

    if (ctx.chat.type !== "group") return;

    await ctx.reply(Localization.t("logic:loseHPWithLastWarning"));

    const img = sharp({
      create: {
        width: 500,
        height: 500,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 1 },
      },
    }).png();
    if (!img) return;

    

    img.composite([
      {
        input: "assets/img/full-heart.jpg",
        left: 0,
        top: 250 - 75,
      },
      {
        input: "assets/img/full-heart.jpg",
        left: 160,
        top: 250 - 75,
      },
      {
        input: "assets/img/full-heart.jpg",
        left: 320,
        top: 250 - 75,
      },
    ]);

    img.toBuffer((err, buffer, _) => {
      void ctx.setChatPhoto({
        source: buffer,
        filename: "processed.jpg",
      });
    });

    // await ctx.setChatPhoto({
    //   source: fs.readFileSync("../assets/img/processed.jpg"),
    //   filename: "processed.jpg",
    // });
  }
}
