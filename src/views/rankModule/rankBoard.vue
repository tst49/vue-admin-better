<template>
  <div class="container">
    <el-card style="width: 33%; float: left">
      <div slot="header">
        <span class="p">积分榜</span>
      </div>
      <el-table
        v-loading="scoreLoading"
        :element-loading-text="elementLoadingText"
        :data="scoreRank"
        :header-cell-style="{
          color: 'rgba(255,255,255,1)',
          textAlign: 'center',
        }"
        :cell-style="{ textAlign: 'center' }"
      >
        <el-table-column label="排名" type="index" width="55px">
          <template #default="scope">
            <i
              v-if="[0, 1, 2].includes(scope.$index)"
              class="el-icon-trophy"
              :class="[
                scope.$index + 1 == '1'
                  ? 'index_one'
                  : scope.$index + 1 == '2'
                  ? 'index_two'
                  : scope.$index + 1 == '3'
                  ? 'index_three'
                  : '',
              ]"
              style="font-size: 15pt"
            >
              {{ scope.$index + 1 }}
            </i>
            <i v-else>
              {{ scope.$index + 1 }}
            </i>
          </template>
        </el-table-column>
        <el-table-column label="积分" prop="num"></el-table-column>
        <el-table-column label="姓名" prop="nickname"></el-table-column>
        <el-table-column label="班级" prop="clazzName"></el-table-column>
      </el-table>
      <el-divider><span style="color: blue">我的排名</span></el-divider>
      <el-row>
        <el-col :span="5" :offset="1">
          <span style="color: blue">{{ parseNo(myScoreRank.no) }}</span>
        </el-col>
        <el-col :span="6">
          <span style="color: blue">{{ myScoreRank.num }}</span>
        </el-col>
        <el-col :span="6">
          <span style="color: blue">{{ myScoreRank.nickname }}</span>
        </el-col>
        <el-col :span="6">
          <span style="color: blue">{{ myScoreRank.clazzName }}</span>
        </el-col>
      </el-row>
    </el-card>
    <el-card style="width: 33%; float: left">
      <div slot="header">
        <span class="p">刷题榜（总数）</span>
      </div>
      <el-table
        v-loading="totalLoading"
        :element-loading-text="elementLoadingText"
        :data="totalRank"
        :header-cell-style="{
          color: 'rgba(255,255,255,1)',
          textAlign: 'center',
        }"
        :cell-style="{ textAlign: 'center' }"
      >
        <el-table-column label="排名" type="index" width="55px">
          <template #default="scope">
            <i
              v-if="[1, 2, 3].includes(scope.$index + 1)"
              class="el-icon-trophy"
              :class="[
                scope.$index + 1 == '1'
                  ? 'index_one'
                  : scope.$index + 1 == '2'
                  ? 'index_two'
                  : scope.$index + 1 == '3'
                  ? 'index_three'
                  : '',
              ]"
              style="font-size: 15pt"
            >
              {{ scope.$index + 1 }}
            </i>
            <i v-else>
              {{ scope.$index + 1 }}
            </i>
          </template>
        </el-table-column>
        <el-table-column label="题数" prop="num"></el-table-column>
        <el-table-column label="姓名" prop="nickname"></el-table-column>
        <el-table-column label="班级" prop="clazzName"></el-table-column>
      </el-table>
      <el-divider><span style="color: blue">我的排名</span></el-divider>
      <el-row>
        <el-col :span="5" :offset="1">
          <span style="color: blue">{{ parseNo(myTotalRank.no) }}</span>
        </el-col>
        <el-col :span="6">
          <span style="color: blue">{{ myTotalRank.num }}</span>
        </el-col>
        <el-col :span="6">
          <span style="color: blue">{{ myTotalRank.nickname }}</span>
        </el-col>
        <el-col :span="6">
          <span style="color: blue">{{ myTotalRank.clazzName }}</span>
        </el-col>
      </el-row>
    </el-card>
    <el-card style="width: 33%; float: left">
      <div slot="header">
        <span class="p">刷题榜（正确数）</span>
      </div>
      <el-table
        v-loading="correctLoading"
        :element-loading-text="elementLoadingText"
        :data="correctRank"
        :header-cell-style="{
          color: 'rgba(255,255,255,1)',
          textAlign: 'center',
        }"
        :cell-style="{ textAlign: 'center' }"
      >
        <el-table-column label="排名" type="index" width="55px">
          <template #default="scope">
            <i
              v-if="[1, 2, 3].includes(scope.$index + 1)"
              class="el-icon-trophy"
              :class="[
                scope.$index + 1 == '1'
                  ? 'index_one'
                  : scope.$index + 1 == '2'
                  ? 'index_two'
                  : scope.$index + 1 == '3'
                  ? 'index_three'
                  : '',
              ]"
              style="font-size: 15pt"
            >
              {{ scope.$index + 1 }}
            </i>
            <i v-else>
              {{ scope.$index + 1 }}
            </i>
          </template>
        </el-table-column>
        <el-table-column label="题数" prop="num"></el-table-column>
        <el-table-column label="姓名" prop="nickname"></el-table-column>
        <el-table-column label="班级" prop="clazzName"></el-table-column>
      </el-table>
      <el-divider><span style="color: blue">我的排名</span></el-divider>
      <el-row>
        <el-col :span="5" :offset="1">
          <span style="color: blue">{{ parseNo(myCorrectRank.no) }}</span>
        </el-col>
        <el-col :span="6">
          <span style="color: blue">{{ myCorrectRank.num }}</span>
        </el-col>
        <el-col :span="6">
          <span style="color: blue">{{ myCorrectRank.nickname }}</span>
        </el-col>
        <el-col :span="6">
          <span style="color: blue">{{ myCorrectRank.clazzName }}</span>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        scoreRank: [],
        myScoreRank: {},
        totalRank: [],
        myTotalRank: {},
        correctRank: [],
        myCorrectRank: {},

        elementLoadingText: '正在加载...',
        scoreLoading: true,
        totalLoading: true,
        correctLoading: true,
      }
    },
    computed: {
      height() {
        return this.$baseTableHeight()
      },
    },
    created() {
      this.fetchScoreRank()
      this.fetchTotalRank()
      this.fetchCorrectRank()
    },
    methods: {
      parseNo(no) {
        if (no <= 0) {
          return '未上榜'
        }
        return no
      },
      async fetchScoreRank() {
        this.scoreLoading = true
        this.$axios
          .get('/scoreBoard/rank/score')
          .then((res) => {
            this.scoreRank = res.data.data.board
            this.myScoreRank = res.data.data.myRank
          })
          .then(() => {
            this.scoreLoading = false
          })
      },
      async fetchTotalRank() {
        this.totalLoading = true
        this.$axios
          .get('/scoreBoard/rank/total')
          .then((res) => {
            this.totalRank = res.data.data.board
            this.myTotalRank = res.data.data.myRank
          })
          .then(() => {
            this.totalLoading = false
          })
      },
      async fetchCorrectRank() {
        this.correctLoading = true
        this.$axios
          .get('/scoreBoard/rank/correct')
          .then((res) => {
            this.correctRank = res.data.data.board
            this.myCorrectRank = res.data.data.myRank
          })
          .then(() => {
            this.correctLoading = false
          })
      },
    },
  }
</script>

<style>
  .index_one {
    color: #fec412;
    /* background-image: url(~@/assets/images/gold.png); */
  }
  .index_two {
    color: #b4c0c7;
    /* background-image: url(~@/assets/images/silver.png); */
  }
  .index_three {
    color: #714e3a;
    /* background-image: url(~@/assets/images/copper.png); */
  }

  .p {
    font-size: 15pt;
    color: red;
  }
</style>
