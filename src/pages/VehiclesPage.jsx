import React, { useState, useEffect, useCallback } from "react";

import { vehicleService } from "../services/vehicleService";
import { useToast } from "../context/ToastContext";
import { useTableControls } from "../hooks/useTableControls";

import PageHeader from "../components/common/PageHeader";
import LoadingState from "../components/common/LoadingState";
import EmptyState from "../components/common/EmptyState";
import ErrorState from "../components/common/ErrorState";
import Pagination from "../components/common/Pagination";
import ConfirmModal from "../components/common/ConfirmModal";

import VehicleFilters from "../components/vehicles/VehicleFilters";
import VehicleTable from "../components/vehicles/VehicleTable";
import VehicleFormModal from "../components/vehicles/VehicleFormModal";
import VehicleViewModal from "../components/vehicles/VehicleViewModal";

import "./VehiclesPage.css";

const VehiclesPage = () => {
  const { showToast } = useToast();

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewingVehicle, setViewingVehicle] = useState(null);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const loadVehicles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await vehicleService.getVehicles();
      setVehicles(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err?.message || "Something went wrong while loading vehicles."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadVehicles();
  }, [loadVehicles]);

  const {
    paginatedData,
    currentPage,
    setCurrentPage,
    totalPages,
    totalItems,
    searchTerm,
    setSearchTerm,
    filters,
    updateFilter,
    clearFilters,
    sortField,
    sortDirection,
    handleSort,
  } = useTableControls(vehicles, {
    searchFields: ["registrationNumber", "vehicleModel", "type", "region"],
    initialFilters: { type: "", status: "", region: "" },
  });

  const handleRetry = () => {
    loadVehicles();
  };

  const handleAddClick = () => {
    setEditingVehicle(null);
    setFormModalOpen(true);
  };

  const handleEditClick = (vehicle) => {
    setEditingVehicle(vehicle);
    setFormModalOpen(true);
  };

  const handleViewClick = (vehicle) => {
    setViewingVehicle(vehicle);
    setViewModalOpen(true);
  };

  const handleDeleteClick = (vehicle) => {
    setDeleteTarget(vehicle);
    setDeleteModalOpen(true);
  };

  const closeFormModal = () => {
    setFormModalOpen(false);
    setEditingVehicle(null);
  };

  const closeViewModal = () => {
    setViewModalOpen(false);
    setViewingVehicle(null);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setDeleteTarget(null);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingVehicle) {
        await vehicleService.updateVehicle(editingVehicle.id, formData);
        showToast("Vehicle updated successfully.", "success");
      } else {
        await vehicleService.createVehicle(formData);
        showToast("Vehicle added successfully.", "success");
      }
      closeFormModal();
      await loadVehicles();
    } catch (err) {
      showToast(
        err?.message || "Something went wrong while saving the vehicle.",
        "error"
      );
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await vehicleService.deleteVehicle(deleteTarget.id);
      showToast("Vehicle deleted successfully.", "success");
      closeDeleteModal();
      await loadVehicles();
    } catch (err) {
      showToast(
        err?.message || "Something went wrong while deleting the vehicle.",
        "error"
      );
    } finally {
      setDeleting(false);
    }
  };

  const hasVehicles = vehicles.length > 0;
  const hasVisibleResults = (paginatedData || []).length > 0;

  return (
    <div className="vehicles-page">
      <PageHeader
        title="Vehicle Registry"
        subtitle="Manage fleet vehicles and their status"
        actionLabel="Add Vehicle"
        onAction={handleAddClick}
      />

      {loading && <LoadingState message="Loading vehicles..." />}

      {!loading && error && (
        <ErrorState message={error} onRetry={handleRetry} />
      )}

      {!loading && !error && (
        <>
          <VehicleFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filters={filters}
            onFilterChange={updateFilter}
            onClearFilters={clearFilters}
          />

          {!hasVehicles && (
            <EmptyState
              title="No vehicles yet"
              message="Add your first vehicle to start building your fleet registry."
              actionLabel="Add Vehicle"
              onAction={handleAddClick}
            />
          )}

          {hasVehicles && !hasVisibleResults && (
            <EmptyState
              title="No matching vehicles"
              message="Try adjusting your search or filters."
              actionLabel="Clear Filters"
              onAction={clearFilters}
            />
          )}

          {hasVehicles && hasVisibleResults && (
            <>
              <VehicleTable
                vehicles={paginatedData}
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
                onView={handleViewClick}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
              />

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </>
      )}

      {formModalOpen && (
        <VehicleFormModal
          isOpen={formModalOpen}
          vehicle={editingVehicle}
          onClose={closeFormModal}
          onSubmit={handleFormSubmit}
        />
      )}

      {viewModalOpen && (
        <VehicleViewModal
          isOpen={viewModalOpen}
          vehicle={viewingVehicle}
          onClose={closeViewModal}
        />
      )}

      {deleteModalOpen && (
        <ConfirmModal
          isOpen={deleteModalOpen}
          title="Delete Vehicle"
          message={`Are you sure you want to delete ${
            deleteTarget?.registrationNumber || "this vehicle"
          }? This action cannot be undone.`}
          confirmLabel="Delete"
          confirmVariant="danger"
          loading={deleting}
          onConfirm={handleConfirmDelete}
          onCancel={closeDeleteModal}
        />
      )}
    </div>
  );
};

export default VehiclesPage;
