import React from "react";

interface ConsignmentMenuGroupProps {
  consignmentGrid: string;
}

export default function ConsignmentMenuGroup({ consignmentGrid }: ConsignmentMenuGroupProps) {
  return React.createElement(
    'div',
    {
      id: 'consignmentMenuGroup',
      style: {
        marginBottom: '15px',
        borderBottom: '1px solid #dee2e6',
        paddingBottom: '15px'
      }
    },
    React.createElement(
      'div',
      { style: { fontSize: '14px', fontWeight: 'bold', marginBottom: '10px', color: '#333' } },
      'Consignaciones'
    ),
    React.createElement(
      'a',
      {
        href: consignmentGrid,
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 12px',
          textDecoration: 'none',
          color: '#0066cc',
          borderRadius: '4px',
          transition: 'background-color 0.2s'
        },
        onMouseEnter: (e) => e.currentTarget.style.backgroundColor = '#f0f0f0',
        onMouseLeave: (e) => e.currentTarget.style.backgroundColor = 'transparent'
      },
      React.createElement(
        'svg',
        {
          xmlns: 'http://www.w3.org/2000/svg',
          viewBox: '0 0 24 24',
          fill: 'currentColor',
          style: { width: '18px', height: '18px' }
        },
        React.createElement('path', {
          d: 'M9 2C7.89543 2 7 2.89543 7 4V20C7 21.1046 7.89543 22 9 22H15C16.1046 22 17 21.1046 17 20V4C17 2.89543 16.1046 2 15 2H9ZM9 4H15V20H9V4Z'
        })
      ),
      'Consignaciones'
    )
  );
}

export const layout = {
  areaId: "adminMenu",
  sortOrder: 45,
};

export const query = `
  query Query {
    consignmentGrid: url(routeId:"consignmentGrid")
  }
`;
