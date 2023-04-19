<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    width="500px"
    @close="close"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="135px">
      <el-form-item label="申请加入班级" prop="clazzId">
        <el-select
          v-model="form.clazzId"
          filterable
          placeholder="请选择班级"
          clearable
        >
          <el-option
            v-for="clazz in clazzList"
            :key="clazz.id"
            :label="clazz.clazzName"
            :value="clazz.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="申请原因" prop="applyReason">
        <el-input
          v-model.trim="form.applyReason"
          autocomplete="off"
          clearable
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
    name: 'TableEdit',
    data() {
      return {
        clazzList: [],
        form: {
          id: '',
          clazzId: null,
          applyReason: null,
        },
        rules: {
          clazzId: [
            { required: true, trigger: 'blur', message: '请选择目标班级' },
          ],
          applyReason: [
            { required: true, trigger: 'blur', message: '请说明加入原因' },
          ],
        },
        title: '',
        dialogFormVisible: false,
      }
    },
    created() {},
    methods: {
      initClazzList() {
        this.$axios.get('/personal/clazz/select/list').then((res) => {
          this.clazzList = res.data.data
        })
      },
      clazzApply(id) {
        this.title = '申请加入班级'
        this.form.id = id
        this.initClazzList()
        this.dialogFormVisible = true
      },
      close() {
        this.$refs['form'].resetFields()
        this.form = this.$options.data().form
        this.dialogFormVisible = false
        this.$parent.getCurrentUserInfo()
      },
      save() {
        this.$refs['form'].validate(async (valid) => {
          if (valid) {
            this.$axios.post('/personal/clazz/apply', this.form).then((res) => {
              this.$alert('操作成功', '提示', {
                confirmButtonText: '确定',
                callback: (action) => {
                  this.$refs['form'].resetFields()
                  this.dialogFormVisible = false
                  this.$parent.getCurrentUserInfo()
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
