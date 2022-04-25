import {
    ISyscalls,
    Result,
    HandleResult,
    HandlePairResult,
    WriteResult,
    ReadResult,
    HandleDisposition,
    ReadEtcResult,
    Handle,
    Process,
    Channel,
    Realm
} from '@meshx-org/fiber-types'

import NotInitialized from './errors'

export type IDispatchSyscall<T extends Result = Result> = (
    namespace: string,
    name: string,
    args: unknown[]
) => Promise<T>

/**
 * This class is used to dispatch syscalls directly or indirectly.
 * @public
 */
export class System {
    public static initialized = false

    private static syscall: IDispatchSyscall | undefined = undefined
    private static syscallInterface: ISyscalls | undefined = undefined
    private static useDirectCalls: boolean

    /**
     * Initializes a System that uses syscall dispatching.
     * @param syscall the dispatcher function
     */
    public static init(syscall: IDispatchSyscall) {
        this.syscall = syscall
        this.initialized = true
        this.useDirectCalls = false
    }

    /**
     * Initializes a System that can be used directly with a kernel without any call dispatching.
     * @param syscalls Object implementing ISyscalls interface
     */
    public static initDirect(syscalls: ISyscalls) {
        this.syscallInterface = syscalls
        this.initialized = true
        this.useDirectCalls = true
    }

    private static doSyscall<T extends Result>(namespace: string, name: string, syscallArgs: unknown[]): Promise<T> {
        if (this.initialized === false) throw new NotInitialized()

        if (this.useDirectCalls === true) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const result = this.syscallInterface![`${namespace}_${name}`](...syscallArgs)
            return Promise.resolve<T>(result)
        }

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return this.syscall!(namespace, name, syscallArgs) as Promise<T>
    }

    public static handleDuplicate(handle: Handle) {
        return this.doSyscall<HandleResult>('handle', 'duplicate', [handle])
    }

    public static handleReplace(handle: Handle, replacement: Handle) {
        return this.doSyscall<HandleResult>('handle', 'replace', [handle, replacement])
    }

    public static handleClose(handle: Handle): Promise<Result> {
        return this.doSyscall<Result>('handle', 'close', [handle])
    }

    public static realmCreate(parent: Realm) {
        return this.doSyscall<HandleResult>('realm', 'create', [parent])
    }

    // TODO: replace program handle with Memory type
    public static processCreate(parent: Realm, name: string, program: Handle): Promise<HandleResult> {
        return this.doSyscall<HandleResult>('process', 'create', [parent, name, program])
    }

    public static processStart(process: Process, bootstrap: Channel) {
        return this.doSyscall<Result>('process', 'start', [process, bootstrap])
    }

    public static channelCreate(process: Process) {
        return this.doSyscall<HandlePairResult>('channel', 'create', [process])
    }

    public static channelWrite(channel: Channel, data: Uint8Array, handles: Handle[]) {
        return this.doSyscall<WriteResult>('channel', 'write', [channel, data, handles])
    }

    public static channelWriteEtc(channel: Channel, data: Uint8Array, dispositions: HandleDisposition[]) {
        return this.doSyscall<WriteResult>('channel', 'write_etc', [channel, data, dispositions])
    }

    public static channelRead(channel: Channel) {
        return this.doSyscall<ReadResult>('channel', 'read', [channel])
    }

    public static channelReadEtc(channel: Channel): Promise<ReadEtcResult> {
        return this.doSyscall<ReadEtcResult>('channel', 'read_etc', [channel])
    }
}
