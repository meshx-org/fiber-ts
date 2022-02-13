import { Handle } from './handle'
import { HandleWrapper, HandleWrapperPair } from './handleWrapper'
import { HandleDisposition } from './handleDisposition'
import { System } from '../system'
import { ReadEtcResult, ReadResult, Status, WriteResult } from '@fiber/types'

export class Channel extends HandleWrapper {
  constructor(handle: Handle | null) {
    super(handle)
  }

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
export class ChannelPair extends HandleWrapperPair<Channel | null> {
  static create(): ChannelPair {
    const result = System.channelCreate()

    const first = new Handle(result.first)
    const second = new Handle(result.second)

    if (result.status == Status.OK) {
      return new ChannelPair(new Channel(first), new Channel(second))
    } else {
      return new ChannelPair(null, null)
    }
  }

  constructor(first: Channel | null, second: Channel | null) {
    super(first, second)
  }
}
