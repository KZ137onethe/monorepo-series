<script setup>
import { ref, computed, onMounted } from "vue"
import { sum, subtract, UseDate } from "@monorepo-series/utils"

const val1 = ref("")
const val2 = ref("")

const btnDisabled = computed(() => ![val1, val2].every(val => typeof val.value === "number"))
const now = ref(UseDate.format(new Date()))

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

onMounted(() => {
	setInterval(() => {
		now.value = UseDate.format(new Date())
	}, 1000)
})
</script>

<template>
  <div class="page-index">
    <h5 class="title">计数器</h5>
    <div class="counter-container">
			<div class="input-container">
				<input type="number" v-model="val1" placeholder="请输入val1" />
				<input type="number" v-model="val2" placeholder="请输入val2" />
			</div>

      <div class="btn-group">
        <button :disabled="btnDisabled" @click="addValues">相加</button>
        <button :disabled="btnDisabled" @click="subtractValues">相减</button>
      </div>
    </div>
		<hr>
		<h5 class="title">接口数据获取</h5>
		<div>
			<button id="getFruitBtn" @click="getFruitFn">水果数据</button>
		</div>
		<div class="bottom-lock">{{ now }}</div>
  </div>

</template>

<style lang="scss" scoped>
.page-index {
	position: relative;
	min-height: 100vh;
	border: 10px solid transparent;
}

.title {
	font-size: 1.5rem;
	margin: 0 0 10px;
}

.counter-container {
	margin: 0;
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

.bottom-lock {
	position: fixed;
	bottom: 1rem;
	right: 0.5rem;
}
</style>