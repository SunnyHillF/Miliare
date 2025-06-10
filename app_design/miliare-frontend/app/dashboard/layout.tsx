"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

const tabs = [
  { name: "Your Business", href: "/dashboard/business" },
  { name: "Learn", href: "/dashboard/learn" },
  { name: "Refer", href: "/dashboard/refer" },
  { name: "Team", href: "/dashboard/team" },
  { name: "Admin", href: "/dashboard/admin" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="min-h-screen flex flex-col bg-primary-light">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 bg-white border-b">
        <div className="flex items-center gap-8">
          <span className="text-xl font-bold text-primary">Miliare</span>
          <ul className="flex gap-6 text-gray-700 font-medium">
            {tabs.map(tab => (
              <li key={tab.name}>
                <Link
                  href={tab.href}
                  className={`pb-1 border-b-2 transition-colors ${pathname === tab.href ? "border-primary text-primary" : "border-transparent hover:text-primary"}`}
                >
                  {tab.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center justify-center gap-2 border border-[#1566C0] text-[#1566C0] bg-white hover:bg-[#f0f4fa] shadow-sm rounded-md px-4 py-2 font-semibold">
              Richard Stanley
              <ChevronDown className="w-4 h-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>👤 Your Profile</DropdownMenuItem>
              <DropdownMenuItem>⚙️ Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>🚪 Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
      <main className="flex-1 px-8 py-6 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
