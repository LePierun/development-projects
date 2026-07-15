# Development Projects

Repozytorium zawiera projekty edukacyjne wykonane podczas nauki tworzenia stron internetowych, aplikacji frontendowych oraz aplikacji full-stack.



## Projekty

### 1. ZŁOTÓWA

Aplikacja mobilna służąca do rozliczania wydatków pomiędzy znajomymi.

Projekt składa się z:

- aplikacji mobilnej w React Native i Expo,
- backendu w Node.js i Express,
- bazy danych SQLite,
- komunikacji pomiędzy frontendem i backendem przez API.

#### Główne funkcje

- rejestracja i logowanie użytkowników,
- haszowanie haseł przy użyciu bcrypt,
- obsługa sesji użytkownika,
- tworzenie grup rozliczeniowych,
- dodawanie użytkowników do grupy,
- dodawanie wydatków i transakcji,
- dzielenie kwoty pomiędzy wybrane osoby,
- obliczanie salda pomiędzy użytkownikami,
- wyświetlanie historii transakcji,
- zmiana hasła i wylogowanie.

#### Podgląd
<img src="screenshots\zlotówa.gif" alt="podgląd złotówa" width="300"/>

#### Technologie

**Frontend**

- React Native
- Expo
- Expo Router
- TypeScript
- React Navigation
- AsyncStorage
- SecureStore

**Backend**

- Node.js
- Express
- express-session
- bcrypt
- SQLite


#### Uruchomienie backendu

```bash
cd ZŁOTÓWA/back
npm install
node app.js
```

Backend uruchamia się domyślnie pod adresem:

```text
http://localhost:3000
```

#### Uruchomienie aplikacji mobilnej

W osobnym terminalu:

```bash
cd ZŁOTÓWA/front
npm install
npx expo start
```

Następnie aplikację można otworzyć w Expo Go, emulatorze Androida lub symulatorze iOS.

> Projekt ma charakter edukacyjny. Aby aplikacja mobilna połączyła się z właściwym serwerem, należy otworzyć plik `ZŁOTÓWA/front/api/api.js` i zmienić wartość stałej `API_URL` na adres uruchomionego backendu, np.:

```js
const API_URL = "http://192.168.1.100:3000";
```

---

### 2. Formularz rezerwacji

Projekt frontendowy przedstawiający wieloetapowy formularz rezerwacji pobytu.

#### Główne funkcje

- przechodzenie pomiędzy etapami formularza,
- walidacja danych użytkownika,
- sprawdzanie adresu e-mail, dat, kodu pocztowego oraz danych karty,
- dynamiczne dodawanie osób towarzyszących,
- wybór opiekuna dla dziecka,
- usuwanie i zmiana kolejności wierszy w tabeli.


#### Podgląd
<img src="screenshots\form.gif" alt="podgląd złotówa"/>

#### Technologie

- HTML
- SCSS
- CSS
- JavaScript

#### Uruchomienie

Otwórz plik:

```text
Formularz/index.html
```


> Formularz działa po stronie przeglądarki i nie przesyła danych nigdzie dalej.

---

### 3. RETROBYTE

Prosta wielostronicowa strona internetowa o tematyce gier retro.

#### Główne elementy

- strona główna,
- podstrona artykułu,
- strona kontaktowa,
- formularz newslettera,
- nawigacja pomiędzy podstronami,
- podstawowa responsywność,
- efekty CSS,
- animowane tło.
#### Podgląd
<img src="screenshots\retrobyte.gif" alt="podgląd złotówa"/>

#### Technologie

- HTML
- CSS
- JavaScript

#### Uruchomienie

Otwórz plik:

```text
RETROBYTE/main.html
```

## Charakter repozytorium

Repozytorium służy jako zbiór projektów edukacyjnych i prezentacja umiejętności rozwijanych podczas nauki programowania.

Projekty pokazują pracę z:

- HTML, CSS, SCSS i JavaScript,
- React Native oraz Expo,
- Node.js i Express,
- API i komunikacją klient–serwer,
- bazą danych SQLite,
- formularzami i walidacją danych,
- obsługą sesji i uwierzytelnianiem użytkowników.

## Autor

**Aleksander Prószyński**  
Student informatyki z Politechniki Poznańskiej
