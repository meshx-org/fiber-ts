import {
    HandleResult,
    HandlePairResult,
    Handle,
    ISyscalls,
    ReadResult,
    WriteResult,
    ReadEtcResult,
    HandleTransfer,
    ReadWithHandlesResult
} from './syscall-interface'

export class Kernel implements ISyscalls {
    #klog: Console = console

    // Handle operations.
    public handleDuplicate(handle: Handle): HandleResult {
        this.#klog.trace('HandleDuplicate', handle)
        return { handle: undefined, status: undefined }
    }

    public handleReplace(handle: Handle, replacement: Handle): HandleResult {
        this.#klog.trace('HandleReplace', handle, replacement)
        return { handle: undefined, status: undefined }
    }

    public handleClose(handle: Handle): void {
        this.#klog.trace('HandleClose', handle)
    }

    // Channel operations.
    public channelCreate(): HandlePairResult {
        this.#klog.trace('channelCreate')
        return { left: undefined, right: undefined, status: undefined }
    }

    public channelWrite(channel: Handle, data: Uint8Array, handles: Handle[]): WriteResult {
        this.#klog.trace('channelWrite', channel, data, handles)
        return { numBytes: 0, status: undefined }
    }

    public channelWriteEtc(channel: Handle, data: Uint8Array, handleTransfers: HandleTransfer[]): WriteResult {
        this.#klog.trace('channelWriteEtc', channel, data, handleTransfers)
        return { numBytes: 0, status: undefined }
    }

    public channelRead(channel: Handle): ReadWithHandlesResult {
        this.#klog.trace('channelRead', channel)
        return { status: undefined, bytes: undefined, numBytes: undefined, handles: [] }
    }

    public channelReadEtc(channel: Handle): ReadEtcResult {
        this.#klog.trace('channelReadEtc', channel)
        return { status: undefined, bytes: undefined, numBytes: undefined, handleInfos: [] }
    }

    // Process operations.
    public processCreate(parent: Handle, program: Handle, name: string): HandleResult {
        this.#klog.trace('processCreate', parent, program, name)
        return { handle: undefined, status: undefined }
    }

    public processStart(process: Handle, bootstrap: Handle) {
        this.#klog.trace('processStart', process, bootstrap)
    }

    // Memory operations.
    public memoryCreate(size: number): HandleResult {
        this.#klog.trace('memoryCreate', size)
        return { handle: undefined, status: undefined }
    }

    public memoryWrite(handle: Handle, offset: number, data: Uint8Array): WriteResult {
        this.#klog.trace('memoryWrite', handle, offset, data)
        return { numBytes: 0, status: undefined }
    }

    public memoryRead(handle: Handle, offset: number, length: number): ReadResult {
        this.#klog.trace('memoryRead', handle, offset, length)
        return { status: undefined, bytes: undefined, numBytes: undefined }
    }

    public memoryCreateChild(parent: Handle, offset: number, size: number): HandleResult {
        this.#klog.trace('memoryCreateChild', parent, offset, size)
        return { handle: undefined, status: undefined }
    }
}
