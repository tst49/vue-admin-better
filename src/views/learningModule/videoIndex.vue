<template>
  <div>
    <video-up ref="vabUpload"></video-up>
    <el-button type="primary" @click="handleShow({ key: 'value' })">
      模拟上传
    </el-button>
    <el-divider content-position="center">
      <span style="color: red; font-size: 20pt">最新发布</span>
    </el-divider>
    <el-carousel trigger="click" :interval="4000" type="card" height="300px">
      <el-carousel-item v-for="(newVideo, index) in newVideoList" :key="index">
        <div class="list-card-body">
          <div class="tags">
            <el-tag v-for="tag in newVideo.tags" :key="tag">{{ tag }}</el-tag>
          </div>
          <img
            :src="newVideo.thumbnail"
            class="image-new"
            @click="showVideoDetail(newVideo.id)"
          />
        </div>
      </el-carousel-item>
    </el-carousel>
    <el-divider content-position="center">
      <span style="color: red; font-size: 20pt">视频列表</span>
    </el-divider>
    <el-row :gutter="20">
      <el-col
        v-for="(video, index) in videoList"
        :key="index"
        :xs="24"
        :sm="6"
        :md="6"
        :lg="6"
        :xl="6"
      >
        <el-card :body-style="{ padding: '0px' }" shadow="always">
          <div class="list-card-body">
            <div class="tags">
              <el-tag v-for="tag in video.tags" :key="tag">{{ tag }}</el-tag>
              <el-button
                v-if="video.isLike"
                style="margin-left: 15px"
                type="warning"
                icon="el-icon-star-on"
                circle
                @click="like(video)"
              ></el-button>
              <el-button
                v-else
                style="margin-left: 15px"
                type="warning"
                icon="el-icon-star-off"
                circle
                plain
                @click="like(video)"
              ></el-button>
            </div>
            <img
              :src="video.thumbnail"
              class="image"
              @click="showVideoDetail(video.id)"
            />
            <div style="padding: 5px">
              <span style="font-size: 15pt; color: blue">
                {{ video.title }}
              </span>
              <el-row style="margin-top: 5px">
                <span>发布者：{{ video.authorName }}</span>
                <el-divider direction="vertical"></el-divider>
                <span>播放量：{{ video.viewCount }}</span>
              </el-row>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-pagination
      background
      :current-page="queryForm.pageNo"
      :layout="layout"
      :page-size="queryForm.pageSize"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    ></el-pagination>
  </div>
</template>
<script>
  const category = 1

  import VideoUp from './components/videoUp'

  export default {
    components: {
      VideoUp,
    },
    data() {
      return {
        category: category,
        newVideoList: [],
        videoList: [],
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
      this.fetchData()
    },
    methods: {
      showVideoDetail(videoId) {
        this.$router.push({
          path: '/video/detail',
          query: { videoId: videoId },
        })
      },
      handleShow(data) {
        this.$refs['vabUpload'].handleShow(data)
      },
      async fetchCarousel() {
        this.$axios.get('/learning/video/carousel/list').then((res) => {
          // console.log(res)
          this.newVideoList = res.data.data
        })
      },
      fetchData() {
        this.listLoading = true
        this.fetchCarousel()
        this.$axios
          .get('/learning/video/overview/list', {
            params: {
              pageNo: this.queryForm.pageNo,
              pageSize: this.queryForm.pageSize,
            },
          })
          .then((res) => {
            // console.log(res)
            this.videoList = res.data.data.list
            this.total = res.data.data.total
          })
          .then(() => {
            this.listLoading = false
          })
      },
      like(video) {
        this.$axios
          .get('/manage_center/like/edit', {
            params: {
              bool: !video.isLike,
              dataCategory: this.category,
              dataId: video.id,
            },
          })
          .then((res) => {
            if (video.isLike) {
              this.$message('已取消收藏')
            } else {
              this.$message('已收藏')
            }
          })
          .then((res) => {
            video.isLike = !video.isLike
          })
      },
      handleSizeChange(val) {
        this.queryForm.pageSize = val
        this.fetchData()
      },
      handleCurrentChange(val) {
        this.queryForm.pageNo = val
        this.fetchData()
      },
    },
  }
</script>

<style lang="scss">
  // 走马灯
  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 200px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n + 1) {
    background-color: #d3dce6;
  }

  // video卡片
  .list-card-body {
    position: relative;
    cursor: pointer;

    .tags {
      position: absolute;
      top: 10px;
      right: 5px;
      z-index: 9;
    }
  }

  .bottom {
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image-new {
    width: 100%;
    height: 300px;
    display: block;
  }

  .image {
    width: 100%;
    height: 150px;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: '';
  }

  .clearfix:after {
    clear: both;
  }
</style>
