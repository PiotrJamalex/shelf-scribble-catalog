
# System Inwentaryzacji

Kompleksowy system do inwentaryzacji rzeczy, książek, dokumentów i innych przedmiotów z hierarchiczną organizacją przestrzeni.

## Funkcjonalności

### 🏗️ Hierarchiczna organizacja przestrzeni
- **Regały** - numerowane regały z nazwami i opisami
- **Półki** - numerowane półki przypisane do regałów  
- **Kartony** - opcjonalne kartony na półkach z numerami i kolorami

### 📦 Zarządzanie przedmiotami
- Dodawanie, edytowanie i usuwanie przedmiotów
- Szczegółowe opisy z możliwością dodawania tagów
- Przypisywanie lokalizacji (regał → półka → karton opcjonalnie)
- Dodawanie wielu zdjęć (URL)
- Historia zmian z datami utworzenia i modyfikacji

### 🔍 Zaawansowane wyszukiwanie
- Wyszukiwanie po nazwie, opisie, tagach
- Wyszukiwanie po lokalizacji (regał, półka, karton)
- Filtrowanie wyników w czasie rzeczywistym
- Zliczanie znalezionych przedmiotów

### 💾 Lokalne przechowywanie danych
- Wszystkie dane przechowywane lokalnie w przeglądarce
- Brak potrzeby połączenia z internetem do działania
- Automatyczne zapisywanie zmian
- Możliwość eksportu/importu danych

## Instalacja i uruchomienie

### Wymagania
- Node.js (wersja 16 lub nowsza)
- npm lub yarn

### Instalacja
1. Pobierz pliki projektu
2. Otwórz terminal w katalogu projektu
3. Zainstaluj zależności:
```bash
npm install
```

### Uruchomienie
```bash
npm run dev
```

Aplikacja będzie dostępna pod adresem `http://localhost:5173`

### Budowanie dla produkcji
```bash
npm run build
```

Pliki gotowe do wdrożenia znajdą się w katalogu `dist/`

## Instrukcja użytkowania

### 1. Pierwsze uruchomienie
- Przejdź do sekcji "Zarządzanie" 
- Dodaj pierwszy regał z nazwą i numerem
- Dodaj półki do regału
- Opcjonalnie dodaj kartony na półkach

### 2. Dodawanie przedmiotów
- Przejdź do sekcji "Inwentarz"
- Kliknij "Dodaj przedmiot"
- Wypełnij formularz z nazwą, opisem
- Wybierz lokalizację (regał → półka → karton)
- Dodaj tagi dla łatwiejszego wyszukiwania
- Dodaj zdjęcia poprzez URL

### 3. Wyszukiwanie
- Użyj paska wyszukiwania w sekcji "Inwentarz"
- Wpisz fragment nazwy, opisu, tagu lub lokalizacji
- Wyniki są filtrowane automatycznie

### 4. Edycja przedmiotów
- Kliknij "Edytuj" na karcie przedmiotu
- Zmień potrzebne informacje
- Zapisz zmiany

## Struktura danych

### Przedmiot
- Unikalne ID
- Nazwa i opis
- Lista tagów
- Lista zdjęć (URL)
- Lokalizacja (ID półki + opcjonalnie ID kartonu)
- Daty utworzenia i ostatniej modyfikacji

### Lokalizacje
- **Regał**: ID, numer, nazwa, opis
- **Półka**: ID, numer, ID regału, opis  
- **Karton**: ID, numer, nazwa, ID półki, opis, kolor

## Technologie

- **React 18** - framework UI
- **TypeScript** - typowanie
- **Tailwind CSS** - stylowanie
- **Shadcn/ui** - komponenty UI
- **Zustand** - zarządzanie stanem
- **React Router** - routing
- **Vite** - bundler i serwer deweloperski

## Backup i migracja danych

Dane są przechowywane lokalnie w przeglądarce. W przyszłych wersjach planowane są funkcje:
- Eksport danych do pliku JSON
- Import danych z pliku
- Synchronizacja między urządzeniami

## Wsparcie

System jest gotowy do użytku lokalnego. Wszystkie dane są przechowywane bezpiecznie w przeglądarce i nie są wysyłane do zewnętrznych serwerów.
