"use client";
import { useAuthActions } from "@convex-dev/auth/react";
import { Button } from "@nextui-org/react";
import React from "react";

const Dashboardpage = () => {
  const { signOut } = useAuthActions();
  return (
    <div>
      <h1>Dashboard</h1>
      <Button
        onClick={() => {
          signOut();
        }}
      >
        Logout
      </Button>
    </div>
  );
};

export default Dashboardpage;
