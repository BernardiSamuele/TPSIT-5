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

app.get('/api/images', async (req: any, res: any, next: any) => {
  const client = new MongoClient(connectionString);
  await client.connect();
  const collections = client.db(DB_NAME).collection('images');
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

app.post('/api/uploadBinary', async (req: any, res: any, next: any) => {
  const { user } = req['body'];
  const { img } = req['files'];

  fs.writeFile('./static/img/' + img.name, img.data, async function (err: any) {
    if (err) {
      res.status(500).send(err.message);
    } else {
      const newUser = {
        username: user,
        img: img.name
      };
      const client = new MongoClient(connectionString);
      await client.connect().catch(function (err) {
        res.status(503).send("Error: connection to DB server didn't went throught");
      });
      let collection = client.db(DB_NAME).collection('images');
      collection
        .insertOne(newUser)
        .then(function (data) {
          res.send(data);
        })
        .catch(function (err) {
          res.status(500).send('Error: wrong query execution; ' + err.message);
        })
        .finally(function () {
          client.close();
        });
    }
  });
});

app.post('/api/uploadBase64', async (req, res) => {
  const { user, imgName } = req.body;
  const { img } = req.body;
  if (img && imgName) {
    const client = new MongoClient(connectionString);
    await client.connect().catch((err) => {
      res.status(500).send('Internal server error');
    });
    const collection = client.db(DB_NAME).collection('images');
    const command = collection.insertOne({ username: user, img });
    command.then((data) => {
      res.send(data);
    });
    command.catch((err) => {
      res.status(500).send('Internal server error');
    });
    command.finally(() => {
      client.close();
    });
  }
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
