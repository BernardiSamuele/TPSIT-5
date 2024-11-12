import { MongoClient, ObjectId } from 'mongodb';
const connectionString = 'mongodb://localhost:27017/';
const DB_NAME = 'Biblioteca';

// query23();
// query24();
// query25();
// query26();
// query27();
// query28();
// query29();
// query30();
// query31();
query32();

async function query23() {
  const client = new MongoClient(connectionString);
  await client.connect().catch(function () {
    console.log('Errore connessione al db');
  });
  const collection = client.db(DB_NAME).collection('Biblioteca');

  const filter = {
    'posizione.stanza': 2
  };
  const projection = {
    _id: 0,
    titolo: 1,
    autore: 1
  };
  const request = collection.find(filter).project(projection).toArray();
  request.catch(function (err: Error) {
    console.log(`Errore: ${err.message}`);
  });
  request.then(function (data) {
    console.log(`Query23: ${JSON.stringify(data, null, 3)}`);
  });
  request.finally(function () {
    client.close();
  });
}

async function query24() {
  const client = new MongoClient(connectionString);
  await client.connect().catch(function () {
    console.log('Errore connessione al db');
  });
  const collection = client.db(DB_NAME).collection('Biblioteca');

  const filter = {
    'posizione.stanza': 2,
    'posizione.scaffale': 3
  };
  const projection = {
    _id: 0,
    titolo: 1,
    autore: 1,
    pubblicazioni: 1
  };
  const request = collection.find(filter).project(projection).toArray();
  request.catch(function (err: Error) {
    console.log(`Errore: ${err.message}`);
  });
  request.then(function (data) {
    console.log(`Query24: ${JSON.stringify(data, null, 3)}`);
  });
  request.finally(function () {
    client.close();
  });
}

async function query25() {
  const client = new MongoClient(connectionString);
  await client.connect().catch(function () {
    console.log('Errore connessione al db');
  });
  const collection = client.db(DB_NAME).collection('Biblioteca');

  const regex = new RegExp('^einaudi$', 'i');
  // Non si può fare una and sui sottocampi di un vettore enumerativo
  //   const filter = {
  //     'pubblicazioni.editore': regex,
  //     'pubblicazioni.anno': 2010
  //   };
  const filter = {
    pubblicazioni: { $elemMatch: { editore: regex, anno: 2010 } }
  };
  const projection = {
    _id: 0,
    titolo: 1,
    autore: 1,
    'pubblicazioni.editore': 1,
    'pubblicazioni.anno': 1
  };
  const request = collection.find(filter).project(projection).toArray();
  request.catch(function (err: Error) {
    console.log(`Errore: ${err.message}`);
  });
  request.then(function (data) {
    console.log(`Query25: ${JSON.stringify(data, null, 3)}`);
  });
  request.finally(function () {
    client.close();
  });
}

async function query26() {
  const client = new MongoClient(connectionString);
  await client.connect().catch(function () {
    console.log('Errore connessione al db');
  });
  const collection = client.db(DB_NAME).collection('Biblioteca');

  const request = collection.distinct('pubblicazioni.editore');
  request.catch(function (err: Error) {
    console.log(`Errore: ${err.message}`);
  });
  request.then(function (data) {
    console.log(`Query26: ${JSON.stringify(data, null, 3)}`);
  });
  request.finally(function () {
    client.close();
  });
}

async function query27() {
  const client = new MongoClient(connectionString);
  await client.connect().catch(function () {
    console.log('Errore connessione al db');
  });
  const collection = client.db(DB_NAME).collection('Biblioteca');

  const regexEditore = new RegExp('^mieedizioni$', 'i');
  const regexTitolo = new RegExp('^promessi sposi$', 'i');
  const filter = {
    titolo: regexTitolo,
    'pubblicazioni.editore': regexEditore
  };

  //   const projection = {
  //     'pubblicazioni.$': 1
  //   };
  const projection = {
    'pubblicazioni.anno.$': 1,
    'pubblicazioni.nPagine': 1
  };

  const request = collection.find(filter).project(projection).toArray();
  request.catch(function (err: Error) {
    console.log(`Errore: ${err.message}`);
  });
  request.then(function (data) {
    console.log(`Query27: ${JSON.stringify(data, null, 3)}`);
  });
  request.finally(function () {
    client.close();
  });
}

async function query28() {
  const client = new MongoClient(connectionString);
  await client.connect().catch(function () {
    console.log('Errore connessione al db');
  });
  const collection = client.db(DB_NAME).collection('Biblioteca');

  const regexEditore = new RegExp('^mondadori$', 'i');
  const regexTitolo = new RegExp('^Il fu Mattia Pascal$', 'i');
  const filter = {
    titolo: regexTitolo,
    'pubblicazioni.editore': regexEditore
  };

  const projection = {
    'pubblicazioni.$': 1
  };

  const request = collection.find(filter).project(projection).toArray();
  request.catch(function (err: Error) {
    console.log(`Errore: ${err.message}`);
  });
  request.then(function (data) {
    console.log(`Query28: ${JSON.stringify(data, null, 3)}`);
  });
  request.finally(function () {
    client.close();
  });
}

async function query29() {
  const client = new MongoClient(connectionString);
  await client.connect().catch(function () {
    console.log('Errore connessione al db');
  });
  const collection = client.db(DB_NAME).collection('Biblioteca');

  const regexTitolo = new RegExp('^Il fu Mattia Pascal$', 'i');
  const filter = {
    titolo: regexTitolo
  };

  const projection = {
    pubblicazioni: {
      $filter: {
        input: '$pubblicazioni',
        cond: { $eq: ['$$this.editore', 'Mondadori'] }
      }
    }
  };

  const request = collection.find(filter).project(projection).toArray();
  request.catch(function (err: Error) {
    console.log(`Errore: ${err.message}`);
  });
  request.then(function (data) {
    console.log(`Query29: ${JSON.stringify(data, null, 3)}`);
  });
  request.finally(function () {
    client.close();
  });
}

async function query30() {
  const client = new MongoClient(connectionString);
  await client.connect().catch(function () {
    console.log('Errore connessione al db');
  });
  const collection = client.db(DB_NAME).collection('Biblioteca');

  const regex = new RegExp('^einaudi$', 'i');
  const filter = {
    'pubblicazioni.editore': regex
  };

  const projection = {
    titolo: 1,
    autore: 1,
    'pubblicazioni.$': 1
  };

  const request = collection.find(filter).project(projection).toArray();
  request.catch(function (err: Error) {
    console.log(`Errore: ${err.message}`);
  });
  request.then(function (data) {
    console.log(`Query30: ${JSON.stringify(data, null, 3)}`);
  });
  request.finally(function () {
    client.close();
  });
}

async function query31() {
  const client = new MongoClient(connectionString);
  await client.connect().catch(function () {
    console.log('Errore connessione al db');
  });
  const collection = client.db(DB_NAME).collection('Biblioteca');

  const regexTitolo = new RegExp('^il fu mattia pascal$', 'i');
  const regexEditore = new RegExp('^mondadori$', 'i');
  const filter = {
    titolo: regexTitolo,
    pubblicazioni: { $elemMatch: { editore: regexEditore, anno: 2011 } }
  };

  const action = {
    $set: { 'pubblicazioni.$.anno': 2022 }
  };

  const request = collection.updateOne(filter, action);
  request.catch(function (err: Error) {
    console.log(`Errore: ${err.message}`);
  });
  request.then(function (data) {
    console.log(`Query31: ${JSON.stringify(data, null, 3)}`);
  });
  request.finally(function () {
    client.close();
  });
}

async function query32() {
  const client = new MongoClient(connectionString);
  await client.connect().catch(function () {
    console.log('Errore connessione al db');
  });
  const collection = client.db(DB_NAME).collection('Biblioteca');

  const regexEditore = new RegExp('^mondadori$', 'i');
  const filter = {
    'pubblicazioni.editore': regexEditore
  };

  const action = {
    $inc: { 'pubblicazioni.$.nPagine': 1 }
  };

  const request = collection.updateMany(filter, action);
  request.catch(function (err: Error) {
    console.log(`Errore: ${err.message}`);
  });
  request.then(function (data) {
    console.log(`Query32: ${JSON.stringify(data, null, 3)}`);
  });
  request.finally(function () {
    client.close();
  });
}
