import { KernelHandle } from './object/handle'
import { JobDispatcher } from './object/job_dispatcher'
import { ProcessDispatcher, scope } from './object/process_dispatcher'
import {
    Ref,
    u32,
    i64,
    fx_status_t,
    fx_handle_t,
    fx_vaddr_t,
    Status,
    todo,
    FX_MAX_NAME_LEN,
    FX_PROCESS_SHARED,
    FX_POL_NEW_PROCESS,
    FX_RIGHT_MANAGE_PROCESS,
    FX_RIGHT_WRITE,
    fx_rights_t,
    FX_RIGHT_TRANSFER
} from '@meshx-org/fiber-kernel-types'
import { System } from '@meshx-org/fiber-sys'
import { Dispatcher } from './object/dispatcher'

export interface ILogger {
    log: (...args: unknown[]) => void
    trace: (...args: unknown[]) => void
}

function make_userspace_handle<T extends Dispatcher>(
    handle: Ref<fx_handle_t>,
    kernelHandle: KernelHandle<T>,
    rgihts: fx_rights_t
): fx_status_t {
    return Status.OK
}

export function createKernelLogger(): ILogger {
    const logger = {
        log: (...args: unknown[]) => console.log('[klog]:', ...args),
        trace: (...args: unknown[]) => console.log('[klog]:', ...args)
    }

    return logger
}

interface KernelConfig {
    onProcessStart(entry: number, arg1: fx_handle_t): Promise<void>
    onNodeStart(): Promise<void>
}

export class Kernel implements System {
    private klog: ILogger
    private rootJob: KernelHandle<JobDispatcher>
    private config: KernelConfig

    private resolve!: () => void
    private finshed: Promise<void>

    wait(): Promise<void> {
        return this.finshed
    }

    constructor(config: KernelConfig) {
        this.klog = createKernelLogger()
        this.rootJob = JobDispatcher.createRoot()
        this.config = config

        this.finshed = new Promise((res, rej) => {
            this.resolve = res
        })
    }

    public init() {
        this.klog.log('kernel initialized')
    }

    public registerNode() {}

    /** Runs a function as the initial process. It is used to bring up the system services. */
    public startUserboot(initial: (rootJob: fx_handle_t) => void) {
        this.klog.log('start userboot process')

        let result = ProcessDispatcher.create(this.rootJob.dispatcher(), 'userboot', 0)

        let [process, rights] = result.unwrap()

        scope({ dispatcher: process.dispatcher() }, initial)
    }

    public sys_channel_create(process: fx_handle_t, out1: Ref<fx_handle_t>, out2: Ref<fx_handle_t>): fx_status_t {
        todo()
        return Status.OK
    }

    public sys_handle_close(handle: fx_handle_t): fx_status_t {
        todo()
        return Status.OK
    }

    public sys_job_create(parent_job: fx_handle_t, options: u32, job_out: Ref<fx_handle_t>): fx_status_t {
        todo()
        return Status.OK
    }

    public sys_process_create(
        job_handle: fx_handle_t,
        name: Uint8Array,
        name_len: u32,
        options: u32,
        proc_handle_out: Ref<fx_handle_t>,
        vmar_handle_out: Ref<fx_handle_t>
    ): fx_status_t {
        this.klog.log(`job handle ${job_handle}, options ${options}`)
        // currently, the only valid option values are 0 or ZX_PROCESS_SHARED
        if (options != FX_PROCESS_SHARED && options != 0) {
            return Status.ERR_INVALID_ARGS
        }

        const up = ProcessDispatcher.getCurrent()

        // We check the policy against the process calling zx_process_create, which
        // is the operative policy, rather than against |job_handle|. Access to
        // |job_handle| is controlled by the rights associated with the handle.
        let result: fx_status_t = up.enforceBasicPolicy(FX_POL_NEW_PROCESS)
        if (result != Status.OK) {
            return result
        }

        // copy out the name and silently truncate it.
        let str = new TextDecoder().decode(name.buffer)
        str = str.slice(FX_MAX_NAME_LEN)

        if (result != Status.OK) {
            return result
        }

        this.klog.trace('name ${buf}\n')

        let [status, job] = up
            .handleTable()
            .getDispatcherWithRights<JobDispatcher>(up, job_handle, FX_RIGHT_MANAGE_PROCESS)

        if (status != Status.OK) {
            // Try again, but with the WRITE right.
            // TODO(fxbug.dev/32803) Remove this when all callers are using MANAGE_PROCESS.
            let [status2, job] = up.handleTable().getDispatcherWithRights<JobDispatcher>(up, job_handle, FX_RIGHT_WRITE)

            if (status2 != Status.OK) {
                return status2
            }
        }

        // create a new process dispatcher
        let res = ProcessDispatcher.create(job, 'TODO sp here', options)

        if (res.isErr()) {
            return res.unwrapErr()
        }

        let [new_process_handle, proc_rights, new_vmar_handle, vmar_rights] = res.unwrap()

        // const koid: u32  = new_process_handle.dispatcher().getKoid();
        // fxt_kernel_object(TAG_PROC_NAME, /*always*/ false, koid, ZX_OBJ_TYPE_PROCESS, fxt::StringRef(buf));

        result = make_userspace_handle(proc_handle_out, new_process_handle, proc_rights)

        if (result == Status.OK) {
            result = make_userspace_handle(vmar_handle_out, new_vmar_handle, vmar_rights)
            return result
        }

        return Status.OK
    }

    public sys_process_start(process_handle: fx_handle_t, pc: fx_vaddr_t, arg1_handle_value: fx_handle_t): fx_status_t {
        this.klog.trace(`phandle ${process_handle}, thandle %x, pc %#" PRIxPTR ", sp %#" PRIxPTR ", arg_handle %x, arg2 %#" PRIxPTR `, , thread_handle, pc, sp, arg_handle_value, arg2);
        
        const up = ProcessDispatcher.getCurrent();
        
        // get process dispatcher
        let [status1, process]  = up.handleTable().getDispatcherWithRights<ProcessDispatcher>(up, process_handle, FX_RIGHT_WRITE);
        if (status1 != Status.OK) {
            up.handleTable().removeHandle(up, arg1_handle_value);
            return status1;
        }

        // get thread_dispatcher
        let [status2, thread] = up.handleTable().getDispatcherWithRights(up, thread_handle, FX_RIGHT_WRITE);
        if (status2 != Status.OK) {
            up.handleTable().removeHandle(up, arg1_handle_value);
            return status2;
        }
        
        let arg_handle: HandleOwner  = up.handleTable().removeHandle(up, arg1_handle_value);
        
        // test that the thread belongs to the starting process
        if (thread.process() != process.get()) { 
            return ZX_ERR_ACCESS_DENIED;
        }

        let arg_nhv: fx_handle_t = FX_HANDLE_INVALID;
        if (arg_handle) {
            if (!arg_handle.hasRights(FX_RIGHT_TRANSFER)) { 
                return Status.ERR_ACCESS_DENIED;
            }

            arg_nhv = process.handleTable().mapHandleToValue(arg_handle);
            process.handleTable().addHandle(arg_handle);
        }

        let status3 = thread.start(ThreadDispatcher.EntryState{pc, sp, arg_nhv, arg2},  /* ensure_initial_thread */ true);
        if (status3 != Status.OK) {
            // Remove |arg_handle| from the process that failed to start.
            process.handleTable().removeHandle(process, arg_nhv);
            return status3;
        }
  


        scope({ dispatcher: process }, () => {
            this.config.onProcessStart(pc, 0).then(() => {
                this.resolve()
            })
        })

        return Status.OK
    }

    public sys_process_exit(retcode: i64) {
        this.klog.trace(`retcode ${retcode}`)
        ProcessDispatcher.exitCurrent(retcode)
    }
}
