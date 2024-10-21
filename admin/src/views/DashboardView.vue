<script setup>
import { computed, ref } from 'vue'; // Importando ref para criar variáveis reativas
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Info, LogOut, NotebookPen, Table } from 'lucide-vue-next';
import router from '@/router';
import { useAuthStore } from '@/stores/auth';
import defaultAvatar from '@/assets/icon/default.png';
import ProfileComponent from '@/components/ProfileComponent.vue';
import CreateSchedules from '@/components/schedules/CreateSchedules.vue';
import ViewSchedules from '@/components/ViewSchedules.vue';
import ViewSchedulesStatus from '@/components/ViewSchedulesStatus.vue';

const activeSectionComponent = computed(() => {
  switch (activeSection.value) {
    case 'profile':
      return ProfileComponent;
    case 'create-schedule':
      return CreateSchedules;
    case 'view-schedules':
      return ViewSchedules;
    case 'view-schedules-status':
      return ViewSchedulesStatus;
    default:
      return CreateSchedules;
  }
});
const auth = useAuthStore();
const iconProfile =
  auth?.user?.iconProfile === '' ? defaultAvatar : auth.user.iconProfile;

const activeSection = ref('view-schedules'); // Defina a seção padrão que será exibida

const logout = () => {
  auth.logout();
  router.push({ name: 'login' });
};
</script>

<template>
  <div class="h-full w-full pl-[56px]">
    <!-- menu -->
    <aside class="inset-y fixed left-0 z-20 flex h-full flex-col border-r">
      <div class="p-2">
        <Avatar>
          <AvatarImage :src="`${iconProfile}`" alt="avatar" />
        </Avatar>
      </div>
      <nav class="grid gap-1 p-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger as-child>
              <Button
                variant="ghost"
                size="icon"
                class="rounded-lg"
                aria-label="Criar Agendamento"
                @click="activeSection = 'create-schedule'"
              >
                <NotebookPen class="size-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" :side-offset="5">
              Criar Agendamento
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger as-child>
              <Button
                variant="ghost"
                size="icon"
                class="rounded-lg"
                aria-label="Buscar Agendamentos"
                @click="activeSection = 'view-schedules'"
              >
                <Table class="size-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" :side-offset="5">
              Buscar Agendamentos
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger as-child>
              <Button
                variant="ghost"
                size="icon"
                class="rounded-lg"
                aria-label="Perfil"
                @click="activeSection = 'profile'"
              >
                <Info class="size-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" :side-offset="5">
              Informações
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </nav>
      <nav class="mt-auto grid gap-1 p-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger as-child>
              <Button
                variant="ghost"
                size="icon"
                class="mt-auto rounded-lg"
                aria-label="Sair"
                @click="logout()"
              >
                <LogOut class="size-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" :side-offset="5">
              Sair
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </nav>
    </aside>

    <!-- main -->
    <div class="flex flex-col">
      <div>
        <!-- Renderiza apenas o componente da seção ativa -->
        <component :is="activeSectionComponent" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
