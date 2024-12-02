import http from 'http';
import url from 'url';
import fs from 'fs';
import app from './dispatcher';
import headers from './headers.json';

import { MongoClient, ObjectId } from 'mongodb';
const connectionString = 'mongodb://localhost:27017/';
const DB_NAME = 'F1';

/* ********************** */
const port = 1337;

const server = http.createServer((req, res) => {
  app.dispatch(req, res);
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

app.addListener('GET', '/api/scuderie', async (req, res) => {
  const client = new MongoClient(connectionString);
  await client.connect().catch(function () {
    console.log('Errore connessione al db');
    res.writeHead(500, headers.json);
    res.write(JSON.stringify({ res: 'Internal server error' }));
    res.end();
  });
  const collection = client.db(DB_NAME).collection('F1');

  const filter = {};
  const projection = {
    scuderia: 1
  };
  const request = collection.find(filter).project(projection).sort({ scuderia: 1 }).toArray();
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

app.addListener('GET', '/api/piloti', async (req, res) => {
  const { id } = req.GET;
  const client = new MongoClient(connectionString);
  await client.connect().catch(function () {
    console.log('Errore connessione al db');
    res.writeHead(500, headers.json);
    res.write(JSON.stringify({ res: 'Internal server error' }));
    res.end();
  });
  const collection = client.db(DB_NAME).collection('F1');

  const filter = {
    _id: new ObjectId(id)
  };
  const projection = {
    _id: 0,
    piloti: 1
  };
  const request = collection.findOne(filter, { projection });
  request.catch(function (err: Error) {
    res.writeHead(500, headers.json);
    res.write(JSON.stringify({ res: 'Internal server error' }));
    res.end();
  });
  request.then(function (data) {
    res.writeHead(200, headers.json);
    res.write(JSON.stringify(data?.piloti));
    res.end();
  });
  request.finally(function () {
    client.close();
  });
});
