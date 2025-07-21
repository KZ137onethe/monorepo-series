export const sum = (a, ...args) => {
  return args.reduce((acc, curr) => acc + curr, a)
}

export const subtract = (a, ...args) => {
  return args.reduce((acc, curr) => acc - curr, a)
}