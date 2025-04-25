<template>
  <a-config-provider :locale="zhCn">
    <div class="col">
      <BordShow content="业务订单查询列表" path="业务中心/查询" />
      <div style=" background-color: rgba(240, 242, 245, 1) ; padding: 50px 40px">
        <div style="display: flex; flex-direction: row; justify-content: space-between">
          <!-- <div> -->
          <a-form class="input" ref="formRef" :model="formState">
            <a-form-item class="input-item" ref="name" label="业务订单ID: " name="name">
              <a-input v-model:value="formState.name" placeholder="请输入" />
            </a-form-item>
            <a-form-item class="input-item" label="订单状态: " name="region">
              <a-select v-model:value="formState.region" placeholder="订单状态" style="width: 190px;">
                <a-select-option value="shanghai">初始状态</a-select-option>
                <a-select-option value="beijing">设计中</a-select-option>
                <a-select-option value="beijing2">已完成</a-select-option>
                <a-select-option value="beijing3">作废</a-select-option>
                <a-select-option value="beijing4">布产中</a-select-option>
              </a-select>
            </a-form-item>
            <!-- <a-form-item label="创建日期: " required name="date1"> -->
            <a-form-item label="创建日期: " name="date1" style="width: 400px;">
              <a-date-picker v-model:value="formState.date1" show-time type="date" placeholder="Pick a date"
                style="width:   100%" />
            </a-form-item>
          </a-form>
          <!-- </div> -->
          <!-- <div ref="button"> -->
          <a-form-item style="display: flex; flex-direction: row; ">
            <a-button type="primary" @click="onSubmit">查询</a-button>
            <a-button style="margin: 0 10px 0 40px" @click="resetForm">重置</a-button>
          </a-form-item>
          <!-- </div> -->
        </div>
        <div style="display: flex; flex-direction: row; justify-content: space-between">
          <a-form class="input" style="display: flex; flex-direction: row;">
            <a-form-item class="input-item" label="客户姓名">
              <a-input v-model:value="formState.fieldB" placeholder="请输入" />
            </a-form-item>
            <a-form-item class="input-item" label="创建人姓名">
              <a-input v-model:value="formState.fieldB" placeholder="请输入" />
            </a-form-item>
            <a-form-item class="input-item" label="其他搜索框">
              <a-input v-model:value="formState.fieldB" placeholder="请输入" />
            </a-form-item>
          </a-form>
          <a-form-item>
            <a-button type="primary">新建</a-button>
            <a-button style="margin: 0 10px 0 40px">导入</a-button>
          </a-form-item>
        </div>
        <div style="display: inline-block;">
          <a-button type='link' style="text-decoration: underline; right: 20px; text-align: right;">下载导入模板</a-button>
        </div>

        <div>
          <a-table :row-selection="rowSelection" :columns="columns" :data-source="paginatiedData" :pagination="false">
            <template #bodyCell="{ column, text }">
              <template v-if="column.dataIndex === 'name'">
                <a>{{ text }}</a>
              </template>
            </template>
            <template #action="{ text, record }">
              <a-button type="link" @click="onEdit(record)">编辑</a-button>
              <a-button type="link" @click="onCheck(record)">查看</a-button>
              <a-button type="link" @click="onDerive(record)">导出</a-button>
            </template>
          </a-table>
          <a-pagination :class="pagination.className" :current="pagination.current" :page-size="pagination.pageSize"
            :total="pagination.total" :show-total="pagination.showTotal" :show-size-changer="pagination.showSizeChanger"
            :show-quick-jumper="pagination.showQuickJumper" :page-size-options="pagination.pageSizeOptions"
            @change="onPageChange" @show-size-change="onShowSizeChange"></a-pagination>
        </div>
      </div>
    </div>
  </a-config-provider>
</template>

<script setup lang="ts" name="Query">
import BordShow from '@/components/board/SecBoard.vue'
import type { FormInstance } from 'ant-design-vue/es/form';
import { Dayjs } from 'dayjs';
import { reactive, ref, toRaw, computed } from 'vue';
import type { UnwrapRef } from 'vue';
import type { Rule } from 'ant-design-vue/es/form';
import type { TableProps, TableColumnType } from 'ant-design-vue';
// import { Table, Pagination } from 'ant-design-vue';
// import { anyType, stringType } from 'ant-design-vue/es/_util/type';
// import type Show from './Show.vue';
import zhCn from 'ant-design-vue/es/locale/zh_CN';
import { getOffsetOrSpace } from 'element-plus/es/components/message/src/instance.mjs';

interface FormState {
  name: string;
  region: string | undefined;
  date1: Dayjs | undefined;
  delivery: boolean;
  type: string[];
  resource: string;
  desc: string;
  fieldB: string;
}
const formRef = ref();
const newFormRef = ref<FormInstance>();
const labelCol = { span: 7, offset: 3 };
const wrapperCol = { span: 17, offset: 0 };
const formState: UnwrapRef<FormState> = reactive({
  name: '',
  region: undefined,
  date1: undefined,
  delivery: false,
  type: [],
  resource: '',
  desc: '',
  fieldB: '',

});
const rules: Record<string, Rule[]> = {
  name: [
    { required: true, message: 'Please input Activity name', trigger: 'change' },
    { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' },
  ],
  region: [{ required: true, message: 'Please select Activity zone', trigger: 'change' }],
  date1: [{ required: true, message: 'Please pick a date', trigger: 'change', type: 'object' }],
  type: [
    {
      type: 'array',
      required: true,
      message: 'Please select at least one activity type',
      trigger: 'change',
    },
  ],
  resource: [{ required: true, message: 'Please select activity resource', trigger: 'change' }],
  desc: [{ required: true, message: 'Please input activity form', trigger: 'blur' }],
};
const onSubmit = () => {
  formRef.value
    ?.validate()
    .then(() => {
      console.log('values', formState, toRaw(formState));
    })
    .catch(error => {
      console.log('error', error);
    });
};
const resetForm = () => {
  formRef.value.resetFields();
};

// 列表的 script
interface DataType {
  key: number;
  name: string;
  age: number;
  address: string;
}

const columns: TableColumnType<DataType>[] = [
  {
    title: '创建时间',
    dataIndex: 'name',
  },
  {
    title: '订单ID',
    dataIndex: 'age',
  },
  {
    title: '客户姓名',
    dataIndex: 'address',
  },
  {
    title: '订单状态',
    dataIndex: 'address',
  },
  {
    title: '其他基本信息',
    dataIndex: 'information'
  },
  {
    title: '其他基本信息',
    dataIndex: 'information'
  },
  {
    title: '其他基本信息',
    dataIndex: 'information'
  },

  {
    title: '操作',
    dataIndex: 'address',
    slots: { customRender: 'action' },
  },
];
const data: DataType[] = [];
for (let i = 0; i < 40; i++) {
  data.push({
    key: i,
    name: `Edward King ${i}`,
    age: 32,
    address: `London, Park Lane no. ${i}`,
  });
}
const rowSelection: TableProps['rowSelection'] = {
  onChange: (selectedRowKeys: string[], selectedRows: DataType[]) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  },
  getCheckboxProps: (record: DataType) => ({
    // disabled: record.name === 'Disabled User', // Column configuration not to be checked
    name: record.name,
  }),
};
const onEdit = (record: DataType) => {
  console.log('Edit:', record);
};
const onDerive = (record: DataType) => {
  console.log('Derive:', record);
};
const onCheck = (record: DataType) => {
  console.log('Check:', record);
};

// 分页 --开始
const pagination = reactive({
  className: 'paginationCustom',
  current: 1,
  pageSize: 5,
  total: data.length,
  showTotal: (total: number) => `共 ${total} 条记录 第 ${pagination.current} / ${Math.ceil(total / pagination.pageSize)} 页`,
  showSizeChanger: true,
  showQuickJumper: true,
  pageSizeOptions: ['5', '10', '20', '50'], // pageSize 选项列表

});
const paginatiedData = computed(() => {
  const start = (pagination.current - 1) * pagination.pageSize;
  const end = start + pagination.pageSize;
  return data.slice(start, end);
});
const onPageChange = (page: number, pageSize: number) => {
  pagination.current = page;
};// 分页改变时触发
const onShowSizeChange = (current: number, size: number) => {
  pagination.pageSize = size;
}// pageSize 改变时触发

// 分页 --结束

</script>

<style scoped lang="less">
.input {
  display: flex;
  flex-direction: row;
}

.input-item {
  width: 300px;

  input {
    width: 190px;
  }
}

::v-deep(.ant-form-item-label) {
  width: 100px;
}

.paginationCustom {
  border: red solid 1px;

  li:nth-of-type(1) {
    flex: 1;
    text-align: left;
  }

}
</style>