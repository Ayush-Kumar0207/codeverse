import { useState } from "react";

export default function useSettings() {
  const [settings, setSettings] = useState({
    theme: "vs-dark",
    fontSize: 14,
  });

  const updateSetting = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return { settings, updateSetting };
}
