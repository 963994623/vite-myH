<template>
  <div class="user-manag">
    <div class="query-form">
      <el-form ref="form" :inline="true" :model="queryForm">
        <el-form-item prop="menuName" label="菜单名称">
          <el-input
            v-model="queryForm.menuName"
            placeholder="请输入菜单名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="菜单状态" prop="menuState">
          <el-select v-model="queryForm.menuState">
            <el-option :value="1" label="正常"></el-option>
            <el-option :value="2" label="停用"></el-option>
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
        <el-button type="primary" @click="handleAdd(1)" v-has:add="'menu-add'"
          >新增</el-button
        >
      </div>
      <el-table
        width="100%"
        row-key="_id"
        :data="menuList"
        :tree-props="{ children: 'children' }"
      >
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
            <el-button
              @click="handleAdd(2, scope.row)"
              size="small"
              v-has:add="'menu-add'"
            >
              新增
            </el-button>
            <el-button
              @click="handleEdit(scope.row)"
              type="primary"
              size="small"
              v-has:edit="'menu-edit'"
            >
              编辑
            </el-button>
            <el-button
              @click="handleDel(scope.row._id)"
              type="danger"
              size="small"
              v-has:delete="'menu-delete'"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog v-model="showModal" title="用户新增">
      <el-form
        ref="menuFormDialog"
        :model="menuDialog"
        label-width="100px"
        :rules="rules"
      >
        <el-form-item label="父级菜单" prop="parentId">
          <el-cascader
            v-model="menuDialog.parentId"
            :options="menuList"
            :props="{ checkStrictly: true, value: '_id', label: 'menuName' }"
            clearable
          />
          <span>不选则直接创建一级菜单</span>
        </el-form-item>
        <el-form-item label="菜单类型" prop="menuType">
          <el-radio-group v-model="menuDialog.menuType">
            <el-radio :label="1">菜单</el-radio>
            <el-radio :label="2">按钮</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单名称" prop="menuName">
          <el-input
            v-model="menuDialog.menuName"
            placeholder="请输入菜单名称"
          />
        </el-form-item>
        <el-form-item
          label="菜单图标"
          prop="icon"
          v-show="menuDialog.menuType == 1"
        >
          <el-input v-model="menuDialog.icon" placeholder="请输入图标" />
        </el-form-item>
        <el-form-item
          label="路由地址"
          prop="path"
          v-show="menuDialog.menuType == 1"
        >
          <el-input v-model="menuDialog.path" placeholder="请输入路由地址" />
        </el-form-item>
        <el-form-item
          label="权限标识"
          prop="menuCode"
          v-show="menuDialog.menuType == 2"
        >
          <el-input
            v-model="menuDialog.menuCode"
            placeholder="请输入权限标识"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="组件路径"
          prop="component"
          v-show="menuDialog.menuType == 1"
        >
          <el-input
            v-model="menuDialog.component"
            placeholder="请输入组件路径"
          ></el-input>
        </el-form-item>
        <el-form-item label="菜单状态" v-show="menuDialog.menuType == 1">
          <el-radio-group v-model="menuDialog.menuState">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="2">停用</el-radio>
          </el-radio-group>
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
import { ref, Ref, onMounted, reactive, toRaw, nextTick } from "vue";
import { AxiosResponse } from "axios";
import { getMenuList, menuSubmit } from "../api/index";
import util from "../utils/util";
import { success } from "../utils/log";
import type { FormInstance } from "element-plus";

//interface 接口
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
  children: Menu[];
}
interface QueryForm {
  menuState: 1 | 2;
  menuName?: string;
}

//form对象
let menuFormDialog: Ref = ref(null);
let form = ref<FormInstance>();
const queryForm: QueryForm = reactive({
  menuState: 1,
});
//菜单列表
let menuList: Ref<Menu[]> = ref([]);
//table列表项
const columns: any = reactive([
  {
    label: "菜单名称",
    prop: "menuName",
    width: 150,
  },
  {
    label: "图标",
    prop: "icon",
  },
  {
    label: "菜单类型",
    prop: "menuType",
    formatter(row: any, column: any, value: any) {
      const state: { [k: number]: string } = {
        1: "菜单",
        2: "按钮",
      };
      return state[value];
    },
  },
  {
    label: "权限标识",
    prop: "menuCode",
  },
  {
    label: "路由地址",
    prop: "path",
  },
  {
    label: "组件路径",
    prop: "component",
  },
  {
    label: "菜单状态",
    prop: "menuState",
    width: 90,
    formatter(row: any, column: any, value: any) {
      const state: { [k: number]: string } = {
        1: "启用",
        2: "禁用",
      };
      return state[value];
    },
  },
  {
    label: "创建时间",
    prop: "createTime",
    formatter(row: any, column: any, value: any) {
      return util.formateDate(new Date(value));
    },
  },
]);

//dialog开关
let showModal: Ref<boolean> = ref(false);

//dialog对象
let menuDialog: any = reactive({
  menuState: 1,
  menuType: 1,
  parentIf: [null],
});

//编辑 创建 删除选项
const action: Ref<"add" | "edit" | "delete"> = ref("add");

//dialog规则
const rules: any = reactive({
  menuName: [
    { required: true, message: "请输入菜单名称", trigger: "blur" },
    { min: 2, max: 10, message: "长度在 2 到 10 个字符", trigger: "blur" },
  ],
});

onMounted(() => {
  getMenu();
});

//获取左侧列表
const getMenu = async (params?: any) => {
  try {
    const list: AxiosResponse = await getMenuList(params);
    menuList.value = list as any;
  } catch (error) {}
};
//查询按钮
const handleQuery = () => {
  let params: QueryForm = {} as any;
  Object.assign(params, queryForm);
  getMenu(params);
};
//重置dialog
const handleReset = (Str: string | Ref) => {
  if (typeof Str === "string") {
    eval(Str).value.resetFields();
  } else {
    Str.value.resetFields();
  }
};
//添加按钮
const handleAdd = (type: any, row?: any) => {
  showModal.value = true;
  action.value = "add";
  nextTick(() => {
    if (type == 2) {
      menuDialog.parentId = [...row.parentId, row._id].filter((item) => {
        return item;
      });
      // console.log(menuDialog);
      // console.log(row);
    }
  });
};
//编辑按钮
const handleEdit = (row: any) => {
  showModal.value = true;
  action.value = "edit";

  nextTick(() => {
    Object.assign(menuDialog, row);
  });
};
//删除按钮
const handleDel = async (_id: string) => {
  await menuSubmit({ _id, action: "delete" });
  success("删除成功");
  getMenu();
};
//dialog提交
const handleSubmit = () => {
  menuFormDialog.value.validate(async (valid: any) => {
    if (valid) {
      let params = { ...menuDialog, action: action.value };
      let res = await menuSubmit(params);
      showModal.value = false;
      success("操作成功");
      handleReset("menuFormDialog");
      getMenu();
    }
  });
};
//关闭dialog
const handleClose = () => {
  showModal.value = false;
  handleReset("menuFormDialog");
};
</script>
