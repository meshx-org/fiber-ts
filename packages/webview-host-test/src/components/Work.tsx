import React, { useEffect, useState } from 'react'

const appleWorker = new Worker(new URL('../work.ts', import.meta.url), { type: 'module' })

const WorkComp = () => {
    const [countApple, setCountApple] = useState<number>(0)

    useEffect(() => {
        appleWorker.onmessage = ($event: MessageEvent) => {
            if ($event && $event.data) {
                setCountApple($event.data)
            }
        }
    }, [appleWorker])

    function incApple() {
        appleWorker.postMessage({ msg: 'incApple', countApple })
    }

    return (
        <div>
            <div>{countApple}</div>
            <button onClick={incApple}>incApple</button>
        </div>
    )
}

export default WorkComp
