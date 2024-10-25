import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/service/api';

export const useLawyerStore = defineStore('lawyer', () => {
  const availableLawyer = ref([]);

  const fetchLawyer = async oab => {
    try {
      const response = await api.get(`/lawyer/getLawyerByOab/${oab}`);
      availableLawyer.value = response.data;
    } catch (error) {
      console.error('Erro ao buscar advogados:', error);
    }
  };

  return { availableLawyer, fetchLawyer };
});
