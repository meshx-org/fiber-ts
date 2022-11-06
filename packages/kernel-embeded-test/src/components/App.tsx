/* eslint-disable no-restricted-syntax */
import { Kernel } from '@meshx-org/fiber-kernel'
import { System } from '@meshx-org/fiber-sdk-old'
import { useAtom } from 'jotai'
import { useEffect, useMemo } from 'react'
import { webviewComponents } from './atoms'
import { webviewComponentProvider } from './webviewRunner'

function handleSyscallEvent(event: MessageEvent) {
    const { type, data } = event.data

    if (type === '__fiber_syscall') {
        console.log(event.origin, { type, data })

        event.ports[0].postMessage({ type: '__fiber_syscall_status', data: { status: 0 } })
        // ...
    }
}

window.addEventListener('message', handleSyscallEvent, {})

export function WebViewComponents() {
    const [components, setComponents] = useAtom(webviewComponents)

    useEffect(() => {
        webviewComponentProvider.onCreate = created => {
            // `this` refers to our react component
            setComponents([...components, created])
        }
    }, [])

    return (
        <div>
            {components.map((view, idx) => (
                <iframe
                    key={idx}
                    loading="lazy"
                    name="webview"
                    title="webview"
                    scrolling="no"
                    allow="cross-origin-isolated; camera 'none'; microphone 'none'; sync-xhr 'none';"
                    sandbox="allow-scripts"
                    src={'http://localhost:8081/'}
                />
            ))}
        </div>
    )
}

export function App() {
    const fiberKernel = useMemo(() => {
        const kernel = new Kernel({
            onProcessCreate: processObject => {
                const { id } = processObject
            },
            onProccessStart: processObject => {
                console.log('onProccessStart', processObject)
            },
            onProcessKill: processObject => {
                console.log('onProcessKill', processObject)
            }
        })

        System.initDirect(kernel)

        return kernel
    }, [])

    return (
        <div>
            <h1>Example TS Kernel</h1>

            <WebViewComponents />
        </div>
    )
}
