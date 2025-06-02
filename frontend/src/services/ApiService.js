import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL, // Für Vite
    // baseURL: process.env.VUE_APP_API_BASE_URL, // Für Vue CLI
    headers: {
        'Content-Type': 'application/json',
    },
});

export default {
    getWeather(city) {
        return apiClient.get(`/weather/${city}`);
    },
};