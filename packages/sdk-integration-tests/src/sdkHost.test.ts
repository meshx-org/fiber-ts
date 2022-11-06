import { System, IDispatchSyscall } from '@meshx-org/fiber-sdk-old'

const hostCall: IDispatchSyscall = async () => ({ status: 0 })

describe('Indirect Syscalls', () => {
    test('Host', () => {
        System.init(hostCall)

        expect(System.initialized).toBe(true)
    })
})
