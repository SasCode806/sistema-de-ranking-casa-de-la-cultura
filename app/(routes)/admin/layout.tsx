"use client";
import { isTeacher } from "@/lib/admin";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

function RootLayoutAdmin({ children }: { children: React.ReactNode }) {
  const { userId } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isTeacher(userId)) {
      router.push("/");
    }
  }, []);

  return <div>{children}</div>;
}

export default RootLayoutAdmin;
