<template>
  <div class="container">
    <el-card>
      <el-row class="query-row">
        <vab-icon :icon="['fas', 'search']"></vab-icon>
        <span>审核状态</span>
        <el-checkbox-group v-model="queryForm.status">
          <el-checkbox-button
            v-for="state in stateList"
            :key="state.value"
            :label="state.value"
          >
            {{ state.label }}
          </el-checkbox-button>
        </el-checkbox-group>
      </el-row>
      <el-row class="query-row">
        <vab-icon :icon="['fas', 'search']"></vab-icon>
        <span>指导老师</span>
        <el-select
          v-model="queryForm.leaderId"
          filterable
          placeholder="请选择指导老师"
          clearable
        >
          <el-option
            v-for="leader in leaders"
            :key="leader.id"
            :label="leader.nickname"
            :value="leader.id"
          ></el-option>
        </el-select>
      </el-row>
      <el-row class="query-row">
        <el-col :span="6">
          <vab-icon :icon="['fas', 'search']"></vab-icon>
          <span>班级名称</span>
          <el-input
            v-model="queryForm.clazzName"
            placeholder="班级名称"
            clearable
          ></el-input>
        </el-col>
        <el-col :span="6" :offset="3">
          <vab-icon :icon="['fas', 'search']"></vab-icon>
          <span>学生名称</span>
          <el-input
            v-model="queryForm.key"
            placeholder="学生名称"
            clearable
          ></el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-button icon="el-icon-search" type="primary" @click="fetchData">
          查询
        </el-button>
      </el-row>
    </el-card>

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
        type="selection"
        width="55"
      ></el-table-column>
      <el-table-column label="学生名" prop="nickname"></el-table-column>
      <el-table-column label="学生状态" prop="bindStatus">
        <template #default="scope">
          <el-tag :type="scope.row.bindStatus | tagTypeFilter">
            {{ scope.row.bindStatus | statusFilter }}
          </el-tag>
          <el-button
            v-if="scope.row.bindStatus == 1"
            type="text"
            @click="handleReview(scope.row.id)"
          >
            审核
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="所属班级" prop="clazzName"></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="leaderName"
        label="指导老师"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="bindTime"
        label="加入班级时间"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="school"
        label="学校"
      ></el-table-column>
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
    <table-edit ref="edit"></table-edit>
  </div>
</template>

<script>
  import TableEdit from './components/studentJoinClazzReview'
  export default {
    filters: {
      tagTypeFilter(status) {
        const typeMap = {
          0: 'info',
          1: 'warning',
          2: 'success',
          3: 'danger',
          4: 'primary',
        }
        return typeMap[status]
      },
      statusFilter(status) {
        const statusMap = {
          0: '未加入班级',
          1: '加入流程中',
          2: '已加入班级',
          3: '申请被拒绝',
          4: '教师组',
        }
        return statusMap[status]
      },
    },
    components: {
      TableEdit,
    },
    data() {
      return {
        stateList: [
          {
            value: 0,
            label: '未加入班级',
          },
          {
            value: 1,
            label: '加入流程中',
          },
          {
            value: 2,
            label: '已加入班级',
          },
          {
            value: 3,
            label: '申请被拒绝',
          },
        ],
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
          status: [],
          leaderId: '',
          clazzName: '',
          key: '',
        },
        leaders: [],
      }
    },
    computed: {
      height() {
        return this.$baseTableHeight()
      },
    },
    created() {
      this.initLeaders()
      this.fetchData()
    },
    methods: {
      handleReview(studentId) {
        this.$refs['edit'].showReview(studentId)
      },
      initLeaders() {
        this.$axios.get('/manage_center/teacher/list').then((res) => {
          this.leaders = res.data.data
        })
      },
      async fetchData() {
        this.listLoading = true
        console.log(this.queryForm)
        this.$axios
          .post('/manage_center/student/list', this.queryForm)
          .then((res) => {
            console.log(res)
            this.list = res.data.data.list
            this.total = res.data.data.total
          })
          .then(() => {
            this.listLoading = false
          })
      },
      setSelectRows(val) {
        this.selectRows = val
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

  .query-row {
    margin-bottom: 10px;
  }
</style>
