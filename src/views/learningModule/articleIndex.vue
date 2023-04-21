<template>
  <div class="mcontaner">
    <router-link
      type="success"
      :to="{ name: 'ArticleEdit' }"
      style="font-size: 15pt"
    >
      上传资料
    </router-link>
    <div class="block">
      <el-timeline>
        <el-timeline-item
          v-for="(article, index) in articles"
          :key="index"
          :timestamp="article.createTime"
          placement="top"
        >
          <el-card>
            <h4 style="font-size: 15pt">
              <router-link
                :to="{
                  path: '/article/detail',
                  query: { articleId: article.id },
                }"
              >
                {{ article.title }}
              </router-link>
            </h4>
            <el-row>
              <el-tag v-for="tag in article.tags" :key="tag">{{ tag }}</el-tag>
              <el-button
                v-if="article.isLike"
                style="margin-left: 15px"
                type="warning"
                icon="el-icon-star-on"
                circle
                @click="like(article)"
              ></el-button>
              <el-button
                v-else
                style="margin-left: 15px"
                type="warning"
                icon="el-icon-star-off"
                circle
                plain
                @click="like(article)"
              ></el-button>
            </el-row>

            <p>最近更新于：{{ article.modifyTime }}</p>
            <p>文章摘要：{{ article.description }}</p>
          </el-card>
        </el-timeline-item>
      </el-timeline>

      <el-pagination
        class="mpage"
        background
        layout="prev, total, pager, next"
        :current-page="pageNo"
        :page-size="pageSize"
        :total="total"
        @current-change="page"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
  // 资料
  const category = 2

  export default {
    data() {
      return {
        category: category,
        articles: [],
        pageNo: 1,
        total: 0,
        pageSize: 5,
      }
    },
    created() {
      this.page(1)
    },
    methods: {
      like(article) {
        this.$axios
          .get('/manage_center/like/edit', {
            params: {
              bool: !article.isLike,
              dataCategory: this.category,
              dataId: article.id,
            },
          })
          .then((res) => {
            if (article.isLike) {
              this.$message('已取消收藏')
            } else {
              this.$message('已收藏')
            }
          })
          .then((res) => {
            article.isLike = !article.isLike
          })
      },
      page() {
        this.$axios
          .get('/learning/article/overview/list', {
            params: {
              pageNo: this.pageNo,
              pageSize: this.pageSize,
            },
          })
          .then((res) => {
            this.articles = res.data.data.list
            this.total = res.data.data.total
          })
      },
    },
  }
</script>

<style scoped>
  .mpage {
    margin: 0 auto;
    text-align: center;
  }

  .typeTag {
    width: 100px;
    font-size: 15pt;
    text-align: center;
  }
</style>
