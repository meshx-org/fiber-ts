import { Result } from '../result'
import { fx_rights_t, fx_status_t, Status, fx_policy_t, u32, fx_handle_t, i64 } from '@meshx-org/fiber-kernel-types'
import { Dispatcher } from './dispatcher'
import { KernelHandle } from './handle'
import { JobDispatcher } from './job_dispatcher'
import { VmarDispatcher } from './vmar_dispatcher'
import { HandleTable } from './handle_table'

interface ProcessContext {
    dispatcher: ProcessDispatcher
}

export const TL_SCOPES: ProcessContext[] = []

export function scope<T extends Function>(context: ProcessContext, fn: T) {
    TL_SCOPES.push(context)
    fn()
    TL_SCOPES.pop()
}

export interface ProcessSharedState {
    handleTable: HandleTable
}

export class ProcessDispatcher extends Dispatcher {
    sharedState: ProcessSharedState
    name_: string

    private constructor(parent_job: JobDispatcher, name: string, flags: u32) {
        super()
        this.name_ = name
        this.sharedState = {
            handleTable: new HandleTable()
        }
    }

    public enforceBasicPolicy(policy: fx_policy_t): fx_status_t {
        return Status.OK
    }

    public static create(
        parent_job: JobDispatcher,
        name: string,
        flags: u32
    ): Result<[KernelHandle<ProcessDispatcher>, fx_rights_t, KernelHandle<VmarDispatcher>, fx_rights_t], Status> {
        let handle = new KernelHandle(new ProcessDispatcher(parent_job, name, flags))

        let status = handle.dispatcher().init()
        if (status != Status.OK) {
            return Result.Err(status)
        }

        // Create a dispatcher for the root VMAR.
        const [vmar_handle, vmar_rights] = VmarDispatcher.create(0)

        // Only now that the process has been fully created and initialized can we register it with its
        // parent job. We don't want anyone to see it in a partially initalized state.
        if (!parent_job.addChildProcess(handle.dispatcher())) {
            return Result.Err(Status.ERR_BAD_STATE)
        }

        return Result.Ok([handle, ProcessDispatcher.default_rights(), vmar_handle, vmar_rights])
    }

    public init(): fx_status_t {
        //Guard<Mutex> guard{get_lock()};
        // debug_assert!(self.state == State::INITIAL);

        // create an address space for this process, named after the process's koid.
        //let aspace_name: [u8; ZX_MAX_NAME_LEN] = format!("proc:{}", self.get_koid()).into();

        //let aspace_ = VmAspace::Create(VmAspace::TYPE_USER, aspace_name);

        //if (!aspace_) {
        //  trace!("error creating address space\n");
        //  return sys::FX_ERR_NO_MEMORY;
        //}

        return Status.OK
    }

    protected on_handle_count_zero(): void {
        throw new Error('on_handle_count_zero not implemented.')
    }

    public static getCurrent(): ProcessDispatcher {
        let last = TL_SCOPES[scope.length - 1]
        return last.dispatcher
    }

    public static exitCurrent(retCode: i64) { 
        // TODO
        let last = TL_SCOPES[scope.length - 1]
        last.dispatcher
    }

    public getName(): string {
        return this.name_
    }

    public handleTable(): HandleTable {
        return this.sharedState.handleTable
    }
}
