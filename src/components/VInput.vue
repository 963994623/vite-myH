<template>
  <el-input :modelValue="username" @update:modelValue="handleInput"></el-input>
  <el-button @click="handleSubmit">提交测试</el-button>
</template>

<script lang="ts" setup>
// import { log } from "console";
import { defineProps, onMounted, ref, toRefs, defineEmits } from "vue";

const props = defineProps<{
  modelValue: string;
}>();
const emit = defineEmits(["update:modelValue", "handleSubmit"]);

let username = ref(props.modelValue);
const handleInput = (val: string) => {
  username.value = val;
  emit("update:modelValue", val);
};
const handleSubmit = () => {
  emit("handleSubmit", username);
};
</script>
