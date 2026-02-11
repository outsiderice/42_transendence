import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useSessionStore } from '@/state/user_session.ts'

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
      path: '/leaderboards',
      name: 'leaderboards',
      component: () => import('../views/Leaderboards.vue'),
    },
    {
      path: '/users',
      name: 'users',
      component: () => import('../views/UserListing.vue'),
    },
    {
      path: '/users/:id',
	  component: () => import('../views/ProfileView.vue'),
    },
    //{
      //path: '/my_profile_design', // change the name and add id !!!!!!!!!!!!!!!!!!!!!!!!!!!!
      //name: 'my-profile-design',
      //component: () => import('../views/ProfileView.vue'),
    //},
    {
      path: '/test_card',
      name: 'test-card',
      component: () => import('../views/test_card.vue'),
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
      component: () => import('../components/pong/Game.vue'),
      meta: { hideFooter: true }
    },
   // {
     // path: '/friendship_requests',
      //name: 'friendship_requests',
      //component: () => import('../views/FriendshipRequests.vue'),
    //},
  ],
})

//
//	restricting the web app to all users that aren't signed in.
//


router.beforeEach((to, from) => {
//	const result = await fetch('https://' + window.location.host + '/api/auth/refresh', {
//		method:'POST',
//	});
	const session = useSessionStore();

	if (to.name === "signin" || to.name === "signup") {
		return ;
	}
	if (
		(to.name !== "signin" 
		 	&& to.name !== "signup" 
			&& to.name !== 'privacy policy'
			&& to.name !== 'terms of service') 
		&& !session.getIsSignedIn) {
		return { name: "signin" };
	}
});

export default router
