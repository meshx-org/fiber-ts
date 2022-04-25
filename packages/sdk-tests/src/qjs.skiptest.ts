import { getQuickJS, QuickJSVm } from 'quickjs-emscripten'

let vm: QuickJSVm

beforeAll(async () => {
  const QuickJS = await getQuickJS()
  vm = QuickJS.createVm()
})

test('WebAssembly works inside jest', () => {
  expect(global.WebAssembly).toHaveProperty('instantiate')
  expect(global.WebAssembly).toHaveProperty('compile')
})

test.skip('quickjs', async () => {
  const world = vm.newString('world')
  vm.setProp(vm.global, 'NAME', world)
  world.dispose()

  const result: any = vm.evalCode(`console.log(NAME)`)

  if (result.error) {
    console.log('Execution failed:', vm.dump(result.error))
    result.error.dispose()
  } else {
    console.log('Success:', vm.dump(result.value))
    result.value.dispose()
  }

  vm.dispose()
})
