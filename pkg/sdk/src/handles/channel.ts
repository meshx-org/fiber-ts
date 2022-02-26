import { ReadEtcResult, ReadResult, Status, WriteResult } from '@meshx-org/fiber-types'
import { HandleWrapper, HandleWrapperPair } from './handleWrapper'
import { HandleDisposition } from './handleDisposition'
import { System } from '../system'
import { Process, Handle } from './index'

export class Channel extends HandleWrapper {
  public async write(data: Uint8Array, handles?: Array<Handle>): Promise<WriteResult> {
    if (!this.handle) {
      return Promise.resolve({ status: Status.ERR_INVALID_ARGS }) as Promise<WriteResult>
    }

    const rawHandles = handles.map((h) => h.raw)

    return System.channelWrite(this.raw, data, rawHandles ?? [])
  }

  public async writeEtc(data: Uint8Array, handleDispositions?: Array<HandleDisposition>): Promise<WriteResult> {
    if (!this.handle) {
      return Promise.resolve({ status: Status.ERR_INVALID_ARGS }) as Promise<WriteResult>
    }

    return System.channelWriteEtc(this.raw, data, handleDispositions ?? [])
  }

  public async read(): Promise<ReadResult> {
    if (!this.handle) {
      return Promise.resolve({ status: Status.ERR_INVALID_ARGS }) as Promise<ReadResult>
    }

    return System.channelRead(this.raw)
  }

  public async readEtc(): Promise<ReadEtcResult> {
    if (!this.handle) {
      return Promise.resolve({ status: Status.ERR_INVALID_ARGS }) as Promise<ReadEtcResult>
    }

    return System.channelReadEtc(this.raw)
  }
}

/// Typed wrapper around a linked pair of channel objects and the
/// zx_channel_create() syscall used to create them.
export class ChannelPair extends HandleWrapperPair<Channel> {
  static async create(parent: Process): Promise<ChannelPair> {
    const result = await System.channelCreate(parent.raw)

    const first = new Channel(result.first)
    const second = new Channel(result.second)

    if (result.status !== Status.OK) {
      return new ChannelPair(null, null)
    }

    return new ChannelPair(first, second)
  }

  private constructor(first?: Channel, second?: Channel) {
    super(first, second)
  }
}
