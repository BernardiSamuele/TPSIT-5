'use strict';

import http from 'http';
import url from 'url';
import fs from 'fs';
import crypto from 'crypto';

import app from './dispatcher';
import headers from './headers.json';
import facts from './facts.json';

/* ********************** */

const port = 1337;
// const categories = []
// const categories = ['career', 'money', 'explicit', 'history', 'celebrity', 'dev', 'fashion', 'food', 'movie', 'music', 'political', 'religion', 'science', 'sport', 'animal', 'travel'];

const icon_url = 'https://assets.chucknorris.host/img/avatar/chuck-norris.png';
const api_url = 'https://api.chucknorris.io';

const base64Chars = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z',
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '-',
  '_',
];

const server = http.createServer((req, res) => {
  app.dispatch(req, res);
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

app.addListener('GET', '/api/categories', (req, res) => {
  const categories: string[] = [];
  facts.facts.forEach((fact) => {
    fact.categories.forEach((category) => {
      if (!categories.includes(category)) {
        categories.push(category);
      }
    });
  });
  res.writeHead(200, headers.json);
  res.write(JSON.stringify(categories));
  res.end();
});

app.addListener('GET', '/api/facts', (req, res) => {
  const { category } = req['GET'];
  const filteredFacts = facts.facts.filter((fact) => fact.categories.includes(category));
  if (!filteredFacts) {
    res.writeHead(404, headers.text);
    res.write('Category not found');
    res.end();
    return;
  }

  res.writeHead(200, headers.json);
  res.write(JSON.stringify(filteredFacts.sort((a, b) => b.score - a.score)));
  res.end();
});

app.addListener('POST', '/api/rate', (req, res) => {
  const { likedFacts } = req['BODY'];
  for (const fact of facts.facts) {
    if (likedFacts.includes(fact.id)) {
      fact.score++;
    }
  }

  fs.writeFile('./facts.json', JSON.stringify(facts), (err) => {
    if (err) {
      res.writeHead(500, headers.text);
      res.write('Internal server error');
      res.end();
      return;
    }

    res.writeHead(200, headers.json);
    res.write(JSON.stringify({ response: 'OK' }));
    res.end();
  });
});

app.addListener('POST', '/api/addFact', (req, res) => {
  const { value, category } = req['BODY'];

  const fact = { categories: [category], created_at: new Date().toString(), icon_url, id: generateUniqueId(22), url: api_url, value, score: 0, updated_at: '' };
  facts.facts.push(fact);
  fs.writeFile('./facts.json', JSON.stringify(facts), (err) => {
    if (err) {
      res.writeHead(500, headers.text);
      res.write('Internal server error');
      res.end();
      return;
    }

    res.writeHead(200, headers.json);
    res.write(JSON.stringify({ response: 'OK' }));
    res.end();
  });
});

function generateUniqueId(length) {
  const ids = facts.facts.map((fact) => fact.id);
  let id;
  do {
    id = crypto.randomBytes(length).toString('base64');
  } while (ids.includes(id));
  return id;
}
