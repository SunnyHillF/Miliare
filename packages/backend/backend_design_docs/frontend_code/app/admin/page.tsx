"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function checkAdmin() {
      try {
        const { fetchAuthSession } = await import("aws-amplify/auth");
        const { tokens } = await fetchAuthSession();
        const groups: string[] =
          (tokens?.accessToken?.payload["cognito:groups"] as string[]) || [];

        if (groups.includes("admin")) {
          setIsAdmin(true);
        } else {
          router.replace("/login");
        }
      } catch {
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    }

    checkAdmin();
  }, [router]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <p className="text-lg text-gray-600">Welcome, admin! Here you can manage users, view reports, and more.</p>
      {/* Add your admin UI here */}
    </div>
  );
} 