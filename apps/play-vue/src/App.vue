<script setup>
import { ref } from "vue"
import { sum, subtract } from "@monorepo-series/utils"

const title = "Hello, Vue"

const val1 = ref("")
const val2 = ref("")

function addValues() {
  const num1 = parseFloat(val1.value)
  const num2 = parseFloat(val2.value)
  if (!isNaN(num1) && !isNaN(num2)) {
    alert(`结果: ${sum(num1, num2)}`)
  } else {
    alert("请输入有效的数字")
  }
}

function subtractValues() {
  const num1 = parseFloat(val1.value)
  const num2 = parseFloat(val2.value)
  if (!isNaN(num1) && !isNaN(num2)) {
    alert(`结果: ${subtract(num1, num2)}`)
  } else {
    alert("请输入有效的数字")
  }
}
</script>

<template>
  <div class="page-index">
    <span>{{ title }}</span>
    <div>
      <input v-model="val1" placeholder="请输入val1" />
      <input v-model="val2" placeholder="请输入val2" />
      <div>
        <button @click="addValues">相加</button>
        <button @click="subtractValues">相减</button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>