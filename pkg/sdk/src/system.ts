import {
  ISyscalls,
  Result,
  HandleResult,
  HandlePairResult,
  WriteResult,
  ReadResult,
  HandleDisposition,
  ReadEtcResult,
  Handle as RawHandle
} from '@fiber/types'

import NotInitialized from './errors'

export type IDispatchSyscall<T extends Result = Result> = (
  namespace: string,
  name: string,
  args: unknown[]
) => Promise<T>

// @staticImpl<ISyscalls>()
export class System {
  public static initialized: boolean

  private static syscall: IDispatchSyscall | undefined = undefined
  private static syscallInterface: ISyscalls | undefined = undefined
  private static useDirectCalls: boolean

  /**
   * Initializes a System that uses syscall dispatching.
   * @param syscall the dispatcher function
   */
  public static init(syscall: IDispatchSyscall) {
    this.syscall = syscall
    this.initialized = true
    this.useDirectCalls = false
  }

  /**
   * Initializes a System that can be used directly with a kernel without any call dispatching.
   * @param syscalls Object implementing ISyscalls interface
   */
  public static initDirect(syscalls: ISyscalls) {
    this.syscallInterface = syscalls
    this.initialized = true
    this.useDirectCalls = true
  }

  private static checkInit() {
    if (!this.initialized) {
      throw new NotInitialized()
    }
  }

  public static async handleDuplicate(handle: RawHandle) {
    this.checkInit()

    if (this.useDirectCalls === true) {
      const result = this.syscallInterface?.handleDuplicate(handle)
      return Promise.resolve(result)
    }

    return this.syscall('handle', 'duplicate', [handle]) as Promise<HandleResult>
  }

  public static async handleReplace(handle: RawHandle, replacement: RawHandle) {
    this.checkInit()

    if (this.useDirectCalls === true) {
      const result = this.syscallInterface?.handleReplace(handle, replacement)
      return Promise.resolve(result)
    }

    return this.syscall('handle', 'replace', [handle, replacement]) as Promise<HandleResult>
  }

  public static async handleClose(handle: RawHandle): Promise<Result> {
    this.checkInit()

    if (this.useDirectCalls === true) {
      const result = this.syscallInterface?.handleClose(handle)
      return Promise.resolve(result)
    }

    return this.syscall('handle', 'close', [handle]) as Promise<Result>
  }

  public static async channelCreate() {
    this.checkInit()

    if (this.useDirectCalls === true) {
      const result = this.syscallInterface?.channelCreate()
      return Promise.resolve(result)
    }

    return this.syscall('channel', 'create', []) as Promise<HandlePairResult>
  }

  public static async channelWrite(channel: RawHandle, data: Uint8Array, handles: RawHandle[]) {
    this.checkInit()

    if (this.useDirectCalls === true) {
      const result = this.syscallInterface?.channelWrite(channel, data, handles)
      return Promise.resolve(result)
    }

    return this.syscall('channel', 'write', [channel, data, handles]) as Promise<WriteResult>
  }

  public static async channelWriteEtc(channel: RawHandle, data: Uint8Array, dispositions: HandleDisposition[]) {
    this.checkInit()

    if (this.useDirectCalls === true) {
      const result = this.syscallInterface?.channelWriteEtc(channel, data, dispositions)
      return Promise.resolve(result)
    }

    return this.syscall('channel', 'write_etc', [channel, data, dispositions]) as Promise<WriteResult>
  }

  public static async channelRead(channel: RawHandle) {
    this.checkInit()

    if (this.useDirectCalls === true) {
      const result = this.syscallInterface?.channelRead(channel)
      return Promise.resolve(result)
    }

    return this.syscall('channel', 'read', [channel]) as Promise<ReadResult>
  }

  public static async channelReadEtc(channel: RawHandle) {
    this.checkInit()

    if (this.useDirectCalls === true) {
      const result = this.syscallInterface?.channelReadEtc(channel)
      return Promise.resolve(result)
    }

    return this.syscall('channel', 'read_etc', [channel]) as Promise<ReadEtcResult>
  }
}
