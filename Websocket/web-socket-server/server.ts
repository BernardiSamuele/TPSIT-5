import http from 'http';
import url from 'url';
import fs from 'fs';
import express, { response } from 'express';
import { Server, Socket } from 'socket.io';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';
import { error } from 'console';

const app = express();

let paginaErr: string;

//MONGO
dotenv.config({ path: '.env' });
const connectionString = process.env.connectionStringLocal;
const DB_NAME = process.env.dbName;
const PORT = process.env.PORT;
console.log(connectionString);

//la callback di create server viene eseguita ad ogni richiesta giunta dal client
const httpServer = http.createServer(app).listen(PORT, () => {
  console.log('Server listening on port: ' + PORT);
});

function init() {
  fs.readFile('./static/error.html', (err, data) => {
    if (!err) {
      paginaErr = data.toString();
    } else {
      paginaErr = '<h1>Not Found</h1>';
    }
  });
}

//Middleware
//1. Request log
app.use('/', (req: any, res: any, next: any) => {
  console.log(req.method + ': ' + req.originalUrl);
  next();
});

//2. Static resource
app.use('/', express.static('./static'));

//3. Body params
//Queste due entry servono per agganciare i parametri nel body
app.use('/', express.json({ limit: '10mb' }));
app.use('/', express.urlencoded({ limit: '10mb', extended: true }));

//4. Upload config
app.use('/', fileUpload({ limits: { fileSize: 10 * 1024 * 1024 } }));

//5. Params log
app.use('/', (req: any, res: any, next: any) => {
  if (Object.keys(req.query).length > 0) {
    console.log('--> parametri  GET: ' + JSON.stringify(req.query));
  }
  if (Object.keys(req.body).length > 0) {
    console.log('--> parametri  BODY: ' + JSON.stringify(req.body));
  }
  next();
});

//6. CORS
const whitelist = ['http://localhost:3000', 'https://localhost:3001', 'http://localhost:4200'];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin)
      // browser direct call
      return callback(null, true);
    if (whitelist.indexOf(origin) === -1) {
      var msg = `The CORS policy for this site does not
    allow access from the specified Origin.`;
      return callback(new Error(msg), false);
    } else return callback(null, true);
  },
  credentials: true
};

app.use('/', cors(corsOptions));
//Client routes

app.get('/api/users', async (req: any, res: any, next: any) => {
  const collectionName = 'users';
  const filter = req.query || {};
  if (filter.occupato) {
    filter.occupato = filter.occupato === 'true';
  }
  const client = new MongoClient(connectionString);
  await client.connect();
  const collections = client.db(DB_NAME).collection(collectionName);
  collections
    .find(filter)
    .toArray()
    .catch(err => {
      res.status(500).send('Collections access error: ' + err);
    })
    .then(data => {
      res.send(data);
    })
    .finally(() => {
      client.close();
    });
});

app.patch('/api/users/:id', async (req: any, res: any, next: any) => {
  const collectionName = 'users';
  const { id } = req.params;
  const client = new MongoClient(connectionString);
  await client.connect();
  const collections = client.db(DB_NAME).collection(collectionName);
  collections
    .updateOne({ _id: new ObjectId(id as string) }, { $set: { occupato: false } })
    .catch(err => {
      res.status(500).send('Collections access error: ' + err);
    })
    .then(data => {
      res.send(data);
    })
    .finally(() => {
      client.close();
    });
});

//Default Route & Error Handler
app.use('/', (req: any, res: any, next: any) => {
  res.status(404);
  if (!req.originalUrl.startsWith('/api/')) {
    res.send(paginaErr);
  } else {
    res.send('Not Found: Resource ' + req.originalUrl);
  }
});

app.use((err: any, req: any, res: any, next: any) => {
  console.log(err.stack);
  res.status(500).send(err.message);
});

const wsServer = new Server(httpServer, { cors: { origin: '*' } });
const users: any = [];
wsServer.on('connection', clientSocket => {
  console.log(`Connection accepted: ${clientSocket.id}`);
  clientSocket.on('join-room', clientUser => {
    const user = JSON.parse(clientUser);
    console.log(`User ${user.username} joined room ${user.room}`);
    users.push(user);
    clientSocket.join(user.room);
    clientSocket.emit('join-result', 'ok');
  });
});
