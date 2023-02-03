import { u32, fx_rights_t, FX_RIGHT_NONE, fx_koid_t, FX_KOID_INVALID } from '@meshx-org/fiber-kernel-types'

export abstract class Dispatcher {
    private count: u32 = 0

    public increment_handle_count(): void {
        this.count += 1
    }

    public decrement_handle_count(): void {
        this.count -= 1
    }

    public current_handle_count(): u32 {
        return this.count
    }

    public getKoid(): fx_koid_t {
        // TODO:
        return FX_KOID_INVALID
    }

    protected abstract on_handle_count_zero(): void
    protected static default_rights(): fx_rights_t {
        return FX_RIGHT_NONE
    }
}
