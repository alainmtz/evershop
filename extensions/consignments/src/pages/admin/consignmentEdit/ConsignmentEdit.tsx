import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const ConsignmentEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    description: '',
    commissionRate: 0,
    commissionType: 'percentage',
    returnWindowDays: 30,
    status: 'ACTIVE'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'commissionRate' || name === 'returnWindowDays' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/v1/consignments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Error actualizando consignment');
      }

      navigate(`/admin/consignments/${id}`);
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
        React.createElement('h1', { className: 'card-title' }, `Editar Consignment #${id}`)
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
            React.createElement('label', null, 'Descripción'),
            React.createElement('input', {
              type: 'text',
              name: 'description',
              value: formData.description,
              onChange: handleChange,
              required: true,
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
            { className: 'form-group' },
            React.createElement('label', null, 'Estado'),
            React.createElement(
              'select',
              {
                name: 'status',
                value: formData.status,
                onChange: handleChange,
                style: { width: '100%', padding: '8px' }
              },
              React.createElement('option', { value: 'ACTIVE' }, 'Activo'),
              React.createElement('option', { value: 'PAUSED' }, 'Pausado'),
              React.createElement('option', { value: 'CLOSED' }, 'Cerrado')
            )
          ),
          React.createElement(
            'div',
            { style: { display: 'flex', gap: '10px', marginTop: '20px' } },
            React.createElement(
              'button',
              { type: 'submit', disabled: loading, className: 'btn btn-primary' },
              loading ? 'Guardando...' : 'Guardar Cambios'
            ),
            React.createElement(
              'button',
              {
                type: 'button',
                onClick: () => navigate(`/admin/consignments/${id}`),
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

export default ConsignmentEditPage;
