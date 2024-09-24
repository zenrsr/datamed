import type { Metadata } from "next";
import "./globals.css";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "DataMed",
  icons: {
    icon: "/DataMed_avatar.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="h-screen overflow-x-hidden w-screen bg-black text-white">
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
