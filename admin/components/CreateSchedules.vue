<template>
  <div>
    <h2 class="text-2xl font-bold mb-4">Create Appointment</h2>

    <!-- Available Rooms -->
    <div class="mb-6">
      <h3 class="text-lg font-semibold mb-2">Available Rooms</h3>
      <ul class="grid grid-cols-3 gap-4">
        <li
          v-for="room in availableRooms"
          :key="room.id"
          @click="selectRoom(room)"
          :class="[
            'bg-white p-4 rounded-md shadow cursor-pointer transition-colors',
            selectedRoom?.id === room.id
              ? 'ring-2 ring-blue-500'
              : 'hover:bg-gray-50',
          ]"
        >
          {{ room.name }}
        </li>
      </ul>
    </div>

    <!-- Appointment Form -->
    <form
      @submit.prevent="createAppointment"
      class="bg-white p-6 rounded-md shadow"
    >
      <div class="mb-4">
        <label for="room" class="block text-sm font-medium text-gray-700"
          >Selected Room</label
        >
        <input
          type="text"
          id="room"
          :value="selectedRoom ? selectedRoom.name : 'No room selected'"
          readonly
          class="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        />
      </div>
      <div class="mb-4">
        <label for="oab" class="block text-sm font-medium text-gray-700"
          >OAB Number</label
        >
        <input
          v-model="appointmentForm.oab"
          type="text"
          id="oab"
          required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        />
      </div>
      <div class="mb-4">
        <label for="name" class="block text-sm font-medium text-gray-700"
          >Name</label
        >
        <input
          v-model="appointmentForm.name"
          type="text"
          id="name"
          required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        />
      </div>
      <div class="mb-4">
        <label for="phone" class="block text-sm font-medium text-gray-700"
          >Phone</label
        >
        <input
          v-model="appointmentForm.phone"
          type="tel"
          id="phone"
          required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        />
      </div>
      <button
        type="submit"
        :disabled="!selectedRoom"
        class="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Create Appointment
      </button>
    </form>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped></style>
