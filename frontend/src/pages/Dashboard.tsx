import React from 'react';

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">WhatsApp Accounts</h2>
          <p className="text-gray-600">Manage your WhatsApp Business accounts</p>
          <a href="/whatsapp-accounts" className="mt-4 inline-block text-indigo-600 hover:text-indigo-800 font-medium">
            Manage Accounts
          </a>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Flow Builder</h2>
          <p className="text-gray-600">Create and manage your automation flows</p>
          <a href="/flows" className="mt-4 inline-block text-indigo-600 hover:text-indigo-800 font-medium">
            Build Flows
          </a>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Payments</h2>
          <p className="text-gray-600">View and manage your subscriptions and payments</p>
          <a href="/payments" className="mt-4 inline-block text-indigo-600 hover:text-indigo-800 font-medium">
            View Payments
          </a>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;