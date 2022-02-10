interface Result {
  status: number
  toString(): string
}

export interface HandleResult extends Result {
  handle: Handle
}

export interface ISyscalls {
  handleDuplicate: (handle: Handle) => HandleResult;
  handleReplace: (handle: Handle, replacement: Handle) => HandleResult;
  handleClose: (handle: Handle) => void;
}