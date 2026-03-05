import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const ConsignmentDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState(null);
  const [deleting, setDeleting] = React.useState(false);

  React.useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await fetch(`/api/v1/consignments/${id}`);
        if (!response.ok) throw new Error('No encontrado');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error:', error);
        alert('Error cargando detalles del consignment');
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('¿Realmente quieres eliminar este consignment?')) return;

    setDeleting(true);
    try {
      const response = await fetch(`/api/v1/consignments/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Error eliminando');
      navigate('/admin/consignments');
    } catch (error) {
      console.error('Error:', error);
      alert('Error eliminando consignment: ' + error.message);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return React.createElement(
      'div',
      { style: { padding: '20px', textAlign: 'center' } },
      'Cargando...'
    );
  }

  if (!data) {
    return React.createElement(
      'div',
      { style: { padding: '20px' } },
      'Consignment no encontrado'
    );
  }

  const c = data.consignment;
  const totalItems = data.items.reduce((sum, item) => sum + item.quantity, 0);
  const totalSales = data.sales.reduce((sum, sale) => sum + sale.sale_price * sale.quantity, 0);
  const totalCommission = data.sales.reduce((sum, sale) => {
    const commission = (sale.sale_price * c.commission_rate) / 100;
    return sum + (commission * sale.quantity);
  }, 0);

  const getStatusBadge = (status) => {
    const colors = {
      ACTIVE: '#28a745',
      PAUSED: '#ffc107',
      CLOSED: '#6c757d'
    };
    return React.createElement(
      'span',
      {
        style: {
          backgroundColor: colors[status] || '#6c757d',
          color: 'white',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px'
        }
      },
      status
    );
  };

  return React.createElement(
    'div',
    { style: { padding: '20px' } },
    // Card principal con información
    React.createElement(
      'div',
      { className: 'card', style: { marginBottom: '20px' } },
      React.createElement(
        'div',
        { className: 'card-header' },
        React.createElement(
          'div',
          { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
          React.createElement('h1', { className: 'card-title' }, `Consignment #${c.id}`),
          getStatusBadge(c.status)
        )
      ),
      React.createElement(
        'div',
        { className: 'card-body' },
        React.createElement(
          'div',
          {
            style: {
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '20px'
            }
          },
          React.createElement(
            React.Fragment,
            null,
            React.createElement(
              'div',
              { style: { display: 'flex', flexDirection: 'column', gap: '10px' } },
              React.createElement(
                'div',
                null,
                React.createElement('strong', null, 'Vendedor:'),
                React.createElement('p', { style: { margin: '0' } }, c.vendor_name)
              ),
              React.createElement(
                'div',
                null,
                React.createElement('strong', null, 'Descripción:'),
                React.createElement('p', { style: { margin: '0' } }, c.description)
              ),
              React.createElement(
                'div',
                null,
                React.createElement('strong', null, 'Comisión:'),
                React.createElement(
                  'p',
                  { style: { margin: '0' } },
                  `${c.commission_rate}${c.commission_type === 'percentage' ? '%' : '$'}`
                )
              )
            ),
            React.createElement(
              'div',
              { style: { display: 'flex', flexDirection: 'column', gap: '10px' } },
              React.createElement(
                'div',
                null,
                React.createElement('strong', null, 'Ventana Devolución:'),
                React.createElement('p', { style: { margin: '0' } }, `${c.return_window_days} días`)
              ),
              React.createElement(
                'div',
                null,
                React.createElement('strong', null, 'Creado:'),
                React.createElement('p', { style: { margin: '0' } }, new Date(c.created_at).toLocaleDateString('es-ES'))
              )
            )
          )
        )
      )
    ),

    // Estadísticas
    React.createElement(
      'div',
      {
        style: {
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '15px',
          marginBottom: '20px'
        }
      },
      React.createElement(
        'div',
        { className: 'card' },
        React.createElement(
          'div',
          { className: 'card-body', style: { textAlign: 'center', padding: '15px' } },
          React.createElement('div', { style: { fontSize: '14px', fontWeight: '500' } }, 'Items Enviados'),
          React.createElement('div', { style: { fontSize: '28px', fontWeight: 'bold', marginTop: '10px' } }, totalItems)
        )
      ),
      React.createElement(
        'div',
        { className: 'card' },
        React.createElement(
          'div',
          { className: 'card-body', style: { textAlign: 'center', padding: '15px' } },
          React.createElement('div', { style: { fontSize: '14px', fontWeight: '500' } }, 'Ventas Totales'),
          React.createElement('div', { style: { fontSize: '28px', fontWeight: 'bold', marginTop: '10px' } }, `$${totalSales.toFixed(2)}`)
        )
      ),
      React.createElement(
        'div',
        { className: 'card' },
        React.createElement(
          'div',
          { className: 'card-body', style: { textAlign: 'center', padding: '15px' } },
          React.createElement('div', { style: { fontSize: '14px', fontWeight: '500' } }, 'Comisión Total'),
          React.createElement('div', { style: { fontSize: '28px', fontWeight: 'bold', marginTop: '10px' } }, `$${totalCommission.toFixed(2)}`)
        )
      ),
      React.createElement(
        'div',
        { className: 'card' },
        React.createElement(
          'div',
          { className: 'card-body', style: { textAlign: 'center', padding: '15px' } },
          React.createElement('div', { style: { fontSize: '14px', fontWeight: '500' } }, 'Pago Pendiente'),
          React.createElement('div', { style: { fontSize: '28px', fontWeight: 'bold', marginTop: '10px' } }, `$${(totalSales - totalCommission).toFixed(2)}`)
        )
      )
    ),

    // Items
    React.createElement(
      'div',
      { className: 'card', style: { marginBottom: '20px' } },
      React.createElement(
        'div',
        { className: 'card-header' },
        React.createElement('h2', { className: 'card-title' }, 'Items Enviados')
      ),
      React.createElement(
        'div',
        { className: 'card-body' },
        data.items.length === 0 ?
          React.createElement('p', null, 'No hay items en este consignment') :
          React.createElement(
            'table',
            { style: { width: '100%', borderCollapse: 'collapse' } },
            React.createElement(
              'thead',
              null,
              React.createElement(
                'tr',
                { style: { borderBottom: '2px solid #dee2e6' } },
                React.createElement('th', { style: { textAlign: 'left', padding: '10px' } }, 'SKU'),
                React.createElement('th', { style: { textAlign: 'left', padding: '10px' } }, 'Producto'),
                React.createElement('th', { style: { textAlign: 'center', padding: '10px' } }, 'Cantidad'),
                React.createElement('th', { style: { textAlign: 'right', padding: '10px' } }, 'Precio Unit.')
              )
            ),
            React.createElement(
              'tbody',
              null,
              data.items.map(item =>
                React.createElement(
                  'tr',
                  { key: item.id, style: { borderBottom: '1px solid #dee2e6' } },
                  React.createElement('td', { style: { padding: '10px' } }, item.sku),
                  React.createElement('td', { style: { padding: '10px' } }, item.name),
                  React.createElement('td', { style: { textAlign: 'center', padding: '10px' } }, item.quantity),
                  React.createElement('td', { style: { textAlign: 'right', padding: '10px' } }, `$${item.unit_price}`)
                )
              )
            )
          )
      )
    ),

    // Botones de Acción
    React.createElement(
      'div',
      { style: { display: 'flex', gap: '10px' } },
      React.createElement(
        'button',
        {
          type: 'button',
          onClick: () => navigate(`/admin/consignments/${id}/edit`),
          className: 'btn btn-primary'
        },
        'Editar'
      ),
      React.createElement(
        'button',
        {
          type: 'button',
          onClick: () => navigate('/admin/consignments'),
          className: 'btn btn-secondary'
        },
        'Volver'
      ),
      React.createElement(
        'button',
        {
          type: 'button',
          onClick: handleDelete,
          disabled: deleting,
          className: 'btn',
          style: { backgroundColor: '#dc3545', color: 'white' }
        },
        deleting ? 'Eliminando...' : 'Eliminar'
      )
    )
  );
};

export default ConsignmentDetailPage;
