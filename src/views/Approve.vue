<template>
  <div class="user-manage">
    <div class="query-form">
      <el-form ref="form" :inline="true" :model="queryForm">
        <el-form-item prop="applyState">
          <el-select v-model="queryForm.applyState">
            <el-option value="" label="全部"></el-option>
            <el-option value="1" label="待审批"></el-option>
            <el-option value="2" label="审批中"></el-option>
            <el-option value="3" label="审批拒绝"></el-option>
            <el-option value="4" label="审批通过"></el-option>
            <el-option value="5" label="作废"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getApplyLists">查询</el-button>
          <el-button @click="handleReset('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action"></div>
      <el-table :data="applyList">
        <el-table-column
          v-for="item in columns"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :key="item.prop"
          :formatter="item.formatter"
        ></el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button
              @click="handleDetail(scope.row)"
              size="small"
              v-if="
                scope.row.curAuditUserName == userInfo.userName &&
                [1, 2].includes(scope.row.applyState)
              "
              >审核</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="pager.total"
        @current-change="handleChange"
        class="pagination"
      />
    </div>
    <el-dialog
      title="审核"
      width="50%"
      v-model="showDetailModal"
      destroy-on-close
    >
      <el-form
        ref="dialogForm"
        :model="auditForm"
        label-width="120px"
        label-suffix=":"
        :rules="rules"
      >
        <el-form-item label="申请人">
          <div>{{ detail.applyUser.userName }}</div>
        </el-form-item>
        <el-form-item label="休假类型">
          <div>{{ detail.applyTypeName }}</div>
        </el-form-item>
        <el-form-item label="休假时间">
          <div>{{ detail.time }}</div>
        </el-form-item>
        <el-form-item label="休假时长">
          <div>{{ detail.leaveTime }}</div>
        </el-form-item>
        <el-form-item label="休假原因">
          <div>{{ detail.reasons }}</div>
        </el-form-item>
        <el-form-item label="审批状态">
          <div>{{ detail.applyStateName }}</div>
        </el-form-item>
        <el-form-item label="审批人">
          <div>{{ detail.curAuditUserName }}</div>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            type="textarea"
            v-model="auditForm.remark"
            :rows="3"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleApprove('pass')">审核通过</el-button>
          <el-button type="primary" @click="handleApprove('refuse')"
            >驳回</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, reactive, Ref, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

import type { FormInstance, FormRules } from "element-plus";
import util from "../utils/util";
import { getApplyList, leaveOperate, leaveApprove } from "../api";
import { error, success } from "../utils/log";
const router = useRouter();
const store = useStore();
interface applyTypeI {
  [key: number]: string;
}
// detail
interface detailI {
  _id?: string;
  applyType: number;
  applyTypeName?: string;
  applyState: number;
  applyStateName?: string;
  curAuditUserName?: string;
  endTime: string;
  leaveTime: string;
  reasons: string;
  startTime: string;
  time?: string;
  value?: string;
  applyUser: {
    userName: string;
  };
}

// form ref对象
const form = ref<FormInstance>();
const dialogForm = ref<FormInstance>();

// 查询表单对象
let queryForm = reactive({
  applyState: "1",
});
const applyList = ref([]);

//页脚数据
const pager = reactive({
  pageNum: 1,
  pageSize: 10,
  total: 0,
});

//dialog弹窗
const showDetailModal: Ref<boolean> = ref(false);

// 当前登录用户
let userInfo = computed({
  get() {
    return store.state.userInfo;
  },
  set() {},
});
//dialog表单内容
let detail: Ref<detailI> = ref({
  _id: "",
  applyType: 0,
  applyState: 0,
  curAuditUserName: "",
  endTime: "",
  leaveTime: "",
  reasons: "",
  startTime: "",
  applyUser: {
    userName: "",
  },
});
const auditForm = reactive({
  remark: "",
});

//table列表项
const columns = reactive([
  {
    label: "单号",
    prop: "orderNo",
  },
  {
    label: "申请人",
    prop: "applyUserName",
    formatter: (row: any) => {
      return row.applyUser.userName;
    },
  },
  {
    label: "休假时间",
    prop: "",
    formatter(row: any) {
      return (
        util.formateDate(new Date(row.startTime), "yyyy-MM-dd") +
        "到" +
        util.formateDate(new Date(row.endTime), "yyyy-MM-dd")
      );
    },
  },
  {
    label: "休假时长",
    prop: "leaveTime",
  },
  {
    label: "休假类型",
    prop: "applyType",
    formatter: (row: any, column: any, value: number) => {
      const obj: applyTypeI = {
        1: "事假",
        2: "调休",
        3: "年假",
      };
      return obj[value];

      //   return 3;
    },
  },
  {
    label: "休假原因",
    prop: "reasons",
  },
  {
    label: "申请时间",
    prop: "createTime",
    width: 180,
    formatter(row: any) {
      return util.formateDate(new Date(row.startTime), "yyyy-MM-dd");
    },
  },
  {
    label: "审批人",
    prop: "auditUsers",
  },
  {
    label: "当前审批人",
    prop: "curAuditUserName",
  },
  {
    label: "审批状态",
    prop: "applyState",
    formatter: (row: any, column: any, value: any) => {
      let obj: applyTypeI = {
        1: "待审批",
        2: "审批中",
        3: "审批拒绝",
        4: "审批通过",
        5: "作废",
      };
      return obj[row.applyState];
    },
  },
]);

//表单规则
const rules = reactive<FormRules>({
  remark: [
    {
      required: true,
      message: "请输入备注",
      trigger: "change",
    },
  ],
});

onMounted(() => {
  getApplyLists();
});
//获取table列表
const getApplyLists = async () => {
  let params = { ...queryForm, ...pager, type: "approve" };
  let { list, page } = await getApplyList(params);
  pager.total = page.total;
  applyList.value = list;
};
//重置表单
function handleReset(ref: string | Ref) {
  if (typeof ref === "string") {
    eval(ref).value.resetFields();
  } else {
    ref.value.resetFields();
  }
}
//查看休假详情
const handleDetail = (row: detailI) => {
  let data = { ...row };
  data.applyTypeName = {
    1: "事假",
    2: "调休",
    3: "年假",
  }[data.applyType];
  data.time =
    util.formateDate(new Date(data.startTime), "yyyy-MM-dd") +
    "到" +
    util.formateDate(new Date(data.endTime), "yyyy-MM-dd");
  data.applyStateName = {
    1: "待审批",
    2: "审批中",
    3: "审批拒绝",
    4: "审批通过",
    5: "作废",
  }[data.applyState];
  detail.value = data;
  showDetailModal.value = true;
};
// 审核通过按钮 / 驳回
const handleApprove = (action: string) => {
  dialogForm.value?.validate(async (valid: boolean) => {
    if (valid) {
      let params = { action, remark: auditForm.remark, _id: detail.value._id };
      let res = await leaveApprove(params);
      if (res) {
        showDetailModal.value = false;
        success("处理成功");
        handleReset("dialogForm");
        getApplyLists();
        store.commit("saveNotiveCount", store.state.notiveCount - 1);
      }
    }
  });
};

// 页脚事件
const handleChange = (val: number) => {
  pager.pageNum = val;
  getApplyLists();
};
</script>
