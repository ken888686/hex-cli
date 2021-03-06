import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
  },
  {
    path: '/week-4',
    name: 'Week 4',
    component: () => import('../views/Week-4.vue'),
  },
  {
    path: '/week-5',
    name: 'Week 5',
    component: () => import('../views/Week-5.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkExactActiveClass: 'active',
});

export default router;
