import { MongoClient, ObjectId } from 'mongodb';
const connectionString = 'mongodb://localhost:27017/';
const DB_NAME = 'valutazioni';

query1();
query2();
query3();
query4();
query5();

async function query1() {
  const client = new MongoClient(connectionString);
  await client.connect().catch(function () {
    console.log('Errore connessione al db');
  });
  const collection = client.db(DB_NAME).collection('valutazioni');

  const filter = {
    classe: /^5.*/i,
    assenze: { $gt: 10 }
  };
  const projection = {
    _id: 0,
    nome: 1,
    classe: 1,
    assenze: 1
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
  const collection = client.db(DB_NAME).collection('valutazioni');

  const filter = {};
  const projection = {
    _id: 0,
    nome: 1,
    classe: 1,
    assenze: 1
  };
  const request = collection.find(filter).project(projection).sort({ assenze: -1 }).limit(3).toArray();
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
  const collection = client.db(DB_NAME).collection('valutazioni');

  const filter = {
    classe: '5B',
    'valutazioni.disciplina': 'informatica'
  };
  const projection = {
    _id: 0,
    nome: 1,
    'valutazioni.voto.$': 1
  };
  const request = collection.find(filter).project(projection).toArray();
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
  const collection = client.db(DB_NAME).collection('valutazioni');

  const filter = {
    classe: /^5.*/i,
    valutazioni: { $elemMatch: { disciplina: 'informatica', voto: { $gte: 9 } } }
  };
  const projection = {
    nome: 1,
    classe: 1,
    'valutazioni.voto.$': 1
  };
  const request = collection.find(filter).project(projection).toArray();
  request.catch(function (err: Error) {
    console.log(`Errore: ${err.message}`);
  });
  request.then(function (data) {
    console.log(`Query4: ${JSON.stringify(data, null, 3)}`);
  });
  request.finally(function () {
    client.close();
  });
}

async function query5() {
  const client = new MongoClient(connectionString);
  await client.connect().catch(function () {
    console.log('Errore connessione al db');
  });
  const collection = client.db(DB_NAME).collection('valutazioni');

  const filter = {
    nome: 'Alfio',
    classe: '5A'
  };
  const request = collection.updateOne(filter, {
    $addToSet: {
      valutazioni: {
        data: new Date(),
        disciplina: 'informatica',
        voto: 7
      }
    }
  });
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
