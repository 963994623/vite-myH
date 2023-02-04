<template>
  <div class="dept_manage">
    <div class="query-form">
      <el-form ref="queryform" :inline="true" :model="queryForm">
        <el-form-item prop="deptName">
          <el-input
            placeholder="请输入部门名称"
            v-model="queryForm.deptName"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDeptLists" type="primary">查询</el-button>
          <el-button @click="handleReset('queryform')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button
          type="primary"
          @click="handleCreate"
          v-has:create="'dept-create'"
          >创建</el-button
        >
      </div>
      <el-table
        :data="deptList"
        row-key="_id"
        :tree-props="{ children: 'children' }"
        stripe
      >
        <el-table-column v-for="item in columns" :key="item.prop" v-bind="item">
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button
              size="small"
              type="primary"
              @click="handleEdit(scope.row)"
              v-has:edit="'dept-edit'"
              >编辑</el-button
            >
            <el-button
              size="small"
              type="danger"
              @click="handleDelete(scope.row._id)"
              v-has:delete="'dept-delete'"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      :title="action == 'create' ? '创建部门' : '编辑部门'"
      v-model="showModal"
    >
      <el-form
        ref="dialogform"
        :model="deptForm"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item prop="parentId" label="上级部门">
          <el-cascader
            placeholder="请选择上级部门"
            v-model="deptForm.parentId"
            clearable
            :props="{ checkStrictly: true, value: '_id', label: 'deptName' }"
            :options="deptList"
            show-all-levels
          ></el-cascader>
        </el-form-item>
        <el-form-item label="部门名称" prop="deptName">
          <el-input
            placeholder="请输入部门名称"
            v-model="deptForm.deptName"
          ></el-input>
        </el-form-item>
        <el-form-item label="负责人" prop="user">
          <el-select
            placeholder="请选择部门负责人"
            v-model="deptForm.user"
            @change="handleSwitch"
          >
            <el-option
              v-for="item in userList"
              :key="item.userId"
              :label="item.userName"
              :value="`${item.userId}/${item.userName}/${item.userEmail}`"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="负责人邮箱" prop="userEmail">
          <el-input
            placeholder="请输入负责人邮箱"
            v-model="deptForm.userEmail"
            disabled
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="handleSubmit">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { reactive, Ref, ref, onMounted, nextTick } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { getdeptList, getUserAllList, deptOperate } from "../api";
import { success } from "../utils/log";

//接口
interface queryFromI {
  deptName: string;
}
interface pagerI {
  pageNum: number;
  pageSize: number;
}
interface deptFormI {
  [key: string]: string | string[] | null[];
}

// ref对象
const queryform = ref<FormInstance>();
const dialogform = ref<FormInstance>();

// 查询表单
const queryForm: queryFromI = reactive({
  deptName: "",
});
// table列表项
const columns = reactive([
  {
    label: "部门名称",
    prop: "deptName",
  },
  {
    label: "负责人",
    prop: "userName",
  },
  {
    label: "更新时间",
    prop: "updateTime",
  },
  {
    label: "创建时间",
    prop: "createTime",
  },
]);
const rules = reactive<FormRules>({
  parentId: [
    {
      required: true,
      message: "请选择上级部门",
      trigger: "blur",
    },
  ],
  deptName: [
    {
      required: true,
      message: "请输入部门名称",
      trigger: "blur",
    },
  ],
  user: [
    {
      required: true,
      message: "请选择部门负责人",
      trigger: "blur",
    },
  ],
});
// dialog表单
let deptForm: deptFormI = reactive({
  parentId: [null],
  deptName: "",
  user: "",
  userEmail: "",
});
//用户列表
let userList: Ref<any> = ref([]);
//编辑/删除状态
const action: Ref<"create" | "edit" | "delete"> = ref("create");
//dialog状态
const showModal: Ref<boolean> = ref(false);
// 分页
let pager: pagerI = reactive({
  pageNum: 1,
  pageSize: 10,
});
//部门列表
let deptList = ref([]);

onMounted(() => {
  getDeptLists();
  getUserAllLists();
});

// 查询按钮 \ 获取部门列表
const getDeptLists = async () => {
  let list = await getdeptList({ ...queryForm });
  deptList.value = list;
};
//获取用户列表
const getUserAllLists = async () => {
  let list = await getUserAllList();
  userList.value = list;
};
//handleSwitch
const handleSwitch = (val: string) => {
  const [userId, userName, userEmail] = val.split("/");
  Object.assign(deptForm, { userId: userId, userEmail, userName });
};
// 重置按钮
const handleReset = (Str: string | Ref) => {
  if (typeof Str === "string") {
    eval(Str).value.resetFields();
  } else {
    Str.value.resetFields();
  }
};
// 创建按钮
const handleCreate = () => {
  action.value = "create";
  showModal.value = true;
};
// 编辑按钮
const handleEdit = (row: any) => {
  action.value = "edit";
  showModal.value = true;
  nextTick(() => {
    Object.assign(deptForm, row, {
      user: `${row.userId}/${row.userName}/${row.userEmail}`,
    });
  });
};
// 删除按钮
const handleDelete = async (id: string) => {
  action.value = "delete";
  let res = await deptOperate({ _id: id, action: action.value });
  if (res) {
    success("删除成功");
    getDeptLists();
  }
};
//提交取消按钮
const handleClose = () => {
  showModal.value = false;
  handleReset("dialogform");
};
// 提交按钮
const handleSubmit = () => {
  dialogform.value?.validate(async (valid: boolean) => {
    if (valid) {
      let params = { ...deptForm };
      params.action = action.value;
      delete params.user;
      let res = await deptOperate(params);
      console.log(params);
      if (res) {
        success("操作成功");
        handleClose();
        handleReset("dialogform");
        getDeptLists();
      }
    }
  });
};
</script>

<style></style>
