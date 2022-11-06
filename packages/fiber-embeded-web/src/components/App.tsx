import React, { useRef, useCallback, useState, useMemo } from 'react'
import { Kernel } from '@meshx-org/fiber-kernel'
import { Job } from '@meshx-org/fiber-sdk'
import { fx_handle_t } from '@meshx-org/fiber-kernel-types'
import { init } from '@meshx-org/fiber-sys'
import { createLibp2p, Libp2pInit } from 'libp2p'

interface FiberNode {
    name: string
}

interface FiberIframeNodesProps {
    nodes: FiberNode[]
    onNodeReady: () => void
}

export function FiberIframeNodes({ nodes, onNodeReady }: FiberIframeNodesProps) {
    const nodeFrameRefs = useRef<Record<string, HTMLIFrameElement>>({})

    return (
        <>
            {nodes.map(node => (
                <iframe
                    key={node.name}
                    ref={el => (nodeFrameRefs.current[node.name] = el!)}
                    loading="lazy"
                    name="webview"
                    onLoad={() => {
                        const contentWindow = nodeFrameRefs.current[node.name].contentWindow!
                        const { port1, port2 } = new MessageChannel()

                        contentWindow.postMessage({}, '*', [port2])

                        port1.onmessage = ({ data }) => {
                            console.log(data)
                        }

                        onNodeReady()
                    }}
                    title="webview"
                    scrolling="no"
                    allow="cross-origin-isolated; camera 'none'; microphone 'none'; sync-xhr 'none';"
                    sandbox="allow-scripts"
                    src={'http://localhost:3001/'}
                />
            ))}
        </>
    )
}

const memory: Record<number, (arg1: fx_handle_t, arg2: number) => Promise<void>> = {
    0: async (arg1, arg2) => {
        console.log('running process 0')
    },
    1: async (arg1, arg2) => {
        console.log('running process 1')
    }
}

const userboot = (rootJob: fx_handle_t) => {
    console.log('running process userboot')

    const job = new Job(rootJob)

    // const [channel0, channel1] = Channel.create()

    const process1 = job.createChildProcess('test0')
    process1.start(1, job)

    const process2 = job.createChildProcess('test1')
    process2.start(0, job)
}

export function FiberApp() {
    const [nodes, setNodes] = useState<FiberNode[]>([{ name: 'test' }])

    const node = useMemo(async () => {
        const defaultConfiguration: Partial<Libp2pInit> = {
            transports: [],
            streamMuxers: [],
            connectionEncryption: [],
            peerStore: {},
            addresses: {
                listen: ['/ip4/0.0.0.0/tcp/0']
            } as any,
            peerDiscovery: [
                /*bootstrap({
                    list: [
                        // a list of bootstrap peer multiaddrs to connect to on node startup
                        //"/ip4/104.131.131.82/tcp/4001/ipfs/QmaCpDMGvV2BGHeYERUEnRQAwe3N8SzbUtfsmvsqQLuvuJ",
                        //"/dnsaddr/bootstrap.libp2p.io/ipfs/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN",
                        //"/dnsaddr/bootstrap.libp2p.io/ipfs/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa",
                    ],
                    timeout: 1000, // in ms,
                    tagName: "bootstrap",
                    tagValue: 50,
                    tagTTL: 120000, // in ms
                }),*/
            ]
        }

        let node = await createLibp2p(defaultConfiguration)

        // Handle messages for the protocol
        await node.handle('/chat/1.0.0', async ({ stream }) => {
            // Send stdin to the stream
            // stdinToStream(stream)
            // Read the stream and output to console
            // streamToConsole(stream)
        })

        // Add node 2 data to node1's PeerStore
        node.connectionManager.addEventListener('peer:connect', evt => {
            console.log('Connection established to:', evt.detail.remotePeer.toString()) // Emitted when a new connection has been created
        })
        // libp2p.fetch()

        await node.start()

        // Output listen addresses to the console
        console.log('Listener ready, listening on:')
        node.getMultiaddrs().forEach(ma => {
            console.log(ma.toString())
        })

        return node
    }, [])

    const kernel = useMemo(() => {
        const kernel = new Kernel({
            onProcessStart: async function (entry, arg1) {
                const fn = memory[entry]
                await fn(arg1, 0)
            },
            onNodeStart: async function () {
                setNodes(old => [...old, { name: 'test' }])
            }
        })

        init(kernel)
        kernel.startUserboot(userboot)

        return kernel
    }, [])

    const handleNodeReady = useCallback(() => {
        if (kernel) kernel.registerNode()
        else throw new Error('kernel not yet initialized')
    }, [kernel])

    return (
        <div>
            <h1>Example TS Kernel</h1>
            <p>Sub-node count: {nodes.length}</p>
            <FiberIframeNodes nodes={nodes} onNodeReady={handleNodeReady} />
        </div>
    )
}
