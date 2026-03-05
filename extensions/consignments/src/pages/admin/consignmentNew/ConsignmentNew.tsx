import React from 'react';
import { useNavigate } from 'react-router-dom';

const ConsignmentNewPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    vendorId: '',
    description: '',
    commissionRate: 0,
    commissionType: 'percentage',
    returnWindowDays: 30
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'returnWindowDays' || name === 'commissionRate' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/v1/consignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Error creando consignment');
      }

      const data = await response.json();
      navigate(`/admin/consignments/${data.consignmentId}`);
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return React.createElement(
    'div',
    { style: { padding: '20px' } },
    React.createElement(
      'div',
      { className: 'card' },
      React.createElement(
        'div',
        { className: 'card-header' },
        React.createElement('h1', { className: 'card-title' }, 'Crear Nuevo Consignment')
      ),
      React.createElement(
        'div',
        { className: 'card-body' },
        React.createElement(
          'form',
          { onSubmit: handleSubmit },
          React.createElement(
            'div',
            { className: 'form-group' },
            React.createElement('label', null, 'Vendedor'),
            React.createElement(
              'select',
              {
                name: 'vendorId',
                value: formData.vendorId,
                onChange: handleChange,
                required: true,
                style: { width: '100%', padding: '8px' }
              },
              React.createElement('option', { value: '' }, 'Selecciona un vendedor'),
              React.createElement('option', { value: '1' }, 'Vendedor 1'),
              React.createElement('option', { value: '2' }, 'Vendedor 2')
            )
          ),
          React.createElement(
            'div',
            { className: 'form-group' },
            React.createElement('label', null, 'Descripción'),
            React.createElement('input', {
              type: 'text',
              name: 'description',
              value: formData.description,
              onChange: handleChange,
              required: true,
              placeholder: 'Ej: Colección de Verano 2026',
              style: { width: '100%', padding: '8px' }
            })
          ),
          React.createElement(
            'div',
            { className: 'form-group' },
            React.createElement('label', null, 'Tipo de Comisión'),
            React.createElement(
              'select',
              {
                name: 'commissionType',
                value: formData.commissionType,
                onChange: handleChange,
                style: { width: '100%', padding: '8px' }
              },
              React.createElement('option', { value: 'percentage' }, 'Porcentaje (%)'),
              React.createElement('option', { value: 'fixed' }, 'Cantidad Fija ($)')
            )
          ),
          React.createElement(
            'div',
            { className: 'form-group' },
            React.createElement(
              'label',
              null,
              `Tasa de Comisión (${formData.commissionType === 'percentage' ? '%' : '$'})`
            ),
            React.createElement('input', {
              type: 'number',
              name: 'commissionRate',
              value: formData.commissionRate,
              onChange: handleChange,
              min: 0,
              step: formData.commissionType === 'percentage' ? 0.1 : 0.01,
              required: true,
              style: { width: '100%', padding: '8px' }
            })
          ),
          React.createElement(
            'div',
            { className: 'form-group' },
            React.createElement('label', null, 'Ventana de Devolución (días)'),
            React.createElement('input', {
              type: 'number',
              name: 'returnWindowDays',
              value: formData.returnWindowDays,
              onChange: handleChange,
              min: 1,
              max: 365,
              required: true,
              style: { width: '100%', padding: '8px' }
            })
          ),
          React.createElement(
            'div',
            { style: { display: 'flex', gap: '10px', marginTop: '20px' } },
            React.createElement(
              'button',
              { type: 'submit', disabled: loading, className: 'btn btn-primary' },
              loading ? 'Creando...' : 'Crear Consignment'
            ),
            React.createElement(
              'button',
              {
                type: 'button',
                onClick: () => navigate('/admin/consignments'),
                className: 'btn btn-secondary'
              },
              'Cancelar'
            )
          )
        )
      )
    )
  );
};

export default ConsignmentNewPage;
