<template>
  <div class="container">
    <vab-query-form>
      <vab-query-form-right-panel>
        <el-form
          ref="form"
          :model="queryForm"
          :inline="true"
          @submit.native.prevent
        >
          <el-form-item>
            <el-input v-model="queryForm.key" placeholder="标题" />
          </el-form-item>
          <el-form-item>
            <el-button
              icon="el-icon-search"
              type="primary"
              native-type="submit"
              @click="handleQuery"
            >
              查询
            </el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>

    <el-table
      ref="tableSort"
      v-loading="listLoading"
      :data="list"
      :element-loading-text="elementLoadingText"
      :height="height"
      @selection-change="setSelectRows"
    >
      <el-table-column
        show-overflow-tooltip
        label="试卷名称"
        prop="title"
      ></el-table-column>
      <el-table-column show-overflow-tooltip label="知识点">
        <template #default="{ row }">
          <el-tag v-for="tag in row.tags" :key="tag">{{ tag }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="作答次数"
        prop="attemptCount"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="本站用户平均分"
        prop="averageScore"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="发布者"
        prop="authorName"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="发布时间"
        prop="createTime"
      ></el-table-column>
      <el-table-column show-overflow-tooltip label="操作" width="180px">
        <template #default="{ row }">
          <el-button type="text" @click="paperPreview(row.id)">预览</el-button>
          <el-button type="text" @click="handleEdit(row)">编辑</el-button>
          <el-button type="text" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :background="background"
      :current-page="queryForm.pageNo"
      :layout="layout"
      :page-size="queryForm.pageSize"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    ></el-pagination>
    <test-paper-preview ref="paperPreview"></test-paper-preview>
    <paper-edit ref="edit"></paper-edit>
  </div>
</template>

<script>
  import PaperEdit from './components/testPaperManageEdit'
  import TestPaperPreview from '../testingModule/components/testPaperPreview'
  export default {
    components: {
      PaperEdit,
      TestPaperPreview,
    },
    data() {
      return {
        list: [],
        listLoading: true,
        layout: 'total, sizes, prev, pager, next, jumper',
        total: 0,
        background: true,
        selectRows: '',
        elementLoadingText: '正在加载...',
        queryForm: {
          pageNo: 1,
          pageSize: 20,
          key: '',
        },
      }
    },
    computed: {
      height() {
        return this.$baseTableHeight()
      },
    },
    created() {
      this.fetchData()
    },
    beforeDestroy() {},
    mounted() {},
    methods: {
      handleEdit(row) {
        this.$refs['edit'].showEdit(row)
      },
      paperPreview(id) {
        this.$axios
          .get('/testing/paper/preview', {
            params: {
              testPaperId: id,
            },
          })
          .then((res) => {
            if (res.data.code == 200) {
              this.$refs['paperPreview'].paperPreview(res.data.data)
            } else {
              this.$message.error(res.data.message)
            }
          })
      },

      setSelectRows(val) {
        // console.log(val)
        this.selectRows = val
      },
      handleAdd() {
        this.$refs['edit'].showEdit()
      },

      handleSizeChange(val) {
        this.queryForm.pageSize = val
        this.fetchData()
      },
      handleCurrentChange(val) {
        this.queryForm.pageNo = val
        this.fetchData()
      },
      handleQuery() {
        this.queryForm.pageNo = 1
        this.fetchData()
      },
      async fetchData() {
        this.listLoading = true
        console.log(this.queryForm)
        this.$axios
          .get('/manage_center/paper/list', {
            params: {
              key: this.queryForm.key,
              pageNo: this.queryForm.pageNo,
              pageSize: this.queryForm.pageSize,
            },
          })
          .then((res) => {
            this.list = res.data.data.list
            this.total = res.data.data.total
          })
          .then(() => {
            this.listLoading = false
          })
      },
    },
  }
</script>

<style>
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>
