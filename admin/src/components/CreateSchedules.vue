<template>
  <div>
    <h2 class="text-2xl font-bold mb-4">Criar Agendamento</h2>
    <!-- Available Rooms -->

    <FetchRooms :filterHour="selectedHour" />

    <!-- Appointment Form -->
    <!--  -->
    <form
      @submit.prevent="createAppointment"
      class="bg-white p-6 rounded-md shadow"
    >
      <div class="mb-4">
        <label
          for="appointmentType"
          class="block text-sm font-medium text-gray-700"
          >Tipo de Agendamento</label
        >
        <select
          id="appointmentType"
          v-model="appointmentForm.type"
          @change="onTypeChange"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        >
          <option value="" disabled selected>
            Selecione o tipo de agendamento
          </option>
          <option value="meeting">Reunião</option>
          <option value="hearing">Audiência</option>
        </select>
      </div>
      <div class="flex gap-20">
        <div class="mb-4">
          <label for="date" class="block text-sm font-medium text-gray-700"
            >Data do Agendamento</label
          >
          <select
            id="appointmentType"
            v-model="appointmentForm.type"
            @change="onTypeChange"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          >
            <option value="" disabled selected>
              Selecione o tipo de agendamento
            </option>
            <option value="meeting">Reunião</option>
            <option value="hearing">Audiência</option>
          </select>
        </div>
        <div class="mb-4">
          <label for="time" class="block text-sm font-medium text-gray-700"
            >Hora do Agendamento</label
          >
          <input
            v-model="appointmentForm.time"
            type="time"
            id="time"
            required
            :min="minTime"
            :max="maxTime"
            step="1800"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
        </div>
      </div>
      <div class="mb-4">
        <label for="oab" class="block text-sm font-medium text-gray-700"
          >Número OAB</label
        >
        <input
          v-model="appointmentForm.oab"
          type="text"
          id="oab"
          required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        />
      </div>

      <button
        type="submit"
        :disabled="!isFormValid"
        class="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Criar agendamento
      </button>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue';
import FetchRooms from './fetchRooms.vue';

const selectedHour = ref('08:00'); // Defina um horário inicial

const selectedRoom = ref(null);

const appointmentForm = reactive({
  oab: '',
  name: '',
  phone: '',
  date: '',
  time: '',
  type: '', // Adiciona o tipo ao formulário
});

const isFormValid = computed(() => {
  return (
    selectedRoom.value &&
    appointmentForm.oab &&
    appointmentForm.name &&
    appointmentForm.phone &&
    appointmentForm.date &&
    appointmentForm.time &&
    isDateTimeValid()
  );
});

const isDateTimeValid = () => {
  if (!appointmentForm.date || !appointmentForm.time) return false;

  const appointmentDateTime = new Date(
    `${appointmentForm.date}T${appointmentForm.time}`,
  );
  const now = new Date();

  // Verifica se a data e hora do agendamento é no futuro
  if (appointmentDateTime <= now) return false;

  // Verifica se a hora está dentro do horário de funcionamento (9h às 18h)
  const hour = appointmentDateTime.getHours();
  if (hour < 9 || hour >= 18) return false;

  // Verifica se o agendamento é em intervalos de 30 minutos
  const minutes = appointmentDateTime.getMinutes();
  if (minutes % 30 !== 0) return false;

  return true;
};

// Função para atualizar as salas disponíveis com base no tipo selecionado
const onTypeChange = () => {
  if (appointmentForm.type === 'meeting') {
    roomStore.availableRooms = roomStore.allRooms.filter(
      room =>
        !isRoomOccupied(
          room.id,
          appointmentForm.date,
          appointmentForm.time,
          'meeting',
        ),
    );
  } else if (appointmentForm.type === 'hearing') {
    roomStore.availableRooms = roomStore.allRooms.filter(
      room =>
        !isRoomOccupied(
          room.id,
          appointmentForm.date,
          appointmentForm.time,
          'hearing',
        ),
    );
  }
};

const isRoomOccupied = (roomId, date, time, type) => {
  const startDateTime = new Date(`${date}T${time}`);
  let endDateTime;

  if (type === 'hearing') {
    endDateTime = new Date(startDateTime.getTime() + 3 * 60 * 60 * 1000); // 3 horas
  } else if (type === 'meeting') {
    endDateTime = new Date(startDateTime.getTime() + 1 * 60 * 60 * 1000); // 1 hora
  }

  return roomStore.scheduledAppointments.some(appointment => {
    const appointmentStartTime = new Date(appointment.startTime);
    const appointmentEndTime = new Date(appointment.endTime);

    // Verifica se há sobreposição de horários
    return (
      appointment.roomId === roomId &&
      ((startDateTime >= appointmentStartTime &&
        startDateTime < appointmentEndTime) ||
        (endDateTime > appointmentStartTime &&
          endDateTime <= appointmentEndTime) ||
        (startDateTime <= appointmentStartTime &&
          endDateTime >= appointmentEndTime))
    );
  });
};

const createAppointment = () => {
  if (!isFormValid.value) {
    alert('Por favor, preencha todos os campos corretamente.');
    return;
  }

  // Aqui você enviaria os dados do agendamento para o backend
  console.log('Agendamento criado:', {
    ...appointmentForm,
    room: selectedRoom.value,
  });

  // Resetar o formulário após o envio
  appointmentForm.oab = '';
  appointmentForm.name = '';
  appointmentForm.phone = '';
  appointmentForm.date = '';
  appointmentForm.time = '';
  appointmentForm.type = ''; // Resetar o tipo
  selectedRoom.value = null;

  // Você pode querer mostrar uma mensagem de sucesso ou redirecionar o usuário
};
</script>
