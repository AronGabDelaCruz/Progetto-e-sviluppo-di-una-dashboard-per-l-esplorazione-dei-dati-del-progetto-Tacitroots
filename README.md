## Accesso alla Dashboard

È possibile accedere alla dashboard tramite il seguente link:

Link: (https://progetto-e-sviluppo-di-una-dashboar-omega.vercel.app/)

---

## Architettura del Progetto

L’applicazione è composta da tre componenti principali:

### Frontend
Sviluppato in **React** e deployato su **Vercel**

### Backend
Realizzato con **Node.js** e **Express**, deployato su **Render**

### Database
Basato su **Neo4j** e ospitato su **AuraDB**, per garantire accesso remoto e disponibilità online

## Installazione ed esecuzione del progetto con Docker

## 1. Installare Docker Desktop

Scaricare e installare Docker Desktop dal sito ufficiale:

https://www.docker.com/products/docker-desktop/

Assicurarsi che Docker Desktop sia avviato prima di procedere.

---

## 2. Scaricare il progetto

Scaricare il file `.zip` della repository GitHub:


---

## 3. Estrarre il progetto

Estrarre il file `.zip` in una cartella locale.

In caso di errore durante l’estrazione (es. “percorso troppo lungo”), rinominare la cartella estratta con un nome più corto, ad esempio:


---

## 4. Configurazione variabili d’ambiente

Nel progetto sono presenti **3 file `.env.template`**.

Questi file devono essere:

- rinominati in `.env`
- compilati con i valori corretti

---

### 4.1 File `.env` nella root del progetto

Contiene la configurazione generale del backend e del database Neo4j.

NEO4J_URI=
URI di connessione a Neo4j
Esempio: bolt://localhost:7687

NEO4J_USER=
Username del database Neo4j
Esempio: neo4j

NEO4J_PASSWORD=
Password dell’utente Neo4j
Esempio: password123

NEO4J_DATABASE=
Nome del database Neo4j (default: neo4j)
Esempio: neo4j

PORT=3001
Porta su cui gira il backend Node.js
in questo caso è gia configurato

### 4.2 File `.env` del backend

Situato nella cartella: \backend

Ha la stessa struttura del file `.env` della root e deve essere compilato allo stesso modo.

---

### 4.3 File `.env` del frontend

Situato nella cartella: \frontend

Serve a configurare l’URL del backend da cui il frontend recupera i dati.

REACT_APP_API_URL=
esempio: REACT_APP_API_URL=http://localhost:3001

## 5 Avvia di Docker
Assicurarsi che Docker Desktop sia aperto e funzionante.
Aprire un terminale nella cartella root del progetto (dove si trova il file docker-compose.yml).
Eseguire il comando:
docker compose up --build


