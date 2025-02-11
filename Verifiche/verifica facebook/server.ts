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
const connectionString = process.env.connectionStringLocal;
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
  const client = new MongoClient(connectionString);
  await client.connect().catch((err) => {
    res.status(500).send('Internal server error: ' + err);
  });
  const collection = client.db(DB_NAME).collection('users');
  collection
    .find({ username: username, password: password })
    .project({ _id: 0, img: 1 })
    .toArray()
    .catch((err) => {
      res.status(500).send({ message: 'Internal server error: ' + err });
    })
    .then((data) => {
      if (data && data.length > 0) {
        res.send(data[0]);
      } else {
        res.status(401).send({ message: 'Invalid credentials' });
      }
    })
    .finally(() => {
      client.close();
    });
});

app.get('/api/posts', async (req, res) => {
  const client = new MongoClient(connectionString);
  await client.connect().catch((err) => {
    res.status(500).send('Internal server error: ' + err);
  });
  const collection = client.db(DB_NAME).collection('posts');
  collection
    .find({})
    .toArray()
    .catch((err) => {
      res.status(500).send({ message: 'Internal server error: ' + err });
    })
    .then((data) => {
      if (!(data instanceof Array)) {
        return res.status(500).send({ message: 'Internal server error' });
      }
      res.send(data.sort((a, b) => b.date - a.date));
    })
    .finally(() => {
      client.close();
    });
});

app.post('/api/addLike', async (req, res) => {
  const id = req.body.id;
  if (!id || !(typeof id === 'string')) {
    res.status(400).send({ message: 'Missing or malformed param: id' });
  }
  const client = new MongoClient(connectionString);
  await client.connect().catch((err) => {
    res.status(500).send('Internal server error: ' + err);
  });
  const collection = client.db(DB_NAME).collection('posts');
  collection
    .updateOne({ _id: new ObjectId(id) }, { $inc: { nLike: 1 } })
    .catch((err) => {
      res.status(500).send({ message: 'Internal server error: ' + err });
    })
    .then((data) => {
      res.send(data);
    })
    .finally(() => {
      client.close();
    });
});

app.post('/api/newPost', async (req, res) => {
  const { user, pensiero } = req.body;
  const file = req['files']?.file;
  if (!user || !pensiero) {
    res.status(400).send({ message: 'Missing or malformed params' });
  }
  const client = new MongoClient(connectionString);
  await client.connect().catch((err) => {
    res.status(500).send('Internal server error: ' + err);
  });
  const collection = client.db(DB_NAME).collection('posts');
  const newPost = { user, post: pensiero, nLike: 0, date: new Date() };
  if (file) {
    newPost['img'] = generateImageName() + '.' + file.mimetype.split('/')[1];
    fs.writeFile(`static/img/photos/${newPost['img']}`, file.data, (err) => {
      if (err) {
        res.status(500).send({ message: 'Internal server error: ' + err });
        return;
      }
      collection
        .insertOne(newPost)
        .catch((err) => {
          res.status(500).send({ message: 'Internal server error: ' + err });
        })
        .then((data) => {
          res.send(data);
        })
        .finally(() => {
          client.close();
        });
    });
  }
});

function generateImageName() {
  let string = '';
  for (let i = 0; i < 20; i++) {
    string += String.fromCharCode(random(97, 122));
  }
  return string;
}

function random(a, b) {
  return Math.floor(Math.random() * (b - a) + a);
}
