import { useState, useEffect } from "react";
import { fetchAllRooms, changeRoom } from "../../services/apiSchedules";

export const useRoomProvider = () => {
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchRooms = async () => {
    try {
      const token = localStorage.getItem("@Auth:token");
      const response = await fetchAllRooms(token);
      setRooms(response.rooms || []);
    } catch (error) {
        console.log(error);
      setError("Erro ao buscar as salas.");
    } finally {
      setLoading(false);
    }
  };

  const changeRoomState = async (roomId, settings) => {
    try {
      const status = await changeRoom(roomId, settings);
      if (status === 200) fetchRooms();
    } catch (error) {
        console.log(error);
      setError("Erro ao atualizar sala.");
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  return { rooms, fetchRooms, changeRoomState, loading, error };
};
