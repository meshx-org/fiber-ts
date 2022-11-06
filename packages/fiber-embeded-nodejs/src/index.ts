import { Job } from '@meshx-org/fiber-sdk'
import { Kernel } from '@meshx-org/fiber-kernel'
import { init } from '@meshx-org/fiber-sys'
import { fx_handle_t } from '@meshx-org/fiber-kernel-types'
import 'ses'

// lockdown({ domainTaming: 'unsafe' })

export async function main() {
    const memory: Record<number, (arg1: fx_handle_t, arg2: number) => Promise<void>> = {
        0: async (arg1, arg2) => {
            console.log('running process 0')
        },
        1: async (arg1, arg2) => {
            console.log('running process 1')
        }
    }

    const kernel = new Kernel({
        onProcessStart: async function (entry, arg1) {
            const fn = memory[entry]
            await fn(arg1, 0)
        },
        onNodeStart: async () => {}
    })

    kernel.init()
    init(kernel)

    kernel.startUserboot(rootJob => {
        const job = new Job(rootJob)

        // const [channel0, channel1] = Channel.create()

        const process1 = job.createChildProcess('test0')
        process1.start(1, job)

        const process2 = job.createChildProcess('test1')
        process2.start(0, job)
    })

    kernel.wait()
}

main()
