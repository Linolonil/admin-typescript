<template>
  <div>
    <h2>Salas Disponíveis para {{ selectedDate }}</h2>
    <button @click="fetchRooms">Buscar Salas</button>

    <div v-if="filteredRooms.length === 0">
      <p>Nenhuma sala disponível para este horário.</p>
    </div>

    <div v-else>
      <div v-for="(room, index) in filteredRooms" :key="index" class="room">
        <h3>Sala {{ room.number }}</h3>
        <ul>
          <li v-for="(isAvailable, hour) in room.hours" :key="hour">
            {{ hour }} - {{ isAvailable ? 'Disponível' : 'Indisponível' }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoomStore } from '@/stores/room';
import { onMounted, ref, watch } from 'vue';

const props = defineProps({
  filterHour: {
    type: String,
    required: true,
  },
});

const roomStore = useRoomStore();
const selectedDate = ref('2024-10-22');
const filteredRooms = ref([]); // Ref para salas filtradas

const fetchRooms = async () => {
  try {
    await roomStore.fetchRooms(selectedDate.value);
    filterRooms(); // Chama a função de filtragem após buscar as salas
  } catch (error) {
    console.error('Erro ao buscar salas:', error);
  }
};

// Função para filtrar as salas disponíveis com base no horário
const filterRooms = () => {
  filteredRooms.value = roomStore.availableRooms.value.filter(room => {
    return room.hours[props.filterHour]; // Verifica se a sala está disponível no horário filtrado
  });
};

// Observe a prop filterHour para atualizar as salas filtradas sempre que mudar
watch(
  () => props.filterHour,
  newValue => {
    console.log('Novo valor de filterHour:', newValue); // Log para ver o novo valor
    filterRooms(); // Filtra novamente com o novo valor
  },
);

// Logar o valor de filterHour no início
console.log('Valor inicial de filterHour:', props.filterHour);

onMounted(async () => {
  await fetchRooms();
});
</script>

<style scoped>
.room {
  border: 1px solid #ccc;
  padding: 10px;
  margin: 10px 0;
}
</style>
