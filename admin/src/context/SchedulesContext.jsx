import PropTypes from "prop-types";
import { createContext, useState } from "react";
import { useRoomProvider } from "./providers/RoomProvider";
import { useScheduleProvider } from "./providers/ScheduleProvider";
import { useLawyerProvider } from "./providers/LawyerProvider";

export const ScheduleContext = createContext(); // Exportação nomeada do contexto

export const ScheduleProvider = ({ children }) => { // Exportação do ScheduleProvider
  const [schedules, setSchedules] = useState([]);
  const [date, setDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [lawyer, setLawyer] = useState(null);
  const [horario, setHorario] = useState("8:00");
  const [typeSchedule, setTypeSchedule] = useState("meeting");

  const {rooms, fetchRooms, changeRoomState } = useRoomProvider();
  const { fetchSchedules, createSchedule, deleteSchedule, confirmSchedule, updateDate, selectedDate } = useScheduleProvider(setSchedules, setDate, setLoading);
  const { lawyerFound,createLawyer, getLawyerByOab } = useLawyerProvider( setLoading);

  const contextValue = {
    loading,
    rooms,
    date,
    fetchRooms,
    changeRoomState,
    horario,
    typeSchedule,
    schedules,
    fetchSchedules,
    createSchedule,
    deleteSchedule,
    confirmSchedule,
    updateDate,
    selectedDate,
    lawyer,
    lawyerFound,
    createLawyer,
    getLawyerByOab,
    setHorario,
    setTypeSchedule,
    setLawyer,
  };

  return (
    <ScheduleContext.Provider value={contextValue}>
      {children}
    </ScheduleContext.Provider>
  );
};

ScheduleProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
