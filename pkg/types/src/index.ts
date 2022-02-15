/* eslint no-bitwise: "off" */

import { Handle } from './raw-handles'

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
export enum HandleRights {
  RIGHT_NONE         = 1 << 0,
  RIGHT_READ         = 1 << 1,
  RIGHT_WRITE        = 1 << 2,
  RIGHT_TRANSFER     = 1 << 3,
  RIGHT_DUPLICATE    = 1 << 4,
  
  RIGHT_SET_POLICY = 1 << 5,
  RIGHT_GET_POLICY = 1 << 6,

  // Process Rights
  RIGHT_MANAGE_PROCESS = 1 << 7,
  
  RIGHTS_BASIC = RIGHT_TRANSFER | RIGHT_DUPLICATE,
}

// prettier-ignore
export enum HandleType {
  HANDLE         = 0,
  CHANNEL_HANDLE = 1,
  MEMORY_HANDLE  = 2,
  PROCESS_HANDLE = 3,
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

export * from './raw-handles'
