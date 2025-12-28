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
      path: '/terms_of_service',
      name: 'terms of service',
      component: () => import('../views/TermsOfService.vue'),
    },
	{
      path: '/privacy_policy',
      name: 'privacy policy',
      component: () => import('../views/PrivacyPolicy.vue'),
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
      path: '/local_game',
      name: 'local_game',
      component: () => import('../views/LocalGame.vue'),
    },
    {
      path: '/online_game',
      name: 'online_game',
      component: () => import('../views/OnLineGame.vue'),
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
    {
      path: '/test',
      name: 'test',
      component: () => import('../views/TestView.vue'),
    },
	{
      path: '/:pathMatch(.*)*',
      name: '404',
      component: () => import('../views/404.vue'),
    },
  ],
})

export default router
