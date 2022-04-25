import { INVALID_HANDLE, Status } from '@meshx-org/fiber-types'
import { System } from '../system'
import { Handle } from './handle'
import { SyscallRecorder } from './__test__/syscallRecorder'

const TEST_HANDLE = 1
const DUPLICATED_HANDLE = 2

describe('SDK Untyped Handle', () => {
    let handle: Handle

    let recorder: SyscallRecorder

    beforeAll(() => {
        recorder = new SyscallRecorder()
        System.init(recorder.dispatch)
    })

    beforeEach(() => {
        recorder.reset()
        handle = new Handle(TEST_HANDLE)
    })

    it('can check handle validity', async () => {
        expect(handle.isValid).toBe(true)

        const invalid = new Handle(INVALID_HANDLE)
        expect(invalid.isValid).toBe(false)
    })

    it('should be able to close a handle', async () => {
        await handle.close()

        expect(recorder.syscalls[0]).toEqual({ namespace: 'handle', name: 'close', args: [TEST_HANDLE] })
        expect(recorder.syscalls).toHaveLength(1)
    })

    it('should be able to duplicate a handle', async () => {
        const mockedResult = () => ({ status: Status.OK, handle: DUPLICATED_HANDLE })
        recorder.mockSyscall('handle', 'duplicate', mockedResult)

        const duplicate = await handle.duplicate()

        expect(duplicate.raw).toBe(DUPLICATED_HANDLE)
        expect(recorder.syscalls[0]).toEqual({ namespace: 'handle', name: 'duplicate', args: [TEST_HANDLE] })
        expect(recorder.syscalls).toHaveLength(1)
    })

    it.todo('should be able to replace a handle')
})
