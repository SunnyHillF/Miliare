import React from 'react';

const CompanyAdminPage = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Company Admin Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage partner companies and referral settings.
        </p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <p className="text-gray-700">
          This page is accessible to Partner Admins and Site Admins. 
          Manage company settings, partner configurations, and referral workflows here.
        </p>
      </div>
    </div>
  );
};

export default CompanyAdminPage; 