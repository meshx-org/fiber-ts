import { Handle } from './rawhandles'

// prettier-ignore
export enum Status {
  OK                = 0,
  ERR_BAD_STATE     = 1,
  ERR_INVALID_ARGS  = 2,
  ERR_NO_MEMORY     = 3,
  ERR_NOT_SUPPORTED = 4,
  ERR_INTERNAL      = 5
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

export interface ISyscalls {
  handleDuplicate: (handle: Handle) => HandleResult
  handleReplace: (handle: Handle, replacement: Handle) => HandleResult
  handleClose: (handle: Handle) => Result
  channelCreate(): HandlePairResult
  channelWrite(channel: Handle, data: Uint8Array, handles: Handle[]): WriteResult
  channelWriteEtc(channel: Handle, data: Uint8Array, dispositions: HandleDisposition[]): WriteResult
  channelRead(channel: Handle): ReadResult
  channelReadEtc(channel: Handle): ReadEtcResult
}

export * from './rawhandles'
export * from './rights'
