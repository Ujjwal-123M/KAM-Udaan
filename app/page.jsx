"use client";
import { UserButton, useUser } from "@clerk/nextjs";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

function Page() {
  const { isSignedIn, user } = useUser();
  const router = useRouter();
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        // This will either create a new user or return existing user data
        const response = await axios.post("/api/create-user", {
          user: {
            id: user.id,
            email: user.emailAddresses[0]?.emailAddress,
            username: user.username || user.firstName || user.id,
          },
        });

        if (response.data.user) {
          setUserRole(response.data.user.role);
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserRole();
  }, [user]);

  const handleButtonClick = () => {
    if (userRole !== "user") {
      alert("You don't have admin privileges!");
      return;
    }
    router.push("/dashboard/lead-management");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl text-black font-bold">Admin Access</h1>
        <UserButton />
      </div>

      {isSignedIn ? (
        <div className="space-y-4">
          <div className="p-4 rounded-lg text-black bg-gray-100">
            <p className="mb-2">Current Role: {userRole || "Loading..."}</p>
            <button
              onClick={handleButtonClick}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
              disabled={isLoading}
            >
              Access Admin Dashboard
            </button>
          </div>

          {userRole !== "user" && (
            <div className="p-4 rounded-lg bg-yellow-100 text-yellow-800">
              <p>Notice: You need admin privileges to access the dashboard.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="p-4 rounded-lg bg-red-100 text-red-800">
          <p>Please sign in to check your access level.</p>
        </div>
      )}
    </div>
  );
}

export default Page;
