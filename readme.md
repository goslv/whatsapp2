# 💬 Whatsapp 2 - Chat con Socket.io

¡Bienvenido a Whatsapp 2! Un proyecto escolar de chat en tiempo real.

## 🎯 ¿Qué hace este proyecto?

Es un chat en tiempo real donde varios usuarios pueden:
- Conectarse con su nombre
- Enviar mensajes que todos ven instantáneamente
- Ver cuando alguien entra o sale del chat

## 📚 ¿Cómo funciona?

### 🔌 Socket.io - La magia de la comunicación

Socket.io permite que el servidor y los clientes se comuniquen **en ambas direcciones** y **en tiempo real**:

```
Cliente 1  ←→  Servidor  ←→  Cliente 2
```

Cuando alguien envía un mensaje:
1. El cliente envía el mensaje al servidor (`socket.emit`)
2. El servidor recibe el mensaje
3. El servidor lo reenvía a TODOS los clientes conectados
4. Todos ven el mensaje instantáneamente

### 📡 Eventos que usamos

**Del Cliente → Servidor:**
- `usuario-conectado`: "Hola, mi nombre es Juan"
- `enviar-mensaje`: "Aquí está mi mensaje"

**Del Servidor → Cliente:**
- `usuario-conectado`: "Juan se unió"
- `usuario-desconectado`: "Juan se fue"
- `nuevo-mensaje`: "Aquí está el mensaje de Juan"

## 🚀 ¿Cómo ejecutarlo?

### Paso 1: Instalar dependencias
```bash
npm install
```

### Paso 2: Iniciar el servidor
```bash
npm start
```

### Paso 3: Abrir el navegador
Abre: http://localhost:3000

### Paso 4: Probar con múltiples usuarios
Abre varias pestañas del navegador y conéctate con diferentes nombres

## 📁 Estructura del proyecto

```
whatsapp2/
├── server.js              # Servidor Node.js con Socket.io
├── package.json           # Configuración del proyecto
├── public/
│   ├── index.html        # Interfaz del chat
│   ├── styles.css        # Estilos (colores de WhatsApp)
│   └── app.js            # Lógica del cliente con Socket.io
```

## 🎨 Características

✅ Chat en tiempo real
✅ Notificaciones de entrada/salida
✅ Diseño tipo WhatsApp
✅ Múltiples usuarios simultáneos
✅ Hora en cada mensaje
✅ Diferenciación entre mensajes propios y ajenos

## 🧪 Para probar:

1. Abre 3 pestañas del navegador
2. En cada una, conéctate con un nombre diferente
3. Envía mensajes desde cualquier pestaña
4. ¡Verás cómo aparecen en todas al instante!

## 🤓 Conceptos aprendidos

- **WebSockets**: Comunicación bidireccional en tiempo real
- **Event-driven programming**: Todo funciona con eventos
- **Cliente-Servidor**: Arquitectura distribuida
- **Node.js**: JavaScript del lado del servidor
- **Socket.io**: Abstracción sobre WebSockets

## 💡 Explicación técnica

### ¿Por qué Socket.io y no HTTP normal?

HTTP es como enviar cartas:
- Cliente pregunta → Servidor responde → Fin

Socket.io es como una llamada telefónica:
- Ambos pueden hablar cuando quieran
- La conexión se mantiene abierta
- Es instantáneo

### ¿Cómo sabe el servidor quién es quién?

Cada conexión tiene un `socket.id` único. Nosotros guardamos:
```javascript
usuarios[socket.id] = nombre
```

Así sabemos qué nombre corresponde a cada conexión.

## 🎉 ¡Listo!

Ahora tienes tu propio Whatsapp 2 funcionando.

---
Desarrollado con ❤️ para aprender Socket.io