import {
  useState,
  useEffect,
  useCallback,
} from "react";

import { driverService } from "../services/driverService";
import { useToast } from "../context/ToastContext";
import { useTableControls } from "../hooks/useTableControls";
import { getLicenseExpiryStatus } from "../utils/licenseUtils";

import PageHeader from "../components/common/PageHeader";
import LoadingState from "../components/common/LoadingState";
import EmptyState from "../components/common/EmptyState";
import ErrorState from "../components/common/ErrorState";
import Pagination from "../components/common/Pagination";
import ConfirmModal from "../components/common/ConfirmModal";

import DriverFilters from "../components/drivers/DriverFilters";
import DriverTable from "../components/drivers/DriverTable";
import DriverFormModal from "../components/drivers/DriverFormModal";
import DriverViewModal from "../components/drivers/DriverViewModal";

import "./DriversPage.css";

export default function DriversPage() {
  const { showToast } = useToast();

  const [drivers, setDrivers] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(null);

  const [formModalOpen, setFormModalOpen] =
    useState(false);

  const [editingDriver, setEditingDriver] =
    useState(null);

  const [viewModalOpen, setViewModalOpen] =
    useState(false);

  const [viewingDriver, setViewingDriver] =
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

  const loadDrivers = useCallback(
    async () => {
      setLoading(true);
      setError(null);

      try {
        const response =
          await driverService.getDrivers();

        const driverItems =
          Array.isArray(response)
            ? response
            : Array.isArray(response?.items)
              ? response.items
              : [];

        setDrivers(driverItems);
      } catch (loadError) {
        setError(
          loadError?.message ||
            "Something went wrong while loading drivers."
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    loadDrivers();
  }, [loadDrivers]);

  const driverCustomFilter = useCallback(
    (driver, activeFilters) => {
      if (
        activeFilters.licenseValidity
      ) {
        return (
          getLicenseExpiryStatus(
            driver.licenseExpiryDate
          ) ===
          activeFilters.licenseValidity
        );
      }

      return true;
    },
    []
  );

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
  } = useTableControls(drivers, {
    searchFields: [
      "name",
      "licenseNumber",
      "licenseCategory",
      "contactNumber",
    ],
    initialFilters: {
      status: "",
      licenseCategory: "",
      licenseValidity: "",
    },
    customFilter: driverCustomFilter,
  });

  const handleAddClick = () => {
    setServerError(null);
    setEditingDriver(null);
    setFormModalOpen(true);
  };

  const handleEditClick = (driver) => {
    setServerError(null);
    setEditingDriver(driver);
    setFormModalOpen(true);
  };

  const handleViewClick = (driver) => {
    setViewingDriver(driver);
    setViewModalOpen(true);
  };

  const handleDeleteClick = (driver) => {
    setDeleteTarget(driver);
    setDeleteModalOpen(true);
  };

  const closeFormModal = () => {
    if (submitting) return;

    setFormModalOpen(false);
    setEditingDriver(null);
    setServerError(null);
  };

  const closeViewModal = () => {
    setViewModalOpen(false);
    setViewingDriver(null);
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
      if (editingDriver) {
        await driverService.updateDriver(
          editingDriver.id,
          formData
        );

        showToast(
          "Driver updated successfully.",
          "success"
        );
      } else {
        await driverService.createDriver(
          formData
        );

        showToast(
          "Driver added successfully.",
          "success"
        );
      }

      setFormModalOpen(false);
      setEditingDriver(null);

      await loadDrivers();
    } catch (saveError) {
      const normalizedError =
        saveError?.normalized || {
          message:
            saveError?.message ||
            "Something went wrong while saving the driver.",
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
      await driverService.deleteDriver(
        deleteTarget.id
      );

      showToast(
        "Driver deleted successfully.",
        "success"
      );

      setDeleteModalOpen(false);
      setDeleteTarget(null);

      await loadDrivers();
    } catch (deleteError) {
      showToast(
        deleteError?.message ||
          "Something went wrong while deleting the driver.",
        "error"
      );
    } finally {
      setDeleting(false);
    }
  };

  const hasDrivers = drivers.length > 0;
  const hasVisibleResults =
    paginatedData.length > 0;

  return (
    <div className="drivers-page">
      <PageHeader
        title="Driver Management"
        subtitle="Manage drivers, licences and dispatch eligibility"
        actionLabel="Add Driver"
        onAction={handleAddClick}
      />

      {loading && (
        <LoadingState message="Loading drivers..." />
      )}

      {!loading && error && (
        <ErrorState
          message={error}
          onRetry={loadDrivers}
        />
      )}

      {!loading && !error && (
        <>
          <DriverFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filters={filters}
            onFilterChange={updateFilter}
            onClear={clearFilters}
          />

          {!hasDrivers && (
            <EmptyState
              title="No drivers yet"
              message="Add your first driver to start managing your team."
              actionLabel="Add Driver"
              onAction={handleAddClick}
            />
          )}

          {hasDrivers &&
            !hasVisibleResults && (
              <EmptyState
                title="No matching drivers"
                message="Try adjusting your search or filters."
                actionLabel="Clear Filters"
                onAction={clearFilters}
              />
            )}

          {hasDrivers &&
            hasVisibleResults && (
              <>
                <DriverTable
                  drivers={paginatedData}
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

      <DriverFormModal
        show={formModalOpen}
        driver={editingDriver}
        onClose={closeFormModal}
        onSubmit={handleFormSubmit}
        submitting={submitting}
        serverError={serverError}
      />

      <DriverViewModal
        show={viewModalOpen}
        driver={viewingDriver}
        onClose={closeViewModal}
      />

      {deleteModalOpen && (
        <ConfirmModal
          isOpen={deleteModalOpen}
          show={deleteModalOpen}
          title="Delete Driver"
          message={`Are you sure you want to delete ${
            deleteTarget?.name ||
            "this driver"
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