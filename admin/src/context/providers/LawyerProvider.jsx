import { useState } from "react";
import { getLawyer, createUserLawyer } from "../../services/apiSchedules";

export const useLawyerProvider = () => {
  const [lawyer, setLawyer] = useState(null);
  const [lawyerFound, setLawyerFound] = useState(false);
  const [error, setError] = useState(null);

  const getLawyerByOab = async (oab) => {
    try {
      const response = await getLawyer(oab);
      setLawyer(response.lawyer);
      setLawyerFound(!!response.lawyer);
    } catch (error) {
      console.log(error);

      setError("Erro ao buscar advogado.");
    }
  };

  const createLawyer = async (name, oab, phoneNumber) => {
    try {
      await createUserLawyer(name, oab, phoneNumber);
    } catch (error) {
      console.log(error);

      setError("Erro ao criar advogado.");
    }
  };

  return {
    lawyer,
    lawyerFound,
    getLawyerByOab,
    createLawyer,
    error,
  };
};
