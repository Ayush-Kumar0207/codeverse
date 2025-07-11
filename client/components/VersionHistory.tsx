import { useEffect, useState } from "react";
import axios from "axios";

interface Version {
  _id: string;
  code: string;
  createdAt: string;
}

type Props = {
  userId: string;
  fileName: string;
  onRevert: (code: string) => void;
  refreshSignal?: number; // ✅ NEW: Triggers re-fetch when changed
};

export default function VersionHistory({
  userId,
  fileName,
  onRevert,
  refreshSignal,
}: Props) {
  const [versions, setVersions] = useState<Version[]>([]);

  useEffect(() => {
    const fetchVersions = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/code/versions`, {
          params: { userId, fileName },
        });
        setVersions(res.data.versions);
      } catch (err) {
        console.error("Failed to fetch versions", err);
      }
    };

    fetchVersions();
  }, [userId, fileName, refreshSignal]); // ✅ Trigger re-fetch when signal changes

  return (
    <div className="p-4 bg-[#1b1b2f] text-white rounded-md">
      <h3 className="text-lg font-semibold mb-2">🕒 Version History</h3>
      <ul className="space-y-2">
        {versions.map((version) => (
          <li
            key={version._id}
            className="flex justify-between items-center bg-[#2a2a40] px-4 py-2 rounded"
          >
            <span>{new Date(version.createdAt).toLocaleString()}</span>
            <button
              onClick={() => onRevert(version.code)}
              className="px-3 py-1 text-sm bg-green-600 hover:bg-green-700 rounded"
            >
              Revert
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
