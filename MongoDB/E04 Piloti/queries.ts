import { MongoClient, ObjectId } from 'mongodb';
const connectionString = 'mongodb://localhost:27017/';
const DB_NAME = 'F1';

// query1();
// query2();
// query3();
// query4();
query4();

async function query1() {
  const client = new MongoClient(connectionString);
  await client.connect().catch(function () {
    console.log('Errore connessione al db');
  });
  const collection = client.db(DB_NAME).collection('F1');

  const filter = {
    pneumatici: { $ne: 'Pirelli' }
  };
  const projection = {
    _id: 0,
    scuderia: 1,
    pneumatici: 1
  };
  const request = collection.find(filter).project(projection).toArray();
  request.catch(function (err: Error) {
    console.log(`Errore: ${err.message}`);
  });
  request.then(function (data) {
    console.log(`Query1: ${JSON.stringify(data, null, 3)}`);
  });
  request.finally(function () {
    client.close();
  });
}

async function query2() {
  const client = new MongoClient(connectionString);
  await client.connect().catch(function () {
    console.log('Errore connessione al db');
  });
  const collection = client.db(DB_NAME).collection('F1');

  const filter = {
    motore: 'Ferrari',
    pneumatici: 'Pirelli',
    'piloti.nazione': 'Italia'
  };
  const projection = {
    _id: 0,
    scuderia: 1,
    motore: 1,
    pneumatici: 1,
    'piloti.nome.$': 1
  };
  const request = collection.find(filter).project(projection).toArray();
  request.catch(function (err: Error) {
    console.log(`Errore: ${err.message}`);
  });
  request.then(function (data) {
    console.log(`Query2: ${JSON.stringify(data, null, 3)}`);
  });
  request.finally(function () {
    client.close();
  });
}

async function query3() {
  const client = new MongoClient(connectionString);
  await client.connect().catch(function () {
    console.log('Errore connessione al db');
  });
  const collection = client.db(DB_NAME).collection('F1');

  const filter = {
    scuderia: /^mclaren.*/i
  };
  const request = collection.updateOne(filter, { $addToSet: { piloti: { nome: 'Oscar Piastri', punti: 0, data_di_nascita: '6 aprile 2001' } } });
  request.catch(function (err: Error) {
    console.log(`Errore: ${err.message}`);
  });
  request.then(function (data) {
    console.log(`Query3: ${JSON.stringify(data, null, 3)}`);
  });
  request.finally(function () {
    client.close();
  });
}

async function query4() {
  const client = new MongoClient(connectionString);
  await client.connect().catch(function () {
    console.log('Errore connessione al db');
  });
  const collection = client.db(DB_NAME).collection('F1');

  const filter = {
    piloti: { $elemMatch: { nazione: 'Regno Unito', punti: { $gt: 10 } } }
  };
  const projection = {
    _id: 0,
    scuderia: 1,
    'piloti.nome.$': 1,
    'piloti.punti': 1
  };
  const request = collection.find(filter).project(projection).toArray();
  request.catch(function (err: Error) {
    console.log(`Errore: ${err.message}`);
  });
  request.then(function (data) {
    console.log(`Query5: ${JSON.stringify(data, null, 3)}`);
  });
  request.finally(function () {
    client.close();
  });
}
