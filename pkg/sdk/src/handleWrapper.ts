import { Handle } from './handle'

/// A base class for classes that wrap Handles.
class HandleWrapper {
  #handle: Handle | null

  protected constructor(handle: Handle | null) {
    this.#handle = handle
  }

  public get handle(): Handle | null {
    return this.#handle
  }

  public get isValid(): boolean {
    return this.#handle?.isValid ?? false
  }

  public close(): void {
    this.#handle!.close()
    this.#handle = null
  }

  public passHandle(): Handle | null {
    const result: Handle | null = this.#handle
    this.#handle = null
    return result
  }

  // @override
  // bool operator ==(Object other) =>
  //     (other is _HandleWrapper) && handle == other.handle;

  public equals(other: HandleWrapper): boolean {
    return other instanceof HandleWrapper && this.#handle == other.#handle
  }

  public toString(): string {
    return `${this.constructor.name}(${this.#handle})`
  }
}

/// A base class for classes that wrap a pair of Handles.
abstract class HandleWrapperPair<T> {
  #first: T
  #second: T

  protected constructor(first: T, second: T) {
    this.#first = first
    this.#second = second
  }

  public toString(): string {
    return `${this.constructor.name}(${this.#first},${this.#second})`
  }
}

export { HandleWrapper, HandleWrapperPair }
