<template>
  <div class="container">
    <el-card>
      <el-row class="query-row">
        <vab-icon :icon="['fas', 'search']"></vab-icon>
        <span>类型</span>
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
      <el-row class="query-row">
        <vab-icon :icon="['fas', 'search']"></vab-icon>
        <span>资料名</span>
        <el-input
          v-model="queryForm.key"
          placeholder="输入关键字"
          clearable
          style="width: 20%"
        ></el-input>
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
    >
      <el-table-column>
        <template #default="{ row }">
          <el-button
            type="danger"
            @click="cancelLike(row.dataCategory, row.dataId)"
          >
            取消收藏
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="类型" prop="dataCategory">
        <template #default="{ row }">
          <span style="color: blue; font-size: 15pt">
            {{ parseCategory(row.dataCategory) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="内容" prop="title"></el-table-column>
      <el-table-column show-overflow-tooltip label="知识点">
        <template #default="{ row }">
          <el-tag v-for="tag in row.tags" :key="tag">{{ tag }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="createTime"
        label="收藏时间"
      ></el-table-column>
      <el-table-column show-overflow-tooltip label="操作">
        <template #default="{ row }">
          <el-button
            v-if="row.dataCategory == 4"
            type="text"
            @click="preview(row.dataId)"
          >
            预览
          </el-button>
          <el-button
            v-if="[3, 4].includes(row.dataCategory)"
            type="text"
            @click="tryAnswer(row.dataCategory, row.dataId)"
          >
            作答
          </el-button>
          <el-button
            v-if="[1, 2].includes(row.dataCategory)"
            type="text"
            @click="showDetail(row.dataCategory, row.dataId)"
          >
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
    <test-paper-preview ref="paperPreview"></test-paper-preview>
    <single-question ref="question"></single-question>
  </div>
</template>

<script>
  import SingleQuestion from '../testingModule/components/singleQuestion'
  import TestPaperPreview from '../testingModule/components/testPaperPreview'

  export default {
    components: {
      TestPaperPreview,
      SingleQuestion,
    },
    data() {
      return {
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
          {
            value: 4,
            label: '试卷',
          },
        ],
        list: [],
        listLoading: true,
        layout: 'total, sizes, prev, pager, next, jumper',

        background: true,
        elementLoadingText: '正在加载...',
        queryForm: {
          pageNo: 1,
          pageSize: 20,
          dataCategory: [],
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
    methods: {
      preview(id) {
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
      tryAnswer(category, id) {
        if (category == 4) {
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
        } else if (category == 3) {
          this.$refs['question'].haveTry(id)
        }
      },
      showDetail(category, id) {
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
        }
      },
      cancelLike(dataCategory, dataId) {
        this.$confirm('确认取消收藏吗', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '我再想想',
          type: 'warning',
        }).then(() => {
          this.$axios
            .get('/manage_center/like/edit', {
              params: {
                bool: false,
                dataCategory: dataCategory,
                dataId: dataId,
              },
            })
            .then((res) => {
              this.$alert('已取消收藏', '提示', {
                confirmButtonText: '确定',
                callback: (action) => {
                  this.fetchData()
                },
              })
            })
        })
      },
      async fetchData() {
        this.listLoading = true
        console.log(this.queryForm)
        this.$axios
          .post('/personal/like/list', this.queryForm)
          .then((res) => {
            console.log(res)
            this.list = res.data.data.list
            this.total = res.data.data.total
          })
          .then(() => {
            this.listLoading = false
          })
      },
      parseCategory(category) {
        switch (category) {
          case 1:
            return '在线算法'
          case 2:
            return '资料'
          case 3:
            return '题目'
          case 4:
            return '试卷'
        }
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
