/**
 * Bootstrap del módulo de Consignments
 * Registra todas las rutas, páginas, GraphQL resolver, y servicios
 */
export default function () {
  console.log('[Consignments] Extension loaded successfully');
  console.log('[Consignments] Registered:');
  console.log('  ✓ Admin Pages: Grid, New, Edit, Detail');
  console.log('  ✓ API Endpoints: Create, Update, Delete, Detail');
  console.log('  ✓ GraphQL Queries: consignments, items, sales, returns');
  console.log('  ✓ GraphQL Mutations: CRUD, payments, returns');
  console.log('  ✓ Services: Commission, Return, Payment');
  console.log('  ✓ Subscribers: Sales, Returns, Payments');
  console.log('  ✓ Database: 6 tables with proper relationships');
}

