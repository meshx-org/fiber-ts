import { u32, Status, fx_rights_t } from '@meshx-org/fiber-kernel-types'
import { Dispatcher } from './dispatcher'
import { KernelHandle } from './handle'
import { ProcessDispatcher } from './process_dispatcher'

// The starting max_height value of the root job.
export const ROOT_JOB_MAX_HEIGHT: u32 = 32
export const ROOT_JOB_NAME: string = 'root'

export class JobPolicy {}

export enum State {
    READY,
    KILLING,
    DEAD
}

export class JobDispatcher extends Dispatcher {
    #jobs: Array<JobDispatcher> = [] // TA_GUARDED(get_lock());
    #procs: Array<ProcessDispatcher> = [] // TA_GUARDED(get_lock());

    #maxHeight: u32
    #policy: JobPolicy
    #parentJob: JobDispatcher | null
    #state: State

    constructor(flags: u32, parent: JobDispatcher | null, policy: JobPolicy) {
        super()

        this.#policy = policy
        this.#maxHeight = parent !== null ? parent.maxHeight() - 1 : ROOT_JOB_MAX_HEIGHT
        this.#parentJob = parent
        this.#state = State.READY
    }

    protected on_handle_count_zero(): void {
        throw new Error('on_handle_count_zero not implemented.')
    }

    static createRoot(): KernelHandle<JobDispatcher> {
        return new KernelHandle(new JobDispatcher(0, null, new JobPolicy()))
    }

    static create(parent: JobDispatcher, flags: u32): [Status, null | KernelHandle<JobDispatcher>, fx_rights_t] {
        if (parent.maxHeight() === 0) {
            // The parent job cannot have children.
            return [Status.ERR_OUT_OF_RANGE, null, 0]
        }

        const new_handle = new KernelHandle(new JobDispatcher(flags, parent, parent.getPolicy()))

        if (!parent.addChildJob(new_handle.dispatcher())) {
            return [Status.ERR_OUT_OF_RANGE, null, 0]
        }

        return [Status.OK, new_handle, JobDispatcher.default_rights()]
    }

    public addChildProcess(process: ProcessDispatcher): boolean {
        if (this.#state != State.READY) {
            return false
        }

        this.#procs.push(process)

        // TODO:  UpdateSignals();
        return true
    }

    public addChildJob(job: JobDispatcher): boolean {
        //canary_.Assert();
        //Guard<Mutex> guard{get_lock()};

        if (this.#state != State.READY) {
            return false
        }

        // Put the new job after our next-youngest child, or us if we have none.
        //
        // We try to make older jobs closer to the root (both hierarchically and
        // temporally) show up earlier in enumeration.
        // TODO: JobDispatcher* neighbor = if self.jobs_.is_empty() { this } else { &self.jobs_.back() };

        // This can only be called once, the job should not already be part
        // of any job tree.
        // DEBUG_ASSERT(!fbl::InContainer<JobDispatcher::RawListTag>(*job));
        // DEBUG_ASSERT(neighbor != job.get());

        this.#jobs.push(job)

        // TODO: UpdateSignalsLocked();
        return true
    }

    public maxHeight(): number {
        return this.#maxHeight
    }

    public getPolicy(): JobPolicy {
        return this.#policy
    }

    public parent(): JobDispatcher | null {
        return this.#parentJob
    }
}
