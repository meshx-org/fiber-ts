import { Status } from '@fiber/types'
import { IDispatchSyscall } from '../../system'

export interface ISavedSyscall {
  namespace: string
  name: string
  args: unknown[]
}

export interface ISyscallRecorder {
  syscalls: ISavedSyscall[]
  dispatch: IDispatchSyscall
  mockSyscall: (namespace: string, name: string, impl: (...args: unknown[]) => unknown) => void
  reset: () => void
}

/// This class is used to record syscalls mainly for unit testing.
export class SyscallRecorder implements ISyscallRecorder {
  mocks: Record<string, jest.Mock> = {}
  syscalls: ISavedSyscall[] = []

  public dispatch: IDispatchSyscall = async (namespace, name, args) => {
    const fullSyscallName = `${namespace}::${name}`

    this.syscalls.push({ namespace, name, args })

    if (fullSyscallName in this.mocks) {
      return this.mocks[fullSyscallName](...args)
    }

    switch (fullSyscallName) {
      case 'handle::close':
        return { status: Status.OK }
      case 'handle::duplicate':
        return { status: Status.OK, handle: 0 }
      case 'process::create':
        return { status: Status.OK, handle: 1 }
      case 'channel::create':
        return { status: Status.OK, first: 1, second: 2 }
      default:
        return { status: Status.ERR_NOT_SUPPORTED }
    }
  }

  public mockSyscall(namespace: string, name: string, impl: (...args: unknown[]) => unknown) {
    this.mocks[`${namespace}::${name}`] = jest.fn(impl)
  }

  public reset() {
    this.mocks = {}
    this.syscalls = []
  }
}
