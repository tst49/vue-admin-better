<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    width="500px"
    @close="close"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="题型" prop="category">
        <el-select
          v-model="form.category"
          placeholder="请选择"
          @change="categoryChange()"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="题目" prop="title">
        <el-input v-model.trim="form.title" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="选项" prop="options">
        <el-input
          v-for="(option, index) in form.options"
          :key="option"
          v-model.trim="form.options[index]"
          autocomplete="off"
        >
          <template slot="prepend">选项{{ index + 1 }}</template>
          {{ option }}
        </el-input>
      </el-form-item>
      <el-form-item label="答案" prop="answer">
        <el-input v-model.trim="form.answer" autocomplete="off"></el-input>
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
  const questionCategory = [
    {
      value: 1,
      label: '单选题',
    },
    {
      value: 2,
      label: '多选题',
    },
    {
      value: 3,
      label: '判断题',
    },
    {
      value: 4,
      label: '填空题',
    },
    {
      value: 5,
      label: '简答题',
    },
  ]
  export default {
    name: 'TableEdit',
    data() {
      return {
        options: questionCategory,
        form: {
          title: '',
          options: ['', '', '', ''],
          answer: '',
          tags: [],
          category: 1,
        },
        rules: {
          title: [{ required: true, trigger: 'blur', message: '请输入题目' }],
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
      haveTry(row) {
        if (!row) {
          this.title = '添加'
        } else {
          this.title = '编辑'
          this.form = Object.assign({}, row)
          // console.log(this.form)
        }
        this.dialogFormVisible = true
      },
      close() {
        this.$refs['form'].resetFields()
        this.form = this.$options.data().form
        this.dialogFormVisible = false
        this.$emit('fetch-data')
      },
      save() {
        this.$refs['form'].validate(async (valid) => {
          if (valid) {
            const { msg } = await doEdit(this.form)
            this.$baseMessage(msg, 'success')
            this.$refs['form'].resetFields()
            this.dialogFormVisible = false
            this.$emit('fetch-data')
            this.form = this.$options.data().form
          } else {
            return false
          }
        })
      },
    },
  }
</script>
