# Backend API - Kosmetolodzy.app

## Konfiguracja

### 1. Zmienne środowiskowe

Stwórz plik `.env` w katalogu `backend/` z następującą zawartością:

```env
# Konfiguracja bazy danych MongoDB (WYMAGANE)
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/kosmetolodzy

# Port serwera (opcjonalne, domyślnie 4000)
PORT=4000

# JWT Secret (WYMAGANE - wygeneruj bezpieczny secret)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Frontend URL (dla CORS)
FRONTEND_URL=http://localhost:3000

# Redis (opcjonalne - dla kolejek)
REDIS_URL=redis://localhost:6379

# Email (opcjonalne)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Environment
NODE_ENV=development
```

### 2. Baza danych MongoDB

Backend wymaga MongoDB. Możesz użyć:
- **MongoDB Atlas** (zalecane) - darmowy cluster w chmurze
- **Lokalny MongoDB** - zainstaluj MongoDB Community Server
- **Docker** - `docker run -d -p 27017:27017 mongo:latest`

### 3. Uruchomienie

```bash
# Zainstaluj dependencies
npm install

# Uruchom serwer
npm start
```

### 4. Endpointy API

- **Health check**: `GET /api/health`
- **Autoryzacja**: `POST /api/auth/login`
- **Klienci**: `GET/POST/PUT/DELETE /api/clients`
- **Podpisy**: `GET/POST /api/signatures`
- **Eksport**: `POST /api/export`

### 5. Bezpieczeństwo

- Wszystkie endpointy wymagają autoryzacji JWT (oprócz `/api/health`)
- Rate limiting na wszystkich endpointach
- CORS skonfigurowany dla localhost
- Walidacja danych wejściowych

## Struktura projektu

```
backend/
├── controllers/     # Logika biznesowa
├── models/         # Modele MongoDB
├── routes/         # Definicje endpointów
├── middleware/     # Middleware (auth, validation, etc.)
├── config/         # Konfiguracja (logger, etc.)
├── services/       # Serwisy pomocnicze
└── index.js        # Główny plik aplikacji
``` 