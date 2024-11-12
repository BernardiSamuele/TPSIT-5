import { MongoClient, ObjectId } from 'mongodb';
const connectionString = 'mongodb://localhost:27017/';
const DB_NAME = 'Unicorns';

// query1();
// query2();
// query3();
// query4();
// query5();
// query6();
// query7();
// query8();
// query9();
// query10();
// query11();
// query12();
// query13();
// query14();
// query15();
// query16();
// query17();
// query18();
// query19();
// query20();
// query21();
query22();

async function query1() {
  const client = new MongoClient(connectionString);
  await client.connect().catch(function () {
    console.log('Errore connessione al db');
  });
  const collection = client.db(DB_NAME).collection('Unicorns');

  const filter = {
    weight: { $gte: 700, $lte: 800 }
  };
  const projection = {
    name: 1,
    weight: 1
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
  const collection = client.db(DB_NAME).collection('Unicorns');

  const filter = {
    gender: 'm',
    loves: 'grape',
    vampires: { $gt: 60 }
  };
  const projection = {
    _id: 0,
    name: 1,
    gender: 1,
    loves: 1,
    vampires: 1
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
  const collection = client.db(DB_NAME).collection('Unicorns');

  const filter = {
    $or: [{ gender: 'f' }, { weight: { $lt: 600 } }]
  };
  const projection = {
    _id: 0,
    name: 1,
    gender: 1,
    weight: 1
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
  const collection = client.db(DB_NAME).collection('Unicorns');

  const filter = {
    $and: [{ loves: { $in: ['grape', 'apple'] } }, { vampires: { $gt: 60 } }]
  };
  const projection = {
    _id: 0,
    name: 1,
    loves: 1,
    vampires: 1
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
  const collection = client.db(DB_NAME).collection('Unicorns');

  const filter = {
    $and: [{ loves: { $all: ['grape', 'watermelon'] } }, { vampires: { $gt: 60 } }]
  };
  const projection = {
    _id: 0,
    name: 1,
    loves: 1,
    vampires: 1
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

async function query6() {
  const client = new MongoClient(connectionString);
  await client.connect().catch(function () {
    console.log('Errore connessione al db');
  });
  const collection = client.db(DB_NAME).collection('Unicorns');

  const filter = {
    hair: { $in: ['brown', 'grey'] }
  };
  const projection = {
    _id: 0,
    name: 1,
    hair: 1
  };
  const request = collection.find(filter).project(projection).toArray();
  request.catch(function (err: Error) {
    console.log(`Errore: ${err.message}`);
  });
  request.then(function (data) {
    console.log(`Query6: ${JSON.stringify(data, null, 3)}`);
  });
  request.finally(function () {
    client.close();
  });
}

async function query7() {
  const client = new MongoClient(connectionString);
  await client.connect().catch(function () {
    console.log('Errore connessione al db');
  });
  const collection = client.db(DB_NAME).collection('Unicorns');

  const filter = {
    $or: [{ vaccinated: { $exists: false } }, { vaccinated: false }]
  };
  const projection = {
    _id: 0,
    name: 1,
    vaccinated: 1
  };
  const request = collection.find(filter).project(projection).toArray();
  request.catch(function (err: Error) {
    console.log(`Errore: ${err.message}`);
  });
  request.then(function (data) {
    console.log(`Query7: ${JSON.stringify(data, null, 3)}`);
  });
  request.finally(function () {
    client.close();
  });
}

async function query8() {
  const client = new MongoClient(connectionString);
  await client.connect().catch(function () {
    console.log('Errore connessione al db');
  });
  const collection = client.db(DB_NAME).collection('Unicorns');

  // const filter = {
  //   gender: 'm',
  //   loves: { $not: { $in: ['apple'] } },
  // };
  const filter = {
    gender: 'm',
    loves: { $nin: ['apple'] }
  };
  const projection = {
    _id: 0,
    name: 1,
    loves: 1
  };
  const request = collection.find(filter).project(projection).toArray();
  request.catch(function (err: Error) {
    console.log(`Errore: ${err.message}`);
  });
  request.then(function (data) {
    console.log(`Query8: ${JSON.stringify(data, null, 3)}`);
  });
  request.finally(function () {
    client.close();
  });
}

async function query9() {
  const client = new MongoClient(connectionString);
  await client.connect().catch(function () {
    console.log('Errore connessione al db');
  });
  const collection = client.db(DB_NAME).collection('Unicorns');

  const regexName = new RegExp('^A', 'i');
  const regexGender = new RegExp('^f$', 'i');
  const filter = {
    name: regexName,
    gender: regexGender
  };
  const projection = {
    name: 1,
    gender: 1
  };
  const request = collection.find(filter).project(projection).toArray();
  request.catch(function (err: Error) {
    console.log(`Errore: ${err.message}`);
  });
  request.then(function (data) {
    console.log(`Query9: ${JSON.stringify(data, null, 3)}`);
  });
  request.finally(function () {
    client.close();
  });
}

async function query10() {
  const client = new MongoClient(connectionString);
  await client.connect().catch(function () {
    console.log('Errore connessione al db');
  });
  const collection = client.db(DB_NAME).collection('Unicorns');

  const objectId = new ObjectId('6710ef604cb8d4782e28c32d');

  const filter = {
    _id: objectId
  };
  const projection = {
    name: 1
  };
  const request = collection.find(filter).project(projection).toArray();
  request.catch(function (err: Error) {
    console.log(`Errore: ${err.message}`);
  });
  request.then(function (data) {
    console.log(`Query10: ${JSON.stringify(data, null, 3)}`);
  });
  request.finally(function () {
    client.close();
  });
}

async function query11() {
  const client = new MongoClient(connectionString);
  await client.connect().catch(function () {
    console.log('Errore connessione al db');
  });
  const collection = client.db(DB_NAME).collection('Unicorns');

  const filter = {
    gender: 'm'
  };
  const projection = {
    _id: 0,
    name: 1,
    vampires: 1
  };
  const request = collection.find(filter).project(projection).sort({ vampires: -1 }).limit(3).skip(1).toArray();
  request.catch(function (err: Error) {
    console.log(`Errore: ${err.message}`);
  });
  request.then(function (data) {
    console.log(`Query11: ${JSON.stringify(data, null, 3)}`);
  });
  request.finally(function () {
    client.close();
  });
}

async function query12() {
  const client = new MongoClient(connectionString);
  await client.connect().catch(function () {
    console.log('Errore connessione al db');
  });
  const collection = client.db(DB_NAME).collection('Unicorns');

  const filter = {
    weight: { $gt: 500 }
  };
  const request = collection.countDocuments(filter);
  request.catch(function (err: Error) {
    console.log(`Errore: ${err.message}`);
  });
  request.then(function (data) {
    console.log(`Query12: ${JSON.stringify(data, null, 3)}`);
  });
  request.finally(function () {
    client.close();
  });
}

async function query13() {
  const client = new MongoClient(connectionString);
  await client.connect().catch(function () {
    console.log('Errore connessione al db');
  });
  const collection = client.db(DB_NAME).collection('Unicorns');

  const filter = {
    name: 'Aurora'
  };
  const projection = {
    weight: 1,
    hair: 1
  };
  const request = collection.findOne(filter, { projection });
  request.catch(function (err: Error) {
    console.log(`Errore: ${err.message}`);
  });
  request.then(function (data) {
    console.log(`Query13: ${JSON.stringify(data, null, 3)}`);
  });
  request.finally(function () {
    client.close();
  });
}

async function query14() {
  const client = new MongoClient(connectionString);
  await client.connect().catch(function () {
    console.log('Errore connessione al db');
  });
  const collection = client.db(DB_NAME).collection('Unicorns');

  const filter = {
    gender: 'f'
  };
  const request = collection.distinct('loves', filter);
  request.catch(function (err: Error) {
    console.log(`Errore: ${err.message}`);
  });
  request.then(function (data) {
    console.log(`Query14: ${JSON.stringify(data, null, 3)}`);
  });
  request.finally(function () {
    client.close();
  });
}

async function query15() {
  const client = new MongoClient(connectionString);
  await client.connect().catch(function () {
    console.log('Errore connessione al db');
  });
  const collection = client.db(DB_NAME).collection('Unicorns');

  const unicorn = {
    name: 'pippo',
    gender: 'm',
    vampires: 123
  };
  const request = collection.insertOne(unicorn);
  request.catch(function (err: Error) {
    console.log(`Errore: ${err.message}`);
    client.close();
  });
  request.then(function (data) {
    console.log(`Query15a: ${JSON.stringify(data, null, 3)}`);
    const request = collection.deleteMany({ name: 'pippo' });
    request.catch(function (err) {
      console.log(`Errore: ${err.message}`);
    });
    request.then(function (data) {
      console.log(`Query15b: ${JSON.stringify(data, null, 3)}`);
    });
    request.finally(function () {
      client.close();
      console.log('Query15: Finally');
    });
  });
}

async function query16() {
  const client = new MongoClient(connectionString);
  await client.connect().catch(function () {
    console.log('Errore connessione al db');
  });
  const collection = client.db(DB_NAME).collection('Unicorns');

  const filter = {
    name: 'Pilot'
  };
  const action = {
    $inc: { vampires: 1 }
  };
  const request = collection.updateOne(filter, action);
  request.catch(function (err: Error) {
    console.log(`Errore: ${err.message}`);
  });
  request.then(function (data) {
    console.log(`Query16: ${JSON.stringify(data, null, 3)}`);
  });
  request.finally(function () {
    client.close();
  });
}

async function query17() {
  const client = new MongoClient(connectionString);
  await client.connect().catch(function () {
    console.log('Errore connessione al db');
  });
  const collection = client.db(DB_NAME).collection('Unicorns');

  const filter = {
    name: 'Aurora'
  };
  const action = {
    $addToSet: { loves: 'carrot' },
    $set: { residenza: 'Fossano' },
    $inc: { weight: 10 }
  };
  const request = collection.updateOne(filter, action);
  request.catch(function (err: Error) {
    console.log(`Errore: ${err.message}`);
  });
  request.then(function (data) {
    console.log(`Query17: ${JSON.stringify(data, null, 3)}`);
  });
  request.finally(function () {
    client.close();
  });
}

async function query18() {
  const client = new MongoClient(connectionString);
  await client.connect().catch(function () {
    console.log('Errore connessione al db');
  });
  const collection = client.db(DB_NAME).collection('Unicorns');

  const filter = {
    name: 'Pluto'
  };
  const action = {
    $inc: { vampires: 1 }
  };
  const request = collection.updateOne(filter, action, { upsert: true });
  request.catch(function (err: Error) {
    console.log(`Errore: ${err.message}`);
  });
  request.then(function (data) {
    console.log(`Query18: ${JSON.stringify(data, null, 3)}`);
  });
  request.finally(function () {
    client.close();
  });
}

async function query19() {
  const client = new MongoClient(connectionString);
  await client.connect().catch(function () {
    console.log('Errore connessione al db');
  });
  const collection = client.db(DB_NAME).collection('Unicorns');

  const filter = {
    vaccinated: { $exists: false }
  };
  const action = {
    $set: { vaccinated: false }
  };
  const request = collection.updateMany(filter, action);
  request.catch(function (err: Error) {
    console.log(`Errore: ${err.message}`);
  });
  request.then(function (data) {
    console.log(`Query19: ${JSON.stringify(data, null, 3)}`);
  });
  request.finally(function () {
    client.close();
  });
}

async function query20() {
  const client = new MongoClient(connectionString);
  await client.connect().catch(function () {
    console.log('Errore connessione al db');
  });
  const collection = client.db(DB_NAME).collection('Unicorns');

  const filter = {
    loves: { $all: ['carrot', 'grape'] }
  };
  const request = collection.deleteMany(filter);
  request.catch(function (err: Error) {
    console.log(`Errore: ${err.message}`);
  });
  request.then(function (data) {
    console.log(`Query20: ${JSON.stringify(data, null, 3)}`);
  });
  request.finally(function () {
    client.close();
  });
}

async function query21() {
  const client = new MongoClient(connectionString);
  await client.connect().catch(function () {
    console.log('Errore connessione al db');
  });
  const collection = client.db(DB_NAME).collection('Unicorns');

  const filter = {
    gender: 'f'
  };
  const projection = {
    name: 1,
    vampires: 1
  };
  const request = collection.find(filter).project(projection).sort({ vampires: -1 }).limit(1).toArray();
  request.catch(function (err: Error) {
    console.log(`Errore: ${err.message}`);
  });
  request.then(function (data) {
    console.log(`Query21: ${JSON.stringify(data, null, 3)}`);
  });
  request.finally(function () {
    client.close();
  });
}

async function query22() {
  const client = new MongoClient(connectionString);
  await client.connect().catch(function () {
    console.log('Errore connessione al db');
  });
  const collection = client.db(DB_NAME).collection('Unicorns');

  const unicorn = {
    name: 'PincoPallino',
    gender: 'm',
    age: 20
  };
  const request = collection.insertOne(unicorn);
  request.catch(function (err: Error) {
    console.log(`Errore: ${err.message}`);
    client.close();
  });
  request.then(function (data) {
    console.log(`Query22a: ${JSON.stringify(data, null, 3)}`);
    const filter = {
      name: 'PincoPallino'
    };
    const newUnicorn = {
      name: 'Tex',
      loves: ['grape', 'melon'],
      age: 55
    };
    const request = collection.replaceOne(filter, newUnicorn);
    request.catch(function (err: Error) {
      console.log(`Errore: ${err.message}`);
    });
    request.then(function (data) {
      console.log(`Query22b: ${JSON.stringify(data, null, 3)}`);
    });
    request.finally(function () {
      client.close();
    });
  });
}
