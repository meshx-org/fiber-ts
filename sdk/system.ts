import { HandleResult, ISyscalls } from '../../pkg/ts/sycalls'

class System implements ISyscalls {
  public handleDuplicate(handle: number): HandleResult { 
    return { handle: undefined, status: 0 }
  }

  public handleReplace(handle: number, replacement: number): HandleResult { 
    return { handle: undefined, status: 0 }
  }

  public handleClose(handle: number): void { 

  }
}