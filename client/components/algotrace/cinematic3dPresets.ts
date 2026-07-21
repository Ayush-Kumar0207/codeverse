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
    maxPixelRatio: 2.5,
    toneMappingExposure: 1.24,
  },
  scene: {
    background: 0x030712,
    fog: {
      color: 0x030712,
      near: 18,
      far: 36,
    },
  },
  camera: {
    fov: {
      wide: 37,
      medium: 43,
      compact: 50,
    },
    theta: 0.18,
    elevation: 4.45,
    elevationRange: [2.75, 6.7],
    lookAt: [0, 1.75, 0],
    radius: {
      default: 12.8,
      dense: 14.2,
      mediumBoost: 1.1,
      compactBoost: 2.2,
      min: 8,
      max: 18,
    },
  },
  lights: {
    hemisphere: {
      sky: 0xcdefff,
      ground: 0x08111c,
      intensity: 1.9,
    },
    key: {
      color: 0xffffff,
      intensity: 3.4,
      position: [-4.5, 9, 6.5],
    },
    accents: {
      left: { color: 0x22d3ee, intensity: 6.2, distance: 13, position: [-5.4, 3.2, 2.8] },
      right: { color: 0xa78bfa, intensity: 5.6, distance: 13, position: [5, 3.8, 2.2] },
      answer: { matchIntensity: 7.6, defaultIntensity: 4, distance: 15, position: [0, 4.8, -1.6] },
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
    baseValue: { fontSize: 88, featuredScale: [1.04, 0.48, 1], defaultScale: [0.88, 0.42, 1] },
    indexTick: { fontSize: 72, scale: [0.78, 0.32, 1] },
    pointerTag: { fontSize: 82, scale: [1.9, 0.64, 1] },
    targetBadge: { fontSize: 88, scale: [2.4, 0.68, 1] },
    equation: { fontSize: 86, scale: [2.55, 0.68, 1] },
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
      retired: { color: 0x3b4a62, cap: 0x64748b, emissive: 0x0f172a, emissiveIntensity: 0.14 },
      default: { color: 0x2563eb, cap: 0x93c5fd, emissive: 0x0c4a6e, emissiveIntensity: 0.28 },
    },
  },
} as const satisfies Cinematic3DScenePreset;

export const cinematic3DScenePresets = {
  [twoSumCinematic3DPreset.visualizer]: twoSumCinematic3DPreset,
} as const;