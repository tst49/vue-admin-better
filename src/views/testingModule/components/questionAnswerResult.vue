<template>
  <div>
    <el-row>
      <span style="font-size: 15pt">{{ answerResult }}</span>
      <el-button
        v-if="isLike"
        style="margin-left: 15px"
        type="warning"
        icon="el-icon-star-on"
        circle
        @click="like()"
      ></el-button>
      <el-button
        v-else
        style="margin-left: 15px"
        type="warning"
        icon="el-icon-star-off"
        circle
        plain
        @click="like()"
      ></el-button>
      <el-button @click="showComment">查看评论区</el-button>
    </el-row>
    <comment v-show="commentVisible" ref="comment"></comment>
  </div>
</template>

<script>
  const category = 3

  import Comment from '../../common/comment'
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
        isLike: null,
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
            this.isLike = res.data.data.isLike
          })
      },
      showComment() {
        this.$refs.comment.showComment(this.category, this.questionId)
        this.commentVisible = true
      },
      like() {
        this.$axios
          .get('/manage_center/like/edit', {
            params: {
              bool: !this.isLike,
              dataCategory: this.category,
              dataId: this.questionId,
            },
          })
          .then((res) => {
            if (this.isLike) {
              this.$message('已取消收藏')
            } else {
              this.$message('已收藏')
            }
          })
          .then((res) => {
            this.isLike = !this.isLike
          })
      },
    },
  }
</script>
