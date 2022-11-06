import Kernel from './kernel'

describe('Kernel', () => {
    it('should be constructed properly', () => {
        const kern = new Kernel({ onProcessCreate: () => {}, onProcessKill: () => {}, onProccessStart: () => {} })

        expect(kern).toBeDefined()

        // Handle operations.
        expect(typeof kern.handle_duplicate).toBe('function')
        expect(typeof kern.handle_replace).toBe('function')
        expect(typeof kern.handle_close).toBe('function')

        // Channel operations.
        expect(typeof kern.channel_create).toBe('function')
        expect(typeof kern.channel_write).toBe('function')
        expect(typeof kern.channel_write_etc).toBe('function')
        expect(typeof kern.channel_read).toBe('function')
        expect(typeof kern.channel_read_etc).toBe('function')

        // Realm operations.
        expect(typeof kern.realm_create).toBe('function')

        // Process operations.
        expect(typeof kern.process_create).toBe('function')
        expect(typeof kern.process_start).toBe('function')
    })
})
