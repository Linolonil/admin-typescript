import { useState, useEffect } from "react";
import {
  fetchAllSchedules,
  createNewSchedule,
  deleteScheduleById,
  confirmScheduleNow,
} from "../../services/apiSchedules";

export const useScheduleProvider = () => {
  const [schedules, setSchedules] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchSchedules = async (date) => {
    try {
      const token = localStorage.getItem("@Auth:token");
      const response = await fetchAllSchedules(date, token);
      setSchedules(response.schedules || []);
    } catch (error) {
      console.log(error);
      setError("Erro ao buscar agendamentos.");
    } finally {
      setLoading(false);
    }
  };

  const createSchedule = async (scheduleData) => {
    try {
      await createNewSchedule(scheduleData);
      fetchSchedules(selectedDate);
    } catch (error) {
      console.log(error);

      setError("Erro ao criar agendamento.");
    }
  };

  const deleteSchedule = async (scheduleId) => {
    try {
      await deleteScheduleById(scheduleId);
      fetchSchedules(selectedDate);
    } catch (error) {
      console.log(error);

      setError("Erro ao excluir agendamento.");
    }
  };

  const confirmSchedule = async (scheduleId) => {
    try {
      await confirmScheduleNow(scheduleId);
      fetchSchedules(selectedDate);
    } catch (error) {
      console.log(error);

      setError("Erro ao confirmar agendamento.");
    }
  };

  const updateDate = (newDate) => setSelectedDate(newDate);

  useEffect(() => {
    fetchSchedules(selectedDate);
  }, [selectedDate]);

  return {
    schedules,
    fetchSchedules,
    createSchedule,
    deleteSchedule,
    confirmSchedule,
    updateDate,
    selectedDate,
    error,
    loading,
  };
};
