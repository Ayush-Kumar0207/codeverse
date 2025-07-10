"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import React from "react"; // ✅ Needed for typing React.FormEvent

export default function SignUpPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    username: "",
    password: "",
    email: "",
  });

  // ✅ Proper type for form submit event
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        alert("Registration successful!");
        router.push("/login");
      } else {
        const { error } = await res.json();
        alert("Error: " + error);
      }
    } catch (err) {
      console.error("Registration failed", err);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-black text-white">
      <form
        onSubmit={handleSubmit}
        className="w-96 bg-gray-900 p-6 rounded-xl space-y-4"
      >
        <h2 className="text-2xl font-bold text-purple-400 text-center">
          Create Account
        </h2>

        <input
          className="w-full p-2 bg-gray-800 rounded"
          placeholder="Username"
          value={form.username}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, username: e.target.value }))
          }
          required
        />

        <input
          className="w-full p-2 bg-gray-800 rounded"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, email: e.target.value }))
          }
          required
        />

        <input
          type="password"
          className="w-full p-2 bg-gray-800 rounded"
          placeholder="Password"
          value={form.password}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, password: e.target.value }))
          }
          required
        />

        <button
          type="submit"
          className="w-full p-2 bg-purple-600 hover:bg-purple-700 rounded"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}