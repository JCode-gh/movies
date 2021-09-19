import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import DetailedInformation from "../views/DetailedInformation";
import Favorites from "../views/Favorites";
import AltTitles from "../components/DetailedInformation/AltTitles";
import Newest from "../views/Newest";

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
  },
  {
    path: '/collection',
    name: 'collection',
    component: AltTitles
  },
  {
    path: '/newestmovies',
    name: 'newestmovies',
    component: Newest
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
