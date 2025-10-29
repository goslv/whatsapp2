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

// Almacenar usuarios conectados con sus datos completos
const usuarios = {};

// Manejo de conexiones Socket.io
io.on('connection', (socket) => {
    console.log('🟢 Usuario conectado:', socket.id);

    // Usuario se une al chat
    socket.on('unirse', (datosUsuario) => {
        // Guardar datos completos del usuario
        usuarios[socket.id] = {
            nombreCompleto: datosUsuario.nombreCompleto,
            telefono: datosUsuario.telefono,
            username: datosUsuario.username,
            socketId: socket.id
        };

        // Notificar a todos que un usuario se unió
        socket.broadcast.emit('usuario-unido', {
            username: datosUsuario.username,
            nombreCompleto: datosUsuario.nombreCompleto
        });

        // Enviar lista actualizada de usuarios a todos
        io.emit('lista-usuarios', Object.values(usuarios));

        console.log(`✅ @${datosUsuario.username} (${datosUsuario.nombreCompleto}) se unió al chat`);
        console.log(`📱 Teléfono: ${datosUsuario.telefono}`);
        console.log(`👥 Usuarios conectados: ${Object.keys(usuarios).length}`);
    });

    // Recibir mensaje
    socket.on('mensaje', (data) => {
        console.log(`💬 Mensaje de @${data.usuario}: ${data.mensaje}`);
        io.emit('mensaje', data);
    });

    // Usuario escribiendo
    socket.on('escribiendo', (username) => {
        socket.broadcast.emit('usuario-escribiendo', username);
    });

    // Usuario dejó de escribir
    socket.on('dejar-escribir', () => {
        socket.broadcast.emit('usuario-dejo-escribir');
    });

    // Usuario se desconecta
    socket.on('disconnect', () => {
        const usuario = usuarios[socket.id];
        
        if (usuario) {
            // Notificar a todos que el usuario se desconectó
            socket.broadcast.emit('usuario-desconectado', {
                username: usuario.username,
                nombreCompleto: usuario.nombreCompleto
            });

            console.log(`🔴 @${usuario.username} (${usuario.nombreCompleto}) se desconectó`);
            
            // Eliminar usuario
            delete usuarios[socket.id];

            // Enviar lista actualizada de usuarios a todos
            io.emit('lista-usuarios', Object.values(usuarios));

            console.log(`👥 Usuarios conectados: ${Object.keys(usuarios).length}`);
        }
    });
});

// Iniciar servidor
server.listen(PORT, () => {
    console.log(`📡 Servidor corriendo en: http://localhost:${PORT}`);
    console.log(`⏰ Iniciado: ${new Date().toLocaleString('es-ES')}`);
});

// Manejo de errores
process.on('uncaughtException', (error) => {
    console.error('❌ Error no capturado:', error);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Promesa rechazada no manejada:', reason);
});