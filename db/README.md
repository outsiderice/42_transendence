# DB Service - SQLite API

Servicio independiente para gestionar base de datos SQLite con Fastify.

## Características

- ✅ CRUD completo de usuarios
- ✅ SQLite con better-sqlite3
- ✅ TypeScript
- ✅ Validaciones básicas
- ✅ Health check
- ✅ Estructura modular

## Instalación

```bash
cd /workspaces/42_transendence/db
npm install
```

## Desarrollo

```bash
npm run dev
```

El servicio estará disponible en `http://localhost:3001`

## Endpoints

### Users

- `POST /api/users` - Crear usuario
- `GET /api/users` - Obtener todos los usuarios
- `GET /api/users/:id` - Obtener usuario por ID
- `GET /api/users/by-username/:username` - Obtener usuario por username
- `PUT /api/users/:id` - Actualizar usuario
- `DELETE /api/users/:id` - Eliminar usuario

### Health

- `GET /health` - Verificar estado del servicio

## Variables de Entorno

```env
DB_SERVICE_PORT=3001          # Puerto del servicio (default: 3001)
DB_SERVICE_HOST=0.0.0.0       # Host (default: 0.0.0.0)
DB_PATH=/app/data/app.db      # Ruta de la base de datos (default: ./data/app.db)
```

## Docker

```bash
# Build
docker build -t db-service .

# Run
docker run -p 3001:3001 -v ./data:/app/data db-service
```

## Estructura

```
src/
  config/
    sqlite.ts        # Configuración de SQLite y creación de tablas
  modules/
    users/
      users.routes.ts    # Rutas de usuarios
      users.service.ts   # Lógica de negocio
  server.ts          # Punto de entrada
```
