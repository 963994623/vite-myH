<template>
  <div class="user-manag">
    <div class="query-form">
      <QueryForm
        :form="formItemArr"
        v-model="orderQuery"
        @handleQuery="handleQuery"
      />
    </div>
    <!-- <BaseTable :columns="columns" :data="orderList" :pager="pager"> </BaseTable> -->
    <div class="base-table">
      <el-table :data="orderList" style="width: 100%">
        <el-table-column prop="out_trade_no" label="订单号" width="180" fixed />
        <el-table-column
          prop="fa_out_trade_no"
          label="合并下单订单号"
          width="180"
        />
        <el-table-column prop="openid" label="openid" width="180" />
        <el-table-column label="图片" width="180">
          <template #default="scope">
            <div style="display: flex; align-items: center">
              <el-image
                :src="scope.row.goods_big_logo"
                style="width: 60px; height: 60px"
              ></el-image>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="goods_name" label="商品标题" width="400" />
        <el-table-column prop="goods_id" label="商品id" />

        <el-table-column prop="num" label="购买数量" />
        <el-table-column
          prop="payer_total"
          label="用户支付金额"
          :formatter="formatterPayerTotal"
        />
        <el-table-column
          prop="listTotal"
          label="合单共计金额"
          :formatter="formatterListTotal"
        />

        <el-table-column prop="bank_type" label="银行类别" />
        <el-table-column prop="currency" label="货币" />
        <el-table-column prop="trade_state" label="是否支付成功" />
        <el-table-column prop="trade_type" label="贸易类型" />
        <el-table-column
          prop="state"
          label="订单状态"
          :formatter="formatterState"
        />
        <el-table-column label="操作" fixed="right" min-width="200">
          <template #default="scope">
            <el-button
              @click="handleClickUpdateState(scope.row, 'deliver')"
              v-if="scope.row.state == '1'"
              type="primary"
              size="small"
              v-has:deliver="'order-deliver'"
              >发货</el-button
            >
            <el-button
              v-if="scope.row.state == '4' && !scope.row.fa_out_trade_no"
              type="danger"
              size="small"
              @click="handleClickUpdateState(scope.row, 'refund')"
              v-has:refund="'order-refund'"
              >退款</el-button
            >
            <el-popconfirm
              v-if="scope.row.state == '4' && scope.row.fa_out_trade_no"
              title="检测到为合单商品 退款此商品 合单商品也将一并退款"
              @confirm="handleClickUpdateState(scope.row, 'refund')"
            >
              <template #reference>
                <el-button
                  v-if="scope.row.state == '4'"
                  type="danger"
                  size="small"
                  v-has:refund="'order-refund'"
                  >退款</el-button
                >
              </template>
            </el-popconfirm>
            <el-button
              size="small"
              @click="handleClickSeeDetail(scope.row)"
              v-has:see="'order-see'"
              >查看详情</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="pager.total"
          :page-size="pager.pageSize"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
  <el-dialog v-model="DialogSH" title="查看详情">
    <el-steps
      :space="200"
      :active="dialogData.state"
      simple
      v-if="dialogData.state < 4"
    >
      <el-step title="待付款" :icon="Money" />
      <el-step title="待发货" :icon="Box" />
      <el-step title="待取货" :icon="ShoppingBag" />
      <el-step title="已完成" :icon="CircleCheck" />
    </el-steps>
    <el-steps :space="200" :active="dialogData.state - 4" simple v-else>
      <el-step title="待退款" :icon="Sell" />
      <el-step title="退款完成" :icon="CircleCheck" />
    </el-steps>
    <el-descriptions title="订单" direction="vertical" :column="4" border>
      <el-descriptions-item label="订单号">{{
        dialogData.orderNo
      }}</el-descriptions-item>
      <el-descriptions-item label="购买人">{{
        dialogData.openId
      }}</el-descriptions-item>
      <el-descriptions-item label="商品号" :span="2">{{
        dialogData.orderId
      }}</el-descriptions-item>
      <el-descriptions-item label="商品名" :span="2">
        <el-tag size="small">{{ dialogData.orderName }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="商品实付价格" :span="2"
        >{{ dialogData.price * 0.01 }}
      </el-descriptions-item>

      <el-descriptions-item label="退款时间" v-if="dialogData.order_back_timer"
        >{{ dialogData.order_back_timer }}
      </el-descriptions-item>
      <el-descriptions-item
        label="退款方式"
        v-if="dialogData.order_back_message"
        >{{ dialogData.order_back_message }}
      </el-descriptions-item>
    </el-descriptions>
  </el-dialog>
</template>
<script lang="ts" setup>
import QueryForm from "../../packages/QueryForm";
import BaseTable from "../../packages/BaseTable";
import { ref, reactive, onMounted, nextTick, Ref } from "vue";
import { getOrderList, updateOrderState } from "../api/index";
import { ElMessage, ElStep } from "element-plus";
import {
  Money,
  Box,
  ShoppingBag,
  CircleCheck,
  Sell,
} from "@element-plus/icons-vue";
import { log } from "console";
import { rowDataI, paramsI, dialogI } from "../tsInter/orders";
import { fa } from "element-plus/es/locale";

const confirmEvent = () => {
  console.log(1);
};

onMounted(async () => {
  await getOrderLists();
});

// 表格数据
const orderList = ref([]);

//dialog显示隐藏
const DialogSH = ref(false);
const dialog2SH = ref(false);

// dialog数据
const dialogData: Ref<dialogI> = ref({
  orderNo: "",
  openId: "",
  orderName: "",
  orderId: 0,
  price: 0,
  state: 0,
});

// 页脚数据
const pager: { pageNum: number; pageSize: number; total?: number } = reactive({
  pageNum: 1,
  pageSize: 10,
});

// 获取table数据
const getOrderLists = async () => {
  const data = await getOrderList({ ...orderQuery.value, ...pager });

  orderList.value = data.newList;
  pager.total = data.page.total;
};

// 查看dialog详情
const handleClickSeeDetail = (rowData: rowDataI) => {
  DialogSH.value = true;

  let params: dialogI = {
    orderNo: rowData.out_trade_no,
    openId: rowData.openid,
    orderName: rowData.goods_name,
    orderId: rowData.goods_id,
    price: rowData.payer_total,
    state: rowData.state,
  };
  if (rowData.order_back_message)
    params.order_back_message = rowData.order_back_message;
  if (rowData.order_back_timer)
    params.order_back_timer = rowData.order_back_timer;
  console.log(params);

  nextTick(() => {
    dialogData.value = params;
  });
};

// 发货/退款
const handleClickUpdateState = async (
  row: rowDataI,
  state: "deliver" | "refund"
) => {
  // if (state == "refund" && row.fa_out_trade_no) {
  // }
  const parmas: paramsI = {};

  if (row.fa_out_trade_no) {
    parmas.fa_out_trade_no = row.fa_out_trade_no;
  }
  if (row.listTotal) {
    parmas.total = row.listTotal;
  } else {
    parmas.total = row.payer_total;
  }
  parmas.out_trade_no = row.out_trade_no;
  parmas.state = row.state;

  const data = await updateOrderState(parmas);
  if (data.message) {
    ElMessage({
      message: "退款成功",
      type: "success",
    });
  } else {
    ElMessage({
      message: "退款失败",
      type: "error",
    });
  }

  getOrderLists();
};

/**
 * Query组件 所需内容
 */

//  query传值
const orderQuery = ref({
  orderId: "",
  orderName: "",
  orderState: 0,
});

// query 组件
const formItemArr = [
  {
    type: "input",
    label: "订单id",
    model: "orderId",
    placeholder: "请输入商品id",
  },
  {
    type: "input",
    label: "订单名称",
    model: "orderName",
    placeholder: "请输入商品名称",
  },
  {
    type: "select",
    label: "状态",
    model: "orderState",
    placeholder: "请选择状态",
    options: [
      {
        label: "所有",
        value: 0,
      },
      {
        label: "待付款",
        value: 1,
      },
      {
        label: "待发货",
        value: 2,
      },
      {
        label: "待收货",
        value: 3,
      },
      {
        label: "已完成",
        value: 4,
      },
      {
        label: "退款中",
        value: 5,
      },
      {
        label: "退款完成",
        value: 6,
      },
    ],
  },
];

const handleQuery = () => {
  try {
    getOrderLists();
  } catch (e) {
    ElMessage("查询失败");
  }
};

/**
 * 表格组件 所需内容
 */

const formatterPayerTotal = (row: rowDataI) => {
  return row.payer_total * 0.01;
};
const formatterListTotal = (row: rowDataI) => {
  if (row.listTotal) {
    return row.listTotal * 0.01;
  }
  return "";
};
const formatterState = (row: rowDataI) => {
  const map: { [P in number]: string } = {
    0: "待付款",
    1: "待发货",
    2: "待取货",
    3: "已完成",
    4: "退款中",
    5: "退款完成",
  };
  return map[row.state];
};

// 页脚事件
const handleCurrentChange = (num: number) => {
  pager.pageNum = num;
  getOrderLists();
};
</script>

<style lang="scss" scoped></style>
