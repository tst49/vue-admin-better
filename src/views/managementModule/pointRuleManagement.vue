<template>
  <div class="container">
    <el-table
      ref="tableSort"
      v-loading="listLoading"
      :data="list"
      :element-loading-text="elementLoadingText"
    >
      <el-table-column label="配置项" prop="cfgKey"></el-table-column>
      <el-table-column label="配置项描述" prop="cfgDesc"></el-table-column>
      <el-table-column label="取值" prop="cfgValue"></el-table-column>
      <el-table-column show-overflow-tooltip label="操作" width="180px">
        <template #default="{ row }">
          <el-button type="text" @click="handleEdit(row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <table-edit ref="edit"></table-edit>
  </div>
</template>

<script>
  import TableEdit from './components/pointRuleEdit'
  export default {
    components: {
      TableEdit,
    },
    data() {
      return {
        list: [],
        listLoading: true,
        elementLoadingText: '正在加载...',
      }
    },
    computed: {},
    created() {
      this.fetchData()
    },
    methods: {
      handleEdit(row) {
        this.$refs['edit'].editConfig(row)
      },
      async fetchData() {
        this.listLoading = true
        this.$axios
          .get('/manage_center/config/list')
          .then((res) => {
            this.list = res.data.data
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

  .query-row {
    margin-bottom: 10px;
  }
</style>
