<template>
  <div class="role-manage">
    <div class="query-form">
      <el-form ref="form" :inline="true" :model="queryForm">
        <el-form-item prop="roleName" label="角色名称">
          <el-input
            v-model="queryForm.roleName"
            placeholder="请输入角色名称"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="handleReset('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleAdd">创建</el-button>
      </div>
      <el-table width="100%" :data="roleList">
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :formatter="item.formatter"
        ></el-table-column>

        <el-table-column label="操作" width="220">
          <template #default="scope">
            <el-button @click="handleEdit(scope.row)" size="small">
              编辑
            </el-button>
            <el-button
              @click="handleOpenPermission(scope.row)"
              type="primary"
              size="small"
            >
              设置权限
            </el-button>
            <el-button
              @click="handleDel(scope.row._id)"
              type="danger"
              size="small"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination"
        background
        layout="prev,pager,next"
        :total="pager.total"
        :page-size="pager.pageSize"
        @current-change="handleCurrentChange"
      />
    </div>

    <el-dialog v-model="showModal" title="用户新增">
      <el-form
        ref="roleFormDialog"
        :model="roleDialog"
        label-width="100px"
        :rules="rules"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input
            v-model="roleDialog.roleName"
            placeholder="请输入角色名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="roleDialog.remark"
            type="textarea"
            :rows="2"
            placeholder="请输入备注"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 权限弹窗 -->
    <el-dialog v-model="showPermission" title="权限设置">
      <el-form label-width="100px" ref="ermissionDialog">
        <el-form-item label="角色名称">
          {{ curRoleName }}
        </el-form-item>
        <el-form-item label="选择权限">
          <el-tree
            node-key="_id"
            ref="permissionTree"
            default-expand-all
            show-checkbox
            :data="menuList"
            :props="{ label: 'menuName' }"
          ></el-tree>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handlePermissionClose">取消</el-button>
          <el-button type="primary" @click="handlePermission">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, Ref, onMounted, reactive, toRaw, nextTick } from "vue";
import { AxiosResponse } from "axios";
import {
  getMenuList,
  menuSubmit,
  getRoleList,
  roleOperate,
  updatePermission,
} from "../api/index";
import type { FormInstance } from "element-plus";
import util from "../utils/util";
import { success } from "../utils/log";
import { Menu } from "@element-plus/icons-vue/dist/types";

//interface
interface Menu {
  _id: string;
  parentId: string;
  menuName: string;
  menuType: number;
  icon: string;
  path: string;
  menuCode: string;
  component: string;
  menuState: number;
  children?: Menu[];
  action?: Menu[];
}
interface QueryForm {
  roleName: string;
  menuName?: string;
}
interface RoleList {
  permissionList: { [key: string]: string };
  halfCheckedKeys: { [key: string]: string };
  _id: string;
  roleName: string;
  remark: string;
  createTime: string;
  __v: number;
}
interface RoleListAndPage {
  page: {
    pageNum: number;
    pageSize: number;
    total: number;
  };
  list: RoleList[];
}

//form对象
let roleFormDialog: Ref = ref<FormInstance>();
let form = ref<FormInstance>();
let ermissionDialog: Ref = ref<FormInstance>();
let permissionTree: Ref = ref<FormInstance>();

//表单查询
const queryForm: QueryForm = reactive({
  roleName: "",
});
//角色列表
let roleList = ref([]);
//page页标
let pager = ref({
  total: 0,
  pageSize: 10,
  pageNum: 1,
});
//roleDialog
const roleDialog: Ref = ref({
  roleName: "",
});
//权限弹窗
const showPermission: Ref<boolean> = ref(false);
//权限弹窗的角色名称
let curRoleName: Ref<string> = ref("");
//权限弹窗对应角色id
let curRoleId: Ref<string> = ref("");
//菜单列表
let menuList = ref([]);
//字典遍历
let actionMaps: Ref = ref({});
//rule规则
const rules = {
  roleName: [
    {
      required: true,
      message: "请输入角色名称",
      trigger: "blur",
    },
  ],
};
//table列表项
const columns: any = reactive([
  {
    label: "角色名称",
    prop: "roleName",
    width: 150,
  },
  {
    label: "备注",
    prop: "remark",
  },
  {
    label: "权限列表",
    prop: "permissionList",
    formatter(row: any, column: any, cellValue: any) {
      let names: string[] = [];
      let list = cellValue.halfCheckedKeys || [];
      list.map((key: string) => {
        let name = actionMaps.value[key];
        if (key && name) names.push(actionMaps.value[key]);
      });
      return names.join(",");
    },
  },
  {
    label: "创建时间",
    prop: "createTime",
    formatter(row: any, column: any, value: any) {
      return util.formateDate(new Date(value));
    },
  },
  {
    label: "更新时间",
    prop: "updateTime",
    formatter(row: any, column: any, value: any) {
      return util.formateDate(new Date(value));
    },
  },
]);

//dialog开关
let showModal: Ref<boolean> = ref(false);
//增删改标识
let action: Ref<"create" | "edit" | "delete"> = ref("create");

onMounted(() => {
  getRoleLists();
  getMenuLists();
});

//获取角色列表
const getRoleLists = async (params?: any) => {
  try {
    const { list, page }: RoleListAndPage = await getRoleList({
      ...queryForm,
      ...pager.value,
    });

    roleList.value = list as any;
    pager.value.total = page.total;
  } catch (error) {}
};
// 获取菜单列表
const getMenuLists = async () => {
  let list = await getMenuList();
  menuList.value = list;
  getActionMap(list);
};
//查询按钮
const handleQuery = () => {
  let params: QueryForm = {} as any;
  Object.assign(params, queryForm);
  getRoleLists(params);
};
//重置
const handleReset = (Str: string | Ref) => {
  if (typeof Str === "string") {
    eval(Str).value.resetFields();
  } else {
    Str.value.resetFields();
  }
};
// 创建按钮
const handleAdd = () => {
  action.value = "create";
  showModal.value = true;
};
// 修改按钮
const handleEdit = (row: any) => {
  action.value = "edit";
  showModal.value = true;

  nextTick(() => {
    // roleDialog.value = { ...row };
    Object.assign(roleDialog.value, {
      _id: row._id,
      roleName: row.roleName,
      remark: row.remark,
    });
  });
};
//删除按钮
const handleDel = async (id: string) => {
  await roleOperate({ _id: id, action: "delete" });
  success("删除成功");
  getRoleLists();
};
//dialog提交
const handleSubmit = async () => {
  roleFormDialog.value.validate(async (valid: boolean) => {
    if (valid) {
      let params = { ...roleDialog.value, action: action.value };
      const res = await roleOperate(params);
      if (res) {
        showModal.value = false;
        success("创建成功");
        handleReset("roleFormDialog");
        // handleReset("form");
        getRoleLists();
      }
    }
  });
};
//dialog关闭
const handleClose = async () => {
  showModal.value = false;
  handleReset("roleFormDialog");
};
// 分页
const handleCurrentChange = (current: number) => {
  pager.value.pageNum = current;
  getRoleLists();
};

//编辑权限按钮
const handleOpenPermission = (row: any) => {
  curRoleId.value = row._id;
  curRoleName.value = row.roleName;
  showPermission.value = true;
  let { checkedKeys, halfCheckedKey } = row.permissionList;
  setTimeout(() => {
    permissionTree.value.setCheckedKeys(checkedKeys);
  });
};
//权限弹窗关闭
const handlePermissionClose = () => {
  showPermission.value = false;
};
//权限弹窗提交
const handlePermission = async () => {
  let nodes = permissionTree.value.getCheckedNodes();
  let halfKeys = permissionTree.value.getHalfCheckedKeys();
  let checkedKeys: string[] = [];
  let parentKeys: string[] = [];
  nodes.forEach((item: any) => {
    if (!item.children) {
      checkedKeys.push(item._id);
    } else {
      parentKeys.push(item._id);
    }
  });
  let params = {
    _id: curRoleId.value,
    permissionList: {
      checkedKeys,
      halfCheckedKeys: [...parentKeys, ...halfKeys],
    },
  };

  await updatePermission(params);
  showPermission.value = false;
  success("修改成功");
  getRoleLists();
};
//字典映射
const getActionMap = (list: { [k: string]: string }) => {
  let actionMap: { [k: string]: string } = {};
  const deep = (arr: Menu[]) => {
    while (arr.length) {
      let item = arr.pop();
      if (item) {
        if (item.children && item.action) {
          actionMap[item._id] = item.menuName;
        }
        if (item.children && !item.action) {
          deep(item.children);
        }
      }
    }
  };
  deep(JSON.parse(JSON.stringify(list)));
  actionMaps.value = actionMap;
};
</script>
