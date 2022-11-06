import { Dispatcher } from './dispatcher'

export class KernelHandle<T extends Dispatcher> {
    dispatcher_: T

    constructor(dispatcher: T) {
        this.dispatcher_ = dispatcher
    }

    public dispatcher(): T {
        return this.dispatcher_
    }
}
