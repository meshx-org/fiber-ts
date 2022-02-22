import {
  ISyscalls,
  Result,
  HandleResult,
  HandlePairResult,
  WriteResult,
  ReadResult,
  HandleDisposition,
  ReadEtcResult,
  Handle,
  Process,
  Channel,
  Realm
} from '@fiber/types'

import NotInitialized from './errors'

export type IDispatchSyscall<T extends Result = Result> = (
  namespace: string,
  name: string,
  args: unknown[]
) => Promise<T>

/// This class is used to dispatch syscalls directly or indirectly.
export class System {
  public static initialized = false

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
    if (this.initialized === false) throw new NotInitialized()
  }

  public static async handleDuplicate(handle: Handle) {
    this.checkInit()

    if (this.useDirectCalls === true) {
      const result = this.syscallInterface?.handleDuplicate(handle)
      return Promise.resolve(result)
    }

    return this.syscall('handle', 'duplicate', [handle]) as Promise<HandleResult>
  }

  public static async handleReplace(handle: Handle, replacement: Handle) {
    this.checkInit()

    if (this.useDirectCalls === true) {
      const result = this.syscallInterface?.handleReplace(handle, replacement)
      return Promise.resolve(result)
    }

    return this.syscall('handle', 'replace', [handle, replacement]) as Promise<HandleResult>
  }

  public static async handleClose(handle: Handle): Promise<Result> {
    this.checkInit()

    if (this.useDirectCalls === true) {
      const result = this.syscallInterface?.handleClose(handle)
      return Promise.resolve(result)
    }

    return this.syscall('handle', 'close', [handle]) as Promise<Result>
  }

  public static async realmCreate(parent: Realm): Promise<HandleResult> {
    this.checkInit()

    if (this.useDirectCalls === true) {
      const result = this.syscallInterface?.realmCreate(parent)
      return Promise.resolve(result)
    }

    return this.syscall('realm', 'create', [parent])
  }

  // TODO: replace program handle with Memory type
  public static async processCreate(parent: Realm, name: string, program: Handle): Promise<HandleResult> {
    this.checkInit()

    if (this.useDirectCalls === true) {
      const result = this.syscallInterface?.processCreate(parent, name, program)
      return Promise.resolve(result)
    }

    return this.syscall('process', 'create', [parent, name, program])
  }

  public static async processStart(process: Process, bootstrap: Channel): Promise<Result> {
    this.checkInit()

    if (this.useDirectCalls === true) {
      const result = this.syscallInterface?.processStart(process, bootstrap)
      return Promise.resolve(result)
    }

    return this.syscall('process', 'start', [process, bootstrap])
  }

  public static async channelCreate(process: Process) {
    this.checkInit()

    if (this.useDirectCalls === true) {
      // TODO: fix hardcoded handle
      const result = this.syscallInterface?.channelCreate(process)
      return Promise.resolve(result)
    }

    return this.syscall('channel', 'create', [process]) as Promise<HandlePairResult>
  }

  public static async channelWrite(channel: Channel, data: Uint8Array, handles: Handle[]) {
    this.checkInit()

    if (this.useDirectCalls === true) {
      const result = this.syscallInterface?.channelWrite(channel, data, handles)
      return Promise.resolve(result)
    }

    return this.syscall('channel', 'write', [channel, data, handles]) as Promise<WriteResult>
  }

  public static async channelWriteEtc(channel: Channel, data: Uint8Array, dispositions: HandleDisposition[]) {
    this.checkInit()

    if (this.useDirectCalls === true) {
      const result = this.syscallInterface?.channelWriteEtc(channel, data, dispositions)
      return Promise.resolve(result)
    }

    return this.syscall('channel', 'write_etc', [channel, data, dispositions]) as Promise<WriteResult>
  }

  public static async channelRead(channel: Channel) {
    this.checkInit()

    if (this.useDirectCalls === true) {
      const result = this.syscallInterface?.channelRead(channel)
      return Promise.resolve(result)
    }

    return this.syscall('channel', 'read', [channel]) as Promise<ReadResult>
  }

  public static async channelReadEtc(channel: Channel) {
    this.checkInit()

    if (this.useDirectCalls === true) {
      const result = this.syscallInterface?.channelReadEtc(channel)
      return Promise.resolve(result)
    }

    return this.syscall('channel', 'read_etc', [channel]) as Promise<ReadEtcResult>
  }
}
