import { useState } from "react";

type SimpleSettingValue = string | number | boolean;

export default function useSettings() {
  const [settings, setSettings] = useState({
    theme: "vs-dark",
    fontSize: 14,
  });

  const updateSetting = (key: string, value: SimpleSettingValue) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return { settings, updateSetting };
}
