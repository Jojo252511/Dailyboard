<template>
    <div class="board-widget">
        <h2 class="widget-title">Aktuelle Uhrzeit</h2>
        <div class="clock-display">
            {{ currentTime }}
        </div>
        <div class="date-display">
            {{ currentDate }}
        </div>

        <hr class="timer-divider">

        <div class="timer-section">
            <h3 class="timer-section-title">Timer</h3>
            <div class="timer-inputs" v-if="!isTimerRunning">
                <div class="input-group">
                    <label for="timerHours">Stunden:</label>
                    <input type="number" id="timerHours" class="time-input" v-model.number="timerHoursInput" min="0" max="23" :disabled="isTimerRunning && !isTimerPaused">
                </div>
                <div class="input-group">
                    <label for="timerMinutes">Minuten:</label>
                    <input type="number" id="timerMinutes" class="time-input" v-model.number="timerMinutesInput" min="0" max="59" :disabled="isTimerRunning && !isTimerPaused">
                </div>
                <div class="input-group">
                    <label for="timerSeconds">Sekunden:</label>
                    <input type="number" id="timerSeconds" class="time-input" v-model.number="timerSecondsInput" min="0" max="59" :disabled="isTimerRunning && !isTimerPaused">
                </div>
            </div>

            <div class="timer-controls">
                <button @click="handleTimerAction" class="button button-primary timer-button" :disabled="!canStartTimer && !isTimerRunning">
                    {{ timerButtonText }}
                </button>
                <button @click="resetTimer" class="button button-secondary timer-button" :disabled="!isTimerActive && !hasTimerInput">
                    Reset
                </button>
            </div>

            <div v-if="isTimerActive" class="timer-status">
                <p>Noch <span class="remaining-time">{{ formattedRemainingTime }}</span> übrig</p>
                <p v-if="timerEndTime">Endet um <span class="end-time">{{ formattedTimerEndTime }}</span></p>
            </div>
            <div v-else-if="timerFinishedMessage" class="timer-finished-message">
                {{ timerFinishedMessage }}
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';

// --- Uhrzeit und Datum ---
const currentTime = ref('00:00:00');
const currentDate = ref('Datum');
let clockIntervalId = null;

function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    currentTime.value = `${hours}:${minutes}:${seconds}`;

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    currentDate.value = now.toLocaleDateString('de-DE', options);
}

// --- Timer ---
const timerHoursInput = ref(0);
const timerMinutesInput = ref(0);
const timerSecondsInput = ref(0);

const timerRemainingSeconds = ref(0);
const timerEndTime = ref(null); // Speichert den Endzeitpunkt als Date-Objekt
const isTimerRunning = ref(false);
const isTimerPaused = ref(false);
const timerFinishedMessage = ref('');
let timerIntervalId = null;

const isTimerActive = computed(() => isTimerRunning.value || isTimerPaused.value);
const hasTimerInput = computed(() => timerHoursInput.value > 0 || timerMinutesInput.value > 0 || timerSecondsInput.value > 0);

const canStartTimer = computed(() => {
    const totalSeconds = (timerHoursInput.value || 0) * 3600 + (timerMinutesInput.value || 0) * 60 + (timerSecondsInput.value || 0);
    return totalSeconds > 0;
});

const timerButtonText = computed(() => {
    if (!isTimerRunning.value && !isTimerPaused.value) return 'Start';
    if (isTimerRunning.value && !isTimerPaused.value) return 'Pause';
    return 'Weiter'; // isTimerPaused.value is true
});

const formattedRemainingTime = computed(() => {
    if (timerRemainingSeconds.value < 0) return '00:00:00';
    const h = Math.floor(timerRemainingSeconds.value / 3600);
    const m = Math.floor((timerRemainingSeconds.value % 3600) / 60);
    const s = timerRemainingSeconds.value % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
});

const formattedTimerEndTime = computed(() => {
    if (!timerEndTime.value) return '00:00:00';
    const options = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
    return timerEndTime.value.toLocaleTimeString('de-DE', options);
});

function handleTimerAction() {
    timerFinishedMessage.value = ''; // Nachricht zurücksetzen
    if (!isTimerRunning.value && !isTimerPaused.value) { // Start
        startTimer();
    } else if (isTimerRunning.value && !isTimerPaused.value) { // Pause
        pauseTimer();
    } else { // Resume (isTimerPaused.value is true)
        resumeTimer();
    }
}

function startTimer() {
    const totalSeconds = (timerHoursInput.value || 0) * 3600 + (timerMinutesInput.value || 0) * 60 + (timerSecondsInput.value || 0);
    if (totalSeconds <= 0) {
        timerFinishedMessage.value = 'Bitte eine gültige Zeit eingeben.';
        return;
    }

    timerRemainingSeconds.value = totalSeconds;
    timerEndTime.value = new Date(Date.now() + totalSeconds * 1000);
    isTimerRunning.value = true;
    isTimerPaused.value = false;

    if (timerIntervalId) clearInterval(timerIntervalId);
    timerIntervalId = setInterval(tickTimer, 1000);
}

function pauseTimer() {
    if (timerIntervalId) clearInterval(timerIntervalId);
    isTimerPaused.value = true;
    // isTimerRunning bleibt true, um anzuzeigen, dass ein Timer aktiv ist (nur pausiert)
}

function resumeTimer() {
    if (!timerEndTime.value) return; // Sollte nicht passieren, wenn pausiert

    const now = Date.now();
    const remainingMs = timerEndTime.value.getTime() - now;
    if (remainingMs <= 0) {
        timerRemainingSeconds.value = 0;
        handleTimerEnd();
        return;
    }
    timerRemainingSeconds.value = Math.round(remainingMs / 1000);
    isTimerPaused.value = false;

    if (timerIntervalId) clearInterval(timerIntervalId);
    timerIntervalId = setInterval(tickTimer, 1000);
}

function resetTimer() {
    if (timerIntervalId) clearInterval(timerIntervalId);
    timerIntervalId = null;
    isTimerRunning.value = false;
    isTimerPaused.value = false;
    timerRemainingSeconds.value = 0;
    timerEndTime.value = null;
    timerHoursInput.value = 0;
    timerMinutesInput.value = 0;
    timerSecondsInput.value = 0;
    timerFinishedMessage.value = '';
}

function tickTimer() {
    if (timerRemainingSeconds.value > 0) {
        timerRemainingSeconds.value--;
    } else {
        handleTimerEnd();
    }
}

function handleTimerEnd() {
    if (timerIntervalId) clearInterval(timerIntervalId);
    timerIntervalId = null;
    isTimerRunning.value = false;
    isTimerPaused.value = false;
    timerRemainingSeconds.value = 0; // Sicherstellen, dass es nicht negativ wird
    // timerEndTime.value bleibt gesetzt, um die Endzeit anzuzeigen
    timerFinishedMessage.value = `Timer "${formatTime( (timerHoursInput.value || 0) * 3600 + (timerMinutesInput.value || 0) * 60 + (timerSecondsInput.value || 0) )}" ist abgelaufen!`;
    // Hier könnte man einen Sound abspielen oder eine Benachrichtigung zeigen
    // alert(`Timer "${formatTime( (timerHoursInput.value || 0) * 3600 + (timerMinutesInput.value || 0) * 60 + (timerSecondsInput.value || 0) )}" ist abgelaufen!`);
    // Inputs wieder freigeben, indem man sie nicht mehr disabled
    // Die Reset-Funktion setzt die Input-Werte zurück.
}

// Hilfsfunktion zum Formatieren einer Dauer für die Endnachricht
function formatTime(totalSeconds) {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}


// --- Lifecycle Hooks ---
onMounted(() => {
    updateClock();
    clockIntervalId = setInterval(updateClock, 1000);
});

onUnmounted(() => {
    if (clockIntervalId) clearInterval(clockIntervalId);
    if (timerIntervalId) clearInterval(timerIntervalId);
});

</script>

<style scoped>
/* Bestehende Styles für .clock-display und .date-display bleiben erhalten */
.clock-display {
    font-size: 3rem;
    font-weight: 700;
    text-align: center;
    color: #2563eb;
    line-height: 1.2;
}

.date-display {
    font-size: 1.125rem;
    text-align: center;
    color: #6b7280;
    margin-top: 0.5rem;
    margin-bottom: 1rem; /* Mehr Platz vor dem Trenner */
}

.timer-divider {
    border: 0;
    height: 1px;
    background-color: #e5e7eb; /* Tailwind border-gray-200 */
    margin: 1.5rem 0; /* Mehr Abstand */
}

.timer-section {
    margin-top: 1rem;
}

.timer-section-title {
    font-size: 1.125rem; /* Tailwind text-lg */
    font-weight: 600; /* semibold */
    margin-bottom: 1rem;
    text-align: center;
    color: #374151; /* Tailwind text-gray-700 */
}

.timer-inputs {
    display: flex;
    justify-content: space-around; /* Gleichmäßiger Abstand */
    align-items: flex-end; /* Labels und Inputs unten ausrichten */
    gap: 0.75rem; /* Abstand zwischen den Input-Gruppen */
    margin-bottom: 1.5rem;
}

.timer-inputs .input-group {
    display: flex;
    flex-direction: column;
    align-items: center; /* Zentriert Label über Input */
}

.timer-inputs label {
    font-size: 0.875rem; /* Tailwind text-sm */
    color: #4b5563; /* Tailwind text-gray-600 */
    margin-bottom: 0.25rem;
}

.time-input {
    /* Erbt von global .input-field, aber spezifische Anpassungen hier */
    width: 70px; /* Feste Breite für bessere Optik */
    padding: 0.5rem;
    text-align: center;
    font-size: 1rem;
    border-radius: 0.375rem;
    border: 1px solid #d1d5db;
}
/* Entfernt die Pfeile bei Number-Inputs in Webkit-Browsern (Chrome, Safari) */
.time-input::-webkit-outer-spin-button,
.time-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
/* Entfernt die Pfeile bei Number-Inputs in Firefox */
.time-input[type=number] {
  -moz-appearance: textfield;
}


.timer-controls {
    display: flex;
    justify-content: center;
    gap: 1rem; /* Abstand zwischen den Buttons */
    margin-bottom: 1.5rem;
}

.timer-button {
    /* Erbt von global .button, .button-primary, .button-secondary */
    width: auto; /* Lässt Buttons schrumpfen */
    min-width: 100px; /* Mindestbreite für bessere Klickbarkeit */
    padding: 0.6rem 1.2rem; /* Etwas größeres Padding */
}

.timer-status {
    text-align: center;
    color: #374151; /* Tailwind text-gray-700 */
}

.timer-status p {
    margin: 0.5rem 0;
    font-size: 1rem;
}

.remaining-time,
.end-time {
    font-weight: 600; /* semibold */
    color: #1d4ed8; /* Tailwind text-blue-700 */
}

.timer-finished-message {
    text-align: center;
    font-weight: 600;
    color: #16a34a; /* Tailwind green-600 */
    margin-top: 1rem;
    padding: 0.75rem;
    background-color: #f0fdf4; /* Tailwind green-50 */
    border: 1px solid #bbf7d0; /* Tailwind green-200 */
    border-radius: 0.375rem;
}
</style>