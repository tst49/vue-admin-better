<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    width="900px"
    @close="close"
  >
    <!-- 题目内容 -->
    <el-row :gutter="20">
      <span>{{ currentQuestion.content }}</span>
    </el-row>
    <!-- 单选或判断 -->
    <el-radio-group
      v-if="[1, 3].includes(currentQuestion.category)"
      v-model="currentQuestion.answer[0]"
    >
      <el-row :gutter="20">
        <el-radio label="A">A: {{ currentQuestion.options[0] }}</el-radio>
      </el-row>
      <el-row :gutter="20">
        <el-radio label="B">B: {{ currentQuestion.options[1] }}</el-radio>
      </el-row>
      <div v-if="currentQuestion.category == 1">
        <el-row :gutter="20">
          <el-radio label="C">C: {{ currentQuestion.options[2] }}</el-radio>
        </el-row>
        <el-row :gutter="20">
          <el-radio label="D">D: {{ currentQuestion.options[3] }}</el-radio>
        </el-row>
      </div>
    </el-radio-group>
    <!-- 多选 -->
    <el-checkbox-group
      v-else-if="currentQuestion.category == 2"
      v-model="currentQuestion.answer"
    >
      <el-row :gutter="20">
        <el-checkbox label="A">A: {{ currentQuestion.options[0] }}</el-checkbox>
      </el-row>
      <el-row :gutter="20">
        <el-checkbox label="B">B: {{ currentQuestion.options[1] }}</el-checkbox>
      </el-row>
      <el-row :gutter="20">
        <el-checkbox label="C">C: {{ currentQuestion.options[2] }}</el-checkbox>
      </el-row>
      <el-row :gutter="20">
        <el-checkbox label="D">D: {{ currentQuestion.options[3] }}</el-checkbox>
      </el-row>
    </el-checkbox-group>
    <!-- 填空或简答 -->
    <el-input
      v-else
      v-model="currentQuestion.answer[0]"
      type="textarea"
      :rows="3"
      autosize
      placeholder="请输入内容"
    ></el-input>
    <!-- 操作面板 -->
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="submit">提 交</el-button>
    </div>
  </el-dialog>
</template>

<script>
  export default {
    name: 'SingleQuestion',
    data() {
      return {
        currentQuestion: {
          content: '',
          options: [],
          category: 1,
          level: 1,
          answer: [],
        },
        title: '',
        dialogFormVisible: false,
        inputTagVisible: false,
        inputTagValue: '',
      }
    },
    created() {},
    methods: {
      haveTry(id) {
        this.title = '答题'
        this.$axios
          .get('/testing/question/single', {
            params: {
              questionId: id,
            },
          })
          .then((res) => {
            this.currentQuestion.content = res.data.data.content
            this.currentQuestion.answer = res.data.data.answer
          })
        this.dialogFormVisible = true
      },
      close() {
        this.form = this.$options.data().form
        this.dialogFormVisible = false
        this.$emit('fetch-data')
      },
      submit() {
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
