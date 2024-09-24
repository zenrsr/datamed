import SidebarDemo from "@/components/SidebarDemo";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  children: React.ReactNode;
};

export default async function DashboardLayout({ children }: Props) {
  const user = await currentUser();

  if (!user) redirect("/sign-in");

  const userData = {
    firstName: user?.firstName,
    lastName: user?.lastName,
    imageUrl: user?.imageUrl,
    userId: user?.id,
  };

  return <SidebarDemo user={userData}>{children}</SidebarDemo>;
}
