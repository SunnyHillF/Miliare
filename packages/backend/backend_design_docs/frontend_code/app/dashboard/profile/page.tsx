"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface User {
  username: string;
  email?: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const { getCurrentUser } = await import("aws-amplify/auth");
        const currentUser = await getCurrentUser();
        const email = (currentUser as any).signInDetails?.loginId;
        setUser({ username: currentUser.username, email });
      } catch {
        setUser(null);
      }
    }
    loadUser();
  }, []);

  if (!user) {
    return <div className="p-6">Loading profile...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Your Profile</h1>
      <div className="bg-white rounded-xl shadow-sm border p-6 max-w-md">
        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" value={user.username} disabled />
          </div>
          {user.email && (
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={user.email} disabled />
            </div>
          )}
          <Button className="w-full mt-4" disabled>
            Edit Profile
          </Button>
        </div>
      </div>
    </div>
  );
}
