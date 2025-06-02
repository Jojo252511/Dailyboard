const express = require('express');
const axios = require('axios');
const router = express.Router();

const OWM_API_KEY = process.env.OWM_API_KEY;
const OWM_BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

router.get('/:city', async (req, res) => {
    const city = req.params.city;
    if (!OWM_API_KEY) {
        return res.status(500).json({ message: "OpenWeatherMap API-Schlüssel ist serverseitig nicht konfiguriert." });
    }
    if (!city) {
        return res.status(400).json({ message: "Stadt fehlt in der Anfrage." });
    }

    try {
        const url = `<span class="math-inline">\{OWM\_BASE\_URL\}?q\=</span>{city}&appid=${OWM_API_KEY}&units=metric&lang=de`;
        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        console.error("Fehler beim Abrufen der Wetterdaten von OpenWeatherMap:", error.message);
        if (error.response) {
            // Die Anfrage wurde gestellt und der Server antwortete mit einem Statuscode
            // der außerhalb des Bereichs von 2xx liegt
            res.status(error.response.status).json({
                message: `Fehler von OpenWeatherMap für Stadt '${city}'`,
                owmError: error.response.data
            });
        } else if (error.request) {
            // Die Anfrage wurde gestellt, aber keine Antwort erhalten
            res.status(503).json({ message: "Keine Antwort von OpenWeatherMap erhalten." });
        } else {
            // Ein Fehler ist beim Aufsetzen der Anfrage passiert
            res.status(500).json({ message: "Interner Serverfehler beim Abrufen der Wetterdaten." });
        }
    }
});

module.exports = router;