class ResultInner<T, E> {
    private ok: T | undefined
    private err: E | undefined

    constructor(value: T | undefined, err: E | undefined) {
        this.err = err
        this.ok = value
    }

    isOk(): boolean {
        return typeof this.err === 'undefined'
    }

    isErr(): boolean {
        return typeof this.ok === 'undefined'
    }

    unwrap(): T {
        if (typeof this.ok === 'undefined') throw new Error('panic')
        return this.ok
    }

    unwrapErr(): E {
        if (typeof this.err === 'undefined') throw new Error('panic')
        return this.err
    }
}

const Ok = <T, E>(ok: T): ResultInner<T, E> => new ResultInner<T, E>(ok, undefined)
const Err = <T, E>(err: E): ResultInner<T, E> => new ResultInner<T, E>(undefined, err)
export const Result = Object.freeze({ Ok, Err })
export type Result<T, E> = ResultInner<T, E>
