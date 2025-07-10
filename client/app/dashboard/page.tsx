"use client";
import { useEffect, useState } from "react";
import { getToken, removeToken } from "../../utils/auth";
import { useRouter } from "next/navigation";

type User = {
  username: string;
  email: string;
};

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    if (!token) return router.push("/login");

    fetch("http://localhost:5000/api/auth/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUser(data.user);
        else {
          removeToken();
          router.push("/login");
        }
      });
  }, [router]); // ✅ added dependency

  if (!user)
    return <p className="text-white text-center mt-10">Loading...</p>;

  return (
    <div className="h-screen bg-black text-white flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">Welcome, {user.username}!</h1>
      <p>Email: {user.email}</p>
    </div>
  );
}
