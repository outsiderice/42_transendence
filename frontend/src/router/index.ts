import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
	{
      path: '/404',
      name: '404',
      component: () => import('../views/404.vue'),
    },
	{
      path: '/401',
      name: '401',
      component: () => import('../views/401.vue'),
    },
    {
      path: '/sign_in',
      name: 'signin',
      component: () => import('../views/404.vue'),
    },
    {
      path: '/sign_up',
      name: 'signup',
      component: () => import('../views/404.vue'),
    },
    {
      path: '/game_local',
      name: 'gamelocal',
      component: () => import('../views/404.vue'),
    },
    {
      path: '/game_online',
      name: 'gameonline',
      component: () => import('../views/404.vue'),
    },
    {
      path: '/users',
      name: 'users',
      component: () => import('../views/404.vue'),
    },
    {
      path: '/user/:id',
      name: 'user',
      component: () => import('../views/404.vue'),
    },
    {
      path: '/edit_profile',
      name: 'user',
      component: () => import('../views/404.vue'),
    },
  ],
})

export default router
