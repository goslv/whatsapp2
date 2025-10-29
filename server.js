const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = 3000;

// Servir archivos estáticos
app.use(express.static('public'));

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Almacenar usuarios conectados
const usuarios = {};

// Manejo de conexiones Socket.io
io.on('connection', (socket) => {
    console.log('Usuario conectado:', socket.id);

    // Usuario se une al chat
    socket.on('unirse', (nombre) => {
        usuarios[socket.id] = nombre;
        socket.broadcast.emit('usuario-unido', nombre);

        // Enviar lista actualizada de usuarios a todos
        io.emit('lista-usuarios', Object.values(usuarios));

        console.log(`${nombre} se unió al chat`);
    });

    // Recibir mensaje
    socket.on('mensaje', (data) => {
        io.emit('mensaje', data);
    });

    // Usuario escribiendo
    socket.on('escribiendo', (nombre) => {
        socket.broadcast.emit('usuario-escribiendo', nombre);
    });

    // Usuario dejó de escribir
    socket.on('dejar-escribir', () => {
        socket.broadcast.emit('usuario-dejo-escribir');
    });

    // Usuario se desconecta
    socket.on('disconnect', () => {
        const nombre = usuarios[socket.id];
        if (nombre) {
            socket.broadcast.emit('usuario-desconectado', nombre);
            delete usuarios[socket.id];

            // Enviar lista actualizada de usuarios a todos
            io.emit('lista-usuarios', Object.values(usuarios));

            console.log(`${nombre} se desconectó`);
        }
    });
});

// Iniciar servidor
server.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});