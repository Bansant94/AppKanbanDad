# Aplicación Kanban

Esta es una aplicación de gestión de tareas tipo Kanban que permite organizar y dar seguimiento a las tareas en diferentes columnas (Por Hacer, En Progreso, Completado).

## Características Principales

- Interfaz de usuario intuitiva con drag and drop
- Actualización en tiempo real de las tareas
- Organización de tareas en columnas personalizables
- Gestión completa de tareas (crear, leer, actualizar, eliminar)
- Diseño responsive con TailwindCSS

## Dependencias Principales

### Backend
- @nestjs/common: ^11.0.1
- @nestjs/mongoose: ^11.0.3
- @nestjs/platform-socket.io: ^11.0.20
- mongoose: ^8.13.2
- socket.io: ^4.8.1

### Frontend
- @dnd-kit/core: ^6.3.1
- @dnd-kit/sortable: ^10.0.0
- react: ^19.0.0
- socket.io-client: ^4.8.1
- tailwindcss: ^3.4.17

## Tecnologías Utilizadas

### Backend
- NestJS (Framework de Node.js)
- MongoDB (Base de datos)
- Socket.IO (Comunicación en tiempo real)
- TypeScript

### Frontend
- React
- TypeScript
- Vite
- TailwindCSS
- DND Kit (Drag and Drop)
- Socket.IO Client
- Axios

## Instalación

### Backend
```bash
cd dad_back
npm install
npm run start:dev
```

### Frontend
```bash
cd dad_front
npm install
npm run dev
```

## URLs de Desarrollo

### Backend
- API REST: `http://localhost:3000`
- WebSocket: `ws://localhost:3000`

### Frontend
- Aplicación Web: `http://localhost:5173`

## Endpoints de la API

### Tareas (Tasks)

#### GET http://localhost:3000/tasks
- Obtiene todas las tareas

#### GET http://localhost:3000/tasks/:id
- Obtiene una tarea específica

#### POST http://localhost:3000/tasks
- Crea una nueva tarea
```json
{
  "title": "Nueva tarea",
  "description": "Descripción de la tarea",
  "status": "TODO"
}
```

#### PUT http://localhost:3000/tasks/:id
- Actualiza una tarea existente
```json
{
  "title": "Tarea actualizada",
  "description": "Nueva descripción",
  "status": "IN_PROGRESS"
}
```

#### DELETE http://localhost:3000/tasks/:id
- Elimina una tarea

### Columnas (Columns)

#### GET http://localhost:3000/columns
- Obtiene todas las columnas

#### GET http://localhost:3000/columns/:id
- Obtiene una columna específica

#### POST http://localhost:3000/columns
- Crea una nueva columna
```json
{
  "title": "Nueva columna",
  "order": 1
}
```

#### PUT http://localhost:3000/columns/:id
- Actualiza una columna existente
```json
{
  "title": "Columna actualizada",
  "order": 2
}
```

#### DELETE http://localhost:3000/columns/:id
- Elimina una columna

## Scripts Disponibles

### Backend
- `npm run start:dev`: Inicia el servidor en modo desarrollo

### Frontend
- `npm run dev`: Inicia el servidor de desarrollo
