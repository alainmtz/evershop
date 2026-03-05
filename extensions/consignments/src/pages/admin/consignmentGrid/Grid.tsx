import React from "react";

interface Consignment {
  id: number;
  vendor_id: number;
  description: string;
  commission_rate: number;
  commission_type: string;
  status: string;
  created_at: string;
  vendor_name?: string;
}

interface ConsignmentsData {
  items: Consignment[];
  total: number;
}

interface GridProps {
  consignments: ConsignmentsData;
}

export default function ConsignmentGrid({ consignments }: GridProps) {
  const { items = [], total = 0 } = consignments || {};

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Consignaciones</h2>
      </div>
      <div className="card-body">
        <table className="listing sticky">
          <thead>
            <tr>
              <th>ID</th>
              <th>Vendedor</th>
              <th>Descripción</th>
              <th>Estado</th>
              <th>Comisión</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: "20px" }}>
                  No hay consignaciones registradas
                </td>
              </tr>
            ) : (
              items.map((consignment) => (
                <tr key={consignment.id}>
                  <td>#{consignment.id}</td>
                  <td>{consignment.vendor_name || "Vendedor"}</td>
                  <td>{consignment.description}</td>
                  <td>
                    <span
                      className={`badge badge-${
                        consignment.status === "ACTIVE"
                          ? "success"
                          : consignment.status === "PAUSED"
                          ? "warning"
                          : "danger"
                      }`}
                    >
                      {consignment.status}
                    </span>
                  </td>
                  <td>
                    {consignment.commission_rate}
                    {consignment.commission_type === "percentage" ? "%" : "$"}
                  </td>
                  <td>
                    {new Date(consignment.created_at).toLocaleDateString("es-ES")}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {total > 0 && (
          <div
            style={{
              padding: "16px 24px",
              borderTop: "1px solid #eee",
              fontSize: "14px",
              color: "#666"
            }}
          >
            Total: {total} consignaciones
          </div>
        )}
      </div>
    </div>
  );
}

export const layout = {
  areaId: "content",
  sortOrder: 20,
};

export const query = `
  query Query {
    consignments {
      items {
        id
        vendor_id
        description
        commission_rate
        commission_type
        status
        created_at
        vendor_name
      }
      total
    }
  }
`;
