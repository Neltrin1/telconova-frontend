# TelcoNova Frontend

Sistema frontend para gestión de órdenes de trabajo y asignación de técnicos.

## 🚀 Despliegue en Producción

**URL de Producción:** https://telconova-frontend.vercel.app

---

## 🛠️ Tecnologías

- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite
- **Routing:** React Router v6
- **UI Components:** Custom components
- **Styling:** CSS Modules
- **Charts:** Recharts
- **Icons:** Lucide React
- **HTTP Client:** Fetch API
- **State Management:** React Hooks
- **Deployment:** Vercel

---

## 📦 Dependencias Principales

```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "react-router-dom": "^6.28.0",
  "recharts": "^2.15.0",
  "lucide-react": "^0.468.0",
  "date-fns": "^4.1.0"
}
```

---

## 🔧 Configuración

### Desarrollo Local

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/Telconova-App/telconova-frontend.git
   cd telconova-frontend
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno:**
   ```bash
   cp .env.example .env
   ```

   Editar `.env`:
   ```bash
   VITE_API_URL=http://localhost:8080
   VITE_USE_MOCK_API=false
   ```

4. **Ejecutar en desarrollo:**
   ```bash
   npm run dev
   ```

5. **Acceder:**
   - Frontend: http://localhost:5173

### Producción (Vercel)

**Variables de Entorno Requeridas:**

```bash
VITE_API_URL=https://telconova-backend.onrender.com
VITE_USE_MOCK_API=false
```

**Build:**
```bash
npm run build
```

**Preview:**
```bash
npm run preview
```

---

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── ui/             # Componentes UI básicos
│   ├── layout/         # Layout components
│   └── ...
├── pages/              # Páginas de la aplicación
│   ├── Dashboard.tsx
│   ├── Login.tsx
│   ├── Orders.tsx
│   ├── Technicians.tsx
│   ├── Assignments.tsx
│   ├── Reports.tsx
│   └── ...
├── lib/                # Utilidades y servicios
│   ├── api.ts          # Cliente API
│   ├── mockApi.ts      # API mock para desarrollo
│   └── utils.ts        # Funciones utilitarias
├── types/              # Definiciones de tipos TypeScript
├── App.tsx             # Componente principal
├── main.tsx            # Entry point
└── index.css           # Estilos globales

public/                 # Archivos estáticos
vercel.json            # Configuración de Vercel
```

---

## 🔐 Autenticación

### Login

El sistema usa JWT para autenticación. Al hacer login:

1. Usuario ingresa email y contraseña
2. Frontend envía credenciales a `/api/auth/login`
3. Backend responde con token JWT
4. Token se guarda en localStorage
5. Token se incluye en todas las peticiones subsecuentes

**Credenciales de prueba:**
- Email: `test@example.com`
- Password: `secret`

### Logout

- Elimina token de localStorage
- Redirige a página de login

---

## 📡 API Integration

### Cliente API

El archivo `src/lib/api.ts` contiene el cliente API que maneja:

- Autenticación con JWT
- Headers automáticos
- Manejo de errores
- Transformación de datos
- Modo mock para desarrollo

### Endpoints Utilizados

**Autenticación:**
- `POST /api/auth/login`

**Técnicos:**
- `GET /api/technicians/all`
- `POST /api/technicians/create`

**Órdenes:**
- `GET /api/orders/all`
- `GET /api/orders/{id}`
- `POST /api/orders/create`
- `PUT /api/orders/update/{id}`
- `DELETE /api/orders/delete/{id}`

**Asignaciones:**
- `POST /api/assignments/manual`
- `POST /api/assignments/automatic`

**Notificaciones:**
- `POST /api/notifications/send`

**Reportes:**
- `GET /api/reports/technician-metrics`
- `POST /api/reports/save`
- `GET /api/reports/history`
- `GET /api/reports/history/{id}`
- `DELETE /api/reports/history/{id}`

---

## 🎨 Características

### Dashboard
- Vista general de órdenes y técnicos
- Estadísticas en tiempo real
- Gráficos de métricas
- Filtros por estado y zona

### Gestión de Órdenes
- Listar todas las órdenes
- Crear nueva orden
- Editar orden existente
- Eliminar orden
- Filtrar por estado y zona

### Gestión de Técnicos
- Ver todos los técnicos
- Información de carga de trabajo
- Especialidades y zonas
- Disponibilidad

### Asignaciones
- **Manual:** Seleccionar técnico específico
- **Automática:** Sistema asigna basado en:
  - Carga de trabajo
  - Zona geográfica
  - Especialidad
  - Disponibilidad

### Notificaciones
- Email automático al asignar orden
- Notificaciones de cambios de estado
- Alertas de sistema

### Reportes
- Métricas de técnicos
- Análisis por período
- Filtros por servicio y zona
- Exportación de datos
- Historial de reportes guardados

---

## 🎯 Rutas

```typescript
/                    → Redirect to /login or /dashboard
/login               → Página de login
/dashboard           → Dashboard principal
/orders              → Gestión de órdenes
/orders/new          → Crear nueva orden
/orders/:id          → Detalle de orden
/technicians         → Gestión de técnicos
/technicians/new     → Registrar técnico
/assignments         → Asignación de órdenes
/reports             → Generación de reportes
/reports/history     → Historial de reportes
```

---

## 🔒 Protección de Rutas

Todas las rutas excepto `/login` requieren autenticación:

```typescript
// Rutas protegidas
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>
```

Si el usuario no está autenticado, se redirige a `/login`.

---

## 🎨 Estilos

### CSS Modules
- Estilos scoped por componente
- Evita conflictos de nombres
- Mejor mantenibilidad

### Variables CSS
```css
:root {
  --primary-color: #3b82f6;
  --secondary-color: #10b981;
  --danger-color: #ef4444;
  --warning-color: #f59e0b;
  --background: #f9fafb;
  --text-primary: #111827;
  --text-secondary: #6b7280;
}
```

### Responsive Design
- Mobile-first approach
- Breakpoints para tablet y desktop
- Componentes adaptables

---

## 🧪 Modo Mock

Para desarrollo sin backend:

```bash
# .env
VITE_USE_MOCK_API=true
```

El sistema usará datos mock definidos en `src/lib/mockApi.ts`.

---

## 📊 Gráficos y Visualizaciones

Usando **Recharts** para:
- Gráficos de barras (órdenes por estado)
- Gráficos de línea (tendencias)
- Gráficos de área (métricas acumuladas)
- Gráficos de pastel (distribución)

---

## 🚀 Deployment en Vercel

### Configuración (`vercel.json`)

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Variables de Entorno en Vercel

1. Ir a proyecto en Vercel
2. Settings → Environment Variables
3. Agregar:
   - `VITE_API_URL`
   - `VITE_USE_MOCK_API`

### Despliegue Automático

- Push a `main` → Despliegue automático
- Pull Request → Preview deployment
- Tiempo de build: ~1-2 minutos

---

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview

# Lint
npm run lint

# Type check
npm run type-check
```

---

## 📱 Responsive Breakpoints

```css
/* Mobile */
@media (max-width: 640px) { }

/* Tablet */
@media (min-width: 641px) and (max-width: 1024px) { }

/* Desktop */
@media (min-width: 1025px) { }
```

---

## 🐛 Troubleshooting

### Error de CORS
- Verificar `VITE_API_URL` apunta al backend correcto
- Confirmar backend tiene `FRONTEND_URL` configurada
- Revisar que backend permite CORS

### Error 403 en API
- Verificar token JWT válido
- Confirmar endpoints tienen prefijo `/api`
- Revisar que backend está corriendo

### Build Falla
- Limpiar node_modules: `rm -rf node_modules && npm install`
- Verificar versión de Node.js (>=18)
- Revisar errores de TypeScript

### Rutas No Funcionan en Producción
- Verificar `vercel.json` tiene rewrites configurados
- Confirmar SPA routing habilitado

---

## 🔗 Enlaces

- **Producción:** https://telconova-frontend.vercel.app
- **GitHub:** https://github.com/Telconova-App/telconova-frontend
- **Backend:** https://telconova-backend.onrender.com
- **Vercel Dashboard:** https://vercel.com/dashboard

---

## 📝 Notas de Desarrollo

### Agregar Nueva Página

1. Crear componente en `src/pages/`
2. Agregar ruta en `App.tsx`
3. Actualizar navegación si es necesario
4. Agregar tipos en `src/types/` si es necesario

### Agregar Nuevo Endpoint

1. Agregar método en `src/lib/api.ts`
2. Agregar tipos en interfaces
3. Agregar mock data en `src/lib/mockApi.ts` si es necesario
4. Usar en componente

---

## 🎯 Mejoras Futuras

- [ ] Tests unitarios con Vitest
- [ ] Tests E2E con Playwright
- [ ] PWA support
- [ ] Notificaciones push
- [ ] Modo offline
- [ ] Internacionalización (i18n)
- [ ] Tema oscuro
- [ ] Exportación de reportes a PDF
- [ ] Gráficos más avanzados

---

## 📄 Licencia

Este proyecto es privado y de uso interno.

---

## 👥 Equipo

Desarrollado para TelcoNova - Sistema de Gestión de Órdenes de Trabajo
