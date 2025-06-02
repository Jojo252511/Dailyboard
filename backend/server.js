require('dotenv').config(); // Lädt Umgebungsvariablen aus .env
const express = require('express');
const cors = require('cors'); // Für Cross-Origin Resource Sharing
const weatherRoutes = require('./routes/weather');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Erlaubt Anfragen vom Frontend (das auf einem anderen Port läuft)
app.use(express.json()); // Für das Parsen von JSON-Request-Bodies (brauchen wir hier nicht unbedingt für GET)

// Routen
app.use('/api/weather', weatherRoutes); // Alle Wetter-Routen unter /api/weather

app.listen(port, () => {
    console.log(`Backend-Server läuft auf http://localhost:${port}`);
});
