import { INVALID_HANDLE } from '@fiber/types'
import { System } from '../system'
import { ChannelPair } from './channel'
import { Process } from './process'
import { SyscallRecorder } from './__test__/syscallRecorder'

describe('SDK Channel Handle', () => {
  let recorder: SyscallRecorder
  let parentProcess: Process

  beforeAll(() => {
    recorder = new SyscallRecorder()
    System.init(recorder.dispatch)
  })

  beforeEach(async () => {
    parentProcess = await Process.create(INVALID_HANDLE, 'parent', INVALID_HANDLE)
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
