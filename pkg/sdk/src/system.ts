import { ISyscalls, HandleResult, INVALID_HANDLE } from "@fiber/types"

interface ISyscallResult {}

type ISyscall = (namespace: string, name: string, args: any[]) => ISyscallResult

export class System implements ISyscalls {
  private constructor() {}

  public static fromNative(call: ISyscall): System {
    return new System()
  }

  public static fromSyscall(call: ISyscall): System {
    return new System()
  }

  public static fromKernel(kernel: ISyscalls): System {
    return new System()
  }

  public handleDuplicate(handle: number): HandleResult {
    return { handle: INVALID_HANDLE, status: 0 }
  }

  public handleReplace(handle: number, replacement: number): HandleResult {
    return { handle: INVALID_HANDLE, status: 0 }
  }

  public handleClose(handle: number): void {}
}
