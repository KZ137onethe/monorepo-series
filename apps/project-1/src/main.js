import { sum } from "@monorepo/utils"
import { createButton } from "@monorepo/ui"

const oApp = document.querySelector("#app")
const btn = createButton({ text: "haha" })

oApp.innerHTML = btn

console.log(sum(1, 2))