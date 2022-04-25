/* eslint no-bitwise: "off" */

// prettier-ignore
export enum HandleRights {
  RIGHT_NONE         = 1 << 0,
  RIGHT_READ         = 1 << 1,
  RIGHT_WRITE        = 1 << 2,
  RIGHT_DESTROY      = 1 << 3,
  RIGHT_TRANSFER     = 1 << 4,
  RIGHT_DUPLICATE    = 1 << 5,
  
  RIGHT_SET_POLICY = 1 << 6,
  RIGHT_GET_POLICY = 1 << 7,

  // Realm Rights
  RIGHT_MANAGE_PROCESS = 1 << 8,
  
  RIGHTS_BASIC = RIGHT_TRANSFER | RIGHT_DUPLICATE,
}
