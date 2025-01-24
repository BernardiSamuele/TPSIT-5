import http from 'http';
import url from 'url';
import fs from 'fs';
import express, { response } from 'express';
import cors from 'cors';
import fileUpload from 'express-fileupload';

const app = express();

let paginaErr: string;

//MONGO
import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });
const connectionString = process.env.connectionStringAtlas;
const DB_NAME = process.env.dbName;
const PORT = process.env.PORT;
console.log(connectionString);

//la callback di create server viene eseguita ad ogni richiesta giunta dal client
http.createServer(app).listen(PORT, () => {
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

//3. Buddy params
//Queste due entry ervono per agganciare i parametri nel body
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
const whitelist = [
  'http://my-crud-server.herokuapp.com ', // porta 80 (default)
  'https://my-crud-server.herokuapp.com ', // porta 443 (default)
  'http://localhost:3000',
  'https://localhost:3001',
  'http://localhost:4200', // server angular
  'https://cordovaapp' // porta 443 (default)
];

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

//Client routes

app.post('/login', async (req) => {
  const client = new MongoClient(connectionString);
  await client.connect();
  const collections = client.db(DB_NAME).collection('Mail');
  collections
    .find()
    .toArray()
    .catch((err) => {
      res.status(500).send('Collections access error: ' + err);
    })
    .then((data) => {
      res.send(data);
    })
    .finally(() => {
      client.close();
    });
});
