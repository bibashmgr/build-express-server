import { format } from "date-fns";
import Handlebars from "handlebars";

const defaultFormatString = "dd MMM, yyyy";

Handlebars.registerHelper(
  "currentDate",
  function (formatString: string = defaultFormatString) {
    const now = new Date();
    try {
      return format(now, formatString);
    } catch {
      return format(now, defaultFormatString);
    }
  }
);

export default Handlebars;
