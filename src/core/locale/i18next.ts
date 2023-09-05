import i18next from "i18next";

import buttons from "@locales/ru/buttons.json";
import info from "@locales/ru/info.json";
import errors from "@locales/ru/errors.json";
import logic from "@locales/ru/logic.json";

export const defaultNS = "info";

void i18next.init({
  lng: "ru",
  defaultNS,
  resources: {
    ru: {
      buttons: buttons,
      info: info,
      errors: errors,
      logic: logic,
    },
  },
});

const Localization = i18next;

export default Localization;
