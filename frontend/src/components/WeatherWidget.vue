<template>
    <div class="board-widget">
        <h2 class="widget-title">Wetter</h2>
        <div class="weather-input-section">
            <input type="text" v-model="city" @keyup.enter="fetchWeatherData" class="input-field"
                placeholder="Stadt eingeben (z.B. Berlin)" />
            <button @click="fetchWeatherData" class="button button-primary" :disabled="loading">
                {{ loading ? 'Lädt...' : 'Wetter abrufen' }}
            </button>
        </div>

        <div v-if="userMessage"
            :class="['message-box', messageType === 'error' ? 'message-box-error' : 'message-box-info']" role="alert">
            {{ userMessage }}
        </div>

        <div v-if="weatherData && !loading && !userMessage" class="weather-info">
            <p class="weather-city">{{ weatherData.name }}</p>
            <div class="weather-details">
                <img v-if="weatherData.weather && weatherData.weather[0]"
                    :src="`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`"
                    :alt="weatherData.weather[0].description" class="weather-icon">
                <p class="weather-temp">{{ Math.round(weatherData.main.temp) }}°C</p>
            </div>
            <p v-if="weatherData.weather && weatherData.weather[0]" class="weather-desc">
                {{ weatherData.weather[0].description.charAt(0).toUpperCase() +
                    weatherData.weather[0].description.slice(1) }}
            </p>
            <p v-if="weatherData.main && weatherData.main.humidity" class="weather-humidity">
                Luftfeuchtigkeit: {{ weatherData.main.humidity }}%
            </p>
        </div>

        <div v-else-if="!weatherData && !loading && !userMessage" class="weather-placeholder">
            Gib eine Stadt ein, um das Wetter anzuzeigen.
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import ApiService from '@/services/ApiService'; // Sicherstellen, dass der Pfad korrekt ist

// --- Reaktive Variablen ---
const city = ref('Berlin'); // Standardstadt oder leer lassen, falls gewünscht
const weatherData = ref(null);
const loading = ref(false);
const userMessage = ref('');   // Für alle Nutzer-Nachrichten (Fehler, Info)
const messageType = ref('info'); // 'info' oder 'error' für die Styling-Klasse der Box

// --- Methoden ---
function loadLocation() {
    const storedWeather = localStorage.getItem('dailyBoardWeather-vue');
    if (storedWeather) {
        city.value = storedWeather;
    }
}

function saveLocation() {
    localStorage.setItem('dailyBoardWeather-vue', city.value.trim());
}

// --- Methoden ---
async function fetchWeatherData() {
    if (!city.value.trim()) {
        userMessage.value = "Bitte gib eine Stadt ein.";
        messageType.value = 'error';
        weatherData.value = null; // Alte Wetterdaten entfernen
        return;
    }

    loading.value = true;
    userMessage.value = ''; // Wichtig: Nachricht vor jedem neuen Versuch zurücksetzen
    weatherData.value = null; // Alte Wetterdaten entfernen

    try {
        const response = await ApiService.getWeather(city.value.trim());
        // Überprüfen, ob die Antwort gültige Daten enthält
        if (response.data && response.data.name && response.data.main) {
            weatherData.value = response.data;
          
        } else {
            // Fall, dass die API zwar antwortet, aber keine sinnvollen Daten liefert
            userMessage.value = `Keine gültigen Wetterdaten für "${city.value}" erhalten.`;
            messageType.value = 'error';
            console.warn("Ungültige Wetterdaten empfangen:", response.data);
        }
    } catch (err) {
        console.error("Fehler beim Abrufen der Wetterdaten vom Backend:", err);
        weatherData.value = null; // Sicherstellen, dass keine alten Daten angezeigt werden
        messageType.value = 'error'; // Standardmäßig als Fehler behandeln

        if (err.code === 'ERR_NETWORK' || err.message.toLowerCase().includes('network error')) {
            userMessage.value = "Backend nicht erreichbar. Bitte überprüfe deine Internetverbindung oder den Serverstatus.";
        } else if (err.response && err.response.data && err.response.data.message) {
            // Fehler vom Backend (z.B. Stadt nicht gefunden, API-Key-Problem im Backend)
            userMessage.value = err.response.data.message;
        } else if (err.response && err.response.status) {
            // Allgemeiner HTTP-Fehler
            userMessage.value = `Fehler vom Server: ${err.response.status} ${err.response.statusText}`;
        }
        else {
            userMessage.value = `Ein unbekannter Fehler ist aufgetreten beim Abrufen der Wetterdaten für "${city.value}".`;
        }
    } finally {
        loading.value = false;
        saveLocation();
    }
}

// --- Lifecycle Hooks ---
onMounted(() => {
    loadLocation();
    // Wenn city.value leer ist, wird nichts passieren, bis der Nutzer eine Eingabe macht.

    if (city.value.trim()) { // Nur wenn eine Default-Stadt gesetzt ist
        fetchWeatherData();
    } else if (!userMessage.value) { // Nur wenn noch keine andere Nachricht (z.B. von einem vorherigen Fehler) da ist
        userMessage.value = "Gib eine Stadt ein, um das Wetter anzuzeigen.";
        messageType.value = 'info';
    }
});
</script>

<style scoped>
/* Die Styles aus der vorherigen Antwort für WeatherWidget.vue sollten hier weiterhin passen.
   Wichtig sind .message-box, .message-box-error, .message-box-info,
   die global oder hier definiert sein müssen.
   Ich füge sie hier nochmal zur Sicherheit ein, falls du sie nur hier brauchst: */

.weather-input-section .input-field {
    margin-bottom: 0.75rem;
}

.weather-info {
    text-align: center;
    margin-top: 1rem;
}

.weather-city {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
}

.weather-details {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0.5rem 0;
}

.weather-icon {
    width: 4rem;
    height: 4rem;
    margin-right: 0.5rem;
}

.weather-temp {
    font-size: 2.25rem;
    font-weight: 700;
    line-height: 1;
}

.weather-desc {
    margin-top: 0.5rem;
    margin-bottom: 0.25rem;
}

.weather-humidity {
    font-size: 0.875rem;
    color: #4b5563;
}

.weather-placeholder {
    text-align: center;
    color: #6b7280;
    margin-top: 1rem;
    padding: 0.5rem;
    /* Etwas Padding, damit es nicht so gequetscht aussieht */
}

/* Diese Klassen sollten global in main.css sein, aber zur Sicherheit auch hier: */
.message-box {
    padding: 1rem;
    border-radius: 0.375rem;
    /* rounded-md */
    margin-top: 1rem;
    /* Abstand nach oben */
    margin-bottom: 1rem;
    font-size: 0.875rem;
    /* text-sm */
    border: 1px solid transparent;
    text-align: center;
    /* Zentriert den Text in der Box */
}

.message-box-error {
    background-color: #fee2e2;
    /* bg-red-100 */
    color: #b91c1c;
    /* text-red-700 */
    border-color: #fecaca;
    /* border-red-300 */
}

.message-box-info {
    background-color: #dbeafe;
    /* bg-blue-100 */
    color: #1e40af;
    /* text-blue-700 */
    border-color: #bfdbfe;
    /* border-blue-300 */
}
</style>