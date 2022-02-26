import { Handle, HandleType } from '@meshx-org/fiber-types'

export interface HandleDisposition {
  operation: number
  handle: Handle
  type: HandleType
  rights: number
}
