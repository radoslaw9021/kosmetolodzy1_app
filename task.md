# Task Plan – Naprawa layoutu listy klientek

## Zadania

### 🧩 Struktura tabeli
- [ ] Dodać `table-layout: fixed` dla tabeli klientek
- [ ] Ustawić `width` w procentach dla każdej kolumny
- [ ] Zmniejszyć padding komórek, aby uniknąć przepełnień

### 📏 Responsywność i ograniczenia rozmiaru
- [ ] Dodać `min-width` i `max-width` dla kolumn z emailami i telefonami
- [ ] Ustawić `overflow: hidden`, `text-overflow: ellipsis`, `white-space: nowrap` dla długich tekstów
- [ ] Dostosować `flex` lub `grid`, aby przyciski „Podgląd” nie wypadały poza kontener

### 🖼 Estetyka i kontrast
- [ ] Sprawdzić kolory i cienie dla przycisków — poprawić czytelność
- [ ] Upewnić się, że `z-index` nie powoduje nakładania się avatarów i tekstu

### 🧪 Testowanie
- [ ] Przetestować widok w rozdzielczościach 1024px / 1440px / 1920px
- [ ] Przetestować na Firefox i Chrome

---

## Reguły
- Po każdym zadaniu zaktualizuj ten plik i oznacz [x] jako wykonane
- Trzymaj się stylu i struktury użytej w projekcie
