import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,   
  timeout: 10_000,                     
  withCredentials: true        
});

/* ----- Optional interceptors (JWT, logging, etc.) ----------------------- */

api.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers['Authorization'] = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  res => res,
  err => {

    if (err.response?.status === 401) {
      // redirect to login, clear tokens, etc.
        localStorage.removeItem('accessToken'); 
    }
    return Promise.reject(err);
  }
);

export default api;
