<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    width="500px"
    @close="close"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="标题" prop="content">
        <el-input
          v-model.trim="form.content"
          autocomplete="off"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item label="评论用户" prop="nickname">
        <el-input
          v-model.trim="form.nickname"
          autocomplete="off"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item label="题型" prop="category">
        <el-select v-model="form.status" placeholder="请选择">
          <el-option
            v-for="item in statusList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="form.status == 2"
        label="审核不通过原因"
        prop="errMsg"
      >
        <el-input v-model.trim="form.errMsg" autocomplete="off"></el-input>
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
        form: {
          id: '',
          content: '',
          nickname: '',
          status: 0,
          errMsg: '',
        },
        statusList: [
          {
            value: 0,
            label: '等待审核',
          },
          {
            value: 1,
            label: '审核通过',
          },
          {
            value: 2,
            label: '审核不通过',
          },
        ],
        rules: {
          errMsg: [{ required: true, trigger: 'blur', message: '请输入原因' }],
        },
        title: '',
        dialogFormVisible: false,
      }
    },
    created() {},
    methods: {
      review(row) {
        this.title = '评论审核'
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
            this.$axios
              .post('/manage_center/comment/review', this.form)
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
      handleClose(tag) {
        this.form.tags.splice(this.form.tags.indexOf(tag), 1)
      },

      showInput() {
        this.inputTagVisible = true
        this.$nextTick((_) => {
          this.$refs.saveTagInput.$refs.input.focus()
        })
      },

      handleInputConfirm() {
        let inputTagValue = this.inputTagValue
        if (inputTagValue) {
          this.form.tags.push(inputTagValue)
        }
        this.inputTagVisible = false
        this.inputTagValue = ''
      },
    },
  }
</script>

<style></style>
