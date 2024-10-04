import fs from 'fs';

let paginaErrore: string;

class Dispatcher {
    prompt: string = '>>> ';
    listeners: Object = {
        GET: {},
        POST: {},
        PUT: {},
        PATCH: {},
        DELETE: {}
    };

    constructor() {
        init();
    }

    addListener(method: string, resource: string, callback: Function) {
        
    }
}

function init() {
    fs.readFile('static/error.html', function (err, data) {
        if (!err) {
            paginaErrore = data.toString();
        }
        else {
            paginaErrore = '<h2>Risorsa non trovata</h2>';
        }
    })
}