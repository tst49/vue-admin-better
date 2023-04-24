<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    width="500px"
    @close="close"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="配置项" prop="cfgKey">
        <el-input v-model.trim="form.cfgKey" disabled></el-input>
      </el-form-item>
      <el-form-item label="配置项描述" prop="cfgDesc">
        <el-input
          v-model.trim="form.cfgDesc"
          autocomplete="off"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="配置项取值" prop="cfgValue">
        <el-input
          v-model.trim="form.cfgValue"
          autocomplete="off"
          clearable
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  export default {
    name: 'TableEdit',
    data() {
      return {
        form: {},
        rules: {
          cfgDesc: [
            { required: true, trigger: 'blur', message: '配置项描述不能为空' },
          ],
          cfgValue: [
            { required: true, trigger: 'blur', message: '配置项取值不能为空' },
          ],
        },
        title: '',
        dialogFormVisible: false,
      }
    },
    created() {},
    methods: {
      editConfig(row) {
        this.title = '修改积分规则'
        this.form = Object.assign({}, row)
        this.dialogFormVisible = true
      },
      close() {
        this.$refs['form'].resetFields()
        this.form = this.$options.data().form
        this.dialogFormVisible = false
        this.$parent.fetchData()
      },
      save() {
        this.$refs['form'].validate(async (valid) => {
          if (valid) {
            this.$confirm('确定更改该配置', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
            })
              .then(() => {
                this.$axios
                  .post('/manage_center/config/edit', this.form)
                  .then((res) => {
                    this.$alert('更改成功', '提示', {
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
                  message: '已取消更改',
                })
              })
          } else {
            return false
          }
        })
      },
    },
  }
</script>

<style></style>
