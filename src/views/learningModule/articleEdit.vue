<template>
  <div>
    <div class="m-content">
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        class="demo-ruleForm"
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="ruleForm.title"></el-input>
        </el-form-item>

        <el-form-item label="摘要" prop="description">
          <el-input v-model="ruleForm.description" type="textarea"></el-input>
        </el-form-item>

        <el-form-item label="内容" prop="content">
          <mavon-editor v-model="ruleForm.content"></mavon-editor>
        </el-form-item>

        <el-form-item label="知识点" prop="tags">
          <el-tag
            v-for="tag in ruleForm.tags"
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

        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">
            提交
          </el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        ruleForm: {
          id: '',
          title: '',
          description: '',
          content: '',
          tags: [],
        },
        inputTagVisible: false,
        inputTagValue: '',
        rules: {
          title: [
            { required: true, message: '请输入标题', trigger: 'blur' },
            {
              min: 3,
              max: 25,
              message: '长度在 3 到 25 个字符',
              trigger: 'blur',
            },
          ],
          description: [
            { required: true, message: '请输入摘要', trigger: 'blur' },
          ],
          content: [{ required: true, message: '请输入内容', trigger: 'blur' }],
        },
      }
    },
    created() {
      this.getArticleById()
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const _this = this
            this.$axios
              .post('/learning/article/save', this.ruleForm)
              .then((res) => {
                _this.$alert('操作成功', '提示', {
                  confirmButtonText: '确定',
                  callback: (action) => {
                    //create
                    if (_this.ruleForm.id == '') {
                      _this.$router.push('/article/index')
                    } else {
                      _this.$router.back()
                    }
                  },
                })
              })
          } else {
            return false
          }
        })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields()
      },
      handleClose(tag) {
        this.ruleForm.tags.splice(this.ruleForm.tags.indexOf(tag), 1)
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
          this.ruleForm.tags.push(inputTagValue)
        }
        this.inputTagVisible = false
        this.inputTagValue = ''
      },
      getArticleById() {
        const _this = this
        const articleId = _this.$route.params.articleId
        if (articleId) {
          this.$axios
            .get('/learning/article/detail', {
              params: {
                articleId: articleId,
              },
            })
            .then((res) => {
              this.ruleForm = Object.assign(this.ruleForm, res.data.data)
            })
        }
      },
    },
  }
</script>

<style scoped>
  .m-content {
    text-align: center;
  }

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
