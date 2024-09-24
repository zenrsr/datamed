"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { useEffect, useState } from "react";

export default function Dashboard() {
  return (
    <div className="p-4">
      <h1 className="font-bold text-5xl">Fitness Data</h1>
      <Link href={"/api/auth/google"}>
        <Button className="gap-2">
          <FcGoogle />
          Sign In
        </Button>
      </Link>
    </div>
  );
}
