const express = require('express');
const axios = require('axios');
const router = express.Router();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

router.post('/ask', async (req, res) => {
    // Die Frage kommt aus dem Request-Body
    const { question } = req.body;

    if (!GEMINI_API_KEY || GEMINI_API_KEY === 'DEIN_GEMINI_API_SCHLUESSEL_HIER' || GEMINI_API_KEY.trim() === '') {
        console.error("GEMINI API-Schlüssel ist serverseitig nicht konfiguriert.");
        return res.status(500).json({ message: "KI-Dienst ist nicht korrekt konfiguriert (API-Schlüssel fehlt)." });
    }

    if (!question || typeof question !== 'string' || question.trim() === '') {
        return res.status(400).json({ message: "Frage fehlt in der Anfrage oder ist ungültig." });
    }

    try {
        const requestBody = {
            contents: [
                {
                    parts: [
                        {
                            text: question
                        }
                    ]
                }
            ], 
            generationConfig:
            {
                temperature: 0.7,
                topK: 1,
                topP: 1,
                maxOutputTokens: 2048,
            },
            safetySettings: [
                {
                    category: 'HARM_CATEGORY_HARASSMENT',
                    threshold: 'BLOCK_MEDIUM_AND_ABOVE'
                }
            ]
        };

        const url = `${GEMINI_BASE_URL}?key=${GEMINI_API_KEY}`;

        console.log(`Sende Anfrage an Gemini API für Frage: "${question}"`);
        const geminiResponse = await axios.post(url, requestBody, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // Extrahieren der Antwort aus der Gemini API Struktur
        let aiAnswer = "Entschuldigung, ich konnte keine klare Antwort finden.";
        if (geminiResponse.data && geminiResponse.data.candidates && geminiResponse.data.candidates.length > 0) {
            const candidate = geminiResponse.data.candidates[0];
            if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
                aiAnswer = candidate.content.parts[0].text;
            } else if (candidate.finishReason && candidate.finishReason !== "STOP") {
                // Wenn die Generierung aus anderen Gründen als "STOP" beendet wurde (z.B. SAFETY)
                aiAnswer = `Die Antwort konnte nicht generiert werden (Grund: ${candidate.finishReason}).`;
                if (candidate.safetyRatings) {
                    console.warn("Safety Ratings:", candidate.safetyRatings);
                }
            }
        } else if (geminiResponse.data.promptFeedback) {
            // Falls die Eingabe direkt blockiert wurde (z.B. promptFeedback.blockReason)
            aiAnswer = `Die Anfrage wurde blockiert (Grund: ${geminiResponse.data.promptFeedback.blockReason}).`;
            console.warn("Prompt Feedback:", geminiResponse.data.promptFeedback);
        }

        res.json({ answer: aiAnswer });

    } catch (error) {
        console.error("Fehler bei der Kommunikation mit der Gemini API:", error.message);
        let errorMessage = "Interner Serverfehler beim Abrufen der KI-Antwort.";
        let statusCode = 500;

        if (error.response) {
            console.error("Gemini API Fehlerdetails:", JSON.stringify(error.response.data, null, 2));
            statusCode = error.response.status;
            if (error.response.data && error.response.data.error && error.response.data.error.message) {
                errorMessage = `Fehler von der KI-API: ${error.response.data.error.message}`;
            } else {
                errorMessage = `Fehler von der KI-API (Status: ${statusCode}).`;
            }
        } else if (error.request) {
            errorMessage = "Keine Antwort von der KI-API erhalten.";
            statusCode = 503; // Service Unavailable
        }
        // Die generische Fehlermeldung `errorMessage` wird verwendet
        res.status(statusCode).json({ message: errorMessage, errorDetails: error.response ? error.response.data : null });
    }
});

module.exports = router;