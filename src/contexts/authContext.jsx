// src/contexts/AuthContext.jsx
import {
    createContext,
    useContext,
    useState,
    useEffect,
  } from 'react';
  import api from '../utils/axiosInstance';
  
  const AuthContext = createContext(undefined);
  
  export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be inside <AuthProvider>');
    return context;
  };
  

  export const AuthProvider = ({ children }) => {
    const [user, setUser]   = useState(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      (async () => {
        try {
          const { data } = await api.get('/auth/me'); 
          setUser(data);
        } catch {
          setUser(null);
        } finally {
          setLoading(false);
        }
      })();
    }, []);
  
    const login = async (email, password) => {
      await api.post('/auth/login', { email, password });
      const { data } = await api.get('/auth/me');
      setUser(data);
    };
  
    const logout = async () => {
      await api.post('/auth/logout');
      setUser(null);
    };
  
    const value = { user, loading, login, logout };
  
    return (
      <AuthContext.Provider value={value}>
        {children}
      </AuthContext.Provider>
    );
  };
  