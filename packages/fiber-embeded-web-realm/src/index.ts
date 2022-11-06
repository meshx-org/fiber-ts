import { Kernel } from '@meshx-org/fiber-kernel'
import { fx_handle_t } from '@meshx-org/fiber-kernel-types'
import { init } from '@meshx-org/fiber-sys'

import testScript from '../public/test.js?raw'
console.log(testScript)

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
    onNodeStart: async function () {
        console.log('not supported')
    }
})

kernel.init()
init(kernel)

kernel.startUserboot(root => {
    console.log('ruuning realm userboot')
})
