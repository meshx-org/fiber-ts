import { Handle as RawHandle, INVALID_HANDLE } from '@fiber/types'

export class Handle {
  #handle: RawHandle = INVALID_HANDLE

  constructor(handle?: RawHandle) { 
    this.#handle = handle ?? INVALID_HANDLE
  }

  public static invalid(): Handle {
    return new Handle()
  }

  public get raw(): RawHandle {
    return this.#handle
  }

  public get isValid(): boolean {
    return this.#handle !== INVALID_HANDLE
  }

  public close(): void {}

  public duplicate(): Handle {
    const h = new Handle()
    return h
  }

  public replace(): Handle {
    const h = new Handle()
    return h
  }
}
