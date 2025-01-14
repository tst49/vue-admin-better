<template>
  <div class="container">
    <el-card style="width: 51.5%; float: left; height: 365px">
      <el-transfer
        v-model="teacherIds"
        style="text-align: left; display: inline-block; height: 350px"
        filterable
        :titles="['用户列表', '教师列表']"
        :format="{
          noChecked: '${total}',
          hasChecked: '${checked}/${total}',
        }"
        :data="userData"
      >
        <el-button
          slot="right-footer"
          class="transfer-footer"
          size="small"
          @click="fetchTeacherData()"
        >
          刷新
        </el-button>
        <el-button
          slot="right-footer"
          class="transfer-footer"
          size="small"
          @click="setTeacher()"
        >
          确认
        </el-button>
      </el-transfer>
    </el-card>
    <el-card style="width: 48%; float: left; height: 365px">
      <el-table
        ref="tableSort"
        v-loading="listLoading"
        :data="teacherTableList"
        :element-loading-text="elementLoadingText"
        height="350px"
        size="mini"
      >
        <el-table-column
          label="教师名称"
          prop="nickname"
          align="center"
        ></el-table-column>
        <el-table-column label="性别" prop="gender" align="center">
          <template #default="{ row }">
            <span>{{ parseGender(row.gender) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="指导班级数量"
          prop="leaderClazzNum"
          align="center"
        >
          <template #default="{ row }">
            <el-popover
              v-model="row.visible"
              placement="bottom"
              title="指导班级信息"
              trigger="manual"
            >
              <el-table :data="clazzCountDetail">
                <el-table-column
                  width="100"
                  property="clazzName"
                  label="班级名称"
                ></el-table-column>
                <el-table-column
                  width="100"
                  property="headcount"
                  label="班级人数"
                ></el-table-column>
                <el-table-column
                  width="150"
                  property="createTime"
                  label="创建时间"
                ></el-table-column>
              </el-table>
              <el-button
                slot="reference"
                type="text"
                @click="showLeaderClazz(row)"
              >
                {{ row.leaderClazzNum }}
              </el-button>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          label="注册时间"
          align="center"
          prop="createTime"
        ></el-table-column>
      </el-table>
    </el-card>

    <!-- 管理员列表 -->
    <el-card style="float: left; width: 99.5%">
      <vab-query-form>
        <vab-query-form-left-panel>
          <el-button
            v-permissions="['super']"
            icon="el-icon-plus"
            type="primary"
            @click="handleEdit()"
          >
            添加
          </el-button>
          <el-form
            ref="form"
            :model="queryForm"
            :inline="true"
            @submit.native.prevent
          >
            <el-form-item>
              <el-input
                v-model="queryForm.key"
                placeholder="输入名称"
                clearable
              />
            </el-form-item>
            <el-form-item>
              <el-button
                icon="el-icon-search"
                type="primary"
                native-type="submit"
                @click="queryAdmin()"
              >
                查询
              </el-button>
            </el-form-item>
          </el-form>
        </vab-query-form-left-panel>
      </vab-query-form>

      <el-table
        ref="tableSort"
        v-loading="listLoadingad"
        :data="adminList"
        :element-loading-text="elementLoadingText"
        stripe
      >
        <el-table-column
          show-overflow-tooltip
          prop="adminName"
          label="管理员名称"
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="school"
          label="学校"
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="createTime"
          label="创建时间"
        ></el-table-column>
        <el-table-column show-overflow-tooltip label="操作" width="180px">
          <template #default="{ row }">
            <el-button
              v-permissions="['super']"
              type="text"
              @click="handleEdit(row)"
            >
              移除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <table-edit ref="edit"></table-edit>
  </div>
</template>

<script>
  import TableEdit from './components/authAdminEdit'

  export default {
    components: {
      TableEdit,
    },
    data() {
      return {
        userData: [],
        teacherTableList: [],
        teacherIds: [],
        clazzCountDetail: [],

        listLoading: true,
        layout: 'total, sizes, prev, pager, next, jumper',
        total: 0,
        background: true,
        elementLoadingText: '正在加载...',
        queryForm: {},
        leaders: [],

        adminList: [],
        listLoadingad: true,
      }
    },
    created() {
      this.fetchTeacherData()
      this.queryAdmin()
    },
    methods: {
      setTeacher() {
        this.$confirm('确认更新教师列表', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            this.$axios
              .post('/manage_center/auth/teacher/setting', this.teacherIds)
              .then((res) => {
                this.$alert('操作成功', '提示', {
                  confirmButtonText: '确定',
                  callback: (action) => {
                    this.fetchTeacherData()
                  },
                })
              })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消',
            })
          })
      },
      showLeaderClazz(row) {
        if (row.visible) {
          row.visible = false
          return
        }
        row.visible = true
        this.$axios
          .get('/manage_center/auth/teacher/clazzCountDetail', {
            params: {
              teacherId: row.id,
            },
          })
          .then((res) => {
            this.clazzCountDetail = res.data.data
          })
      },
      async fetchTeacherData() {
        this.listLoading = true
        this.$axios
          .get('/manage_center/auth/teacher/data')
          .then((res) => {
            this.userData = []
            res.data.data.userData.forEach((user, index) => {
              this.userData.push({
                key: user.id,
                label: user.nickname,
              })
            })
            this.teacherIds = res.data.data.teacherIds
            this.teacherTableList = res.data.data.tableList
          })
          .then(() => {
            this.listLoading = false
          })
      },
      parseGender(gender) {
        if (gender == 1) {
          return '男'
        } else if (gender == 0) {
          return '女'
        } else {
          return '用户未设置'
        }
      },
      queryAdmin() {
        this.listLoadingad = true
        this.$axios
          .get('/manage_center/auth/admin/list', {
            params: {
              key: this.queryForm.key,
            },
          })
          .then((res) => {
            this.adminList = res.data.data
          })
          .then((res) => {
            this.listLoadingad = false
          })
      },
      handleEdit() {
        this.$refs['edit'].showEdit()
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
