import http from 'http';
import fs from 'fs';
import app from './dispatcher';
import headers from './headers.json';
import testate from './testateGiornalistiche.json';

const PORT = 1337;

// La callback di createServer viene eseguita ogni volta che arriva una richiesta dal client
const server = http.createServer(function (req, res) {
  app.dispatch(req, res);
});

server.listen(PORT, function () {
  console.log(`Server listening on port: ${PORT}`);
});

/*** Registrazione dei listener ***/
app.addListener('GET', '/api/testate', (req: http.ClientRequest, res: http.ServerResponse) => {
  const italiane: Object[] = [];
  const straniere: Object[] = [];
  for (const key in testate) {
    if (testate[key].nazione === 'Italia') {
      italiane.push(key);
    } else {
      straniere.push(key);
    }
  }

  const areeInteresse: Object[] = [];
  for (const key in testate) {
    testate[key].giornalisti.forEach((giornalista) => {
      if (!areeInteresse.includes(giornalista.area_di_interesse)) {
        areeInteresse.push(giornalista.area_di_interesse);
      }
    });
  }

  res.writeHead(200, headers.json);
  res.write(JSON.stringify({ italiane: italiane.sort(), straniere: straniere.sort(), areeInteresse: areeInteresse.sort() }));
  res.end();
});

app.addListener('GET', '/api/dettagli', (req: http.ClientRequest, res: http.ServerResponse) => {
  const { testata } = req['GET'];
  if (!testata) {
    res.writeHead(400, headers.text);
    res.write('Missing parameter: testata');
    res.end();
    return;
  }

  const dettagli = testate[testata];
  res.writeHead(200, headers.json);
  res.write(JSON.stringify({ testata, ...dettagli }));
  res.end();
});

app.addListener('POST', '/api/giornalisti', (req: http.ClientRequest, res: http.ServerResponse) => {
  const { aree } = req['BODY'];
  if (!aree) {
    res.writeHead(400, headers.text);
    res.write('Missing parameter: aree');
    res.end();
    return;
  }

  const giornalisti: Object[] = [];
  for (const key in testate) {
    const giornalistiAttuali = testate[key].giornalisti.filter((giornalista) => aree.includes(giornalista.area_di_interesse));
    giornalisti.push(...giornalistiAttuali.map((giornalista) => ({ testata: key, ...giornalista })));
  }

  res.writeHead(200, headers.json);
  res.write(JSON.stringify(giornalisti));
  res.end();
});
