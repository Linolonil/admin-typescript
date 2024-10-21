import router from '@/router';
import api from '@/service/api';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token'));
  const refreshToken = ref(localStorage.getItem('refreshtoken'));

  const user = ref(null);

  try {
    const storedUser = localStorage.getItem('user');
    user.value = storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error('Erro ao fazer parse do usuário:', error);
    user.value = null;
  }

  function setToken(tokenValue) {
    localStorage.setItem('token', tokenValue);
    token.value = tokenValue;
  }

  function setRefreshToken(refreshtokenValue) {
    localStorage.setItem('refreshtoken', refreshtokenValue);
    refreshToken.value = refreshtokenValue;
  }

  function setUser(userValue) {
    if (userValue && typeof userValue === 'object') {
      try {
        localStorage.setItem('user', JSON.stringify(userValue)); // Certifique-se de que você está serializando corretamente.
        user.value = userValue;
      } catch (error) {
        console.error('Erro ao armazenar o usuário no localStorage:', error);
      }
    } else {
      console.error('Tentativa de armazenar um usuário inválido:', userValue);
    }
  }

  function logout() {
    clear();
    router.push({ name: 'login' });
  }
  async function checkToken() {
    try {
      const tokenAuth = 'Bearer ' + token.value;
      const response = await api.get('/auth/verify', {
        headers: {
          Authorization: tokenAuth,
        },
      });

      return response;
    } catch (error) {
      console.log(error.response.data);
    }
  }

  const isAuthenticated = computed(() => {
    return token.value && user.value;
  });

  const fullName = computed(() => {
    if (user.value) {
      return (
        user.value.name.split(' ')[0] + ' ' + user.value.name.split(' ')[1]
      );
    }
    return '';
  });

  function clear() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshtoken');
    localStorage.removeItem('user');
    token.value = null;
    user.value = null;
    refreshToken.value = null;
  }

  return {
    clear,
    isAuthenticated,
    fullName,
    logout,
    checkToken,
    token,
    refreshToken,
    user,
    setToken,
    setRefreshToken,
    setUser,
  };
});
