<template>
  <div class="container">
    <el-table
      ref="tableSort"
      v-loading="listLoading"
      :data="list"
      :element-loading-text="elementLoadingText"
      :height="height"
    >
      <el-table-column label="班级" prop="clazzName"></el-table-column>
      <el-table-column show-overflow-tooltip prop="headcount" label="人数">
        <template #default="{ row }">
          <el-button type="text" @click="showStudent(row)">
            {{ row.headcount }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="leaderName"
        label="指导老师"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="school"
        label="学校"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="createTime"
        label="创建时间"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="modifyTime"
        label="上一次变更时间"
      ></el-table-column>
      <el-table-column show-overflow-tooltip label="操作">
        <template #default="{ row }">
          <el-button type="text" @click="showStudent(row)">
            查看班级详情
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
        total: 0,
        background: true,
        selectRows: '',
        elementLoadingText: '正在加载...',
        queryForm: {
          pageNo: 1,
          pageSize: 20,
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
      showStudent(row) {
        this.$router.push({
          path: '/my/student',
          query: { clazzName: row.clazzName },
        })
      },
      async fetchData() {
        this.listLoading = true
        console.log(this.queryForm)
        this.$axios
          .get('/personal/clazz/list', {
            params: {
              pageNo: this.queryForm.pageNo,
              pageSize: this.queryForm.pageSize,
            },
          })
          .then((res) => {
            console.log(res)
            this.list = res.data.data.list
            this.total = res.data.data.total
          })
          .then(() => {
            this.listLoading = false
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
