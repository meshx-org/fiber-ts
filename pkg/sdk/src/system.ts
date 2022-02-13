import {
  ISyscalls,
  Status,
  HandleResult,
  HandlePairResult,
  WriteResult,
  ReadResult,
  HandleTransfer,
  ReadEtcResult,
  Handle as RawHandle,
  INVALID_HANDLE
} from '@fiber/types'

import { NotInitialized } from './errors'
import { staticImpl } from './utils'

/// Users of the [Result] subclasses should check the status before
/// trying to read any data. Attempting to use a value stored in a result
/// when the status in not OK will result in an exception.
export interface Result {
  status: number
  toString(): string
}

export type IDispatchSyscall = (namespace: string, name: string, args: any[]) => void

export function setSystem(sys: typeof System) {}

// @staticImpl<ISyscalls>()
export class System {
  private constructor() {}

  static _syscall: IDispatchSyscall | undefined

  static init(syscall: IDispatchSyscall) {
    this._syscall = syscall
  }

  private static get syscall(): IDispatchSyscall {
    if (!this._syscall) throw new NotInitialized()
    else return this._syscall
  }

  public static handleDuplicate(handle: RawHandle): HandleResult {
    // this.syscall('handle', 'duplicate', [handle])
    return { handle: INVALID_HANDLE, status: 0 }
  }

  public static handleReplace(handle: RawHandle, replacement: RawHandle): HandleResult {
    return { handle: INVALID_HANDLE, status: 0 }
  }

  public static handleClose(handle: RawHandle): void {
    // this.syscall('handle', 'close', [handle])
  }

  public static channelCreate(): HandlePairResult {
    return { status: Status.OK, first: INVALID_HANDLE, second: INVALID_HANDLE }
  }

  public static channelWrite(channel: RawHandle, data: Uint8Array, handles: RawHandle[]): WriteResult {
    return { status: Status.OK, numBytes: 0 }
  }

  public static channelWriteEtc(channel: RawHandle, data: Uint8Array, handleTransfers: HandleTransfer[]): WriteResult {
    return { status: Status.OK, numBytes: 0 }
  }

  public static channelRead(channel: RawHandle): ReadResult {
    return { status: Status.OK, numBytes: 0, bytes: new Uint8Array(0), handles: [] }
  }

  public static channelReadEtc(channel: RawHandle): ReadEtcResult {
    return { status: Status.OK, numBytes: 0, bytes: new Uint8Array(0), handleInfos: [] }
  }
}

// @staticImpl<ISyscalls>()
export class KernelSystem {
  private constructor() {}

  private static _kernel: ISyscalls

  public static init(kernel: ISyscalls) {
    this._kernel = kernel
  }

  private static get kernel(): ISyscalls {
    if (!this._kernel) throw new NotInitialized()
    else return this._kernel
  }

  public static handleDuplicate(handle: RawHandle): HandleResult {
    return this.kernel.handleDuplicate(handle)
  }

  public static handleReplace(handle: RawHandle, replacement: RawHandle): HandleResult {
    return { handle: INVALID_HANDLE, status: 0 }
  }

  public static handleClose(handle: RawHandle): void {}
}
