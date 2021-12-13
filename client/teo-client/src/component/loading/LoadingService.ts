export type OnEmit = (loading: boolean) => void;

/**
 *
 * Simple Service to show/hide the loading
 *
 */
class LoadingService {
  private readonly events: OnEmit[] = [];

  protected emit(loading: boolean): void {
    if (this.events && this.events.length) {
      this.events.forEach((cb: OnEmit) => {
        cb(loading);
      });
    }
  }

  public addListener(cb: (loading: boolean) => void) {
    this.events.push(cb);

    return {
      removeEventListener: () => {
        const index: number = this.events.findIndex((fn: OnEmit) => fn === cb);

        if (index > -1) {
          this.events.splice(index, 1);
        }
      },
    };
  }

  public show() {
    this.emit(true);
  }

  public hide() {
    this.emit(false);
  }
}
export default new LoadingService();
