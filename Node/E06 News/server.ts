import http from 'http';
import fs from 'fs';
import dispatcher from './dispatcher';
import headers from './headers.json';
import news from './news.json';

const PORT = 1337;

// La callback di createServer viene eseguita ogni volta che arriva una richiesta dal client
const server = http.createServer(function (req, res) {
    dispatcher.dispatch(req, res);
});

server.listen(PORT, function () {
    console.log(`Server listening on port: ${PORT}`);
});

/*** Registrazione dei listener ***/
dispatcher.addListener('GET', '/api/elenco', function (req: any, res: any) {
    res.writeHead(200, headers.json);
    res.write(JSON.stringify(news));
    res.end();
});

dispatcher.addListener('POST', '/api/dettagli', function (req: any, res: any) {
    const { file } = req['BODY'];

    fs.readFile(`news/${file}`, (err, data) => {
        if (err) {
            res.writeHead(500, headers.json);
            res.write(JSON.stringify({ message: 'Internal server error' }));
            res.end();
            return;
        }

        const selectedNew = news.find(n => n.file === file);
        if (selectedNew) {
            selectedNew.visualizzazioni++;
        }

        res.writeHead(200, headers.text);
        res.write(JSON.stringify({ data: data.toString() }));
        res.end();
    });
});