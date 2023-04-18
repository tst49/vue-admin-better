<template>
  <div class="test-container">
    <el-card style="width: 20%; float: left">
      <div slot="header">
        <el-tag effect="plain">未答</el-tag>
        <el-tag effect="dark" type="success">已答</el-tag>
        <el-tag effect="dark" type="primary">当前</el-tag>
      </div>
      <el-row v-if="paper.questionList.single.length > 0">
        <el-divider content-position="center">单选题</el-divider>
        <el-col
          v-for="question in paper.questionList.single"
          :key="question.id"
          :xs="25"
          :sm="5"
          :md="5"
          :lg="5"
          :xl="5"
        >
          <el-button
            style="width: 90%; padding: 10px; margin-bottom: 10px"
            size="mini"
            :type="question.show"
            @click="jump(question)"
          >
            {{ question.no }}
          </el-button>
        </el-col>
      </el-row>
      <el-row v-if="paper.questionList.multiple.length > 0">
        <el-divider content-position="center">多选题</el-divider>
        <el-col
          v-for="question in paper.questionList.multiple"
          :key="question.id"
          :xs="25"
          :sm="5"
          :md="5"
          :lg="5"
          :xl="5"
        >
          <el-button
            style="width: 90%; padding: 10px; margin-bottom: 10px"
            :type="question.show"
            @click="jump(question)"
          >
            {{ question.no }}
          </el-button>
        </el-col>
      </el-row>
      <el-row v-if="paper.questionList.judgment.length > 0">
        <el-divider content-position="center">判断题</el-divider>
        <el-col
          v-for="question in paper.questionList.judgment"
          :key="question.id"
          :xs="25"
          :sm="5"
          :md="5"
          :lg="5"
          :xl="5"
        >
          <el-button
            style="width: 90%; padding: 10px; margin-bottom: 10px"
            :type="question.show"
            @click="jump(question)"
          >
            {{ question.no }}
          </el-button>
        </el-col>
      </el-row>
      <el-row v-if="paper.questionList.blank.length > 0">
        <el-divider content-position="center">填空题</el-divider>
        <el-col
          v-for="question in paper.questionList.blank"
          :key="question.id"
          :xs="25"
          :sm="5"
          :md="5"
          :lg="5"
          :xl="5"
        >
          <el-button
            style="width: 90%; padding: 10px; margin-bottom: 10px"
            :type="question.show"
            @click="jump(question)"
          >
            {{ question.no }}
          </el-button>
        </el-col>
      </el-row>
      <el-row v-if="paper.questionList.text.length > 0">
        <el-divider content-position="center">简答题</el-divider>
        <el-col
          v-for="question in paper.questionList.text"
          :key="question.id"
          :xs="25"
          :sm="5"
          :md="5"
          :lg="5"
          :xl="5"
        >
          <el-button
            style="width: 90%; padding: 10px; margin-bottom: 10px"
            :type="question.show"
            @click="jump(question)"
          >
            {{ question.no }}
          </el-button>
        </el-col>
      </el-row>
      <el-divider></el-divider>
      <el-button
        type="danger"
        style="width: 100%; padding: 10px; margin-top: -15px; align=center"
        @click="submit"
      >
        结束考试
      </el-button>
    </el-card>
    <el-card style="width: 75%; float: left; margin-left: 10px; height: 700px">
      <div slot="header"></div>
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
        v-model="currentQuestion.answer[0]"
        type="textarea"
        :rows="20"
        placeholder="请输入内容"
      ></el-input>
      <el-divider></el-divider>
      <el-button
        type="primary"
        icon="el-icon-arrow-left"
        plain
        @click="previous"
      >
        上一题
      </el-button>
      <el-button type="primary" plain @click="next">
        下一题
        <i class="el-icon-arrow-right el-icon--right"></i>
      </el-button>
    </el-card>
  </div>
</template>
<script>
  import screenfull from 'screenfull'

  export default {
    name: 'Test',
    data() {
      return {
        isFullscreen: false,
        show: true,
        currentQuestion: {
          no: 1,
          content: '',
          options: [],
          answer: [],
        },
        paper: {
          id: null,
          questionList: {
            single: [],
            multiple: [],
            judgment: [],
            blank: [],
            text: [],
          },
        },
        totalNum: 0,
      }
    },
    created() {
      const testPaperId = this.$route.query.id
      if (testPaperId != null) {
        this.paper.id = testPaperId
        this.init(testPaperId)
      } else {
        // 随机测试不含id
        this.paper.questionList = this.$route.query.data.testPaper
        this.totalNum = this.$route.query.data.questionIds.length
        this.initFirstQuestion()
      }
      this.fullon()
    },
    methods: {
      submit() {
        this.$confirm(
          '提交后<strong style="color: red">无法修改</strong>，确认提交试卷？',
          '提示',
          {
            confirmButtonText: '提交',
            cancelButtonText: '取消',
            type: 'warning',
            dangerouslyUseHTMLString: true,
          }
        )
          .then(() => {
            this.$axios
              .post('/testing/paper/checkAnswer', this.paper)
              .then((res) => {
                this.fulloff()
                this.$router.push({
                  path: 'answer/record',
                  query: { recordId: res.data.data },
                })
              })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消提交，继续作答',
            })
          })
      },
      init(testPaperId) {
        // console.log('init:' + testPaperId)
        this.$axios
          .get('/testing/paper/single', {
            params: {
              testPaperId: testPaperId,
            },
          })
          .then((res) => {
            // console.log(res.data.data)
            this.paper.questionList = res.data.data.testPaper
            this.totalNum = res.data.data.questionIds.length
          })
          .then(() => {
            this.initFirstQuestion()
          })
      },
      initFirstQuestion() {
        this.jumpByNo(1)
        // 获取第一个问题
        // if (this.paper.questionList.single.length > 0) {
        //   this.currentQuestion = this.paper.questionList.single[0]
        // } else if (this.paper.questionList.multiple.length > 0) {
        //   this.currentQuestion = this.paper.questionList.multiple[0]
        // } else if (this.paper.questionList.judgment.length > 0) {
        //   this.currentQuestion = this.paper.questionList.judgment[0]
        // } else if (this.paper.questionList.blank.length > 0) {
        //   this.currentQuestion = this.paper.questionList.blank[0]
        // } else if (this.paper.questionList.text.length > 0) {
        //   this.currentQuestion = this.paper.questionList.text[0]
        // }
      },
      previous() {
        if (this.currentQuestion.no > 1) {
          this.jumpByNo(this.currentQuestion.no - 1)
        }
      },
      next() {
        if (this.currentQuestion.no < this.totalNum) {
          this.jumpByNo(this.currentQuestion.no + 1)
        }
      },
      jumpByNo(no) {
        for (let q of this.paper.questionList.single) {
          if (q.no == no) {
            this.jump(q)
            return
          }
        }
        for (let q of this.paper.questionList.multiple) {
          if (q.no == no) {
            this.jump(q)
            return
          }
        }
        for (let q of this.paper.questionList.judgment) {
          if (q.no == no) {
            this.jump(q)
            return
          }
        }
        for (let q of this.paper.questionList.blank) {
          if (q.no == no) {
            this.jump(q)
            return
          }
        }
        for (let q of this.paper.questionList.text) {
          if (q.no == no) {
            this.jump(q)
            return
          }
        }
      },
      jump(question) {
        if (this.currentQuestion.answer != '') {
          this.currentQuestion.show = 'success'
        } else {
          this.currentQuestion.show = ''
        }
        this.currentQuestion = question
        this.currentQuestion.show = 'primary'
        console.log(this.currentQuestion)
      },
      // 全屏控制
      fullon() {
        console.log(screenfull.isEnabled + '-' + screenfull.isFullscreen)
        if (screenfull.isEnabled && !screenfull.isFullscreen) {
          screenfull.toggle()
        }
      },
      fulloff() {
        console.log(screenfull.isEnabled + '-' + screenfull.isFullscreen)
        if (screenfull.isEnabled && screenfull.isFullscreen) {
          screenfull.toggle()
        }
      },
    },
  }
</script>
