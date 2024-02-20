<script>
import { useStore } from '../store/pinia';
import { ref } from 'vue';

export default {
  name: "Inputweather",
  setup() {
    const store = useStore();
    const config = useRuntimeConfig();
    const errorMessage = ref('');
    const myCity = computed(() => store.myCity);
    const city = ref(myCity || '');

    const fetchWeatherData = async () => {
      await store.getWeatherFromApi({ city: city.value, key: config.public.keyWeather });
    };

    const getGeolocation = () => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          position => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            getCityFromCoordinates(latitude, longitude);
          },
          error => {
            console.error('Error getting geolocation:', error.message);
            errorMessage.value = 'Error getting geolocation: ' + error.message;
          }
        );
      } else {
        console.error('Geolocation is not supported.');
        errorMessage.value = 'Geolocation is not supported.';
      }
    };

    const getCityFromCoordinates = async (latitude, longitude) => {
      await store.getPositionApi({ latitude, longitude });
    };

    const init = () => {
      getGeolocation();
    };

    onMounted(init);

    watch(myCity, (newValue) => {
      if (newValue) {
        fetchWeatherData();
      }
    });

    return {
      city,
      fetchWeatherData,
      getGeolocation,
      errorMessage,
      getCityFromCoordinates,
      myCity
    };
  }
};
</script>

<template>
  <div>
    <input v-model="city" @keyup.enter="fetchWeatherData" class="bg-gray-200 p-2 rounded-md focus:outline-none" placeholder="City" type="text" />
    <button @click="fetchWeatherData" class="text-white bg-blue-500 h-full ml-2 p-2 rounded-md hover:bg-blue-400">Show weather</button>
    <button @click="getGeolocation" class="text-white bg-green-500 h-full ml-2 p-2 rounded-md hover:bg-green-400">Get Geolocation</button>
    <p v-if="errorMessage" class="text-red-500">{{ errorMessage }}</p>
  </div>
</template>
