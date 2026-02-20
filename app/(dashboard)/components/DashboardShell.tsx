"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { LocationProvider } from "@/app/contexts/LocationContext";
import type { LocationItem } from "@/app/contexts/LocationContext";
import type { TenantPlan } from "@/app/generated/prisma/client";

interface DashboardShellProps {
  children: React.ReactNode;
  userName: string;
  userImageUrl: string;
  restaurantName: string;
  plan: TenantPlan;
  locations: LocationItem[];
  isVittlAdmin: boolean;
}

export default function DashboardShell({
  children,
  userName,
  userImageUrl,
  restaurantName,
  plan,
  locations,
  isVittlAdmin,
}: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <LocationProvider locations={locations}>
      <div className="flex h-screen bg-gray-50 overflow-hidden">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          restaurantName={restaurantName}
          plan={plan}
          userName={userName}
          userImageUrl={userImageUrl}
          isVittlAdmin={isVittlAdmin}
        />

        <div className="flex flex-col flex-1 min-w-0 overflow-hidden lg:ml-17">
          <Topbar onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1 overflow-y-auto p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </LocationProvider>
  );
}
