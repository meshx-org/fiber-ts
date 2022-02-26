import { Handle as RawHandle, INVALID_HANDLE } from '@meshx-org/fiber-types'
import { System } from '../system'

export class Handle {
  protected $handle: RawHandle = INVALID_HANDLE

  constructor(handle: RawHandle) {
    this.$handle = handle
  }

  public static invalid(): Handle {
    return new Handle(INVALID_HANDLE)
  }

  public get raw(): RawHandle {
    return this.$handle
  }

  public get isValid(): boolean {
    return this.$handle !== INVALID_HANDLE
  }

  public async close(): Promise<void> {
    const { status } = await System.handleClose(this.$handle)
  }

  public async duplicate(): Promise<Handle> {
    const { status, handle: raw } = await System.handleDuplicate(this.$handle)

    return new Handle(raw)
  }

  // TODO: Implement
  public async replace(): Promise<Handle> {
    throw new Error('Not implemented')
  }
}
