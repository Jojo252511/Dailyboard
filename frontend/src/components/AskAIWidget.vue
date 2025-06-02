<template>
    <div class="board-widget">
        <div class="ask-ai-widget"> <h2 class="widget-title">Frage die KI</h2>
            <div class="input-group">
                <input
                    v-model="question"
                    @keyup.enter="askAI"
                    class="input-field"
                    placeholder="Stelle eine Frage an die KI..."
                    :disabled="loading"
                />
                <button @click="askAI" class="button button-primary" :disabled="loading || !question.trim()">
                    {{ loading ? 'Denkt nach...' : 'Frage stellen' }}
                </button>
            </div>

            <div v-if="userMessage"
                 :class="['message-box', messageType === 'error' ? 'message-box-error' : 'message-box-info']"
                 role="alert">
                {{ userMessage }}
            </div>

            <div v-if="answer && !loading && !userMessage" class="answer-box">
                <h3 class="answer-title">Antwort der KI:</h3>
                <div class="answer-text" v-html="formattedAnswer"></div>
            </div>

            <div v-else-if="!answer && !loading && !userMessage" class="placeholder-text">
                Stelle eine Frage, um eine Antwort von der KI zu erhalten.
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import ApiService from '@/services/ApiService'; // Pfad ggf. anpassen

// --- Reaktive Variablen ---
const question = ref('');
const answer = ref('');
const loading = ref(false);
const userMessage = ref('');
const messageType = ref('info'); // 'info' oder 'error'

// --- Computed Property für formatierte Antwort (z.B. \n zu <br>) ---
const formattedAnswer = computed(() => {
    if (answer.value) {
        // Ersetze Newlines durch <br> Tags für HTML-Rendering
        return answer.value.replace(/\n/g, '<br>');
    }
    return '';
});

// --- Methoden ---
async function askAI() {
    if (!question.value.trim()) {
        userMessage.value = "Bitte gib zuerst eine Frage ein.";
        messageType.value = 'error';
        answer.value = ''; // Alte Antwort löschen
        return;
    }

    loading.value = true;
    userMessage.value = ''; // Alte Nachrichten löschen
    answer.value = '';    // Alte Antwort löschen

    try {
        const response = await ApiService.askAI(question.value.trim());
        if (response.data && response.data.answer) {
            answer.value = response.data.answer;
        } else {
            answer.value = "Die KI hat keine verwertbare Antwort geliefert.";
            // Optional: userMessage setzen, wenn die Antwortstruktur unerwartet ist
            // userMessage.value = "Unerwartete Antwortstruktur von der KI.";
            // messageType.value = 'error';
        }
    } catch (error) {
        console.error("Fehler beim Senden der Frage an die KI:", error);
        answer.value = ''; // Antwort bei Fehler löschen
        if (error.response && error.response.data && error.response.data.message) {
            userMessage.value = error.response.data.message;
        } else if (error.message.includes('Network Error')) {
            userMessage.value = "Netzwerkfehler. Das Backend ist nicht erreichbar.";
        } else {
            userMessage.value = "Ein unbekannter Fehler ist aufgetreten.";
        }
        messageType.value = 'error';
    } finally {
        loading.value = false;
        // question.value = ''; // Optional: Fragefeld nach Absenden leeren
    }
}
</script>

<style scoped>
/* Globale Klassen .board-widget, .widget-title, .input-field, .button, .button-primary,
   .message-box, .message-box-error, .message-box-info werden aus main.css erwartet. */

.ask-ai-widget {
    /* Spezifisches Styling für dieses Widget, falls nötig */
}

.input-group {
    display: flex;
    flex-direction: column; /* Standardmäßig untereinander für kleinere Bildschirme */
    gap: 0.75rem; /* Abstand zwischen Input und Button */
    margin-bottom: 1rem;
}

.input-group .input-field {
    margin-bottom: 0; /* Entferne Standard-Margin, da 'gap' verwendet wird */
}

/* Für größere Bildschirme nebeneinander */
@media (min-width: 640px) { /* sm breakpoint von Tailwind als Beispiel */
    .input-group {
        flex-direction: row;
        align-items: center;
    }
    .input-group .input-field {
        flex-grow: 1; /* Input-Feld nimmt verfügbaren Platz ein */
    }
    .input-group .button {
        width: auto; /* Buttonbreite an Inhalt anpassen */
        flex-shrink: 0; /* Verhindert, dass der Button schrumpft */
    }
}


.answer-box {
    margin-top: 1rem;
    padding: 1rem;
    background-color: #f9fafb; /* Tailwind bg-gray-50 */
    border-radius: 0.375rem;   /* Tailwind rounded-md */
    border: 1px solid #e5e7eb; /* Tailwind border-gray-200 */
}

.answer-title {
    font-weight: 600; /* semibold */
    color: #374151; /* Tailwind text-gray-700 */
    margin-top: 0;
    margin-bottom: 0.5rem;
}

.answer-text {
    color: #1f2937; /* Tailwind text-gray-800 */
    white-space: pre-wrap; /* Erhält Zeilenumbrüche und Leerzeichen, bricht aber auch um */
    font-size: 0.95rem;
    line-height: 1.6;
}

.placeholder-text {
    text-align: center;
    color: #6b7280; /* Tailwind text-gray-500 */
    margin-top: 1rem;
    padding: 0.5rem;
    font-style: italic;
}
</style>