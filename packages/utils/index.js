export const sum = (a, ...args) => {
  return args.reduce((acc, curr) => acc + curr, a)
}

export const subtract = (a, ...args) => {
  return args.reduce((acc, curr) => acc - curr, a)
}

export const multiply = (a, ...args) => {
  return args.reduce((acc, curr) => acc * curr, a)
}

export const divide = (a, ...args) => {
  return args.reduce((acc, curr) => acc / curr, a)
}

// 真随机
export const random = (min, max) => {
  const arr = new Uint8Array(1);
  const [val] = window.crypto.getRandomValues(arr);
  return val
}

export { UseDate } from "./date.js"