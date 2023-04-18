<template>
  <!--评论列表-->
  <div class="comment-body">
    <!--评论表单-->
    <CommentForm
      v-if="parentCommentId === -1"
      :root-comment-id="-1"
      :parent-comment-id="-1"
      :data-category="dataCategory"
      :data-id="dataId"
      @parentEvent="toClick"
    ></CommentForm>
    <h3 class="ui-dividing-header" style="color: orange">
      Comments | 共 {{ commentCount[0] }} 条评论 |
      {{ commentCount[1] }} 条被折叠
    </h3>
    <h3 v-if="commentCount[0] === 0" class="ui-header" style="color: red">
      快来抢沙发！
    </h3>
    <!--    评论内容-->
    <div v-for="comment in comments" :key="comment.id" class="comment">
      <span :id="`comment-${comment.id}`" class="anchor"></span>
      <a class="image-avatar">
        <img :src="comment.avatar" style="width: 40px; border-radius: 50%" />
      </a>
      <div class="content">
        <label class="nickname">{{ comment.nickname }}</label>
        <strong class="date">{{ comment.createTime }}</strong>
        <el-button size="mini" type="primary" @click="setReply(comment.id)">
          回复
        </el-button>
        <div class="text" v-html="comment.content"></div>
      </div>

      <!--      子评论-->
      <div
        v-if="comment.replyComments && comment.replyComments.length > 0"
        class="comments"
      >
        <div
          v-for="reply in comment.replyComments"
          :key="reply.id"
          class="comment"
        >
          <span :id="`comment-${reply.id}`" class="anchor"></span>
          <a class="image-avatar">
            <img :src="reply.avatar" style="width: 40px; border-radius: 50%" />
          </a>
          <div class="content">
            <label class="nickname">{{ reply.nickname }}</label>
            <strong class="date">{{ reply.createTime }}</strong>
            <el-button size="mini" type="primary" @click="setReply(reply.id)">
              回复
            </el-button>
            <div class="text">
              <a
                :href="`#comment-${comment.id}`"
                style="
                  text-decoration-line: none;
                  margin-right: 8px;
                  font-weight: bold;
                  color: blue;
                "
              >
                @{{ reply.parentNickname }}
              </a>
              <div v-html="reply.content"></div>
            </div>
          </div>
          <CommentForm
            v-if="parentCommentId === reply.id"
            :root-comment-id="comment.id"
            :parent-comment-id="reply.id"
            :data-category="dataCategory"
            :data-id="dataId"
            @parentEvent="toClick"
          />
        </div>
      </div>
      <div class="border"></div>
      <CommentForm
        v-if="parentCommentId === comment.id"
        :root-comment-id="comment.id"
        :parent-comment-id="comment.id"
        :data-category="dataCategory"
        :data-id="dataId"
        @parentEvent="toClick"
      />
    </div>

    <el-pagination
      class="mpage"
      background
      layout="prev, pager, next"
      :current-page="pageNo"
      :page-size="pageSize"
      :total="total"
      @current-change="getPageComments()"
    ></el-pagination>
  </div>
</template>

<script>
  import CommentForm from './commentForm'

  export default {
    name: 'Comment',
    components: { CommentForm },
    data() {
      return {
        dataCategory: null,
        dataId: null,
        commentCount: [],
        comments: [],
        parentCommentId: null,
        pageNo: 1,
        total: 0,
        pageSize: 8,
      }
    },
    created() {},
    methods: {
      //设置回复的parent
      setReply(id) {
        this.parentCommentId = id
      },
      //接受子组件信息，将评论表单归位
      toClick() {
        this.parentCommentId = '-1'
      },
      showComment(dataCategory, dataId) {
        this.dataCategory = dataCategory
        this.dataId = dataId
        this.getCommentCount()
        this.getPageComments(1)
        this.parentCommentId = '-1'
      },
      //获取评论
      getPageComments(pageNo) {
        this.$axios
          .get('/comment/page/query', {
            params: {
              dataCategory: this.dataCategory,
              dataId: this.dataId,
              pageNo: pageNo,
              pageSize: this.pageSize,
            },
          })
          .then((res) => {
            console.log(res)
            this.comments = res.data.data.list
            this.total = res.data.data.total
          })
      },
      getCommentCount() {
        this.$axios
          .get('/comment/count', {
            params: {
              dataCategory: this.dataCategory,
              dataId: this.dataId,
            },
          })
          .then((res) => {
            this.commentCount = res.data.data
          })
      },
    },
  }
</script>

<style scoped>
  .comment-body {
    padding: 5px 35px 15px 22px;
  }
  .comment {
    padding-right: 2em !important;
    padding-left: 1em !important;
    margin: 7px 0px 0px;
    padding-top: 7px;
  }
  .comments {
    padding: 42px 0px 24px 31.5px;
    margin: -28px 0px -10px 17.5px;
    border-left: 1px #ccc solid;
  }
  .content {
    margin-left: 0px;
    display: inline-block;
    width: auto;
    vertical-align: top;
  }
  .image-avatar {
    display: inline-block;
    width: 49px;
    vertical-align: top;
  }
  .label {
    margin-left: 5px;
  }
  .nickname {
    font-weight: bolder;
    font-size: 15px;
    color: #000;
    text-decoration-line: none;
  }
  .comment .el-button {
    margin-left: 5px;
    padding: 4px 5px;
  }
  .text {
    white-space: pre-wrap !important;
    margin: 7px 0px;
    line-height: 1.5;
    font-size: 14px;
  }
  .date {
    color: gray;
    font-size: 10px;
    margin-left: 10px;
  }
  .anchor {
    height: 55px;
    margin-top: -55px;
    visibility: hidden;
  }

  .mpage {
    margin: 0 auto;
    text-align: center;
  }
</style>
