import { Ref, u32, i64, fx_status_t, fx_handle_t, fx_vaddr_t } from '@meshx-org/fiber-kernel-types'

declare function sys_process_create(
    parent: fx_handle_t,
    name: string,
    name_size: u32,
    options: u32,
    proc_handle_out: Ref<fx_handle_t>,
    vmar_handle_out: Ref<fx_handle_t>
): fx_status_t

declare function fx_job_create(parent_job: fx_handle_t, options: u32, job_out: Ref<fx_handle_t>): fx_status_t

declare function fx_handle_close(handle: fx_handle_t): fx_status_t
declare function fx_process_start(handle: fx_handle_t, entry: fx_vaddr_t, arg1: fx_handle_t): fx_status_t

declare function fx_process_exit(retcode: i64): fx_status_t

declare function fx_channel_create(process: fx_handle_t, out1: Ref<fx_handle_t>, out2: Ref<fx_handle_t>): fx_status_t

export function fx_process_create(
    parent: fx_handle_t,
    name: string,
    name_size: u32,
    options: u32,
    proc_handle_out: Ref<fx_handle_t>,
    vmar_handle_out: Ref<fx_handle_t>
): fx_status_t {
    return sys_process_create(parent, name, name_size, options, proc_handle_out, vmar_handle_out)
}
