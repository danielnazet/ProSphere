import { useState } from 'react';

export default function Dashboard() {
  // Example static data - we'll replace this with real data later
  const stats = {
    invoicesThisMonth: 12,
    revenue: 25000.00,
    lowStockProducts: 3,
    activeClients: 8
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Faktury w tym miesiącu</dt>
          <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.invoicesThisMonth}</dd>
        </div>
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Przychody (PLN)</dt>
          <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.revenue.toFixed(2)}</dd>
        </div>
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Produkty na wyczerpaniu</dt>
          <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.lowStockProducts}</dd>
        </div>
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Aktywni klienci</dt>
          <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.activeClients}</dd>
        </div>
      </div>
    </div>
  );
}