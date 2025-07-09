# ✅ Backend & Integracja podpisów/PDF – CHECKLISTA

## Postęp

- [x] Model danych
- [x] API (w trakcie)
- [ ] Logika backendu
- [ ] Integracja z frontendem
- [ ] Bezpieczeństwo i RODO
- [ ] Testy i wdrożenie

---

## 1. Model danych
- [x] Zaprojektuj model danych klientki (dane osobowe, medyczne, zgody, historia zabiegów, podpisy)
- [x] Dodaj model podpisu elektronicznego (base64/PNG, clientId, consentType, signedAt)
- [x] Dodaj model logów operacji (typ, timestamp, user, szczegóły)
- [x] Zaprojektuj relacje: klientka ↔ zabiegi, klientka ↔ podpisy, klientka ↔ zgody

## 1a. Przykładowe modele danych (schematy JSON)

### Klientka
```json
{
  "id": "string",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "phone": "string",
  "birthDate": "YYYY-MM-DD",
  "gender": "female|male|other",
  "address": "string",
  "createdAt": "ISO8601",
  "medical": {
    "chronicDiseases": "string",
    "medications": "string",
    "supplements": "string",
    "allergies": "string",
    "additionalNotes": "string"
  },
  "consents": {
    "rodo": true,
    "marketing": false,
    "newsletter": false,
    "image": false
  },
  "treatments": [
    {
      "id": "string",
      "name": "string",
      "date": "ISO8601",
      "description": "string"
    }
  ],
  "signatures": [
    {
      "id": "string",
      "consentType": "rodo|marketing|newsletter|image",
      "data": "base64/png",
      "signedAt": "ISO8601"
    }
  ]
}
```

### Podpis elektroniczny
```json
{
  "id": "string",
  "clientId": "string",
  "consentType": "rodo|marketing|newsletter|image",
  "data": "base64/png",
  "signedAt": "ISO8601"
}
```

### Log operacji
```json
{
  "id": "string",
  "timestamp": "ISO8601",
  "type": "bulk_export|signature|edit|email|pdf_export",
  "user": "string",
  "details": "string",
  "clientId": "string"
}
```

### Relacje
- Klientka ma wiele zabiegów (`treatments`)
- Klientka ma wiele podpisów (`signatures`)
- Klientka ma jeden zestaw zgód (`consents`)
- Logi mogą być powiązane z klientką (po `clientId`)

## 2. Endpointy backendu (REST API lub GraphQL)
- [ ] GET `/api/clients` – pobieranie listy klientek
- [ ] GET `/api/clients/:id` – pobieranie szczegółów klientki (wraz z zabiegami, zgodami, podpisami)
- [ ] POST `/api/clients` – dodawanie nowej klientki
- [ ] PUT `/api/clients/:id` – edycja danych klientki
- [ ] GET `/api/clients/:id/consents` – pobieranie zgód klientki
- [ ] POST `/api/clients/:id/consents` – aktualizacja zgód
- [ ] GET `/api/clients/:id/treatments` – historia zabiegów
- [ ] POST `/api/clients/:id/treatments` – dodanie zabiegu
- [ ] POST `/api/signature` – zapis podpisu elektronicznego (PNG/base64, clientId, consentType, signedAt)
- [ ] GET `/api/signature/:clientId/:consentType` – pobranie podpisu klientki
- [ ] GET `/api/clients/export/pdf` – eksport danych klientek do PDF
- [ ] GET `/api/clients/export/zip` – eksport zbiorczy ZIP (PDFy wszystkich klientek)
- [ ] POST `/api/clients/:id/email` – wysyłka dokumentacji na e-mail
- [ ] GET `/api/logs` – pobieranie logów operacji (dla admina)

## 2a. Przykładowe definicje endpointów (Express.js)

```js
// Klientki
GET    /api/clients                // lista klientek
GET    /api/clients/:id            // szczegóły klientki
POST   /api/clients                // dodaj klientkę
PUT    /api/clients/:id            // edytuj klientkę

// Zgody
GET    /api/clients/:id/consents   // pobierz zgody
POST   /api/clients/:id/consents   // aktualizuj zgody

// Zabiegi
GET    /api/clients/:id/treatments // historia zabiegów
POST   /api/clients/:id/treatments // dodaj zabieg

// Podpisy
POST   /api/signature              // zapisz podpis
GET    /api/signature/:clientId/:consentType // pobierz podpis

// Eksport
GET    /api/clients/export/pdf     // eksport PDF
GET    /api/clients/export/zip     // eksport ZIP

// E-mail
POST   /api/clients/:id/email      // wyślij dokumentację na e-mail

// Logi
GET    /api/logs                   // logi operacji
```

## 3. Logika backendu
- [ ] Walidacja i autoryzacja (tylko uprawnieni użytkownicy mogą eksportować, podpisywać, edytować)
- [ ] Zapis i pobieranie podpisów elektronicznych (np. w bazie lub w plikach)
- [ ] Generowanie PDF (np. z biblioteką `pdfkit`, `puppeteer`, `jsreport`)
- [ ] Generowanie ZIP (np. `archiver` dla Node.js)
- [ ] Logowanie operacji (eksport, podpis, edycja, wysyłka e-mail)
- [ ] Wysyłka e-mail (np. z załącznikiem PDF, przez SMTP lub usługę typu SendGrid)

## 4. Integracja z frontendem
- [ ] Zamiast localStorage – pobieraj i zapisuj dane przez API
- [ ] Pobieraj podpisy przez `/api/signature`
- [ ] Wysyłaj podpisy przez `/api/signature` (po zapisaniu na froncie)
- [ ] Pobieraj PDF/ZIP przez odpowiednie endpointy i umożliw pobranie użytkownikowi
- [ ] Wysyłaj żądania wysyłki e-mail przez API
- [ ] Wyświetlaj logi operacji pobrane z backendu

## 5. Bezpieczeństwo i zgodność z RODO
- [ ] Autoryzacja JWT/OAuth2 (dostęp tylko dla zalogowanych/uprawnionych)
- [ ] Szyfrowanie danych wrażliwych (np. podpisów)
- [ ] Logowanie wszystkich operacji z timestampem i userem
- [ ] Możliwość usunięcia/anonimizacji danych na żądanie klientki

## 6. Testy i wdrożenie
- [ ] Testy jednostkowe i integracyjne endpointów
- [ ] Testy bezpieczeństwa (autoryzacja, dostępność danych)
- [ ] Testy integracji z frontendem (np. Postman, Swagger)
- [ ] Wdrożenie backendu na serwerze/hostingu (np. VPS, Heroku, Vercel, AWS)
- [ ] Konfiguracja CORS i HTTPS 