# Cursor Reguły – UI

## 📐 Layout
- Dla tabeli używaj `table-layout: fixed` oraz określonych szerokości kolumn
- Nigdy nie pozwól na overflow tekstu w komórkach — stosuj `text-overflow: ellipsis`, `white-space: nowrap`, `overflow: hidden`

## 🎛 Komponenty
- Przycisk „Podgląd” musi mieścić się w kolumnie i nie może kolidować z sąsiednimi elementami
- Dla avatarów i ikon stosuj `flex` lub `grid` z `gap` zamiast nakładania warstw

## 🧪 Testowanie
- UI musi być testowane w desktopowych przeglądarkach (Chrome, Firefox)
- Layout nie może się rozjeżdżać na rozdzielczościach powyżej 1024px

## 🧠 Inne
- Jeżeli komponent zawiera email lub długi tekst, ogranicz jego szerokość i utnij nadmiar
