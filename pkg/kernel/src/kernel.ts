import {
  HandleResult,
  ISyscalls,
  Handle as RawHandle,
  INVALID_HANDLE,
  Result,
  HandleDisposition,
  HandlePairResult,
  WriteResult,
  ReadResult,
  ReadEtcResult,
  Status
} from '@fiber/types'

interface ILogger {
  log: (...args: unknown[]) => void
}

export class Kernel implements ISyscalls {
  readonly #klog: ILogger

  constructor() {
    this.#klog = {
      log: (...args: unknown[]) => console.log('[syscall]:', ...args)
    }
  }

  public handleDuplicate(handle: RawHandle): HandleResult {
    this.#klog.log('handleDuplicate', handle)
    return { status: Status.OK, handle: INVALID_HANDLE }
  }

  public handleReplace(handle: RawHandle, replacement: RawHandle): HandleResult {
    this.#klog.log('handleReplace', handle, replacement)
    return { status: Status.OK, handle: INVALID_HANDLE }
  }

  public handleClose(handle: RawHandle): Result {
    this.#klog.log('handleClose', handle)
    return { status: Status.OK }
  }

  public channelCreate(): HandlePairResult {
    this.#klog.log('channelCreate')
    return { status: Status.OK, first: INVALID_HANDLE, second: INVALID_HANDLE }
  }

  public channelWrite(channel: RawHandle, data: Uint8Array, handles: RawHandle[]): WriteResult {
    this.#klog.log('channelWrite', channel, data, handles)
    return { status: Status.OK, numBytes: 0 }
  }

  public channelWriteEtc(channel: RawHandle, data: Uint8Array, handleDispositions: HandleDisposition[]): WriteResult {
    this.#klog.log('channelWriteEtc', channel, data, handleDispositions)
    return { status: Status.OK, numBytes: 0 }
  }

  public channelRead(channel: RawHandle): ReadResult {
    this.#klog.log('channelRead', channel)
    return { status: Status.OK, numBytes: 0, bytes: new Uint8Array(0), handles: [] }
  }

  public channelReadEtc(channel: RawHandle): ReadEtcResult {
    this.#klog.log('channelReadEtc', channel)
    return { status: Status.OK, numBytes: 0, bytes: new Uint8Array(0), handleInfos: [] }
  }
}
