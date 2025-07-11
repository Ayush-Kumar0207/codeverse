"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";

// ✅ Define a type for saved code snippet
type SavedCode = {
  code: string;
  timestamp: string;
  fileName?: string; // optional, if available in response
  language?: string; // optional, if available
};

export default function ProfilePage() {
  const { user, token, logout } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [savedCodes, setSavedCodes] = useState<SavedCode[]>([]); // ✅ Replace any[] with SavedCode[]

  useEffect(() => {
    if (!user || !token) {
      router.push("/login");
      return;
    }

    const fetchSavedCodes = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/code/user/${user._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSavedCodes(res.data.codes || []);
      } catch (err) {
        console.error("Failed to fetch saved codes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedCodes();
  }, [user, token, router]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 flex flex-col items-center">
      <div className="w-full max-w-2xl bg-gray-900 rounded-2xl shadow-lg p-8 border border-gray-800">
        <h1 className="text-3xl font-bold text-purple-400 mb-6">👤 Your Profile</h1>

        <div className="space-y-4 text-sm sm:text-base">
          <div>
            <span className="font-semibold text-gray-400">Username:</span> {user.username}
          </div>
          {user.email && (
            <div>
              <span className="font-semibold text-gray-400">Email:</span> {user.email}
            </div>
          )}
          <div>
            <span className="font-semibold text-gray-400">User ID:</span> {user._id}
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="mt-8 bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg font-medium"
        >
          Logout
        </button>
      </div>

      {/* Saved Codes Section */}
      <div className="w-full max-w-2xl mt-8">
        <h2 className="text-xl font-semibold mb-4 text-purple-300">💾 Saved Codes</h2>
        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : savedCodes.length === 0 ? (
          <p className="text-gray-500">No saved code snippets found.</p>
        ) : (
          <ul className="space-y-3">
            {savedCodes.map((code, idx) => (
              <li
                key={idx}
                className="bg-gray-800 p-4 rounded-lg border border-gray-700"
              >
                <div className="text-sm text-gray-300 whitespace-pre-wrap">
                  <code>{code.code}</code>
                </div>
                {code.fileName && (
                  <div className="text-xs text-gray-400 mt-2">
                    📄 File: {code.fileName}
                  </div>
                )}
                {code.language && (
                  <div className="text-xs text-gray-400">
                    🧠 Language: {code.language}
                  </div>
                )}
                <div className="text-xs text-right text-gray-500 mt-2">
                  {new Date(code.timestamp).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}