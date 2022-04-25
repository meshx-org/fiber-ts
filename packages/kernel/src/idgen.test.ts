import { IdGen } from './idgen'

describe('IdGen', () => {
    it('should return unique ids', () => {
        const idGen = new IdGen(1)

        expect(idGen.getNext()).toBe(2)
        expect(idGen.getNext()).toBe(3)
        expect(idGen.getNext()).toBe(4)
    })

    it('should thro error on last id', () => {
        const idGen = new IdGen(Number.MAX_SAFE_INTEGER)

        expect(() => idGen.getNext()).toThrow('id gen reached max value')
    })
})
