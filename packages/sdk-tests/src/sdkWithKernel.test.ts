import { System } from '@meshx-org/fiber-sdk'
import { Kernel } from '@meshx-org/fiber-kernel'

describe('Direct Syscalls', () => {
    beforeEach(() => {
        const kernel = new Kernel({ onProcessCreate: () => {}, onProcessKill: () => {} })
        System.initDirect(kernel)
    })

    test('System should be initilized', () => {
        expect(System.initialized).toBe(true)
    })
})
