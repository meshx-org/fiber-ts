import { HandleType, INVALID_HANDLE, ISyscalls, Status } from '@meshx-org/fiber-sdk-types'
import NotInitialized from './errors'
import { IDispatchSyscall } from './system'

const kernelMock: ISyscalls = {
    handle_duplicate: jest.fn(_handle => ({ status: Status.OK, handle: INVALID_HANDLE })),
    handle_replace: jest.fn((_handle, _replacement) => ({ status: Status.OK, handle: INVALID_HANDLE })),
    handle_close: jest.fn(_handle => ({ status: Status.OK })),
    channel_create: jest.fn(_process => ({ status: Status.OK, first: INVALID_HANDLE, second: INVALID_HANDLE })),
    channel_write: jest.fn((_channel, _data, _handles) => ({ status: Status.OK, numBytes: 0 })),
    channel_write_etc: jest.fn((_channel, _data, _dispositions) => ({ status: Status.OK, numBytes: 0 })),
    channel_read: jest.fn(_channel => ({ status: Status.OK })),
    channel_read_etc: jest.fn(_channel => ({ status: Status.OK })),
    realm_create: jest.fn(_parent => ({ status: Status.OK, handle: INVALID_HANDLE })),
    process_create: jest.fn((_parent, _name, _program) => ({ status: Status.OK, handle: INVALID_HANDLE })),
    process_start: jest.fn((_process, _bootstrap) => ({ status: Status.OK }))
}

const syscall = jest.fn()

const dispatchMock: IDispatchSyscall = async (namespace, name, args) => {
    const fullSyscallName = `${namespace}::${name}`

    syscall(namespace, name, args)

    switch (fullSyscallName) {
        case 'handle::close':
            return { status: Status.OK }
        case 'handle::duplicate':
            return { status: Status.OK, handle: INVALID_HANDLE }
        case 'handle::replace':
            return { status: Status.OK, handle: INVALID_HANDLE }
        case 'realm::create':
            return { status: Status.OK, handle: INVALID_HANDLE }
        case 'process::create':
            return { status: Status.OK, handle: INVALID_HANDLE }
        case 'process::start':
            return { status: Status.OK }
        case 'channel::create':
            return { status: Status.OK, first: INVALID_HANDLE, second: INVALID_HANDLE }
        case 'channel::read':
            return { status: Status.OK }
        case 'channel::read_etc':
            return { status: Status.OK }
        case 'channel::write':
            return { status: Status.OK }
        case 'channel::write_etc':
            return { status: Status.OK }
        default: {
            return { status: Status.ERR_NOT_SUPPORTED }
        }
    }
}

describe('System', () => {
    beforeEach(() => jest.resetModules())

    it('should throw error if system not initilaized', async () => {
        expect.assertions(2)

        const { System } = await import('./system')

        expect(System.initialized).toBe(false)
        expect(() => System.channelCreate(1)).toThrow('System not initialized')
    })

    it('shouldnt be initilaized without calling init', async () => {
        const { System } = await import('./system')
        expect(System.initialized).toBe(false)
    })

    test('direct syscalls works', async () => {
        const { System } = await import('./system')

        System.initDirect(kernelMock)
        expect(System.initialized).toBe(true)

        const res1 = await System.realmCreate(1)
        expect(kernelMock.realm_create).toBeCalledWith(1)
        expect(res1).toEqual({ status: Status.OK, handle: INVALID_HANDLE })

        const res2 = await System.processCreate(2, 'name', 3)
        expect(kernelMock.process_create).toBeCalledWith(2, 'name', 3)
        expect(res2).toEqual({ status: Status.OK, handle: INVALID_HANDLE })

        const res3 = await System.processStart(4, 5)
        expect(kernelMock.process_start).toBeCalledWith(4, 5)
        expect(res3).toEqual({ status: Status.OK })

        const res4 = await System.channelCreate(6)
        expect(kernelMock.channel_create).toBeCalledWith(6)
        expect(res4).toEqual({ status: Status.OK, first: INVALID_HANDLE, second: INVALID_HANDLE })

        const res5 = await System.channelRead(7)
        expect(kernelMock.channel_read).toBeCalledWith(7)
        expect(res5).toEqual({ status: Status.OK })

        const res6 = await System.channelReadEtc(8)
        expect(kernelMock.channel_read_etc).toBeCalledWith(8)
        expect(res6).toEqual({ status: Status.OK })

        const res7 = await System.channelWrite(9, new Uint8Array(), [1, 2, 3])
        expect(kernelMock.channel_write).toBeCalledWith(9, new Uint8Array(), [1, 2, 3])
        expect(res7).toEqual({ status: Status.OK, numBytes: 0 })

        const res8 = await System.channelWriteEtc(10, new Uint8Array(), [
            { handle: 1, type: HandleType.HANDLE, rights: 0, operation: 0 }
        ])
        expect(kernelMock.channel_write_etc).toBeCalledWith(10, new Uint8Array(), [
            { handle: 1, type: HandleType.HANDLE, rights: 0, operation: 0 }
        ])
        expect(res8).toEqual({ status: Status.OK, numBytes: 0 })

        const res9 = await System.handleDuplicate(11)
        expect(kernelMock.handle_duplicate).toBeCalledWith(11)
        expect(res9).toEqual({ status: Status.OK, handle: INVALID_HANDLE })

        const res10 = await System.handleReplace(12, 13)
        expect(kernelMock.handle_replace).toBeCalledWith(12, 13)
        expect(res10).toEqual({ status: Status.OK, handle: INVALID_HANDLE })

        const res11 = await System.handleClose(14)
        expect(kernelMock.handle_close).toBeCalledWith(14)
        expect(res11).toEqual({ status: Status.OK })
    })

    test('indirect syscalls works', async () => {
        const { System } = await import('./system')

        System.init(dispatchMock)
        expect(System.initialized).toBe(true)

        const res1 = await System.realmCreate(1)
        expect(syscall).toBeCalledWith('realm', 'create', [1])
        expect(res1).toEqual({ status: Status.OK, handle: INVALID_HANDLE })
        syscall.mockReset()

        const res2 = await System.processCreate(2, 'name', 3)
        expect(syscall).toBeCalledWith('process', 'create', [2, 'name', 3])
        expect(res2).toEqual({ status: Status.OK, handle: INVALID_HANDLE })
        syscall.mockReset()

        const res3 = await System.processStart(4, 5)
        expect(syscall).toBeCalledWith('process', 'start', [4, 5])
        expect(res3).toEqual({ status: Status.OK })
        syscall.mockReset()

        const res4 = await System.channelCreate(6)
        expect(syscall).toBeCalledWith('channel', 'create', [6])
        expect(res4).toEqual({ status: Status.OK, first: INVALID_HANDLE, second: INVALID_HANDLE })
        syscall.mockReset()

        const res5 = await System.channelRead(7)
        expect(syscall).toBeCalledWith('channel', 'read', [7])
        expect(res5).toEqual({ status: Status.OK })
        syscall.mockReset()

        const res6 = await System.channelReadEtc(8)
        expect(syscall).toBeCalledWith('channel', 'read_etc', [8])
        expect(res6).toEqual({ status: Status.OK })
        syscall.mockReset()

        const res7 = await System.channelWrite(9, new Uint8Array(), [1, 2, 3])
        expect(syscall).toBeCalledWith('channel', 'write', [9, new Uint8Array(), [1, 2, 3]])
        expect(res7).toEqual({ status: Status.OK })
        syscall.mockReset()

        const res8 = await System.channelWriteEtc(10, new Uint8Array(), [
            { handle: 1, type: HandleType.HANDLE, rights: 0, operation: 0 }
        ])
        expect(syscall).toBeCalledWith('channel', 'write_etc', [
            10,
            new Uint8Array(),
            [{ handle: 1, type: HandleType.HANDLE, rights: 0, operation: 0 }]
        ])
        expect(res8).toEqual({ status: Status.OK })
        syscall.mockReset()

        const res9 = await System.handleDuplicate(11)
        expect(syscall).toBeCalledWith('handle', 'duplicate', [11])
        expect(res9).toEqual({ status: Status.OK, handle: INVALID_HANDLE })
        syscall.mockReset()

        const res10 = await System.handleReplace(12, 13)
        expect(syscall).toBeCalledWith('handle', 'replace', [12, 13])
        expect(res10).toEqual({ status: Status.OK, handle: INVALID_HANDLE })
        syscall.mockReset()

        const res11 = await System.handleClose(14)
        expect(syscall).toBeCalledWith('handle', 'close', [14])
        expect(res11).toEqual({ status: Status.OK })
        syscall.mockReset()
    })
})
