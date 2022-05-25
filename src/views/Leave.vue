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
      <div class="action">
        <el-button type="primary" @click="handleApply">申请休假</el-button>
      </div>
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
            <el-button @click="handleDetail(scope.row)" size="small"
              >查看</el-button
            >
            <el-button
              @click="handleDelete(scope.row._id)"
              size="small"
              type="danger"
              v-if="[1, 2].includes(scope.row.applyState)"
              >作废</el-button
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
    <el-dialog title="申请休假" v-model="showModal" width="70%">
      <el-form
        ref="dialogForm"
        :model="leaveForm"
        label-width="120px"
        :rules="rules"
      >
        <el-form-item label="休假类型" prop="applyType">
          <el-select v-model="leaveForm.applyType">
            <el-option label="事假" value="1"></el-option>
            <el-option label="调休" value="2"></el-option>
            <el-option label="年假" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="休假时间">
          <el-row>
            <el-col :span="8">
              <el-form-item prop="startTime">
                <el-date-picker
                  v-model="leaveForm.startTime"
                  type="date"
                  placeholder="选择开始日期"
                  @change="(val:any)=>handleDateChange('startTime',val)"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="1">-</el-col>
            <el-col :span="8">
              <el-form-item prop="endTime">
                <el-date-picker
                  v-model="leaveForm.endTime"
                  type="date"
                  placeholder="选择结束日期"
                  @change="(val:any)=>handleDateChange('endTime',val)"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="休假时长">{{ leaveForm.leaveTime }} </el-form-item>
        <el-form-item label="休假详情" prop="reasons">
          <el-input
            type="textarea"
            :row="3"
            placeholder="休假原因"
            v-model="leaveForm.reasons"
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
    <el-dialog
      title="申请休假详情"
      width="50%"
      v-model="showDetailModal"
      destroy-on-close
    >
      <el-steps
        :active="detail.applyState > 2 ? 3 : detail.applyState"
        align-center
      >
        <el-step title="待审批"></el-step>
        <el-step title="审批中"></el-step>
        <el-step title="审批通过/审批拒绝/作废"></el-step>
      </el-steps>
      <el-form label-width="120px" label-suffix=":">
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
      </el-form>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { onMounted, reactive, Ref, ref } from "vue";
import { useRouter } from "vue-router";

import type { FormInstance, FormRules } from "element-plus";
import util from "../utils/util";
import { getApplyList, leaveOperate } from "../api";
import { error, success } from "../utils/log";
const router = useRouter();
interface applyTypeI {
  [key: number]: string;
}
// detail
interface detailI {
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
}

// form ref对象
const form = ref<FormInstance>();
const dialogForm = ref<FormInstance>();

// 查询表单对象
let queryForm = reactive({
  applyState: "",
});
const applyList = ref([]);

//页脚数据
const pager = reactive({
  pageNum: 1,
  pageSize: 10,
  total: 0,
});

//dialog弹窗
const showModal: Ref<boolean> = ref(false);
const showDetailModal: Ref<boolean> = ref(false);

//action 表单提交状态 create:创建 delete 作废
const action: Ref<"create" | "edit" | "delete"> = ref("create");

// dialog表单
let leaveForm: { [key in string]: string } = reactive({
  applyType: "",
  startTime: "",
  endTime: "",
  leaveTime: "0天",
  reasons: "",
});

let detail: Ref<detailI> = ref({
  applyType: 0,
  applyState: 0,
  curAuditUserName: "",
  endTime: "",
  leaveTime: "",
  reasons: "",
  startTime: "",
});

//table列表项
const columns = reactive([
  {
    label: "单号",
    prop: "orderNo",
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
  startTime: [
    {
      type: "date",
      required: true,
      message: "请选择开始时间",
      trigger: "change",
    },
  ],
  endTime: [
    {
      type: "date",
      required: true,
      message: "请选择结束时间",
      trigger: "change",
    },
  ],
  reasons: [
    {
      required: true,
      message: "请输入休假原因",
      trigger: ["blur", "change"],
    },
  ],
});

onMounted(() => {
  getApplyLists();
});
//获取table列表
const getApplyLists = async () => {
  let params = { ...queryForm, ...pager };
  let { list, page } = await getApplyList(params);
  pager.total = page.total;
  applyList.value = list;
};

//申请休假
const handleApply = () => {
  showModal.value = true;
  action.value = "create";
};

// 日期选中事件  获取休假时长
const handleDateChange = (name: string, val: any) => {
  let { startTime, endTime } = leaveForm;
  if (!startTime || !endTime) return;
  if (startTime > endTime) {
    error("开始时间不能晚于结束时间");
    leaveForm.leaveTime = "0天";
    //设置一个宏任务 防止不能及时更改
    setTimeout(() => {
      leaveForm[name] = "";
    }, 0);
  } else {
    leaveForm.leaveTime =
      (Number(endTime) - Number(startTime)) / (24 * 60 * 60 * 1000) + 1 + "天";
  }
};

//重置表单
function handleReset(ref: string | Ref) {
  if (typeof ref === "string") {
    eval(ref).value.resetFields();
  } else {
    ref.value.resetFields();
  }
}
//关闭提交弹窗
const handleClose = () => {
  showModal.value = false;
  handleReset("dialogForm");
};
// 提交创建弹窗
const handleSubmit = () => {
  dialogForm.value?.validate(async (valid) => {
    if (valid) {
      let params = { ...leaveForm, action: action.value };
      let ref = await leaveOperate(params);
      success("创建成功");
      handleClose();
      getApplyLists();
    }
  });
};
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
//作废休假详情
const handleDelete = async (_id: string) => {
  try {
    let params = { _id, action: "delete" };
    let res = await leaveOperate(params);
    success("删除成功");
    getApplyLists();
  } catch (error) {}
};

// 页脚事件
const handleChange = (val: number) => {
  pager.pageNum = val;
  getApplyLists();
};
</script>
