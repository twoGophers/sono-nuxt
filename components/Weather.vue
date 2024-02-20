<script>
import { useStore } from '../store/pinia';
import { computed } from 'vue';

export default {
  name: "Weather",
  setup() {
    const store = useStore();
    const weather = computed(() => store.weather);

    const groupedWeather = computed(() => {
      const grouped = {};
      if (weather.value && weather.value.list) {
        weather.value.list.forEach(data => {
          const date = new Date(data.dt_txt).toLocaleDateString();
          if (!grouped[date]) {
            grouped[date] = [];
          }
          grouped[date].push(data);
        });
      }
      return grouped;
    });

    const currentDate = new Date().toLocaleDateString();

    const getCurrentTemperature = (weatherData) => {
      if (weatherData.length > 0) {
        const temperatureInKelvin = weatherData[0].main.temp;
        const temperatureInCelsius = temperatureInKelvin - 273.15;
        const roundedTemperature = temperatureInCelsius.toFixed(1);
        return `${roundedTemperature}°C`;
      }
      return 'N/A';
    };

    const formatTime = (dateTimeString) => {
      const date = new Date(dateTimeString);
      const hours = date.getHours();
      const formattedHours = hours < 10 ? '0' + hours : hours;
      return formattedHours + ":00";
    };

    const getCurrentClouds = (weatherData) => {
      if (weatherData.length > 0) {
        return weatherData[0].clouds.all;
      }
      return 'N/A';
    };

    const getCurrentWindSpeed = (weatherData) => {
      if (weatherData.length > 0) {
        return weatherData[0].wind.speed;
      }
      return 'N/A';
    };

    const getWeatherIcon = (weatherData) => {
      if (weatherData.length > 0) {
        const iconCode = weatherData[0].weather[0].icon;
        const iconUrl = `http://openweathermap.org/img/wn/${iconCode}.png`;
        return iconUrl;
      }
      return null;
    };

    const getDayWeek = (day) => {
      const date = new Date(day);
      const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
      return dayOfWeek
    }

    const getAverageTemperature = (weatherData) => {
      if (weatherData.length > 0) {
        let sum = 0;
        weatherData.forEach(data => {
          sum += data.main.temp;
        });
        const averageTemperature = sum / weatherData.length;
        return `${(averageTemperature - 273.15).toFixed(1)}°C`;
      }
      return 'N/A';
    };

    return {
      weather,
      groupedWeather,
      currentDate,
      getCurrentTemperature,
      formatTime,
      getCurrentClouds,
      getCurrentWindSpeed,
      getWeatherIcon,
      getDayWeek,
      getAverageTemperature
    };
  },
};
</script>



<template>
  <div v-if="weather" class="mt-4 ">
    <h3 class="text-xl font-bold">{{ weather?.city.name }}</h3>
    <div v-for="(weatherData, day) in groupedWeather" :key="day">
      <div v-if="day === currentDate">
        <h4>{{ getDayWeek(weatherData[0].dt_txt) }} - {{ day }}</h4>
        <div class="flex justify-between">
          <div class="flex flex-row items-center">
            <h3 class="text-3xl font-bold text-gray-600 m-2">{{ getCurrentTemperature(weatherData) }}</h3>
            <div class="h-24 w-24">
              <img class="w-full h-full" :src="getWeatherIcon(weatherData)" alt="Weather Icon">
            </div>
          </div>
          <div>
            <div>
              <span>clouds </span>
              <span>{{ getCurrentClouds(weatherData) }}% </span>
            </div>
            <div>
              <span>wind </span>
              <span>{{ getCurrentWindSpeed(weatherData) }} m/s</span>
            </div>
          </div>
        </div>
        <ul class="flex flex-row">
          <li v-for="(data, index) in weatherData" :key="index">
            <div class="flex flex-col justify-center items-center p-2 m-2 rounded-md border bg-gray-200">
              <span>{{ formatTime(data.dt_txt) }}</span>
              <img :src="`http://openweathermap.org/img/wn/${data.weather[0].icon}.png`" :alt="`http://openweathermap.org/img/wn/${data.weather[0].icon}.png`">
              <span>{{ Math.round(data.main.temp - 273.15) }}°C</span>
            </div>
          </li>
        </ul>
      </div>
      <div v-else class="mt-4 p-4 bg-blue-100 rounded-md">
        <h4>{{ getDayWeek(weatherData[0].dt_txt) }} - {{ day }}</h4>
        <div>
          <p>Average Temperature: {{ getAverageTemperature(weatherData) }}</p>
          <img :src="getWeatherIcon(weatherData)" alt="Weather Icon">
        </div>
      </div>
    </div>
  </div>
</template>

