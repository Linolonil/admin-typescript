<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Aside Navigation -->
    <aside
      :class="[
        'transition-all duration-300 ease-in-out bg-white shadow-md flex flex-col',
        isMenuCollapsed ? 'w-24' : 'w-48',
      ]"
    >
      <!-- Logo -->
      <div class="p-4 flex justify-center">
        <img
          v-if="!isMenuCollapsed"
          :src="logoCaaam"
          alt="Logo"
          class="h-16 w-full"
        />
        <img
          v-else
          :src="logoCaaam2"
          alt="Logo"
          class="h-10 w-full object-contain"
        />
      </div>

      <!-- User Avatar -->
      <div class="p-4 flex flex-col items-center">
        <img
          :src="imgUser"
          alt="User Avatar"
          class="max-w-20 max-h-12 w-auto h-auto rounded-full"
        />

        <span
          v-if="!isMenuCollapsed"
          class="mt-2 text-sm font-medium text-gray-700"
          >{{ fullName }}</span
        >
      </div>

      <!-- Navigation Items -->
      <nav class="flex-grow p-2">
        <ul class="space-y-2">
          <li v-for="item in navItems" :key="item.id">
            <a
              @click="currentView = item.id"
              :class="[
                'flex items-center rounded-md cursor-pointer transition-colors p-2',
                currentView === item.id
                  ? 'bg-blue-500 text-white'
                  : 'hover:bg-gray-100 text-gray-700',
                isMenuCollapsed ? 'justify-center' : 'px-4',
              ]"
            >
              <component :is="item.icon" :size="20" />
              <span v-if="!isMenuCollapsed" class="ml-3">{{ item.title }}</span>
            </a>
          </li>
        </ul>
      </nav>

      <!-- Logout Option -->
      <div class="p-4">
        <button
          @click="logout"
          :class="[
            'flex items-center rounded-md cursor-pointer transition-colors p-2 w-full',
            'hover:bg-red-100 text-red-600',
            isMenuCollapsed ? 'justify-center' : 'px-4',
          ]"
        >
          <LogOut :size="20" />
          <span v-if="!isMenuCollapsed" class="ml-3">Logout</span>
        </button>
      </div>

      <!-- Toggle Menu Button -->
      <button
        @click="toggleMenu"
        class="p-2 m-2 bg-gray-200 rounded-full hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 self-center"
      >
        <component
          :is="isMenuCollapsed ? 'ChevronRight' : 'ChevronLeft'"
          :size="20"
        />
      </button>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 p-8 overflow-y-auto">
      <div v-if="currentView === 'create'">
        <CreateSchedules />
      </div>
      <div v-else-if="currentView === 'view'">
        <h2 class="text-2xl font-bold mb-4">View Appointments</h2>
        <!-- Add content for viewing appointments -->
      </div>
      <div v-else-if="currentView === 'Info'">
        <h2 class="text-2xl font-bold mb-4">Settings</h2>
        <!-- Add content for settings -->
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Calendar, Info, LogOut } from 'lucide-vue-next';
import logoCaaam from '@/assets/img/logocaaam.png';
import logoCaaam2 from '@/assets/img/oab-logo-1.png';
import { useAuthStore } from '@/stores/auth';
import router from '@/router';
const auth = useAuthStore();

const fullName = computed(() => auth.fullName);

import defaultIcon from '@/assets/icon/default.png';
import CreateSchedules from '@/components/CreateSchedules.vue';

const imgUser = computed(() =>
  auth.user?.iconProfile === '' ? defaultIcon : auth.user?.iconProfile,
);

console.log;

const navItems = [
  { id: 'create', title: 'Criar ', icon: Calendar },
  { id: 'view', title: 'Busca ', icon: Calendar },
  { id: 'Info', title: 'Info', icon: Info },
];

const currentView = ref('create');
const isMenuCollapsed = ref(false); 


// const createAppointment = () => {
//   if (!selectedRoom.value) {
//     alert('Please select a room before creating an appointment.');
//     return;
//   }
//   // Here you would typically send the form data to your backend
//   console.log('Appointment created:', {
//     ...appointmentForm,
//     room: selectedRoom.value,
//   });
//   // Reset the form after submission
//   appointmentForm.oab = '';
//   appointmentForm.name = '';
//   appointmentForm.phone = '';
//   selectedRoom.value = null;
//   // You might want to show a success message or redirect the user
// };

const toggleMenu = () => {
  isMenuCollapsed.value = !isMenuCollapsed.value;
};

const logout = () => {
  auth.logout();
  router.push({ name: 'login' });
};
</script>

<style scoped>
.img {
  background-position: center;
  background-size: cover;
  background-clip: border-box;
}
</style>
