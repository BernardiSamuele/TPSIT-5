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

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  console.log(req.body.username);
  const client = new MongoClient(connectionString);
  await client.connect().catch((err) => {
    res.status(500).send('Internal server error: ' + err);
  });
  const collection = client.db(DB_NAME).collection('utenti');
  collection
    .find({ username, password })
    .toArray()
    .catch((err) => {
      res.status(500).send({ message: 'Internal server error: ' + err });
    })
    .then((data) => {
      if (data && data.length > 0) {
        res.send({ message: 'Login successful' });
      } else {
        res.status(401).send({ message: 'Invalid credentials' });
      }
    })
    .finally(() => {
      client.close();
    });
});

app.post('/api/signup', async (req, res) => {
  const username = req.body?.username;
  const password = req.body?.password;
  const img = req['files']?.img;
  if (!username || !password || !img) {
    res.status(400).send({ message: 'Missing parameters' });
    return;
  }
  console.log(req.body.username);
  const client = new MongoClient(connectionString);
  await client.connect().catch((err) => {
    res.status(500).send('Internal server error: ' + err);
  });
  const collection = client.db(DB_NAME).collection('utenti');
  collection
    .find({ username })
    .toArray()
    .catch((err) => {
      res.status(500).send({ message: 'Internal server error: ' + err });
      client.close();
    })
    .then((data) => {
      if (data && data.length > 0) {
        res.status(422).send({ message: 'Username already existing' });
        client.close();
      } else {
        collection
          .insertOne({ username, password })
          .catch((err) => {
            res.status(500).send({ message: 'Internal server error: ' + err });
          })
          .then((data) => {
            fs.writeFile(`static/img/${username}.jpg`, img.data, (err) => {
              if (err) {
                res.status(500).send({ message: 'Internal server error: ' + err });
              } else {
                res.send(data);
              }
            });
          })
          .finally(() => {
            client.close();
          });
      }
    });
});

app.get('/api/search', async (req, res) => {
  const q = req.query?.q;
  if (!q || !(typeof q === 'string')) {
    res.status(400).send({ message: 'Missing or malformed params' });
    return;
  }
  const keys = q.split(' ').map((k) => new RegExp(`\\b${k}.*`, 'i'));
  const client = new MongoClient(connectionString);
  await client.connect().catch((err) => {
    res.status(500).send('Internal server error: ' + err);
  });
  const collection = client.db(DB_NAME).collection('voci');
  collection
    .find({ voci: { $all: keys } }, { projection: { _id: 1, voci: 1 } })
    .sort({ nClick: -1 })
    .toArray()
    .catch((err) => {
      res.status(500).send({ message: 'Internal server error: ' + err });
    })
    .then((data) => {
      res.send(data);
    });
});

app.get('/api/links', async (req, res) => {
  const _id = req.query?._id;
  if (!_id || !(typeof _id === 'string')) {
    res.status(400).send({ message: 'Missing or malformed params' });
    return;
  }
  const client = new MongoClient(connectionString);
  await client.connect().catch((err) => {
    res.status(500).send('Internal server error: ' + err);
  });
  const collection = client.db(DB_NAME).collection('link');
  collection
    .find({ codVoce: _id })
    .toArray()
    .catch((err) => {
      res.status(500).send({ message: 'Internal server error: ' + err });
    })
    .then((data) => {
      res.send(data);
    });
});

app.patch('/api/incrementClicks', async (req, res) => {
  const _id = req.body?._id;
  const client = new MongoClient(connectionString);
  await client.connect().catch((err) => {
    res.status(500).send('Internal server error: ' + err);
  });
  const collection = client.db(DB_NAME).collection('voci');
  collection
    .updateOne({ _id }, { $inc: { nClick: 1 } })
    .catch((err) => {
      res.status(500).send({ message: 'Internal server error: ' + err });
    })
    .then((data) => {
      res.send(data);
    });
});
