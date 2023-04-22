<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    width="500px"
    @close="close"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="标题" prop="title">
        <el-input v-model.trim="form.title" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="知识点" prop="tags">
        <el-tag
          v-for="tag in form.tags"
          :key="tag"
          closable
          :disable-transitions="false"
          @close="handleClose(tag)"
        >
          {{ tag }}
        </el-tag>
        <el-input
          v-if="inputTagVisible"
          ref="saveTagInput"
          v-model="inputTagValue"
          class="input-new-tag"
          size="small"
          @keyup.enter.native="handleInputConfirm"
          @blur="handleInputConfirm"
        ></el-input>
        <el-button
          v-else
          class="button-new-tag"
          size="small"
          @click="showInput"
        >
          + New Tag
        </el-button>
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
        form: {
          id: '',
          title: '',
          tags: [],
        },
        rules: {
          title: [{ required: true, trigger: 'blur', message: '请输入标题' }],
          answer: [{ required: true, trigger: 'blur', message: '请输入答案' }],
        },
        title: '',
        dialogFormVisible: false,
        inputTagVisible: false,
        inputTagValue: '',
      }
    },
    created() {},
    methods: {
      showEdit(row) {
        this.title = '编辑'
        this.form = Object.assign({}, row)
        this.dialogFormVisible = true
        console.log(this.form)
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
              .post('/manage_center/paper/update', this.form)
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

<style>
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>
