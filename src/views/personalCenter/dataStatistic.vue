<template>
  <div>
    <el-row>
      <el-card style="width: 49.5%; float: left">
        <vab-chart autoresize :options="Qlevel" />
      </el-card>
      <el-card style="width: 50%; float: left">
        <vab-chart autoresize :options="correctRatioLevel" />
      </el-card>
    </el-row>
    <el-row>
      <el-card style="width: 49.5%; float: left">
        <vab-chart autoresize :options="Qcategory" />
      </el-card>
      <el-card style="width: 50%; float: left">
        <vab-chart autoresize :options="correctRatioCategory" />
      </el-card>
    </el-row>
  </div>
</template>

<script>
  import VabChart from '@/plugins/echarts'

  export default {
    components: {
      VabChart,
    },
    data() {
      return {
        // 配置可视化图形
        Qlevel: {
          title: {
            text: '答题难度分布',
            left: '35%',
          },
          tooltip: {
            trigger: 'item',
          },
          legend: {
            orient: 'vertical',
            left: 'left',
          },
          series: [
            {
              name: '题目难度',
              type: 'pie',
              radius: ['30%', '50%'],
              center: ['45%', '50%'],
              label: {
                show: true,
                formatter(param) {
                  // correct the percentage
                  return param.name + '(' + param.percent + '%)'
                },
              },
              data: [],
            },
          ],
        },
        Qcategory: {
          title: {
            text: '答题题型分布',
            left: '35%',
          },
          tooltip: {
            trigger: 'item',
          },
          legend: {
            orient: 'vertical',
            left: 'left',
          },
          series: [
            {
              name: '题目类型',
              type: 'pie',
              radius: ['30%', '50%'],
              center: ['45%', '50%'],
              label: {
                show: true,
                formatter(param) {
                  // correct the percentage
                  return param.name + '(' + param.percent + '%)'
                },
              },
              data: [],
            },
          ],
        },
        // 不同难度题目正确率
        correctRatioLevel: {
          title: {
            text: '不同难度题目正确率',
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow',
            },
          },
          legend: {},
          // grid: {
          //   left: '3%',
          //   right: '4%',
          //   bottom: '3%',
          //   containLabel: true,
          // },
          xAxis: {
            type: 'category',
            data: ['简单', '中等', '困难'],
          },
          yAxis: {
            name: '正确率',
            type: 'value',
            boundaryGap: [0, 0.01],
          },
          series: [
            {
              name: '我',
              type: 'bar',
              data: ['32', '12.2', '1.2'],
            },
            {
              name: '全站',
              type: 'bar',
              data: ['90', '24', '3'],
            },
          ],
        },
        // 不同难度题目正确率
        correctRatioCategory: {
          title: {
            text: '不同类型题目正确率',
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow',
            },
          },
          legend: {},
          // grid: {
          //   left: '3%',
          //   right: '4%',
          //   bottom: '3%',
          //   containLabel: true,
          // },
          xAxis: {
            type: 'category',
            data: ['单选题', '多选题', '判断题', '填空题', '简答题'],
          },
          yAxis: {
            name: '正确率',
            type: 'value',
            boundaryGap: [0, 0.01],
          },
          series: [
            {
              name: '我',
              type: 'bar',
              data: ['32', '12.2', '1.2'],
            },
            {
              name: '全站',
              type: 'bar',
              data: ['90', '24', '3'],
            },
          ],
        },
      }
    },
    created() {
      this.fetchData()
    },
    mounted() {},
    methods: {
      fetchData() {
        this.fetchQlevel()
        this.fetchQcategory()
        this.fetchCorrectRatioLevel()
        this.fetchCorrectRatioCategory()
      },
      async fetchQlevel() {
        this.$axios.get('/dataStatistic/pie/question/level').then((res) => {
          this.Qlevel.series[0].data = res.data.data
        })
      },
      async fetchQcategory() {
        this.$axios.get('/dataStatistic/pie/question/category').then((res) => {
          this.Qcategory.series[0].data = res.data.data
        })
      },
      async fetchCorrectRatioLevel() {
        this.$axios.get('/dataStatistic/bar/correctRatio/level').then((res) => {
          this.correctRatioLevel.series = res.data.data
        })
      },
      async fetchCorrectRatioCategory() {
        this.$axios
          .get('/dataStatistic/bar/correctRatio/category')
          .then((res) => {
            this.correctRatioCategory.series = res.data.data
          })
      },
    },
  }
</script>

<style lang="scss" scoped></style>
