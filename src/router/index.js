import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: '/classList',
    },
    {
      path: '/classList',
      name: 'ClassList',
      component: () => import('../views/ClassList.vue'),
    },
    {
      path: '/class/:id',
      name: 'ClassDetail',
      component: () => import('@/views/ClassDetail.vue'),
    },
    {
      path: '/class/edit',
      name: 'ClassEdit',
      component: () => import('@/views/ClassEdit.vue'),
    },
  ],
});

export default router;