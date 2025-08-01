import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../store';
import PurchaseOrderLayout from '../components/purchase-order/layout/PurchaseOrderLayout';
import LoginPage from '../components/purchase-order/auth/LoginPage';
import Dashboard from '../components/purchase-order/pages/Dashboard';
import PurchaseOrderList from '../components/purchase-order/pages/PurchaseOrderList';
import PurchaseOrderForm from '../components/purchase-order/pages/PurchaseOrderForm';
import PurchaseOrderDetails from '../components/purchase-order/pages/PurchaseOrderDetails';
import SettingsPage from '../components/purchase-order/pages/SettingsPage';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

function PurchaseOrderAppContent() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <PurchaseOrderLayout>
        <Routes>
          <Route path="/" element={<Navigate to="orders" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/orders" element={<PurchaseOrderList />} />
          <Route path="/orders/new" element={<PurchaseOrderForm />} />
          <Route path="/orders/details/:id" element={<PurchaseOrderDetails />} />
          <Route path="/orders/edit/:id" element={<PurchaseOrderForm />} />
          <Route path="/settings" element={<SettingsPage />} />
          {/* <Route path="*" element={<Navigate to="orders" replace />} /> */}
        </Routes>
    </PurchaseOrderLayout>
  );
}

function PurchaseOrderApp() {
  return (
    <Provider store={store}>
      <PurchaseOrderAppContent />
    </Provider>
  );
}

export default PurchaseOrderApp;