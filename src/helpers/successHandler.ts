import { ResponseStatusEnum } from "../types/response.type";

// This function formates the response body
const successHandler = (data: any, message?: string) => {
  return {
    status: ResponseStatusEnum.SUCCESS,
    data,
    message: message ?? "Success",
  };
};

export default successHandler;
