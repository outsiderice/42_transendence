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
      component: () => import('../views/SignInView.vue'),
    },
    {
      path: '/sign_up',
      name: 'signup',
      component: () => import('../views/SignUpView.vue'),
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
      path: '/my_profile_design', // change the name and add id !!!!!!!!!!!!!!!!!!!!!!!!!!!!
      name: 'my-profile-design',
      component: () => import('../views/ProfileView.vue'),
    },
    {
      path: '/edit_profile',
      name: 'user',
      component: () => import('../views/SettingsView.vue'),
    },
    {
      path: '/test',
      name: 'test',
      component: () => import('../views/TestView.vue'),
    },
    {
      path: '/test_2',
      name: 'test_2',
      component: () => import('../views/TestView_2.vue'),
    },
	{
      path: '/:pathMatch(.*)*',
      name: '404',
      component: () => import('../views/404.vue'),
    },
    {
      path: '/game',
      name: 'game',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../components/pong/Game.vue'),
    },
  ],
})

export default router
