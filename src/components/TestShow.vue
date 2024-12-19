<!-- TestShow.vue -->
<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  count: Number
})

const emit = defineEmits(['update:count']);
const internalCount = ref(props.count)

// 当 prop 更新时，更新内部 state
watch(() => props.count, (newVal) => {
  console.log("父组件修改值")
    internalCount.value = newVal
})

function increment() {
  internalCount.value++
  // 发射事件
  emit('update:count', internalCount.value)
}

function decrement() {
  internalCount.value--
  // 发射事件
  emit('update:count', internalCount.value)
}

</script>

<template>
  <button @click="decrement">-</button>
  <span>子组件的值：{{ internalCount }}</span>
  <button @click="increment">+</button>
  <slot name="test" :soncount="internalCount.value"></slot>
</template>
