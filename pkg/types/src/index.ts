import { Handle } from './raw-handles'

export enum Status {
  OK = 0,
  ERR_BAD_STATE = 1,
  ERR_INVALID_ARGS = 2,
  ERR_NO_MEMORY = 3,
  ERR_NOT_SUPPORTED = 4,
  ERR_INTERNAL = 5
}

export interface Result {
  status: number
  toString(): string
}

export interface HandleResult extends Result {
  handle: Handle
}

export interface HandlePairResult extends Result {
  first: Handle
  second: Handle
}

export interface HandleInfo extends Result {
  handle: Handle
  type: number
  rights: number
}

export interface ReadResult extends Result {
  bytes: ArrayBuffer
  numBytes: number
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

export interface HandleDisposition { 
  
}

export interface ISyscalls {
  handleDuplicate: (handle: Handle) => HandleResult
  handleReplace: (handle: Handle, replacement: Handle) => HandleResult
  handleClose: (handle: Handle) => void
}

export * from './raw-handles'
