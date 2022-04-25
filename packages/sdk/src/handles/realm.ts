import { INVALID_HANDLE, Status } from '@meshx-org/fiber-types'
import { System } from '../system'
import { HandleWrapper } from './handleWrapper'

export class Realm extends HandleWrapper {
    public static async create(parent: Realm): Promise<Realm> {
        const { status, handle } = await System.realmCreate(parent.raw)

        if (status !== Status.OK) {
            return new Realm(INVALID_HANDLE)
        }

        return new Realm(handle)
    }
}
