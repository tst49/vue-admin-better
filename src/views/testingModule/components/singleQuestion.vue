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
    <el-divider></el-divider>
    <!--评论-->
    <question-answer-result
      v-show="answerResultVisible"
      ref="checkAnswer"
    ></question-answer-result>
  </el-dialog>
</template>

<script>
  import QuestionAnswerResult from './questionAnswerResult'
  export default {
    name: 'SingleQuestion',
    components: {
      QuestionAnswerResult,
    },
    data() {
      return {
        currentQuestion: {
          id: null,
          content: '',
          options: [],
          category: null,
          level: null,
          answer: [],
        },
        title: '',
        dialogFormVisible: false,
        inputTagVisible: false,
        inputTagValue: '',
        answerResultVisible: false,
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
            this.currentQuestion.id = res.data.data.id
            this.currentQuestion.content = res.data.data.content
            this.currentQuestion.options = res.data.data.options
            this.currentQuestion.category = res.data.data.category
          })
        this.dialogFormVisible = true
      },
      close() {
        this.currentQuestion = this.$options.data().currentQuestion
        this.dialogFormVisible = false
        this.answerResultVisible = false
        this.$emit('fetch-data')
      },
      submit() {
        this.$refs.checkAnswer.checkAnswer(
          this.currentQuestion.id,
          this.currentQuestion.answer
        )
        // 答题结果
        this.answerResultVisible = true
      },
    },
  }
</script>
