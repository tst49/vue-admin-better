<template>
  <div class="container">
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-button icon="el-icon-plus" type="primary" @click="handleAdd">
          添加
        </el-button>
        <el-button icon="el-icon-delete" type="danger" @click="handleDelete">
          删除
        </el-button>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel>
        <el-form
          ref="form"
          :model="queryForm"
          :inline="true"
          @submit.native.prevent
        >
          <el-form-item>
            <el-input v-model="queryForm.title" placeholder="标题" />
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

    <el-table
      ref="tableSort"
      v-loading="listLoading"
      :data="list"
      :element-loading-text="elementLoadingText"
      :height="height"
      @selection-change="setSelectRows"
      @sort-change="tableSortChange"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="题目">
              <span>{{ props.row.content }}</span>
            </el-form-item>
            <el-form-item label="选项">
              <span>{{ props.row.options }}</span>
            </el-form-item>
            <el-form-item label="答案">
              <span>{{ props.row.answer }}</span>
            </el-form-item>
            <el-form-item label="贡献者">
              <span>{{ props.row.author }}</span>
            </el-form-item>
            <el-form-item label="创建时间">
              <span>{{ props.row.createTime }}</span>
            </el-form-item>
            <el-form-item label="修改时间">
              <span>{{ props.row.modifyTime }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        type="selection"
        width="55"
      ></el-table-column>
      <el-table-column label="难度">
        <template #default="{ row }">
          <el-tag :type="row.level | levelFilter" effect="plain">
            {{ levelList[row.level - 1] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="content"
        label="题目"
      ></el-table-column>
      <el-table-column label="题型">
        <template #default="{ row }">
          <el-tag :type="row.category | categoryFilter">
            {{ parseCategory(row.category) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="知识点">
        <template #default="{ row }">
          <el-tag v-for="tag in row.tags" :key="tag">{{ tag }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="操作" width="180px">
        <template #default="{ row }">
          <el-button type="text" @click="handleEdit(row)">编辑</el-button>
          <el-button type="text" @click="handleDelete(row)">删除</el-button>
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
    <table-edit ref="edit"></table-edit>
  </div>
</template>

<script>
  import TableEdit from './components/questionManageEdit'
  export default {
    name: 'QuestionManagement',
    components: {
      TableEdit,
    },
    filters: {
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
      levelFilter(level) {
        const levelMap = {
          1: 'success',
          2: 'warning',
          3: 'danger',
        }
        return levelMap[level]
      },
    },
    data() {
      return {
        levelList: ['简单', '中等', '困难'],
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
          key: '',
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
      tableSortChange() {
        const imageList = []
        this.$refs.tableSort.tableData.forEach((item, index) => {
          imageList.push(item.img)
        })
        this.imageList = imageList
      },
      setSelectRows(val) {
        // console.log(val)
        this.selectRows = val
      },
      handleAdd() {
        this.$refs['edit'].showEdit()
      },
      handleEdit(row) {
        // console.log(row)
        this.$refs['edit'].showEdit(row)
      },
      handleDelete(row) {
        if (row.id) {
          this.$baseConfirm('你确定要删除当前项吗', null, async () => {
            const { msg } = await doDelete({ ids: row.id })
            this.$baseMessage(msg, 'success')
            this.fetchData()
          })
        } else {
          if (this.selectRows.length > 0) {
            const ids = this.selectRows.map((item) => item.id).join()
            this.$baseConfirm('你确定要删除选中项吗', null, async () => {
              const { msg } = await doDelete({ ids: ids })
              this.$baseMessage(msg, 'success')
              this.fetchData()
            })
          } else {
            this.$baseMessage('未选中任何行', 'error')
            return false
          }
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
      async fetchData() {
        this.listLoading = true
        // const { data, totalCount } = await getList(this.queryForm)
        // this.list = data
        // console.log(data)
        // const imageList = []
        // data.forEach((item, index) => {
        //   imageList.push(item.img)
        // })
        // this.imageList = imageList
        // this.total = totalCount
        console.log(this.queryForm)
        this.$axios
          .get('/manage_center/question/list', {
            params: {
              key: this.queryForm.key,
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
