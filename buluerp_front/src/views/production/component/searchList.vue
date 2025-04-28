<template>
    <el-card style="width: 100%; margin: 0 20px;">
      <template #header>
        <div class="card-header">
          <span>展示</span>
        </div>
      </template>
        <div>
            <el-table
            :data="data"
            border
            style="width: 100%"
            @selection-change="handleSelectionChange"
            >
            <el-table-column type="selection" width="55" />

            <el-table-column prop="foundtime" label="创建时间" />
            <el-table-column prop="productid" label="产品编码" />
            <el-table-column prop="productname" label="产品名称" />
            <el-table-column prop="productsituation" label="产品状态">
                <template #default="{ row }">
                <span style="display: flex; align-items: center;">
                    <span
                    :style="{
                        display: 'inline-block',
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: row.productsituation === '已完成' ? '#67C23A' : '#C0C4CC',
                        marginRight: '8px',
                    }"
                    ></span>
                    {{ row.productsituation }}
                </span>
                </template>
            </el-table-column>
            <el-table-column prop="productimg" label="产品图片" />
            <el-table-column prop="otherinfo1" label="其他基本信息" />
            <el-table-column prop="otherinfo2" label="其他基本信息" />
            
            <el-table-column label="操作" fixed="right" width="250">
                <template #default>
                <el-button size="small" type="primary" text>编辑</el-button>
                <el-button size="small" type="primary" text>查看</el-button>
                <el-button size="small" type="primary" text>导出</el-button>
                </template>
            </el-table-column>
            </el-table>

            <!-- 分页器 -->
            <div style="margin-top: 20px; display: flex; justify-content: space-between; align-items: center;">
            <div>共 {{ total }} 条</div>
            <el-pagination
                background
                layout="prev, pager, next, jumper, ->, total, sizes"
                :current-page="page"
                :page-size="pageSize"
                :page-sizes="[5, 10, 20, 50]"
                :total="total"
                @current-change="handlePageChange"
                @size-change="handleSizeChange"
            />
            </div>
        </div>
    </el-card>
  </template>
  <script lang="ts" setup>
  import { ref } from 'vue';
  
  interface DataType {
    key: string;
    foundtime: string;
    productid: number;
    productname: string;
    productsituation: string;
    productimg: string;
    otherinfo1: string;
    otherinfo2: string;
  }
  
  const data = ref<DataType[]>([
    {
      key: '1',
      foundtime: '2023-01-01',
      productid: 32,
      productname: '产品A',
      productsituation: '设计中',
      productimg: 'img',
      otherinfo1: '',
      otherinfo2: '',
    },
    {
      key: '2',
      foundtime: '2023-02-01',
      productid: 42,
      productname: '产品B',
      productsituation: '已完成',
      productimg: 'img',
      otherinfo1: '',
      otherinfo2: '',
    },
  ]);
  
  const page = ref(1);
  const pageSize = ref(10);
  const total = ref(20); // 可以改成接口返回的实际总数
  
  const handleSelectionChange = (selection: DataType[]) => {
    console.log('选中的行：', selection);
  };
  
  const handlePageChange = (val: number) => {
    page.value = val;
    console.log('跳转到页面：', val);
  };
  
  const handleSizeChange = (val: number) => {
    pageSize.value = val;
    console.log('每页条数改为：', val);
  };
  </script>