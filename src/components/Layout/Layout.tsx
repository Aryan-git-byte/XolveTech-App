import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import BottomNav from './BottomNav';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pb-16 lg:pb-0">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
};

export default Layout;