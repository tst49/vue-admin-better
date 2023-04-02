<template>
  <div>
    <span>{{ answerResult }}</span>
    <el-button @click="showComment">查看评论区</el-button>
    <comment v-show="commentVisible" ref="comment"></comment>
  </div>
</template>

<script>
  const category = 3

  import Comment from '../common/comment'
  export default {
    components: {
      Comment,
    },
    data() {
      return {
        category: category,
        questionId: null,
        isCorrect: null,
        answerResult: null,
        commentVisible: false,
      }
    },
    methods: {
      checkAnswer(id, answer) {
        this.$axios
          .post('/testing/question/checkAnswer', {
            questionId: id,
            myAnswer: answer,
          })
          .then((res) => {
            this.questionId = id
            this.answerResult = res.data.data.answerResult
          })
      },
      showComment() {
        this.$refs.comment.showComment(this.category, this.questionId)
        this.commentVisible = true
      },
    },
  }
</script>
