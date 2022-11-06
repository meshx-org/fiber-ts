import { fx_channel_create } from '@meshx-org/fiber-sys'
import { FX_INVALID_HANDLE, Ref, Status } from '@meshx-org/fiber-kernel-types'
import { HandleWrapper, HandleWrapperPair } from './handleWrapper'
import { Process } from './process'

export class Channel extends HandleWrapper {}

/// Typed wrapper around a linked pair of channel objects and the
/// zx_channel_create() syscall used to create them.
export class ChannelPair extends HandleWrapperPair<Channel> {
    static create(parent: Process): ChannelPair {
        const first = new Ref(FX_INVALID_HANDLE)
        const second = new Ref(FX_INVALID_HANDLE)
        const status = fx_channel_create(parent.raw, first, second)

        if (status !== Status.OK) {
            return new ChannelPair(null, null)
        }

        const firstChannel = new Channel(first.value)
        const secondChannel = new Channel(second.value)

        return new ChannelPair(firstChannel, secondChannel)
    }

    private constructor(first: Channel | null, second: Channel | null) {
        super(first, second)
    }
}
