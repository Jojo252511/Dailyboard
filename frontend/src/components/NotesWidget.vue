<template>
    <div class="board-widget">
        <h2 class="widget-title">Notizen</h2>
        <textarea
            v-model="notesContent"
            class="input-field notes-textarea"
            placeholder="Schnelle Notizen..."
        ></textarea>
        <button @click="saveNotes" class="button button-primary">Notizen speichern</button>
        <p v-if="feedbackMessage" class="feedback-message">{{ feedbackMessage }}</p>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const notesContent = ref('');
const feedbackMessage = ref('');

function loadNotes() {
    const storedNotes = localStorage.getItem('dailyBoardNotes-vue');
    if (storedNotes) {
        notesContent.value = storedNotes;
    }
}

function saveNotes() {
    localStorage.setItem('dailyBoardNotes-vue', notesContent.value);
    feedbackMessage.value = "Notizen gespeichert!";
    setTimeout(() => {
        feedbackMessage.value = '';
    }, 3000); // Nachricht nach 3 Sekunden ausblenden
}

onMounted(() => {
    loadNotes();
});
</script>

<style scoped>
.notes-textarea {
    min-height: 16rem;
    width: 100%;
    box-sizing: border-box;
    margin-bottom: 0.75rem;
}
.feedback-message {
    margin-top: 0.75rem;
    font-size: 0.875rem;
    color: #16a34a; /* Tailwind green-600 (Beispiel) */
}
</style>