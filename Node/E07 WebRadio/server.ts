import http from 'http';
import fs from 'fs';
import app from './dispatcher';
import headers from './headers.json';
import states from './states.json';
import radios from './radios.json';

const PORT = 1337;

// La callback di createServer viene eseguita ogni volta che arriva una richiesta dal client
const server = http.createServer(function (req, res) {
    app.dispatch(req, res);
});

server.listen(PORT, function () {
    console.log(`Server listening on port: ${PORT}`);
});

/*** Registrazione dei listener ***/
app.addListener('GET', '/api/getStates', function (req: any, res: any) {
    res.writeHead(200, headers.json);
    res.write(JSON.stringify(states));
    res.end();
});

app.addListener('GET', '/api/getRadios', function (req: any, res: any) {
    // const state = req['GET']['state'];
    const { state } = req['GET'];

    let responseRadios;
    if (state == 'tutti') {
        responseRadios = radios;
    }
    else {
        responseRadios = radios.filter(radio => {
            return radio.state == state;
        });
    }

    res.writeHead(200, headers.json);
    res.write(JSON.stringify(responseRadios));
    res.end();
});

app.addListener('PATCH', '/api/addLike', function (req, res) {
    const id = req['BODY']['id'];
    const radio: any = radios.find(radio => { return radio.id == id });
    radio.votes = (parseInt(radio.votes) + 1).toString();

    fs.writeFile('./radios.json', JSON.stringify(radios), function (err) {
        if (err) {
            res.writeHead(500, headers.text);
            res.write('Errore aggiornamento database');
            res.end();
        }
        else {
            res.writeHead(200, headers.json);
            res.write(JSON.stringify({ res: 'Ok' }));
            res.end();
        }
    });
});