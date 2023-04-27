<template>
  <div>
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
        <span>评论资料类型</span>
        <el-checkbox-group v-model="queryForm.dataCategory">
          <el-checkbox-button
            v-for="category in categoryList"
            :key="category.value"
            :label="category.value"
          >
            {{ category.label }}
          </el-checkbox-button>
        </el-checkbox-group>
      </el-row>
      <el-row>
        <el-button icon="el-icon-search" type="primary" @click="fetchData()">
          查询
        </el-button>
      </el-row>
    </el-card>

    <div>
      <el-table
        :data="
          tableData.filter(
            (data) =>
              !search ||
              data.content.toLowerCase().includes(search.toLowerCase()) ||
              data.nickname.toLowerCase().includes(search.toLowerCase())
          )
        "
        style="width: 100%"
      >
        <el-table-column
          label="评论内容"
          prop="content"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="评论资料" align="center">
          <template #default="scope">
            {{ scope.row.dataCategory | dataCategoryFilter }}：{{
              scope.row.dataTitle
            }}
          </template>
        </el-table-column>
        <el-table-column
          label="评论时间"
          prop="createTime"
          align="center"
        ></el-table-column>
        <el-table-column label="审核状态" align="center">
          <template #default="scope">
            <el-tag :type="scope.row.status | statusColorFilter">
              {{ scope.row.status | statusFilter }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="审核人"
          prop="reviewUserName"
          align="center"
        ></el-table-column>
        <el-table-column
          label="失败原因"
          prop="errMsg"
          align="center"
        ></el-table-column>
        <el-table-column
          label="审核时间"
          prop="reviewTime"
          align="center"
        ></el-table-column>
        <el-table-column align="center">
          <template slot="header">
            <el-input
              v-model="search"
              size="mini"
              placeholder="输入关键字搜索"
            />
          </template>
          <template #default="scope">
            <el-button
              size="mini"
              @click="handleJump(scope.row.dataId, scope.row.dataCategory)"
            >
              查看对应资料
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row.id)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        class="mypage"
        background
        layout="prev, total, pager, next"
        :current-page="queryForm.pageNo"
        :total="total"
        :page-size="queryForm.pageSize"
        @current-change="fetchData"
      ></el-pagination>
    </div>
    <single-question ref="question"></single-question>
  </div>
</template>

<script>
  import SingleQuestion from '../testingModule/components/singleQuestion'

  export default {
    components: {
      SingleQuestion,
    },
    filters: {
      statusFilter(status) {
        const statusMap = {
          0: '等待审核',
          1: '审核通过',
          2: '审核不通过',
        }
        return statusMap[status]
      },
      statusColorFilter(status) {
        const statusMap = {
          0: 'warning',
          1: 'success',
          2: 'danger',
        }
        return statusMap[status]
      },
      dataCategoryFilter(category) {
        const dataCategoryMap = {
          1: '在线算法',
          2: '资料',
          3: '题目',
        }
        return dataCategoryMap[category]
      },
    },
    data() {
      return {
        //tableData需要定义成[],不能是{},否则filter会报错
        tableData: [],
        search: '',
        queryForm: {
          pageNo: 1,
          pageSize: 15,
          status: [],
          dataCategory: [],
        },
        total: 0,
        stateList: [
          {
            value: 0,
            label: '等待审核',
          },
          {
            value: 1,
            label: '审核通过',
          },
          {
            value: 2,
            label: '审核不通过',
          },
        ],
        categoryList: [
          {
            value: 1,
            label: '在线算法',
          },
          {
            value: 2,
            label: '资料',
          },
          {
            value: 3,
            label: '题目',
          },
        ],
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      handleJump(id, category) {
        if (category == 1) {
          this.$router.push({
            path: '/video/detail',
            query: { videoId: id },
          })
        } else if (category == 2) {
          this.$router.push({
            path: '/article/detail',
            query: { articleId: id },
          })
        } else if (category == 3) {
          this.$refs['question'].haveTry(id)
        }
      },
      handleDelete(commentId) {
        this.$confirm(
          '此操作<strong style="color: red">不可恢复</strong>，是否删除?<br>',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            dangerouslyUseHTMLString: true,
          }
        )
          .then(() => {
            this.$axios
              .delete('/manage_center/comment', {
                params: {
                  commentId: commentId,
                },
              })
              .then((res) => {
                this.$alert('操作成功', '提示', {
                  confirmButtonText: '确定',
                  callback: (action) => {
                    this.fetchData()
                  },
                })
              })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除',
            })
          })
      },
      fetchData() {
        const _this = this
        _this.$axios
          .post('/personal/comment/list', this.queryForm)
          .then((res) => {
            _this.tableData = res.data.data.list
            _this.total = res.data.data.total
          })
      },
    },
  }
</script>

<style scoped>
  .el-button + span {
    margin-left: 10px;
  }

  .mypage {
    margin: 0 auto;
    text-align: center;
  }

  .query-row {
    margin-bottom: 10px;
  }
</style>
