import { fx_handle_t, fx_vaddr_t, fx_status_t, u32, i64, Ref } from '@meshx-org/fiber-kernel-types'

export interface System {
    sys_handle_close(handle: fx_handle_t): fx_status_t

    /** Job operations */
    sys_job_create(parent_job: fx_handle_t, options: u32, job_out: Ref<fx_handle_t>): fx_status_t

    sys_process_create(
        parent: fx_handle_t,
        name: string,
        name_size: u32,
        options: u32,
        proc_handle_out: Ref<fx_handle_t>,
        vmar_handle_out: Ref<fx_handle_t>
    ): fx_status_t

    sys_process_start(handle: fx_handle_t, entry: fx_vaddr_t, arg1: fx_handle_t): fx_status_t

    sys_process_exit(retcode: i64): fx_status_t

    sys_channel_create(process: fx_handle_t, out1: Ref<fx_handle_t>, out2: Ref<fx_handle_t>): fx_status_t
}

declare global {
    var sys_handle_close: ((handle: fx_handle_t) => fx_status_t) | undefined
    var sys_job_create: ((parent_job: fx_handle_t, options: u32, job_out: Ref<fx_handle_t>) => fx_status_t) | undefined

    var sys_process_create:
        | ((
              parent: fx_handle_t,
              name: string,
              name_size: u32,
              options: u32,
              proc_handle_out: Ref<fx_handle_t>,
              vmar_handle_out: Ref<fx_handle_t>
          ) => fx_status_t)
        | undefined

    var sys_process_start: ((handle: fx_handle_t, entry: fx_vaddr_t, arg1: fx_handle_t) => fx_status_t) | undefined

    var sys_process_exit: ((retcode: i64) => fx_status_t) | undefined
    var sys_channel_create:
        | ((process: fx_handle_t, out1: Ref<fx_handle_t>, out2: Ref<fx_handle_t>) => fx_status_t)
        | undefined
}

let sys: System | undefined = undefined

const init = (system: System) => (sys = system)

function fx_job_create(parent_job: fx_handle_t, options: u32, job_out: Ref<fx_handle_t>): fx_status_t {
    if (self.sys_job_create) return self.sys_job_create(parent_job, options, job_out)
    else throw new Error('system is not initialized')
}

export function fx_handle_close(handle: fx_handle_t): fx_status_t {
    if (self.sys_handle_close) return self.sys_handle_close(handle)
    else if (sys) return sys.sys_handle_close(handle)
    else throw new Error('system is not initialized')
}

export function fx_process_create(
    parent: fx_handle_t,
    name: string,
    name_size: u32,
    options: u32,
    proc_handle_out: Ref<fx_handle_t>,
    vmar_handle_out: Ref<fx_handle_t>
): fx_status_t {
    if (self.sys_process_create)
        return self.sys_process_create(parent, name, name_size, options, proc_handle_out, vmar_handle_out)
    else if (sys) return sys.sys_process_create(parent, name, name_size, options, proc_handle_out, vmar_handle_out)
    else throw new Error('system is not initialized')
}

export function fx_process_start(handle: fx_handle_t, entry: fx_vaddr_t, arg1: fx_handle_t): fx_status_t {
    if (self.sys_process_start) return self.sys_process_start(handle, entry, arg1)
    else if (sys) return sys.sys_process_start(handle, entry, arg1)
    else throw new Error('system is not initialized')
}

export function fx_process_exit(retcode: i64): fx_status_t {
    if (self.sys_process_exit) return self.sys_process_exit(retcode)
    else if (sys) return sys.sys_process_exit(retcode)
    else throw new Error('system is not initialized')
}

export function fx_channel_create(process: fx_handle_t, out1: Ref<fx_handle_t>, out2: Ref<fx_handle_t>): fx_status_t {
    if (self.sys_channel_create) return self.sys_channel_create(process, out1, out2)
    else if (sys) return sys.sys_channel_create(process, out1, out2)
    else throw new Error('system is not initialized')
}

export { init, fx_job_create }
