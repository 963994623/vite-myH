<template>
  <el-form-item :prop="item.model">
    <el-input v-if="item.type == 'input'" v-bind="$attrs"></el-input>
    <!-- <el-input
      v-if="item.type == 'input'"
      type="textare"
      :placeholder="($attrs as any).placeholder"
      :modelValue="$attrs.modelValue"
      @update:modelValue="$attrs['onUpdate:modelValue']"
    ></el-input> -->
    <el-select v-else-if="item.type == 'select'" v-bind="$attrs">
      <el-option
        v-for="option in item.options"
        :key="option.value"
        v-bind="option"
      ></el-option>
    </el-select>
  </el-form-item>
</template>

<script lang="ts" setup>
import { onMounted, useAttrs } from "vue";
let props = defineProps<{
  item: any;
}>();
let Attr = useAttrs();
// console.log(Attr);
</script>
