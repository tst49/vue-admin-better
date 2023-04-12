<template>
  <el-dialog
    :before-close="handleClose"
    :close-on-click-modal="false"
    :title="help.title"
    :visible.sync="help.dialogFormVisible"
    width="909px"
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
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="简介" prop="description">
        <el-input v-model="form.description"></el-input>
      </el-form-item>
      <el-form-item label="分类" prop="tags">
        <el-tag
          v-for="tag in form.tags"
          :key="tag"
          closable
          :disable-transitions="false"
          @close="handleTagClose(tag)"
        >
          {{ tag }}
        </el-tag>
        <el-input
          v-if="help.inputTagVisible"
          ref="saveTagInput"
          v-model="help.inputTagValue"
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
      <el-form-item label="视频上传" prop="videoUrl">
        <div class="upload">
          <el-alert
            :closable="false"
            :title="`支持mp4格式`"
            type="info"
          ></el-alert>
          <br />
          <el-upload
            ref="upload-video"
            :action="action"
            :auto-upload="false"
            :close-on-click-modal="false"
            :data="help.data"
            :limit="1"
            :file-list="help.videoList"
            :headers="help.headers"
            :on-error="handleVideoError"
            :on-progress="handleProgress"
            :on-success="handleVideoSuccess"
            :on-change="handleVideoChange"
            :on-remove="handleVideoRemove"
            :on-exceed="handleVideoExceed"
            :before-upload="beforeVideoUpload"
            class="upload-content"
            list-type="picture-card"
          >
            <video
              v-if="help.videoDialogVisible"
              :src="help.dialogVideoUrl"
              class="avatar video-avatar"
              controls="controls"
            >
              您的浏览器不支持视频播放
            </video>
            <i v-else slot="trigger" class="el-icon-plus"></i>
          </el-upload>
          <el-button type="primary" @click="videoUpload">开始上传</el-button>
        </div>
      </el-form-item>
    </el-form>
    <div
      slot="footer"
      class="dialog-footer"
      style="position: relative; padding-right: 15px; text-align: right"
    >
      <el-button type="primary" @click="handleClose">关闭</el-button>
      <el-button
        :loading="help.loading"
        size="small"
        style="margin-left: 10px"
        type="success"
        @click="submitForm"
      >
        开始上传
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
  const action = 'http://localhost:8084/file/upload/save'

  export default {
    data() {
      return {
        action: action,
        help: {
          title: '视频上传',
          data: {},
          loading: false,
          dialogFormVisible: false,
          dialogVisible: false,
          videoDialogVisible: false,
          headers: {},
          fileList: [],
          videoList: [],
          picture: 'picture',
          dialogImageUrl: '',
          dialogVideoUrl: '',
          inputTagVisible: false,
          inputTagValue: '',
        },
        form: {
          title: '',
          thumbnail: '',
          videoUrl: '',
          tags: [],
          description: '',
        },

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
            { required: true, message: '请输入简介', trigger: 'blur' },
          ],
          thumbnail: [
            { required: true, message: '请上传视频封面', trigger: 'blur' },
          ],
          videoUrl: [
            { required: true, message: '请上传视频', trigger: 'blur' },
          ],
        },
      }
    },
    computed: {},
    methods: {
      submitForm() {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.$axios.post('/learning/video/save', this.form).then((res) => {
              this.$alert('操作成功', '提示', {
                confirmButtonText: '确定',
                callback: (action) => {
                  this.$refs['form'].resetFields()
                  this.help = this.$options.data().help
                  this.help.dialogFormVisible = false
                  this.$parent.fetchData()
                },
              })
            })
          } else {
            return false
          }
        })
      },
      submitUpload() {
        this.$refs.upload.submit()
      },
      videoUpload() {
        this.$refs['upload-video'].submit()
      },
      beforeVideoUpload(file) {
        let suffix = file.name.substring(file.name.lastIndexOf('.') + 1)
        if (suffix !== 'mp4') {
          this.$message.error('请上传.mp4格式的视频')
          return false
        }
      },
      handleVideoChange(file, videoList) {
        this.help.dialogVideoUrl = file.url
        this.help.videoDialogVisible = true
      },
      handleVideoRemove(file, videoList) {
        this.help.videoDialogVisible = false
      },
      //
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
      handleVideoSuccess(response, file, fileList) {
        this.form.videoUrl = response.data
        this.$baseMessage(`上传视频成功！`, 'success')
        this.help.loading = false
      },
      handleVideoError(err, file, fileList) {
        this.$baseMessage(`上传视频失败！`, 'error')
        this.help.loading = false
      },
      handlePreview(file) {
        this.help.dialogImageUrl = file.url
        this.help.dialogVisible = true
      },
      handleExceed(files, fileList) {
        this.$baseMessage(`只能选择一张封面哦`, 'error')
      },
      handleVideoExceed(files, fileList) {
        this.$baseMessage(`只能上传一个视频哦`, 'error')
      },
      handleShow(data) {
        this.help.title = '视频上传'
        this.help.data = data
        this.help.dialogFormVisible = true
      },
      handleClose() {
        this.help = this.$options.data().help
        this.$refs['form'].resetFields()
      },
      //
      handleTagClose(tag) {
        this.form.tags.splice(this.form.tags.indexOf(tag), 1)
      },
      showInput() {
        this.help.inputTagVisible = true
        this.$nextTick((_) => {
          this.$refs.saveTagInput.$refs.input.focus()
        })
      },
      handleInputConfirm() {
        let inputTagValue = this.help.inputTagValue
        if (inputTagValue) {
          this.form.tags.push(inputTagValue)
        }
        this.help.inputTagVisible = false
        this.help.inputTagValue = ''
      },
    },
  }
</script>

<style lang="scss" scoped>
  .avatar {
    width: 300px;
    height: 178px;
    display: block;
  }

  .upload {
    // height: 500px;

    .upload-content {
      .el-upload__tip {
        display: block;
        height: 30px;
        line-height: 30px;
      }

      ::v-deep {
        .el-upload--picture-card {
          width: 128px;
          height: 128px;
          margin: 3px 8px 8px 8px;
          border: 2px dashed #c0ccda;
        }

        .el-upload-list--picture {
          margin-bottom: 20px;
        }

        .el-upload-list--picture-card {
          .el-upload-list__item {
            width: 128px;
            height: 128px;
            margin: 3px 8px 8px 8px;
          }
        }
      }
    }
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
