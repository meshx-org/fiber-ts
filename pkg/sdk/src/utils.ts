export function staticImpl<T>() {
  return <U extends T>(constructor: U) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    constructor
  }
}

export function dispatchSyscall(namespace: string, name: string, args: any[]): void {
  const syscall = this.syscalls[namespace]
  if (syscall) {
    syscall[name](args)
  }
}
