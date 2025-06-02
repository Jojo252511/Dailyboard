# Mein Digitales Board - Backend API Kurzbeschreibung

## Einleitung

Willkommen zur Backend-API für das Projekt "Mein Digitales Board". Diese API dient dazu, Daten und Dienste für das Frontend der Anwendung bereitzustellen. Aktuell liegt der Fokus auf der Bereitstellung von Wetterinformationen.

Die vollständige und detaillierte Spezifikation dieser API finden Sie in der Datei `API.yaml` (OpenAPI 3.0.3).

**Die Aktuelle Version der API ist v1**

## Basis-URL

Alle API-Endpunkte sind relativ zur folgenden Basis-URL:

`http://localhost:{port}/api/v1`

Der `{port}` ist standardmäßig `3000`, kann aber über die Umgebungsvariable `PORT` im Backend konfiguriert werden.

## Authentifizierung

Aktuell ist keine explizite Authentifizierung seitens des Clients für den Zugriff auf diese API-Endpunkte erforderlich. Die Authentifizierung gegenüber externen Diensten (wie OpenWeatherMap) wird serverseitig gehandhabt.

## Endpunkte

### 1. Wetterdaten abrufen

Ruft die aktuellen Wetterdaten für eine angegebene Stadt ab.

* **HTTP-Methode:** `GET`
* **Pfad:** `/weather/{city}`

#### Pfadparameter

* `city` (string, **erforderlich**): Der Name der Stadt, für die die Wetterdaten abgerufen werden sollen. Muss URL-kodiert sein, falls er Sonderzeichen enthält (obwohl das Backend `encodeURIComponent` für den Aufruf an OpenWeatherMap verwendet).
    * Beispiel: `/weather/Berlin` oder `/weather/New%20York`

#### Erfolgsantwort (`200 OK`)

Bei erfolgreicher Anfrage wird ein JSON-Objekt mit detaillierten Wetterinformationen zurückgegeben. Dieses Objekt enthält unter anderem:
* Koordinaten (`coord`)
* Wetterbeschreibung (`weather` Array mit `main`, `description`, `icon`)
* Temperaturangaben (`main` Objekt mit `temp`, `feels_like`, `temp_min`, `temp_max`, `humidity`, `pressure`)
* Windinformationen (`wind`)
* Sichtweite (`visibility`)
* Bewölkung (`clouds`)
* Zeitpunkt der Daten (`dt`)
* Systeminformationen wie Sonnenaufgang/-untergang (`sys`)
* Name der Stadt (`name`)

Ein detailliertes Schema der Antwort finden Sie in der `API.yaml` unter `#/components/schemas/WeatherResponse`.

#### Beispiel-Anfrage

GET http://localhost:3000/api/v1/weather/London

#### Fehlerantworten

* **`400 Bad Request`**:
    * Grund: Der Pfadparameter `city` wurde nicht angegeben.
    * Antwort-Body (Beispiel): `{"message": "Stadt fehlt in der Anfrage."}`
* **`401 Unauthorized`**:
    * Grund: Problem mit dem serverseitigen API-Schlüssel für OpenWeatherMap (wird vom Backend an den Client weitergeleitet, falls OWM einen 401 sendet).
    * Antwort-Body (Beispiel): `{"message": "Fehler von OpenWeatherMap für Stadt 'DeineStadt'", "owmError": {"cod": 401, "message": "Invalid API key..."}}`
* **`404 Not Found`**:
    * Grund: Die angegebene Stadt konnte von OpenWeatherMap nicht gefunden werden.
    * Antwort-Body (Beispiel): `{"message": "Fehler von OpenWeatherMap für Stadt 'NichtExistierendeStadt'", "owmError": {"cod": "404", "message": "city not found"}}`
* **`500 Internal Server Error`**:
    * Grund: Ein interner Fehler auf dem Backend-Server, z.B. wenn der OpenWeatherMap API-Schlüssel serverseitig nicht konfiguriert ist.
    * Antwort-Body (Beispiel): `{"message": "OpenWeatherMap API-Schlüssel ist serverseitig nicht konfiguriert."}`
* **`503 Service Unavailable`**:
    * Grund: Der externe Dienst (OpenWeatherMap) ist nicht erreichbar oder antwortet nicht.
    * Antwort-Body (Beispiel): `{"message": "Keine Antwort von OpenWeatherMap erhalten."}`

Ein detailliertes Schema für Fehlerantworten finden Sie in der `API.yaml` unter `#/components/schemas/ErrorResponse`.

---

Diese Kurzbeschreibung wird Ihnen hoffentlich einen guten ersten Überblick über die Funktionalität der API geben. Für alle Details konsultieren Sie bitte die `API.yaml`.