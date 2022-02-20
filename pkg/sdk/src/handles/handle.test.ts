import { Status, INVALID_HANDLE } from '@fiber/types'
import { IDispatchSyscall, System } from '../system'
import { Handle } from './handle'

let recordedSyscalls: any[] = []

const TEST_HANDLE = 1
const DUPLICATED_HANDLE = 2

const recordSyscall: IDispatchSyscall = async (namespace, name, args) => {
  const fullSyscallName = `${namespace}::${name}`

  recordedSyscalls.push({ namespace, name, args })

  switch (fullSyscallName) {
    case 'handle::close':
      return { status: Status.OK }
    case 'handle::duplicate':
      return { status: Status.OK, handle: DUPLICATED_HANDLE }
    default:
      return { status: Status.ERR_NOT_SUPPORTED }
  }
}

describe('Untyped Handle', () => {
  let handle: Handle

  beforeEach(() => {
    recordedSyscalls = []
    System.init(recordSyscall)
    handle = new Handle(TEST_HANDLE)
  })

  it('should be able to close a handle', async () => {
    await handle.close()

    expect(recordedSyscalls[0]).toEqual({ namespace: 'handle', name: 'close', args: [TEST_HANDLE] })
    expect(recordedSyscalls).toHaveLength(1)
  })

  it('should be able to duplicate a handle', async () => {
    const duplicate = await handle.duplicate()

    expect(duplicate.raw).toBe(DUPLICATED_HANDLE)
    expect(recordedSyscalls[0]).toEqual({ namespace: 'handle', name: 'duplicate', args: [TEST_HANDLE] })
    expect(recordedSyscalls).toHaveLength(1)
  })

  it.todo('should be able to replace a handle')

  test('it can check handle validity', async () => {
    expect(handle.isValid).toBe(true)

    const invalid = new Handle(INVALID_HANDLE)
    expect(invalid.isValid).toBe(false)
  })
})
