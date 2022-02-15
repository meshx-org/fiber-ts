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
import { staticImpl } from './utils'

export type IDispatchSyscall = (
  namespace: string,
  name: string,
  args: unknown[]
) => Result | ReadResult | ReadEtcResult | WriteResult | HandleResult | HandlePairResult

@staticImpl<ISyscalls>()
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

  public static handleDuplicate(handle: RawHandle): HandleResult {
    this.checkInit()

    if (this.useDirectCalls === true) {
      return this.syscallInterface?.handleDuplicate(handle)
    }

    return this.syscall('handle', 'duplicate', [handle]) as HandleResult
  }

  public static handleReplace(handle: RawHandle, replacement: RawHandle): HandleResult {
    this.checkInit()

    if (this.useDirectCalls === true) {
      return this.syscallInterface?.handleReplace(handle, replacement)
    }

    return this.syscall('handle', 'replace', [handle, replacement]) as HandleResult
  }

  public static handleClose(handle: RawHandle): Result {
    this.checkInit()

    if (this.useDirectCalls === true) {
      return this.syscallInterface?.handleClose(handle)
    }

    return this.syscall('handle', 'close', [handle]) as Result
  }

  public static channelCreate(): HandlePairResult {
    this.checkInit()

    if (this.useDirectCalls === true) {
      return this.syscallInterface?.channelCreate()
    }

    return this.syscall('channel', 'create', []) as HandlePairResult
  }

  public static channelWrite(channel: RawHandle, data: Uint8Array, handles: RawHandle[]): WriteResult {
    this.checkInit()

    if (this.useDirectCalls === true) {
      return this.syscallInterface?.channelWrite(channel, data, handles)
    }

    return this.syscall('channel', 'write', [channel, data, handles]) as WriteResult
  }

  public static channelWriteEtc(channel: RawHandle, data: Uint8Array, dispositions: HandleDisposition[]): WriteResult {
    this.checkInit()

    if (this.useDirectCalls === true) {
      return this.syscallInterface?.channelWriteEtc(channel, data, dispositions)
    }

    return this.syscall('channel', 'write_etc', [channel, data, dispositions]) as WriteResult
  }

  public static channelRead(channel: RawHandle): ReadResult {
    this.checkInit()

    if (this.useDirectCalls === true) {
      return this.syscallInterface?.channelRead(channel)
    }

    return this.syscall('channel', 'read', [channel]) as ReadResult
  }

  public static channelReadEtc(channel: RawHandle): ReadEtcResult {
    this.checkInit()

    if (this.useDirectCalls === true) {
      return this.syscallInterface?.channelReadEtc(channel)
    }

    return this.syscall('channel', 'read_etc', [channel]) as ReadEtcResult
  }
}
