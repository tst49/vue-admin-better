<template>
  <div class="menu1-container">
    <el-alert :closable="false" title="嵌套路由 1" type="success">
      <el-input v-model="score"></el-input>
      <div>
        <el-button
          v-for="name in nameList"
          :key="name"
          type="primary"
          @click="submit(name)"
        >
          {{ name }}
        </el-button>
      </div>

      <router-view />
    </el-alert>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        nameList: ['谭思涛', '张毅', '曾博川', '徐杨', '罗声涛'],
        score: 0,
      }
    },
    methods: {
      submit(name) {
        console.log(name + ' ' + this.score)
        this.$axios
          .get('/score/add', {
            params: {
              name: name,
              score: this.score,
            },
          })
          .then((res) => {
            this.$alert('操作成功', '提示', {
              confirmButtonText: '确定',
              callback: (action) => {},
            })
          })
      },
    },
  }
</script>
