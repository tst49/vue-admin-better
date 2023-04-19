<template>
  <div class="personalCenter-container">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="头像上传" prop="avatar">
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
      <el-form-item label="学校">
        <el-input v-model="form.school" disabled></el-input>
      </el-form-item>
      <el-form-item label="班级">
        <el-button
          v-if="form.bindStatus == 0"
          type="text"
          @click="clazzApply(form.id)"
        >
          申请加入班级
        </el-button>
        <p v-if="form.bindStatus == 1" style="color: orange">
          当前已申请加入班级 [ {{ form.clazz }} ]，正在审核中
        </p>
        <el-button
          v-if="form.bindStatus == 1"
          type="text"
          @click="cancelApply(form.id)"
        >
          取消申请
        </el-button>
        <el-input
          v-if="form.bindStatus == 2"
          v-model="form.clazz"
          disabled
        ></el-input>
        <p v-if="form.bindStatus == 3" style="color: red">
          申请加入班级 [ {{ form.clazz }} ] 流程终止：{{ form.rejectReason }}
        </p>
        <el-button
          v-if="form.bindStatus == 3"
          type="text"
          @click="clazzApply(form.id)"
        >
          重新申请
        </el-button>
      </el-form-item>
      <el-form-item label="账号">
        <el-input v-model="form.account" disabled></el-input>
      </el-form-item>
      <el-form-item label="昵称">
        <el-input v-model="form.nickname"></el-input>
      </el-form-item>
      <el-form-item label="性别">
        <el-select v-model="form.gender" placeholder="请选择性别">
          <el-option label="男" :value="1"></el-option>
          <el-option label="女" :value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="生日">
        <el-date-picker
          v-model="form.birthday"
          type="date"
          placeholder="选择日期"
          style="width: 100%"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">保存</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
    <table-edit ref="apply"></table-edit>
  </div>
</template>

<script>
  const action = 'http://localhost:8084/file/upload/save'

  import TableEdit from './components/clazzApply'
  export default {
    components: {
      TableEdit,
    },
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
          id: null,
          avatar: '',
          account: '',
          nickname: '',
          school: '',
          clazz: '',
          gender: null,
          birthday: '',
          bindStatus: null,
        },
        loading: false,
      }
    },
    created() {
      this.getCurrentUserInfo()
    },
    methods: {
      cancelApply(id) {
        this.$confirm('确认取消加入班级', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '我再想想',
          type: 'warning',
        }).then(() => {
          this.$axios
            .get('/personal/clazz/apply/cancel', {
              params: {
                studentId: id,
              },
            })
            .then((res) => {
              this.getCurrentUserInfo()
            })
        })
      },
      clazzApply(id) {
        this.$refs['apply'].clazzApply(id)
      },
      onSubmit() {
        this.$axios.post('/personal/info/edit', this.form).then((res) => {
          this.$alert('操作成功', '提示', {
            confirmButtonText: '确定',
            callback: (action) => {
              this.getCurrentUserInfo()
            },
          })
        })
      },
      getCurrentUserInfo() {
        this.$axios.get('/personal/info').then((res) => {
          this.form = res.data.data
          if (this.help.fileList.length < 1) {
            this.help.fileList.push({
              name: '1',
              url: this.form.avatar,
            })
          }
        })
      },
      submitUpload() {
        this.$refs.upload.submit()
      },
      handleProgress(event, file, fileList) {
        this.help.loading = true
      },
      handleSuccess(response, file, fileList) {
        this.form.avatar = response.data
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
        this.$baseMessage(`只能选择一张图片做头像哦`, 'error')
      },
    },
  }
</script>

<style lang="scss" scoped>
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
</style>
