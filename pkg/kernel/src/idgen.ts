export class IdGen {
  #lastId = 1

  public getNext(): number {
    this.#lastId += 1

    if (this.#lastId === Number.MAX_SAFE_INTEGER) {
      throw new Error('id gen reached max value')
    }

    return this.#lastId
  }
}
