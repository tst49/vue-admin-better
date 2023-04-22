<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    width="800px"
    @close="close"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="135px">
      <el-form-item label="学生名" prop="nickname">
        <el-input
          v-model.trim="form.nickname"
          autocomplete="off"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item label="请求加入的班级" prop="clazzName">
        <el-input
          v-model.trim="form.clazzName"
          autocomplete="off"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item label="班级指导老师" prop="leaderName">
        <el-input
          v-model.trim="form.leaderName"
          autocomplete="off"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item label="申请原因" prop="applyReason">
        <el-input
          v-model.trim="form.applyReason"
          autocomplete="off"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item label="是否同意加入班级" prop="bindStatus">
        <el-radio-group v-model="form.bindStatus">
          <el-radio :label="2">是</el-radio>
          <el-radio :label="3">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        v-if="form.bindStatus == 3"
        label="审核不通过原因"
        prop="rejectReason"
      >
        <el-input
          v-model.trim="form.rejectReason"
          autocomplete="off"
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
    data() {
      return {
        form: {},
        rules: {
          reject: [{ required: true, trigger: 'blur', message: '请输入原因' }],
        },
        title: '',
        dialogFormVisible: false,
      }
    },
    created() {},
    methods: {
      showReview(id) {
        this.title = '加入班级审核'
        this.$axios
          .get('/manage_center/clazz/joinReview', {
            params: {
              studentId: id,
            },
          })
          .then((res) => {
            this.form = res.data.data
          })
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
            console.log(this.form)
            this.$axios
              .post('/manage_center/clazz/joinSubmit', this.form)
              .then((res) => {
                this.$alert('操作成功', '提示', {
                  confirmButtonText: '确定',
                  callback: (action) => {
                    this.dialogFormVisible = false
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
