
import React from "react";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Index = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("/indices");
  }, [router]);

  return <div>Redirecting...</div>;
};

export default Index;
