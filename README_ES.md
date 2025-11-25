# TelcoNova - Sistema de Asignación de Técnicos

Sistema de gestión y asignación de técnicos para empresas de telecomunicaciones. Permite asignación manual y automática de órdenes de trabajo, seguimiento en tiempo real y notificaciones a técnicos.

## 🚀 Características

### Sprint 1 (HU_01, HU_03)
- ✅ **Autenticación Segura (HU_01)**
  - Login con validación de credenciales
  - Bloqueo temporal tras 3 intentos fallidos (15 minutos)
  - Control de acceso por rol (solo supervisores)
  - Registro de intentos de acceso

- ✅ **Asignación Manual de Técnicos (HU_03)**
  - Búsqueda avanzada de técnicos (zona, especialidad, disponibilidad)
  - Selección manual de técnico para orden de trabajo
  - Registro de supervisor que realiza la asignación
  - Trazabilidad completa de asignaciones

### Sprint 2 (HU_02, HU_04)
- ✅ **Asignación Automática (HU_02)**
  - Algoritmo inteligente de asignación basado en:
    1. Especialidad técnica
    2. Carga de trabajo actual
    3. Proximidad geográfica
  - Validación de asignación automática antes de confirmar
  - Registro del algoritmo usado

- ✅ **Sistema de Notificaciones (HU_04)**
  - Notificaciones en tiempo real
  - Múltiples canales (Email, SMS)
  - Detalles completos de la orden
  - Registro de estado de entrega

## 🛠️ Stack Tecnológico

- **Frontend Framework**: React 18 + TypeScript
- **Routing**: React Router DOM v6
- **UI Components**: shadcn/ui + Radix UI
- **Styling**: Tailwind CSS
- **State Management**: TanStack Query (React Query)
- **Build Tool**: Vite
- **Icons**: Lucide React

## 📦 Instalación

```bash
# Clonar el repositorio
git clone <repository-url>
cd telconova-frontend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con la URL de tu backend

# Iniciar en desarrollo
npm run dev
```

## 🔧 Configuración

### Variables de Entorno

```env
# Desarrollo
VITE_API_URL=http://localhost:8080
VITE_USE_MOCK_API=false

# Producción
VITE_API_URL=https://telconova-backend.onrender.com
VITE_USE_MOCK_API=false
```

### Integración con Backend

Ver el archivo `INTEGRATION.md` para la documentación completa de los endpoints requeridos.

Endpoints principales:
- `POST /api/auth/login` - Autenticación
- `GET /api/technicians` - Listar técnicos
- `GET /api/work-orders` - Listar órdenes
- `POST /api/assignments/manual` - Asignación manual
- `POST /api/assignments/automatic` - Asignación automática
- `POST /api/notifications/send` - Enviar notificaciones

## 🎨 Sistema de Diseño

El proyecto utiliza un sistema de diseño completo basado en tokens semánticos:

### Colores
- **Primary**: Azul corporativo (#2563EB)
- **Secondary**: Azul claro (#E0F2FE)
- **Accent**: Naranja (#FF8C00)
- **Success**: Verde (#16A34A)
- **Warning**: Amarillo (#EAB308)
- **Destructive**: Rojo (#EF4444)

### Sombras
- `shadow-soft`: Sombra suave
- `shadow-medium`: Sombra media
- `shadow-strong`: Sombra pronunciada

Todos los colores y estilos están definidos en `src/index.css` y `tailwind.config.ts`.

## 📱 Páginas y Componentes

### Páginas
- **Login** (`/`): Autenticación de supervisor
- **Dashboard** (`/dashboard`): Panel principal con tabs:
  - Órdenes de Trabajo
  - Asignación Manual
  - Asignación Automática
  - Lista de Técnicos

### Componentes Principales
- `ManualAssignment`: Búsqueda y asignación manual de técnicos
- `AutomaticAssignment`: Asignación automática con algoritmo inteligente
- `WorkOrdersList`: Lista de todas las órdenes de trabajo
- `TechniciansList`: Lista de técnicos con estado y carga

## 🔒 Seguridad

### Autenticación (HU_01)
- ✅ Validación segura de credenciales
- ✅ Tokens JWT para sesiones
- ✅ Bloqueo tras 3 intentos fallidos
- ✅ Control de acceso por rol
- ✅ Registro de auditoría de accesos

### Asignaciones (HU_03)
- ✅ Registro de supervisor responsable
- ✅ Timestamp de cada asignación
- ✅ Trazabilidad de reasignaciones
- ✅ Validación de permisos

### Notificaciones (HU_04)
- ✅ Sin información sensitiva en notificaciones
- ✅ Registro de estado de entrega
- ✅ Canales seguros (Email, SMS)

## ♿ Accesibilidad

El sistema cumple con WCAG 2.1 nivel AA:
- Labels ARIA en todos los controles
- Navegación completa por teclado
- Contraste de colores adecuado
- Soporte para lectores de pantalla
- Mensajes de error descriptivos

## 📊 Características de Negocio

### Algoritmo de Asignación Automática (HU_02)

Priorización:
1. **Especialidad** (más importante): Coincidencia con requerimientos técnicos
2. **Carga de trabajo** (importante): Menor número de órdenes asignadas
3. **Zona** (importante): Mayor proximidad al cliente

Fallback: Si no hay técnicos disponibles, la orden se añade a cola de espera.

### Sistema de Notificaciones (HU_04)

Contenido de notificaciones:
- Número de orden
- Dirección del cliente
- Prioridad
- Contacto del cliente
- Descripción del trabajo

Canales soportados:
- Email
- SMS

## 🧪 Testing

```bash
# Ejecutar tests
npm test

# Coverage
npm run test:coverage
```

## 🏗️ Build y Deploy

```bash
# Build para producción
npm run build

# Preview del build
npm run preview
```

El proyecto está desplegado en:
- **Producción:** https://telconova-frontend.vercel.app
- **Plataforma:** Vercel
- **Backend:** https://telconova-backend.onrender.com

## 📚 Documentación Adicional

- [Guía de Integración Backend](./INTEGRATION.md)
- [Historias de Usuario](./docs/user-stories.md) (compartidas en el contexto)
- [Sistema de Diseño](./docs/design-system.md)

## 🤝 Contribuir

1. Fork del proyecto
2. Crear rama de feature (`git checkout -b feature/AmazingFeature`)
3. Commit de cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto es parte del desarrollo académico para TelcoNova.

## 👥 Equipo

Proyecto desarrollado durante Sprint 1 y Sprint 2 del curso.

## 🔗 Enlaces

- [Frontend Repository](https://github.com/DanielJimenez0429/TelconovaFront2)
- [Mockups Figma](https://www.figma.com/design/qRPYwhJWYW5tGzBlWkxDz4/TelcoNovaF2)

## 📞 Soporte

Para preguntas o problemas, contactar al equipo de desarrollo.
