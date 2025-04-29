<template>
  <div>
    <el-config-provider :locale="zhCn">
      <BordShow content="业务订单查询列表" path="业务中心/查询" />
      <div class="query-container">
        <el-card class="form-container">
          <!-- 搜索框 -->
          <template #header>
            <div>
              <el-input v-model="formState.name" placeholder="请输入搜索内容" style="width: 300px; margin-right: 20px"
                :suffix-icon="Search">

              </el-input>
            </div>
          </template>
          <!-- 查询表单 -->
          <el-row :gutter="20">
            <!-- 业务订单ID -->
            <el-col :span="6">
              <el-form-item label="业务订单ID">
                <el-input v-model="formState.name" placeholder="请输入" />
              </el-form-item>
            </el-col>

            <!-- 订单状态 -->
            <el-col :span="6">
              <el-form-item label="订单状态">
                <el-select v-model="formState.region" placeholder="订单状态">
                  <el-option label="初始状态" value="shanghai" />
                  <el-option label="设计中" value="beijing" />
                  <el-option label="已完成" value="beijing2" />
                  <el-option label="作废" value="beijing3" />
                  <el-option label="布产中" value="beijing4" />
                </el-select>
              </el-form-item>
            </el-col>

            <!-- 创建日期 -->
            <el-col :span="7">
              <el-form-item label="创建日期">
                <el-date-picker v-model="datePicker" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期"
                  style="width: 100%" />
              </el-form-item>
            </el-col>

            <!-- 查询和重置按钮 -->
            <el-col :span="5" class="form-buttons">
              <el-button type="primary" @click="onSubmit">查询</el-button>
              <el-button @click="resetForm">重置</el-button>
            </el-col>
          </el-row>


          <el-row :gutter="20">
            <!-- 客户姓名 -->
            <el-col :span="6">
              <el-form-item label="客户姓名">
                <el-input v-model="formState.fieldB" placeholder="请输入" />
              </el-form-item>
            </el-col>

            <!-- 创建人姓名 -->
            <el-col :span="6">
              <el-form-item label="创建人姓名">
                <el-input v-model="formState.fieldB" placeholder="请输入" />
              </el-form-item>
            </el-col>

            <!-- 其他搜索框 -->
            <el-col :span="6">
              <el-form-item label="其他搜索框">
                <el-input v-model="formState.fieldB" placeholder="请输入" />
              </el-form-item>
            </el-col>


            <!-- 新建和导入按钮 -->
            <el-col :span="6" class="form-buttons">
              <el-button type="primary">新建</el-button>
              <el-button>导入</el-button>
            </el-col>
          </el-row>
          <!-- 按钮 -->
          <el-row>
            <el-col :span="24" class="form-buttons">


              <el-button type="text">下载导入模板</el-button>
            </el-col>
          </el-row>

          <!-- 表格 -->
          <el-table :data="paginatiedData" border style="width: 100%; margin-top: 20px">
            <el-table-column prop="createTime" label="创建时间" />
            <el-table-column prop="orderId" label="订单ID" />
            <el-table-column prop="customerName" label="客户姓名" />
            <el-table-column prop="orderStatus" label="订单状态">
              <template #default="{ row }">
                <span :style="{ color: getStatusColor(row.orderStatus) }">●</span>
                {{ row.orderStatus }}
              </template>
            </el-table-column>
            <el-table-column prop="information" label="其他基本信息" />
            <el-table-column label="操作">
              <template #default="{ row }">
                <el-button type="text" @click="onEdit(row)">编辑</el-button>
                <el-button type="text" @click="onCheck(row)">查看</el-button>
                <el-button type="text" @click="onDerive(row)">导出</el-button>
              </template>
            </el-table-column>
          </el-table>

          <!-- 分页 -->
          <el-pagination background layout="prev, pager, next, sizes, total" :total="pagination.total"
            :page-size="pagination.pageSize" :current-page="pagination.current" @size-change="onShowSizeChange"
            @current-change="onPageChange" :page-sizes="[5, 10, 20, 50]" />
        </el-card>
      </div>
    </el-config-provider>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import BordShow from '@/components/board/SecBoard.vue';
import type { FormInstance } from 'element-plus';
import type { ElForm } from 'element-plus';
import { ElInput, ElSelect, ElOption, ElDatePicker, ElButton, ElTable, ElTableColumn, ElPagination } from 'element-plus';
import { Search } from '@element-plus/icons-vue';




// 表单状态
const formState = reactive({
  name: '',
  region: undefined,
  fieldB: '',
});

// 时间选择框
const datePicker = ref<[string, string] | null>(null);

// 表格数据
interface DataType {
  key: number;
  createTime: string;
  orderId: string;
  customerName: string;
  orderStatus: string;
  information: string;
}

const data: DataType[] = [];
for (let i = 0; i < 40; i++) {
  data.push({
    key: i,
    createTime: Date.now().toString(),
    orderId: '3249hg284b14',
    customerName: `John Brown ${i}`,
    orderStatus: '初始状态',
    information: `London, Park Lane no. ${i}`,
  });
}

// 表格分页
const pagination = reactive({
  current: 1,
  pageSize: 5,
  total: data.length,
});

const paginatiedData = computed(() => {
  const start = (pagination.current - 1) * pagination.pageSize;
  const end = start + pagination.pageSize;
  return data.slice(start, end);
});

const onPageChange = (page: number) => {
  pagination.current = page;
};

const onShowSizeChange = (size: number) => {
  pagination.pageSize = size;
};

// 表单操作
const onSubmit = () => {
  console.log('查询表单数据：', formState);
};

const resetForm = () => {
  formState.name = '';
  formState.region = undefined;
  formState.fieldB = '';
};

// 表格操作
const getStatusColor = (status: string) => {
  switch (status) {
    case '初始状态':
      return 'grey';
    case '设计中':
      return 'blue';
    case '已完成':
      return 'green';
    case '作废':
      return 'red';
    case '布产中':
      return 'orange';
    default:
      return 'black';
  }
};

const onEdit = (row: DataType) => {
  console.log('编辑：', row);
};

const onCheck = (row: DataType) => {
  console.log('查看：', row);
};

const onDerive = (row: DataType) => {
  console.log('导出：', row);
};
</script>

<style scoped lang="less">
.query-container {
  background-color: rgba(240, 242, 245, 1);
  padding: 20px;

  .form-container {
    background-color: white;
  }
}



// .input {
//   margin-bottom: 20px;
// }

.form-buttons {
  display: flex;
  gap: 0 20px;
  justify-content: flex-end;
  // margin-right: 10px;
  // margin-top: 10px;
}

.el-table {
  margin-top: 20px;
}
</style>