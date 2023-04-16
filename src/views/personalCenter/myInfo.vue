<template>
  <div class="personalCenter-container">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="视频封面上传" prop="avatar">
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
            :file-list="fileList"
            :limit="1"
            :multiple="false"
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
              :visible.sync="dialogVisible"
              append-to-body
              title="查看大图"
            >
              <div>
                <img :src="imageUrl" alt="" width="100%" />
              </div>
            </el-dialog>
          </el-upload>
          <el-button type="primary" @click="submitUpload">开始上传</el-button>
        </div>
      </el-form-item>
      <el-form-item label="昵称">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="学校">
        <el-input v-model="form.school"></el-input>
      </el-form-item>
      <el-form-item label="班级">
        <el-input v-model="form.clazz"></el-input>
      </el-form-item>
      <el-form-item label="学号">
        <el-input v-model="form.sno"></el-input>
      </el-form-item>
      <el-form-item label="性别">
        <el-select v-model="form.gender" placeholder="请选择性别">
          <el-option label="男" value="male"></el-option>
          <el-option label="女" value="female"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="生日">
        <el-date-picker
          v-model="form.date1"
          type="date"
          placeholder="选择日期"
          style="width: 100%"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即创建</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    name: 'PersonalCenter',
    data() {
      return {
        form: {
          avatarUrl: '',
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: '',
        },
        loading: false,
        fileList: [],
        picture: 'picture',
        imageUrl: '',
        dialogVisible: false,
      }
    },
    created() {},
    methods: {
      handleProgress(event, file, fileList) {
        this.loading = true
      },
      handleSuccess(response, file, fileList) {
        this.form.thumbnail = response.data
        this.$baseMessage(`上传头像成功！`, 'success')
        this.loading = false
      },
      handleError(err, file, fileList) {
        this.$baseMessage(`上传头像失败！`, 'error')
        this.loading = false
      },
      handlePreview(file) {
        this.imageUrl = file.url
        this.dialogVisible = true
      },
      handleExceed(files, fileList) {
        this.$baseMessage(`只能选择一张图片作为头像哦`, 'error')
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
