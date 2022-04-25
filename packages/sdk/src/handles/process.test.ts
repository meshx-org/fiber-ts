import { INVALID_HANDLE, Status } from '@fiber/types'
import { ChannelPair, Realm } from '.'
import { System } from '../system'
import { Process } from './process'
import { SyscallRecorder } from './__test__/syscallRecorder'

const ROOT_REALM_RAW = 1
const BOOTSTRAP_HANDLE_RAW = 10
const PROCESS_HANDLE_RAW = 20

describe('SDK Process Handle', () => {
    let recorder: SyscallRecorder
    let parentProcess: Process
    let rootRealm: Realm

    beforeAll(() => {
        rootRealm = new Realm(ROOT_REALM_RAW)
        recorder = new SyscallRecorder()
        System.init(recorder.dispatch)
    })

    beforeEach(async () => {
        parentProcess = await Process.create(rootRealm, 'parent', INVALID_HANDLE)
        recorder.reset() // this always need to be last
    })

    test('should be able to create a process', async () => {
        const PROCESS_HANDLE = 10
        recorder.mockSyscall('process', 'create', () => ({ status: Status.OK, handle: PROCESS_HANDLE }))
        const process = await Process.create(rootRealm, 'test_process', INVALID_HANDLE)

        expect(process.raw).toBe(PROCESS_HANDLE)
        expect(process.isValid).toBe(true)
    })

    test('start should call the underlying syscall', async () => {
        recorder.mockSyscall('channel', 'create', () => ({
            status: Status.OK,
            first: BOOTSTRAP_HANDLE_RAW,
            second: INVALID_HANDLE
        }))
        recorder.mockSyscall('process', 'create', () => ({ status: Status.OK, handle: PROCESS_HANDLE_RAW }))
        recorder.mockSyscall('process', 'start', () => ({ status: Status.OK }))

        const { first: bootstrap } = await ChannelPair.create(parentProcess)
        const process = await Process.create(rootRealm, 'test_process', INVALID_HANDLE)

        process.start(bootstrap)

        expect(recorder.syscalls).toHaveLength(3)
        expect(recorder.syscalls[2]).toEqual({
            namespace: 'process',
            name: 'start',
            args: [PROCESS_HANDLE_RAW, BOOTSTRAP_HANDLE_RAW]
        })
    })
})
