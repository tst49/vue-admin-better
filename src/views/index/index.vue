<template>
  <div class="index-container">
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="12" :lg="6" :xl="6">
        <el-card shadow="never">
          <div slot="header">
            <span>学习总时长</span>
          </div>
          <vab-chart autoresize :options="fwl" />
          <div class="bottom">
            <span>
              日均学习时长:
              {{ config1.endVal }}
            </span>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="6" :xl="6">
        <el-card shadow="never">
          <div slot="header">
            <span>近日答题数</span>
          </div>
          <vab-chart autoresize :options="sqs" />
          <div class="bottom">
            <span>
              总答题数:
              {{ config2.endVal }}
            </span>
          </div>
        </el-card>
      </el-col>

      <el-col
        v-for="(item, index) in iconList"
        :key="index"
        :xs="12"
        :sm="6"
        :md="3"
        :lg="3"
        :xl="3"
      >
        <router-link :to="{ path: item.link }">
          <el-card class="icon-panel" shadow="never">
            <vab-icon
              :style="{ color: item.color }"
              :icon="['fas', item.icon]"
            ></vab-icon>
            <p>{{ item.title }}</p>
          </el-card>
        </router-link>
      </el-col>
    </el-row>
    <el-divider content-position="center">
      <i class="el-icon-edit">
        <span style="color: blue">最近答题记录</span>
      </i>
    </el-divider>
    <!-- 最近答题记录 -->
    <el-row>
      <el-table
        ref="tableSort"
        v-loading="listLoading"
        :data="list"
        :element-loading-text="elementLoadingText"
      >
        <el-table-column
          show-overflow-tooltip
          label="试卷名"
          prop="title"
        ></el-table-column>
        <el-table-column show-overflow-tooltip label="试卷得分">
          <template #default="{ row }">
            <span :style="getColor(row.score)">{{ row.score }}分</span>
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          label="作答时间"
          prop="createTime"
        ></el-table-column>
        <el-table-column show-overflow-tooltip label="操作">
          <template #default="{ row }">
            <el-button type="text" @click="showDetail(row.id)">
              查看详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
  </div>
</template>

<script>
  import VabChart from '@/plugins/echarts'
  // import { getList } from '@/api/changeLog'

  export default {
    name: 'Index',
    components: {
      VabChart,
    },
    data() {
      return {
        list: [],
        listLoading: true,
        elementLoadingText: '正在加载...',
        timer: 0,
        updateTime: process.env.VUE_APP_UPDATE_TIME,
        config1: {
          startVal: 0,
          endVal: this.$baseLodash.random(20000, 60000),
          decimals: 0,
          prefix: '',
          suffix: '',
          separator: ',',
          duration: 8000,
        },
        config2: {
          startVal: 0,
          endVal: this.$baseLodash.random(1000, 20000),
          decimals: 0,
          prefix: '',
          suffix: '',
          separator: ',',
          duration: 8000,
        },
        config3: {
          startVal: 0,
          endVal: this.$baseLodash.random(1000, 20000),
          decimals: 0,
          prefix: '',
          suffix: '',
          separator: ',',
          duration: 8000,
        },

        //访问量
        fwl: {
          color: [
            '#1890FF',
            '#36CBCB',
            '#4ECB73',
            '#FBD437',
            '#F2637B',
            '#975FE5',
          ],
          backgroundColor: 'rgba(252,252,252,0)',
          grid: {
            top: '4%',
            left: '2%',
            right: '4%',
            bottom: '0%',
            containLabel: true,
          },
          xAxis: [
            {
              type: 'category',
              boundaryGap: false,
              data: [],
              axisTick: {
                alignWithLabel: true,
              },
            },
          ],
          yAxis: [
            {
              type: 'value',
            },
          ],
          series: [
            {
              name: '访问量',
              type: 'line',
              data: [],
              smooth: true,
              areaStyle: {},
            },
          ],
        },
        //授权数
        sqs: {
          color: [
            '#1890FF',
            '#36CBCB',
            '#4ECB73',
            '#FBD437',
            '#F2637B',
            '#975FE5',
          ],
          backgroundColor: 'rgba(252,252,252,0)',
          grid: {
            top: '4%',
            left: '2%',
            right: '4%',
            bottom: '0%',
            containLabel: true,
          },
          xAxis: [
            {
              type: 'category',
              /*boundaryGap: false,*/
              data: ['0时', '4时', '8时', '12时', '16时', '20时', '24时'],
              axisTick: {
                alignWithLabel: true,
              },
            },
          ],
          yAxis: [
            {
              type: 'value',
            },
          ],
          series: [
            {
              name: '授权数',
              type: 'bar',
              barWidth: '60%',
              data: [10, 52, 20, 33, 39, 33, 22],
            },
          ],
        },
        //卡片图标
        iconList: [
          {
            icon: 'video',
            title: '仿真算法视频',
            link: 'video/index',
            color: '#ffc069',
          },
          {
            icon: 'book',
            title: '资料库',
            link: 'article/index',
            color: '#69c0ff',
          },
          {
            icon: 'laptop-code',
            title: '刷题',
            link: 'question/index',
            color: '#b37feb',
          },
          {
            icon: 'table',
            title: '试卷库',
            link: 'paper/index',
            color: '#5cdbd3',
          },
          {
            icon: 'folder-open',
            title: '收藏夹',
            link: 'favorites',
            color: '#ff85c0',
          },
          {
            icon: 'chart-bar',
            title: '数据分析',
            link: 'data/statistic',
            color: '#95de64',
          },

          {
            icon: 'balance-scale-left',
            title: '答题详情',
            link: 'answer/record/index',
            color: '#ff9c6e',
          },
          {
            icon: 'coins',
            title: '我的积分',
            link: 'rank/board',
            color: '#ffd666',
          },
        ],
      }
    },
    created() {
      this.fetchTestRecordData()
    },
    beforeDestroy() {
      clearInterval(this.timer)
    },
    mounted() {
      let base = +new Date(2020, 1, 1)
      let oneDay = 24 * 3600 * 1000
      let date = []
      let data = [Math.random() * 1500]
      let now = new Date(base)
      const addData = (shift) => {
        now = [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/')
        date.push(now)
        data.push(this.$baseLodash.random(20000, 60000))
        if (shift) {
          date.shift()
          data.shift()
        }
        now = new Date(+new Date(now) + oneDay)
      }
      for (let i = 1; i < 6; i++) {
        addData()
      }
      addData(true)
      this.fwl.xAxis[0].data = date
      this.fwl.series[0].data = data
      this.timer = setInterval(() => {
        addData(true)
        this.fwl.xAxis[0].data = date
        this.fwl.series[0].data = data
      }, 3000)
    },
    methods: {
      routerlink(path) {
        console.log(path)
        this.$router.push({
          path: path,
        })
      },
      handleClick(e) {
        this.$baseMessage(`点击了${e.name},这里可以写跳转`)
      },
      handleZrClick(e) {},
      handleChangeTheme() {
        this.$baseEventBus.$emit('theme')
      },
      async fetchTestRecordData() {
        this.listLoading = true
        this.$axios
          .get('/testing/answerRecord/latest')
          .then((res) => {
            this.list = res.data.data
          })
          .then(() => {
            this.listLoading = false
          })
      },
      getColor(score) {
        if (score < 60) {
          return 'color: red'
        } else if (score < 80) {
          return 'color: orange'
        } else {
          return 'color: green'
        }
      },
      showDetail(id) {
        this.$router.push({
          path: '/answer/record',
          query: { recordId: id },
        })
      },
    },
  }
</script>
<style lang="scss" scoped>
  .index-container {
    padding: 0 !important;
    margin: 0 !important;
    background: #f5f7f8 !important;

    ::v-deep {
      .el-alert {
        padding: $base-padding;

        &--info.is-light {
          min-height: 82px;
          padding: $base-padding;
          margin-bottom: 15px;
          color: #909399;
          background-color: $base-color-white;
          border: 1px solid #ebeef5;
        }
      }

      .el-card__body {
        .echarts {
          width: 100%;
          height: 115px;
        }
      }
    }

    .card {
      ::v-deep {
        .el-card__body {
          .echarts {
            width: 100%;
            height: 305px;
          }
        }
      }
    }

    .bottom {
      padding-top: 20px;
      margin-top: 5px;
      color: #595959;
      text-align: left;
      border-top: 1px solid $base-border-color;
    }

    .table {
      width: 100%;
      color: #666;
      border-collapse: collapse;
      background-color: #fff;

      td {
        position: relative;
        min-height: 20px;
        padding: 9px 15px;
        font-size: 14px;
        line-height: 20px;
        border: 1px solid #e6e6e6;

        &:nth-child(odd) {
          width: 20%;
          text-align: right;
          background-color: #f7f7f7;
        }
      }
    }

    .icon-panel {
      height: 117px;
      text-align: center;
      cursor: pointer;

      svg {
        font-size: 40px;
      }

      p {
        margin-top: 10px;
      }
    }

    .bottom-btn {
      button {
        margin: 5px 10px 15px 0;
      }
    }
  }
</style>
