"use client";
import React from "react";

type SettingsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  settings: {
    fontSize: number;
    theme: string;
  };
  updateSetting: (key: "fontSize" | "theme", value: number | string) => void;
};

export default function SettingsModal({
  isOpen,
  onClose,
  settings,
  updateSetting,
}: SettingsModalProps): React.JSX.Element | null {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-[#0f172a] text-white rounded-lg p-6 w-80">
        <h2 className="text-lg font-bold mb-4">Settings</h2>

        <label className="block mb-2">
          Font Size:
          <input
            type="number"
            value={settings.fontSize}
            onChange={(e) => updateSetting("fontSize", parseInt(e.target.value))}
            className="w-full p-1 mt-1 bg-gray-800 rounded"
          />
        </label>

        <label className="block mb-4">
          Theme:
          <select
            value={settings.theme}
            onChange={(e) => updateSetting("theme", e.target.value)}
            className="w-full p-1 mt-1 bg-gray-800 rounded"
          >
            <option value="vs-dark">Dark</option>
            <option value="light">Light</option>
          </select>
        </label>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-purple-600 px-4 py-2 rounded hover:bg-purple-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
