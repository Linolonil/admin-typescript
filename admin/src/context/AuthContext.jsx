import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Use useNavigate para redirecionar
import { PropTypes } from 'prop-types';
import api from './../services/api';
import { toast } from "react-toastify";
import axios from "axios";
import { login, register, validateTokenUser } from "../services/apiAuth";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadingStoreData = async () => {
      try {
        const storedUser = localStorage.getItem("@Auth:user");
        const token = localStorage.getItem("@Auth:token");
  
        if (token && storedUser) {
          const decoded = await validateTokenUser();
          
          if (decoded && decoded.valid) {
            setUser(JSON.parse(storedUser));
            api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            navigate("/admin");
          }
        }
      } catch (error) {
        console.error("Error validating token:", error);
      }
    };
  
    loadingStoreData();
  }, [navigate]);
  

  const SignIn = async ({ userName, password }) => {
    setLoading(true);
    try {
      const response = await login({
        userName,
        password,
      });
      if (response.data.accessToken) {
        localStorage.setItem("@Auth:user", JSON.stringify(response.data.user));
        localStorage.setItem("@Auth:token", response.data.accessToken);
        setUser(response.data.user);
        const userName = response.data.user.name;
        
        toast.success(`Bem-vindo, ${userName}!`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        
        navigate("/admin"); 
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Erro ao realizar login", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: true,
      });
      setLoading(false);
    }finally {
      setLoading(false);
    }
  };

  const SignOut = () => {
    localStorage.removeItem("@Auth:user");
    localStorage.removeItem("@Auth:token");
    setUser(null);
    toast.success("Logout realizado com sucesso!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    navigate("/login");
  };

  const CreateUser = async ({ name, role, password }) => {
    try {
      const response = await register({
        name,
        role,
        password,
      });
      toast.success("Usuário criado com sucesso!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return response.data;
    } catch (error) {
      console.error("Erro na criação do usuário", error);
      toast.error(error.response?.data?.message || "Erro ao criar usuário", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return error.response.data;
    }
  };

  const value = {
    user,
    signed: !!user,
    SignIn,
    SignOut,
    CreateUser,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
