// src/components/vehicles/VehicleTable.jsx

import {
  FiEye,
  FiEdit2,
  FiTrash2,
  FiChevronUp,
  FiChevronDown,
} from "react-icons/fi";

import StatusBadge from "../common/StatusBadge";
import { useAuth } from "../../context/AuthContext";
import {
  hasPermission,
  PERMISSIONS,
} from "../../utils/roleUtils";

import {
  formatINR,
  formatOdometer,
  formatLoadCapacity,
} from "../../utils/formatUtils";

import "./VehicleTable.css";

const COLUMNS = [
  {
    field: "registrationNumber",
    label: "Registration Number",
  },
  {
    field: "vehicleModel",
    label: "Vehicle Model",
  },
  {
    field: "type",
    label: "Vehicle Type",
  },
  {
    field: "maxLoadCapacity",
    label: "Maximum Load",
  },
  {
    field: "odometer",
    label: "Odometer",
  },
  {
    field: "acquisitionCost",
    label: "Acquisition Cost",
  },
  {
    field: "status",
    label: "Status",
  },
  {
    field: "region",
    label: "Region",
  },
];

export default function VehicleTable({
  vehicles = [],
  sortField,
  sortDirection,
  onSort,
  onView,
  onEdit,
  onDelete,
}) {
  const { user } = useAuth();

  const canEdit = hasPermission(
    user?.role,
    PERMISSIONS.EDIT_VEHICLE
  );

  const canDelete = hasPermission(
    user?.role,
    PERMISSIONS.DELETE_VEHICLE
  );

  return (
    <div className="table-responsive-wrapper">
      <table className="data-table table">
        <thead>
          <tr>
            {COLUMNS.map((column) => (
              <th
                key={column.field}
                className="sortable-th"
                onClick={() =>
                  onSort?.(column.field)
                }
              >
                <span className="d-inline-flex align-items-center gap-xs">
                  {column.label}

                  {sortField ===
                    column.field &&
                    (sortDirection === "asc" ? (
                      <FiChevronUp size={12} />
                    ) : (
                      <FiChevronDown
                        size={12}
                      />
                    ))}
                </span>
              </th>
            ))}

            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {vehicles.map((vehicle) => (
            <tr key={vehicle.id}>
              <td className="fw-medium">
                {vehicle.registrationNumber}
              </td>

              <td>{vehicle.vehicleModel}</td>
              <td>{vehicle.type}</td>

              <td>
                {formatLoadCapacity(
                  vehicle.maxLoadCapacity
                )}
              </td>

              <td>
                {formatOdometer(
                  vehicle.odometer
                )}
              </td>

              <td>
                {formatINR(
                  vehicle.acquisitionCost
                )}
              </td>

              <td>
                <StatusBadge
                  status={vehicle.status}
                />
              </td>

              <td>{vehicle.region}</td>

              <td>
                <div className="d-flex gap-xs">
                  <button
                    type="button"
                    className="btn-icon"
                    aria-label={`View ${vehicle.registrationNumber}`}
                    onClick={() =>
                      onView?.(vehicle)
                    }
                  >
                    <FiEye size={15} />
                  </button>

                  {canEdit && (
                    <button
                      type="button"
                      className="btn-icon"
                      aria-label={`Edit ${vehicle.registrationNumber}`}
                      onClick={() =>
                        onEdit?.(vehicle)
                      }
                    >
                      <FiEdit2 size={15} />
                    </button>
                  )}

                  {canDelete && (
                    <button
                      type="button"
                      className="btn-icon danger"
                      aria-label={`Delete ${vehicle.registrationNumber}`}
                      onClick={() =>
                        onDelete?.(vehicle)
                      }
                    >
                      <FiTrash2 size={15} />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}