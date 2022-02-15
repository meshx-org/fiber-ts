import { Kernel } from './kernel'

test('Testing kernel creation', () => {
  const kern = new Kernel()

  expect(kern).toBeDefined()
})
