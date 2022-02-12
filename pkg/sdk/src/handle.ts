import { Handle as RawHandle, INVALID_HANDLE } from "@fiber/types"

export class Handle {
  #handle: RawHandle = INVALID_HANDLE

  static invalid(): Handle {
    return new Handle()
  }

  public get isValid(): boolean {
    return this.#handle !== INVALID_HANDLE
  }

  public async close(): Promise<void> {
    
  }

  public async duplicate(): Promise<Handle> {
    const h = new Handle()
    return h
  }

  public async replace(): Promise<Handle> {
    const h = new Handle()
    return h
  }
}
