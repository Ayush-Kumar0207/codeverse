export type Cinematic3DScenePreset = {
  visualizer: string;
  rendererTestId: string;
  layout: {
    compactWidth: number;
    compactHeight: number;
  };
  renderer: {
    maxPixelRatio: number;
    toneMappingExposure: number;
  };
  scene: {
    background: number;
    fog: {
      color: number;
      near: number;
      far: number;
    };
  };
  camera: {
    fov: {
      wide: number;
      medium: number;
      compact: number;
    };
    theta: number;
    elevation: number;
    elevationRange: readonly [number, number];
    lookAt: readonly [number, number, number];
    radius: {
      default: number;
      dense: number;
      mediumBoost: number;
      compactBoost: number;
      min: number;
      max: number;
    };
  };
  lights: {
    hemisphere: {
      sky: number;
      ground: number;
      intensity: number;
    };
    key: {
      color: number;
      intensity: number;
      position: readonly [number, number, number];
    };
    accents: {
      left: { color: number; intensity: number; distance: number; position: readonly [number, number, number] };
      right: { color: number; intensity: number; distance: number; position: readonly [number, number, number] };
      answer: { matchIntensity: number; defaultIntensity: number; distance: number; position: readonly [number, number, number] };
    };
  };
  stage: {
    spacing: number;
    minWidth: number;
    widthPadding: number;
    depth: number;
    platformHeight: number;
    surfaceInset: number;
    surfaceDepth: number;
    railZ: number;
  };
  towers: {
    topRadius: number;
    bottomRadius: number;
    segments: number;
    minHeight: number;
    heightScale: number;
    baseYOffset: number;
  };
  labels: {
    textureScale: number;
    baseValue: { fontSize: number; featuredScale: readonly [number, number, number]; defaultScale: readonly [number, number, number] };
    indexTick: { fontSize: number; scale: readonly [number, number, number] };
    pointerTag: { fontSize: number; scale: readonly [number, number, number] };
    targetBadge: { fontSize: number; scale: readonly [number, number, number] };
    equation: { fontSize: number; scale: readonly [number, number, number] };
  };
  colors: {
    pointers: Record<string, number>;
    comparison: Record<string, number>;
    towers: {
      solution: { color: number; cap: number; emissive: number; emissiveIntensity: number };
      retired: { color: number; cap: number; emissive: number; emissiveIntensity: number };
      default: { color: number; cap: number; emissive: number; emissiveIntensity: number };
    };
  };
};

export const twoSumCinematic3DPreset = {
  visualizer: "two-sum-cinematic-3d",
  rendererTestId: "two-sum-cinematic-canvas",
  layout: {
    compactWidth: 720,
    compactHeight: 520,
  },
  renderer: {
    maxPixelRatio: 2,
    toneMappingExposure: 1.08,
  },
  scene: {
    background: 0x030712,
    fog: {
      color: 0x030712,
      near: 13,
      far: 25,
    },
  },
  camera: {
    fov: {
      wide: 37,
      medium: 44,
      compact: 52,
    },
    theta: 0.18,
    elevation: 4.55,
    elevationRange: [2.75, 6.7],
    lookAt: [0, 1.85, 0],
    radius: {
      default: 12.2,
      dense: 13.4,
      mediumBoost: 1.2,
      compactBoost: 2.4,
      min: 8.8,
      max: 17.5,
    },
  },
  lights: {
    hemisphere: {
      sky: 0xcdefff,
      ground: 0x08111c,
      intensity: 1.55,
    },
    key: {
      color: 0xffffff,
      intensity: 2.8,
      position: [-4.5, 9, 6.5],
    },
    accents: {
      left: { color: 0x22d3ee, intensity: 5.5, distance: 11, position: [-5.4, 3.2, 2.8] },
      right: { color: 0xa78bfa, intensity: 4.8, distance: 11, position: [5, 3.8, 2.2] },
      answer: { matchIntensity: 7, defaultIntensity: 3.2, distance: 13, position: [0, 4.8, -1.6] },
    },
  },
  stage: {
    spacing: 1.72,
    minWidth: 10.4,
    widthPadding: 3.4,
    depth: 3.65,
    platformHeight: 0.18,
    surfaceInset: 0.55,
    surfaceDepth: 3.18,
    railZ: 1.86,
  },
  towers: {
    topRadius: 0.42,
    bottomRadius: 0.48,
    segments: 48,
    minHeight: 0.75,
    heightScale: 3.35,
    baseYOffset: 0.12,
  },
  labels: {
    textureScale: 3,
    baseValue: { fontSize: 68, featuredScale: [0.68, 0.29, 1], defaultScale: [0.52, 0.24, 1] },
    indexTick: { fontSize: 52, scale: [0.44, 0.18, 1] },
    pointerTag: { fontSize: 64, scale: [1.34, 0.42, 1] },
    targetBadge: { fontSize: 72, scale: [1.78, 0.48, 1] },
    equation: { fontSize: 68, scale: [1.9, 0.48, 1] },
  },
  colors: {
    pointers: {
      cyan: 0x22d3ee,
      violet: 0xa78bfa,
      emerald: 0x34d399,
      rose: 0xfb7185,
      amber: 0xfbbf24,
    },
    comparison: {
      match: 0x34d399,
      "too-high": 0xfb7185,
      "too-low": 0x22d3ee,
      compare: 0xfbbf24,
    },
    towers: {
      solution: { color: 0x10b981, cap: 0x6ee7b7, emissive: 0x064e3b, emissiveIntensity: 0.88 },
      retired: { color: 0x273449, cap: 0x475569, emissive: 0x020617, emissiveIntensity: 0.06 },
      default: { color: 0x1d4ed8, cap: 0x60a5fa, emissive: 0x082f49, emissiveIntensity: 0.18 },
    },
  },
} as const satisfies Cinematic3DScenePreset;

export const cinematic3DScenePresets = {
  [twoSumCinematic3DPreset.visualizer]: twoSumCinematic3DPreset,
} as const;