import React, { useCallback, useEffect } from 'react'
import { getQuickJS } from 'quickjs-emscripten'

function stringify(val: unknown) {
    if (typeof val === 'undefined') {
        return 'undefined'
    }

    return JSON.stringify(val, undefined, 2)
}

const initialCode = `
let cow = 1;
//while(true) {}
[cow, ++cow];
`.trim()

const Quick = () => {
    const [js, setJs] = React.useState(initialCode)
    const [evalResult, setEvalResult] = React.useState<unknown>(undefined)

    const handleEval = useCallback(async () => {
        const QuickJS = await getQuickJS()

        try {
            const result = QuickJS.evalCode(js)
            console.log('eval result:', result)
            setEvalResult(result)
        } catch (err) {
            console.log('eval error:', err)
            setEvalResult(err)
        }
    }, [js, setEvalResult])

    useEffect(() => {
        handleEval()
    }, [handleEval, js, setEvalResult])

    return <div>{JSON.stringify(evalResult)}</div>
}

export default Quick
