import { System } from "@fiber/sdk"

const hostCall = () => {
  return {}
}

test("Host", () => {
  const kern = System.fromSyscall(hostCall)

  expect(kern).toBeDefined()
})
