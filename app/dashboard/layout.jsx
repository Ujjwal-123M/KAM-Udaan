'use client'

import React from 'react';
import SidebarComponent from './_components/Sidebar';
import { SidebarProvider } from '@/components/ui/sidebar'; 

function Layout({ children }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar Section - hidden on mobile, fixed on desktop */}
        <div className="hidden md:block w-64 flex-shrink-0">
          <div className="fixed h-screen w-64">
            <SidebarComponent />
          </div>
        </div>

        {/* Main Content - takes full width on mobile, adjusts on desktop */}
        <main className="flex-1 min-w-0 overflow-auto">
          {/* Top bar for mobile menu */}
          <div className="md:hidden sticky top-0 z-10 h-16 bg-white border-b px-4">
            <SidebarComponent />
          </div>
          
          {/* Main content area */}
          <div className="p-4  md:p-6">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}

export default Layout;