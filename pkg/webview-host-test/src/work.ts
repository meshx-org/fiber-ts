import { getQuickJS } from 'quickjs-emscripten'
import { Kernel } from './fiber/kernel'

const initialCode = `
let cow = 10;
cow;
`.trim()

globalThis.onmessage = async ($event) => {
  if ($event && $event.data && $event.data.msg === 'incApple') {
    const newCounter = $event.data.countApple

    const QuickJS = await getQuickJS()
    const result = QuickJS.evalCode(initialCode)
    console.log('eval result:', result)

    globalThis.postMessage(newCounter + result)
  }
}
