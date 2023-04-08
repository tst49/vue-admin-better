<template>
  <div>
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
        <el-table-column label="头像" width="100" align="center">
          <template #default="scope">
            <el-avatar
              shape="square"
              :size="50"
              fit="contain"
              :src="scope.row.avatar"
            ></el-avatar>
          </template>
        </el-table-column>
        <el-table-column
          label="昵称"
          prop="nickname"
          align="center"
        ></el-table-column>
        <el-table-column
          label="评论内容"
          prop="content"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="审核状态" align="center">
          <template #default="scope">
            {{ scope.row.status | statusFilter }}
          </template>
        </el-table-column>
        <el-table-column label="评论资料" align="center">
          <template #default="scope">
            {{ scope.row.dataCategory | dataCategoryFilter }}：{{
              scope.row.dataTitle
            }}
          </template>
        </el-table-column>
        <el-table-column
          label="创建时间"
          prop="createTime"
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
            <el-button size="mini" @click="handleJump(scope.row.id)">
              Jump to
            </el-button>
            <el-button size="mini" @click="handleReview(scope.row.id)">
              Review
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row.id)"
            >
              Delete
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        class="mypage"
        background
        layout="prev, total, pager, next"
        :current-page="pageNo"
        :total="total"
        :page-size="pageSize"
        @current-change="page"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
  export default {
    components: {},
    filters: {
      statusFilter(status) {
        const statusMap = {
          0: '等待审核',
          1: '审核通过',
          2: '审核不通过',
        }
        return statusMap[status]
      },
      dataCategoryFilter(category) {
        const dataCategoryMap = {
          1: '在线算法',
          2: '资料',
          3: '题目',
          4: '试卷',
        }
        return dataCategoryMap[category]
      },
    },
    data() {
      return {
        //tableData需要定义成[],不能是{},否则filter会报错
        tableData: [],
        search: '',
        pageNo: 1,
        pageSize: 15,
        total: 0,
      }
    },
    created() {
      this.page(1)
    },
    methods: {
      handleReview(commentId) {},
      handleJump() {},
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
              .delete('/manage_center/comment/delete', {
                params: {
                  commentId: commentId,
                },
              })
              .then((res) => {
                this.$alert('操作成功', '提示', {
                  confirmButtonText: '确定',
                  callback: (action) => {
                    this.page(1)
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
      page(pageNo) {
        const _this = this
        _this.$axios
          .get('/manage_center/comment/list', {
            params: {
              pageNo: pageNo,
              pageSize: this.pageSize,
            },
          })
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
</style>
