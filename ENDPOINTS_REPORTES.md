# Documentación de Integración Backend - Panel de Reportes

## Endpoints REST Necesarios

### 1. Obtener Métricas de Técnicos

**Propósito**: Obtener las métricas agrupadas por técnico según filtros aplicados.

- **Método**: `GET`
- **Path**: `/api/reports/technician-metrics`
- **Parámetros Query**:
  - `startDate` (string, required): Fecha inicio en formato ISO (YYYY-MM-DD)
  - `endDate` (string, required): Fecha fin en formato ISO (YYYY-MM-DD)
  - `serviceType` (string, optional): Tipo de servicio (specialty) o 'all'
  - `zone` (string, optional): Zona o 'all'

**Request Sample**:
```
GET /api/reports/technician-metrics?startDate=2024-01-01&endDate=2024-12-31&serviceType=all&zone=all
```

**Response Sample (200 OK)**:
```json
{
  "success": true,
  "data": {
    "metrics": [
      {
        "technicianId": "tech-001",
        "technicianName": "Juan Pérez",
        "zone": "Norte",
        "specialty": "Electricidad",
        "totalOrders": 45,
        "completedOrders": 40,
        "inProgressOrders": 5,
        "avgResolutionTime": 3.2
      },
      {
        "technicianId": "tech-002",
        "technicianName": "María García",
        "zone": "Sur",
        "specialty": "Plomería",
        "totalOrders": 38,
        "completedOrders": 35,
        "inProgressOrders": 3,
        "avgResolutionTime": 2.8
      }
    ],
    "summary": {
      "totalOrders": 83,
      "totalCompleted": 75,
      "totalInProgress": 8,
      "avgResolutionTime": 3.0
    }
  }
}
```

---

### 2. Guardar Reporte Generado

**Propósito**: Guardar un reporte generado para consulta histórica posterior.

- **Método**: `POST`
- **Path**: `/api/reports/save`
- **Headers**: 
  - `Authorization: Bearer {token}`
  - `Content-Type: application/json`

**Request Body**:
```json
{
  "reportName": "Reporte Mensual Enero 2024",
  "filters": {
    "startDate": "2024-01-01",
    "endDate": "2024-01-31",
    "serviceType": "Electricidad",
    "zone": "Norte"
  },
  "metrics": [
    {
      "technicianId": "tech-001",
      "technicianName": "Juan Pérez",
      "zone": "Norte",
      "specialty": "Electricidad",
      "totalOrders": 45,
      "completedOrders": 40,
      "inProgressOrders": 5,
      "avgResolutionTime": 3.2
    }
  ],
  "summary": {
    "totalOrders": 45,
    "totalCompleted": 40,
    "totalInProgress": 5,
    "avgResolutionTime": 3.2
  }
}
```

**Response Sample (201 Created)**:
```json
{
  "success": true,
  "message": "Reporte guardado exitosamente",
  "data": {
    "reportId": "report-12345",
    "reportName": "Reporte Mensual Enero 2024",
    "createdAt": "2024-01-31T10:30:00Z",
    "createdBy": "user-001"
  }
}
```

---

### 3. Obtener Reportes Históricos

**Propósito**: Consultar lista de reportes guardados previamente.

- **Método**: `GET`
- **Path**: `/api/reports/history`
- **Headers**: 
  - `Authorization: Bearer {token}`
- **Parámetros Query**:
  - `page` (number, optional): Número de página (default: 1)
  - `limit` (number, optional): Elementos por página (default: 10)
  - `sortBy` (string, optional): Campo para ordenar (createdAt, reportName)
  - `sortOrder` (string, optional): asc o desc (default: desc)

**Request Sample**:
```
GET /api/reports/history?page=1&limit=10&sortBy=createdAt&sortOrder=desc
```

**Response Sample (200 OK)**:
```json
{
  "success": true,
  "data": {
    "reports": [
      {
        "reportId": "report-12345",
        "reportName": "Reporte Mensual Enero 2024",
        "filters": {
          "startDate": "2024-01-01",
          "endDate": "2024-01-31",
          "serviceType": "Electricidad",
          "zone": "Norte"
        },
        "summary": {
          "totalOrders": 45,
          "totalCompleted": 40,
          "totalInProgress": 5,
          "avgResolutionTime": 3.2
        },
        "createdAt": "2024-01-31T10:30:00Z",
        "createdBy": "user-001",
        "createdByName": "Admin User"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalReports": 47,
      "limit": 10
    }
  }
}
```

---

### 4. Obtener Detalle de Reporte Histórico

**Propósito**: Consultar el detalle completo de un reporte guardado específico.

- **Método**: `GET`
- **Path**: `/api/reports/history/{reportId}`
- **Headers**: 
  - `Authorization: Bearer {token}`
- **Parámetros Path**:
  - `reportId` (string, required): ID del reporte

**Request Sample**:
```
GET /api/reports/history/report-12345
```

**Response Sample (200 OK)**:
```json
{
  "success": true,
  "data": {
    "reportId": "report-12345",
    "reportName": "Reporte Mensual Enero 2024",
    "filters": {
      "startDate": "2024-01-01",
      "endDate": "2024-01-31",
      "serviceType": "Electricidad",
      "zone": "Norte"
    },
    "metrics": [
      {
        "technicianId": "tech-001",
        "technicianName": "Juan Pérez",
        "zone": "Norte",
        "specialty": "Electricidad",
        "totalOrders": 45,
        "completedOrders": 40,
        "inProgressOrders": 5,
        "avgResolutionTime": 3.2
      }
    ],
    "summary": {
      "totalOrders": 45,
      "totalCompleted": 40,
      "totalInProgress": 5,
      "avgResolutionTime": 3.2
    },
    "createdAt": "2024-01-31T10:30:00Z",
    "createdBy": "user-001",
    "createdByName": "Admin User"
  }
}
```

---

### 5. Eliminar Reporte Histórico

**Propósito**: Eliminar un reporte guardado del historial.

- **Método**: `DELETE`
- **Path**: `/api/reports/history/{reportId}`
- **Headers**: 
  - `Authorization: Bearer {token}`

**Request Sample**:
```
DELETE /api/reports/history/report-12345
```

**Response Sample (200 OK)**:
```json
{
  "success": true,
  "message": "Reporte eliminado exitosamente"
}
```

---

## Notas de Implementación

### Autenticación y Autorización
- Todos los endpoints requieren autenticación mediante Bearer token
- Solo usuarios con rol `supervisor` o `admin` pueden acceder
- Los técnicos deben recibir error 403 Forbidden

### Cálculo de Tiempo Promedio de Resolución
- Se calcula en días desde `createdAt` hasta `completedAt`
- Solo se consideran órdenes con status `completed`
- Fórmula: `sum(completedAt - createdAt) / count(completed_orders)`

### Filtros
- Valor 'all' significa sin filtrar ese criterio
- Fechas en formato ISO (YYYY-MM-DD)
- Validar que `endDate >= startDate`

### Formato de Fechas
Todas las fechas en formato ISO 8601 UTC (YYYY-MM-DDTHH:mm:ssZ).
