"use client"; // Ensure this component is a client component

import { Features } from "@/components/landing/features";
import Footer from "@/components/landing/footer";
import { Hero } from "@/components/landing/hero";
import NavbarWrapper from "@/components/landing/NavbarUser";
import { Pricing } from "@/components/landing/pricing";
import { useRouter } from "next/navigation"; // useRouter for client-side navigation
import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";

export default function Home() {
  const { isLoaded, isSignedIn } = useUser(); // Keep useUser in the client component
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push("/dashboard"); // Use router.push for client-side navigation
    }
  }, [isLoaded, isSignedIn, router]);

  // Early return if user status is still loading
  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <NavbarWrapper />
      <main className="flex-grow">
        <Hero />
        <Features />
        <Pricing />
      </main>
      <Footer />
    </div>
  );
}
