<template>
  <div class="container">
    <el-table
      ref="tableSort"
      v-loading="listLoading"
      :data="list"
      :element-loading-text="elementLoadingText"
    >
      <el-table-column
        show-overflow-tooltip
        label="试卷名"
        prop="title"
      ></el-table-column>
      <el-table-column show-overflow-tooltip label="试卷得分">
        <template #default="{ row }">
          <span :style="getColor(row.score)">{{ row.score }}分</span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="作答时间"
        prop="createTime"
      ></el-table-column>
      <el-table-column show-overflow-tooltip label="操作">
        <template #default="{ row }">
          <el-button type="text" @click="showDetail(row.id)">
            查看详情
          </el-button>
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
  </div>
</template>

<script>
  export default {
    data() {
      return {
        list: [],
        listLoading: true,
        layout: 'total, sizes, prev, pager, next, jumper',
        background: true,
        elementLoadingText: '正在加载...',
        queryForm: {
          pageNo: 1,
          pageSize: 20,
          key: '',
        },
        total: 0,
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
      getColor(score) {
        if (score < 60) {
          return 'color: red'
        } else if (score < 80) {
          return 'color: orange'
        } else {
          return 'color: green'
        }
      },
      showDetail(id) {
        this.$router.push({
          path: '/answer/record',
          query: { recordId: id },
        })
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
          .get('/testing/answerRecord/list', {
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
