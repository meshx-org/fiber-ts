export type fx_handle_t = number
export type fx_status_t = number
export type fx_vaddr_t = number
export type fx_rights_t = number
export type fx_koid_t = number
export type fx_txid_t = number
export type fx_signals_t = number
export type fx_policy_t = number

export type u32 = number
export type i64 = bigint

export const FX_INVALID_HANDLE = 0
export const FX_KOID_INVALID = 0

export const FX_MAX_NAME_LEN = 100
export const FX_PROCESS_SHARED = 1

export const FX_RIGHT_NONE: fx_rights_t = 0
export const FX_RIGHT_DUPLICATE: fx_rights_t = 1 << 0
export const FX_RIGHT_TRANSFER: fx_rights_t = 1 << 1
export const FX_RIGHT_READ: fx_rights_t = 1 << 2
export const FX_RIGHT_WRITE: fx_rights_t = 1 << 3
export const FX_RIGHT_EXECUTE: fx_rights_t = 1 << 4
export const FX_RIGHT_MAP: fx_rights_t = 1 << 5
export const FX_RIGHT_GET_PROPERTY: fx_rights_t = 1 << 6
export const FX_RIGHT_SET_PROPERTY: fx_rights_t = 1 << 7
export const FX_RIGHT_ENUMERATE: fx_rights_t = 1 << 8
export const FX_RIGHT_DESTROY: fx_rights_t = 1 << 9
export const FX_RIGHT_SET_POLICY: fx_rights_t = 1 << 10
export const FX_RIGHT_GET_POLICY: fx_rights_t = 1 << 11
export const FX_RIGHT_SIGNAL: fx_rights_t = 1 << 12
export const FX_RIGHT_SIGNAL_PEER: fx_rights_t = 1 << 13
export const FX_RIGHT_WAIT: fx_rights_t = 1 << 14
export const FX_RIGHT_INSPECT: fx_rights_t = 1 << 15
export const FX_RIGHT_MANAGE_JOB: fx_rights_t = 1 << 16
export const FX_RIGHT_MANAGE_PROCESS: fx_rights_t = 1 << 17
export const FX_RIGHT_MANAGE_THREAD: fx_rights_t = 1 << 18
export const FX_RIGHT_APPLY_PROFILE: fx_rights_t = 1 << 19
export const FX_RIGHT_MANAGE_SOCKET: fx_rights_t = 1 << 20
export const FX_RIGHT_SAME_RIGHTS: fx_rights_t = 1 << 31


export const FX_POL_NEW_PROCESS = 1

export function todo() {
    throw new Error('not implemented')
}

export enum Status {
    OK = 1,
    ERR_UNSUPPORTED = 2,
    ERR_CANCELED = 3,
    ERR_OUT_OF_RANGE = 4,
    ERR_BAD_STATE = 5,
    ERR_BUFFER_TOO_SMALL = 6,
    ERR_BAD_HANDLE = 7,
    ERR_SHOULD_WAIT = 8,
    ERR_PEER_CLOSED = 9,
    ERR_INVALID_ARGS = 10
}

export enum Signal { 
    CHANNEL_READABLE = 1
}

export class Ref<T> {
    private _value: T | undefined

    constructor(value: T) {
        this._value = value
    }

    get value(): T {
        if (typeof this._value == 'undefined') throw new Error('ref is empty')
        return this._value
    }

    set value(newValue: T) {
        this._value = newValue
    }

    take(): T | undefined {
        let value = this._value
        this._value = undefined
        return value
    }
}
