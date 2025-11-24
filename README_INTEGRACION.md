# Guía de Integración Frontend-Backend

## TelcoNova - Sistema de Gestión de Órdenes de Trabajo

Frontend React + TypeScript integrado completamente con el backend Spring Boot.

---

## 🚀 Inicio Rápido

### Conectar con Backend

1. **Inicia el backend** de Spring Boot en `http://localhost:8080`

2. **Configura el archivo `.env`:**
```bash
VITE_API_URL=http://localhost:8080/api
VITE_USE_MOCK_API=false
```

3. **Ejecuta el frontend:**
```bash
npm install
npm run dev
```

4. **Accede a la aplicación:**
   - URL: `http://localhost:8081` (o el puerto que Vite asigne)
   - **Email**: `test@example.com`
   - **Password**: `secret`

---

## ✅ Estado de la Integración

### Completamente Implementado

#### Autenticación ✅
- Login con JWT
- Token almacenado en localStorage
- Token enviado en header Authorization
- Logout funcional

#### Gestión de Técnicos ✅
- Listado de técnicos
- Visualización de carga de trabajo
- Filtrado por zona y especialidad
- Registro de nuevos técnicos

#### Gestión de Órdenes ✅
- Listado de órdenes de trabajo
- Filtrado por estado y zona
- Visualización de detalles completos
- Todos los campos en español

#### Asignaciones ✅
- **Asignación Manual**: Seleccionar técnico específico
- **Asignación Automática**: Algoritmo inteligente del backend
- Notificaciones automáticas por email
- Actualización de workload

#### Reportes ✅
- Generación de métricas por técnico
- Filtros por fecha, servicio y zona
- Guardado de reportes
- Historial con paginación
- Exportación a CSV
- Visualización con gráficos

---

## 📊 Estructura de Datos

### Todos los campos usan nombres en ESPAÑOL

#### WorkOrder (Orden de Trabajo)
```typescript
interface WorkOrder {
  id: string;
  zona: string;
  servicio: string;
  descripcion: string;
  nombreCliente: string;
  direccion: string;
  prioridad: string;  // 'low' | 'medium' | 'high'
  status: string;     // 'pending' | 'assigned' | 'in_progress' | 'completed'
  assignedTo: string | null;
  asignadoEn: string | null;
  asignadoPor: string | null;
  creadoEn: string;
}
```

#### Technician (Técnico)
```typescript
interface Technician {
  id: string;
  idTecnico: string;
  name: string;
  nameTecnico: string;
  zone: string;
  zoneTecnico: string;
  specialty: string;
  specialtyTecnico: string;
  currentLoad: number;
  workloadTecnico: string;
  availability: 'available' | 'busy' | 'offline';
  email: string;
  phone: string;
}
```

#### SavedReport (Reporte Guardado)
```typescript
interface SavedReport {
  idReporte: string;
  nombreReporte: string;
  filtros: {
    startDate: string;
    endDate: string;
    serviceType: string;
    zone: string;
  };
  metricas: Array<{
    technicianId: string;
    technicianName: string;
    zone: string;
    specialty: string;
    totalOrders: number;
    completedOrders: number;
    inProgressOrders: number;
    avgResolutionTime: number;
  }>;
  resumen: {
    totalOrders: number;
    totalCompleted: number;
    totalInProgress: number;
    avgResolutionTime: number;
  };
  creadoEn: string;
  creadoPor: string;
}
```

#### AssignmentRequest (Solicitud de Asignación)
```typescript
interface AssignmentRequest {
  idOrden: string;
  idTecnico: string;
  automatico?: boolean;
}
```

#### NotificationData (Datos de Notificación)
```typescript
interface NotificationData {
  idOrden: string;
  idTecnico: string;
  canales: string[];  // ['email', 'sms']
}
```

---

## 🔌 Endpoints Utilizados

### Autenticación
- `POST /api/auth/login` - Login con email/password
- `POST /api/auth/register` - Registro de usuario

### Técnicos
- `GET /api/technicians/all` - Listar técnicos
- `POST /api/technicians/create` - Crear técnico

### Órdenes de Trabajo
- `GET /api/orders/all?status=&zona=` - Listar órdenes (con filtros)
- `GET /api/orders/{id}` - Obtener orden específica
- `POST /api/orders/create` - Crear orden
- `PUT /api/orders/update/{id}` - Actualizar orden
- `DELETE /api/orders/delete/{id}` - Eliminar orden

### Asignaciones
- `POST /api/assignments/manual` - Asignación manual
- `POST /api/assignments/automatic` - Asignación automática

### Reportes
- `GET /api/reports/technician-metrics` - Obtener métricas
- `POST /api/reports/save` - Guardar reporte
- `GET /api/reports/history` - Historial de reportes
- `GET /api/reports/history/{id}` - Detalle de reporte
- `DELETE /api/reports/history/{id}` - Eliminar reporte

### Notificaciones
- `POST /api/notifications/send` - Enviar notificación

---

## 🔐 Autenticación

### Flujo de Autenticación

1. **Login:**
   ```typescript
   const response = await apiService.login({
     email: 'test@example.com',
     password: 'secret'
   });
   // response.token contiene el JWT
   ```

2. **Almacenamiento:**
   - Token guardado en `localStorage` como `auth_token`

3. **Uso:**
   - Todas las peticiones incluyen: `Authorization: Bearer <token>`

4. **Logout:**
   ```typescript
   await apiService.logout();
   // Limpia el token de localStorage
   ```

---

## 🎨 Componentes Principales

### Páginas
- **Dashboard** - Vista principal con resumen
- **ReportsPanel** - Generación y gestión de reportes
- **AdminPanel** - Registro de técnicos

### Componentes
- **WorkOrdersList** - Lista de órdenes de trabajo
- **TechniciansList** - Lista de técnicos
- **ManualAssignment** - Asignación manual
- **AutomaticAssignment** - Asignación automática

---

## 🛠 Configuración

### Variables de Entorno (.env)

```bash
# URL del backend
VITE_API_URL=http://localhost:8080/api

# Usar API mock (false para producción)
VITE_USE_MOCK_API=false
```

### Dependencias Principales

```json
{
  "react": "^18.3.1",
  "react-router-dom": "^7.1.1",
  "typescript": "~5.6.2",
  "tailwindcss": "^3.4.17",
  "recharts": "^2.15.0",
  "lucide-react": "^0.469.0"
}
```

---

## 🐛 Solución de Problemas

### Error de CORS

**Síntoma:** `Access to fetch at 'http://localhost:8080/api/...' has been blocked by CORS policy`

**Solución:**
1. Verificar que el backend esté corriendo
2. Verificar configuración CORS en `SecurityConfig.java`
3. Asegurar que el puerto del frontend esté permitido

### Error 403 Forbidden

**Síntoma:** Todas las peticiones devuelven 403

**Solución:**
1. Borrar `localStorage` del navegador
2. Hacer logout y login nuevamente
3. Verificar que el token JWT sea válido

### Datos No Se Muestran

**Síntoma:** Componentes vacíos o "undefined"

**Solución:**
1. Abrir DevTools → Network
2. Verificar que las respuestas del backend tengan status 200
3. Verificar que los nombres de campos coincidan (deben estar en español)

### Frontend No Se Conecta

**Síntoma:** `ERR_CONNECTION_REFUSED`

**Solución:**
1. Verificar que el backend esté corriendo en puerto 8080
2. Verificar `VITE_API_URL` en `.env`
3. Reiniciar el frontend

---

## 📝 Notas Importantes

### Consistencia de Nombres
- **TODO el sistema usa nombres en ESPAÑOL**
- Backend envía: `nombreCliente`, `zona`, `servicio`, etc.
- Frontend usa los mismos nombres directamente
- No hay mapeo entre inglés y español

### Parseo de JSON
- Los reportes guardados tienen `filtros`, `metricas`, `resumen` como strings JSON
- `api.ts` los parsea automáticamente a objetos
- Esto es transparente para los componentes

### Autenticación JWT
- El token se envía en TODAS las peticiones (excepto login/register)
- Si el token expira, el usuario debe hacer login nuevamente
- El backend valida el token en cada request

---

## 🚀 Próximos Pasos

### Mejoras Sugeridas
1. Implementar refresh tokens
2. Agregar manejo de errores más robusto
3. Implementar tests unitarios
4. Agregar loading states mejorados
5. Implementar paginación en órdenes

### Funcionalidades Adicionales
1. Búsqueda avanzada de órdenes
2. Edición de órdenes existentes
3. Historial de cambios
4. Notificaciones en tiempo real
5. Dashboard con más métricas

---

## 📞 Soporte

Para preguntas sobre la integración, consultar:
- [Backend README](../BackendFabrica/README.md)
- [Endpoints de Reportes](./ENDPOINTS_REPORTES.md)
- [Walkthrough de Integración](../.gemini/antigravity/brain/9490a906-e276-4b86-b391-1537ec4d01f7/walkthrough_sesion_final.md)

---

## 📄 Licencia

Proyecto privado - TelcoNova © 2024
