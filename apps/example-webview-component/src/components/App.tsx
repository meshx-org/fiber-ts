import { IDispatchSyscall, System } from '@meshx-org/fiber-sdk-old'
import { Result } from '@meshx-org/fiber-sdk-types'
import { useState } from 'react'

//parent.addEventListener('message', () => {})

const iframeDispatcher: IDispatchSyscall = (namespace, name, args) =>
    new Promise<Result>((resolve, reject) => {
        const channel = new MessageChannel()

        channel.port1.onmessage = ({ data }) => {
            channel.port1.close()
            resolve(data)
        }

        parent.postMessage(
            { type: '__fiber_syscall', data: { namespace, name, args } },
            { transfer: [channel.port2], targetOrigin: 'http://localhost:1234' }
        )
    })

export function App() {
    const [value, setValue] = useState('')

    const handleClick = async () => {
        System.init(iframeDispatcher)
        const { first, second } = await System.channelCreate(0)
        console.log('awaited')
    }

    return (
        <div>
            <input type="text" value={value} onChange={e => setValue(e.target.value)} />
            <button onClick={handleClick}>Ok</button>
            <button id="fire">fire</button>
        </div>
    )
}
