import { ReadEtcResult, ReadResult, Status, WriteResult } from '@meshx-org/fiber-sdk-types'
import { HandleWrapper, HandleWrapperPair } from './handleWrapper'
import { HandleDisposition } from './handleDisposition'
import { System } from '../system'
import { Process, Handle } from './index'

export class Channel extends HandleWrapper {
    public async write(data: Uint8Array, handles?: Array<Handle>): Promise<WriteResult> {
        if (!this.handle) {
            return Promise.resolve({ status: Status.ERR_INVALID_ARGS }) as Promise<WriteResult>
        }

        const rawHandles = handles ? handles.map(h => h.raw) : []

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

    async *[Symbol.asyncIterator]() {
        yield this.read()
    }
}

/// Typed wrapper around a linked pair of channel objects and the
/// zx_channel_create() syscall used to create them.
export class ChannelPair extends HandleWrapperPair<Channel> {
    static async create(parent: Process): Promise<ChannelPair> {
        const { status, first, second } = await System.channelCreate(parent.raw)

        if (status !== Status.OK) {
            return new ChannelPair(null, null)
        }

        const firstChannel = new Channel(first!)
        const secondChannel = new Channel(second!)

        return new ChannelPair(firstChannel, secondChannel)
    }

    private constructor(first: Channel | null, second: Channel | null) {
        super(first, second)
    }
}
