import { INVALID_HANDLE } from '@meshx-org/fiber-sdk-types'
import { Realm } from '.'
import { System } from '../system'
import { ChannelPair } from './channel'
import { Process } from './process'
import { SyscallRecorder } from './__test__/syscallRecorder'

const ROOT_REALM_RAW = 1

describe('SDK Channel Handle', () => {
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
        recorder.reset()
    })

    test('should be able to create a handle', async () => {
        const { first, second } = await ChannelPair.create(parentProcess)
    })

    test.todo('read should call the underlying syscall')
    test.todo('write should call the underlying syscall')
    test.todo('readEtc should call the underlying syscall')
    test.todo('writeEtc should call the underlying syscall')
})
