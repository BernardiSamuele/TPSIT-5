import fs from 'fs';
import url from 'url';


class Dispatcher {
    private paginaErrore: string;
    private prompt: string = '>>> ';
    private listeners: Object = {
        GET: {
            // '/orario': function() {},
            // '/elencoStudenti': function() {},
        },
        POST: {},
        PUT: {},
        PATCH: {},
        DELETE: {}
    };

    constructor() {
        this.init();
    }

    public addListener(method: string, resource: string, callback: Function) {
        if (!method || !resource || !callback) {
            return;
        }
        method = method.toUpperCase();
        if (method in this.listeners) {
            this.listeners[method][resource] = callback;
            console.log(`Successfully registered method: ${method}, resource: ${resource}`);
        }
        else {
            throw new Error('Invalid HTTP method');
        }
    }

    public dispatch(req: any, res: any) {
        let method = req.method.toUpperCase();
        let fullPath = url.parse(req.url, true);
        let resource = fullPath.pathname;
        let params = fullPath.query;

        console.log(`${this.prompt}${method}:${resource}, params:${params}`);

        if(!resource?.startsWith('/api/')) {
            this.staticListener(req, res, resource);
        }
    }
    
    private init() {
        fs.readFile('static/error.html', function (err, data) {
            if (!err) {
                this.paginaErrore = data.toString();
            }
            else {
                this.paginaErrore = '<h2>Risorsa non trovata</h2>';
            }
        })
    }

    private staticListener(req, res, resource) {
        if(resource == '/') {
            resource = '/index.html';
        }
    }
}



export default new Dispatcher();