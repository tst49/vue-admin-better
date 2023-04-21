<template>
  <div class="container">
    <el-card style="width: 51%; float: left; height: 365px">
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
              v-model="visible"
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
                @click="showLeaderClazz(row.id)"
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
  </div>
</template>

<script>
  export default {
    data() {
      return {
        userData: [],
        teacherTableList: [],
        teachersearch: '',
        teacherIds: [],
        visible: false,
        clazzCountDetail: [],

        listLoading: true,
        layout: 'total, sizes, prev, pager, next, jumper',
        total: 0,
        background: true,
        elementLoadingText: '正在加载...',
        queryForm: {},
        leaders: [],
      }
    },
    created() {
      this.fetchTeacherData()
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
      showLeaderClazz(id) {
        this.visible = !this.visible
        this.$axios
          .get('/manage_center/auth/teacher/clazzCountDetail', {
            params: {
              teacherId: id,
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
