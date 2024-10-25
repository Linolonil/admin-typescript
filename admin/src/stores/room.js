import { defineStore } from 'pinia';
import { ref } from 'vue'; // Importe ref para usar em sua store
import api from '@/service/api';

export const useRoomStore = defineStore('room', () => {
  const availableRooms = ref([]); // Certifique-se de que seja uma ref

  const fetchRooms = async date => {
    try {
      const response = await api.post('/room/getAvailableRooms', {
        date,
      });
      availableRooms.value = response.data; // Atribua o valor corretamente
    } catch (error) {
      console.error('Erro ao buscar as salas disponíveis:', error);
    }
  };

  return { availableRooms, fetchRooms }; // Retorne a referência reativa
});
