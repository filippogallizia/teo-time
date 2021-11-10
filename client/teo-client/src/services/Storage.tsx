class LocalStorageManager {
  public setItem = (key: string, value: any): void => {
    const stringValue = JSON.stringify(value);
    window.localStorage.setItem(key, stringValue);
  };

  public getItem = (key: string): any => {
    const item = window.localStorage.getItem(key);
    if (item != null) {
      return JSON.parse(item);
    }
    return null;
  };

  public removeItem = (key: string): void => {
    window.localStorage.removeItem(key);
  };

  public clearSession = (): void => {
    window.localStorage.clear();
    window.sessionStorage.clear();
    // eslint-disable-next-line no-restricted-globals
    location.reload();
  };
}

export default new LocalStorageManager();
