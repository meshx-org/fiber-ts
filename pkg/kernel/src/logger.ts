export interface ILogger {
  log: (...args: unknown[]) => void
}

export function createKernelLogger(): ILogger {
  return {
    log: (...args: unknown[]) => console.log('[syscall]:', ...args)
  }
}
