import {
  useState,
  useEffect,
  useCallback,
} from "react";

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

export default function VehiclesPage() {
  const { showToast } = useToast();

  const [vehicles, setVehicles] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(null);

  const [formModalOpen, setFormModalOpen] =
    useState(false);

  const [editingVehicle, setEditingVehicle] =
    useState(null);

  const [viewModalOpen, setViewModalOpen] =
    useState(false);

  const [viewingVehicle, setViewingVehicle] =
    useState(null);

  const [deleteTarget, setDeleteTarget] =
    useState(null);

  const [deleteModalOpen, setDeleteModalOpen] =
    useState(false);

  const [submitting, setSubmitting] =
    useState(false);

  const [deleting, setDeleting] =
    useState(false);

  const [serverError, setServerError] =
    useState(null);

  const loadVehicles = useCallback(
    async () => {
      setLoading(true);
      setError(null);

      try {
        const response =
          await vehicleService.getVehicles();

        const vehicleItems =
          Array.isArray(response)
            ? response
            : Array.isArray(response?.items)
              ? response.items
              : [];

        setVehicles(vehicleItems);
      } catch (loadError) {
        setError(
          loadError?.message ||
            "Something went wrong while loading vehicles."
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    loadVehicles();
  }, [loadVehicles]);

  const {
    paginatedData,
    currentPage,
    setCurrentPage,
    totalPages,
    totalItems,
    pageSize,
    searchTerm,
    setSearchTerm,
    filters,
    updateFilter,
    clearFilters,
    sortField,
    sortDirection,
    handleSort,
  } = useTableControls(vehicles, {
    searchFields: [
      "registrationNumber",
      "vehicleModel",
      "type",
      "region",
    ],
    initialFilters: {
      type: "",
      status: "",
      region: "",
    },
  });

  const handleAddClick = () => {
    setServerError(null);
    setEditingVehicle(null);
    setFormModalOpen(true);
  };

  const handleEditClick = (vehicle) => {
    setServerError(null);
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
    if (submitting) return;

    setFormModalOpen(false);
    setEditingVehicle(null);
    setServerError(null);
  };

  const closeViewModal = () => {
    setViewModalOpen(false);
    setViewingVehicle(null);
  };

  const closeDeleteModal = () => {
    if (deleting) return;

    setDeleteModalOpen(false);
    setDeleteTarget(null);
  };

  const handleFormSubmit = async (
    formData
  ) => {
    setSubmitting(true);
    setServerError(null);

    try {
      if (editingVehicle) {
        await vehicleService.updateVehicle(
          editingVehicle.id,
          formData
        );

        showToast(
          "Vehicle updated successfully.",
          "success"
        );
      } else {
        await vehicleService.createVehicle(
          formData
        );

        showToast(
          "Vehicle added successfully.",
          "success"
        );
      }

      setFormModalOpen(false);
      setEditingVehicle(null);

      await loadVehicles();
    } catch (saveError) {
      const normalizedError =
        saveError?.normalized || {
          message:
            saveError?.message ||
            "Something went wrong while saving the vehicle.",
        };

      setServerError(normalizedError);

      if (!normalizedError.field) {
        showToast(
          normalizedError.message,
          "error"
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    setDeleting(true);

    try {
      await vehicleService.deleteVehicle(
        deleteTarget.id
      );

      showToast(
        "Vehicle deleted successfully.",
        "success"
      );

      setDeleteModalOpen(false);
      setDeleteTarget(null);

      await loadVehicles();
    } catch (deleteError) {
      showToast(
        deleteError?.message ||
          "Something went wrong while deleting the vehicle.",
        "error"
      );
    } finally {
      setDeleting(false);
    }
  };

  const hasVehicles = vehicles.length > 0;
  const hasVisibleResults =
    paginatedData.length > 0;

  return (
    <div className="vehicles-page">
      <PageHeader
        title="Vehicle Registry"
        subtitle="Manage fleet vehicles and operational status"
        actionLabel="Add Vehicle"
        onAction={handleAddClick}
      />

      {loading && (
        <LoadingState message="Loading vehicles..." />
      )}

      {!loading && error && (
        <ErrorState
          message={error}
          onRetry={loadVehicles}
        />
      )}

      {!loading && !error && (
        <>
          <VehicleFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filters={filters}
            onFilterChange={updateFilter}
            onClear={clearFilters}
          />

          {!hasVehicles && (
            <EmptyState
              title="No vehicles yet"
              message="Add your first vehicle to start building your fleet registry."
              actionLabel="Add Vehicle"
              onAction={handleAddClick}
            />
          )}

          {hasVehicles &&
            !hasVisibleResults && (
              <EmptyState
                title="No matching vehicles"
                message="Try adjusting your search or filters."
                actionLabel="Clear Filters"
                onAction={clearFilters}
              />
            )}

          {hasVehicles &&
            hasVisibleResults && (
              <>
                <VehicleTable
                  vehicles={paginatedData}
                  sortField={sortField}
                  sortDirection={
                    sortDirection
                  }
                  onSort={handleSort}
                  onView={handleViewClick}
                  onEdit={handleEditClick}
                  onDelete={
                    handleDeleteClick
                  }
                />

                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={totalItems}
                  pageSize={pageSize}
                  onPageChange={
                    setCurrentPage
                  }
                />
              </>
            )}
        </>
      )}

      <VehicleFormModal
        show={formModalOpen}
        vehicle={editingVehicle}
        existingVehicles={vehicles}
        onClose={closeFormModal}
        onSubmit={handleFormSubmit}
        submitting={submitting}
        serverError={serverError}
      />

      <VehicleViewModal
        show={viewModalOpen}
        vehicle={viewingVehicle}
        onClose={closeViewModal}
      />

      {deleteModalOpen && (
        <ConfirmModal
          isOpen={deleteModalOpen}
          show={deleteModalOpen}
          title="Delete Vehicle"
          message={`Are you sure you want to delete ${
            deleteTarget?.registrationNumber ||
            "this vehicle"
          }? This action cannot be undone.`}
          confirmLabel="Delete"
          confirmVariant="danger"
          loading={deleting}
          onConfirm={handleConfirmDelete}
          onCancel={closeDeleteModal}
          onClose={closeDeleteModal}
        />
      )}
    </div>
  );
}