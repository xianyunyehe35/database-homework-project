import { createRouter, createWebHistory } from 'vue-router'

import LoginPage from '@/views/LoginPage.vue'
import LayoutAuthorPage from '@/views/LayoutAuthorPage.vue'
import LayoutReviewerPage from '@/views/LayoutReviewerPage.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginPage,
    },

    {
      path:'/userLayout',
      component: LayoutAuthorPage
    },

    {
      path:'/reviewLayout',
      component:LayoutReviewerPage
    }

    
    
  ],
})

export default router
