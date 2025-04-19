import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Додає токен авторизації до всіх запитів
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

export const login = (email, password) => api.post("/accounts/login/", { email, password });
export const register = (data) => api.post("/accounts/register/", data);
export const getProfile = (userId) => api.get(`/accounts/profile/${userId}/`);
export const getChats = () => api.get("/chat/chats/");
export const getMessages = (chatId) => api.get(`/chat/messages/${chatId}/`);
export const sendMessageToChat = (chat, sender, content) => api.post(`/chat/message/send/`, { chat, sender, content });

export default api;