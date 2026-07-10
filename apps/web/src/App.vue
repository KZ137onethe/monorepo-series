<script setup>
import { ref, computed } from "vue"
import { sum, subtract } from "@monorepo-series/utils"

const val1 = ref("")
const val2 = ref("")

const btnDisabled = computed(() => ![val1, val2].every(val => typeof val.value === "number"))

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

async function getFruitFn() {
  return fetch("/api/fruit", { method: "GET", headers: { "Content-Type": "application/json" } })
    .then((response) => response.json())
    .then((resp) => {
      const { data } = resp
      alert(`获取到的水果数据: ${JSON.stringify(data)}`)
    })
    .catch((error) => {
      console.error("获取水果数据失败:", error)
      alert("获取水果数据失败")
    })
}
</script>

<template>
  <div class="page-index">
    <h5 class="title">计数器</h5>
    <div class="app-container">
			<div class="input-container">
				<input type="number" v-model="val1" placeholder="请输入val1" />
				<input type="number" v-model="val2" placeholder="请输入val2" />
			</div>

      <div class="btn-group">
        <button :disabled="btnDisabled" @click="addValues">相加</button>
        <button :disabled="btnDisabled" @click="subtractValues">相减</button>
      </div>
    </div>
		<h5 class="title">接口数据获取</h5>
		<div>
			<button id="getFruitBtn" @click="getFruitFn">水果数据</button>
		</div>
  </div>
</template>

<style lang="scss" scoped>
.page-index {
	margin: 0 20px;
}

.title {
	font: {
		size: 1.5rem;
		font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
	}
	margin: 1rem 0;
}

.app-container {
	.input-container {
		input:nth-child(n+2) {
			margin-left: 10px;
		}
	}

	.btn-group {
		button:nth-child(n+2) {
			margin-left: 8px;
		}
	}
}

</style>