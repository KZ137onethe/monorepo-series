import { multiply, divide } from "@monorepo-series/utils";

console.log("Hello, Webpack!");

const appEl = document.querySelector("#app")

const elVal1 = appEl.querySelector("#el-val1")
const elVal2 = appEl.querySelector("#el-val2")

const btnMultiply = appEl.querySelector("#btn-multiply");
const btnDivide = appEl.querySelector("#btn-divide");

btnMultiply.addEventListener("click", () => {
  const result = multiply(elVal1.value, elVal2.value);
  console.log("💬 ⋮ elVal2 => ", elVal2.value)
  console.log("💬 ⋮ elVal1 => ", elVal1.value)
  alert(`Multiply Result: ${result}`);
})

btnDivide.addEventListener("click", () => {
  const result = divide(elVal1.value, elVal2.value);
  console.log(`Divide Result: ${result}`);
})