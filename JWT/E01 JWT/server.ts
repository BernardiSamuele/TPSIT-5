import http from 'http';
import https from 'https';
import url from 'url';
import fs from 'fs';
import express, { CookieOptions, NextFunction, Request, Response, response } from 'express';
import { Document, MongoClient, ObjectId, WithId } from 'mongodb';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import nodeMailer from 'nodemailer';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { google } from 'googleapis';

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
// http.createServer(app).listen(PORT, () => {
//   console.log('Server listening on port: ' + PORT);
// });

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
const HTTPS_PORT = process.env.HTTPS_PORT;
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
  maxAge: tokenExpiresIn * 1000,
  // Il cookie non è accessibile da javascript, ma solo da http(s)
  httpOnly: true,
  // Solo HTTPS
  secure: true,
  // Cookie accessibile extra domain
  sameSite: false
};

app.post('/api/login', async (req: Request, res: Response) => {
  const user = req.body.username;
  const password = req.body.password;
  const client = new MongoClient(connectionString);
  await client.connect().catch(err => {
    res.status(503).send('Errore connessione al database: ' + DB_NAME);
  });
  const collection = client.db(DB_NAME).collection('mail');
  const request = collection.findOne({ username: user });
  request.catch(err => {
    res.status(500).send('Errore esecuzione query');
  });
  request.then(dbUser => {
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
          res.send({ ris: 'ok' });
        } else {
          res.status(401).send('Username o password non validi');
        }
      });
    }
  });
});

// 8. Google login
app.post('/api/googleLogin', async (req: Request, res: Response) => {
  const payload: any = jwt.decode(req.body.googleToken);
  const username = payload.email;

  const client = new MongoClient(connectionString);
  await client.connect().catch(err => {
    res.status(503).send('Errore connessione al database: ' + DB_NAME);
  });
  const collection = client.db(DB_NAME).collection('mail');
  const regex = new RegExp(`^${username}$`, 'i');
  const request = collection.findOne({ username: regex });
  request.catch(err => {
    res.status(500).send('Errore esecuzione query');
    client.close();
  });
  request.then(dbUser => {
    if (!dbUser) {
      const newUser = {
        username: username,
        password: '',
        mail: []
      };
      const request2 = collection.insertOne(newUser);
      request2.catch(err => {
        res.status(500).send('Errore inserimento nuovo utente');
      });
      request2.then(mongoResponse => {
        console.log('Mongo: ', mongoResponse.insertedId.toString());
        const token = createToken(newUser);
        res.cookie('token', token, cookiesOptions);
        res.send({ ris: 'ok' });
      });
      request2.finally(() => {
        client.close();
      });
    } else {
      const token = createToken(dbUser);
      res.cookie('token', token, cookiesOptions);
      res.send({ ris: 'ok' });
      client.close();
    }
  });
});

// 9. Logout
app.post('/api/logout', (req: Request, res: Response, next: NextFunction) => {
  let options = {
    ...cookiesOptions,
    maxAge: -1
  };
  res.cookie('token', '', options).send({ ris: 'Ok' });
});

//10. oAuth2 Configuration
const oAuth2Credentials = JSON.parse(process.env.OAuth2 as any);
const OAuth2 = google.auth.OAuth2; // oggetto OAuth2
// L’oggetto OAuth2 serve per richiedere il Bearer Token
const OAuth2Client = new OAuth2(oAuth2Credentials['client_id'], oAuth2Credentials['client_secret']);
OAuth2Client.setCredentials({
  refresh_token: oAuth2Credentials.refresh_token
});
let auth2Options: any = {
  type: 'OAuth2',
  user: 's.bernardi.2625@vallauri.edu',
  clientId: oAuth2Credentials.client_id,
  clientSecret: oAuth2Credentials.client_secret,
  refreshToken: oAuth2Credentials.refresh_token,
  accessToken: '' //rigenerato ogni volta
};
const message = fs.readFileSync('./message.html', 'utf-8');

//11. Password Dimenticata
app.post('/api/pwdDimenticata', async function (req: any, res: any, next: any) {
  let username = req.body.username;
  const client = new MongoClient(connectionString);
  await client.connect().catch(function (err) {
    res.status(503).send('Errore connessione al Database');
  });
  const collection = client.db(DB_NAME).collection('mail');
  const regex = new RegExp('^' + username + '$', 'i');
  const request = collection.findOne({ username: regex });
  request.catch(function (err) {
    res.status(500).send('Errore esecuzione query ' + err.message);
    client.close();
  });
  request.then(async function (dbUser) {
    if (!dbUser) {
      res.status(401).send('Username non valido');
      client.close();
    } else {
      let newPwd = '';
      for (let i = 0; i < 12; i++) {
        newPwd += String.fromCharCode(Math.floor(Math.random() * 26) + 65);
      }
      let msg = message.replace('__user', username).replace('__password', newPwd);
      auth2Options.accessToken = await OAuth2Client.getAccessToken();

      const trasporter = nodeMailer.createTransport({
        service: 'gmail',
        auth: auth2Options
      });

      const mailOptions = {
        from: auth2Options.user,
        to: username,
        subject: 'Nuova Password Per Rilievi e Perizie',
        html: msg,
        attachments: [
          {
            filename: 'qrCode.png',
            path: './qrCode.png'
          }
        ]
      };

      trasporter.sendMail(mailOptions, function (err: any, info: any) {
        if (err) {
          res.status(500).send('Errore Invio Mai ' + err.message);
          client.close();
        } else {
          res.send({ ris: 'OK' });
          trasporter.close();
          const request2 = collection.updateOne({ username: regex }, { $set: { password: bcrypt.hashSync(newPwd, 10), oldPass: newPwd } });
          request2.catch(err => {
            console.log(err.stack);
            res.status(500).send('Errore aggiornamento password');
          });
          request2.then(data => {
            console.log('Aggiornata password');
            res.send({ ris: 'OK' });
          });
          request2.finally(() => {
            client.close();
          });
        }
      });
    }
  });
  request.finally(function () {
    client.close();
  });
});

// 12. Controllo token
app.use('/api/', (req: Request, res: Response, next: NextFunction) => {
  if (!req.cookies.token) {
    res.status(403).send('token mancante');
  } else {
    const token = req.cookies.token;
    jwt.verify(token, jwtKey, (err, payload) => {
      if (err) {
        res.status(403).send('token non valido o scaduto');
      } else {
        let newToken = createToken(payload);
        res.cookie('token', newToken, cookiesOptions);
        req['payload'] = payload;
        next();
      }
    });
  }
});

//Client routes
app.get('/api/elencoMail', async (req: Request, res: Response, next: NextFunction) => {
  const _id = new ObjectId(req['payload']._id as string);
  const client = new MongoClient(connectionString);
  await client.connect().catch(err => {
    res.status(503).send('Errore connessione al database');
  });
  const collection = client.db(DB_NAME).collection('mail');
  const request = collection.findOne({ _id }, { projection: { mail: 1 } });
  request.catch(err => {
    res.status(500).send('errore esecuzione query');
    console.log(err.stack);
  });
  request.then(data => {
    res.send(data.mail.reverse());
  });
  request.finally(() => {
    client.close();
  });
});

app.post('/api/newMail', async (req: Request, res: Response, next: NextFunction) => {
  const destinatario = req.body.to;
  const mittente = req['payload'].username;
  const mail = {
    from: mittente,
    subject: req.body.subject,
    body: req.body.message
  };
  const client = new MongoClient(connectionString);
  await client.connect().catch(err => {
    res.status(503).send('errore connessione al database');
  });
  const collection = client.db(DB_NAME).collection<unknown>('mail');
  const request = collection.updateOne({ username: destinatario }, { $push: { mail } });
  request.catch(err => {
    res.status(500).send('Errore esecuzione query');
  });
  request.then(data => {
    if (data.matchedCount == 0) {
      res.status(500).send('Destinatario inesistente');
    } else {
      res.send({ ris: 'Mail inviata correttamente' });
    }
  });
  request.finally(() => {
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

function createToken(data) {
  // restituisce il tempo corrente in s rispetto all' 1/1/1970
  const now = Math.floor(new Date().getTime() / 1000);
  const payload = {
    iat: data.iat || now,
    exp: now + tokenExpiresIn,
    _id: data._id,
    username: data.username,
    admin: false
  };
  const token = jwt.sign(payload, jwtKey);
  console.log('Creato nuovo token: ' + token);
  return token;
}
