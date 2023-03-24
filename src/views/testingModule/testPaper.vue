<template>
  <div class="test-container">
    <el-card style="width: 20%; float: left">
      <div slot="header">
        <el-tag effect="plain">未答</el-tag>
        <el-tag effect="dark" type="success">已答</el-tag>
        <el-tag effect="dark" type="primary">当前</el-tag>
      </div>
      <el-row v-if="questionList.single.length > 0">
        <el-divider content-position="center">单选题</el-divider>
        <el-col
          v-for="question in questionList.single"
          :key="question.id"
          :span="6"
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
      <el-row v-if="questionList.multiple.length > 0">
        <el-divider content-position="center">多选题</el-divider>
        <el-col
          v-for="question in questionList.multiple"
          :key="question.id"
          :span="6"
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
      <el-row v-if="questionList.judgment.length > 0">
        <el-divider content-position="center">判断题</el-divider>
        <el-col
          v-for="question in questionList.judgment"
          :key="question.id"
          :span="6"
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
      <el-row v-if="questionList.blank.length > 0">
        <el-divider content-position="center">填空题</el-divider>
        <el-col
          v-for="question in questionList.blank"
          :key="question.id"
          :span="6"
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
      <el-row v-if="questionList.text.length > 0">
        <el-divider content-position="center">简答题</el-divider>
        <el-col
          v-for="question in questionList.text"
          :key="question.id"
          :span="6"
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
      <el-button type="primary" icon="el-icon-arrow-left" plain>
        上一题
      </el-button>
      <el-button type="primary" plain>
        下一题
        <i class="el-icon-arrow-right el-icon--right"></i>
      </el-button>
    </el-card>
  </div>
</template>
<script>
  const dataList = {
    single: [
      {
        no: 11,
        id: 1001,
        content: '1+1=?',
        options: ['1', '2', '3', '4'],
        show: '',
        answer: [],
        category: 1,
      },
      {
        no: 222,
        id: 1002,
        content: '1+2=?',
        options: ['1', '2', '3', '4'],
        show: '',
        answer: [],
        category: 1,
      },
      {
        no: 3,
        id: 1003,
        content: '1+3=?',
        options: ['1', '2', '3', '4'],
        show: '',
        answer: [],
        category: 1,
      },
      {
        no: 4,
        id: 1004,
        content: '1+4=?',
        options: ['1', '2', '3', '4'],
        show: '',
        answer: [],
        category: 1,
      },
      {
        no: 5,
        id: 1005,
        content: '1+5=?',
        options: ['1', '2', '3', '4'],
        show: '',
        answer: [],
        category: 1,
      },
      {
        no: 6,
        id: 1006,
        content: '1+6=?',
        options: ['1', '2', '3', '4'],
        show: '',
        answer: [],
        category: 1,
      },
      // {
      //   no: 7,
      //   id: 1007,
      //   content: '1+7=?',
      //   options: ['1', '2', '3', '4'],
      //   show: 'success',
      // },
      // {
      //   no: 8,
      //   id: 1008,
      //   content: '1+8=?',
      //   options: ['1', '2', '3', '4'],
      //   show: 'success',
      // },
      // {
      //   no: 9,
      //   id: 1009,
      //   content: '1+9=?',
      //   options: ['1', '2', '3', '4'],
      //   show: 'success',
      // },
      // {
      //   no: 10,
      //   id: 1010,
      //   content: '1+10=?',
      //   options: ['1', '2', '3', '4'],
      //   show: 'success',
      // },
      // {
      //   no: 11,
      //   id: 1011,
      //   content: '1+11=?',
      //   options: ['1', '2', '3', '4'],
      //   show: 'success',
      // },
    ],
    multiple: [
      {
        no: 1,
        id: 1001,
        content: '1+1=?',
        options: ['1', '2', '3', '4'],
        show: '',
        answer: [],
        category: 2,
      },
      {
        no: 1,
        id: 1001,
        content: '1+1=?',
        options: ['1', '2', '3', '4'],
        show: '',
        answer: [],
        category: 2,
      },
      {
        no: 3,
        id: 1003,
        content: '1+3=?',
        options: ['1', '2', '3', '4'],
        show: '',
        answer: [],
        category: 2,
      },
      {
        no: 4,
        id: 1004,
        content: '1+4=?',
        options: ['1', '2', '3', '4'],
        show: '',
        answer: [],
        category: 2,
      },
      {
        no: 5,
        id: 1005,
        content: '1+5=?',
        options: ['1', '2', '3', '4'],
        show: '',
        answer: [],
        category: 2,
      },
      {
        no: 6,
        id: 1006,
        content: '1+5=?',
        options: ['1', '2', '3', '4'],
        show: '',
        answer: [],
        category: 2,
      },
    ],
    judgment: [
      {
        no: 1,
        id: 1001,
        content: '1+1=?',
        options: ['对', '错'],
        show: '',
        answer: [],
        category: 3,
      },
      {
        no: 2,
        id: 1002,
        content: '1+2=?',
        options: ['对', '错'],
        show: '',
        answer: [],
        category: 3,
      },
      {
        no: 3,
        id: 1003,
        content: '1+3=?',
        options: ['对', '错'],
        show: '',
        answer: [],
        category: 3,
      },
      {
        no: 4,
        id: 1004,
        content: '1+4=?',
        options: ['对', '错'],
        show: '',
        answer: [],
        category: 3,
      },
      {
        no: 5,
        id: 1005,
        content: '1+5=?',
        options: ['对', '错'],
        show: '',
        answer: [],
        category: 3,
      },
    ],
    blank: [
      {
        no: 1,
        id: 1001,
        content: '1+1=?',
        options: [],
        show: '',
        answer: [],
        category: 4,
      },
      {
        no: 2,
        id: 1002,
        content: '1+2=?',
        options: [],
        show: '',
        answer: [],
        category: 4,
      },
      {
        no: 3,
        id: 1003,
        content: '1+3=?',
        options: [],
        show: '',
        answer: [],
        category: 4,
      },
      {
        no: 4,
        id: 1004,
        content: '1+4=?',
        options: [],
        show: '',
        answer: [],
        category: 4,
      },
    ],
    text: [
      {
        no: 1,
        id: 1001,
        content: '1+1=?',
        options: [],
        show: '',
        answer: [],
        category: 5,
      },
      {
        no: 2,
        id: 1002,
        content: '1+2=?',
        options: [],
        show: '',
        answer: [],
        category: 5,
      },
      {
        no: 3,
        id: 1003,
        content: '1+3=?',
        options: [],
        show: '',
        answer: [],
        category: 5,
      },
    ],
  }

  export default {
    name: 'Test',
    data() {
      return {
        show: true,
        currentQuestion: {
          no: 1,
          content: '',
          options: [],
          answer: '',
        },
        questionList: {
          single: [],
          multiple: [],
          judgment: [],
          blank: [],
          text: [],
        },
      }
    },
    created() {
      const testPaperId = this.$route.query.id
      console.log(testPaperId)
      this.init(testPaperId)
    },
    mounted() {},
    methods: {
      init(testPaperId) {
        console.log('init:' + testPaperId)
        this.$axios
          .get('/test')
          .then((res) => {
            console.log(dataList)
            this.questionList = dataList
          })
          .then(() => {
            console.log(this.questionList)
            // 获取第一个问题
            if (this.questionList.single.length > 0) {
              this.currentQuestion = this.questionList.single[0]
            } else if (this.questionList.multiple.length > 0) {
              this.currentQuestion = this.questionList.multiple[0]
            } else if (this.questionList.judgment.length > 0) {
              this.currentQuestion = this.questionList.judgment[0]
            } else if (this.questionList.blank.length > 0) {
              this.currentQuestion = this.questionList.blank[0]
            } else if (this.questionList.text.length > 0) {
              this.currentQuestion = this.questionList.text[0]
            }
          })
      },
      jump(question) {
        if (this.currentQuestion.answer != '') {
          this.currentQuestion.show = 'success'
        } else {
          this.currentQuestion.show = ''
        }
        this.currentQuestion = question
        this.currentQuestion.show = 'primary'
      },
    },
  }
</script>
