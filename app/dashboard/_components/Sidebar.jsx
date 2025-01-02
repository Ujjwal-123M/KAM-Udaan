'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { Users, PhoneCall, BarChart2, UserPlus, Calendar, Menu, X } from 'lucide-react';
import { UserButton, useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';

const sidebarItems = [
  { icon: UserPlus, label: 'Lead Management', href: '/dashboard/lead-management' },
  { icon: Users, label: 'Contact Management', href: '/dashboard/contact-management' },
  { icon: Calendar, label: 'Call Planning', href: '/dashboard/call-planning' },
  { icon: PhoneCall, label: 'Interaction Tracking', href: '/dashboard/interaction-tracking' },
  { icon: BarChart2, label: 'Performance Tracking', href: '/dashboard/performance-tracking' },
];

const SidebarContent = ({ className = '' }) => {
  const { user } = useUser();
  const pathname = usePathname(); // Get the current path

  return (
    <div className={`flex flex-col h-full ${className}`}>
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">KAM Dashboard</h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-4">Main Menu</h3>
          <nav className="space-y-2">
            {sidebarItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                  pathname === item.href
                    ? 'bg-blue-100 text-blue-700 font-semibold'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon className={`h-4 w-4 ${pathname === item.href ? 'text-blue-700' : ''}`} />
                <span>{item.label}</span>
              </a>
            ))}
          </nav>
        </div>
      </div>

      <div className="border-t p-4 bg-white mt-auto">
        <div className="flex items-center gap-3">
          <UserButton afterSignOutUrl="/" />
          <div className="flex flex-col">
            <span className="font-medium text-sm">{user?.fullName || 'N/A'}</span>
            <span className="text-xs text-gray-500">{user?.emailAddresses[0]?.emailAddress}</span>
            <span className="text-xs text-gray-400">Admin</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const SidebarComponent = () => {
  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex h-screen border-r w-64">
        <SidebarContent />
      </div>

      {/* Mobile Hamburger Menu */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden fixed top-4 left-4">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Open menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation Menu</SheetTitle>
          </SheetHeader>
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  );
};

export default SidebarComponent;
