import axios from 'axios';

export const authApi = axios.create({
  baseURL: 'http://18.142.227.149:3000',
  timeout: 10_000,
});

const api = axios.create({
  baseURL: 'http://18.142.227.149:3000',
  timeout: 10_000,
});

api.interceptors.request.use(config => {
  const token = sessionStorage.getItem('accessToken');

  if (
    token &&
    config.url !== '/auth/login' &&
    config.url !== '/auth/register'
  ) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    const ignoredPaths = ['/auth/login', '/auth/register'];
    const requestUrl = err.config?.url || '';

    const shouldIgnore = ignoredPaths.some(path => requestUrl.includes(path));

    if (!shouldIgnore && err.response?.status === 401) {
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('user');
      window.location.href = '/';
    }

    return Promise.reject(err);
  }
);


export default api;
