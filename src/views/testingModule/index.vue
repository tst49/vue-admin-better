<template>
  <div class="test-container">
    <el-card>
      <el-row>
        <el-form :inline="true" :model="queryForm" @submit.native.prevent>
          <vab-icon :icon="['fas', 'search']"></vab-icon>
          <span>搜索</span>
          <el-form-item>
            <el-input
              v-model.trim="queryForm.username"
              placeholder="请输入用户名"
              clearable
            />
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" type="primary" @click="queryData">
              查询
            </el-button>
          </el-form-item>
        </el-form>
      </el-row>
      <el-row>
        <vab-icon :icon="['fas', 'search']"></vab-icon>
        <span>筛选</span>
        <el-select v-model="value1" multiple placeholder="请选择">
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
        <el-checkbox-group v-model="questionCategory">
          <el-checkbox-button
            v-for="category in categoryList"
            :key="category"
            :label="category"
          >
            {{ category }}
          </el-checkbox-button>
        </el-checkbox-group>
      </el-row>
      <el-row>
        <vab-icon :icon="['fas', 'search']"></vab-icon>
        <span>难度</span>
        <el-checkbox-group v-model="questionLevel">
          <el-checkbox-button
            v-for="level in levelList"
            :key="level"
            :label="level"
          >
            {{ level }}
          </el-checkbox-button>
        </el-checkbox-group>
      </el-row>
    </el-card>
    <el-card>
      <el-table
        ref="tableSort"
        v-loading="listLoading"
        :data="list"
        :element-loading-text="elementLoadingText"
        :height="height"
        @selection-change="setSelectRows"
        @sort-change="tableSortChange"
      >
        <el-table-column
          show-overflow-tooltip
          type="selection"
          width="50"
        ></el-table-column>
        <el-table-column show-overflow-tooltip label="状态">
          <template #default="{ row }">
            <el-tooltip
              :content="row.status"
              class="item"
              effect="dark"
              placement="top-start"
            >
              <el-tag :type="row.status | statusFilter">
                {{ row.status }}
              </el-tag>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="难度">
          <template #default="{ row }">
            <el-tag :type="row.level | levelFilter" effect="plain">
              {{ levelList[row.level - 1] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          label="题目"
          prop="title"
          width="400px"
        ></el-table-column>
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
            <el-button type="text" @click="haveTry(row)">作答</el-button>
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
  </div>
</template>
<script>
  import SingleQuestion from './components/singleQuestion'
  export default {
    name: 'Index',
    components: {
      SingleQuestion,
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
        queryForm: {
          pageNo: 1,
          pageSize: 10,
          username: '',
        },
        questionCategory: [],
        questionLevel: [],
        categoryList: ['单选', '多选', '判断', '填空', '简答'],
        levelList: ['简单', '中等', '困难'],
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
        value1: [],
        imgShow: true,
        list: [
          {
            title: '1232',
            attemptCount: 1000,
            passRatio: '50.2%',
            status: '未开始',
            level: 1,
            category: 1,
          },
          {
            title: '1232',
            attemptCount: 900,
            passRatio: '25.2%',
            status: '尝试过',
            level: 2,
            category: 2,
          },
          {
            title: '1232',
            attemptCount: 800,
            passRatio: '10.2%',
            status: '已解答',
            level: 3,
            category: 3,
          },
        ],
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
        const imageList = []
        setTimeout(() => {
          this.listLoading = false
        }, 500)
      },
      haveTry(row) {
        this.$refs['question'].haveTry(row)
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
    },
  }
</script>
