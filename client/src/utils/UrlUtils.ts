import { parse } from 'qs';

export function isNumeric(value: string | number) {
  if (typeof value === 'number') {
    return true;
  }
  return /^[-]?([1-9]\d*|0)(\.\d+)?$/.test(value);
}

function isIsoDate(str: string) {
  if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(str)) return false;
  const d = new Date(str);
  return d.toISOString() === str;
}

export const parseSearch = <T extends object>(search: string): T => {
  console.log(search.replace('?', ''), 'search');
  return parse(search.replace('?', ''), {
    allowDots: true,
    decoder: (
      str: string,
      defaultDecoder: (str: string, decoder?: any, charset?: string) => string
    ) => {
      if (isNumeric(str)) {
        return parseFloat(str);
      } else if (str === 'true') {
        return true;
      } else if (str === 'false') {
        return false;
      } else if (isIsoDate(unescape(str))) {
        return new Date(unescape(str));
      } else {
        return defaultDecoder(str);
      }
    },
    parseArrays: true,
    comma: true,
  }) as T;
};
