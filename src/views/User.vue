<template>
  <div class="user-manag">
    <div class="query-form">
      <el-form ref="form" :inline="true" :model="user">
        <el-form-item prop="userId" label="用户ID">
          <el-input v-model="user.userId" placeholder="请输入用户ID"></el-input>
        </el-form-item>
        <el-form-item label="用户名称" prop="userName">
          <el-input
            v-model="user.userName"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户状态" prop="state">
          <el-select v-model="user.state">
            <el-option :value="0" label="所有"></el-option>
            <el-option :value="1" label="在职"></el-option>
            <el-option :value="2" label="离职"></el-option>
            <el-option :value="3" label="试用期"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="handleReset('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleCreate" v-has:add="'user-add'"
          >新增</el-button
        >
        <el-button
          type="danger"
          @click="handlePatchDel"
          v-has:allDelete="'user-allDelete'"
          >批量删除</el-button
        >
      </div>
      <el-table
        width="100%"
        :data="userList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column
          v-for="item in columns"
          :prop="item.prop"
          :label="item.label"
          :key="item.prop"
          :width="item.width"
          :formatter="item.formatter"
        />
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button
              size="small"
              @click="handleEdit(scope.row)"
              v-has:edit="'user-edit'"
              >编辑</el-button
            >
            <el-button
              type="danger"
              size="small"
              @click="handleDel(scope.row)"
              v-has:delete="'user-delete'"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @current-change="handleCurrentChange"
        class="pagination"
        background
        layout="prev, pager, next"
        :total="pager.total"
      />
    </div>
    <el-dialog v-model="dialogVisible" title="用户新增">
      <el-form
        ref="userFormDialog"
        :model="userDialog"
        label-width="100px"
        :rules="rules"
      >
        <el-form-item label="用户名" prop="userName">
          <el-input
            v-model="userDialog.userName"
            placeholder="请输入用户名称"
            :disabled="action == 'edit'"
          />
        </el-form-item>
        <el-form-item label="邮箱" prop="userEmail">
          <el-input
            v-model="userDialog.userEmail"
            placeholder="请输入用户邮箱"
            :disabled="action == 'edit'"
          >
            <template #append> @qq.com </template>
          </el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="userDialog.mobile" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="岗位" prop="job">
          <el-input v-model="userDialog.job" placeholder="请输入岗位" />
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-select v-model="userDialog.state" style="position: fixed">
            <el-option :value="1" label="在职"></el-option>
            <el-option :value="2" label="离职"></el-option>
            <el-option :value="3" label="试用期"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="系统角色" prop="roleList">
          <el-select v-model="userDialog.roleList" multiple style="width: 100%">
            <el-option
              v-for="item in roleList"
              :key="item._id"
              :label="item.roleName"
              :value="item._id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门" prop="deptId">
          <el-cascader
            style="width: 100%"
            v-model="userDialog.deptId"
            :options="deptList"
            placeholder="请选择所属部门"
            :props="{ checkStrictly: true, value: '_id', label: 'deptName' }"
            clearable
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import {
  onMounted,
  reactive,
  Ref,
  ref,
  UnwrapNestedRefs,
  getCurrentInstance,
  toRaw,
  nextTick,
} from "vue";
import {
  getUserList,
  UserDel,
  getRoleAllList,
  getdeptList,
  userSubmit,
} from "../api";
import { success, error } from "../utils/log";
import type { FormRules } from "element-plus";
import util from "../utils/util";

//接口定义
interface Columns {
  //表格th
  prop: string;
  label: string;
  width?: number | string;
  formatter?: (row: any, column: any, cellValue: any) => any;
}
//用户查询
interface UserQuery {
  userId: string;
  userName: string;
  state: number;
}

//用户数据
interface User {
  createTime: string;
  deptId: {
    [index: number]: string;
  };
  job: string;
  lastLoginTime: string;
  mobile: number;
  role: number;
  roleList: {
    [index: number]: string;
  };
  state: number;
  userEmail: string;
  userId: number;
  userName: string;
}
// dialog数据
interface UserDiaLog {
  userName: string;
  userEmail: string;
  mobile: string;
  job: string;
  state: number;
  roleList: string[];
  deptId: string[];
  action?: "add" | "edit" | string;
}
//dialog all角色列表
interface RoleList {
  _id: string;
  roleName: string;
}
//dialog all部门列表
interface DeptList {
  _id: string;
  deptName: string;
}

//ref对象
const form = ref(0);
const userFormDialog = ref(0);

//user查询数据
const user: UserQuery = reactive({
  userId: "",
  userName: "",
  state: 0,
});

//用户数据
const userList: Ref<User[]> = ref([]);

//表格th项
//@ts-ignore
const columns: Columns[] = reactive([
  {
    label: "用户ID",
    prop: "userId",
    width: 180,
  },
  {
    label: "用户名称",
    prop: "userName",
    width: 180,
  },
  {
    label: "用户邮箱",
    prop: "userEmail",
  },
  {
    label: "用户角色",
    prop: "role",
    formatter(row, column, cellValue) {
      const state: { [k: number]: string } = {
        0: "管理员",
        1: "普通用户",
      };
      return state[cellValue];
    },
  },
  {
    label: "用户状态",
    prop: "state",
    formatter(row, column, cellValue) {
      const state: { [k: number]: string } = {
        1: "在职",
        2: "离职",
        3: "试用期",
      };
      return state[cellValue];
    },
  },
  {
    label: "注册时间",
    prop: "createTime",
    formatter(row, column, cellValue) {
      return util.formateDate(new Date(cellValue));
    },
  },
  {
    label: "最后登录时间",
    prop: "lastLoginTime",
    formatter(row, column, cellValue) {
      return util.formateDate(new Date(cellValue));
    },
  },
]);
//dialog状态
const dialogVisible = ref(false);
//dialog数据
const userDialog: UserDiaLog = reactive({
  userName: "",
  userEmail: "",
  mobile: "",
  job: "",
  state: 1,
  roleList: [],
  deptId: [],
});

//dialog all角色列表
const roleList: Ref<RoleList[]> = ref([]);
//dialog all部门列表
const deptList: Ref<DeptList[]> = ref([]);
//dialog表单规则
const rules = reactive<FormRules>({
  userName: [
    { required: true, message: "请输入用户名称", trigger: "blur" },
    { min: 2, max: 10, message: "长度在 2 到 10 个字符", trigger: "blur" },
  ],
  userEmail: [{ required: true, message: "请输入用户邮箱", trigger: "blur" }],
  mobile: [
    { required: true, message: "请输入手机号", trigger: "blur" },
    {
      pattern: /^1[3456789]\d{9}$/,
      message: "手机号格式不正确",
      trigger: "blur",
    },
  ],
  deptId: [{ required: true, message: "请选择所属部门", trigger: "blur" }],
});

//check选中的数据
let checkedUserIds = ref([]);
//定义添加还是修改
const action = ref("add");
//显示page数量
const pager: { pageNum: number; pageSize: number; total?: number } = reactive({
  pageNum: 1,
  pageSize: 10,
});

onMounted(() => {
  getUserLists();
  getDeptLists();
  getRoleAllLists();
});
//获取user用户数据列表
const getUserLists = async () => {
  let params = { ...user, ...pager };
  try {
    const { list, page } = (await getUserList(params)) as any;
    userList.value = list;
    pager.total = page.total;
    console.log(list);
  } catch (e) {
    console.log(e);
  }
};
//分页事件处理
const handleCurrentChange = (current: number) => {
  pager.pageNum = current;
  getUserLists();
};

//多选框事件
const handleSelectionChange = (value: any) => {
  const arr: any = [];
  value.map((item: any) => {
    arr.push(item.userId);
  });
  checkedUserIds.value = arr;
};

//单条删除数据
const handleDel = async (row: any) => {
  const params = {
    userIds: [row.userId],
  };

  try {
    await UserDel(params);
    success("删除成功");
    getUserLists();
  } catch (err) {
    console.log(err);
  }
};
//批量删除
const handlePatchDel = async () => {
  if (checkedUserIds.value.length == 0) {
    error("请选择要删除的用户");
    return;
  }
  const params = {
    userIds: checkedUserIds.value,
  };
  try {
    const res: any = await UserDel(params);
    console.log(res);

    if (res.modifiedCount > 0) {
      success(`删除成功 共${res.modifiedCount}条`);
      getUserLists();
    } else {
      error("删除失败");
    }
  } catch (err) {
    error(err as string);
  }
};

//新增按钮
const handleCreate = () => {
  dialogVisible.value = true;
  action.value = "add";
};
//获取部门列表
const getDeptLists = async () => {
  let list = (await getdeptList({})) as any;
  deptList.value = list;
};
//获取角色列表
const getRoleAllLists = async () => {
  let list = (await getRoleAllList()) as any;
  roleList.value = list;
};
// 查询
const handleQuery = () => {
  getUserLists();
};
//重置
const handleReset = (forms: string) => {
  // (forms as Ref).value.resetFields();
  console.log(forms);

  if (typeof forms == "string") {
    (eval(forms) as Ref).value.resetFields();
  } else {
    (forms as Ref).value.resetFields();
  }
};
//编辑按钮
const handleEdit = (data: UserDiaLog) => {
  action.value = "edit";
  dialogVisible.value = true;

  nextTick(() => {
    Object.assign(userDialog, data);
  });
};
// dialog取消
const handleClose = () => {
  dialogVisible.value = false;
  handleReset("userFormDialog");
};

//dialog提交
const handleSubmit = () => {
  (userFormDialog as any).value.validate(async (valid: boolean) => {
    if (valid) {
      let params = toRaw(userDialog);
      console.log(params);

      params.userEmail += "@qq.com";
      params.action = action.value;
      const res = await userSubmit(params);

      if (res) {
        dialogVisible.value = false;
        success("用户创建成功");
        handleReset("userFormDialog");
        getUserLists();
      }
    }
  });
};
</script>
