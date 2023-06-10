import { createRouter, createWebHistory } from 'vue-router';
// import HomeView from '../views/HomeView.vue'
import DashboardView from '../views/dashboard/DashboardView.vue';
import { useUserStore } from '@/stores/userStore';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: 'login',
    },
    {
      path: '/register',
      component: () => import('../views/authentication/RegistrationView.vue'),
    },
    {
      path: '/login',
      component: () => import('../views/authentication/LoginView.vue'),
    },
    {
      path: '/dashboard',
      component: DashboardView,
      meta: { requiresAuth: true },
    },
  ],
});

router.beforeEach((to, from, next) => {
  const userStore = useUserStore();

  const isAuthenticated = (): boolean => {
    return userStore.isAuthenticated;
  };

  if (to.meta.requiresAuth && !isAuthenticated()) {
    next('/login');
  } else {
    next();
  }
});

export default router;
