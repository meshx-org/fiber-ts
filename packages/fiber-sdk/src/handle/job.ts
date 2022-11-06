import { fx_job_create, fx_process_create } from '@meshx-org/fiber-sys'
import { fx_handle_t, FX_INVALID_HANDLE, Ref, Status } from '@meshx-org/fiber-kernel-types'
import { HandleWrapper } from './handleWrapper'
import { Process } from './process'

export class Job extends HandleWrapper {
    public static create(parent: Job, name: string): Job {
        const job_handle: Ref<fx_handle_t> = new Ref(FX_INVALID_HANDLE)
        const options = 0

        const status = fx_job_create(parent.raw, options, job_handle)

        if (status !== Status.OK) {
            return new Job(FX_INVALID_HANDLE)
        }

        return new Job(job_handle.value)
    }

    /// Create a new job as a child of the current job.
    ///
    /// Wraps the
    /// [fx_job_create](https://fuchsia.dev/fuchsia-src/reference/syscalls/job_create.md)
    /// syscall.
    public createChildJob(): Job {
        let parent_job_raw = this.raw
        let out = new Ref(FX_INVALID_HANDLE)
        let options = 0

        let status = fx_job_create(parent_job_raw, options, out)

        return new Job(out.value)
    }

    /// Create a new process as a child of the current job.
    ///
    /// On success, returns a handle to the new process and a handle to the
    /// root of the new process's address space.
    ///
    /// Wraps the
    /// [fx_process_create](https://fuchsia.dev/fuchsia-src/reference/syscalls/process_create.md)
    /// syscall.
    public createChildProcess(name: string): Process {
        let parent_job_raw = this.raw

        let name_ptr = name
        let name_size = name.length

        let options = 0
        let process_out = new Ref(FX_INVALID_HANDLE)
        let vmar_out = new Ref(FX_INVALID_HANDLE)

        let status = fx_process_create(parent_job_raw, name_ptr, name_size, options, process_out, vmar_out)

        return new Process(process_out.value)
    }
}
