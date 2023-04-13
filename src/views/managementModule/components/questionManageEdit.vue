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
            v-for="item in categorys"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="题目" prop="content">
        <el-input v-model.trim="form.content" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item
        v-if="[1, 2].includes(form.category)"
        label="选项"
        prop="options"
      >
        <el-input
          v-for="(option, index) in form.options"
          :key="index"
          v-model.trim="form.options[index]"
          autocomplete="off"
        >
          <template slot="prepend">选项{{ index + 1 }}</template>
          {{ option }}
        </el-input>
      </el-form-item>
      <el-form-item label="答案" prop="answer">
        <el-radio-group v-if="form.category == 3" v-model="form.answer">
          <el-radio label="A">对</el-radio>
          <el-radio label="B">错</el-radio>
        </el-radio-group>
        <el-input
          v-else
          v-model.trim="form.answer[0]"
          autocomplete="off"
        ></el-input>
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
      <el-form-item label="难度" prop="level">
        <el-select v-model="form.level" placeholder="请选择">
          <el-option
            v-for="item in levels"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
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
  const questionLevel = [
    {
      value: 1,
      label: '简单',
    },
    {
      value: 2,
      label: '中等',
    },
    {
      value: 3,
      label: '困难',
    },
  ]
  export default {
    name: 'TableEdit',
    data() {
      return {
        categorys: questionCategory,
        levels: questionLevel,
        form: {
          id: '',
          content: '',
          options: ['', '', '', ''],
          answer: [],
          tags: [],
          category: 1,
          level: 1,
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
      showEdit(row) {
        if (!row) {
          this.title = '添加'
        } else {
          this.title = '编辑'
          this.form = Object.assign({}, row)
        }
        this.dialogFormVisible = true
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
              .post('/manage_center/question/save', this.form)
              .then((res) => {
                this.$alert('操作成功', '提示', {
                  confirmButtonText: '确定',
                  callback: (action) => {
                    this.$refs['form'].resetFields()
                    this.dialogFormVisible = false
                    this.$parent.fetchData()
                    // this.form = this.$options.data().form
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
      categoryChange() {
        let category = this.form.category
        if (category == 1 || category == 2) {
          this.form.options = ['', '', '', '']
        } else if (category == 3) {
          this.form.options = ['', '']
        } else {
          this.form.options = []
        }
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
