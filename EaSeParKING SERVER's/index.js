const http = require('http');
const app = require('./app');

const port = 1608;

const server = http.createServer(app);

server.listen(port);