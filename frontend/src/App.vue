<template>
  <div id="app"> <header class="app-header"> <h1>Mein Digitales Board</h1>
      <p>Deine tägliche Übersicht.</p>
    </header>

    <div class="widget-container"> <ClockWidget />
      <WeatherWidget />
      <TodoWidget />
      <NotesWidget />
      <AskAIWidget />
    </div>
  </div>
</template>

<script setup>
import ClockWidget from './components/ClockWidget.vue';
import WeatherWidget from './components/WeatherWidget.vue';
import TodoWidget from './components/TodoWidget.vue';
import NotesWidget from './components/NotesWidget.vue';
import AskAIWidget from './components/AskAIWidget.vue';

// Stelle sicher, dass die globalen Styles (Tailwind via CDN oder als PostCSS-Plugin)
// in deiner public/index.html oder über main.js geladen werden.
// Die Tailwind-Klassen in diesem Template und in den Komponenten benötigen das.
</script>

<style>
/* Globale Styles, wenn nicht schon durch Tailwind abgedeckt oder in main.css importiert */
body {
    font-family: 'Inter', sans-serif;
    background-color: #f0f4f8;
}
/* Die .board-widget, .widget-title etc. Klassen können global in einer CSS-Datei
   definiert oder per Tailwind Utility-Klassen direkt in den Komponenten angewendet werden.
   Wenn du sie in der public/index.html hattest, musst du sie eventuell in eine
   globale CSS-Datei (z.B. src/assets/main.css) verschieben und in main.js importieren.
   Oder du verwendest direkt Tailwind-Klassen in deinen Vue-Komponenten-Templates. */
.board-widget {
    background-color: white;
    border-radius: 0.75rem;
    padding: 1.5rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    margin-bottom: 1.5rem; /* Entfällt bei Grid-gap */
}
.widget-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: #1f2937;
}
</style>