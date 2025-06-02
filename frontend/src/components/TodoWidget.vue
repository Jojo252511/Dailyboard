<template>
    <div class="board-widget">
        <h2 class="widget-title">To-Do Liste</h2>
        <div class="todo-input-section">
            <input
                type="text"
                v-model="newTaskText"
                @keyup.enter="addTask"
                class="input-field"
                placeholder="Neue Aufgabe hinzufügen..."
            />
            <button @click="addTask" class="button button-primary">Aufgabe hinzufügen</button>
        </div>

        <ul class="task-list">
            <li v-if="tasks.length === 0" class="empty-tasks-message">
                Keine Aufgaben vorhanden.
            </li>
            <li
                v-for="task in tasks"
                :key="task.id"
                class="task-item"
                :class="{ 'completed': task.completed }"
            >
                <span @click="toggleTask(task.id)" class="task-text">
                    {{ task.text }}
                </span>
                <button @click="deleteTask(task.id)" class="button button-secondary task-delete-button">Löschen</button>
            </li>
        </ul>
         <p v-if="feedbackMessage" class="feedback-message">{{ feedbackMessage }}</p>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';

const newTaskText = ref('');
const tasks = ref([]);
const feedbackMessage = ref('');

// Lädt Aufgaben aus dem localStorage beim Initialisieren
function loadTasks() {
    const storedTasks = localStorage.getItem('todoTasks-vue');
    if (storedTasks) {
        tasks.value = JSON.parse(storedTasks);
    }
}

// Speichert Aufgaben im localStorage
function saveTasks() {
    localStorage.setItem('todoTasks-vue', JSON.stringify(tasks.value));
}

function addTask() {
    const text = newTaskText.value.trim();
    if (text) {
        tasks.value.unshift({ id: Date.now(), text: text, completed: false }); // unshift für oben anfügen
        newTaskText.value = '';
        // saveTasks(); // Wird durch watch erledigt
        showFeedback("Aufgabe hinzugefügt!");
    } else {
        showFeedback("Bitte gib einen Aufgabentext ein.", true);

    }
}

function deleteTask(taskId) {
    tasks.value = tasks.value.filter(task => task.id !== taskId);
    // saveTasks(); // Wird durch watch erledigt
    showFeedback("Aufgabe gelöscht!");
}

function toggleTask(taskId) {
    const task = tasks.value.find(task => task.id === taskId);
    if (task) {
        task.completed = !task.completed;
        // saveTasks(); // Wird durch watch erledigt
    }
}

function showFeedback(message, isError = false) {
    feedbackMessage.value = message;
    // Hier könnte man die Farbe der Nachricht basierend auf isError ändern, falls gewünscht
    setTimeout(() => {
        feedbackMessage.value = '';
    }, 3000);
}

onMounted(() => {
    loadTasks();
});

// Beobachtet Änderungen im tasks-Array (tiefgehend) und speichert sie automatisch
watch(tasks, saveTasks, { deep: true });
</script>

<style scoped>
.todo-input-section .input-field {
    margin-bottom: 0.75rem;
}
.task-list {
    list-style-type: none; /* Entfernt Aufzählungszeichen */
    padding-left: 0;
    margin-top: 1rem;
}
.empty-tasks-message {
    color: #6b7280; /* Tailwind text-gray-500 */
    font-style: italic;
    padding: 0.75rem 0; /* Tailwind py-3 */
    text-align: center;
}
.task-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 0; /* Tailwind py-3 */
    border-bottom: 1px solid #e5e7eb; /* Tailwind border-gray-200 */
}
.task-item:last-child {
    border-bottom: none;
}
.task-item.completed .task-text {
    text-decoration: line-through;
    color: #9ca3af; /* Tailwind text-gray-400 */
}
.task-text {
    cursor: pointer;
    flex-grow: 1;
    padding-right: 0.5rem; /* Abstand zum Löschen-Button */
}
.task-delete-button {
    width: auto; /* Lässt den Löschen-Button schrumpfen */
    padding: 0.25rem 0.5rem; /* Kleinere Padding für den Löschen-Button */
}
.feedback-message {
    margin-top: 0.75rem;
    font-size: 0.875rem;
    color: #16a34a; /* Tailwind green-600 (Beispiel) */
}
</style>