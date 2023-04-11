<template>
  <div>
    <video-up
      ref="vabUpload"
      url="/upload"
      name="file"
      :limit="50"
      :size="2"
    ></video-up>
    <el-button type="primary" @click="handleShow({ key: 'value' })">
      模拟上传
    </el-button>
    <el-row :gutter="20">
      <el-col
        v-for="(video, index) in videoList"
        :key="index"
        :xs="24"
        :sm="8"
        :md="8"
        :lg="8"
        :xl="6"
      >
        <el-card :body-style="{ padding: '0px' }" shadow="always">
          <img :src="video.thumbnail" class="image" />
          <div style="padding: 14px">
            <span>{{ video.title }}</span>
            <div class="bottom clearfix">
              <el-tag v-for="tag in video.tags" :key="tag">{{ tag }}</el-tag>
              <p>{{ video.authorName }}</p>
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
    created() {},
    methods: {
      handleShow(data) {
        this.$refs['vabUpload'].handleShow(data)
      },
      async fetchData() {
        this.listLoading = true
        this.$axios
          .get('/manage_center/question/list', {
            params: {
              key: this.queryForm.key,
              pageNo: this.queryForm.pageNo,
              pageSize: this.queryForm.pageSize,
            },
          })
          .then((res) => {
            console.log(res)
            this.list = res.data.data.list
            this.total = res.data.data.total
          })
          .then(() => {
            this.listLoading = false
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

<style>
  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    width: 100%;
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
