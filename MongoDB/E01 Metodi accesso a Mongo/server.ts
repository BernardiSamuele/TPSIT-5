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
// const server = http.createServer(function (req, res) {
//   app.dispatch(req, res);
// });

// server.listen(PORT, function () {
//   console.log(`Server listening on port: ${PORT}`);
// });

find();
countDocuments();
insert();
update();
deleteUnicorn();

async function find() {
  // Crea un nuovo client di connessione al server
  const client = new MongoClient(connectionString);
  await client.connect().catch(function () {
    console.log('Errore connessione al db');
  });
  const collection = client.db(DB_NAME).collection('Unicorns');

  const request = collection.find({ gender: 'm', hair: 'grey' }).project({ _id: 0, name: 1, loves: 1 }).sort({ name: 1 }).toArray();
  request.catch(function (err: Error) {
    console.log(`Errore: ${err.message}`);
  });
  request.then(function (data) {
    console.log(`Find: ${JSON.stringify(data, null, 3)}`);
  });
  request.finally(function () {
    client.close();
  });
}

async function countDocuments() {
  // Crea un nuovo client di connessione al server
  const client = new MongoClient(connectionString);
  await client.connect().catch(function () {
    console.log('Errore connessione al db');
  });
  const collection = client.db(DB_NAME).collection('Unicorns');

  const request = collection.countDocuments({ gender: 'm' });
  request.catch(function (err: Error) {
    console.log(`Errore: ${err.message}`);
  });
  request.then(function (data) {
    console.log(`Count: ${data}`);
  });
  request.finally(function () {
    client.close();
  });
}

async function insert() {
  // Crea un nuovo client di connessione al server
  const client = new MongoClient(connectionString);
  await client.connect().catch(function () {
    console.log('Errore connessione al db');
  });
  const collection = client.db(DB_NAME).collection('Unicorns');

  const unicorn = {
    name: 'Pippo',
    loves: ['Grapes', 'Watermelon'],
    vampires: 456,
    hair: 'grey',
    gender: 'm',
    weight: 700,
  };

  const request = collection.insertOne(unicorn);
  request.catch(function (err: Error) {
    console.log(`Errore: ${err.message}`);
  });
  request.then(function (data) {
    console.log(`Insertion: ${JSON.stringify(data, null, 3)}`);
  });
  request.finally(function () {
    client.close();
  });
}

async function update() {
  // Crea un nuovo client di connessione al server
  const client = new MongoClient(connectionString);
  await client.connect().catch(function () {
    console.log('Errore connessione al db');
  });
  const collection = client.db(DB_NAME).collection('Unicorns');

  const request = collection.updateMany({ name: 'Pippo' }, { $set: { weight: 600 } });
  request.catch(function (err: Error) {
    console.log(`Errore: ${err.message}`);
  });
  request.then(function (data) {
    console.log(`Update: ${JSON.stringify(data, null, 3)}`);
  });
  request.finally(function () {
    client.close();
  });
}

async function deleteUnicorn() {
  // Crea un nuovo client di connessione al server
  const client = new MongoClient(connectionString);
  await client.connect().catch(function () {
    console.log('Errore connessione al db');
  });
  const collection = client.db(DB_NAME).collection('Unicorns');

  const request = collection.deleteMany({ name: 'Pippo' });
  request.catch(function (err: Error) {
    console.log(`Errore: ${err.message}`);
  });
  request.then(function (data) {
    console.log(`Delete: ${JSON.stringify(data, null, 3)}`);
  });
  request.finally(function () {
    client.close();
  });
}
