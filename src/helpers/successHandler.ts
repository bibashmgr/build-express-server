import { ResponseStatusEnum } from "../types/response.type";

// This function formates the response body
const successHandler = (data: any, message?: string) => {
  return {
    data,
    message: message ?? "Success",
    status: ResponseStatusEnum.SUCCESS,
  };
};

export default successHandler;
