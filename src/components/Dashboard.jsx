import React, { useState, useEffect } from "react";
import MetricCard from "./MetricCard";
import RevenueChart from "./RevenueChart";
import ServiceDistributionChart from "./ServiceDistributionChart";

const API = "https://api.hellonature.in/api/dashboard"; // change if deployed

const Dashboard = () => {
  const [metrics, setMetrics] = useState([]);
  const [activities, setActivities] = useState([]);
  const [topServices, setTopServices] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [serviceDistribution, setServiceDistribution] = useState([]);
  const [loading, setLoading] = useState({
    metrics: true,
    activities: true,
    topServices: true,
    revenue: true,
    distribution: true
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setError(null);

      const [
        metricsRes,
        revenueRes,
        distributionRes,
        activitiesRes,
        topServicesRes
      ] = await Promise.all([
        fetch(`${API}/metrics`).then(res => res.json()),
        fetch(`${API}/revenue`).then(res => res.json()),
        fetch(`${API}/service-distribution`).then(res => res.json()),
        fetch(`${API}/activities`).then(res => res.json()),
        fetch(`${API}/top-services`).then(res => res.json())
      ]);

      if (metricsRes.success) setMetrics(formatMetrics(metricsRes.data));
      if (revenueRes.success) setRevenueData(revenueRes.data);
      if (distributionRes.success) setServiceDistribution(distributionRes.data);
      if (activitiesRes.success) setActivities(activitiesRes.data);
      if (topServicesRes.success) setTopServices(topServicesRes.data);

    } catch (err) {
      console.error("Dashboard fetch error", err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading({
        metrics: false,
        activities: false,
        topServices: false,
        revenue: false,
        distribution: false
      });
    }
  };

  const formatMetrics = (apiData) => {
    return [
      {
        label: "Total Users",
        value: apiData.totalUsers?.toLocaleString() || "0",
        change: {
          value: `${apiData.userGrowthPercentage || 0}%`,
          direction: apiData.userGrowthPercentage >= 0 ? "up" : "down"
        }
      },
      {
        label: "Total Bookings",
        value: apiData.totalBookings?.toLocaleString() || "0",
        change: {
          value: `${apiData.bookingGrowthPercentage || 0}%`,
          direction: apiData.bookingGrowthPercentage >= 0 ? "up" : "down"
        }
      },
      {
        label: "Earnings",
        value: `$${apiData.totalEarnings?.toLocaleString() || "0"}`,
        change: {
          value: `${apiData.earningsGrowthPercentage || 0}%`,
          direction: apiData.earningsGrowthPercentage >= 0 ? "up" : "down"
        }
      },
      {
        label: "Pending Requests",
        value: apiData.pendingRequests?.toLocaleString() || "0",
        change: {
          value: `${apiData.pendingRequestsChangePercentage || 0}%`,
          direction: apiData.pendingRequestsChangePercentage >= 0 ? "up" : "down"
        }
      }
    ];
  };

  const handleRetry = () => {
    setLoading({
      metrics: true,
      activities: true,
      topServices: true,
      revenue: true,
      distribution: true
    });
    fetchDashboardData();
  };

  if (error && !metrics.length) {
    return (
      <section className="p-6">
        <div className="flex flex-col items-center justify-center h-96">
          <div className="text-red-500 mb-4">⚠️ {error}</div>
          <button 
            onClick={handleRetry}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Dashboard Overview</h2>
        <button 
          onClick={fetchDashboardData}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm flex items-center gap-2"
        >
          Refresh Data
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {loading.metrics ? (
          Array(4).fill(0).map((_, index) => (
            <div key={index} className="bg-white shadow rounded-lg p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))
        ) : (
          metrics.map((metric, index) => (
            <MetricCard key={index} {...metric} />
          ))
        )}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white shadow rounded-lg p-4 lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4">Revenue Performance</h3>
          <div className="h-72">
            {loading.revenue ? "Loading..." : <RevenueChart data={revenueData} />}
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Service Distribution</h3>
          <div className="h-72">
            {loading.distribution ? "Loading..." : <ServiceDistributionChart data={serviceDistribution} />}
          </div>
        </div>
      </div>

    
    </section>
  );
};

export default Dashboard;
