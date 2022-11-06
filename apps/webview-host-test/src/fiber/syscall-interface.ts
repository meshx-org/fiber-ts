export type Handle = number

enum HandleType {}
enum HandleRights {}

/// Users of the [Result] subclasses should check the status before
/// trying to read any data. Attempting to use a value stored in a result
/// when the status in not OK will result in an exception.
interface Result {
    status: number
    toString(): string
}

export interface HandleInfo extends Result {
    handle: Handle
    type: number
    rights: number
}

export interface HandleTransfer extends Result {
    operation: any
    handle: Handle
    type: HandleType
    rights: HandleRights
}

export interface ReadResult extends Result {
    bytes: ArrayBuffer
    numBytes: number
}

export interface ReadWithHandlesResult extends ReadResult {
    handles: Array<Handle>
}

export interface ReadEtcResult extends Result {
    bytes: ArrayBuffer
    numBytes: number
    handleInfos: Array<HandleInfo>
}

export interface WriteResult extends Result {
    numBytes: number
}

export interface HandleResult extends Result {
    handle: Handle
}

export interface HandlePairResult extends Result {
    left: Handle
    right: Handle
}

export interface ISyscalls {
    // Handle operations.
    handleDuplicate: (handle: Handle) => HandleResult
    handleReplace: (handle: Handle, replacement: Handle) => HandleResult
    handleClose: (handle: Handle) => void

    // Channel operations.
    channelCreate: () => HandlePairResult
    channelWrite: (channel: Handle, data: Uint8Array, handles: Handle[]) => WriteResult
    channelWriteEtc: (channel: Handle, data: Uint8Array, handleTransfers: HandleTransfer[]) => WriteResult
    channelRead: (channel: Handle) => ReadResult
    channelReadEtc: (channel: Handle) => ReadEtcResult

    // Process operations.
    processCreate: (parent: Handle, program: Handle, name: string) => HandleResult
    processStart: (process: Handle, bootstrap: Handle) => void

    // Memory operations.
    memoryCreate: (size: number) => HandleResult
    memoryWrite: (handle: Handle, offset: number, data: Uint8Array) => WriteResult
    memoryRead: (handle: Handle, offset: number, length: number) => ReadResult
    memoryCreateChild: (parent: Handle, offset: number, size: number) => HandleResult
}
