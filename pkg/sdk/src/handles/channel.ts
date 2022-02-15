import { ReadEtcResult, ReadResult, Status, WriteResult } from '@fiber/types'
import { Handle } from './handle'
import { HandleWrapper, HandleWrapperPair } from './handleWrapper'
import { HandleDisposition } from './handleDisposition'
import { System } from '../system'

export class Channel extends HandleWrapper {
  public write(data: Uint8Array, handles?: Array<Handle>): WriteResult {
    if (!this.handle) {
      return { status: Status.ERR_INVALID_ARGS, numBytes: undefined }
    }

    const rawHandles = handles.map((h) => h.raw)

    return System.channelWrite(this.handle.raw, data, rawHandles ?? [])
  }

  public writeEtc(data: Uint8Array, handleDispositions?: Array<HandleDisposition>): WriteResult {
    if (!this.handle) {
      return { status: Status.ERR_INVALID_ARGS, numBytes: undefined }
    }

    return System.channelWriteEtc(this.handle.raw, data, handleDispositions ?? [])
  }

  public read(): ReadResult {
    if (!this.handle) {
      return { status: Status.ERR_INVALID_ARGS, bytes: undefined, numBytes: undefined, handles: undefined }
    }

    return System.channelRead(this.handle.raw)
  }

  public readEtc(): ReadEtcResult {
    if (!this.handle) {
      return { status: Status.ERR_INVALID_ARGS, bytes: undefined, numBytes: undefined, handleInfos: undefined }
    }

    return System.channelReadEtc(this.handle.raw)
  }
}

/// Typed wrapper around a linked pair of channel objects and the
/// zx_channel_create() syscall used to create them.
export class ChannelPair extends HandleWrapperPair<Channel> {
  static create(): ChannelPair {
    const result = System.channelCreate()

    const first = new Channel(new Handle(result.first))
    const second = new Channel(new Handle(result.second))

    if (result.status !== Status.OK) {
      return new ChannelPair(null, null)
    }
    
    return new ChannelPair(first, second)
  }

  private constructor(first: Channel | null, second: Channel | null) {
    super(first, second)
  }
}
