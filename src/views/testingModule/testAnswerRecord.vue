<template>
  <div>
    <el-card>
      <div slot="header">
        <el-row>
          <span style="font-size: 15pt">
            试卷名称：
            <span style="color: blue">{{ answerResult.title }}</span>
          </span>
          <span style="margin-left: 10px; font-size: 15pt">
            最终得分：
            <span :style="getColor(answerResult.score)">
              {{ answerResult.finalScore }}分
            </span>
          </span>

          <el-button
            v-if="answerResult.isLike != null && answerResult.isLike"
            style="margin-left: 15px"
            type="warning"
            icon="el-icon-star-on"
            circle
            @click="like()"
          ></el-button>
          <el-button
            v-else-if="answerResult.isLike != null && !answerResult.isLike"
            style="margin-left: 15px"
            type="warning"
            icon="el-icon-star-off"
            circle
            plain
            @click="like()"
          ></el-button>
        </el-row>
        <el-divider></el-divider>
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
            <el-radio label="A" disabled>
              A: {{ currentQuestion.options[0] }}
            </el-radio>
          </el-row>
          <el-row :gutter="20">
            <el-radio label="B" disabled>
              B: {{ currentQuestion.options[1] }}
            </el-radio>
          </el-row>
          <div v-if="currentQuestion.category == 1">
            <el-row :gutter="20">
              <el-radio label="C" disabled>
                C: {{ currentQuestion.options[2] }}
              </el-radio>
            </el-row>
            <el-row :gutter="20">
              <el-radio label="D" disabled>
                D: {{ currentQuestion.options[3] }}
              </el-radio>
            </el-row>
          </div>
        </el-radio-group>
        <!-- 多选 -->
        <el-checkbox-group
          v-else-if="currentQuestion.category == 2"
          v-model="currentQuestion.myAnswer"
        >
          <el-row :gutter="20">
            <el-checkbox label="A" disabled>
              A: {{ currentQuestion.options[0] }}
            </el-checkbox>
          </el-row>
          <el-row :gutter="20">
            <el-checkbox label="B" disabled>
              B: {{ currentQuestion.options[1] }}
            </el-checkbox>
          </el-row>
          <el-row :gutter="20">
            <el-checkbox label="C" disabled>
              C: {{ currentQuestion.options[2] }}
            </el-checkbox>
          </el-row>
          <el-row :gutter="20">
            <el-checkbox label="D" disabled>
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
          disabled
        ></el-input>
      </div>
    </el-card>
    <el-row>
      <span style="font-size: 15pt">{{ currentQuestion.answerResult }}</span>
      <el-button
        v-if="currentQuestion.isLike"
        style="margin-left: 15px"
        type="warning"
        icon="el-icon-star-on"
        circle
        @click="likeQ(currentQuestion)"
      ></el-button>
      <el-button
        v-else
        style="margin-left: 15px"
        type="warning"
        icon="el-icon-star-off"
        circle
        plain
        @click="likeQ(currentQuestion)"
      ></el-button>
    </el-row>

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
          this.jump(this.answerResult.questionAnswerResultVOList[0])
        })
    },
    methods: {
      like() {
        // 试卷
        let dataCategory = 4
        this.$axios
          .get('/manage_center/like/edit', {
            params: {
              bool: !this.answerResult.isLike,
              dataCategory: dataCategory,
              dataId: this.answerResult.testPaperId,
            },
          })
          .then((res) => {
            if (this.answerResult.isLike) {
              this.$message('已取消收藏')
            } else {
              this.$message('已收藏')
            }
          })
          .then((res) => {
            this.answerResult.isLike = !this.answerResult.isLike
          })
      },
      likeQ(question) {
        // 题目
        let dataCategory = 3
        this.$axios
          .get('/manage_center/like/edit', {
            params: {
              bool: !question.isLike,
              dataCategory: dataCategory,
              dataId: question.questionId,
            },
          })
          .then((res) => {
            if (question.isLike) {
              this.$message('已取消收藏')
            } else {
              this.$message('已收藏')
            }
          })
          .then((res) => {
            question.isLike = !question.isLike
          })
      },
      isCorrect(bool) {
        if (bool) {
          return 'success'
        }
        return 'danger'
      },
      jump(question) {
        this.commentVisible = false
        this.currentQuestion = question
        this.$refs.comment.showComment(
          this.category,
          this.currentQuestion.questionId
        )
        this.commentVisible = true
      },
      getColor(score) {
        if (score < 60) {
          return 'color: red'
        } else if (score < 80) {
          return 'color: orange'
        } else {
          return 'color: green'
        }
      },
    },
  }
</script>
