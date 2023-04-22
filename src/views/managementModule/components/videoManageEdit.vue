<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    width="600px"
    @close="close"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="视频封面上传" prop="thumbnail">
        <div class="upload">
          <el-alert
            :closable="false"
            :title="`支持jpg、jpeg、png格式`"
            type="info"
          ></el-alert>
          <br />
          <el-upload
            ref="upload"
            :action="action"
            :auto-upload="false"
            :close-on-click-modal="false"
            :data="help.data"
            :file-list="help.fileList"
            :headers="help.headers"
            :limit="1"
            :multiple="true"
            :on-error="handleError"
            :on-exceed="handleExceed"
            :on-preview="handlePreview"
            :on-progress="handleProgress"
            :on-success="handleSuccess"
            accept="image/png, image/jpeg"
            class="upload-content"
            list-type="picture-card"
          >
            <i slot="trigger" class="el-icon-plus"></i>
            <el-dialog
              :visible.sync="help.dialogVisible"
              append-to-body
              title="查看大图"
            >
              <div>
                <img :src="help.dialogImageUrl" alt="" width="100%" />
              </div>
            </el-dialog>
          </el-upload>
          <el-button type="primary" @click="submitUpload">开始上传</el-button>
        </div>
      </el-form-item>
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
  const action = 'http://localhost:8084/file/upload/save'

  export default {
    name: 'TableEdit',
    data() {
      return {
        action: action,
        help: {
          data: {},
          loading: false,
          dialogVisible: false,
          headers: {},
          fileList: [],
          picture: 'picture',
          dialogImageUrl: '',
        },
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
        this.help.fileList.push({
          name: '1',
          url: row.thumbnail,
        })
        this.dialogFormVisible = true
        console.log(this.form)
      },
      submitUpload() {
        this.$refs.upload.submit()
      },
      handleProgress(event, file, fileList) {
        this.help.loading = true
      },
      handleSuccess(response, file, fileList) {
        this.form.thumbnail = response.data
        this.$baseMessage(`上传视频封面成功！`, 'success')
        this.help.loading = false
      },
      handleError(err, file, fileList) {
        this.$baseMessage(`上传视频封面失败！`, 'error')
        this.help.loading = false
      },
      handlePreview(file) {
        this.help.dialogImageUrl = file.url
        this.help.dialogVisible = true
      },
      handleExceed(files, fileList) {
        this.$baseMessage(`只能选择一张封面哦`, 'error')
      },
      handleShow(data) {
        this.help.title = '视频上传'
        this.help.data = data
        this.help.dialogFormVisible = true
      },
      close() {
        this.$refs['form'].resetFields()
        this.help = this.$options.data().help
        this.form = this.$options.data().form
        this.dialogFormVisible = false
        this.$parent.fetchData()
      },
      save() {
        this.$refs['form'].validate(async (valid) => {
          if (valid) {
            this.$axios
              .post('/manage_center/video/update', this.form)
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
