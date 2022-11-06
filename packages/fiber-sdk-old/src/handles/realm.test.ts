import { System } from '../system'
import { SyscallRecorder } from './__test__/syscallRecorder'
import { Realm } from '.'

const ROOT_REALM_RAW = 1

describe('SDK Realm Handle', () => {
    let recorder: SyscallRecorder
    let rootRealm: Realm

    beforeAll(() => {
        recorder = new SyscallRecorder()
        System.init(recorder.dispatch)
    })

    beforeEach(async () => {
        rootRealm = new Realm(ROOT_REALM_RAW)
        recorder.reset()
    })

    test.todo('should be able to create a handle')
})
