import { Handle, Process, Realm, Channel } from './rawhandles'

// prettier-ignore
export enum Status {
  OK                = 0,
  ERR_INTERNAL      = 1,
  ERR_NOT_SUPPORTED = 2,
  ERR_NO_MEMORY     = 3,
  ERR_WRONG_TYPE    = 4,
  ERR_BAD_STATE     = 5,
  ERR_INVALID_ARGS  = 6,
  ERR_BAD_HANDLE    = 7,
  ERR_BAD_SYSCALL   = 8
}

export interface Result extends Object {
    status: number
}

// prettier-ignore
export enum HandleType {
  HANDLE         = 0,
  CHANNEL_HANDLE = 1,
  MEMORY_HANDLE  = 2,
  PROCESS_HANDLE = 3,
}

export interface HandleResult extends Result {
    handle?: Handle
}

export interface HandlePairResult extends Result {
    first?: Handle
    second?: Handle
}

export interface HandleInfo extends Result {
    handle: Handle
    type: number
    rights: number
}

export interface ReadResult extends Result {
    bytes?: ArrayBuffer
    numBytes?: number
    handles?: Array<Handle>
}

export interface ReadEtcResult extends Result {
    bytes?: ArrayBuffer
    numBytes?: number
    handleInfos?: Array<HandleInfo>
}

export interface WriteResult extends Result {
    numBytes: number
}

export enum HandleOp {}

export interface HandleDisposition {
    operation: HandleOp
    handle: Handle
    type: HandleType
    rights: number // HandleRights enum
}

export interface ISyscalls extends Record<string, any> {
    // Handle operations.
    handle_duplicate: (handle: Handle) => HandleResult
    handle_replace: (handle: Handle, replacement: Handle) => HandleResult
    handle_close: (handle: Handle) => Result

    // Channel operations.
    channel_create(process: Process): HandlePairResult
    channel_write(channel: Channel, data: Uint8Array, handles: Handle[]): WriteResult
    channel_write_etc(channel: Channel, data: Uint8Array, dispositions: HandleDisposition[]): WriteResult
    channel_read(channel: Channel): ReadResult
    channel_read_etc(channel: Channel): ReadEtcResult

    // Realm operations.
    realm_create: (parent: Realm) => HandleResult

    // Process operations.
    process_create: (parent: Realm, name: string, program: Handle) => HandleResult
    process_start: (process: Process, bootstrap: Handle) => Result

    // Memory operations.
    // memoryCreate: (size: number) => HandleResult
    // memoryWrite: (handle: Handle, offset: number, data: Uint8Array) => WriteResult
    // memoryRead: (handle: Handle, offset: number, length: number) => ReadResult
    // memoryCreateChild: (parent: Handle, offset: number, size: number) => HandleResult
}

export * from './rawhandles'
export * from './rights'
