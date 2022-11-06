import { fx_rights_t, u32 } from '@meshx-org/fiber-kernel-types'
import { Dispatcher } from './dispatcher'
import { KernelHandle } from './handle'

export class VmarDispatcher extends Dispatcher {
    protected on_handle_count_zero(): void {
        throw new Error('on_handle_count_zero not implemented.')
    }

    public static create(flags: u32): [KernelHandle<VmarDispatcher>, fx_rights_t] {
        return [new KernelHandle(new VmarDispatcher()), 0]
    }
}
