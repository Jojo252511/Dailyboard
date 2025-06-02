# Dailyboard

completion in progress!!!


.env #backend/  
```txt
OWM_API_KEY=DEIN_OPENWEATHERMAP_API_SCHLUESSEL_HIER
PORT=3000
```

.env.local #frontend/  
```txt
VITE_API_BASE_URL=http://localhost:3000/api
```

/dailyboard
├── backend/                  # Node.js/Express Backend  
│   ├── node_modules/  
│   ├── routes/  
│   │   └── weather.js        # Routen-Logik für das Wetter  
│   ├── .env                  # Hier kommt dein API-Schlüssel rein  
│   ├── .gitignore            # Ignoriert node_modules, .env etc.  
│   ├── package.json  
│   └── server.js             # Hauptdatei für den Express-Server  
│
└── frontend/                 # Vue.js Frontend  
    ├── node_modules/  
    ├── public/  
    │   └── index.html  
    ├── src/  
    │   ├── assets/             # Statische Assets wie Logos (optional)  
    │   ├── components/         # Vue-Komponenten  
    │   │   ├── ClockWidget.vue  
    │   │   ├── WeatherWidget.vue  
    │   │   ├── TodoWidget.vue  
    │   │   └── NotesWidget.vue  
    │   ├── services/  
    │   │   └── ApiService.js   # Service für Backend-API-Aufrufe  
    │   ├── App.vue             # Haupt-Vue-Komponente  
    │   └── main.js             # Vue Initialisierungsdatei  
    ├── .env.local            # Für Frontend-spezifische Umgebungsvariablen (z.B. API-Basis-URL)  
    ├── .gitignore  
    ├── package.json  
    └── vite.config.js        # (wenn du Vite für dein Vue-Projekt verwendest)
    # oder vue.config.js      # (wenn du Vue CLI verwendest)  