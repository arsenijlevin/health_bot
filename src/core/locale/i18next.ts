import i18next from "i18next";

import info from "@locales/ru/info.json";
import errors from "@locales/ru/errors.json";
import logic from "@locales/ru/logic.json";

export const defaultNS = "info";

void i18next.init({
  lng: "ru",
  defaultNS,
  resources: {
    ru: {
      info: info,
      errors: errors,
      logic: logic,
    },
  },
});

i18next.services.formatter?.add(
  "display-hearts",
  (
    value: string,
    lng,
    options: {
      value: string;
      fullHearts: number;
      emptyHearts: number;
    }
  ) => {
    const fullHearts = "❤️".repeat(options.fullHearts);
    const emptyHearts = "🖤".repeat(options.emptyHearts);

    return `${fullHearts}${emptyHearts}`;
  }
);

const Localization = i18next;

export default Localization;
