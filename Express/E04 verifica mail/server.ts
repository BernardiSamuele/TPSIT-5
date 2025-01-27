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
  const client = new MongoClient(connectionString);
  await client.connect().catch((err) => {
    res.status(500).send('Internal server error: ' + err);
  });
  const collections = client.db(DB_NAME).collection('mail');
  collections
    .find({ username: username, password: password })
    .toArray()
    .catch((err) => {
      res.status(500).send({ message: 'Internal server error: ' + err });
    })
    .then((data) => {
      if (data && data.length > 0) {
        res.status(200).send(data[0].mail);
      } else {
        res.status(401).send({ message: 'Invalid credentials' });
      }
    })
    .finally(() => {
      client.close();
    });
});

type Mail = {
  from: string;
  subject: string;
  body: string;
  attachment?: string;
};

type User = {
  name: string;
  emails: Mail[];
};
app.post('/api/sendMail', async (req, res) => {
  const { from, to, subject, message } = req.body;
  if (!from || !to || !subject || !message) {
    res.status(400).send({ message: 'Missing or malformed body' });
    return;
  }
  const attachment = req['files']?.attachment;
  const client = new MongoClient(connectionString);
  await client.connect().catch((err) => {
    res.status(500).send('Internal server error: ' + err);
  });
  const collections = client.db(DB_NAME).collection<Mail>('mail');
  collections
    .updateOne({ username: to }, { $push: { mail: { from, subject: subject, body: message, attachment: attachment?.name } } })
    .catch((err) => {
      res.status(500).send({ message: 'Internal server error: ' + err });
    })
    .then((data) => {
      console.log('\n===========================\n' + data + '\n===========================\n');
      if (data && data.modifiedCount === 1) {
        if (attachment) {
          fs.writeFile('./static/img/' + attachment.name, attachment.data, async function (err: any) {
            if (err) {
              res.status(500).send(err);
              return;
            }
            res.send({ message: 'Mail sent correctly' });
          });
        } else {
          res.send({ message: 'Mail sent correctly' });
        }
      } else {
        res.status(503).send({ message: 'User not found' });
      }
    })
    .finally(() => {
      client.close();
    });
});
