import Vue from 'vue'
import App from './App.vue'
import "@/mobile/flexible" // 适配
import "@/styles/reset.css" // 初始化项目
import router from "@/router"

// import { recommendMusicAPI } from "@/api/index"
import { Tabbar, TabbarItem, NavBar,Col, Row,Image as VanImage,Cell,Icon,Search,List } from 'vant'; 

Vue.use(List);
Vue.use(Search);
Vue.use(Icon);
Vue.use(Cell);
Vue.use(Tabbar);
Vue.use(TabbarItem);
Vue.use(NavBar);
Vue.use(Col);
Vue.use(Row);
Vue.use(VanImage);

// async function myFn() {
//   const res = await recommendMusicAPI({ limit: 6 });
//   console.log(res);
// }
// myFn()

Vue.config.productionTip = false


new Vue({
  render: h => h(App),
  router
}).$mount('#app')
