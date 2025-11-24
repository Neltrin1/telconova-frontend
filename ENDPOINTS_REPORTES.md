# Endpoints de Reportes - TelcoNova Backend

Documentación completa de los endpoints REST para el panel de reportes del sistema TelcoNova.

---

## 📋 Tabla de Contenidos

- [Resumen](#resumen)
- [Autenticación](#autenticación)
- [Endpoints](#endpoints)
  - [Obtener Métricas de Técnicos](#1-obtener-métricas-de-técnicos)
  - [Guardar Reporte](#2-guardar-reporte)
  - [Obtener Historial de Reportes](#3-obtener-historial-de-reportes)
  - [Obtener Detalle de Reporte](#4-obtener-detalle-de-reporte)
  - [Eliminar Reporte](#5-eliminar-reporte)
- [Modelos de Datos](#modelos-de-datos)
- [Códigos de Estado](#códigos-de-estado)
- [Ejemplos de Uso](#ejemplos-de-uso)

---

## 📝 Resumen

Los endpoints de reportes permiten:
- ✅ Generar métricas de desempeño por técnico
- ✅ Aplicar filtros por fecha, tipo de servicio y zona
- ✅ Guardar reportes para consulta posterior
- ✅ Consultar historial con paginación
- ✅ Eliminar reportes antiguos

**Base URL:** `http://localhost:8080/api/reports`

---

## 🔐 Autenticación

Todos los endpoints requieren autenticación JWT.

**Header requerido:**
```
Authorization: Bearer <token_jwt>
```

**Roles permitidos:**
- `supervisor`
- `admin`

---

## 🔌 Endpoints

### 1. Obtener Métricas de Técnicos

Genera métricas de desempeño de técnicos con filtros personalizables.

#### Request

```http
GET /api/reports/technician-metrics
```

#### Query Parameters

| Parámetro | Tipo | Requerido | Default | Descripción |
|-----------|------|-----------|---------|-------------|
| `startDate` | string | ✅ | - | Fecha inicio (YYYY-MM-DD) |
| `endDate` | string | ✅ | - | Fecha fin (YYYY-MM-DD) |
| `serviceType` | string | ❌ | "all" | Tipo de servicio o "all" |
| `zone` | string | ❌ | "all" | Zona geográfica o "all" |

#### Ejemplo de Request

```http
GET /api/reports/technician-metrics?startDate=2024-01-01&endDate=2024-01-31&serviceType=Electricidad&zone=Norte
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "metrics": [
      {
        "technicianId": "1",
        "technicianName": "Juan Perez",
        "zone": "Norte",
        "specialty": "Electricidad",
        "totalOrders": 15,
        "completedOrders": 12,
        "inProgressOrders": 3,
        "avgResolutionTime": 2.5
      },
      {
        "technicianId": "2",
        "technicianName": "Maria Gomez",
        "zone": "Sur",
        "specialty": "Plomería",
        "totalOrders": 10,
        "completedOrders": 9,
        "inProgressOrders": 1,
        "avgResolutionTime": 1.8
      }
    ],
    "summary": {
      "totalOrders": 25,
      "totalCompleted": 21,
      "totalInProgress": 4,
      "avgResolutionTime": 2.2
    }
  }
}
```

#### Cálculo de Métricas

**totalOrders:** Número total de órdenes asignadas al técnico en el período

**completedOrders:** Órdenes con status = "completed"

**inProgressOrders:** Órdenes con status = "assigned" o "in_progress"

**avgResolutionTime:** Promedio de días entre `creadoEn` y fecha actual para órdenes completadas

---

### 2. Guardar Reporte

Guarda un reporte generado para consulta posterior.

#### Request

```http
POST /api/reports/save
Content-Type: application/json
Authorization: Bearer <token>
```

#### Body

```json
{
  "nombreReporte": "Reporte Mensual Enero 2024",
  "filtros": {
    "startDate": "2024-01-01",
    "endDate": "2024-01-31",
    "serviceType": "all",
    "zone": "all"
  },
  "metricas": [
    {
      "technicianId": "1",
      "technicianName": "Juan Perez",
      "zone": "Norte",
      "specialty": "Electricidad",
      "totalOrders": 15,
      "completedOrders": 12,
      "inProgressOrders": 3,
      "avgResolutionTime": 2.5
    }
  ],
  "resumen": {
    "totalOrders": 50,
    "totalCompleted": 45,
    "totalInProgress": 5,
    "avgResolutionTime": 2.8
  }
}
```

#### Validaciones

- ✅ `nombreReporte` es requerido y no puede estar vacío
- ✅ `filtros` es requerido
- ✅ `metricas` es requerido
- ✅ `resumen` es requerido

#### Response (201 Created)

```json
{
  "success": true,
  "message": "Reporte guardado exitosamente",
  "data": {
    "idReporte": "RPT-1706198400000",
    "nombreReporte": "Reporte Mensual Enero 2024",
    "filtros": "{\"startDate\":\"2024-01-01\",\"endDate\":\"2024-01-31\",\"serviceType\":\"all\",\"zone\":\"all\"}",
    "metricas": "[{\"technicianId\":\"1\",\"technicianName\":\"Juan Perez\",...}]",
    "resumen": "{\"totalOrders\":50,\"totalCompleted\":45,\"totalInProgress\":5,\"avgResolutionTime\":2.8}",
    "creadoEn": "2024-01-25T14:30:00",
    "creadoPor": "user-001"
  }
}
```

#### Notas

- El `idReporte` se genera automáticamente con formato `RPT-{timestamp}`
- Los campos `filtros`, `metricas` y `resumen` se almacenan como JSON strings
- El frontend debe parsearlos al recibirlos

---

### 3. Obtener Historial de Reportes

Consulta el historial de reportes guardados con paginación.

#### Request

```http
GET /api/reports/history
```

#### Query Parameters

| Parámetro | Tipo | Requerido | Default | Descripción |
|-----------|------|-----------|---------|-------------|
| `page` | integer | ❌ | 1 | Número de página |
| `limit` | integer | ❌ | 10 | Elementos por página |
| `sortBy` | string | ❌ | "creadoEn" | Campo para ordenar |
| `sortOrder` | string | ❌ | "desc" | Orden: "asc" o "desc" |

#### Ejemplo de Request

```http
GET /api/reports/history?page=1&limit=10&sortBy=creadoEn&sortOrder=desc
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "reports": [
      {
        "idReporte": "RPT-1706198400000",
        "nombreReporte": "Reporte Mensual Enero 2024",
        "filtros": "{\"startDate\":\"2024-01-01\",\"endDate\":\"2024-01-31\",\"serviceType\":\"all\",\"zone\":\"all\"}",
        "metricas": "[...]",
        "resumen": "{\"totalOrders\":50,\"totalCompleted\":45,\"totalInProgress\":5,\"avgResolutionTime\":2.8}",
        "creadoEn": "2024-01-25T14:30:00",
        "creadoPor": "user-001"
      },
      {
        "idReporte": "RPT-1706112000000",
        "nombreReporte": "Reporte Semanal Semana 3",
        "filtros": "{...}",
        "metricas": "[...]",
        "resumen": "{...}",
        "creadoEn": "2024-01-24T10:00:00",
        "creadoPor": "user-001"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalReports": 25,
      "limit": 10
    }
  }
}
```

#### Campos de Ordenamiento Disponibles

- `creadoEn` (default)
- `nombreReporte`
- `idReporte`

---

### 4. Obtener Detalle de Reporte

Obtiene el detalle completo de un reporte específico.

#### Request

```http
GET /api/reports/history/{reportId}
```

#### Path Parameters

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `reportId` | string | ID del reporte (ej: "RPT-1706198400000") |

#### Ejemplo de Request

```http
GET /api/reports/history/RPT-1706198400000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "idReporte": "RPT-1706198400000",
    "nombreReporte": "Reporte Mensual Enero 2024",
    "filtros": "{\"startDate\":\"2024-01-01\",\"endDate\":\"2024-01-31\",\"serviceType\":\"all\",\"zone\":\"all\"}",
    "metricas": "[{\"technicianId\":\"1\",\"technicianName\":\"Juan Perez\",\"zone\":\"Norte\",\"specialty\":\"Electricidad\",\"totalOrders\":15,\"completedOrders\":12,\"inProgressOrders\":3,\"avgResolutionTime\":2.5}]",
    "resumen": "{\"totalOrders\":50,\"totalCompleted\":45,\"totalInProgress\":5,\"avgResolutionTime\":2.8}",
    "creadoEn": "2024-01-25T14:30:00",
    "creadoPor": "user-001"
  }
}
```

#### Response (404 Not Found)

```json
{
  "success": false,
  "message": "Reporte no encontrado"
}
```

---

### 5. Eliminar Reporte

Elimina un reporte del historial.

#### Request

```http
DELETE /api/reports/history/{reportId}
```

#### Path Parameters

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `reportId` | string | ID del reporte a eliminar |

#### Ejemplo de Request

```http
DELETE /api/reports/history/RPT-1706198400000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Response (200 OK)

```json
{
  "success": true,
  "message": "Reporte eliminado exitosamente"
}
```

#### Response (404 Not Found)

```json
{
  "success": false,
  "message": "Reporte no encontrado"
}
```

---

## 📊 Modelos de Datos

### ReportRequest (DTO)

```java
public record ReportRequest(
    @NotBlank(message = "El nombre del reporte es requerido")
    String nombreReporte,
    
    @NotNull(message = "Los filtros son requeridos")
    Object filtros,
    
    @NotNull(message = "Las métricas son requeridas")
    Object metricas,
    
    @NotNull(message = "El resumen es requerido")
    Object resumen
) {}
```

### Report (Entity)

```java
@Entity
@Table(name = "reportes")
public class Report {
    @Id
    @Column(name = "id_reporte")
    private String idReporte;
    
    @Column(name = "nombre_reporte", nullable = false)
    private String nombreReporte;
    
    @Column(name = "filtros", columnDefinition = "TEXT")
    private String filtros; // JSON string
    
    @Column(name = "metricas", columnDefinition = "TEXT")
    private String metricas; // JSON string
    
    @Column(name = "resumen", columnDefinition = "TEXT")
    private String resumen; // JSON string
    
    @Column(name = "creado_en", nullable = false)
    private LocalDateTime creadoEn;
    
    @Column(name = "creado_por", nullable = false)
    private String creadoPor;
}
```

### Frontend Interface (TypeScript)

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

---

## 🔢 Códigos de Estado

| Código | Descripción |
|--------|-------------|
| 200 | OK - Solicitud exitosa |
| 201 | Created - Reporte creado exitosamente |
| 400 | Bad Request - Datos inválidos o faltantes |
| 401 | Unauthorized - Token JWT inválido o faltante |
| 403 | Forbidden - Sin permisos suficientes |
| 404 | Not Found - Reporte no encontrado |
| 500 | Internal Server Error - Error del servidor |

---

## 💡 Ejemplos de Uso

### Ejemplo 1: Generar Reporte Mensual

```javascript
// 1. Obtener métricas
const response = await fetch(
  'http://localhost:8080/api/reports/technician-metrics?' +
  'startDate=2024-01-01&endDate=2024-01-31&serviceType=all&zone=all',
  {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }
);

const { data } = await response.json();

// 2. Guardar reporte
await fetch('http://localhost:8080/api/reports/save', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    nombreReporte: 'Reporte Mensual Enero 2024',
    filtros: {
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      serviceType: 'all',
      zone: 'all'
    },
    metricas: data.metrics,
    resumen: data.summary
  })
});
```

### Ejemplo 2: Consultar Historial

```javascript
const response = await fetch(
  'http://localhost:8080/api/reports/history?page=1&limit=10&sortBy=creadoEn&sortOrder=desc',
  {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }
);

const { data } = await response.json();

// data.reports contiene los reportes
// data.pagination contiene info de paginación
```

### Ejemplo 3: Ver Detalle de Reporte

```javascript
const reportId = 'RPT-1706198400000';

const response = await fetch(
  `http://localhost:8080/api/reports/history/${reportId}`,
  {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }
);

const { data } = await response.json();

// Parsear JSON strings
const report = {
  ...data,
  filtros: JSON.parse(data.filtros),
  metricas: JSON.parse(data.metricas),
  resumen: JSON.parse(data.resumen)
};
```

---

## 📝 Notas de Implementación

### Almacenamiento de Datos

Los campos `filtros`, `metricas` y `resumen` se almacenan como **JSON strings** en la base de datos:

```java
String filtrosJson = objectMapper.writeValueAsString(request.filtros());
String metricasJson = objectMapper.writeValueAsString(request.metricas());
String resumenJson = objectMapper.writeValueAsString(request.resumen());
```

### Parseo en Frontend

El frontend debe parsear estos strings al recibirlos:

```typescript
if (typeof report.filtros === 'string') {
  report.filtros = JSON.parse(report.filtros);
}
if (typeof report.metricas === 'string') {
  report.metricas = JSON.parse(report.metricas);
}
if (typeof report.resumen === 'string') {
  report.resumen = JSON.parse(report.resumen);
}
```

### Generación de IDs

Los IDs de reportes se generan con el formato:
```java
String reportId = "RPT-" + System.currentTimeMillis();
```

Ejemplo: `RPT-1706198400000`

### Formato de Fechas

Las fechas se manejan como `LocalDateTime` en el backend y se serializan a ISO 8601:
```
2024-01-25T14:30:00
```

---

## 🔒 Seguridad

### Autenticación

Todos los endpoints requieren un token JWT válido en el header `Authorization`.

### Autorización

Solo usuarios con roles `supervisor` o `admin` pueden acceder a estos endpoints.

### Validación

- Los DTOs usan anotaciones de validación (`@NotBlank`, `@NotNull`)
- Spring Boot valida automáticamente los datos de entrada
- Errores de validación retornan 400 Bad Request

---

## 🐛 Manejo de Errores

### Errores Comunes

**400 Bad Request:**
```json
{
  "success": false,
  "message": "El nombre del reporte es requerido"
}
```

**401 Unauthorized:**
```json
{
  "success": false,
  "message": "Token JWT inválido o expirado"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "message": "Reporte no encontrado"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "message": "Error al guardar el reporte: [detalles del error]"
}
```

---

## 📞 Soporte

Para más información, consultar:
- [Backend README](../BackendFabrica/README.md)
- [Frontend Integration Guide](./README_INTEGRACION.md)

---

## 📄 Licencia

Proyecto privado - TelcoNova © 2024
