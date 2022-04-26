import { stringify } from 'qs';

export class HttpUtils {
  static serializeParams<T extends object>(state: T): string {
    const params = stringify(state, {
      skipNulls: true,
      serializeDate: (date: Date) => date.toISOString(),
      allowDots: true,
      encode: false,
    });
    return `${params ? '?' : ''}${params}`;
  }
}
