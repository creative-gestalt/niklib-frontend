import Vue from "vue";
import store from "@/store";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "@/views/Home.vue";
import Login from "@/views/Login.vue";
import Book from "@/components/home/book/Book.vue";
import Edit from "@/components/home/book/Edit.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  { path: "/", redirect: { name: "Login" } },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/home",
    name: "Home",
    component: Home,
    beforeEnter: (to, from, next) => {
      if (!store.getters["getCurrentUser"]) next({ name: "Login" });
      else next();
    },
  },
  {
    path: "/edit/:id",
    name: "Edit",
    component: Edit,
    beforeEnter: (to, from, next) => {
      if (!store.getters["getCurrentUser"]) next({ name: "Login" });
      else next();
    },
  },
  {
    path: "/book/:id",
    name: "Book",
    component: Book,
    beforeEnter: (to, from, next) => {
      if (!store.getters["getCurrentUser"]) next({ name: "Login" });
      else next();
    },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
