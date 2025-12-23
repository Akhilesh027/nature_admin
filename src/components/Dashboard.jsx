// components/Dashboard.js
import React from "react";
import MetricCard from "./MetricCard.js";
import RevenueChart from "./RevenueChart.js";
import ServiceDistributionChart from "./ServiceDistributionChart.js";

const Dashboard = () => {
  const metrics = [
    {
      label: "Total Users",
      value: "12,589",
      change: { value: "12.5%", direction: "up" },
    },
    {
      label: "Total Bookings",
      value: "3,245",
      change: { value: "8.3%", direction: "up" },
    },
    {
      label: "Earnings",
      value: "$42,865",
      change: { value: "15.7%", direction: "up" },
    },
    {
      label: "Pending Requests",
      value: "47",
      change: { value: "3.2%", direction: "down" },
    },
  ];

  const activities = [
    {
      title: "New booking received",
      description: "Sarah Johnson booked a Deep Cleaning service",
      time: "2 minutes ago",
    },
    {
      title: "Payment received",
      description: "Payment of $125.00 received from Michael Brown",
      time: "15 minutes ago",
    },
    {
      title: "New user registered",
      description: "Emily Carter registered as a new customer",
      time: "45 minutes ago",
    },
    {
      title: "Service completed",
      description: "James Wilson completed the Plumbing service",
      time: "1 hour ago",
    },
  ];

  const topServices = [
    {
      service: "Deep Cleaning",
      bookings: 324,
      revenue: "$8,542",
      rating: 4.8,
    },
    {
      service: "Hair Styling",
      bookings: 298,
      revenue: "$7,325",
      rating: 4.7,
    },
    {
      service: "Plumbing Repair",
      bookings: 267,
      revenue: "$6,842",
      rating: 4.6,
    },
    {
      service: "Massage Therapy",
      bookings: 231,
      revenue: "$5,987",
      rating: 4.9,
    },
    {
      service: "Electrical Installation",
      bookings: 215,
      revenue: "$5,432",
      rating: 4.5,
    },
  ];

  return (
    <section className="p-6">
      <div>
        <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white shadow rounded-lg p-4 lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4">Revenue Performance</h3>
          <div className="h-72">
            <RevenueChart />
          </div>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">
            Service Category Distribution
          </h3>
          <div className="h-72">
            <ServiceDistributionChart />
          </div>
        </div>
      </div>

      {/* Recent Activities & Top Services */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-white shadow rounded-lg">
          <div className="flex justify-between items-center border-b px-4 py-3">
            <span className="font-semibold">Recent Activities</span>
            <button className="text-sm bg-blue-600 text-white px-3 py-1 rounded">
              View All
            </button>
          </div>
          <div className="p-4 space-y-4">
            {activities.map((activity, index) => (
              <div key={index} className="border-b pb-2">
                <h6 className="font-medium">{activity.title}</h6>
                <p className="text-sm text-gray-600">{activity.description}</p>
                <div className="text-xs text-gray-400">{activity.time}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white shadow rounded-lg">
          <div className="border-b px-4 py-3">
            <h3 className="font-semibold">Top Performing Services</h3>
          </div>
          <div className="p-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b text-gray-600">
                  <th className="py-2">Service</th>
                  <th className="py-2">Bookings</th>
                  <th className="py-2">Revenue</th>
                  <th className="py-2">Rating</th>
                </tr>
              </thead>
              <tbody>
                {topServices.map((service, index) => (
                  <tr
                    key={index}
                    className="border-b last:border-0 hover:bg-gray-50"
                  >
                    <td className="py-2">{service.service}</td>
                    <td className="py-2">{service.bookings}</td>
                    <td className="py-2">{service.revenue}</td>
                    <td className="py-2">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          service.rating >= 4.5
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {service.rating}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
