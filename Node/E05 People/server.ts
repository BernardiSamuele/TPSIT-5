import http from 'http';
import fs from 'fs';
import dispatcher from './dispatcher';
import headers from './headers.json';
import people from './people.json';

const PORT = 1337;

// La callback di createServer viene eseguita ogni volta che arriva una richiesta dal client
const server = http.createServer(function (req, res) {
    dispatcher.dispatch(req, res);
});

server.listen(PORT, function () {
    console.log(`Server listening on port: ${PORT}`);
});

/*** Registrazione dei listener ***/
dispatcher.addListener('GET', '/api/country', function (req: any, res: any) {
    const countries: string[] = [];
    for (const person of people.results) {
        if (!countries.includes(person.location.country)) {
            countries.push(person.location.country);
        }
    }
    countries.sort();

    res.writeHead(200, headers.json);
    res.write(JSON.stringify(countries));
    res.end();
});

dispatcher.addListener('GET', '/api/people', function (req: any, res: any) {
    const country = req['GET']['country'];

    // const resultPeople = people.results.filter(p => p.location.country == country);
    const resultPeople = people.results.filter(function (p) { return p.location.country == country });

    res.writeHead(200, headers.json);
    res.write(JSON.stringify(resultPeople));
    res.end();
});

dispatcher.addListener('GET', '/api/getDetails', function (req: any, res: any) {
    try {
        const pName = JSON.parse(req['GET'].pName);

        const person = people.results.find(function (p) {
            return JSON.stringify(p.name) == JSON.stringify(pName);
        });

        res.writeHead(200, headers.json);
        res.write(JSON.stringify(person));
        res.end();
    } catch (err) {
        res.writeHead(400, headers.text);
        res.write('invalid params');
        res.end();
    }
});

dispatcher.addListener('DELETE', '/api/deletePerson', function (req: any, res: any) {
    // const pName = req['BODY']['pName'];
    const { pName } = req['BODY'];

    const index = people.results.findIndex(function (p) {
        return JSON.stringify(p.name) == JSON.stringify(pName);
    });
    people.results.splice(index, 1);

    fs.writeFile('./people.json', JSON.stringify(people), function (err) {
        if (!err) {
            res.writeHead(200, headers.json);
            res.write(JSON.stringify({ 'res': 'ok' }));
            res.end();
        }
        else {
            res.writeHead(500, headers.text);
            res.write('Impossibile salvare i dati');
            res.end();
        }
    });

});