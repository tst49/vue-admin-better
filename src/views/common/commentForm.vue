<template>
  <!-- 评论输入表单 -->
  <div class="form">
    <h3>
      发表评论
      <el-button
        v-show="rootCommentId != -1"
        class="m-small"
        size="mini"
        type="primary"
        @click="toSendParentId()"
      >
        取消回复
      </el-button>
    </h3>
    <el-form ref="formRef" :model="commentForm" size="small">
      <el-input
        v-model="commentForm.content"
        :class="'textarea'"
        :rows="5"
        :validate-event="false"
        maxlength="250"
        placeholder="评论千万条，友善第一条"
        show-word-limit
        type="textarea"
      ></el-input>

      <el-row :gutter="20">
        <!-- <el-col :span="6">
          <el-form-item prop="nickname">
            <el-popover
              ref="nicknamePopover"
              content="输入QQ号将自动拉取昵称和头像"
              placement="bottom"
              trigger="focus"
            ></el-popover>
            <el-input
              v-model="commentForm.nickname"
              v-popover:nicknamePopover
              :validate-event="false"
              placeholder="昵称（必填）"
              @blur="onInputBlur"
            >
              <i slot="prefix" class="el-input__icon el-icon-user"></i>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item prop="email">
            <el-popover
              ref="emailPopover"
              content="用于接收回复邮件"
              placement="bottom"
              trigger="focus"
            ></el-popover>
            <el-input
              v-model="commentForm.email"
              v-popover:emailPopover
              :validate-event="false"
              placeholder="邮箱（必填）"
              clearable
            >
              <i slot="prefix" class="el-input__icon el-icon-message"></i>
            </el-input>
          </el-form-item>
        </el-col> -->
        <el-col :offset="1" :span="5">
          <el-form-item>
            <!-- 接口节流  -->
            <el-button
              size="medium"
              type="primary"
              @click="postForm"
              @mouseenter.native="beforePost"
            >
              发表评论
            </el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
  export default {
    name: 'CommentForm',
    props: {
      rootCommentId: {
        type: String,
        default: '-1',
      },
      parentCommentId: {
        type: String,
        default: '-1',
      },
      dataCategory: {
        type: Number,
        default: -1,
      },
      dataId: {
        type: String,
        default: '-1',
      },
    },
    data() {
      const checkEmail = (rule, value, callback) => {
        // 验证邮箱的正则表达式
        const regEmail = /^\w+@\w+(\.\w+)+$/
        if (regEmail.test(value)) {
          return callback()
        }
        //返回一个错误提示
        callback(new Error('请输入合法的邮箱'))
      }
      return {
        commentForm: {
          dataCategory: this.dataCategory,
          dataId: this.dataId,
          rootId: this.rootCommentId,
          parentId: this.parentCommentId,
          content: '',
        },
        // rules: {
        //   nickname: [
        //     { required: true, message: '请输入评论昵称' },
        //     { max: 15, message: '昵称不可多于15个字符', trigger: 'blur' },
        //   ],
        //   email: [
        //     { required: true, message: '请输入评论邮箱' },
        //     {
        //       min: 2,
        //       max: 30,
        //       message: '不可多于30个字符、少于2个字符',
        //       trigger: 'blur',
        //     },
        //     { validator: checkEmail },
        //   ],
        // },
      }
    },
    watch: {},
    created() {},
    methods: {
      //设计哈希函数
      //1>将字符串转成比较大的数字：hashCode
      //2>将大的数字hashCode压缩到数组范围
      // hashFunc(str, size) {
      //   //1.定义hashCode变量
      //   var hashCode = 0
      //   //2.霍纳算法，来计算 hashCode的值
      //   for (var i = 0; i < str.length; i++) {
      //     hashCode = 37 * hashCode + str.charCodeAt(i) //获取编码
      //   }
      //   //3.取余状态
      //   var index = (hashCode % size) + 1
      //   return index
      // },
      //取消回复 向父组件传值 并设置评论父id
      toSendParentId() {
        this.$emit('parentEvent', '取消回复了')
        //console.log("取消")
        this.commentForm.parentId = -1
      },
      // onInputBlur() {
      //   this.getQQinfo()
      // },
      // getQQinfo() {
      //   const _this = this
      //   var qq = this.commentForm.nickname
      //   if (!isNaN(Number(qq)) && qq.length > 4 && qq.length < 12) {
      //     this.$axios.get('https://api.usuuu.com/qq/' + qq).then((res) => {
      //       console.log(res)
      //       if (res.data) {
      //         _this.commentForm.nickname = res.data.data.name
      //         _this.commentForm.avatar = res.data.data.avatar
      //         _this.commentForm.qq = res.data.data.qq
      //       }
      //     })
      //   } else {
      //     _this.commentForm.avatar =
      //       'https://i.postimg.cc/50RT1H5V/src-http-img-sccnn-com-bimg-338-62007-jpg-refer-http-img-sccnn.webp'
      //     _this.commentForm.qq = '空'
      //   }
      // },
      //提交之前检查头像地址是否为空
      beforePost() {
        // //console.log("beforePost===================================================================")
        // if (this.commentForm.avatar == '') {
        //   this.getQQinfo()
        // }
      },
      //提交评论
      postForm() {
        this.$confirm(
          '发表后<strong style="color: red">不可修改</strong>，是否发表?',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '我再想想',
            type: 'warning',
            dangerouslyUseHTMLString: true,
          }
        )
          .then(() => {
            //表单校验
            this.$refs.formRef.validate((valid) => {
              if (valid) {
                // console.log(JSON.stringify(this.commentForm))
                //判断是否为管理员(博主)
                // if (this.commentForm.isAdminComment) {
                //   this.commentForm.avatar =
                //     'https://i.postimg.cc/kM84cfrY/QQ-20220403192249.jpg'
                // }
                //console.log("before post==========================================="+this.commentForm)
                this.$axios
                  .post('/comment/add', this.commentForm)
                  .then((res) => {
                    //console.log(res)
                    if (res.data.code == 200) {
                      this.$alert('发送成功', '提示', {
                        confirmButtonText: '确定',
                        callback: (action) => {
                          this.$parent.showComment(
                            this.dataCategory,
                            this.dataId
                          )
                        },
                      })
                    } else {
                      alert('失败')
                    }
                  })
              } else {
                console.log('error submit!!')
                alert('输入数据不合法，请检查')
                return false
              }
            })
          })
          .catch(() => {
            //this.commentForm.avatar = ""
            this.$message({
              type: 'info',
              message: '已取消评论',
            })
          })
      },
    },
  }
</script>

<style scoped>
  .form h3 {
    margin: 5px;
    font-weight: 500 !important;
  }
  .form .m-small {
    margin-left: 5px;
    padding: 4px 5px;
  }
  .el-form .textarea {
    margin-top: 5px;
    margin-bottom: 15px;
  }
  .el-form textarea {
    padding: 6px 8px;
  }
  .el-form textarea,
  .el-form input {
    color: black;
  }
  .el-form .el-form-item__label {
    padding-right: 3px;
  }
</style>
