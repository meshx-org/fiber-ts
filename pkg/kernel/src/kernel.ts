import { HandleResult, ISyscalls, Handle, INVALID_HANDLE } from "@fiber/types"

export class Kernel implements ISyscalls {
  readonly #klog: Console

  constructor() {
    this.#klog = console
  }

  public handleDuplicate(handle: Handle): HandleResult {
    this.#klog.log("handleDuplicate", handle)
    return { handle: INVALID_HANDLE, status: 0 }
  }

  public handleReplace(handle: Handle, replacement: Handle): HandleResult {
    this.#klog.log("handleReplace", handle, replacement)
    return { handle: INVALID_HANDLE, status: 0 }
  }

  public handleClose(handle: Handle): void {
    this.#klog.log("handleClose", handle)
  }

  public wait() {}
}
