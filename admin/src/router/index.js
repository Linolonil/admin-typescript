import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/views/DashboardView.vue'),
      meta: {
        auth: true,
      },
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore();

  if (to.meta?.auth) {
    if (auth.token && auth.user) {
      next();
      return;
    }

    // Verifica o token
    const isAuthenticated = await auth.checkToken();

    if (isAuthenticated) {
      next();
    } else {
      next({ name: 'login' });
    }
  } else {
    if (to.name !== 'login') {
      next({ name: 'login' });
    } else {
      next();
    }
  }
});

export default router;
