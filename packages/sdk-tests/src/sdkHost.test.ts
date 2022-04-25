import { System, IDispatchSyscall } from '@fiber/sdk'

const hostCall: IDispatchSyscall = async () => ({ status: 0 })

describe('System', () => {
  test('Host', () => {
    System.init(hostCall)

    expect(System.initialized).toBe(true)
  })
})
