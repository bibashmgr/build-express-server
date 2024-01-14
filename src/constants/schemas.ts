export interface IDynamicObject {
  [key: string]: any;
}

export enum responseStatusTypes {
  SUCCESS = "success",
  FAILURE = "failure",
}

export enum tokenTypes {
  ACCESS = "access",
  REFRESH = "refresh",
}

export enum otpTypes {
  RESET_PASSWORD = "resetPassword",
  VERIFY_EMAIL = "verifyEmail",
}
