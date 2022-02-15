import { ChannelPair, System } from '@fiber/sdk'
import { Kernel } from '@fiber/kernel'

describe('System', () => {
  beforeEach(() => {
    const kernel = new Kernel()
    System.initDirect(kernel)
  })

  test('System should be initilized', () => {
    expect(System.initialized).toBeTruthy()
  })

  test('ChannelPair can be created', () => {
    const pair = ChannelPair.create()
  })
})
