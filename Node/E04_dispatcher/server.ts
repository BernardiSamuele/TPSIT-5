import http from 'http';
import dispatcher from './dispatcher';
import headers from './headers.json';

const PORT = 1337;

const server = http.createServer(function(req, res) {

});

server.listen(PORT, function() {
    console.log(`Server listening on port: ${PORT}`);
});

/*** Registrazione dei listener ***/
dispatcher.addListener('GET', '/api/servizio1', function(req: any, res: any) {
    res.writeHead(200, headers.json);
    res.write(JSON.stringify('benvenuto'));
    res.end();
});

dispatcher.addListener('POST', '/api/servizio2', function(req, res) {
    res.writeHead(200, headers.json);
    res.write(JSON.stringify('benvenuto'));
    res.end();
});