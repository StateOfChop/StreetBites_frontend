# StreetBites Frontend

Sistema de gestión de pedidos para comida rápida - Frontend Angular.

## 🚀 Tecnologías

- **Angular 21** con componentes standalone
- **TypeScript** 
- **Tailwind CSS** para estilos
- **Signals** para manejo de estado reactivo

## 📋 Requisitos Previos

- Node.js 18+
- npm 9+
- Backend corriendo en `http://localhost:5000`

## 🛠️ Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run start
```

La aplicación estará disponible en `http://localhost:4200`

## 📁 Estructura del Proyecto

```
src/app/
├── core/                   # Servicios, guards e interceptors globales
│   ├── guards/            # AuthGuard, RoleGuard, NoAuthGuard
│   ├── interceptors/      # Auth, Error, Loading interceptors
│   ├── models/            # Modelos de autenticación
│   └── services/          # AuthService, LoadingService
├── features/              # Módulos por funcionalidad
│   ├── admin/             # Dashboard, gestión de productos y pedidos
│   ├── auth/              # Login, registro
│   ├── orders/            # Carrito, lista de pedidos, detalle
│   └── products/          # Lista de productos
├── shared/                # Componentes compartidos
│   ├── components/        # Navbar, Spinner, ConfirmDialog
│   └── pipes/             # Pipes personalizados
└── environments/          # Configuración por ambiente
```

## 👥 Roles de Usuario

### USER
- Ver productos disponibles
- Agregar productos al carrito
- Realizar pedidos
- Ver sus pedidos
- Cancelar pedidos pendientes

### ADMIN
- Dashboard con estadísticas
- Gestionar productos (CRUD)
- Gestionar todos los pedidos
- Cambiar estado de pedidos

## 🔐 Credenciales por Defecto

| Rol   | Email                  | Password  |
|-------|------------------------|-----------|
| Admin | admin@streetbites.com  | Admin123! |

## 📦 Scripts Disponibles

```bash
npm run start    # Servidor de desarrollo
npm run build    # Build de producción
npm run test     # Ejecutar tests
```

## 🔧 Configuración

Editar `src/app/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000'
};
```

## 📝 Licencia

MIT
