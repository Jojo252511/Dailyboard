# Dailyboard

completion in progress!!!


.env #backend/  
```txt
OWM_API_KEY=DEIN_OPENWEATHERMAP_API_SCHLUESSEL_HIER
GEMINI_API_KEY=DEIN_GEMINI_API_SCHLUESSEL_HIER
PORT=3000
```

.env.local #frontend/  
```txt
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

---

/dailyboard
├── backend/                    
│   ├── node_modules/  
│   ├── routes/  
│   │   └── weather.js          
│   ├── .env                    
│   ├── .gitignore              
│   ├── package.json  
│   └── server.js               
│
└── frontend/                  
    ├── node_modules/  
    ├── public/  
    │   └── index.html  
    ├── src/  
    │   ├── assets/               
    │   ├── components/           
    │   │   ├── ClockWidget.vue  
    │   │   ├── WeatherWidget.vue  
    │   │   ├── TodoWidget.vue  
    │   │   └── NotesWidget.vue  
    │   ├── services/  
    │   │   └── ApiService.js     
    │   ├── App.vue                
    │   └── main.js               
    ├── .env.local              
    ├── .gitignore  
    ├── package.json  
    └── vite.config.js        
  
  ---

  Gemini (Google): https://developers.google.com/terms