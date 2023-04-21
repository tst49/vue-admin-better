<template>
  <div class="test-container">
    <el-card>
      <el-row>
        <el-form :inline="true" :model="queryForm" @submit.native.prevent>
          <vab-icon :icon="['fas', 'search']"></vab-icon>
          <span>搜索</span>
          <el-form-item>
            <el-input
              v-model.trim="queryForm.title"
              placeholder="请输入题目"
              clearable
            />
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" type="primary" @click="fetchData">
              查询
            </el-button>
          </el-form-item>
        </el-form>
      </el-row>
      <el-row>
        <vab-icon :icon="['fas', 'search']"></vab-icon>
        <span>知识点</span>
        <el-select
          v-model="queryForm.questionTags"
          multiple
          placeholder="请选择"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-row>
      <el-row>
        <vab-icon :icon="['fas', 'search']"></vab-icon>
        <span>题型</span>
        <el-checkbox-group v-model="queryForm.questionCategory">
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
        <vab-icon :icon="['fas', 'search']"></vab-icon>
        <span>难度</span>
        <el-checkbox-group v-model="queryForm.questionLevel">
          <el-checkbox-button
            v-for="level in levelList"
            :key="level.value"
            :label="level.value"
          >
            {{ level.label }}
          </el-checkbox-button>
        </el-checkbox-group>
      </el-row>
      <el-button type="primary" @click="generatePaper">
        生成试卷
        <i class="el-icon-upload el-icon--right"></i>
      </el-button>
      <el-popover
        v-model="visible"
        title="刷题设置"
        placement="top"
        width="500"
      >
        <div>
          <el-row :gutter="10">
            <span>测试类型：</span>
            <el-radio-group v-model="queryForm.numLimit">
              <el-radio :label="1">快速测试（约五分钟）</el-radio>
              <el-radio :label="2">常规测试（约三十分钟）</el-radio>
            </el-radio-group>
          </el-row>
          <el-row :gutter="10">
            <span>题目来源：</span>
            <el-radio-group v-model="queryForm.typeLimit">
              <el-radio :label="1">只出新题</el-radio>
              <el-radio :label="2">只出错题</el-radio>
              <el-radio :label="3">错题+新题</el-radio>
              <el-radio :label="4">不限来源</el-radio>
            </el-radio-group>
          </el-row>
          <el-row :gutter="10">
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="danger" @click="visible = false">
                取消
              </el-button>
              <el-button type="primary" size="mini" @click="quickTest">
                开始
              </el-button>
            </div>
          </el-row>
        </div>
        <el-button slot="reference" type="primary" style="margin-left: 15px">
          随机测试
          <i class="el-icon-upload el-icon--right"></i>
        </el-button>
      </el-popover>
    </el-card>
    <el-card>
      <el-table
        ref="tableSort"
        v-loading="listLoading"
        :data="list"
        :element-loading-text="elementLoadingText"
        @selection-change="setSelectRows"
      >
        <el-table-column
          show-overflow-tooltip
          type="selection"
          width="50"
        ></el-table-column>
        <el-table-column show-overflow-tooltip label="状态">
          <template #default="{ row }">
            <el-tag :type="row.status | statusFilter">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="难度">
          <template #default="{ row }">
            <el-tag :type="row.level | levelFilter" effect="plain">
              {{ levelList[row.level - 1].label }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          label="题目"
          width="400px"
          align="left"
        >
          <template #default="{ row }">
            <el-row>
              <el-button
                v-if="row.isLike"
                type="warning"
                icon="el-icon-star-on"
                circle
                disabled
              ></el-button>
              <el-button
                v-else
                type="warning"
                icon="el-icon-star-off"
                circle
                plain
                disabled
              ></el-button>
              <span>{{ row.title }}</span>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="题型">
          <template #default="{ row }">
            <el-tag :type="row.category | categoryFilter">
              {{ parseCategory(row.category) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          label="全站答题次数"
          prop="attemptCount"
          sortable
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          label="全站通过率"
          prop="passRatio"
          sortable
        ></el-table-column>
        <el-table-column show-overflow-tooltip label="操作">
          <template #default="{ row }">
            <el-button type="text" @click="haveTry(row.id)">作答</el-button>
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
    </el-card>
    <single-question ref="question"></single-question>
    <test-paper-preview ref="paperPreview"></test-paper-preview>
  </div>
</template>
<script>
  import SingleQuestion from './components/singleQuestion'
  import TestPaperPreview from './components/testPaperPreview'

  export default {
    name: 'Index',
    components: {
      SingleQuestion,
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
      levelFilter(level) {
        const levelMap = {
          1: 'success',
          2: 'warning',
          3: 'danger',
        }
        return levelMap[level]
      },
      categoryFilter(status) {
        const categoryMap = {
          1: 'info',
          2: 'warning',
          3: 'success',
          4: 'danger',
          5: '',
        }
        return categoryMap[status]
      },
    },
    data() {
      return {
        visible: false,
        queryForm: {
          pageNo: 1,
          pageSize: 10,
          title: '',
          questionTags: [],
          questionCategory: [],
          questionLevel: [],
          numLimit: 2,
          typeLimit: 4,
          testNow: false,
        },
        categoryList: [
          {
            value: '1',
            label: '单选',
          },
          {
            value: '2',
            label: '多选',
          },
          {
            value: '3',
            label: '判断',
          },
          {
            value: '4',
            label: '填空',
          },
          {
            value: '5',
            label: '简答',
          },
        ],
        levelList: [
          {
            value: '1',
            label: '简单',
          },
          {
            value: '2',
            label: '中等',
          },
          {
            value: '3',
            label: '困难',
          },
        ],
        options: [
          {
            value: '选项1',
            label: '黄金糕',
          },
          {
            value: '选项2',
            label: '双皮奶',
          },
          {
            value: '选项3',
            label: '蚵仔煎',
          },
          {
            value: '选项4',
            label: '龙须面',
          },
          {
            value: '选项5',
            label: '北京烤鸭',
          },
        ],
        list: [],
        listLoading: true,
        layout: 'total, sizes, prev, pager, next, jumper',
        total: 0,
        background: true,
        selectRows: '',
        elementLoadingText: '正在加载...',
      }
    },
    created() {
      this.fetchData()
    },
    mounted() {},
    methods: {
      async fetchData() {
        this.listLoading = true
        this.$axios
          .post('/testing/question/list', this.queryForm)
          .then((res) => {
            // console.log(res)
            this.list = res.data.data.list
            // this.queryForm.pageNo = res.data.data.current
            // console.log(this.queryForm.pageNo)
            this.total = res.data.data.total
          })
          .then(() => {
            this.listLoading = false
          })
      },
      haveTry(id) {
        this.$refs['question'].haveTry(id)
      },
      generatePaper() {
        this.queryForm.numLimit = 2
        this.queryForm.typeLimit = 4
        this.queryForm.testNow = false
        this.$axios.post('/testing/paper/init', this.queryForm).then((res) => {
          this.$refs['paperPreview'].paperPreview(res.data.data)
        })
      },
      quickTest() {
        this.queryForm.testNow = true
        this.$axios.post('/testing/paper/init', this.queryForm).then((res) => {
          this.$router.push({
            path: '/testing/paper',
            query: { data: res.data.data },
          })
        })
      },
      parseCategory(category) {
        switch (category) {
          case 1:
            return '单选题'
          case 2:
            return '多选题'
          case 3:
            return '判断题'
          case 4:
            return '填空题'
          case 5:
            return '简答题'
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
      setSelectRows(val) {
        // console.log(val)
        this.selectRows = val
      },
    },
  }
</script>
