import { Handle, HandleType } from '@fiber/types'

export interface HandleDisposition {
  operation: number
  handle: Handle
  type: HandleType
  rights: number
}
