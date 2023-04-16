<template>
  <div class="register-container">
    <el-row>
      <el-col :xs="24" :sm="24" :md="12" :lg="16" :xl="16">
        <div style="color: transparent">占位符</div>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
        <el-form
          ref="registerForm"
          :model="form"
          class="register-form"
          :rules="registerRules"
          size="mini"
        >
          <el-form-item prop="account">
            <el-popover
              ref="nicknamePopover"
              content="输入QQ号将自动拉取昵称和头像"
              placement="bottom"
              trigger="focus"
            ></el-popover>
            <el-input
              v-model="form.account"
              v-popover:nicknamePopover
              :validate-event="false"
              maxlength="12"
              show-word-limit
              placeholder="请输入QQ号"
            >
              <i slot="prefix" class="el-input__icon el-icon-user"></i>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model.trim="form.password"
              type="password"
              placeholder="设置密码"
              autocomplete="new-password"
            >
              <vab-icon slot="prefix" :icon="['fas', 'unlock']"></vab-icon>
            </el-input>
          </el-form-item>
          <el-form-item prop="pconfirm">
            <el-input
              v-model.trim="form.pconfirm"
              type="password"
              placeholder="请确认密码"
              autocomplete="new-password"
            >
              <vab-icon slot="prefix" :icon="['fas', 'unlock']"></vab-icon>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              class="register-btn"
              type="primary"
              @click.native.prevent="handleReister"
            >
              注册
            </el-button>
            <router-link to="/login">
              <div style="margin-top: 20px">登录</div>
            </router-link>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import { JSEncrypt } from 'jsencrypt' // 引入
  import { isPassword } from '@/utils/validate'
  export default {
    username: 'Register',
    directives: {
      focus: {
        inserted(el) {
          el.querySelector('input').focus()
        },
      },
    },
    data() {
      const validatePassword = (rule, value, callback) => {
        if (!isPassword(value)) {
          callback(new Error('密码不能少于6位'))
        } else {
          callback()
        }
      }
      const validateConfirm = (rule, value, callback) => {
        if (this.form.password == value) {
          callback()
        } else {
          callback(new Error('两次密码不一致'))
        }
      }
      return {
        form: {},
        registerRules: {
          account: [
            { required: true, trigger: 'blur', message: '请输入QQ号' },
            { min: 6, trigger: 'blur', message: '最少不能低于6位' },
            { max: 12, trigger: 'blur', message: '最多不能超过12位' },
          ],
          password: [
            { required: true, trigger: 'blur', message: '请输入密码' },
            { validator: validatePassword, trigger: 'blur' },
          ],
          pconfirm: [
            { required: true, trigger: 'blur', message: '两次密码不一致' },
            { validator: validateConfirm, trigger: 'blur' },
          ],
        },
        loading: false,
      }
    },
    created() {
      document.body.style.overflow = 'hidden'
    },
    beforeDestroy() {
      document.body.style.overflow = 'auto'
    },
    methods: {
      handleReister() {
        this.$refs['registerForm'].validate((valid) => {
          if (valid) {
            var qq = this.form.account
            if (!isNaN(Number(qq)) && qq.length > 5 && qq.length < 13) {
              this.$axios
                .get('https://api.usuuu.com/qq/' + qq)
                .then((res) => {
                  if (res.data) {
                    this.form.nickname = res.data.data.name
                    this.form.avatar = res.data.data.avatar
                  }
                })
                .then((res) => {
                  //获取rsa公钥
                  let publicKey
                  this.$axios
                    .get('/publicKey')
                    .then((res) => {
                      publicKey = res.data.data
                      //rsa加密
                      let encrypt = new JSEncrypt()
                      encrypt.setPublicKey(publicKey)
                      let encodePassword = encrypt.encrypt(this.form.password)
                      this.form.password = encodePassword
                    })
                    .then((res) => {
                      this.form.pconfirm = null
                      this.$axios.post('/register', this.form).then((res) => {
                        this.$alert('注册成功', '提示', {
                          confirmButtonText: '登录',
                          callback: (action) => {
                            this.$router.push('/login')
                          },
                        })
                      })
                    })
                })
            }
          } else {
            return false
          }
        })
      },
    },
  }
</script>

<style lang="scss" scoped>
  .register-container {
    height: 100vh;
    background: url('~@/assets/login_images/background.jpg') center center fixed
      no-repeat;
    background-size: cover;

    .title {
      font-size: 54px;
      font-weight: 500;
      color: rgba(14, 18, 26, 1);
    }

    .title-tips {
      margin-top: 29px;
      font-size: 26px;
      font-weight: 400;
      color: rgba(14, 18, 26, 1);
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .register-btn {
      display: inherit;
      width: 220px;
      height: 60px;
      margin-top: 5px;
      border: 0;

      &:hover {
        opacity: 0.9;
      }
    }

    .register-form {
      position: relative;
      max-width: 100%;
      margin: calc((100vh - 499px) / 2) 10% 10%;
      overflow: hidden;

      .forget-password {
        width: 100%;
        margin-top: 40px;
        text-align: left;

        .forget-password {
          width: 129px;
          height: 19px;
          font-size: 20px;
          font-weight: 400;
          color: rgba(92, 102, 240, 1);
        }
      }

      .per-code {
        width: 100px;
        height: 36px;
        font-size: 20px;
        line-height: 36px;
        color: #fff;
        text-align: center;
        cursor: pointer;
        background: #bbc1ce;
      }

      .phone-code {
        width: 120px;
        height: 36px;
        font-size: 14px;
        color: #fff;
        border-radius: 3px;
      }
    }

    .tips {
      margin-bottom: 10px;
      font-size: $base-font-size-default;
      color: $base-color-white;

      span {
        &:first-of-type {
          margin-right: 16px;
        }
      }
    }

    .title-container {
      position: relative;

      .title {
        margin: 0 auto 40px auto;
        font-size: 34px;
        font-weight: bold;
        color: $base-color-blue;
        text-align: center;
      }
    }

    .svg-container {
      position: absolute;
      top: 14px;
      left: 15px;
      z-index: $base-z-index;
      font-size: 16px;
      color: #d7dee3;
      cursor: pointer;
      user-select: none;
    }

    .show-pwd {
      position: absolute;
      top: 14px;
      right: 25px;
      font-size: 16px;
      color: $base-font-color;
      cursor: pointer;
      user-select: none;
    }

    ::v-deep {
      .el-form-item {
        padding-right: 0;
        margin: 20px 0;
        color: #454545;
        background: transparent;
        border: 1px solid transparent;
        border-radius: 2px;

        &__content {
          min-height: $base-input-height;
          line-height: $base-input-height;
        }

        &__error {
          position: absolute;
          top: 100%;
          left: 18px;
          font-size: $base-font-size-small;
          line-height: 18px;
          color: $base-color-red;
        }
      }

      .el-input {
        box-sizing: border-box;

        .el-input__count {
          .el-input__count-inner {
            background: transparent;
          }
        }

        .el-input__prefix {
          left: 15px;
          line-height: 56px;

          .svg-inline--fa {
            width: 20px;
          }
        }

        input {
          height: 58px;
          padding-left: 45px;
          font-size: $base-font-size-default;
          line-height: 58px;
          color: $base-font-color;
          background: #f6f4fc;
          border: 0;
          caret-color: $base-font-color;
        }
      }
    }
  }
</style>
