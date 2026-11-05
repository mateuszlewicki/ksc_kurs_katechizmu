# Katechizm Kościoła Katolickiego – kurs

Statyczna strona (HTML + JS, bez kompilacji) z planem kursu: terminy, spotkania online, części Katechizmu z linkami do opoka.org.pl, propozycje tematów listów apologetycznych.

- `index.html`, `app.js`, `data.js`, `meetings.js`, `covers.js`, `style.css`
- `i/*.txt` – okładki jako base64 w małych plikach, składane przez `covers.js`
- `style.css` zbudowano Tailwind CLI v3.4.17 (klasy z index.html i plików JS); ciemny tryb przez klasę `dark`.

Wdrożenie: Vercel, projekt statyczny bez kroku budowania.
