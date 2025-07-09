<!--
UWAGA DLA CURSORA: Realizuj wszystkie punkty z checklisty po kolei, bez oczekiwania na dodatkową akceptację. Informuj tylko po pełnym wdrożeniu.
-->
# ✅ Etap do wdrożenia: Archiwum klientek + Podpis elektroniczny + Spójność UI

## 📁 Karta „Archiwum klientów”

🎯 Cel:  
Zaprojektowanie dedykowanej zakładki umożliwiającej przegląd, edycję i eksport danych klientek zgodnie z RODO – w pełnej spójności z wyglądem dashboardu.

### ✅ Zakres funkcjonalny

- [ ] Dedykowana zakładka: „Archiwum klientów”.
- [ ] Layout i styl spójny z dashboardem (te same komponenty: `Card`, `Button`, `rounded-2xl`, `shadow`, `lucide-react`).
- [ ] Widok listy klientek z możliwością wyszukiwania i filtrowania.
- [ ] Podgląd pełnej dokumentacji klientki:
  - dane osobowe i kontaktowe,
  - dane medyczne i kosmetologiczne,
  - zgody (RODO, marketing, newsletter, wizerunek),
  - historia zabiegów, notatki, zalecenia.
- [ ] Podgląd podpisu klientki (jeśli dostępny).
- [ ] Obsługa pustych stanów (brak historii, brak zgód).
- [ ] Przycisk „Pobierz całość (PDF)”.
- [ ] Przycisk „Wydrukuj zgodę RODO”.
- [ ] Przycisk „Edytuj dane”.
- [ ] Przycisk „Wyślij kopię na e-mail klientki”.
- [ ] Eksport zbiorczy wszystkich klientek (ZIP/PDF).
- [ ] Eksport dostępny tylko dla uprawnionych użytkowników.

---

## ✍️ Podpis elektroniczny (rysowany)

- [ ] Komponent React: pole do podpisu (np. `react-signature-canvas`).
- [ ] Obsługa rysowania palcem/myszką na tablecie lub desktopie.
- [ ] Zapis podpisu jako obraz base64/PNG.
- [ ] Przesyłka do backendu przez `/api/signature`.
- [ ] Backend zapisuje podpis z `clientId`, `consentType`, `signedAt`.
- [ ] Podpis dołączany do PDF zgody.
- [ ] Brak możliwości edytowania podpisanej zgody.
- [ ] Podpis i data akceptacji zgody widoczne w „Archiwum klientek”.

---

## 🔐 Bezpieczeństwo i zgodność

- [ ] Dane przechowywane zgodnie z RODO.
- [ ] Operacje (eksport, zapis, podpis) logowane z timestampem.
- [ ] Podpis przypisany jednoznacznie do klientki i konkretnej zgody.

---

## 🖼️ UI/UX – Spójność z dashboardem

- [ ] Te same kolory, przyciski, zaokrąglenia, ikony.
- [ ] Ikona folderu obok nagłówka („Archiwum klientek”).
- [ ] Komponenty `Card`, `Button`, `Input`, `Grid` zgodne z stylem dashboardu.
- [ ] Hover, efekt aktywności i styl podświetlenia jak na dashboardzie.