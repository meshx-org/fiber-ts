/* eslint-disable no-with */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-bitwise */
import {
  Handle as RawHandle,
  Channel as RawChannel,
  Process as RawProcess,
  Realm as RawRealm,
  INVALID_HANDLE,
  ISyscalls,
  Result,
  HandleResult,
  HandlePairResult,
  WriteResult,
  ReadResult,
  ReadEtcResult,
  HandleDisposition,
  Status,
  HandleRights
} from '@meshx-org/fiber-types'

import { ILogger, createKernelLogger } from './logger'
import { IdGen } from './idgen'

class KernelObject {}
class RealmObject extends KernelObject {}
class ProcessObject extends KernelObject {}

const ROOT_REALM_KOID: Koid = 1
const ROOT_REALM_HANDLE: RawHandle = 1

type Koid = number
// type ProcessHandle = [RawHandle, RawProcess]
// type BIF = (...args: unknown[]) => unknown

interface KernelHandle {
  koid: number
  rights: HandleRights
}

export default class Kernel implements ISyscalls {
  readonly #klog: ILogger

  private kobjects: Record<Koid, KernelObject> = {}
  private handles: Record<RawHandle, KernelHandle> = {}

  // private processHandles: Map<ProcessHandle, KernelHandle> = new Map()
  // private bifs: Map<string, BIF> = new Map()

  private koidGen = new IdGen()
  private handleGen = new IdGen()

  constructor() {
    this.#klog = createKernelLogger()

    // create root realm object
    this.kobjects[ROOT_REALM_KOID] = new RealmObject()
    this.handles[ROOT_REALM_HANDLE] = {
      koid: ROOT_REALM_KOID,
      rights: HandleRights.RIGHT_NONE
    }
  }

  public get rootRealm(): RawHandle {
    this.#klog.log('access root realm')
    return ROOT_REALM_HANDLE
  }

  // #region handle operations
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
  // #endregion

  // #region realm operations
  public realmCreate(parent: RawHandle): Result {
    return { status: Status.OK }
  }

  public realmListen(realm: RawHandle, multiaddr: string, channel: RawChannel): Result {
    this.#klog.log('realmListen')
    return { status: Status.OK }
  }

  public realmDial(realm: RawHandle, multiaddr: string, channel: RawChannel): Result {
    this.#klog.log('realmDial')
    return { status: Status.OK }
  }
  // #endregion

  // #region process operations
  public processCreate(parentRealm: RawRealm, name: string, programVmo: RawHandle): HandleResult {
    this.#klog.log('processCreate', parentRealm, programVmo)

    let handleId: number
    let processKoid: number

    try {
      handleId = this.handleGen.getNext()
      processKoid = this.koidGen.getNext()
    } catch (error) {
      return { status: Status.ERR_INTERNAL, handle: INVALID_HANDLE }
    }

    this.handles[handleId] = {
      koid: processKoid,
      rights: HandleRights.RIGHT_TRANSFER | HandleRights.RIGHT_DUPLICATE | HandleRights.RIGHT_DESTROY
    }

    const process = new ProcessObject()
    this.kobjects[processKoid] = process

    return { status: Status.OK, handle: handleId }
  }

  public processStart(process: RawProcess, bootChannel: RawChannel) {
    this.#klog.log('processStart', process)
    return { status: Status.OK }
  }
  // #endregion

  // #region channel operations
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
  // #endregion
}
