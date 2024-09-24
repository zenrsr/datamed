"use client";
import Image from "next/image";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Sidebar, SidebarBody, SidebarLink } from "./ui/sidebar";
import { links } from "@/constants";
import { Logo, LogoIcon } from "./icons";
import { UserButton } from "@clerk/nextjs";

type Props = {
  user: {
    imageUrl: string;
    firstName: string | null;
    lastName: string | null;
    userId: string;
  };
  children: React.ReactNode;
};

const SidebarDemo: React.FC<Props> = ({ user, children }) => {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={cn(
        "rounded-md flex flex-col md:flex-row bg-white w-full flex-1 max-w-7xl mx-auto border border-neutral-700 overflow-hidden text-white",
        "h-screen"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10 bg-white text-black border-gray-700 border-r-[1px]">
          <div className="flex flex-col items-center flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2 text-black">
              {links.map((link, idx) => (
                <SidebarLink
                  key={idx}
                  link={{
                    ...link,
                    label: link.label,
                  }}
                />
              ))}
            </div>
          </div>
          <div>
            {user && (
              <div className="flex items-center justify-evenly rounded-full w-full flex-shrink-0">
                {open ? (
                  <>
                    <UserButton />
                    <p className="font-semibold">{user.firstName!}</p>
                  </>
                ) : (
                  <>
                    <UserButton />
                  </>
                )}
              </div>
            )}
          </div>
        </SidebarBody>
      </Sidebar>
      {children}
    </div>
  );
};

export default SidebarDemo;
