import http from 'http';
import url from 'url';
import fs from 'fs';
import app from './dispatcher';
import headers from './headers.json';

import { MongoClient, ObjectId } from 'mongodb';
const connectionString = 'mongodb://localhost:27017/';
const DB_NAME = 'valutazioni';

/* ********************** */
const port = 1337;

const server = http.createServer((req, res) => {
  app.dispatch(req, res);
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

app.addListener('GET', '/api/classi', async (req, res) => {
  const client = new MongoClient(connectionString);
  await client.connect().catch(function () {
    console.log('Errore connessione al db');
    res.writeHead(500, headers.json);
    res.write(JSON.stringify({ res: 'Internal server error' }));
    res.end();
  });
  const collection = client.db(DB_NAME).collection('valutazioni');

  const request = collection.distinct('classe');
  request.catch(function (err: Error) {
    res.writeHead(500, headers.json);
    res.write(JSON.stringify({ res: 'Internal server error' }));
    res.end();
  });
  request.then(function (data) {
    res.writeHead(200, headers.json);
    res.write(JSON.stringify(data));
    res.end();
  });
  request.finally(function () {
    client.close();
  });
});

app.addListener('GET', '/api/studenti', async (req, res) => {
  let { classe, genere } = req['GET'];
  genere = JSON.parse(genere);

  const client = new MongoClient(connectionString);
  await client.connect().catch(function () {
    console.log('Errore connessione al db');
    res.writeHead(500, headers.json);
    res.write(JSON.stringify({ res: 'Internal server error' }));
    res.end();
  });
  const collection = client.db(DB_NAME).collection('valutazioni');

  const request = collection
    .find({ classe, genere: { $in: genere } })
    .project({ nome: 1, valutazioni: 1 })
    .toArray();
  request.catch(function (err: Error) {
    res.writeHead(500, headers.json);
    res.write(JSON.stringify({ res: 'Internal server error' }));
    res.end();
  });
  request.then(function (data) {
    res.writeHead(200, headers.json);
    res.write(JSON.stringify(data));
    res.end();
  });
  request.finally(function () {
    client.close();
  });
});

app.addListener('GET', '/api/dettagli', async (req, res) => {
  const { id } = req.GET;

  const client = new MongoClient(connectionString);
  await client.connect().catch(function () {
    console.log('Errore connessione al db');
    res.writeHead(500, headers.json);
    res.write(JSON.stringify({ res: 'Internal server error' }));
    res.end();
  });
  const collection = client.db(DB_NAME).collection('valutazioni');

  const request = collection.findOne({ _id: new ObjectId(id) }, { projection: { nome: 1, classe: 1, assenze: 1, dob: 1 } });
  request.catch(function (err: Error) {
    res.writeHead(500, headers.json);
    res.write(JSON.stringify({ res: 'Internal server error' }));
    res.end();
  });
  request.then(function (data) {
    res.writeHead(200, headers.json);
    res.write(JSON.stringify(data));
    res.end();
  });
  request.finally(function () {
    client.close();
  });
});
