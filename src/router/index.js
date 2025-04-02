import Vue from "vue";
import App from "../App.vue";
import Router from "vue-router";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
/*
const routerOptions = [
  { path: "/", component: "Landing" },
  { path: "/add", component: "Add" },
  { path: "/edit", component: "Edit" },
  { path: "*", component: "NotFound" } 
];


const routes = routerOptions.map((route) => {
  return {
    ...route,
    component: () => import(`../components/${route.component}.vue`)
  };
});
*/

Vue.use(Router);
Vue.use(Toast);
export default new Router({
  mode: "history",
  components: { App },
  template: "<App/>"
  //routes
});
