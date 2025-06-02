require('dotenv').config();
const express = require('express');
const cors = require('cors');
const weatherRoutes = require('./routes/weather');
const aiRoutes = require('./routes/ai'); // Importiere AI-Routen

const app = express();
const port = process.env.PORT || 3000;

/**
 * Aktuelle API Version: v1
*/

// Middleware
app.use(cors());
app.use(express.json());

// Routen
app.use('/api/v1/weather', weatherRoutes); // Alle Wetter-Routen unter /api/weather
app.use('/api/v1/ai', aiRoutes); // Alle AI-Routen unter /api/ai

app.listen(port, () => {
    console.log(`Backend-Server läuft auf http://localhost:${port}`);
});
