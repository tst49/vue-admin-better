<template>
  <div>
    <el-card>
      <div slot="header">
        <el-row>
          <el-col
            v-for="(
              questionAnswerResult, index
            ) in answerResult.questionAnswerResultVOList"
            :key="index"
            :xs="20"
            :sm="2"
            :md="2"
            :lg="2"
            :xl="2"
          >
            <el-button
              round
              :type="isCorrect(questionAnswerResult.isCorrect)"
              @click="jump(questionAnswerResult)"
            >
              {{ index + 1 }}
            </el-button>
          </el-col>
        </el-row>
      </div>
      <div>
        <!-- 题目内容 -->
        <el-row :gutter="20">
          <span>{{ currentQuestion.content }}</span>
        </el-row>
        <!-- 单选或判断 -->
        <el-radio-group
          v-if="[1, 3].includes(currentQuestion.category)"
          v-model="currentQuestion.myAnswer[0]"
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
          v-model="currentQuestion.myAnswer"
        >
          <el-row :gutter="20">
            <el-checkbox label="A">
              A: {{ currentQuestion.options[0] }}
            </el-checkbox>
          </el-row>
          <el-row :gutter="20">
            <el-checkbox label="B">
              B: {{ currentQuestion.options[1] }}
            </el-checkbox>
          </el-row>
          <el-row :gutter="20">
            <el-checkbox label="C">
              C: {{ currentQuestion.options[2] }}
            </el-checkbox>
          </el-row>
          <el-row :gutter="20">
            <el-checkbox label="D">
              D: {{ currentQuestion.options[3] }}
            </el-checkbox>
          </el-row>
        </el-checkbox-group>
        <!-- 填空或简答 -->
        <el-input
          v-else
          v-model="currentQuestion.myAnswer[0]"
          type="textarea"
          :rows="20"
          placeholder="请输入内容"
        ></el-input>
      </div>
    </el-card>
    <span>{{ currentQuestion.answerResult }}</span>
    <el-button @click="showComment">查看评论区</el-button>
    <comment v-show="commentVisible" ref="comment"></comment>
  </div>
</template>

<script>
  // question
  const category = 3

  import Comment from '../common/comment'
  export default {
    name: 'TestAnswerRecord',
    components: {
      Comment,
    },
    data() {
      return {
        category: category,
        commentVisible: false,
        answerResult: {
          title: null,
          finalScore: null,
          questionAnswerResultVOList: [],
          createTime: null,
        },
        currentQuestion: {
          questionId: null,
          isCorrect: null,
          content: '',
          options: [],
          category: null,
          myAnswer: [],
          myAnswerResult: '',
        },
      }
    },
    created() {
      const recordId = this.$route.query.recordId
      this.$axios
        .get('/testing/answerRecord/detail', {
          params: {
            recordId: recordId,
          },
        })
        .then((res) => {
          this.answerResult = res.data.data
        })
        .then(() => {
          console.log(this.answerResult)
          this.currentQuestion = this.answerResult.questionAnswerResultVOList[0]
        })
    },
    methods: {
      isCorrect(bool) {
        if (bool) {
          return 'success'
        }
        return 'danger'
      },
      jump(question) {
        this.currentQuestion = question
      },
      showComment() {
        this.$refs.comment.showComment(
          this.category,
          this.currentQuestion.questionId
        )
        this.commentVisible = true
      },
    },
  }
</script>
