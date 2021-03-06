import { Handle } from './handle'

/// A base class for TypedHandles.
export abstract class HandleWrapper extends Handle {
    public get handle(): Handle {
        return new Handle(this.$handle)
    }

    public equals(other: HandleWrapper): boolean {
        return this.$handle === other.$handle
    }
}

/// A base class for classes that wrap a pair of TypedHandles.
export abstract class HandleWrapperPair<T> {
    public first: T | null
    public second: T | null

    protected constructor(first: T | null, second: T | null) {
        this.first = first
        this.second = second
    }
}
