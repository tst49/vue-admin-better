<template>
  <div>
    <div>
      <el-table
        :data="
          tableData.filter(
            (data) =>
              !search ||
              data.title.toLowerCase().includes(search.toLowerCase()) ||
              data.typeName.toLowerCase().includes(search.toLowerCase())
          )
        "
        style="width: 100%"
      >
        <!-- <el-table-column
          label="资料ID"
          prop="id"
          align="center"
          width="80"
        ></el-table-column> -->
        <el-table-column label="标题" align="center" show-overflow-tooltip>
          <template #default="scope">
            <router-link
              type="success"
              :to="{
                name: 'ArticleDetail',
                params: { articleId: scope.row.id },
              }"
            >
              {{ scope.row.title }}
            </router-link>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip label="知识点">
          <template #default="scope">
            <el-tag v-for="tag in scope.row.tags" :key="tag">{{ tag }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="发布者" prop="authorName"></el-table-column>
        <el-table-column
          label="浏览量"
          prop="viewCount"
          align="center"
        ></el-table-column>
        <el-table-column label="创建时间" prop="createTime"></el-table-column>
        <el-table-column
          label="上次修改时间"
          prop="modifyTime"
        ></el-table-column>
        <el-table-column align="right">
          <template slot="header">
            <el-input
              v-model="search"
              size="mini"
              placeholder="输入关键字搜索"
            />
          </template>
          <template #default="scope">
            <el-button size="mini" @click="handleEdit(scope.row.id)">
              Edit
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
        layout="prev, total,pager, next"
        :current-page="currentPage"
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
      handleEdit(articleId) {
        this.$router.push({
          name: 'ArticleEdit',
          params: {
            articleId: articleId,
          },
        })
      },
      handleDelete(articleId) {
        this.$confirm(
          '此操作将<strong style="color: red">永久删除</strong>该资料及其所有评论，是否删除?',
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
              .delete('/manage_center/article/delete', {
                params: {
                  articleId: articleId,
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
        this.$axios
          .get('learning/article/overview/list', {
            params: {
              pageNo: pageNo,
              pageSize: this.pageSize,
            },
          })
          .then((res) => {
            this.tableData = res.data.data.list
            this.pageNo = res.data.data.current
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
