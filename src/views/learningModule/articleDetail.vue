<template>
  <div>
    <div class="mblog">
      <h2>{{ article.title }}</h2>
      <el-row>
        <el-tag v-for="tag in article.tags" :key="tag">{{ tag }}</el-tag>
        <el-button
          v-if="article.isLike"
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
      </el-row>
      <p>文章字数约等于：{{ article.words }}</p>
      <p>文章阅读数：{{ article.viewCount }}</p>
      <el-link v-if="article.isAuthor" icon="el-icon-edit">
        <router-link
          :to="{ name: 'ArticleEdit', params: { articleId: article.id } }"
        >
          编辑
        </router-link>
      </el-link>
      <el-divider></el-divider>

      <div class="markdown-body" v-html="article.content"></div>
    </div>
    <div class="author-message">
      <ul class="list">
        <li>
          <img
            :src="article.authorAvatar"
            style="width: 40px; border-radius: 50%"
          />
          作者：{{ article.authorName }}
          <router-link style="text-decoration-line: none" to="/article/index">
            （联系作者-->（退到首页）)
          </router-link>
        </li>
        <li>发表时间：{{ article.createTime }}</li>
        <li>最后修改：{{ article.modifyTime }}</li>
      </ul>
    </div>
    <!--评论-->
    <div class="ui bottom teal attached segment threaded comments">
      <comment v-show="commentVisible" ref="comment"></comment>
    </div>
  </div>
</template>

<script>
  const category = 2

  import Comment from '../common/comment'

  export default {
    name: 'ArticleDetail',
    components: { Comment },
    data() {
      return {
        category: category,
        article: {},
        commentVisible: false,
      }
    },
    created() {
      const _this = this
      const articleId = _this.$route.query.articleId

      this.$axios
        .get('/learning/article/detail', {
          params: {
            articleId: articleId,
          },
        })
        .then((res) => {
          _this.article = res.data.data

          //渲染markdown格式
          var MardownIt = require('markdown-it')
          var md = new MardownIt()

          _this.article.content = md.render(_this.article.content)
        })
        .then(() => {
          this.showComment(this.category, articleId)
        })
    },
    methods: {
      like() {
        this.$axios
          .get('/manage_center/like/edit', {
            params: {
              bool: !this.article.isLike,
              dataCategory: this.category,
              dataId: this.article.id,
            },
          })
          .then((res) => {
            if (this.article.isLike) {
              this.$message('已取消收藏')
            } else {
              this.$message('已收藏')
            }
          })
          .then((res) => {
            this.article.isLike = !this.article.isLike
          })
      },
      async showComment(category, articleId) {
        this.$refs.comment.showComment(category, articleId)
        this.commentVisible = true
      },
    },
  }
</script>

<style scoped>
  .mblog {
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    width: 100%;
    min-height: 400px;
    padding: 20px 15px;
  }

  .author-message {
    text-align: left;
    background-color: honeydew;
    padding: 10px 5px 10px 5px;
    font-size: 14px;
  }
</style>
