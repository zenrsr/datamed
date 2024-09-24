"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { Menu, X } from "lucide-react";

interface NavbarProps {
  isSignedIn: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ isSignedIn }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full bg-white bg-opacity-75 backdrop-blur-xl z-20 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/DataMed_avatar.png"
                width={75}
                height={75}
                className="rounded-full"
                alt="logo"
              />
              <h1 className="ml-2 font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
                DataMed
              </h1>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <Link href="#hero" className="text-gray-600 hover:text-gray-900">
              About
            </Link>
            <Link
              href="#features"
              className="text-gray-600 hover:text-gray-900"
            >
              Features
            </Link>
            <Link href="#pricing" className="text-gray-600 hover:text-gray-900">
              Pricing
            </Link>
            {isSignedIn ? (
              <UserButton afterSignOutUrl="/" />
            ) : (
              <SignInButton>
                <Button variant="ghost" className="border border-black">
                  Sign in
                </Button>
              </SignInButton>
            )}
          </div>
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="#hero"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
              About
            </Link>
            <Link
              href="#features"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
              Features
            </Link>
            <Link
              href="#pricing"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
              Pricing
            </Link>
            {isSignedIn ? (
              <UserButton afterSignOutUrl="/" />
            ) : (
              <SignInButton>
                <Button
                  variant="ghost"
                  className="w-full border border-black mt-2"
                >
                  Sign in
                </Button>
              </SignInButton>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
