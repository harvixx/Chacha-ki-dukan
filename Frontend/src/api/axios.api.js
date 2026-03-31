import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL || "http://localhost:3000";

// Debugging ke liye (Browser console mein check kar lena)
console.log("🔗 API Base URL:", BASE_URL);

export const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Token Refresh Logic
    if (
      error.response?.status === 401 && 
      !originalRequest._retry &&
      !originalRequest.url.includes('refresh') // Check correct endpoint
    ) {
      originalRequest._retry = true;

      try {
        // ✅ Axios instance use karne ki jagah direct axios use karein refresh ke liye
        await axios.post(`${BASE_URL}/auth/refresh`, {}, {
          withCredentials: true 
        });
        
        return apiClient(originalRequest);
      } catch (refreshError) {
        const currentPath = window.location.pathname;
        if (currentPath !== '/login' && currentPath !== '/register') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const api = apiClient;

// API Calls
export const getSellers = async () => {
  const { data } = await apiClient.get('/game/sellers');
  return data.sellers;
};

export const getProducts = async (sellerId) => {
  const { data } = await apiClient.get(`/game/products/${sellerId}`);
  return data.products;
};

export const getLeaderboard = async () => {
  const { data } = await apiClient.get('/game/leaderboard');
  return data;
};

export const getUserStats = async () => {
  const { data } = await apiClient.get('/game/profile/stats');
  return data.stats;
};

// Asset URL Helper
export const getAssetUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  
  const cleanPath = path.replace(/^\/+/, ''); 
  // ✅ BACKEND_BASE_URL use karega images ke liye (localhost:3000)
  return `${BACKEND_BASE_URL}/${cleanPath}`;
};