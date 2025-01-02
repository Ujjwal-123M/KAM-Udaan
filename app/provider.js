"use client";

import { useUser } from "@clerk/nextjs";
import axios from "axios";
import React, { useEffect } from "react";

function Provider({ children }) {
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      checkNewUser();
    }
  }, [user]);

  const checkNewUser = async () => {
    try {
      // You can either:
      // 1. Get role from Clerk's public metadata if you've set it up
      const userRole = user.publicMetadata?.role || 'user';
      
      // Or 2. Use a default role for new users
      const response = await axios.post("/api/create-user", {
        user: {
          id: user.id,
          email: user.emailAddresses[0]?.emailAddress,
          username: user.username || user.firstName || user.id,
          role: userRole // Now we're explicitly setting the role
        },
      });
      console.log(response.data.message);
    } catch (error) {
      console.error("Error checking or creating user:", error.response?.data || error.message);
    }
  };

  return <div>{children}</div>;
}

export default Provider;