import { INVALID_HANDLE, Status } from '@fiber/types'
import { System } from '../system'
import { HandleWrapper } from './handleWrapper'
import { Channel } from './index'

export class Process extends HandleWrapper {
  // TODO: replace any with Memory handle
  public static async create(parent: number, name: string, program: number): Promise<Process> {
    const { status, handle } = await System.processCreate(parent, name, program)

    if (status !== Status.OK) {
      return new Process(INVALID_HANDLE)
    }

    return new Process(handle)
  }

  public async start(bootstrap: Channel): Promise<void> {
    const { status } = await System.processStart(this.$handle, bootstrap.handle.raw)
  }
}
