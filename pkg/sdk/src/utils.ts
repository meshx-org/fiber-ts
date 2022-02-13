export function staticImpl<T>() {
  return <U extends T>(constructor: U) => {
    constructor
  }
}

export function dispatchSyscall(namespace: string, name: string, args: any[]): void {
  const syscall = this.syscalls[namespace]
  if (syscall) {
    syscall[name](args)
  }
}
