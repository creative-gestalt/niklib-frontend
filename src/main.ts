import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import "@/firebase";

Vue.config.productionTip = false;
Vue.filter(
  "truncate",
  function (text: string | never[], stop: number, clamp: string) {
    return text.slice(0, stop) + (stop < text.length ? clamp || "..." : "");
  },
);

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
