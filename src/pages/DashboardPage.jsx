// src/pages/DashboardPage.jsx

import {
  useState,
  useEffect,
  useCallback,
} from "react";

import {
  FiTruck,
  FiCheckCircle,
  FiTool,
  FiActivity,
  FiClock,
  FiUsers,
  FiPercent,
} from "react-icons/fi";

import { dashboardService } from "../services/dashboardService";

import PageHeader from "../components/common/PageHeader";
import KpiCard from "../components/common/KpiCard";
import LoadingState from "../components/common/LoadingState";
import ErrorState from "../components/common/ErrorState";

import DashboardFilters from "../components/dashboard/DashboardFilters";
import VehicleStatusChart from "../components/dashboard/VehicleStatusChart";
import FleetUtilizationChart from "../components/dashboard/FleetUtilizationChart";
import TripsByRegionChart from "../components/dashboard/TripsByRegionChart";
import AlertsPanel from "../components/dashboard/AlertsPanel";

import "./DashboardPage.css";

const DEFAULT_FILTERS = {
  vehicleType: "",
  status: "",
  region: "",
};

const DEFAULT_DASHBOARD = {
  activeVehicles: 0,
  availableVehicles: 0,
  vehiclesInMaintenance: 0,
  activeTrips: 0,
  pendingTrips: 0,
  driversOnDuty: 0,
  fleetUtilization: 0,
  vehicleStatusData: [],
  fleetUtilizationData: [],
  tripsByRegion: [],
  alerts: [],
  kpiDetails: {},
};

export default function DashboardPage() {
  const [filters, setFilters] =
    useState(DEFAULT_FILTERS);

  const [dashboardData, setDashboardData] =
    useState(DEFAULT_DASHBOARD);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(null);

  const loadDashboard = useCallback(
    async (activeFilters = DEFAULT_FILTERS) => {
      setLoading(true);
      setError(null);

      try {
        const data =
          await dashboardService.getDashboardData(
            activeFilters
          );

        setDashboardData({
          ...DEFAULT_DASHBOARD,
          ...(data || {}),
          kpiDetails: {
            ...DEFAULT_DASHBOARD.kpiDetails,
            ...(data?.kpiDetails || {}),
          },
        });
      } catch (loadError) {
        setError(
          loadError?.message ||
            "Something went wrong while loading the dashboard."
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    loadDashboard(filters);
  }, [loadDashboard]);

  const handleFilterChange = (
    filterName,
    value
  ) => {
    const nextFilters = {
      ...filters,
      [filterName]: value,
    };

    setFilters(nextFilters);
    loadDashboard(nextFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      ...DEFAULT_FILTERS,
    };

    setFilters(clearedFilters);
    loadDashboard(clearedFilters);
  };

  const safeVehicleStatusData =
    Array.isArray(
      dashboardData.vehicleStatusData
    )
      ? dashboardData.vehicleStatusData
      : [];

  const safeFleetUtilizationData =
    Array.isArray(
      dashboardData.fleetUtilizationData
    )
      ? dashboardData.fleetUtilizationData
      : [];

  const safeTripsByRegion = Array.isArray(
    dashboardData.tripsByRegion
  )
    ? dashboardData.tripsByRegion
    : [];

  const safeAlerts = Array.isArray(
    dashboardData.alerts
  )
    ? dashboardData.alerts
    : [];

  const details =
    dashboardData.kpiDetails || {};

  return (
    <div className="dashboard-page">
      <PageHeader
        title="Dashboard"
        subtitle="Live overview of fleet, trips and drivers"
      />

      <DashboardFilters
        filters={filters}
        onChange={handleFilterChange}
        onClear={handleClearFilters}
      />

      {loading && (
        <LoadingState message="Loading dashboard..." />
      )}

      {!loading && error && (
        <ErrorState
          message={error}
          onRetry={() =>
            loadDashboard(filters)
          }
        />
      )}

      {!loading && !error && (
        <>
          <div className="dashboard-kpi-grid">
            <KpiCard
              label="Active Vehicles"
              value={
                dashboardData.activeVehicles
              }
              icon={<FiTruck />}
              description="Vehicles currently available or operating on an active trip."
              details={
                details.activeVehicles
              }
            />

            <KpiCard
              label="Available Vehicles"
              value={
                dashboardData.availableVehicles
              }
              icon={<FiCheckCircle />}
              variant="success"
              description="Vehicles currently eligible for trip assignment."
              details={
                details.availableVehicles
              }
            />

            <KpiCard
              label="Vehicles in Maintenance"
              value={
                dashboardData.vehiclesInMaintenance
              }
              icon={<FiTool />}
              variant="warning"
              description="Vehicles marked In Shop and excluded from dispatch selection."
              details={
                details.vehiclesInMaintenance
              }
            />

            <KpiCard
              label="Active Trips"
              value={dashboardData.activeTrips}
              icon={<FiActivity />}
              variant="info"
              description="Vehicles currently marked On Trip."
              details={details.activeTrips}
            />

            <KpiCard
              label="Pending Trips"
              value={dashboardData.pendingTrips}
              icon={<FiClock />}
              variant="warning"
              description="Trips awaiting dispatch or operational confirmation."
              details={details.pendingTrips}
            />

            <KpiCard
              label="Drivers On Duty"
              value={
                dashboardData.driversOnDuty
              }
              icon={<FiUsers />}
              description="Drivers currently Available or On Trip."
              details={
                details.driversOnDuty
              }
            />

            <KpiCard
              label="Fleet Utilization"
              value={`${
                dashboardData.fleetUtilization ??
                0
              }%`}
              icon={<FiPercent />}
              variant="info"
              description="Share of operational vehicles currently assigned to active trips."
              details={
                details.fleetUtilization
              }
            />
          </div>

          <div className="dashboard-charts-grid">
            <div className="dashboard-chart-card">
              <h3 className="dashboard-chart-title">
                Vehicle Status
              </h3>

              <VehicleStatusChart
                data={
                  safeVehicleStatusData
                }
              />
            </div>

            <div className="dashboard-chart-card">
              <h3 className="dashboard-chart-title">
                Fleet Utilization
              </h3>

              <FleetUtilizationChart
                data={
                  safeFleetUtilizationData
                }
              />
            </div>

            <div className="dashboard-chart-card dashboard-chart-card-wide">
              <h3 className="dashboard-chart-title">
                Active Trips by Region
              </h3>

              <TripsByRegionChart
                data={safeTripsByRegion}
              />
            </div>
          </div>

          <AlertsPanel alerts={safeAlerts} />
        </>
      )}
    </div>
  );
}