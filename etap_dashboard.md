# 🔧 Etap realizacji: Dashboard (Panel główny)

🎯 **Cel:** Zapewnienie, że dane i interakcje w panelu głównym są dynamiczne i zgodne z aktualnym stanem bazy, bez zmiany wyglądu UI.

## Zakres prac:
- [ ] **Liczba klientek** – dynamicznie zliczana na podstawie rzeczywistej liczby wpisów w bazie danych.
- [ ] **Wizyty dzisiaj** – pobierane z backendu na podstawie daty `dzisiaj`, przekierowanie do kalendarza z filtrem dnia dzisiejszego.
- [ ] **Nowe klientki (7 dni)** – liczba aktualizowana na podstawie dat dodania klientek w ciągu ostatnich 7 dni (bez przekierowania).
- [ ] **Lista najbliższych wizyt** – generowana dynamicznie (data/godzina najbliższych wizyt), posortowana rosnąco.
- [ ] **Przekierowanie** po kliknięciu w kafelek „Liczba klientek” – do zakładki **Lista klientek**.
- [ ] **Przekierowanie** po kliknięciu w „Wizyty dzisiaj” – do widoku kalendarza z aktualnym dniem.
- [ ] **Zachowanie obecnego wyglądu dashboardu** – nie wprowadzać żadnych zmian w stylach, układzie ani kolorach.