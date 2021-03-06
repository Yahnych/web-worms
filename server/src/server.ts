import express from 'express';
import http    from 'http';
import os      from 'os';
import path    from 'path';
import socket  from 'socket.io';

import listen  from './socket/main';

const folder = process.env.DEV_SERVER ? 'dist' : 'build';
const index = path.join(__dirname, `../../client/${folder}/index.html`);

const app = express();
app.get('/', (_, res) => res.sendFile(index));
app.use(express.static(`client/${folder}`));

const httpServer = new http.Server(app);
const PORT = +process.env.PORT || 3000;
const interfaces = os.networkInterfaces();

httpServer.listen(PORT, () => {
    Object.values(interfaces).forEach(ifaceInfo => {
        ifaceInfo.forEach(iface => {
            if (!iface.internal && iface.family == 'IPv4') {
                console.log(`Listening on http://${iface.address}:${PORT}`);
            }
        });
    });
});

const io = socket(httpServer);
io.on('connection', listen(io));
