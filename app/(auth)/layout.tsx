"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

function RootLayoutAuth({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex justify-center items-center h-screen">
      <div>
        {children}
        <p className="text-sm text-center mt-6">
          {pathname === "/sign-in" ? (
            <>
              Don't have an account?{" "}
              <Link
                className="text-blue-500 hover:text-blue-600 hover:underline"
                href="/sign-up"
              >
                Sign up
              </Link>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Link
                className="text-blue-500 hover:text-blue-600 hover:underline"
                href="/sign-in"
              >
                Sign in
              </Link>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

export default RootLayoutAuth;