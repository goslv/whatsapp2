const socket = io();

// Elementos del DOM
const pantallaInicio = document.getElementById('inicio');
const pantallaChat = document.getElementById('chat');
const formRegistro = document.getElementById('form-registro');
const nombreCompletoInput = document.getElementById('nombre-completo');
const prefijoSelect = document.getElementById('prefijo');
const telefonoInput = document.getElementById('telefono');
const usernameInput = document.getElementById('username');
const mensajeInput = document.getElementById('mensaje-input');
const btnEnviar = document.getElementById('btn-enviar');
const mensajesDiv = document.getElementById('mensajes');
const usuarioNombre = document.getElementById('usuario-nombre');
const avatarHeader = document.getElementById('avatar-header');
const listaUsuarios = document.getElementById('lista-usuarios');
const contadorUsuarios = document.getElementById('contador-usuarios');
const escribiendoIndicador = document.getElementById('escribiendo-indicador');

let misDatos = {
    nombreCompleto: '',
    telefono: '',
    username: ''
};
let escribiendoTimeout;

// Función: Obtener iniciales del nombre
function obtenerIniciales(nombre) {
    const palabras = nombre.trim().split(' ');
    if (palabras.length >= 2) {
        return (palabras[0][0] + palabras[1][0]).toUpperCase();
    }
    return nombre.substring(0, 2).toUpperCase();
}

// Función: Validar username (solo letras, números y guiones bajos)
function validarUsername(username) {
    const regex = /^[a-zA-Z0-9_]+$/;
    return regex.test(username);
}

// Función: Validar teléfono (solo números)
function validarTelefono(telefono) {
    const regex = /^[0-9]+$/;
    return regex.test(telefono);
}

// Función: Unirse al chat
function unirseAlChat(e) {
    e.preventDefault();

    const nombreCompleto = nombreCompletoInput.value.trim();
    const prefijo = prefijoSelect.value;
    const telefono = telefonoInput.value.trim();
    const username = usernameInput.value.trim().toLowerCase();

    // Validaciones
    if (nombreCompleto === '') {
        alert('Por favor ingresa tu nombre completo');
        nombreCompletoInput.focus();
        return;
    }

    if (nombreCompleto.length < 3) {
        alert('El nombre debe tener al menos 3 caracteres');
        nombreCompletoInput.focus();
        return;
    }

    if (telefono === '') {
        alert('Por favor ingresa tu número de teléfono');
        telefonoInput.focus();
        return;
    }

    if (!validarTelefono(telefono)) {
        alert('El teléfono solo debe contener números');
        telefonoInput.focus();
        return;
    }

    if (telefono.length < 6) {
        alert('El número de teléfono es muy corto');
        telefonoInput.focus();
        return;
    }

    if (username === '') {
        alert('Por favor ingresa tu nombre de usuario');
        usernameInput.focus();
        return;
    }

    if (username.length < 3) {
        alert('El username debe tener al menos 3 caracteres');
        usernameInput.focus();
        return;
    }

    if (!validarUsername(username)) {
        alert('El username solo puede contener letras, números y guiones bajos');
        usernameInput.focus();
        return;
    }

    // Guardar datos del usuario
    misDatos = {
        nombreCompleto: nombreCompleto,
        telefono: prefijo + telefono,
        username: username
    };

    // Cambiar pantallas
    pantallaInicio.style.display = 'none';
    pantallaChat.style.display = 'grid';

    // Mostrar datos en header
    usuarioNombre.textContent = username;
    avatarHeader.textContent = obtenerIniciales(nombreCompleto);

    // Enfocar input de mensaje
    mensajeInput.focus();

    // Enviar al servidor
    socket.emit('unirse', misDatos);
}

// Función: Enviar mensaje
function enviarMensaje() {
    const mensaje = mensajeInput.value.trim();

    if (mensaje === '') return;

    const data = {
        usuario: misDatos.username,
        nombreCompleto: misDatos.nombreCompleto,
        mensaje: mensaje,
        hora: obtenerHora()
    };

    // Enviar al servidor
    socket.emit('mensaje', data);

    // Limpiar input
    mensajeInput.value = '';
    mensajeInput.focus();

    // Detener indicador de escribiendo
    socket.emit('dejar-escribir');
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

// Función: Actualizar lista de usuarios
function actualizarListaUsuarios(usuarios) {
    listaUsuarios.innerHTML = '';
    contadorUsuarios.textContent = usuarios.length;

    usuarios.forEach(usuario => {
        const div = document.createElement('div');
        div.className = 'usuario-online';

        const avatar = document.createElement('div');
        avatar.className = 'usuario-avatar';
        avatar.textContent = obtenerIniciales(usuario.nombreCompleto);

        const info = document.createElement('div');
        info.className = 'usuario-info';

        const nombre = document.createElement('div');
        nombre.className = 'usuario-nombre-sidebar';
        nombre.textContent = usuario.username;

        const telefono = document.createElement('div');
        telefono.className = 'usuario-telefono';
        telefono.textContent = usuario.telefono;

        info.appendChild(nombre);
        info.appendChild(telefono);
        div.appendChild(avatar);
        div.appendChild(info);
        listaUsuarios.appendChild(div);
    });
}

// Función: Manejar indicador de escribiendo
function manejarEscribiendo() {
    socket.emit('escribiendo', misDatos.username);

    clearTimeout(escribiendoTimeout);
    escribiendoTimeout = setTimeout(() => {
        socket.emit('dejar-escribir');
    }, 1000);
}

// Función: Formatear username mientras se escribe
usernameInput.addEventListener('input', (e) => {
    // Remover caracteres no permitidos
    e.target.value = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '');
});

// Función: Validar que solo sean números en el teléfono
telefonoInput.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, '');
});

// Event listeners
formRegistro.addEventListener('submit', unirseAlChat);

btnEnviar.addEventListener('click', enviarMensaje);
mensajeInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') enviarMensaje();
});

// Event listener para indicador de escribiendo
mensajeInput.addEventListener('input', manejarEscribiendo);

// Socket.io events
socket.on('usuario-unido', (usuario) => {
    mostrarNotificacion(`${usuario.username} se unió al chat`);
});

socket.on('usuario-desconectado', (usuario) => {
    mostrarNotificacion(`${usuario.username} salió del chat`);
});

socket.on('mensaje', (data) => {
    const esMio = data.usuario === misDatos.username;
    mostrarMensaje(data, esMio);
});

socket.on('lista-usuarios', (usuarios) => {
    actualizarListaUsuarios(usuarios);
});

socket.on('usuario-escribiendo', (username) => {
    escribiendoIndicador.style.display = 'block';
    escribiendoIndicador.querySelector('span').textContent = `${username} está escribiendo...`;
});

socket.on('usuario-dejo-escribir', () => {
    escribiendoIndicador.style.display = 'none';
});

console.log('%c💬 Whatsapp 2', 'color: #25D366; font-size: 20px; font-weight: bold;');
console.log('%cChat en tiempo real con Socket.io', 'color: #128C7E; font-size: 14px;');