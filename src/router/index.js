import { createRouter, createWebHistory } from "vue-router";
import Landing from "../components/Landing.vue";
import Add from "../components/Add.vue";
import Edit from "../components/Edit.vue";
import NotFound from "../components/NotFound.vue";

const routes = [
  {
    path: "/",
    name: "Landing",
    component: Landing,
  },
  {
    path: "/add",
    name: "Add",
    component: Add,
  },
  {
    path: "/edit",
    name: "Edit",
    component: Edit,
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
