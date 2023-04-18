<template>
  <div class="goods-list-container">
    <vab-query-form>
      <vab-query-form-right-panel :span="24">
        <el-form
          ref="form"
          :model="queryForm"
          :inline="true"
          @submit.native.prevent
        >
          <el-form-item>
            <el-input v-model="queryForm.title" placeholder="试卷名称" />
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
    <el-row :gutter="20">
      <el-col
        v-for="(testPaper, index) in testPaperList"
        :key="index"
        :xs="24"
        :sm="8"
        :md="8"
        :lg="8"
        :xl="6"
      >
        <el-card :body-style="{ padding: '5px' }" shadow="always">
          <div slot="header">
            <el-tag :type="testPaper.status | statusFilter">
              {{ testPaper.status }}
            </el-tag>
            <el-divider direction="vertical"></el-divider>
            {{ testPaper.title }}
          </div>
          知识点：
          <el-tag v-for="tag in testPaper.tags" :key="tag">
            {{ tag }}
          </el-tag>
          <p>被作答次数：{{ testPaper.attemptCount }}</p>
          <el-row>
            <p style="float: left">
              本站用户平均分：{{ testPaper.averageScore }}
            </p>
            <el-button
              type="text"
              style="float: right; font-size: 15pt"
              @click="tryAnswer(testPaper.id)"
            >
              作答
            </el-button>
            <el-button
              type="text"
              style="float: right; font-size: 15pt; margin-right: 10px"
              @click="paperPreview(testPaper.id)"
            >
              预览
            </el-button>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
    <el-pagination
      background
      :current-page="queryForm.pageNo"
      :layout="layout"
      :page-size="queryForm.pageSize"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    ></el-pagination>
    <test-paper-preview ref="paperPreview"></test-paper-preview>
  </div>
</template>
<script>
  import TestPaperPreview from './components/testPaperPreview'
  export default {
    components: {
      TestPaperPreview,
    },
    filters: {
      statusFilter(status) {
        const statusMap = {
          未开始: 'info',
          尝试过: 'warning',
          已解答: 'success',
        }
        return statusMap[status]
      },
    },
    data() {
      return {
        queryForm: {
          pageNo: 1,
          pageSize: 10,
          title: '',
        },
        testPaperList: [],
        listLoading: true,
        layout: 'total, sizes, prev, pager, next, jumper',
        total: 0,
        background: true,
        elementLoadingText: '正在加载...',
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      tryAnswer(id) {
        this.$confirm(
          '答题<strong style="color: red">限时</strong>60分钟，请安排时间认真作答',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            dangerouslyUseHTMLString: true,
          }
        )
          .then(() => {
            this.$router.push({
              path: '/paper',
              query: { id: id },
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消作答',
            })
          })
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
      async fetchData() {
        this.listLoading = true
        this.$axios
          .get('/testing/paper/list', {
            params: {
              pageNo: this.queryForm.pageNo,
              pageSize: this.queryForm.pageSize,
              key: this.queryForm.title,
            },
          })
          .then((res) => {
            this.testPaperList = res.data.data.list
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
