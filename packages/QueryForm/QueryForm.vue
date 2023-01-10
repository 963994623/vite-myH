<template>
  <el-form ref="queryForm" :inline="true" :model="queryModel">
    <template v-for="(item, index) in form" :key="index">
      <FormItem :item="item" v-bind="item" v-model="queryModel[item.model]" />
      <!-- <FormItem
        :item="item"
        :label="item.label"
        :placeholder="item.placeholder"
        v-model="queryModel[item.model]"
      /> -->
    </template>

    <el-form-item>
      <el-button type="primary" @click="handleQuery">查询</el-button>
      <el-button @click="handleReset">重置</el-button>
    </el-form-item>
  </el-form>
</template>
<script lang="ts" setup>
import FormItem from "./FormItem.vue";
import { ref, Ref, getCurrentInstance, reactive } from "vue";
import { FormInstance } from "element-plus";

let queryForm = ref<FormInstance>();

let props = defineProps<{
  form: any[];
  modelValue: any;
}>();
let emit = defineEmits(["handleQuery", "update:modelValue"]);

const ctx = getCurrentInstance();
const form = props.form;
const queryModel = reactive({
  ...props.modelValue,
});

const handleReset = () => {
  queryForm.value.resetFields();
};
const handleQuery = () => {
  emit("update:modelValue", { ...queryModel });
  emit("handleQuery");
};
</script>
