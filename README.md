# Telepítés

Az `npm i` parancs kiadása minden szükséges csomagot telepít az csomagkezelő segítségével.
Ehhez szükséges, hogy legyen telepített Node.JS és npm az eszközön.
A fejlesztés során a node 16.13.1-es, míg az npm 8.1.2-es verziója volt használva.

# Szükséges beállítások a futtatás előtt

Az src/communication/data.json állományban a "base_uri" címet be kell állítani a megfelelő backend címre.
Alapértelmezetten ez a https://localhost:4000-re van állítva.

# Futtatás fejlesztés során

Az `npm start` parancs kiadás hatására elindul a frontend hot reload üzemmódban, mely a localhost 3000-es portján tekinthető meg.

# Tesztelés

(Linux rendszereken az apt-get parancs segítségével további csomagok is telepítendőek a Cypresshez, Windowson erre nincs szükség!)
Az adatbázisban lévő objektumokat célszerű a tesztelés előtt törölni, hiszen bár csekély az esélye, de lehetséges, hogy az e-mail címek generálása során két egyforma generálódik két külön tesztben, mely a tesztek hibás futásátá eredményezné. 
Az `npm run e2e` parancs hatására megnyílik a cypress tesztelő környezete, ahol kiválasztható az egyetlen tesztállomány futtatása.
A fejlesztés során a tesztek a Chrome 100-as verziójában futottak.
Fontos megjegyzés, hogy a backend paramétereinek megfelelően illeszkedniük a frontendes tesztek futásához, ellenkező esetben nem generálódik például számla és nem lesz ismerhető az éttermek PIN kódja.
.env fájl megkötései a backenden: 
- TESTING=0 \
- PRODUCTION=0 

Emelett a cypress/integration/all-page-tests/main.spec.js fájl két fontos URL-t haszál. A frontend url-jét, mely a FRONTEND_URL változó segítségével állítható, alapból a `http://localhost:3000` cím van beállítva. A másik pedig a már korábban ismertett backend URL, amely a communication/data.json fájlban állítható.

# Build

Az `npm run build` segítségével készíthető el az optimalizált változat. Fontos kiemelni, hogy a public mappában elérhető build.zip állományt frissen kell tartani, amennyiben a scheduler projektből új build áll elő.

# Build futtatása

A `serve -s build -l 3000` parancs hatására elindul a `http://localhost:3000` címen a build mappában található kliens.
Ajánlott ezt a változatot futtani a teszteléshez, hiszen sokkal gyorsabb, mint az `npm start` nyomán induló kliens.
A `serve` csomag a következő paranccsal telepíthető: `npm install -g serve`.
Lehetséges, hogy a backend-et külön biztonságosnak kell nyilvánítani a böngészőben, ezt a `https://localhost:4000`-es cím vagy az átállított backend cím elérésével lehet megtenni, ahol a speciális beállításoknál el kell fogadni, hogy kockázatok mellett lépünk tovább.