<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    width="650px"
    @close="close"
  >
    <el-transfer
      v-model="adminIds"
      style="text-align: left; display: inline-block"
      filterable
      :titles="['用户列表', '管理员列表']"
      :format="{
        noChecked: '${total}',
        hasChecked: '${checked}/${total}',
      }"
      :data="userData"
    ></el-transfer>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close()">取 消</el-button>
      <el-button type="primary" @click="setAdmin()">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  export default {
    name: 'TableEdit',
    data() {
      return {
        userData: [],
        adminIds: [],
        title: '',
        dialogFormVisible: false,
      }
    },
    created() {
      this.fetchAdminData()
    },
    methods: {
      async fetchAdminData() {
        this.listLoading = true
        this.$axios
          .get('/superAdmin/auth/admin/data')
          .then((res) => {
            this.userData = []
            res.data.data.userData.forEach((user, index) => {
              this.userData.push({
                key: user.id,
                label: user.nickname,
              })
            })
            this.adminIds = res.data.data.adminIds
          })
          .then(() => {
            this.listLoading = false
          })
      },
      setAdmin() {
        this.$confirm('确认更新管理员列表', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            this.$axios
              .post('/superAdmin/auth/admin/setting', this.adminIds)
              .then((res) => {
                this.$alert('操作成功', '提示', {
                  confirmButtonText: '确定',
                  callback: (action) => {
                    this.dialogFormVisible = false
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
      showEdit() {
        this.title = '修改管理员列表'
        this.dialogFormVisible = true
      },
      close() {
        this.dialogFormVisible = false
        this.$parent.queryAdmin()
      },
    },
  }
</script>

<style></style>
