import { defineStore } from 'pinia';
import axios from "axios"

export const useStore = defineStore('weather', {
  state: () => ({
    weather: null,
    myCity: null
  }),
  actions: {
    async getWeatherFromApi(params) {
      try {
        const { data } = await axios.post(`https://api.openweathermap.org/data/2.5/forecast?q=${params.city}&appid=${params.key}`);
        this.weather = data;
        console.log(data);
      } catch (error) {
        console.log( `Запрос на получение погоды не получен ${error.message}`);
      }
    },
    async getPositionApi(params) {
      try {
        const { data } = await axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${params.latitude}&lon=${params.longitude}&format=json`);
        this.myCity = data.address.town;
      } catch (error) {
        console.log( `Запрос на получение геопозиции не получен ${error.message}`);
      }
    },
  },
});
