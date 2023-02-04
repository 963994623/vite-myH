<template>
  <div class="user-manag">
    <div class="query-form">
      <!-- <el-form ref="form" :inline="true" :model="user">
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
      </el-form> -->
      <QueryForm :form="formItemArr" v-model="com" @handleQuery="handleQuery" />
    </div>
    <BaseTable
      :columns="columns"
      :data="comList"
      :pager="pager"
      @handleCurrentChange="handleCurrentChange"
      @handleAction="handleAction"
      @selection-change="handleSelectionChange"
    >
      <template v-slot:action>
        <el-button type="primary" @click="handleCreate" v-has:add="'user-add'"
          >新增</el-button
        >
        <el-button
          type="danger"
          @click="handlePatchDel"
          v-has:allDelete="'user-allDelete'"
          >批量删除</el-button
        >
      </template></BaseTable
    >
    <el-dialog v-model="elDialogSH">
      <el-form ref="comDialog" :model="comDialogData" :rules="rules">
        <el-form-item label="商品id">
          <el-input
            v-model="comDialogData.goods_id"
            placeholder="请输入商品id"
            :disabled="buttonState == 'create' || buttonState == 'edit'"
          />
        </el-form-item>
        <el-form-item label="商品名称" prop="goods_name">
          <el-input
            v-model="comDialogData.goods_name"
            placeholder="请输入商品名称"
          />
        </el-form-item>
        <el-form-item label="商品价格" prop="goods_price">
          <el-input
            v-model="comDialogData.goods_price"
            placeholder="请输入价格"
          />
        </el-form-item>
        <el-form-item label="商品余量" prop="goods_number">
          <el-input
            v-model="comDialogData.goods_number"
            placeholder="请输入余量"
          />
        </el-form-item>
        <el-form-item label="下架\上架">
          <el-switch
            active-value="0"
            inactive-value="1"
            v-model="comDialogData.is_del"
          />
        </el-form-item>
        <el-form-item label="商品详情xml" prop="goods_introduce">
          <!-- <el-input
            v-model="comDialogData.goods_introduce"
            placeholder="请输入详情xml"
          /> -->
          <el-input v-model="comDialogData.goods_introduce" type="textarea" />
        </el-form-item>
        <el-form-item label="商品大图url" prop="goods_big_logo">
          <el-input
            v-model="comDialogData.goods_big_logo"
            placeholder="请输入大图路径"
          />
        </el-form-item>
        <el-form-item label="商品小图url" prop="goods_small_logo">
          <el-input
            v-model="comDialogData.goods_small_logo"
            placeholder="请输入小图路径"
          />
        </el-form-item>
        <el-form-item label="商品热度" prop="hot_mumber">
          <el-input
            v-model="comDialogData.hot_mumber"
            placeholder="请调整热度"
          />
        </el-form-item>
        <el-form-item label="商品分类" prop="goods_cat">
          <el-cascader
            v-model="comDialogData.goods_cat"
            :options="catListOptions"
            :props="{ value: 'cat_id', label: 'cat_name' }"
          />
        </el-form-item>
        <el-form-item
          v-for="(item, index) in comDialogData.pics"
          :key="item.key"
          :label="'图片列表' + index"
          style="display: flex; flex-wrap: wrap"
        >
          <div>
            <!-- <span>图片大图</span>
            <el-input v-model="item.pics_big" /> -->
            <el-form-item
              :prop="`pics.${index}.pics_big`"
              label="图片大图"
              :rules="{
                required: true,
                message: '请输入大图路径',
                trigger: 'blur',
              }"
            >
              <el-input v-model="item.pics_big" />
            </el-form-item>
          </div>
          <div>
            <el-form-item
              :prop="`pics.${index}.pics_mid`"
              label="图片大图"
              :rules="{
                required: true,
                message: '请输入中图路径',
                trigger: 'blur',
              }"
            >
              <el-input v-model="item.pics_mid" />
            </el-form-item>
          </div>
          <div>
            <el-form-item
              :prop="`pics.${index}.pics_sma`"
              label="图片小图"
              :rules="{
                required: true,
                message: '请输入小图路径',
                trigger: 'blur',
              }"
            >
              <el-input v-model="item.pics_sma" />
            </el-form-item>
          </div>

          <div style="display: block">
            <el-button class="mt-2" @click.prevent="removePics(item)"
              >删除</el-button
            >
          </div>
        </el-form-item>
        <el-form-item
          v-for="(item, index) in comDialogData.attrs"
          :key="item.key"
          :label="'详情列表' + index"
          prop="attrs"
          style="display: flex; flex-wrap: wrap"
        >
          <div>
            <el-form-item :prop="`attrs.${index}.attr_name`" label="详情标题">
              <el-input v-model="item.attr_name" />
            </el-form-item>
          </div>
          <div>
            <el-form-item :prop="`attrs.${index}.attr_vals`" label="详情介绍">
              <el-input v-model="item.attr_vals" />
            </el-form-item>
          </div>
          <div style="display: block">
            <el-button class="mt-2" @click.prevent="removeAttrs(item)"
              >删除</el-button
            >
          </div>
        </el-form-item>
        <el-form-item class="right">
          <el-button type="primary" @click="submit">提交</el-button>
          <el-button @click="addPics">添加pics项</el-button>
          <el-button @click="addAttrs">添加attrs项</el-button>
          <el-button @click="resetForm">重置</el-button>
          <el-button @click="closeForm">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, nextTick } from "vue";
import util from "../utils/util";

import QueryForm from "../../packages/QueryForm";
import BaseTable from "../../packages/BaseTable";
import { ElMessage } from "element-plus";

import {
  getComList,
  getComClassList,
  createAndEidtCom,
  deleteChecked,
} from "../api/index";

import { comI, comPicsI, comAttrsI } from "../tsInter/com";

import { FormInstance, FormRules } from "element-plus";

onMounted(() => {
  getComLists();
  getComClassLists();
});

// form 表单实例
const comDialog = ref<FormInstance>();

// 查询组件数据
const com = ref({
  comId: "",
  comName: "",
  comState: 0,
});

// 多选框 选中
const checked_id = ref([]);

// dialog数据
const comDialogData = ref<comI>({
  _id: "0",
  goods_id: 0,
  goods_name: "",
  goods_price: 0,
  goods_number: 0,
  goods_introduce: "",
  goods_big_logo: "",
  goods_small_logo: "",
  is_del: "0",
  hot_mumber: 0,
  goods_cat: [],
  attrs: [],
  pics: [],
});

// el-dia 显示隐藏
const elDialogSH = ref(false);

const buttonState = ref<"create" | "edit" | "delete">("create");

// 分类信息
const catListOptions = ref([]);

//显示page数量
const pager: { pageNum: number; pageSize: number; total?: number } = reactive({
  pageNum: 1,
  pageSize: 10,
});

// 表格数据
const comList = ref();

// 获取表格数据
const getComLists = async () => {
  let params = { ...com.value, ...pager };
  const data = await getComList(params);
  comList.value = data.list;
  pager.total = data.page.total;
};

// 获取分类数据
const getComClassLists = async () => {
  const data = await getComClassList({});
  catListOptions.value = data;
};

// 查询组件回传
const handleQuery = () => {
  getComLists();
};

//表单页码组件回传
const handleCurrentChange = (num: number) => {
  pager.pageNum = num;
  getComLists();
};

// 表单内按钮组件回传
const handleAction = (data: {
  index: number;
  row: { [P in string]: number };
}) => {
  //修改
  if (data.index == 0) {
    buttonState.value = "edit";
    elDialogSH.value = true;
    console.log(typeof data.row.cat_one_id);

    nextTick(() => {
      Object.assign(comDialogData.value, data.row);
      comDialogData.value.goods_cat = [
        data.row.cat_one_id,
        data.row.cat_two_id,
        data.row.cat_three_id,
      ];
    });
  }
};

// select选中框
const handleSelectionChange = (e: comI[]) => {
  const arr: any = [];
  e.map((item: any) => {
    arr.push(item.goods_id);
  });
  checked_id.value = arr;
};

// 创建按钮
const handleCreate = () => {
  buttonState.value = "create";
  elDialogSH.value = true;
};

// 批量删除
const handlePatchDel = async () => {
  try {
    const data = await deleteChecked({ idList: checked_id.value });
    getComLists();
    ElMessage({
      message: "删除成功",
      type: "success",
    });
  } catch (e) {
    ElMessage({
      message: "删除失败",
      type: "error",
    });
  }
};

// dialog增加pics表单项
const addPics = () => {
  comDialogData.value.pics.push({
    key: Date.now(),
    pics_big: "",
    pics_mid: "",
    pics_sma: "",
  });
};
// dialog增加attr表单项
const addAttrs = () => {
  comDialogData.value.attrs.push({
    key: Date.now(),
    attr_name: "",
    attr_vals: "",
  });
};

// dialog删除pics表单项
const removePics = (item: comPicsI) => {
  const index = comDialogData.value.pics.indexOf(item);

  comDialogData.value.pics.splice(index, 1);
};

// dialog删除attrs表单项
const removeAttrs = (item: comAttrsI) => {
  const index = comDialogData.value.attrs.indexOf(item);

  comDialogData.value.attrs.splice(index, 1);
};

// dialog 重置表单
const resetForm = () => {
  comDialog.value?.resetFields();
  comDialogData.value.attrs = [];
  comDialogData.value.pics = [];
};

// dialog 关闭
const closeForm = () => {
  resetForm();
  elDialogSH.value = false;
};

// 表单提交
const submit = async () => {
  comDialog.value?.validate(async (isValid: any) => {
    if (isValid) {
      console.log(1);

      const data = await createAndEidtCom({
        ...comDialogData.value,
        active: buttonState.value,
      });
      if (data.code == 200) {
        elDialogSH.value = false;
        resetForm();
        getComLists();
        ElMessage({
          message: "创建/修改成功",
          type: "success",
        });
      }
    }
  });
};

// 表单重置封装
// const resetF = ()=>{
//   comDialog.value?.resetFields();
//   comDialogData.value.attrs = [];
//   comDialogData.value.pics = [];
// }

// 封装组件传值
const formItemArr = [
  {
    type: "input",
    label: "商品id",
    model: "comId",
    placeholder: "请输入商品id",
  },
  {
    type: "input",
    label: "商品名称",
    model: "comName",
    placeholder: "请输入商品名称",
  },
  {
    type: "select",
    label: "状态",
    model: "comState",
    placeholder: "请选择状态",
    options: [
      {
        label: "所有",
        value: 0,
      },
      {
        label: "在售",
        value: 1,
      },
      {
        label: "下架",
        value: 2,
      },
    ],
  },
];

// 封装表格组件传值
const columns = reactive([
  {
    type: "selection",
  },
  {
    label: "商品id",
    prop: "goods_id",
    width: 180,
  },
  {
    label: "商品名称",
    prop: "goods_name",
  },
  {
    label: "注册时间",
    prop: "add_time",
    formatter(row: any, column: any, cellValue: string) {
      return util.formateDate(new Date(cellValue));
    },
  },
  {
    label: "修改时间",
    prop: "upd_time",
    formatter(row: any, column: any, cellValue: string) {
      return util.formateDate(new Date(cellValue));
    },
  },
  {
    type: "action",
    label: "操作",
    list: [
      {
        text: "编辑",
        size: "small",
        has: "edit",
        menu: "com",
      },
    ],
  },
]);

// 表单规则
const rules = reactive<FormRules>({
  goods_name: [
    {
      required: true,
      message: "请填写商品名称",
      trigger: "blur",
    },
  ],
  goods_price: [
    {
      required: true,
      message: "请填写价格(￥)",
      trigger: "blur",
    },
  ],
  goods_number: [
    {
      required: true,
      message: "请填写价格(￥)",
      trigger: "blur",
    },
  ],
  goods_introduce: [
    {
      required: true,
      message: "请填写xml商品详情介绍",
      trigger: "blur",
    },
  ],
  goods_big_logo: [
    {
      required: true,
      message: "请填写大图logo路径",
      trigger: "blur",
    },
  ],
  goods_small_logo: [
    {
      required: true,
      message: "请填写小图logo路径",
      trigger: "blur",
    },
  ],
  goods_cat: [
    {
      required: true,
      message: "请选择商品分类",
      trigger: "blur",
    },
  ],
  pics_big: [
    {
      required: true,
      message: "请填写大图路径",
      trigger: "blur",
    },
  ],
});
</script>
<style lang="scss" scoped>
:deep(.el-form-item__content) {
  display: block;
}
.right :deep(.el-form-item__content) {
  display: flex;
  justify-content: right;
}
</style>
