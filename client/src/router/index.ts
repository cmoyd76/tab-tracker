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
      name: 'register',
      component: () => import('../views/authentication/RegistrationView.vue'),
      meta: { middleware: 'public' },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/authentication/LoginView.vue'),
      meta: { middleware: 'public' },
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: { middleware: 'auth' },
    },
  ],
});

router.beforeEach((to, from, next) => {
  // redirect to login page if not logged in and trying to access a restricted page

  const userStore = useUserStore();

  if (to.meta.middleware != 'auth' && userStore.isAuthenticated) {
    next({ path: '/dashboard' });
  } else if (to.meta.middleware == 'auth') {
    if (userStore.isAuthenticated) {
      next();
    } else {
      next({ name: 'login' });
    }
  } else {
    next();
  }

  // Scroll page to top on every route change
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth',
  });
});

export default router;
