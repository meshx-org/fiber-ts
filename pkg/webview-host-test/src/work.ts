import { getQuickJS } from 'quickjs-emscripten'
import { Kernel } from './fiber/kernel'

const initialCode = `
let cow = 10;
cow;
`.trim()

self.onmessage = async (event: MessageEvent) => {
  if (event && event.data && event.data.msg === 'incApple') {
    const newCounter = event.data.countApple

    const QuickJS = await getQuickJS()
    const result = QuickJS.evalCode(initialCode)
    console.log('eval result:', result)

    self.postMessage(newCounter + result)
  }
}
