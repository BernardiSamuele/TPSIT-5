import http from 'http';
import fs from 'fs';
import app from './dispatcher';
import headers from './headers.json';
const PORT = 1337;

// MONGO
import { MongoClient } from 'mongodb';
const connectionString = 'mongodb://localhost:27017/';
const DB_NAME = 'Unicorns';

// La callback di createServer viene eseguita ogni volta che arriva una richiesta dal client
const server = http.createServer(function (req, res) {
  app.dispatch(req, res);
});

server.listen(PORT, function () {
  console.log(`Server listening on port: ${PORT}`);
});

/* *** Listeners *** */
app.addListener('GET', '/api/getUnicorns', async (req: any, res: any) => {
  const { gender } = req['GET'];

  const client = new MongoClient(connectionString);
  await client.connect().catch(function () {
    console.log('Errore connessione al db');
  });
  const collection = client.db(DB_NAME).collection('Unicorns');

  const request = collection.find({ gender }).toArray();
  request.catch(function (err: Error) {
    console.log(`Errore: ${err.message}`);
    res.writeHead(500, headers.text);
    res.write('Errore esecuzione query');
    res.end();
  });
  request.then(function (data) {
    console.log(`Find: ${JSON.stringify(data, null, 3)}`);
    res.writeHead(200, headers.json);
    res.write(JSON.stringify(data, null, 3));
    res.end();
  });
  request.finally(function () {
    client.close();
  });
});
