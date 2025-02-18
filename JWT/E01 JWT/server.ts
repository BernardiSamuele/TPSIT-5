import http from 'http';
import https from 'https';
import url from 'url';
import fs from 'fs';
import express, { CookieOptions, Request, Response, response } from 'express';
import { Document, MongoClient, ObjectId, WithId } from 'mongodb';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import nodeMailer from 'nodemailer';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

const app = express();

let paginaErr: string;

// Config
dotenv.config({ path: '.env' });
const connectionString = process.env.connectionStringLocal;
const DB_NAME = process.env.dbName;
const PORT = process.env.PORT;
const tokenExpiresIn = 30;
// const auth = JSON.parse(process.env.auth);

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

/* ********************** HTTPS server ********************** */
const HTTPS_PORT = 3001;
const privateKey = fs.readFileSync('./keys/privateKey.pem', 'utf8');
const publicKey = fs.readFileSync('./keys/publicKey.crt', 'utf8');
const jwtKey = fs.readFileSync('./keys/jwtKey', 'utf8');
const credentials = {
  key: privateKey,
  cert: publicKey
};
const httpsServer = https.createServer(credentials, app);
httpsServer.listen(HTTPS_PORT, () => {
  console.log(`HTTPS server listening on port ${HTTPS_PORT}`);
});
//Middleware
//1. Request log
app.use('/', (req: any, res: any, next: any) => {
  console.log(req.method + ': ' + req.originalUrl);
  next();
});

//2. Static resource
app.use('/', express.static('./static'));

//3. Body params
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
app.use('/', cors(corsOptions));

// 7. Gestione login
app.use(cookieParser()); // Aggiunge un campo cookies nella response e nella request
const cookiesOptions = {
  path: '/', 
  maxAge: 
}

app.post('/api/login', async (req: Request, res: Response) => {
  const user = req.body.username;
  const password = req.body.password;
  const client = new MongoClient(connectionString);
  await client.connect().catch((err) => {
    res.status(503).send('Errore connessione al database: ' + DB_NAME);
  });
  const collection = client.db(DB_NAME).collection('mail');
  const request = collection.findOne({ username: user });
  request.catch((err) => {
    res.status(500).send('Errore esecuzione query');
  });
  request.then((dbUser) => {
    if (!dbUser) {
      res.status(401).send('Username o password non validi');
    } else {
      bcrypt.compare(password, dbUser.password, function (err, ok) {
        if (err) {
          res.status(500).send('bcrypt decode error: ' + err.message);
          console.log(err.stack);
        } else if (ok) {
          const token = createToken(dbUser);
          
          res.cookie('token', token, cookiesOptions);
        } else {
          res.status(401).send('Username o password non validi');
        }
      });
    }
  });
});

//Client routes

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

function createToken(data) {
  // restituisce il tempo corrente in s rispetto all' 1/1/1970
  const now = Math.floor(new Date().getTime() / 1000);
  const payload = {
    iat: data.iat || now,
    exp: now + tokenExpiresIn,
    id: data._id,
    username: data.username,
    admin: false
  };
  const token = jwt.sign(payload, jwtKey);
  console.log('Creato nuovo token: ' + token);
  return token;
}
