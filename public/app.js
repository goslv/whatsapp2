const socket = io();

// Elementos del DOM
const pantallaInicio = document.getElementById('inicio');
const pantallaChat = document.getElementById('chat');
const nombreInput = document.getElementById('nombre-input');
const btnUnirse = document.getElementById('btn-unirse');
const mensajeInput = document.getElementById('mensaje-input');
const btnEnviar = document.getElementById('btn-enviar');
const mensajesDiv = document.getElementById('mensajes');
const usuarioNombre = document.getElementById('usuario-nombre');

let miNombre = '';

// Función: Unirse al chat
function unirseAlChat() {
    const nombre = nombreInput.value.trim();

    if (nombre === '') {
        alert('Por favor ingresa tu nombre');
        return;
    }

    miNombre = nombre;

    // Cambiar pantallas
    pantallaInicio.style.display = 'none';
    pantallaChat.style.display = 'flex';

    // Mostrar nombre en header
    usuarioNombre.textContent = nombre;

    // Enfocar input de mensaje
    mensajeInput.focus();

    // Enviar al servidor
    socket.emit('unirse', nombre);
}

// Función: Enviar mensaje
function enviarMensaje() {
    const mensaje = mensajeInput.value.trim();

    if (mensaje === '') return;

    const data = {
        usuario: miNombre,
        mensaje: mensaje,
        hora: obtenerHora()
    };

    // Enviar al servidor
    socket.emit('mensaje', data);

    // Limpiar input
    mensajeInput.value = '';
    mensajeInput.focus();
}

// Función: Mostrar mensaje
function mostrarMensaje(data, esMio = false) {
    const div = document.createElement('div');
    div.className = `mensaje ${esMio ? 'mensaje-propio' : 'mensaje-otro'}`;

    const burbuja = document.createElement('div');
    burbuja.className = 'burbuja';

    if (!esMio) {
        const nombre = document.createElement('div');
        nombre.className = 'nombre-usuario';
        nombre.textContent = data.usuario;
        burbuja.appendChild(nombre);
    }

    const texto = document.createElement('div');
    texto.className = 'texto-mensaje';
    texto.textContent = data.mensaje;
    burbuja.appendChild(texto);

    const hora = document.createElement('div');
    hora.className = 'hora-mensaje';
    hora.textContent = data.hora;
    burbuja.appendChild(hora);

    div.appendChild(burbuja);
    mensajesDiv.appendChild(div);

    // Scroll al final
    mensajesDiv.scrollTop = mensajesDiv.scrollHeight;
}

// Función: Mostrar notificación
function mostrarNotificacion(texto) {
    const div = document.createElement('div');
    div.className = 'notificacion';
    div.textContent = texto;
    mensajesDiv.appendChild(div);
    mensajesDiv.scrollTop = mensajesDiv.scrollHeight;
}

// Función: Obtener hora
function obtenerHora() {
    const now = new Date();
    const horas = String(now.getHours()).padStart(2, '0');
    const minutos = String(now.getMinutes()).padStart(2, '0');
    return `${horas}:${minutos}`;
}

// Event listeners
btnUnirse.addEventListener('click', unirseAlChat);
nombreInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') unirseAlChat();
});

btnEnviar.addEventListener('click', enviarMensaje);
mensajeInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') enviarMensaje();
});

// Socket.io events
socket.on('usuario-unido', (nombre) => {
    mostrarNotificacion(`${nombre} se unió al chat`);
});

socket.on('usuario-desconectado', (nombre) => {
    mostrarNotificacion(`${nombre} salió del chat`);
});

socket.on('mensaje', (data) => {
    const esMio = data.usuario === miNombre;
    mostrarMensaje(data, esMio);
});