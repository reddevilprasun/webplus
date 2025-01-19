"use client";
import Upload from "@/components/upload";
import { useAuthActions } from "@convex-dev/auth/react";
import { Button } from "@nextui-org/react";
import React from "react";

const Dashboardpage = () => {
  return (
    <div>
      <h1>Dashboard</h1>
      <Upload/>
    </div>
  );
};

export default Dashboardpage;
