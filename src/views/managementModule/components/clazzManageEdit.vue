<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    width="500px"
    @close="close"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="班级名称" prop="clazzName">
        <el-input
          v-model.trim="form.clazzName"
          autocomplete="off"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="指导老师" prop="leaderId">
        <el-select
          v-model="form.leaderId"
          filterable
          placeholder="请选择指导老师"
          clearable
        >
          <el-option
            v-for="leader in leaders"
            :key="leader.id"
            :label="leader.nickname"
            :value="leader.id"
          ></el-option>
        </el-select>
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
        leaders: [],
        form: {
          id: '',
          clazzName: '',
          leaderId: '',
        },
        rules: {
          clazzName: [
            { required: true, trigger: 'blur', message: '请设置班级名称' },
          ],
          leaderId: [
            { required: true, trigger: 'blur', message: '请设置指导老师' },
          ],
        },
        title: '',
        dialogFormVisible: false,
      }
    },
    created() {
      this.initLeaders()
    },
    methods: {
      initLeaders() {
        this.$axios.get('/manage_center/teacher/list').then((res) => {
          this.leaders = res.data.data
        })
      },
      showEdit(row) {
        if (!row) {
          this.title = '新增班级'
        } else {
          this.title = '修改班级信息'
          this.form = Object.assign({}, row)
        }
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
            this.$axios
              .post('/manage_center/clazz/edit', this.form)
              .then((res) => {
                this.$alert('操作成功', '提示', {
                  confirmButtonText: '确定',
                  callback: (action) => {
                    this.$refs['form'].resetFields()
                    this.dialogFormVisible = false
                    this.$parent.fetchData()
                  },
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
