<script setup>
import Button from '@/components/ui/button/Button.vue';
import { ReloadIcon } from '@radix-icons/vue';
import api from '@/service/api';
import logo from '../assets/img/logocaaam.png';
import { reactive, ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import router from '@/router';
import { toast } from '@/components/ui/toast';

const auth = useAuthStore();
const user = reactive({
  userName: '',
  password: '',
});

const loading = ref(false);
const errorMessage = ref('');

const login = async () => {
  errorMessage.value = '';

  if (!user.userName || !user.password) {
    errorMessage.value = 'Por favor, preencha todos os campos.';
    return;
  }

  loading.value = true;
  try {
    const response = await api.post(`/auth/login`, user);
    const data = response.data;

    if (response.status !== 200) {
      errorMessage.value = 'Login falhou. Verifique suas credenciais.';
      return;
    }
    auth.setToken(data.accessToken);
    auth.setRefreshToken(data.refreshToken);
    auth.setUser(data.user);
    router.push({ name: 'dashboard' });
  } catch (error) {
    errorMessage.value = 'Login falhou. Verifique suas credenciais.';
    toast({
      description: `${errorMessage.value}`,
      duration: 2500,
      variant: 'destructive',
    });
    console.error(
      'Erro ao fazer login:',
      error.response?.data || error.message,
    );
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div
    class="background flex items-center justify-center min-h-screen bg-cover bg-center"
  >
    <div
      class="flex flex-col md:flex-row items-center justify-center bg-black bg-opacity-70 p-10 rounded-lg shadow-lg max-w-5xl w-full"
    >
      <div
        class="hidden h-[26.5rem] md:flex flex-col items-start justify-center w-full md:w-1/2 p-8 text-white space-y-6 relative"
      >
        <img
          :src="logo"
          alt="logo"
          class="h-20 w-auto absolute top-4 left-32 bg-opacity-10"
        />
        <div class="p-3">
          <h1 class="text-4xl font-bold">
            Bem-vindo ao sistema de agendamento
          </h1>
          <p class="text-gray-300 mt-10">
            Gerencie os agendamentos das salas de maneira fácil e prática.
          </p>
        </div>
      </div>
      <div
        class="flex flex-col w-full md:w-1/2 p-8 text-white space-y-6 bg-gray-800 bg-opacity-80 rounded-lg"
      >
        <h1 class="text-3xl text-center font-bold">Login</h1>
        <form @submit.prevent="login" class="space-y-4 pb-5">
          <div>
            <label
              for="username"
              class="block text-sm font-medium text-gray-300"
            >
              Nome de usuário
            </label>
            <input
              id="username"
              autocomplete="current-password"
              required
              placeholder="Digite seu nome de usuário"
              v-model="user.userName"
              class="w-full px-4 py-3 mt-1 bg-gray-700 text-white rounded focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              for="password"
              class="block text-sm font-medium text-gray-300"
            >
              Senha
            </label>
            <input
              type="password"
              id="password"
              v-model="user.password"
              autocomplete="current-password"
              required
              placeholder="Digite sua senha"
              class="w-full px-4 py-3 mt-1 bg-gray-700 text-white rounded focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>

          <Button
            :disabled="loading"
            type="submit"
            class="w-full px-4 py-3 font-semibold text-white flex justify-center items-center text-center bg-light-blue-700 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition duration-200"
          >
            <template v-if="loading">
              <ReloadIcon class="w-4 h-4 mr-2 animate-spin" />
              Carregando...
            </template>
            <template v-else> Entrar </template>
          </Button>
        </form>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
.background {
  background-image: url('../assets/img/bg-login.gif');
}
</style>
