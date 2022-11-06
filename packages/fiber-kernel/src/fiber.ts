import { KernelHandle } from './object/handle'
import { JobDispatcher } from './object/job_dispatcher'
import { ProcessDispatcher, scope } from './object/process_dispatcher'
import { Ref, u32, i64, fx_status_t, fx_handle_t, fx_vaddr_t, Status, todo } from '@meshx-org/fiber-kernel-types'
import { System } from '@meshx-org/fiber-sys'

export interface ILogger {
    log: (...args: unknown[]) => void
}

export function createKernelLogger(): ILogger {
    const logger = {
        log: (...args: unknown[]) => console.log('[klog]:', ...args)
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
        parent: fx_handle_t,
        name: string,
        name_size: u32,
        options: u32,
        proc_handle_out: Ref<fx_handle_t>,
        vmar_handle_out: Ref<fx_handle_t>
    ): fx_status_t {
        this.klog.log('process_create', name)

        proc_handle_out.value = 0
        vmar_handle_out.value = 1

        return Status.OK
    }

    public sys_process_start(handle: fx_handle_t, entry: fx_vaddr_t, arg1: fx_handle_t): fx_status_t {
        let processDispatcher = ProcessDispatcher.create(this.rootJob.dispatcher(), '', 0)

        let logs = []

        const [process] = processDispatcher.unwrap()

        scope({ dispatcher: process.dispatcher() }, () => {
            this.config.onProcessStart(entry, 0).then(() => {
                this.resolve()
            })
        })

        return Status.OK
    }

    public sys_process_exit(retcode: i64): fx_status_t {
        return Status.OK
    }
}
