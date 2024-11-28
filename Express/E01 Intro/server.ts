'use strict';

import http from 'http';
import url from 'url';
import fs from 'fs';
import express from 'express';

/* ********************** HTTP server ********************** */
const port = 1337;
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
app.use('/', express.json({ limit: '50mb' }));
app.use('/', express.urlencoded({ limit: '50mb', extended: true }));

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
