import { Handle, HandleType } from '@meshx-org/fiber-sdk-types'

export interface HandleDisposition {
    operation: number
    handle: Handle
    type: HandleType
    rights: number
}
