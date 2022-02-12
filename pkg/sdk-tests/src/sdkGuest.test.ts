import { System } from "@fiber/sdk"
import { Kernel } from "@fiber/kernel"

test("Guest", () => {
  const kernel = new Kernel()

  const system = System.fromKernel(kernel)
  
  expect(system).toBeDefined()
})
