'use strict';

import http from 'http';
import fs from 'fs';
import express, { NextFunction, Request, Response } from 'express';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

/* ********************** Mongo config ********************** */
dotenv.config({ path: '.env' });
const dbName = process.env.dbName;
const connectionString = process.env.connectionStringAtlas!;

/* ********************** HTTP server ********************** */
const port = 3000;
let paginaErrore: string;
const app = express();
const server = http.createServer(app);
server.listen(port, () => {
  init();
  console.log(`Server listening on port ${port}`);
});
function init() {
  fs.readFile('./static/error.html', (err, data) => {
    if (!err) {
      paginaErrore = data.toString();
    } else {
      paginaErrore = '<h1>Risorsa non trovata</h1>';
    }
  });
}
/* ********************** Middleware ********************** */
// 1. Request log
app.use('/', (req: any, res: any, next: any) => {
  console.log(req.method + ': ' + req.originalUrl);
  next();
});

// 2. Static resources
app.use('/', express.static('./static'));

// 3. Body params
app.use('/', express.json({ limit: '50mb' })); // Parsifica i parametri in formato json
app.use('/', express.urlencoded({ limit: '50mb', extended: true })); // Parsifica i parametri urlencoded

// 4. Params log
app.use('/', (req, res, next) => {
  if (Object.keys(req.query).length > 0) {
    console.log('--> Parametri GET: ' + JSON.stringify(req.query));
  }
  if (Object.keys(req.body).length > 0) {
    console.log('--> Parametri BODY: ' + JSON.stringify(req.body));
  }
  next();
});

/* ********************** Client routes ********************** */
app.get('/api/getCollections', async (req: Request, res: Response, next: NextFunction) => {
  const client = new MongoClient(connectionString);
  await client.connect();
  const db = client.db(dbName);
  const request = db.listCollections().toArray();
  request.then((data) => {
    res.send(data);
  });
  request.catch((err) => {
    res.status(500).send(`Collections access error: ${err}`);
  });
  request.finally(() => {
    client.close();
  });
});

app.get('/api/:collection', async (req: Request, res: Response, next: NextFunction) => {
  const collectionName = req.params.collection;
  const client = new MongoClient(connectionString);
  await client.connect();
  const collection = client.db(dbName).collection(collectionName);
  const request = collection.find({}).toArray();
  request.catch((err) => {
    res.status(500).send(`Errore esecuzione query: ${err}`);
  });
  request.then((data) => {
    res.send(data);
  });
  request.finally(() => {
    client.close();
  });
});

/* ********************** Default Route & Error Handler ********************** */
app.use('/', (req: Request, res: Response, next: NextFunction) => {
  res.status(404);
  if (!req.originalUrl.startsWith('/api/')) {
    res.send(paginaErrore);
  } else {
    res.send(`Resource not found: ${req.originalUrl}`);
  }
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.log(err.stack);
  res.status(500).send(err.message);
});
