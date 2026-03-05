# ✅ Evershop + Módulo de Consignaciones - LISTO

## Estado Actual

✅ **Servidor corriendo**: http://localhost:3000  
✅ **Base de datos**: PostgreSQL en localhost:5432  
✅ **Extensión de consignaciones**: Cargada correctamente  
✅ **Tablas creadas**: 6 tablas de consignaciones instaladas

## Verificación

### 1. Servidor Activo
```bash
ps aux | grep "evershop dev"
# Proceso corriendo: PID 2047887
```

### 2. Puerto Escuchando
```bash
ss -tlnp | grep :3000
# tcp6  :::3000  LISTEN
```

### 3. Extensión Cargada
```
[Consignments] Extension loaded successfully
Your website is running at "http://localhost:3000"
```

### 4. Tablas en Base de Datos
```sql
SELECT tablename FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename LIKE 'consignment%';

-- Resultados:
consignments
consignment_items
consignment_sales
consignment_returns
consignment_payments
consignment_logs
```

## Estructura del Proyecto

```
my-evershop-app/
├── .env                          # Configuración de BD
├── config/
│   └── default.json              # Extensions registradas
├── extensions/
│   ├── sample/                   # Extensión de ejemplo
│   └── consignments/             # ✨ Módulo de consignaciones
│       ├── package.json
│       ├── tsconfig.json
│       └── src/
│           ├── bootstrap.ts      # Inicialización
│           ├── api/              # (vacío - API REST por agregar)
│           ├── graphql/          # (vacío - GraphQL por agregar)
│           ├── pages/            # (vacío - UI por agregar)
│           └── subscribers/      # (vacío - Eventos por agregar)
├── install_consignments.sql      # Script de instalación de tablas
└── evershop.log                  # Logs del servidor
```

## Cómo Usar

### Acceder al Sitio
```bash
# Browser
http://localhost:3000

# Admin
http://localhost:3000/admin
```

### Ver Logs en Tiempo Real
```bash
tail -f evershop.log
```

### Detener el Servidor
```bash
pkill -f "evershop dev"
# o
kill $(ps aux | grep "evershop dev" | grep -v grep | awk '{print $2}')
```

### Reiniciar el Servidor
```bash
pkill -f "evershop dev"
npm run dev > evershop.log 2>&1 &
```

## Próximos Pasos

### 1. Agregar API REST

Crea endpoints en `extensions/consignments/src/api/`:

```typescript
// extensions/consignments/src/api/getConsignments/route.json
{
  "path": "/api/consignments",
  "method": "GET"
}

// extensions/consignments/src/api/getConsignments/getConsignments.js
export default async function getConsignments(request, response) {
  // Tu lógica aquí
  const consignments = await pool.query('SELECT * FROM consignments');
  response.json(consignments.rows);
}
```

### 2. Agregar GraphQL

Crea schemas en `extensions/consignments/src/graphql/`:

```graphql
# extensions/consignments/src/graphql/types/Consignment/Consignment.graphql
type Consignment {
  id: ID!
  reference: String!
  status: String!
  commission_value: Float!
}

extend type Query {
  consignments: [Consignment]
}
```

### 3. Agregar Páginas de Admin

Crea componentes en `extensions/consignments/src/pages/admin/`:

```tsx
// extensions/consignments/src/pages/admin/consignmentsList/ConsignmentsList.tsx
export default function ConsignmentsList() {
  return (
    <div>
      <h1>Consignaciones</h1>
      {/* Tu UI aquí */}
    </div>
  );
}
```

### 4. Eventos y Subscribers

Crea subscribers en `extensions/consignments/src/subscribers/`:

```javascript
// extensions/consignments/src/subscribers/order_created/recordConsignmentSale.js
export default async function recordConsignmentSale(orderData) {
  // Cuando se crea una orden, registrar venta de consignación
}
```

## Base de Datos - Tablas Disponibles

### `consignments`
Tabla principal de consignaciones con vendedores.

Campos clave:
- `id` (UUID)
- `vendor_id` (UUID)
- `reference` (VARCHAR)
- `status` ('active', 'suspended', 'closed')
- `commission_type` ('percentage', 'fixed')
- `commission_value` (DECIMAL)
- `margin_type` ('percentage', 'fixed')
- `margin_value` (DECIMAL)
- `total_products_sent` (INTEGER)
- `total_products_sold` (INTEGER)
- `total_commission_earned` (DECIMAL)

### `consignment_items`
Productos enviados en consignación.

### `consignment_sales`
Registro de ventas de productos consignados.

### `consignment_returns`
Devoluciones de productos.

### `consignment_payments`
Pagos a vendedores.

### `consignment_logs`
Auditoría de cambios.

## Queries de Ejemplo

### Crear una consignación
```sql
INSERT INTO consignments 
(vendor_id, reference, commission_type, commission_value, margin_type, margin_value)
VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'CON-001', 'percentage', 10.00, 'percentage', 5.00);
```

### Listar consignaciones activas
```sql
SELECT * FROM consignments WHERE status = 'active';
```

### Ver items de una consignación
```sql
SELECT ci.*, p.name as product_name
FROM consignment_items ci
LEFT JOIN product p ON ci.product_id = p.uuid
WHERE ci.consignment_id = 'your-consignment-id';
```

### Calcular comisiones del mes
```sql
SELECT 
  c.reference,
  SUM(cs.commission_amount) as total_commission,
  SUM(cs.margin_amount) as total_margin
FROM consignments c
JOIN consignment_sales cs ON c.id = cs.consignment_id
WHERE cs.sale_date >= DATE_TRUNC('month', CURRENT_DATE)
GROUP BY c.id, c.reference;
```

## Solución de Problemas

### El servidor no se inicia
```bash
# Ver logs completos
cat evershop.log

# Verificar proceso
ps aux | grep evershop

# Verificar puerto
ss -tlnp | grep :3000
```

### Error: "Module not found"
```bash
# Reinstalar dependencias
npm install

# Limpiar y reconstruir
rm -rf node_modules package-lock.json
npm install
```

### Error de base de datos
```bash
# Verificar conexión
PGPASSWORD=postgres psql -h localhost -U postgres -d evershop -c "SELECT 1"

# Ver tablas
PGPASSWORD=postgres psql -h localhost -U postgres -d evershop -c "\dt"
```

## Recursos

- **Documentación Evershop**: https://evershop.io/docs
- **Logs del servidor**: `evershop.log`
- **Script de instalación**: `install_consignments.sql`

## Información del Sistema

- **OS**: Linux (Pop!_OS)
- **Node.js**: v22
- **PostgreSQL**: 16
- **Evershop**: 2.1.1
- **Puerto**: 3000

---

**Estado**: ✅ TODO FUNCIONANDO CORRECTAMENTE

El servidor está listo para desarrollo. Puedes comenzar a agregar funcionalidades al módulo de consignaciones siguiendo los ejemplos en la extensión `sample`.
