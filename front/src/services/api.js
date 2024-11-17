import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:5000', // URL do Flask
});

export const searchArticles = async (query) => {
  try {
    const response = await api.post("/search", { query });
    return response.data; // Retorna os resultados formatados
  } catch (error) {
    console.error("Error fetching articles:", error.response || error.message);
    return null; 
  }
};

export default api;
