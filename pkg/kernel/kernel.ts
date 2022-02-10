import { HandleResult, ISyscalls } from './sycalls';

interface ILogger { 
  log(...data: any[]): void;
}

export class Kernel implements ISyscalls {
  readonly #klog: ILogger

  constructor() {
    this.#klog = console
  }

  public handleDuplicate(handle: Handle): HandleResult {
    this.#klog.log('handleDuplicate', handle)
    return { handle: undefined, status: 0 };
  }
  
  public handleReplace(handle: Handle, replacement: Handle): HandleResult {
    this.#klog.log('handleReplace', handle, replacement)
    return { handle: undefined, status: 0 };
  }
  
  public handleClose(handle: Handle): void {
    this.#klog.log('handleClose', handle)
  }
  
  public wait() { }
}

export { }