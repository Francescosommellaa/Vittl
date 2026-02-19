"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

interface DashboardShellProps {
  children: React.ReactNode;
  userName: string;
  userImageUrl: string;
  restaurantName: string;
  plan: string;
}

export default function DashboardShell({
  children,
  userName,
  restaurantName,
  plan,
}: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        restaurantName={restaurantName}
        plan={plan}
      />

      {/*
        Content area:
        - Mobile: nessun margin (sidebar è overlay)
        - Desktop: ml-[68px] fisso = larghezza sidebar collapsed
          La sidebar si espande in overlay verso destra senza spostare il content
      */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden lg:ml-17">
        <Topbar
          userName={userName}
          restaurantName={restaurantName}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
