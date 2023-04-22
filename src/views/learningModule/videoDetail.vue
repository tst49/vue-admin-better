<template>
  <div id="app">
    <vue-aliplayer-v2 ref="VueAliplayerV2" :source="videoDetail.videoUrl" />
    <h1>{{ videoDetail.title }}</h1>
    <div class="author-message">
      <ul class="list">
        <li>
          <img
            :src="videoDetail.authorAvatar"
            style="width: 40px; border-radius: 50%"
          />
          作者：{{ videoDetail.authorName }}
        </li>
        <li>
          <el-row>
            分类：
            <el-tag v-for="tag in videoDetail.tags" :key="tag">
              {{ tag }}
            </el-tag>
            <el-button
              v-if="videoDetail.isLike"
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
        </li>
        <li>发布时间：{{ videoDetail.createTime }}</li>
        <li>播放量：{{ videoDetail.viewCount }}</li>
        <li>简介：{{ videoDetail.description }}</li>
      </ul>
    </div>
    <!--评论-->
    <div class="ui bottom teal attached segment threaded comments">
      <comment v-show="commentVisible" ref="comment"></comment>
    </div>
  </div>
</template>
<script>
  //视频
  const category = 1
  import Comment from '../common/comment'

  export default {
    components: { Comment },
    data() {
      return {
        videoDetail: {},
        category: category,
        commentVisible: false,
        queryForm: {
          pageNo: 1,
          pageSize: 10,
          title: '',
        },
        total: 0,
        listLoading: true,
        layout: 'total, sizes, prev, pager, next, jumper',
        background: true,
        elementLoadingText: '正在加载...',
      }
    },
    created() {
      const _this = this
      const videoId = _this.$route.query.videoId
      this.$axios
        .get('/learning/video/detail', {
          params: {
            videoId: videoId,
          },
        })
        .then((res) => {
          this.videoDetail = res.data.data
        })
        .then(() => {
          this.showComment(this.category, videoId)
        })
    },
    methods: {
      like() {
        this.$axios
          .get('/manage_center/like/edit', {
            params: {
              bool: !this.videoDetail.isLike,
              dataCategory: this.category,
              dataId: this.videoDetail.id,
            },
          })
          .then((res) => {
            if (this.videoDetail.isLike) {
              this.$message('已取消收藏')
            } else {
              this.$message('已收藏')
            }
          })
          .then((res) => {
            this.videoDetail.isLike = !this.videoDetail.isLike
          })
      },
      async showComment(category, videoId) {
        this.$refs.comment.showComment(category, videoId)
        this.commentVisible = true
      },
    },
  }
</script>
<style>
  * {
    margin: 0;
    padding: 0;
  }

  .author-message {
    text-align: left;
    background-color: honeydew;
    padding: 10px 5px 10px 5px;
    font-size: 14px;
  }
</style>
