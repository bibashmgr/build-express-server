import { format } from "date-fns";
import Handlebars from "handlebars";

const defaultFormatString = "dd MMM, yyyy";

Handlebars.registerHelper(
  "ifEq",
  function (this: any, a: any, b: any, options: Handlebars.HelperOptions) {
    if (a === b) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  }
);

Handlebars.registerHelper("inc", function (value) {
  return parseInt(value) + 1;
});

Handlebars.registerHelper(
  "currentDate",
  function (formatString = defaultFormatString) {
    const now = new Date();
    try {
      return format(now, formatString);
    } catch {
      return format(now, defaultFormatString);
    }
  }
);

export default Handlebars;
