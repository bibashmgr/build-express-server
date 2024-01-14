// cosntants
import { responseStatusTypes } from "../constants/schemas";

// This function formates the response body
const successHandler = (data: any, message?: string) => {
  return {
    status: responseStatusTypes.SUCCESS,
    data,
    message: message || "",
  };
};

export default successHandler;
