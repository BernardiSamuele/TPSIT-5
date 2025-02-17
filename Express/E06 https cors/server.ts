'use strict';

import http from 'http';
import https from 'https';
import fs from 'fs';
import express, { NextFunction, Request, response, Response } from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';
import cors, { CorsOptions } from 'cors';
import { inviaRichiesta } from './libreria.js';

/* ********************** Config ********************** */
const app = express();
dotenv.config({ path: '.env' });
const dbName = process.env.dbName;
const connectionString = process.env.connectionStringAtlas!;

/* ********************** HTTP server ********************** */
const port = process.env.port;
let paginaErrore: string;
const server = http.createServer(app);
server.listen(port, () => {
  init();
  console.log(`HTTP server listening on port ${port}`);
});
function init() {
  fs.readFile('./static/error.html', (err, data) => {
    if (!err) {
      paginaErrore = data.toString();
    } else {
      paginaErrore = '<h1>Resource not found</h1>';
    }
  });
}
/* ********************** HTTPS server ********************** */
const HTTPS_PORT = 3001;
const privateKey = fs.readFileSync('./keys/privateKey.pem', 'utf8');
const publicKey = fs.readFileSync('./keys/publicKey.crt', 'utf8');
const credentials = {
  key: privateKey,
  cert: publicKey
};
const httpsServer = https.createServer(credentials, app);
httpsServer.listen(HTTPS_PORT, () => {
  console.log(`HTTPS server listening on port ${HTTPS_PORT}`);
});
/* ********************** Middleware ********************** */
// 1. Request log
app.use('/', (req: Request, res: Response, next: NextFunction) => {
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
    console.log('--> GET params: ' + JSON.stringify(req.query));
  }
  if (Object.keys(req.body).length > 0) {
    console.log('--> BODY params: ' + JSON.stringify(req.body));
  }
  next();
});

// 5. CORS
const whitelist = [
  'http://localhost:3000',
  // 'https://localhost:3001',
  'http://localhost:4200', // server angular
  'https://cordovaapp' // porta 443 (default)
];
const corsOptions: CorsOptions = {
  origin: function (origin, callback) {
    if (!origin)
      // browser direct call
      return callback(null, true);
    if (whitelist.indexOf(origin) === -1) {
      var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    } else return callback(null, true);
  },
  credentials: true
};
app.use('/', cors(corsOptions));
/* ********************** Client routes ********************** */
app.get('/api/unicorns', async (req: Request, res: Response) => {
  const client = new MongoClient(connectionString);
  await client.connect().catch((err) => {
    res.status(503).send(`Errore connessione al database: ${err}`);
  });
  const collection = client.db(dbName).collection('unicorns');

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

app.post('/api/vampires', async (req: Request, res: Response) => {
  const vampire = { name: req.body.name };
  const client = new MongoClient(connectionString);
  await client.connect().catch((err) => {
    res.status(503).send(`Errore connessione al database: ${err}`);
  });
  const collection = client.db(dbName).collection('vampires');

  const request = collection.insertOne(vampire);
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

app.get('/api/people', async (req: Request, res: Response) => {
  const url = `https://randomuser.me/api/?results=5`;
  const remoteResponse = await inviaRichiesta('GET', url);
  if (remoteResponse.status == 200) {
    res.send(remoteResponse.data);
  } else {
    res.status(remoteResponse.status).send(`Remote response error: ${remoteResponse.err}`);
  }
});

/* ********************** Default Route & Error Handler ********************** */
app.use('/', (req: Request, res: Response) => {
  res.status(404);
  if (!req.originalUrl.startsWith('/api/')) {
    res.send(paginaErrore);
  } else {
    res.send(`Resource not found: ${req.originalUrl}`);
  }
});

app.use((err: any, req: Request, res: Response) => {
  console.log(err.stack);
  res.status(500).send(err.message);
});
