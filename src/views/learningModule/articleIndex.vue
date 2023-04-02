<template>
  <div class="mcontaner">
    <Header></Header>
    <Menu></Menu>

    <div class="block">
      <el-timeline>
        <el-timeline-item
          v-for="(blog, index) in blogs"
          :key="index"
          :timestamp="blog.gmtCreate"
          placement="top"
        >
          <el-card>
            <el-tag type="info" class="typeTag" color="lightgreen"></el-tag>
            <h4 style="font-size: 15pt">
              <router-link
                :to="{ name: 'BlogDetail', params: { blogId: blog.id } }"
              >
                {{ blog.title }}
              </router-link>
            </h4>
            <p>最近更新于：{{ blog.gmtModified }}</p>
            <p>文章摘要：{{ blog.description }}</p>
          </el-card>
        </el-timeline-item>
      </el-timeline>

      <el-pagination
        class="mpage"
        background
        layout="prev, total,pager, next"
        :current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        @current-change="page"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
  export default {
    components: { Header, Menu },
    data() {
      return {
        blogs: {},
        currentPage: 1,
        total: 0,
        pageSize: 5,
      }
    },
    // watch: {
    //   '$route'(to, from) {
    //     this.pageByType(1)
    //
    //   }
    // },
    created() {
      this.page(1)
    },
    methods: {
      page(currentPage) {
        this.$axios
          .get('/blogs', {
            params: {
              currentPage: currentPage,
            },
          })
          .then((res) => {
            console.log(res)
            this.blogs = res.data.data.list
            this.currentPage = res.data.data.current
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
