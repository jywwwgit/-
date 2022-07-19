<template>
  <div>
    <van-search
      v-model="value"
      placeholder="请输入搜索关键词"
      shape="round"
      @input="inputFn"
    />
    <!-- 搜索下容器 -->
    <div class="search_wrap" v-if="resultList.length === 0">
      <p class="hot_title">热门搜索</p>
      <div class="hot_name_wrap">
        <span
          class="hot_item"
          v-for="(obj, index) in hotArr"
          :key="index"
          @click="fn(obj.first)"
          >{{ obj.first }}</span
        >
      </div>
    </div>
    <!-- 搜索结果 -->
    <div class="search_wrap" v-else>
      <!-- 标题 -->
      <p class="hot_title">最佳匹配</p>
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <!-- <van-cell
          center
          v-for="obj in resultList"
          :key="obj.id"
          :title="obj.name"
          :label="obj.ar[0].name + ' - ' + obj.name"
        >
          <template #right-icon>
            <van-icon name="play-circle-o" size="0.6rem" />
          </template>
        </van-cell> -->
        <SongItem
          v-for="obj in resultList"
          :key="obj.id"
          :name="obj.name"
          :author="obj.ar[0].name"
          :id="obj.id"
        ></SongItem>
      </van-list>
    </div>
  </div>
</template>

<script>
import { hotSearchAPI, searchResultListAPI } from "@/api";
import SongItem from "@/components/SongItem.vue";
export default {
  components: {
    SongItem,
  },
  data() {
    return {
      value: "",
      hotArr: [],
      resultList: [],
      loading: false,
      finished: false,
      page: 1,
      timer: null, //保存防抖参数
    };
  },
  async created() {
    const res = await hotSearchAPI();
    // console.log(res);
    this.hotArr = res.data.result.hots;
  },
  methods: {
    async getListFn() {
      return await searchResultListAPI({
        keywords: this.value,
        limit: 20,
        offset: (this.page - 1) * 20,
      });
    },
    // 点击热搜关键词
    async fn(val) {
      this.page = 1;
      this.finished = false;
      this.value = val;
      // console.log(this.getListFn());
      const res = await this.getListFn();
      // console.log(res);
      if (res.data.result.songs === undefined) {
        this.resultList = [];
        return;
      }
      this.resultList = res.data.result.songs;
      this.loading = false; //本次数据加载完毕-才能让list显示更多
    },
    // 输入框输入搜索
    async inputFn() {
      this.page = 1;
      if (this.timer) clearTimeout(this.timer);
      this.timer = setTimeout(async () => {
        this.finished = false;
        if (this.value.length === 0) {
          this.resultList = [];
          return;
        }
        const res = await this.getListFn();
        if (res.data.result.songs === undefined) {
          this.resultList = [];
          return;
        }
        this.resultList = res.data.result.songs;
        this.loading = false;
      }, 900);
    },
    async onLoad() {
      this.page++;
      const res = await this.getListFn();
      if (res.data.result.songs === undefined) {
        this.finished = true;
        return;
      }
      console.log(res);
      this.resultList = [...this.resultList, ...res.data.result.songs];
      this.loading = false;
    },
  },
};
</script>

<style>
/* 搜索容器的样式 */
.search_wrap {
  padding: 0.266667rem;
}

/*热门搜索文字标题样式 */
.hot_title {
  font-size: 0.32rem;
  color: #666;
}

/* 热搜词_容器 */
.hot_name_wrap {
  margin: 0.266667rem 0;
}

/* 热搜词_样式 */
.hot_item {
  display: inline-block;
  height: 0.853333rem;
  margin-right: 0.213333rem;
  margin-bottom: 0.213333rem;
  padding: 0 0.373333rem;
  font-size: 0.373333rem;
  line-height: 0.853333rem;
  color: #333;
  border-color: #d3d4da;
  border-radius: 0.853333rem;
  border: 1px solid #d3d4da;
}
/* 给单元格设置底部边框 */
.van-cell {
  border-bottom: 1px solid lightgray;
}
</style>