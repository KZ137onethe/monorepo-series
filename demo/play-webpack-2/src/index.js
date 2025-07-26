import { random } from "@monorepo-series/utils"

console.log("Hello, Webpack!");
const randomBtn = document.getElementById("randomBtn");

randomBtn.addEventListener("click", () => {
  const input = document.querySelector("#randomInput");
  input.value = random(1, 100);
});

