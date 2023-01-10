<template>
  <div class="base-table">
    <div class="action">
      <slot name="action"></slot>
    </div>
    <el-table v-bind="$attrs">
      <template v-for="item in columns" :key="item.prop">
        {{ item }}
        <el-table-column
          type="selection"
          width="55"
          v-if="item.type == 'selection'"
          key="selection"
        ></el-table-column>
        <el-table-column v-else-if="!item.type" v-bind="item"></el-table-column>
        <el-table-column v-if="item.type == 'action'" v-bind="item">
          <template #default="scope">
            <template v-for="(btn, index) in item.list" :key="index">
              <el-button
                :size="btn.size"
                :type="btn.type"
                @click="handleAction(index, scope.row)"
                >{{ btn.text }}</el-button
              >
            </template>
          </template>
        </el-table-column>
      </template>
    </el-table>
    <el-pagination
      class="pagination"
      background
      layout="prev, pager, next"
      :total="pager.total"
      :page-size="pager.pageSize"
      @current-change="handleCurrentChange"
    />
  </div>
</template>
<script lang="ts" setup>
const props = defineProps<{
  //   userList: any[];
  columns: any[];
  pager: any;
}>();
const emits = defineEmits(["handleAction", "handleCurrentChange"]);
//table多选框选中事件
const handleAction = (index: number, row: any) => {
  emits("handleAction", { index, row: { ...row } });
};

// 页码改变事件
const handleCurrentChange = (currentPage: number) => {
  emits("handleCurrentChange", currentPage);
};
</script>
