import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import DetailedInformation from "../views/DetailedInformation";
import Favorites from "../views/Favorites";

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/movieinfo',
    name: 'movieinfo',
    component: DetailedInformation
  },
  {
    path: '/favorites',
    name: 'favorites',
    component: Favorites
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
