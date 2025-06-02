<template>
    <div class="board-widget">
        <h2 class="widget-title">Aktuelle Uhrzeit</h2>
        <div class="clock-display">
            {{ currentTime }}
        </div>
        <div class="date-display">
            {{ currentDate }}
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const currentTime = ref('00:00:00');
const currentDate = ref('Datum');
let intervalId = null;

function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    currentTime.value = `${hours}:${minutes}:${seconds}`;

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    currentDate.value = now.toLocaleDateString('de-DE', options);
}

onMounted(() => {
    updateClock(); // Sofort aktualisieren beim Laden
    intervalId = setInterval(updateClock, 1000); // Jede Sekunde aktualisieren
});

onUnmounted(() => {
    if (intervalId) {
        clearInterval(intervalId); // Interval löschen, um Speicherlecks zu vermeiden
    }
});
</script>

<style scoped>
.clock-display {
    font-size: 3rem;    /* Entspricht Tailwind text-5xl, ggf. anpassen */
    font-weight: 700; /* bold */
    text-align: center;
    color: #2563eb;   /* Blauer Farbton, Tailwind text-blue-600 */
    line-height: 1.2;
}

.date-display {
    font-size: 1.125rem; /* Entspricht Tailwind text-lg */
    text-align: center;
    color: #6b7280;    /* Tailwind text-gray-500 */
    margin-top: 0.5rem; /* Tailwind mt-2 */
}
</style>