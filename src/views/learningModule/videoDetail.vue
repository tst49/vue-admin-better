<template>
  <div id="app">
    <vue-aliplayer-v2 ref="VueAliplayerV2" :options="options" />
    <comment v-show="commentVisible" ref="comment"></comment>
  </div>
</template>
<script>
  const category = 1
  import Comment from '../common/comment'

  export default {
    components: { Comment },
    data() {
      return {
        options: {
          source: '//player.alicdn.com/video/aliyunmedia.mp4',
        },
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
      const videoId = _this.$route.params.videoId
      this.$axios
        .get('/learning/video/detail', {
          params: {
            videoId: videoId,
          },
        })
        .then((res) => {})
        .then(() => {
          this.showComment(this.category, videoId)
        })
    },
    methods: {
      async showComment(category, articleId) {
        this.$refs.comment.showComment(category, articleId)
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
</style>
