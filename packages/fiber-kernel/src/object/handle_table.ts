import { fx_handle_t, fx_rights_t, fx_status_t, Status } from '@meshx-org/fiber-kernel-types'
import { Dispatcher } from './dispatcher'
import { ProcessDispatcher } from './process_dispatcher'

export class HandleTable {
    public getDispatcherWithRights<T extends Dispatcher>(
        up: ProcessDispatcher,
        handle: fx_handle_t,
        rights: fx_rights_t
    ): [fx_status_t, T] {
        // TODO
        return [Status.OK, {} as unknown as T]
    }

    public removeHandle(up: ProcessDispatcher) {}

    public addHandle() {}

    public mapHandleToValue() {}
}
