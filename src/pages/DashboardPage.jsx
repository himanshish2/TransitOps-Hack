import React, { useState, useEffect, useCallback } from "react";
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
};

const DashboardPage = () => {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [dashboardData, setDashboardData] = useState(DEFAULT_DASHBOARD);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDashboard = useCallback(async (activeFilters) => {
    setLoading(true);
    setError(null);
    try {
      const data = await dashboardService.getDashboardData(activeFilters);
      setDashboardData({ ...DEFAULT_DASHBOARD, ...(data || {}) });
    } catch (err) {
      setError(
        err?.message || "Something went wrong while loading the dashboard."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterChange = (nextFilters) => {
    setFilters(nextFilters);
    loadDashboard(nextFilters);
  };

  const handleClearFilters = () => {
    setFilters(DEFAULT_FILTERS);
    loadDashboard(DEFAULT_FILTERS);
  };

  const handleRetry = () => {
    loadDashboard(filters);
  };

  const safeVehicleStatusData = Array.isArray(dashboardData.vehicleStatusData)
    ? dashboardData.vehicleStatusData
    : [];
  const safeFleetUtilizationData = Array.isArray(
    dashboardData.fleetUtilizationData
  )
    ? dashboardData.fleetUtilizationData
    : [];
  const safeTripsByRegion = Array.isArray(dashboardData.tripsByRegion)
    ? dashboardData.tripsByRegion
    : [];
  const safeAlerts = Array.isArray(dashboardData.alerts)
    ? dashboardData.alerts
    : [];

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

      {loading && <LoadingState message="Loading dashboard..." />}

      {!loading && error && (
        <ErrorState message={error} onRetry={handleRetry} />
      )}

      {!loading && !error && (
        <>
          <div className="dashboard-kpi-grid">
            <KpiCard
              label="Active Vehicles"
              value={dashboardData.activeVehicles}
              icon={<FiTruck />}
            />
            <KpiCard
              label="Available Vehicles"
              value={dashboardData.availableVehicles}
              icon={<FiCheckCircle />}
            />
            <KpiCard
              label="Vehicles in Maintenance"
              value={dashboardData.vehiclesInMaintenance}
              icon={<FiTool />}
            />
            <KpiCard
              label="Active Trips"
              value={dashboardData.activeTrips}
              icon={<FiActivity />}
            />
            <KpiCard
              label="Pending Trips"
              value={dashboardData.pendingTrips}
              icon={<FiClock />}
            />
            <KpiCard
              label="Drivers On Duty"
              value={dashboardData.driversOnDuty}
              icon={<FiUsers />}
            />
            <KpiCard
              label="Fleet Utilization"
              value={`${dashboardData.fleetUtilization ?? 0}%`}
              icon={<FiPercent />}
            />
          </div>

          <div className="dashboard-charts-grid">
            <div className="dashboard-chart-card">
              <h3 className="dashboard-chart-title">Vehicle Status</h3>
              <VehicleStatusChart data={safeVehicleStatusData} />
            </div>

            <div className="dashboard-chart-card">
              <h3 className="dashboard-chart-title">Fleet Utilization</h3>
              <FleetUtilizationChart data={safeFleetUtilizationData} />
            </div>

            <div className="dashboard-chart-card dashboard-chart-card-wide">
              <h3 className="dashboard-chart-title">Trips by Region</h3>
              <TripsByRegionChart data={safeTripsByRegion} />
            </div>
          </div>

          <div className="dashboard-alerts-section">
            <AlertsPanel alerts={safeAlerts} />
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardPage;
