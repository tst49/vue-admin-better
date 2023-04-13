<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    width="900px"
    @close="close"
  >
    <p>试卷知识点主要发布：</p>
    <el-tag v-for="tag in testPaperTags" :key="tag">{{ tag }}</el-tag>
    <el-row v-if="questionList.single.length > 0">
      <el-divider content-position="center">单选题</el-divider>
      <el-row v-for="question in questionList.single" :key="question.id">
        <!-- 题目内容 -->
        <el-row :gutter="20">
          <span>{{ question.content }}</span>
        </el-row>
        <el-radio-group v-model="question.answer[0]">
          <el-row :gutter="20">
            <el-radio label="A" disabled>A: {{ question.options[0] }}</el-radio>
          </el-row>
          <el-row :gutter="20">
            <el-radio label="B" disabled>B: {{ question.options[1] }}</el-radio>
          </el-row>
          <el-row :gutter="20">
            <el-radio label="C" disabled>C: {{ question.options[2] }}</el-radio>
          </el-row>
          <el-row :gutter="20">
            <el-radio label="D" disabled>D: {{ question.options[3] }}</el-radio>
          </el-row>
        </el-radio-group>
      </el-row>
    </el-row>
    <el-row v-if="questionList.multiple.length > 0">
      <el-divider content-position="center">多选题</el-divider>
      <el-row v-for="question in questionList.multiple" :key="question.id">
        <!-- 题目内容 -->
        <el-row :gutter="20">
          <span>{{ question.content }}</span>
        </el-row>
        <el-checkbox-group v-model="question.answer">
          <el-row :gutter="20">
            <el-checkbox label="A" disabled>
              A: {{ question.options[0] }}
            </el-checkbox>
          </el-row>
          <el-row :gutter="20">
            <el-checkbox label="B" disabled>
              B: {{ question.options[1] }}
            </el-checkbox>
          </el-row>
          <el-row :gutter="20">
            <el-checkbox label="C" disabled>
              C: {{ question.options[2] }}
            </el-checkbox>
          </el-row>
          <el-row :gutter="20">
            <el-checkbox label="D" disabled>
              D: {{ question.options[3] }}
            </el-checkbox>
          </el-row>
        </el-checkbox-group>
      </el-row>
    </el-row>
    <el-row v-if="questionList.judgment.length > 0">
      <el-divider content-position="center">判断题</el-divider>
      <el-row v-for="question in questionList.judgment" :key="question.id">
        <!-- 题目内容 -->
        <el-row :gutter="20">
          <span>{{ question.content }}</span>
        </el-row>
        <el-radio-group v-model="question.answer[0]">
          <el-row :gutter="20">
            <el-radio label="A" disabled>A: {{ question.options[0] }}</el-radio>
          </el-row>
          <el-row :gutter="20">
            <el-radio label="B" disabled>B: {{ question.options[1] }}</el-radio>
          </el-row>
        </el-radio-group>
      </el-row>
    </el-row>
    <el-row v-if="questionList.blank.length > 0">
      <el-divider content-position="center">填空题</el-divider>
      <el-row v-for="question in questionList.blank" :key="question.id">
        <!-- 题目内容 -->
        <el-row :gutter="20">
          <span>{{ question.content }}</span>
        </el-row>
        <el-input
          v-model="question.answer"
          type="textarea"
          :rows="3"
          autosize
          placeholder="请输入内容"
          :disabled="true"
        ></el-input>
      </el-row>
    </el-row>
    <el-row v-if="questionList.text.length > 0">
      <el-divider content-position="center">简答题</el-divider>
      <el-row v-for="question in questionList.text" :key="question.id">
        <!-- 题目内容 -->
        <el-row :gutter="20">
          <span>{{ question.content }}</span>
        </el-row>
        <el-input
          v-model="question.answer"
          type="textarea"
          :rows="3"
          autosize
          placeholder="请输入内容"
          :disabled="true"
        ></el-input>
      </el-row>
    </el-row>
    <!-- 操作面板 -->
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button v-if="testPaperVO.id == null" type="primary" @click="submit">
        提 交
      </el-button>
      <el-button v-else type="primary" @click="tryAnswer">作 答</el-button>
    </div>
  </el-dialog>
</template>

<script>
  export default {
    name: 'TestPaperPreview',
    data() {
      return {
        testPaperVO: {
          id: null,
          questionIds: [],
          title: '',
          testPaperTags: [],
        },
        questionList: {
          single: [],
          multiple: [],
          judgment: [],
          blank: [],
          text: [],
        },
        dialogFormVisible: false,
        inputTagVisible: false,
        inputTagValue: '',
      }
    },
    created() {},
    methods: {
      paperPreview(data) {
        // console.log('paperPreview in')
        this.testPaperVO.id = data.testPaperId
        this.testPaperVO.title = data.testPaperTitle
        this.testPaperVO.testPaperTags = data.testPaperTags
        this.testPaperVO.questionIds = data.questionIds
        this.questionList = data.testPaper
        this.dialogFormVisible = true
      },
      close() {
        this.dialogFormVisible = false
        this.$emit('fetch-data')
      },
      submit() {
        this.$prompt('请定义试卷名称', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        })
          .then(({ value }) => {
            this.testPaperVO.testPaperTitle = value
            this.$axios
              .post('/testing/paper/save', this.testPaperVO)
              .then((res) => {
                this.$message({
                  type: 'success',
                  message: '试卷生成完成',
                })
              })
            this.dialogFormVisible = false
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '试卷生成取消',
            })
          })
      },
      tryAnswer() {
        this.$confirm(
          '答题<strong style="color: red">限时</strong>60分钟，请安排时间认真作答',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            dangerouslyUseHTMLString: true,
          }
        )
          .then(() => {
            this.$router.push({
              path: '/testing/paper',
              query: { id: this.testPaperVO.id },
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消作答',
            })
          })
      },
    },
  }
</script>
