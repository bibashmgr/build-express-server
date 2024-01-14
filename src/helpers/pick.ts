interface IObject {
  [key: string]: any;
}

export const pick = (object: IObject, keys: string[]) => {
  return keys.reduce((obj: IObject, key: string) => {
    if (object && Object.prototype.hasOwnProperty.call(object, key)) {
      obj[key] = object[key];
    }
    return obj;
  }, {});
};
