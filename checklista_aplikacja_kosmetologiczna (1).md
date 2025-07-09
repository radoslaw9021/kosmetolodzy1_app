# ✅ Checklista funkcjonalności – Aplikacja Kosmetologiczna

## 1. Frontend (React)

### 🎨 UI / UX
- [ ] Responsywny layout (działa na desktop/mobile, nie rozjeżdża się)
- [ ] Spójny design (ciemny motyw, neonowe akcenty, gradienty, zaokrąglenia, efekty hover)
- [ ] Favicon, manifest, meta tagi
- [ ] SEO (jeśli publiczny frontend)
- [ ] Dostępność (WCAG, kontrast, focus)
- [ ] Obsługa edge case’ów (puste stany, loading, brak połączenia)

### 📋 Funkcje główne
- [ ] Lista klientek (grid, podgląd, przycisk działa, elipsa dla długich tekstów)
- [ ] Kalendarz (widok dzienny, miesięczny, lista wizyt, grid godzinowy)
- [ ] Panel boczny (wizyty, przyciski edycji/usuwania, kolorowe paski)
- [ ] CRUD klientek i wizyt
- [ ] Powiadomienia (toast, alerty)

### 🔐 Integracje i bezpieczeństwo
- [ ] Autoryzacja/logowanie (jeśli wymagane)
- [ ] Obsługa błędów i walidacja formularzy
- [ ] Integracja z backendem (wszystkie dane przez API)

### ⚙️ Jakość i optymalizacja
- [ ] Testy UI (unit, e2e, snapshoty)
- [ ] Brak mockowanych danych w kodzie produkcyjnym
- [ ] Optymalizacja wydajności (lazy loading, code splitting, minifikacja)

## 2. Backend (API + Baza danych)

### 🛠️ Funkcjonalność
- [ ] REST API lub GraphQL (pełny CRUD dla klientek, wizyt, kalendarza)
- [ ] Baza danych (PostgreSQL / MongoDB / SQLite)

### 🔒 Bezpieczeństwo i autoryzacja
- [ ] Autoryzacja i uwierzytelnianie (JWT, sesje, role użytkowników)
- [ ] Walidacja danych po stronie backendu
- [ ] Bezpieczeństwo: CORS, rate limiting, XSS/CSRF protection, hashowanie haseł

### 📊 Monitoring i niezawodność
- [ ] Obsługa błędów i logowanie
- [ ] Monitoring i alertowanie (np. Sentry, Prometheus)
- [ ] Backup bazy danych

### 🧪 Jakość
- [ ] Testy backendu (unit, integracyjne)
- [ ] Dokumentacja API (Swagger, Postman, README)
- [ ] Obsługa powiadomień (email/SMS) – jeśli wymagane

## 3. DevOps / Wdrożenie

### 🚀 Deploy & CI/CD
- [ ] Automatyczne buildy (CI/CD)
- [ ] Testy automatyczne przed deployem
- [ ] Wdrożenie na hosting (Vercel / Netlify / VPS / Docker)
- [ ] SSL/HTTPS

### 🧩 Zarządzanie kodem i stabilność
- [ ] Wersjonowanie (git, tagi release)
- [ ] Kopia zapasowa i rollback
- [ ] Monitoring uptime
- [ ] Instrukcja uruchomienia i deployu

## 4. Dokumentacja i UX

### 📘 Dokumentacja
- [ ] README z instrukcją uruchomienia
- [ ] Dokumentacja API
- [ ] Instrukcja dla użytkownika końcowego

### 📝 Użyteczność
- [ ] Zgłoszenia błędów i feedback
- [ ] Dostępność (WCAG, kontrast, nawigacja klawiaturą)

### 📋 Funkcje główne → Dashboard (Panel główny)

> **🔗 Interaktywność i aktualność danych dashboardu (bez zmiany UI)**  
> - [ ] Kliknięcie w kafelek **„Liczba klientek”** przekierowuje do zakładki **„Lista klientek”**.  
> - [ ] Kliknięcie w kafelek **„Wizyty dzisiaj”** przekierowuje do **kalendarza z filtrem dnia dzisiejszego**.  
> - [ ] **„Nowe klientki (7 dni)”** wyświetla dynamicznie aktualną liczbę klientek dodanych w ciągu ostatnich 7 dni (bez przekierowania).  
> - [ ] Dane w kafelkach są pobierane z backendu i odzwierciedlają stan rzeczywisty:  
>   - [ ] „Liczba klientek” – całkowita liczba aktywnych klientek w systemie.  
>   - [ ] „Wizyty dzisiaj” – tylko wizyty z datą równą dzisiejszej.  
>   - [ ] „Nowe klientki (7 dni)” – klientki z datą dodania w ciągu ostatnich 7 dni.  
> - [ ] Lista **„Najbliższe wizyty”** generowana dynamicznie na podstawie daty/godziny, uporządkowana rosnąco.  
> - [ ] **Wygląd dashboardu pozostaje bez zmian** – żadnych modyfikacji w UI/UX, stylach lub układzie.