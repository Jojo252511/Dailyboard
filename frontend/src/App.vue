<template>
  <div id="app">
    <!-- Container für das Hintergrundvideo und das Overlay -->
    <div class="background-container">
      <video
        class="background-video"
        autoplay
        loop
        muted
        playsinline
        src="../public/268528_medium.mp4"
      >
        <!-- Hinweis: Für eine echte Anwendung ist es besser, das Video selbst zu hosten
             und hier einen relativen Pfad aus dem 'public' oder 'assets' Ordner anzugeben. -->
        Dein Browser unterstützt das Video-Tag nicht.
      </video>
      <div class="overlay"></div>
    </div>

    <!-- Hauptinhalt der Anwendung, der über dem Hintergrund liegt -->
    <div class="main-content">
      <header class="app-header">
        <h1>Mein Digitales Board</h1>
        <p>Deine tägliche Übersicht.</p>
        <br><hr>
      </header>

      <div class="widget-container">
        <ClockWidget />
        <WeatherWidget />
        <TodoWidget />
        <NotesWidget />
        <AskAIWidget />
      </div>
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
/* Globale Styles */
body {
    font-family: 'Inter', sans-serif;
    /* Die Hintergrundfarbe wird jetzt vom Video-Overlay gesteuert, daher hier neutral halten */
    background-color: #000;
    margin: 0;
}

#app {
    position: relative; /* Wichtig als Positionierungskontext */
}

/* --- Hintergrundvideo und Overlay --- */
.background-container {
    position: fixed; /* Bleibt beim Scrollen an Ort und Stelle */
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: -2; /* Liegt ganz hinten */
}

.background-video {
    width: 100%;
    height: 100%;
    object-fit: cover; /* Stellt sicher, dass das Video den gesamten Bereich füllt, ohne das Seitenverhältnis zu verzerren */
}

.overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    /* Dunkles Overlay, damit der Text auf den Widgets besser lesbar ist.
       Du kannst die Farbe und Transparenz hier anpassen. */
    background-color: rgba(17, 24, 39, 0.6); /* Entspricht in etwa bg-gray-900 mit 60% Opazität */
    z-index: -1; /* Liegt über dem Video, aber unter dem Inhalt */
}


/* --- Hauptinhalt --- */
.main-content {
    position: relative;
    z-index: 1; /* Stellt sicher, dass der Inhalt über dem Hintergrund liegt */
    padding: 1rem 1.5rem; /* Padding für den Inhalt */
    max-width: 1200px;
    margin: 0 auto;
    height: 100vh; /* Nimmt die volle Höhe des Viewports ein */
}

.app-header {
    margin: 2rem 0; /* Mehr Abstand oben und unten */
    text-align: center;
    color: white; /* Header-Text jetzt weiß für besseren Kontrast */
}

.app-header h1 {
    font-size: 2.25rem;
    font-weight: 700;
}

.app-header p {
    color: rgba(255, 255, 255, 0.8);
    font-size: 1.125rem;
}

/* Grid für die Widgets */
.widget-container {
    display: grid;
    gap: 1.5rem;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); /* Responsives Grid */
    padding: 15px;
}


/* --- Angepasstes Widget-Styling für "Glassmorphism"-Effekt --- */
.board-widget {
    /* Milchige, transparente Hintergrundfarbe */
    background-color: rgba(255, 255, 255, 0.1);
    /* Hintergrund weichzeichnen, um den Glaseffekt zu erzeugen */
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px); /* Für Safari-Kompatibilität */

    border-radius: 1rem; /* 16px */
    padding: 1.5rem;
    /* Subtiler Rand, um die Kanten zu betonen */
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37); /* Etwas stärkerer Schatten für den Kontrast */
    color: #f9fafb; /* Hellerer Text für die Widgets */
}

.widget-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: white; /* Titel jetzt auch weiß */
    border-bottom: 1px solid rgba(255, 255, 255, 0.2); /* Subtile Trennlinie */
    padding-bottom: 0.75rem;
}

/* Sorge dafür, dass andere Texte in den Widgets auch hell sind.
   Dies muss eventuell in den Komponenten selbst oder hier globaler definiert werden. */
:deep(.board-widget) {
    color: #f9fafb;
}

:deep(.board-widget .date-display),
:deep(.board-widget .weather-humidity),
:deep(.board-widget .placeholder-text) {
    color: rgba(255, 255, 255, 0.8);
}
</style>