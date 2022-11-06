import { fx_process_create, fx_process_start } from '@meshx-org/fiber-sys'
import { fx_handle_t, FX_INVALID_HANDLE, fx_status_t, Ref, Status } from '@meshx-org/fiber-kernel-types'
import { HandleWrapper } from './handleWrapper'
import { Handle } from './handle'

export class Process extends HandleWrapper {
    public static create(): void {}

    /// Similar to `Thread::start`, but is used to start the first thread in a process.
    ///
    /// Wraps the
    /// [zx_process_start](https://fuchsia.dev/fuchsia-src/reference/syscalls/process_start.md)
    /// syscall.
    public start(entry: number, arg1: Handle): fx_status_t {
        let process_raw = this.raw
        let arg1_raw = arg1.raw

        let status = fx_process_start(process_raw, entry, arg1_raw)

        return 0
    }
}
