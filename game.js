// Sega-style rotation matrices for ARS (Arika Rotation System)
// These are aligned to the bottom of the bounding box, unlike SRS
const SEGA_ROTATIONS = {
  I: {
    rotations: [
      [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ], // Rotation 0
      [
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0],
      ], // Rotation 1
      [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ], // Rotation 2
      [
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0],
      ], // Rotation 3
    ],
    color: 0x00ffff,
  },
  O: {
    rotations: [
      [
        [1, 1],
        [1, 1],
      ], // Rotation 0
      [
        [1, 1],
        [1, 1],
      ], // Rotation 1
      [
        [1, 1],
        [1, 1],
      ], // Rotation 2
      [
        [1, 1],
        [1, 1],
      ], // Rotation 3
    ],
    color: 0xffff00,
  },
  S: {
    rotations: [
      [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0],
      ], // Rotation 0
      [
        [1, 0, 0],
        [1, 1, 0],
        [0, 1, 0],
      ], // Rotation 1
      [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0],
      ], // Rotation 2
      [
        [1, 0, 0],
        [1, 1, 0],
        [0, 1, 0],
      ], // Rotation 3
    ],
    color: 0x00ff00,
  },
  Z: {
    rotations: [
      [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0],
      ], // Rotation 0
      [
        [0, 0, 1],
        [0, 1, 1],
        [0, 1, 0],
      ], // Rotation 1
      [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0],
      ], // Rotation 2
      [
        [0, 0, 1],
        [0, 1, 1],
        [0, 1, 0],
      ], // Rotation 3
    ],
    color: 0xff0000,
  },
  J: {
    rotations: [
      [
        [0, 0, 0],
        [1, 1, 1],
        [0, 0, 1],
      ], // Rotation 0 (3-wide)
      [
        [0, 1, 0],
        [0, 1, 0],
        [1, 1, 0],
      ], // Rotation 1
      [
        [0, 0, 0],
        [1, 0, 0],
        [1, 1, 1],
      ], // Rotation 2 (3-wide) - shifted down
      [
        [0, 1, 1],
        [0, 1, 0],
        [0, 1, 0],
      ], // Rotation 3
    ],
    color: 0x0000ff,
  },
  L: {
    rotations: [
      [
        [0, 0, 0],
        [1, 1, 1],
        [1, 0, 0],
      ], // Rotation 0 (3-wide)
      [
        [1, 1, 0],
        [0, 1, 0],
        [0, 1, 0],
      ], // Rotation 1
      [
        [0, 0, 0],
        [0, 0, 1],
        [1, 1, 1],
      ], // Rotation 2 (3-wide) - shifted down
      [
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 1],
      ], // Rotation 3
    ],
    color: 0xffa500,
  },
  T: {
    rotations: [
      [
        [0, 0, 0],
        [1, 1, 1],
        [0, 1, 0],
      ], // Rotation 0 (3-wide)
      [
        [0, 1, 0],
        [1, 1, 0],
        [0, 1, 0],
      ], // Rotation 1
      [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0],
      ], // Rotation 2 (3-wide)
      [
        [0, 1, 0],
        [0, 1, 1],
        [0, 1, 0],
      ], // Rotation 3
    ],
    color: 0xff00ff,
  },
};

// Fallback difficulty colors for mode types (used across scenes)
const FALLBACK_MODE_TYPE_COLORS = {
  easy: "#00ff00", // green
  standard: "#0088ff", // blue
  master: "#888888", // grey
  "20g": "#ff0000", // red
  race: "#ff8800", // orange
  "all clear": "#ff69b4", // pink
  puzzle: "#8800ff", // purple
  versus: "#ffcc00", // gold
};

const MODE_TYPE_BY_ID = {
  tgm2_normal: "EASY",
  tgm3_easy: "EASY",
  sprint_40: "STANDARD",
  sprint_100: "STANDARD",
  ultra: "STANDARD",
  marathon: "STANDARD",
  zen: "STANDARD",
  tgm1: "MASTER",
  tgm2: "MASTER",
  tgm_plus: "MASTER",
  tgm3: "MASTER",
  tgm4: "MASTER",
  "master_20g": "20G",
  tadeath: "20G",
  ta_death: "20G",
  shirase: "20G",
  tgm3_shirase: "20G",
  tgm4_rounds: "20G",
  tgm4_2_1: "20G",
  tgm4_3_1: "20G",
  tgm4_4_1: "20G",
  asuka_easy: "RACE",
  asuka_normal: "RACE",
  asuka_hard: "RACE",
  konoha_easy: "ALL CLEAR",
  konoha_hard: "ALL CLEAR",
  tgm3_sakura: "PUZZLE",
  flashpoint: "PUZZLE",
  versus_guideline: "VERSUS",
  versus_tgm: "VERSUS",
};
const BASE_FPS = 60;

function getModeTypeNameFromId(modeId) {
  if (!modeId) return "";
  const key = modeId.toLowerCase();
  return MODE_TYPE_BY_ID[key] || "";
}

// Shared Git commit fetcher (cached)
async function fetchLastCommitDateCached() {
  if (window.__lastCommitDatePromise) return window.__lastCommitDatePromise;
  window.__lastCommitDatePromise = fetch(
    "https://api.github.com/repos/yumemizook/Mino-Freefall/commits?per_page=1",
  )
    .then((res) => res.json())
    .then((data) => {
      const isoDate =
        Array.isArray(data) &&
        data[0] &&
        data[0].commit &&
        data[0].commit.author &&
        data[0].commit.author.date
          ? data[0].commit.author.date
          : null;
      if (!isoDate) return "Last commit: unknown";
      const formatted = new Date(isoDate).toLocaleString();
      return `Last commit: ${formatted}`;
    })
    .catch(() => "Last commit: unavailable");
  return window.__lastCommitDatePromise;
}

function getModeTypeColor(modeTypeName) {
  if (!modeTypeName) return "#ffffff";
  if (typeof getModeManager !== "undefined") {
    const modeManager = getModeManager();
    const color =
      modeManager?.difficultyColors?.[modeTypeName.toLowerCase()] || null;
    if (color) return color;
  }
  return FALLBACK_MODE_TYPE_COLORS[modeTypeName.toLowerCase()] || "#ffffff";
}

function buildModeInfo(modeId, modeNameHint = "") {
  const modeLabelName = modeNameHint || modeId || "—";
  const modeTypeName = getModeTypeNameFromId(modeId);
  return { modeLabel: modeLabelName, modeTypeName };
}

function getModeInfoId(gameMode, selectedMode = "") {
  const gameModeId =
    gameMode && typeof gameMode.getModeId === "function"
      ? gameMode.getModeId()
      : "";
  const registryHasGameModeId = !!getModeTypeNameFromId(gameModeId);
  return registryHasGameModeId ? gameModeId : selectedMode || gameModeId;
}

function getUserAgentText() {
  const ua = navigator?.userAgent || "";
  const uaData = navigator?.userAgentData;

  const detailedFromUA = () => {
    const match = ua.match(/\(([^)]+)\)/);
    if (match && match[1]) {
      const parts = match[1].split(";").map((p) => p.trim()).filter(Boolean);
      if (parts.length > 0) return parts.join("; ");
    }
    return null;
  };

  const platform =
    detailedFromUA() ||
    uaData?.platform ||
    navigator?.platform ||
    ua ||
    "unknown";
  return `OS: ${platform}`;
}

function createOrUpdateGlobalOverlay(scene, modeInfo = {}) {
  const camera = scene.cameras?.main;
  if (!camera) return;
  const padding = 12;
  const width = camera.width;
  const height = camera.height;

  const overlay = scene.globalOverlayTexts;
  const overlayTextsValid =
    overlay &&
    overlay.titleText &&
    overlay.modeText &&
    overlay.commitText &&
    overlay.userAgentText &&
    overlay.titleText.active &&
    overlay.modeText.active &&
    overlay.commitText.active &&
    overlay.userAgentText.active &&
    overlay.titleText.scene &&
    overlay.modeText.scene &&
    overlay.commitText.scene &&
    overlay.userAgentText.scene &&
    overlay.titleText.scene.sys &&
    overlay.modeText.scene.sys &&
    overlay.commitText.scene.sys &&
    overlay.userAgentText.scene.sys &&
    !overlay.titleText.scene.sys.isDestroyed &&
    !overlay.modeText.scene.sys.isDestroyed &&
    !overlay.commitText.scene.sys.isDestroyed &&
    !overlay.userAgentText.scene.sys.isDestroyed;

  if (!overlayTextsValid) {
    // Clean any stale references from previous scenes
    scene.globalOverlayTexts = null;

    const titleText = scene.add
      .text(padding, padding, "Mino Freefall - pre-beta", {
        fontSize: "16px",
        fill: "#ffffff",
        fontFamily: "Courier New",
        fontStyle: "bold",
      })
      .setScrollFactor(0)
      .setDepth(10000);

    const modeText = scene.add
      .text(width - padding, padding, "", {
        fontSize: "16px",
        fill: "#ffffff",
        fontFamily: "Courier New",
        fontStyle: "bold",
        align: "right",
      })
      .setOrigin(1, 0)
      .setScrollFactor(0)
      .setDepth(10000);

    const commitText = scene.add
      .text(padding, height - padding, "Last commit: loading...", {
        fontSize: "14px",
        fill: "#bbbbbb",
        fontFamily: "Courier New",
      })
      .setOrigin(0, 1)
      .setScrollFactor(0)
      .setDepth(10000);

    const userAgentText = scene.add
      .text(width - padding, height - padding, getUserAgentText(), {
        fontSize: "14px",
        fill: "#bbbbbb",
        fontFamily: "Courier New",
        align: "right",
      })
      .setOrigin(1, 1)
      .setScrollFactor(0)
      .setDepth(10000);

    scene.globalOverlayTexts = {
      titleText,
      modeText,
      commitText,
      userAgentText,
    };

    fetchLastCommitDateCached().then((text) => {
      const commit = scene.globalOverlayTexts?.commitText;
      if (
        commit &&
        commit.active &&
        commit.scene?.sys &&
        !commit.scene.sys.isDestroyed
      ) {
        commit.setText(text);
      }
    });
  }

  const { modeLabel = "", modeTypeName = "", showMode = true } = modeInfo;
  const modeColor = getModeTypeColor(modeTypeName);
  scene.globalOverlayTexts.modeText.setVisible(showMode);
  if (showMode) {
    scene.globalOverlayTexts.modeText.setText(modeLabel || "");
    scene.globalOverlayTexts.modeText.setColor(modeColor);
    scene.globalOverlayTexts.modeText.setStyle({ fontStyle: "bold" });
  } else {
    scene.globalOverlayTexts.modeText.setText("");
  }

  // Reposition on demand
  scene.globalOverlayTexts.modeText.setPosition(width - padding, padding);
  scene.globalOverlayTexts.commitText.setPosition(padding, height - padding);
  scene.globalOverlayTexts.userAgentText.setText(getUserAgentText());
  scene.globalOverlayTexts.userAgentText.setPosition(
    width - padding,
    height - padding,
  );
}

// Simple snapshot test for kick tables (SRS and ARS) to help verify tables in other environments.
function runKickTableSnapshotTest() {
  const expect = {
    SRS_JLSTZ_CW: [
      [
        [0, 0],
        [-1, 0],
        [-1, 1],
        [0, -2],
        [-1, -2],
      ],
      [
        [0, 0],
        [1, 0],
        [1, -1],
        [0, 2],
        [1, 2],
      ],
      [
        [0, 0],
        [1, 0],
        [1, 1],
        [0, -2],
        [1, -2],
      ],
      [
        [0, 0],
        [-1, 0],
        [-1, -1],
        [0, 2],
        [-1, 2],
      ],
    ],
    SRS_JLSTZ_CCW: [
      [
        [0, 0],
        [1, 0],
        [1, 1],
        [0, -2],
        [1, -2],
      ],
      [
        [0, 0],
        [1, 0],
        [1, -1],
        [0, 2],
        [1, 2],
      ],
      [
        [0, 0],
        [-1, 0],
        [-1, 1],
        [0, -2],
        [-1, -2],
      ],
      [
        [0, 0],
        [-1, 0],
        [-1, -1],
        [0, 2],
        [-1, 2],
      ],
    ],
    SRS_I_CW: [
      [
        [0, 0],
        [-2, 0],
        [1, 0],
        [-2, 1],
        [1, -2],
      ],
      [
        [0, 0],
        [-1, 0],
        [2, 0],
        [-1, -2],
        [2, 1],
      ],
      [
        [0, 0],
        [2, 0],
        [-1, 0],
        [2, -1],
        [-1, 2],
      ],
      [
        [0, 0],
        [1, 0],
        [-2, 0],
        [1, 2],
        [-2, -1],
      ],
    ],
    SRS_I_CCW: [
      [
        [0, 0],
        [-1, 0],
        [2, 0],
        [-1, -2],
        [2, 1],
      ],
      [
        [0, 0],
        [2, 0],
        [-1, 0],
        [2, -1],
        [-1, 2],
      ],
      [
        [0, 0],
        [1, 0],
        [-2, 0],
        [1, 2],
        [-2, -1],
      ],
      [
        [0, 0],
        [-2, 0],
        [1, 0],
        [-2, 1],
        [1, -2],
      ],
    ],
    ARS_JLSTZ_CW: [
      [
        [0, 0],
        [-1, 0],
        [0, -1],
        [-1, -1],
        [0, 1],
      ],
      [
        [0, 0],
        [1, 0],
        [0, -1],
        [1, -1],
        [0, 1],
      ],
      [
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
        [0, -1],
      ],
      [
        [0, 0],
        [-1, 0],
        [0, 1],
        [-1, 1],
        [0, -1],
      ],
    ],
    ARS_JLSTZ_CCW: [
      [
        [0, 0],
        [1, 0],
        [0, -1],
        [1, -1],
        [0, 1],
      ],
      [
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
        [0, -1],
      ],
      [
        [0, 0],
        [-1, 0],
        [0, 1],
        [-1, 1],
        [0, -1],
      ],
      [
        [0, 0],
        [-1, 0],
        [0, -1],
        [-1, -1],
        [0, 1],
      ],
    ],
    ARS_I_CW: [
      [
        [0, 0],
        [-1, 0],
        [1, 0],
        [0, -1],
        [-2, 0],
        [1, 2],
      ],
      [
        [0, 0],
        [0, -1],
        [0, 1],
        [-1, 0],
        [1, 0],
      ],
      [
        [0, 0],
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ],
      [
        [0, 0],
        [0, 1],
        [0, -1],
        [1, 0],
        [-1, 0],
      ],
    ],
    ARS_I_CCW: [
      [
        [0, 0],
        [1, 0],
        [-1, 0],
        [0, -1],
        [2, 0],
        [-1, 2],
      ],
      [
        [0, 0],
        [0, -1],
        [0, 1],
        [1, 0],
        [-1, 0],
      ],
      [
        [0, 0],
        [-1, 0],
        [1, 0],
        [0, 1],
        [0, -1],
      ],
      [
        [0, 0],
        [0, 1],
        [0, -1],
        [-1, 0],
        [1, 0],
      ],
    ],
  };

  const deepEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  const results = {
    srsJLSTZCW: deepEqual(SRS_KICKS.JLSTZ_CW, expect.SRS_JLSTZ_CW),
    srsJLSTZCCW: deepEqual(SRS_KICKS.JLSTZ_CCW, expect.SRS_JLSTZ_CCW),
    srsICW: deepEqual(SRS_KICKS.I_CW, expect.SRS_I_CW),
    srsICCW: deepEqual(SRS_KICKS.I_CCW, expect.SRS_I_CCW),
    arsJLSTZCW: deepEqual(ARS_KICKS.JLSTZ_CW, expect.ARS_JLSTZ_CW),
    arsJLSTZCCW: deepEqual(ARS_KICKS.JLSTZ_CCW, expect.ARS_JLSTZ_CCW),
    arsICW: deepEqual(ARS_KICKS.I_CW, expect.ARS_I_CW),
    arsICCW: deepEqual(ARS_KICKS.I_CCW, expect.ARS_I_CCW),
  };

  results.all = Object.values(results).every((v) => v === true);
  return results;
}

if (typeof window !== "undefined") {
  window.runKickTableSnapshotTest = runKickTableSnapshotTest;
}

function getSrsMinimalRotations(type, rotation) {
  if (type === "O") return 0;
  if (type === "I") {
    return rotation === 1 || rotation === 3 ? 1 : 0;
  }
  if (type === "S" || type === "Z") {
    const r = rotation % 2;
    return r === 1 ? 1 : 0;
  }
  // J, L, T
  if (rotation === 0) return 0;
  if (rotation === 2) return 2;
  return 1; // rotation 1 or 3
}

function getSrsMinimalMoves(type, rotation, leftCol) {
  const table = SRS_FINESSE_TABLE[type];
  if (!table) return null;
  const rKey =
    type === "S" || type === "Z" ? rotation % 2 : rotation % (table ? Object.keys(table).length : 4);
  const arr = table[rKey];
  if (!arr || leftCol < 0 || leftCol >= arr.length) return null;
  return arr[leftCol];
}

function isFinesseEligibleMode(selectedMode) {
  return selectedMode === "sprint_40" || selectedMode === "sprint_100" || selectedMode === "ultra";
}

function getLeftmostColumn(piece) {
  let minCol = Infinity;
  for (let r = 0; r < piece.shape.length; r++) {
    for (let c = 0; c < piece.shape[r].length; c++) {
      if (piece.shape[r][c]) {
        const col = piece.x + c;
        if (col < minCol) {
          minCol = col;
        }
      }
    }
  }
  return Number.isFinite(minCol) ? minCol : 0;
}

function computeFinesseActual(piece) {
  if (!piece || !piece.finesseInputs) return { moves: 0, rotations: 0 };
  return {
    moves: piece.finesseInputs.moves || 0,
    rotations: piece.finesseInputs.rotations || 0,
  };
}

// ARS (Arika Rotation System) color scheme
const ARS_COLORS = {
  I: 0xff0000,
  O: 0x0000ff,
  T: 0xffff00,
  S: 0xff00ff, // purple
  Z: 0x00ff00, // green
  L: 0xffa500, // orange
  J: 0x0000ff, // blue
};

const TETROMINOES = {
  I: {
    rotations: [
      [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ], // Rotation 0
      [
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0],
      ], // Rotation 1
      [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
      ], // Rotation 2
      [
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
      ], // Rotation 3
    ],
    color: 0x00ffff,
  },
  O: {
    rotations: [
      [
        [1, 1],
        [1, 1],
      ], // Rotation 0
      [
        [1, 1],
        [1, 1],
      ], // Rotation 1
      [
        [1, 1],
        [1, 1],
      ], // Rotation 2
      [
        [1, 1],
        [1, 1],
      ], // Rotation 3
    ],
    color: 0xffff00,
  },
  S: {
    rotations: [
      [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0],
      ], // Rotation 0
      [
        [0, 1, 0],
        [0, 1, 1],
        [0, 0, 1],
      ], // Rotation 1
      [
        [0, 0, 0],
        [0, 1, 1],
        [1, 1, 0],
      ], // Rotation 2
      [
        [1, 0, 0],
        [1, 1, 0],
        [0, 1, 0],
      ], // Rotation 3
    ],
    color: 0x00ff00,
  },
  Z: {
    rotations: [
      [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0],
      ], // Rotation 0
      [
        [0, 0, 1],
        [0, 1, 1],
        [0, 1, 0],
      ], // Rotation 1
      [
        [0, 0, 0],
        [1, 1, 0],
        [0, 1, 1],
      ], // Rotation 2
      [
        [0, 1, 0],
        [1, 1, 0],
        [1, 0, 0],
      ], // Rotation 3
    ],
    color: 0xff0000,
  },
  J: {
    rotations: [
      [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0],
      ], // Rotation 0
      [
        [0, 1, 1],
        [0, 1, 0],
        [0, 1, 0],
      ], // Rotation 1
      [
        [0, 0, 0],
        [1, 1, 1],
        [0, 0, 1],
      ], // Rotation 2
      [
        [0, 1, 0],
        [0, 1, 0],
        [1, 1, 0],
      ], // Rotation 3
    ],
    color: 0x0000ff,
  },
  L: {
    rotations: [
      [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0],
      ], // Rotation 0
      [
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 1],
      ], // Rotation 1
      [
        [0, 0, 0],
        [1, 1, 1],
        [1, 0, 0],
      ], // Rotation 2
      [
        [1, 1, 0],
        [0, 1, 0],
        [0, 1, 0],
      ], // Rotation 3
    ],
    color: 0xffa500,
  },
  T: {
    rotations: [
      [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0],
      ], // Rotation 0
      [
        [0, 1, 0],
        [0, 1, 1],
        [0, 1, 0],
      ], // Rotation 1
      [
        [0, 0, 0],
        [1, 1, 1],
        [0, 1, 0],
      ], // Rotation 2
      [
        [0, 1, 0],
        [1, 1, 0],
        [0, 1, 0],
      ], // Rotation 3
    ],
    color: 0xff00ff,
  },
};

// OLD (commented out) extended kick tables used previously; retained for fallback/debugging.
// const SRS_KICKS = { ...extended tables... };
// const ARS_KICKS = { ...extended tables... };

// Official Guideline SRS kick tables (5 tests each). O-piece has no kicks.
const SRS_KICKS = {
  JLSTZ_CW: [
    [
      [0, 0],
      [-1, 0],
      [-1, -1],
      [0, 2],
      [-1, 2],
    ], // 0->1
    [
      [0, 0],
      [1, 0],
      [1, 1],
      [0, -2],
      [1, -2],
    ], // 1->2
    [
      [0, 0],
      [1, 0],
      [1, -1],
      [0, 2],
      [1, 2],
    ], // 2->3
    [
      [0, 0],
      [-1, 0],
      [-1, 1],
      [0, -2],
      [-1, -2],
    ], // 3->0
  ],
  JLSTZ_CCW: [
    [
      [0, 0],
      [1, 0],
      [1, -1],
      [0, 2],
      [1, 2],
    ], // 0->3
    [
      [0, 0],
      [1, 0],
      [1, 1],
      [0, -2],
      [1, -2],
    ], // 3->2
    [
      [0, 0],
      [-1, 0],
      [-1, -1],
      [0, 2],
      [-1, 2],
    ], // 2->1
    [
      [0, 0],
      [-1, 0],
      [-1, 1],
      [0, -2],
      [-1, -2],
    ], // 1->0
  ],
  // TGM3 World (SRS) I-piece kicks (y positive downward)
 // TGM3 World (SRS) I-piece kicks (y positive downward)
I_CW: [
  [ [0,0], [-2,0], [1,0], [1,-2], [-2,1] ],      // 0->1 (0->R)
  [ [0,0], [2,0], [-1,0], [2,-1], [-1,2] ],      // 1->2 (R->2)
  [ [0,0], [-1,0], [2,0], [-1,-2], [2,1] ],      // 2->3 (2->L)
  [ [0,0], [-2,0], [1,0], [-2,-1], [1,2] ],      // 3->0 (L->0)
],
I_CCW: [
  [ [0,0], [2,0], [-1,0], [-1,-2], [2,1] ],      // 0->3 (0->L)
  [ [0,0], [1,0], [-2,0], [1,-2], [-2,1] ],      // 3->2 (L->2)
  [ [0,0], [-2,0], [1,0], [-2,-1], [1,2] ],      // 2->1 (2->R)
  [ [0,0], [2,0], [-1,0], [2,-1], [-1,2] ],      // 1->0 (R->0)
],
};

// Minimal-input SRS finesse tables (leftmost column reference, rotations count per final orientation)
// Columns 0-9, rotation index per SRS (0=spawn/up for J/L/S/Z/T, 0=horizontal for I)
const SRS_FINESSE_TABLE = {
  O: {
    0: [1, 1, 2, 1, 0, 1, 2, 1, 1, 1], // moves only, rotation=0 always
  },
  I: {
    // Flat (spawn, rotation 0 or 2 equivalent)
    0: [1, 1, 2, 1, 0, 1, 2, 1, 1, 1],
    // Vertical (rotation 1 or 3 equivalent) includes one rotation
    1: [2, 2, 2, 1, 1, 1, 2, 2, 2, 2], // minMoves (with DAS/taps) + 1 rotation counted separately
    2: [1, 1, 2, 1, 0, 1, 2, 1, 1, 1],
    3: [2, 2, 2, 1, 1, 1, 2, 2, 2, 2],
  },
  T: {
    0: [2, 1, 1, 1, 0, 1, 1, 1, 2, 2],
    1: [2, 1, 1, 1, 1, 1, 1, 1, 2, 2],
    2: [2, 1, 1, 1, 0, 1, 1, 1, 2, 2],
    3: [2, 1, 1, 1, 1, 1, 1, 1, 2, 2],
  },
  L: {
    0: [2, 1, 1, 1, 0, 1, 1, 1, 2, 2],
    1: [2, 1, 1, 1, 1, 1, 1, 1, 2, 2],
    2: [2, 1, 1, 1, 0, 1, 1, 1, 2, 2],
    3: [2, 1, 1, 1, 1, 1, 1, 1, 2, 2],
  },
  J: {
    0: [2, 1, 1, 1, 0, 1, 1, 1, 2, 2],
    1: [2, 1, 1, 1, 1, 1, 1, 1, 2, 2],
    2: [2, 1, 1, 1, 0, 1, 1, 1, 2, 2],
    3: [2, 1, 1, 1, 1, 1, 1, 1, 2, 2],
  },
  S: {
    0: [2, 1, 1, 1, 0, 1, 1, 1, 2, 2],
    1: [2, 1, 1, 1, 1, 1, 1, 1, 2, 2],
  },
  Z: {
    0: [2, 1, 1, 1, 0, 1, 1, 1, 2, 2],
    1: [2, 1, 1, 1, 1, 1, 1, 1, 2, 2],
  },
};

// ARS (Arika Rotation System) kick tables - TGM3 Classic (TGM2 + extra T and I floor kicks), with vertical I wall kicks.
// O-piece has no kicks; T uses the full T_* tables; J/L/S/Z use simplified right/left-only kicks (JLSZ_*); I has its own.
const ARS_KICKS = {
  T_CW: [
    [
      [0, 0],
      [-1, 0],
      [0, -1],
      [-1, -1],
      [0, 1], // extra floor kick for TGM3 (T only benefits in practice)
    ], // 0->1
    [
      [0, 0],
      [1, 0],
      [0, -1],
      [1, -1],
      [0, 1],
    ], // 1->2
    [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
      [0, -1],
    ], // 2->3
    [
      [0, 0],
      [-1, 0],
      [0, 1],
      [-1, 1],
      [0, 1],
    ], // 3->0
  ],
  T_CCW: [
    [
      [0, 0],
      [1, 0],
      [0, -1],
      [1, -1],
      [0, 1],
    ], // 0->3
    [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
      [0, -1],
    ], // 3->2
    [
      [0, 0],
      [-1, 0],
      [0, 1],
      [-1, 1],
      [0, -1],
    ], // 2->1
    [
      [0, 0],
      [-1, 0],
      [0, -1],
      [-1, -1],
      [0, 1],
    ], // 1->0
  ],
  JLSZ_CW: [
    [
      [0, 0],
      [1, 0],
      [-1, 0],
    ], // 0->1
    [
      [0, 0],
      [1, 0],
      [-1, 0],
    ], // 1->2
    [
      [0, 0],
      [1, 0],
      [-1, 0],
    ], // 2->3
    [
      [0, 0],
      [1, 0],
      [-1, 0],
    ], // 3->0
  ],
  JLSZ_CCW: [
    [
      [0, 0],
      [1, 0],
      [-1, 0],
    ], // 0->3
    [
      [0, 0],
      [1, 0],
      [-1, 0],
    ], // 3->2
    [
      [0, 0],
      [1, 0],
      [-1, 0],
    ], // 2->1
    [
      [0, 0],
      [1, 0],
      [-1, 0],
    ], // 1->0
  ],
  I_CW: [
    [
      [0, 0],
      [-1, 0], // vertical wall kick left
      [1, 0], // vertical wall kick right
      [0, -1], // floor kick (TGM3)
      [-2, 0], // legacy ARS side kick
      [1, 2], // legacy ARS upward/right
    ], // 0->1 (horizontal->vertical)
    [
      [0, 0],
      [0, -1], // floor kick
      [0, 1], // soft floor
      [-1, 0],
      [1, 0],
    ], // 1->2 (vertical->horizontal)
    [
      [0, 0],
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ], // 2->3 (horizontal->vertical)
    [
      [0, 0],
      [0, 1],
      [0, -1],
      [1, 0],
      [-1, 0],
    ], // 3->0 (vertical->horizontal)
  ],
  I_CCW: [
    [
      [0, 0],
      [1, 0], // vertical wall kick right
      [-1, 0], // vertical wall kick left
      [0, -1], // floor kick
      [2, 0],
      [-1, 2],
    ], // 0->3 (horizontal->vertical)
    [
      [0, 0],
      [0, -1],
      [0, 1],
      [1, 0],
      [-1, 0],
    ], // 3->2
    [
      [0, 0],
      [-1, 0],
      [1, 0],
      [0, 1],
      [0, -1],
    ], // 2->1
    [
      [0, 0],
      [0, 1],
      [0, -1],
      [-1, 0],
      [1, 0],
    ], // 1->0
  ],
};

function ensureMonochromeMinoTextures(scene) {
  if (!scene || !scene.textures || !scene.add) return;
  const pairs = [
    ["mino_srs", "mono"],
    ["mino_ars", "mono_ars"],
  ];
  pairs.forEach(([sourceKey, targetKey]) => {
    if (scene.textures.exists(targetKey) || !scene.textures.exists(sourceKey)) return;
    const rt = scene.add.renderTexture(0, 0, 64, 64);
    rt.setVisible(false);
    rt.fill(0xffffff, 0);
    rt.draw(sourceKey, 32, 32);
    rt.saveTexture(targetKey);
    rt.destroy();
  });
}

class Board {
  constructor(rows = 22, cols = 10, cellSize = 24, textureKey = "mino_srs") {
    this.rows = rows || 22;
    this.cols = cols || 10;
    this.grid = [];
    for (let i = 0; i < rows; i++) {
      this.grid[i] = Array(cols).fill(0);
    }
    this.fadeGrid = Array.from({ length: rows }, () => Array(cols).fill(0));
    this.frozenGrid = Array.from({ length: rows }, () => Array(cols).fill(false));
  }

  applyMonochromeTextures(scene) {
    const textureKey = scene.rotationSystem === "ARS" ? "mono_ars" : "mono";
    this.currentTextureKey = textureKey;
  }

  clearMonochromeTextures() {
    this.currentTextureKey = null;
  }

  isValidPosition(piece, x, y) {
    for (let r = 0; r < piece.shape.length; r++) {
      for (let c = 0; c < piece.shape[r].length; c++) {
        if (piece.shape[r][c]) {
          const newX = x + c;
          const newY = y + r;
          if (
            newX < 0 ||
            newX >= this.cols ||
            newY >= this.rows ||
            (newY >= 0 && this.grid[newY][newX])
          ) {
            return false;
          }
        }
      }
    }
    return true;
  }

  placePiece(piece, x, y) {
    for (let r = 0; r < piece.shape.length; r++) {
      for (let c = 0; c < piece.shape[r].length; c++) {
        if (piece.shape[r][c]) {
          if (piece.isPowerup && piece.powerupType) {
            this.grid[y + r][x + c] = {
              color: piece.powerupFillColor || piece.color,
              powerupType: piece.powerupType,
              borderColor: piece.powerupColors ? piece.powerupColors[piece.powerupType] : piece.color,
              originalColor: piece.baseColor || piece.color,
            };
          } else if (piece.textureKey) {
            this.grid[y + r][x + c] = {
              color: piece.textureKey.startsWith("mono") ? 0xffffff : piece.color,
              textureKey: piece.textureKey,
              frozen: !!piece.tgm4MasterPikii,
            };
          } else {
            this.grid[y + r][x + c] = piece.tgm4MasterPikii ? { color: piece.color, frozen: true } : piece.color;
          }
          if (this.frozenGrid[y + r]?.[x + c] !== undefined) {
            this.frozenGrid[y + r][x + c] = !!piece.tgm4MasterPikii;
          }
        }
      }
    }
  }

  isFrozenCell(r, c) {
    const cell = this.grid?.[r]?.[c];
    return !!(this.frozenGrid?.[r]?.[c] || cell?.frozen || cell?.pikiiFrozen);
  }

  isFrozenLine(r) {
    return Array.isArray(this.grid?.[r]) && this.grid[r].some((_cell, c) => this.isFrozenCell(r, c));
  }

  setFrozenRows(startRow, endRow, frozen = true, onlyOccupied = true) {
    if (!Array.isArray(this.frozenGrid) || this.frozenGrid.length !== this.rows) {
      this.frozenGrid = Array.from({ length: this.rows }, () => Array(this.cols).fill(false));
    }
    const start = Math.max(0, Math.floor(startRow));
    const end = Math.min(this.rows - 1, Math.floor(endRow));
    for (let r = start; r <= end; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (!onlyOccupied || this.grid[r][c]) {
          this.frozenGrid[r][c] = frozen;
          if (this.grid[r][c] && typeof this.grid[r][c] === "object") {
            this.grid[r][c].pikiiFrozen = frozen;
          }
        }
      }
    }
  }

  clearFrozenRows(startRow, endRow) {
    this.setFrozenRows(startRow, endRow, false, false);
  }

  deleteBottomRow() {
    this.grid.pop();
    this.grid.unshift(Array(this.cols).fill(0));
    this.fadeGrid.pop();
    this.fadeGrid.unshift(Array(this.cols).fill(0));
    if (Array.isArray(this.frozenGrid)) {
      this.frozenGrid.pop();
      this.frozenGrid.unshift(Array(this.cols).fill(false));
    }
  }

  clearLines() {
    const linesToClear = [];
    for (let r = 0; r < this.rows; r++) {
      if (this.grid[r].every((cell) => cell !== 0) && !this.isFrozenLine(r)) {
        linesToClear.push(r);
      }
    }
    linesToClear.forEach((line) => {
      this.grid.splice(line, 1);
      this.grid.unshift(Array(this.cols).fill(0));
      this.fadeGrid.splice(line, 1);
      this.fadeGrid.unshift(Array(this.cols).fill(0));
      if (Array.isArray(this.frozenGrid)) {
        this.frozenGrid.splice(line, 1);
        this.frozenGrid.unshift(Array(this.cols).fill(false));
      }
    });
    return linesToClear.length;
  }

  addCheeseRows(count = 1, cheesePercent = 0) {
    // Initialize grid/fadeGrid if missing to allow early preview insertion
    const cols = Number.isFinite(this.cols) && this.cols > 0 ? this.cols : 10;
    if (!Number.isFinite(this.cols) || this.cols <= 0) {
      this.cols = cols;
    }
    const rowsCount =
      Number.isFinite(this.rows) && this.rows > 0
        ? this.rows
        : Array.isArray(this.grid)
          ? this.grid.length
          : 22;
    if (!Array.isArray(this.grid) || this.grid.length === 0) {
      this.grid = Array.from({ length: rowsCount }, () => Array(cols).fill(0));
    }
    if (!Array.isArray(this.fadeGrid) || this.fadeGrid.length === 0) {
      this.fadeGrid = Array.from({ length: rowsCount }, () => Array(cols).fill(0));
    }
    const rowsToAdd = Math.max(0, Math.floor(count));
    // cheesePercent controls how often the hole shifts: 0 = fixed column, 100 = new hole every row.
    const clampedPercent = Math.max(0, Math.min(100, Number(cheesePercent) || 0));
    const shiftChance = clampedPercent / 100;
    if (!Number.isFinite(this.cheeseHoleShiftAccumulator)) this.cheeseHoleShiftAccumulator = 0;
    // Persist hole across injections; initialize once (shared with scene if available)
    if (!Number.isInteger(this.cheeseHoleCol)) {
      const seeded =
        Number.isInteger(this.scene?.zenCheeseHoleCol) ? this.scene.zenCheeseHoleCol : Math.floor(Math.random() * cols);
      this.cheeseHoleCol = seeded % cols;
      if (this.scene) this.scene.zenCheeseHoleCol = this.cheeseHoleCol;
    }
    let holeCol = this.cheeseHoleCol;
    for (let i = 0; i < rowsToAdd; i++) {
      // Remove top row to make space
      this.grid.shift();
      this.fadeGrid.shift();
      if (Array.isArray(this.frozenGrid)) this.frozenGrid.shift();

      // Decide hole column for this row
      if (clampedPercent > 0) {
        this.cheeseHoleShiftAccumulator += shiftChance;
        if (this.cheeseHoleShiftAccumulator >= 1) {
          this.cheeseHoleShiftAccumulator -= 1;
          let newHole = Math.floor(Math.random() * cols);
          // avoid identical hole when shifting
          if (newHole === holeCol) {
            newHole = (newHole + 1) % cols;
          }
          holeCol = newHole;
          this.cheeseHoleCol = holeCol;
          if (this.scene) this.scene.zenCheeseHoleCol = holeCol;
        }
      }

      const row = [];
      for (let c = 0; c < cols; c++) {
        const isHole = c === holeCol;
        row.push(isHole ? 0 : 0x444444);
      }
      this.grid.push(row);
      this.fadeGrid.push(Array(cols).fill(0));
      if (Array.isArray(this.frozenGrid)) this.frozenGrid.push(Array(cols).fill(false));
    }
    // Play garbage SFX when rows are injected, but only after gameplay has started spawning pieces
    if (rowsToAdd > 0 && this.scene && this.scene.hasSpawnedPiece) {
      if (typeof this.scene.playGarbageSfx === "function") {
        this.scene.playGarbageSfx(rowsToAdd);
      } else if (this.scene.sound) {
        try {
          console.log("[SFX][Board] addCheeseRows fallback play", { rows: rowsToAdd, cheesePercent: clampedPercent });
          this.scene.sound.play("garbage", { volume: 1 });
        } catch {}
      }
    }
  }

  clearAll() {
    for (let r = 0; r < this.rows; r++) {
      this.grid[r] = Array(this.cols).fill(0);
      this.fadeGrid[r] = Array(this.cols).fill(0);
      if (Array.isArray(this.frozenGrid)) this.frozenGrid[r] = Array(this.cols).fill(false);
    }
  }

  draw(scene, offsetX, offsetY, cellSize) {
    // Only draw the visible rows (rows 2-21 of the 22-row matrix)
    const startRow = 2;
    const endRow = Math.min(this.rows, startRow + scene.visibleRows);

    const bigBlocks = !!(scene && scene.bigBlocksActive);
    const drawCellSize = bigBlocks ? cellSize * 2 : cellSize;

    const zenActive = scene?.isZenSandboxActive && scene.isZenSandboxActive();
    for (let r = startRow; r < endRow; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (this.grid[r][c]) {
          let rowAlpha =
            scene.minoRowFadeAlpha && scene.minoRowFadeAlpha[r] !== undefined
              ? scene.minoRowFadeAlpha[r]
              : 1;
          if (scene.strobeActive) {
            const t = scene.creditsActive ? scene.creditsTimer || 0 : scene.currentTime || 0;
            const omega = (2 * Math.PI) / 0.5; // 0.5s cycle
            const phase = t * omega + c * 0.15 + r * 0.07;
            const strobe = 0.25 + 0.75 * (0.5 * (Math.sin(phase) + 1));
            rowAlpha *= strobe;
          }
          if (zenActive) {
            if (!scene.minoFadeActive) {
              // Outside the fade animation, use normal stack dimming (85%)
              rowAlpha = scene.stackAlpha || 0.8;
            } else {
              // During fade: clamp to max 85%, allow reaching 0
              const maxAlpha = scene.stackAlpha || 0.8;
              if (rowAlpha > maxAlpha) rowAlpha = maxAlpha;
              if (rowAlpha < 0) rowAlpha = 0;
            }
          } else if (rowAlpha <= 0) {
            continue;
          }
          if (!zenActive) {
            if (
              scene.fadingRollActive &&
              !scene.invisibleStackActive &&
              this.fadeGrid[r][c] > 0 &&
              (scene.creditsActive ? scene.creditsTimer || 0 : scene.currentTime || 0) >=
                this.fadeGrid[r][c]
            ) {
              continue;
            }
            if (scene.invisibleStackActive) {
              continue;
            }
          }

          const cellVal = this.grid[r][c];
          const isCellObj = cellVal && typeof cellVal === "object";
          const isPowerObj = isCellObj && !!cellVal.powerupType;
          const color = isCellObj ? cellVal.color : cellVal;
          const textureKey = cellVal?.textureKey
            ? cellVal.textureKey
            : scene.rotationSystem === "ARS"
              ? "mino_ars"
              : "mino_srs";
          // Always dim placed stack relative to active piece (even during line clears)
          const baseAlpha = zenActive
            ? rowAlpha // already set to stackAlpha outside fade, or fading value during fade
            : rowAlpha * (scene.stackAlpha || 1);
          const tintColor =
            textureKey.startsWith("mono")
              ? 0xffffff
              : color;
          const hasValidTextureSource =
            !!(scene.textures && scene.textures.exists(textureKey));
          const drawX = offsetX + c * cellSize;
          const drawY = offsetY + (r - startRow) * cellSize;
          // X-ray effect: only render current sweep column (ghost still visible elsewhere)
          if (scene.xrayActive) {
            if (scene.xrayRevealCooldown > 0) {
              continue;
            }
            if (scene.xrayColumn !== c) {
              continue;
            }
          }
          const renderX = bigBlocks ? drawX - cellSize / 2 : drawX;
          const renderY = bigBlocks ? drawY - cellSize / 2 : drawY;

          if (hasValidTextureSource && !isPowerObj) {
            const sprite = scene.add.sprite(renderX, renderY, textureKey);
            sprite.setDisplaySize(drawCellSize, drawCellSize);
            sprite.setTint(tintColor);
            sprite.setAlpha(baseAlpha);
            scene.gameGroup.add(sprite);
          } else {
            const graphics = scene.add.graphics();
            const fillColor = color || 0x010101;
            graphics.fillStyle(fillColor, baseAlpha);
            graphics.fillRect(
              renderX - drawCellSize / 2,
              renderY - drawCellSize / 2,
              drawCellSize,
              drawCellSize,
            );
            if (isPowerObj && cellVal.powerupType) {
              const borderColor = cellVal.borderColor || 0xffffff;
              graphics.lineStyle(2, borderColor, baseAlpha);
              graphics.strokeRect(
                renderX - drawCellSize / 2,
                renderY - drawCellSize / 2,
                drawCellSize,
                drawCellSize,
              );
              graphics.lineStyle(3, borderColor, baseAlpha);
              graphics.fillStyle(borderColor, baseAlpha);
              const cx = drawX;
              const cy = drawY;
              if (cellVal.powerupType === "free_fall") {
                graphics.beginPath();
                graphics.moveTo(cx, cy - cellSize * 0.25);
                graphics.lineTo(cx, cy + cellSize * 0.1);
                graphics.strokePath();
                graphics.fillCircle(cx, cy + cellSize * 0.25, Math.max(1, cellSize * 0.06));
              } else if (cellVal.powerupType === "del_even") {
                const w = cellSize * 0.4;
                const h = cellSize * 0.08;
                graphics.fillRect(cx - w / 2, cy - cellSize * 0.12, w, h);
                graphics.fillRect(cx - w / 2, cy + cellSize * 0.05, w, h);
              }
            }
            scene.gameGroup.add(graphics);
          }
        }
      }
    }
  }

  // End of Board class
}

class Piece {
  constructor(type, rotationSystem = "SRS", initialRotation = 0, textureKey = null) {
    this.type = type;
    this.rotationSystem = rotationSystem;
    this.rotation = initialRotation;
    this.textureKey = textureKey;
    // Use Sega rotations for ARS, SRS rotations for SRS
    const rotations =
      rotationSystem === "ARS"
        ? SEGA_ROTATIONS[type].rotations
        : TETROMINOES[type].rotations;
    this.shape = rotations[initialRotation].map((row) => [...row]); // Start with specified rotation
    // Use ARS colors for ARS mode, SRS colors for SRS mode
    this.color =
      rotationSystem === "ARS" ? ARS_COLORS[type] : TETROMINOES[type].color;
    this.x = 3; // spawn position
    if (this.type === "O") this.x = 4; // Move O piece 1 column to the right
    this.y = 1; // Spawn at rows 18-19 from bottom (equivalent to rows 1-2 from top) - will be overridden in spawnPiece
    this.fractionalY = 0; // For fractional gravity movement
    this.rotation = initialRotation;
    // Finesse tracking (per piece)
    this.finesseInputs = {
      moves: 0, // horizontal moves (DAS start counts as 1, each tap as 1)
      rotations: 0, // rotation key presses
    };
  }

  getRotatedShape() {
    const rotations =
      this.rotationSystem === "ARS"
        ? SEGA_ROTATIONS[this.type].rotations
        : TETROMINOES[this.type].rotations;
    return rotations[this.rotation] || rotations[0]; // Fallback to first rotation
  }

  rotate(board, direction, rotationSystem = "SRS") {
    const rotations =
      rotationSystem === "ARS"
        ? SEGA_ROTATIONS[this.type].rotations
        : TETROMINOES[this.type].rotations;
    const rotationStates = rotations.length;
    const newRotation =
      (this.rotation + direction + rotationStates) % rotationStates; // Proper cycling
    const newShape = rotations[newRotation];

    if (rotationSystem === "ARS") {
      // ARS (Arika Rotation System) implementation
      return this.rotateARS(board, direction, newRotation, newShape);
    } else {
      // SRS (Super Rotation System) implementation
      return this.rotateSRS(board, direction, newRotation, newShape);
    }
  }

  rotateARS(board, direction, newRotation, newShape) {
    if (this.type === "I") {
      // I-piece uses special ARS kick table with wall and floor kicks (TGM3 Classic)
      const isCW = direction === 1;
      const kickTable = isCW ? ARS_KICKS.I_CW : ARS_KICKS.I_CCW;
      const kickTableIndex = this.rotation;

      for (let i = 0; i < kickTable[kickTableIndex].length; i++) {
        const kick = kickTable[kickTableIndex][i];
        const newX = this.x + kick[0];
        const newY = this.y + kick[1];
        if (board.isValidPosition({ shape: newShape }, newX, newY)) {
          this.x = newX;
          this.y = newY;
          this.shape = newShape.map((row) => [...row]);
          this.rotation = newRotation;
          return true;
        }
      }
    } else if (this.type === "O") {
      // O-piece: no kicks in ARS
      if (board.isValidPosition({ shape: newShape }, this.x, this.y)) {
        this.shape = newShape.map((row) => [...row]);
        this.rotation = newRotation;
        return true;
      }
    } else {
      // JLSTZ use ARS kick tables (TGM3 Classic ordering)
      const isCW = direction === 1;
      const kickTable = isCW ? ARS_KICKS.JLSTZ_CW : ARS_KICKS.JLSTZ_CCW;
      const table = kickTable[this.rotation];
      for (let i = 0; i < table.length; i++) {
        const kick = table[i];
        const newX = this.x + kick[0];
        const newY = this.y + kick[1];
        if (board.isValidPosition({ shape: newShape }, newX, newY)) {
          this.x = newX;
          this.y = newY;
          this.shape = newShape.map((row) => [...row]);
          this.rotation = newRotation;
          return true;
        }
      }
    }

    return false;
  }

  rotateSRS(board, direction, newRotation, newShape) {
    const isCW = direction === 1;

    // Select kick tables based on piece type; O-piece has no kicks
    if (this.type === "O") {
      if (board.isValidPosition({ shape: newShape }, this.x, this.y)) {
        this.shape = newShape.map((row) => [...row]);
        this.rotation = newRotation;
        return true;
      }
      return false;
    }

    const kicks =
      this.type === "I"
        ? isCW
          ? SRS_KICKS.I_CW
          : SRS_KICKS.I_CCW
        : isCW
          ? SRS_KICKS.JLSTZ_CW
          : SRS_KICKS.JLSTZ_CCW;

    const kickTable = kicks[this.rotation];

    for (let i = 0; i < kickTable.length; i++) {
      const kick = kickTable[i];
      const newX = this.x + kick[0];
      const newY = this.y + kick[1];
      if (board.isValidPosition({ shape: newShape }, newX, newY)) {
        this.x = newX;
        this.y = newY;
        this.shape = newShape.map((row) => [...row]);
        this.rotation = newRotation;
        return true;
      }
    }
    return false;
  }

  move(board, dx, dy) {
    const newX = this.x + dx;
    const newY = this.y + dy;
    if (board.isValidPosition(this, newX, newY)) {
      this.x = newX;
      this.y = newY;
      this.fractionalY = this.y; // Reset fractional tracking
      return true;
    }
    return false;
  }

  playGroundSound(scene) {
    if (scene && scene.sound && typeof scene.playSfx === "function") {
      scene.playSfx("ground", 0.4);
    }
  }

  isTouchingGround(board) {
    // Check if piece is touching the ground (bottom of stack or matrix bottom)
    // This checks if any part of the piece is at the bottom row or on top of existing blocks
    for (let r = 0; r < this.shape.length; r++) {
      for (let c = 0; c < this.shape[r].length; c++) {
        if (this.shape[r][c]) {
          const boardX = this.x + c;
          const boardY = this.y + r;

          // Check if at bottom of matrix
          if (boardY >= board.rows - 1) {
            return true;
          }

          // Check if block below is occupied (touching stack)
          if (boardY + 1 >= 0 && board.grid[boardY + 1][boardX]) {
            return true;
          }
        }
      }
    }
    return false;
  }

  moveFractional(board, dx, dy) {
    // For fractional movements, we need to track sub-pixel positions
    if (!this.fractionalY) {
      this.fractionalY = this.y;
    }

    this.fractionalY += dy;

    // Only move when we've accumulated a full row
    if (this.fractionalY >= this.y + 1) {
      if (this.move(board, 0, 1)) {
        this.y = Math.floor(this.fractionalY);
        return true;
      }
      return false;
    }
    return true; // Still moving fractionally
  }

  canMoveDown(board) {
    return board.isValidPosition(this, this.x, this.y + 1);
  }

  hardDrop(board) {
    while (this.move(board, 0, 1)) {}
  }

  draw(scene, offsetX, offsetY, cellSize, ghost = false, alpha = 1) {
    const finalAlpha = ghost ? 0.3 : alpha;
    const bigBlocks = !!(scene && scene.bigBlocksActive);
    const drawCellSize = bigBlocks ? cellSize * 2 : cellSize;
    for (let r = 0; r < this.shape.length; r++) {
      for (let c = 0; c < this.shape[r].length; c++) {
        if (this.shape[r][c]) {
          const pieceY = this.y + r;
          // Only draw pieces that are in the visible area (row 2 and below in the 22-row matrix)
          if (pieceY >= 2) {
            const textureKey =
              this.textureKey ||
              (scene.rotationSystem === "ARS"
                ? "mino_ars"
                : "mino_srs");
            const tintColor =
              textureKey.startsWith("mono")
                ? 0xffffff
                : this.color;
            const hasValidTextureSource =
              !!(scene.textures && scene.textures.exists(textureKey));
            const drawX = offsetX + (this.x + c) * cellSize;
            const drawY = offsetY + (pieceY - 2) * cellSize;
            const renderX = bigBlocks ? drawX - cellSize / 2 : drawX;
            const renderY = bigBlocks ? drawY - cellSize / 2 : drawY;
            if (hasValidTextureSource) {
              const sprite = scene.add.sprite(
                renderX,
                renderY,
                textureKey,
              );
              sprite.setDisplaySize(drawCellSize, drawCellSize);
              sprite.setTint(tintColor);
              sprite.setAlpha(finalAlpha);
              scene.gameGroup.add(sprite);
            } else {
              const graphics = scene.add.graphics();
              const fillColor =
                textureKey.startsWith("mono")
                  ? 0xffffff
                  : this.color;
              graphics.fillStyle(fillColor, finalAlpha);
              graphics.fillRect(
                renderX - drawCellSize / 2,
                renderY - drawCellSize / 2,
                drawCellSize,
                drawCellSize,
              );
              scene.gameGroup.add(graphics);
            }
          }
        }
      }
    }
  }

  getGhostPosition(board) {
    const ghost = new Piece(this.type, this.rotationSystem, this.rotation, this.textureKey);
    ghost.x = this.x;
    ghost.y = this.y;
    ghost.hardDrop(board);
    return ghost;
  }
}

function normalizeStartLevel(value, options = {}) {
  const maxLevel =
    typeof options.maxLevel === "number" && Number.isFinite(options.maxLevel)
      ? options.maxLevel
      : 1200;
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) return 0;
  const snapped = Math.round(parsed / 100) * 100;
  return Math.max(0, Math.min(maxLevel, snapped));
}

function getModeGravityLevelCap(mode) {
  if (!mode) return null;
  if (typeof mode.getGravityLevelCap === "function") {
    const cap = Number(mode.getGravityLevelCap());
    if (Number.isFinite(cap)) return cap;
  }
  if (typeof mode.getConfig === "function") {
    const config = mode.getConfig();
    const cap = Number(config?.gravityLevelCap);
    if (Number.isFinite(cap)) return cap;
  }
  return null;
}

function getStartingLevelCapForMode(mode) {
  const gravityCap = getModeGravityLevelCap(mode);
  if (gravityCap !== null && gravityCap <= 999) return 900;
  return 1200;
}

function getConfiguredStartingLevel(maxLevel = 1200) {
  return normalizeStartLevel(localStorage.getItem("startingLevel"), { maxLevel });
}

class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: "MenuScene" });

    this.modeTypes = this.getModeTypesFromManager();

    this.currentModeTypeIndex = 0;
    this.currentSubmodeIndex = 0;

    // UI elements
    this.modeTypeTitle = null;
    this.leftModeTypeArrow = null;
    this.rightModeTypeArrow = null;
    this.upSubmodeArrow = null;
    this.downSubmodeArrow = null;
    this.modeTypeListContainer = null;
    this.submodeTitle = null;
    this.submodeDescription = null;
    this.leaderboardContainer = null;
    this.leaderboardTitle = null;
    this.leaderboardEntries = [];
    this.leaderboardPlaceholder = null;
    this.startButton = null;
    this.settingsButton = null;
    this.settingsBorder = null;
  }

  getModeTypesFromManager() {
    if (typeof getModeManager === "undefined") {
      return [];
    }
    const modeManager = getModeManager();
    return modeManager.getMenuModeTypes();
  }

  create() {
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;
    this.tPieceX = centerX;
    this.tPieceY = centerY - 90;
    this.modeTypes = this.getModeTypesFromManager();

    this.events.off("wake", this.handleMenuWake, this);
    this.events.off("resume", this.handleMenuWake, this);
    this.events.on("wake", this.handleMenuWake, this);
    this.events.on("resume", this.handleMenuWake, this);

    this.events.once("shutdown", () => {
      this.events.off("wake", this.handleMenuWake, this);
      this.events.off("resume", this.handleMenuWake, this);
      if (this.input && this.input.keyboard && this.input.keyboard.removeAllListeners) {
        this.input.keyboard.removeAllListeners();
      }
    });

    // Title
    this.add
      .text(centerX, centerY - 220, "MINO FREEFALL", {
        fontSize: "48px",
        fill: "#ffffff",
        fontFamily: "Courier New",
        fontStyle: "bold",
        shadow: {
          offsetX: 2,
          offsetY: 2,
          color: "#000000",
          blur: 0,
          stroke: true,
          fill: false,
        },
      })
      .setOrigin(0.5);

    this.createMenuUI();
    this.updateMenuDisplay();
    this.setupKeyboardControls();

    createOrUpdateGlobalOverlay(this, { ...this.getOverlayModeInfo(), showMode: false });
  }

  handleMenuWake() {
    if (this.modeTypes.length === 0) {
      this.modeTypes = this.getModeTypesFromManager();
    }
    if (this.modeTypes.length > 0) {
      this.updateMenuDisplay();
    }
  }

  createMenuUI() {
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    // Mode type list container (left side)
    this.modeTypeListContainer = this.add.container(
      centerX - 350,
      centerY - 50,
    );

    // Submode navigation arrows (center)
    this.upSubmodeArrow = this.add
      .text(centerX - 100, centerY + 20, "◀", {
        fontSize: "24px",
        fill: "#888888",
        fontFamily: "Courier New",
      })
      .setOrigin(0.5)
      .setInteractive();

    this.downSubmodeArrow = this.add
      .text(centerX + 100, centerY + 20, "▶", {
        fontSize: "24px",
        fill: "#888888",
        fontFamily: "Courier New",
      })
      .setOrigin(0.5)
      .setInteractive();

    // Submode title and description (center)
    this.submodeTitle = this.add
      .text(centerX, centerY + 20, "", {
        fontSize: "24px",
        fill: "#00ffff",
        fontFamily: "Courier New",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    this.submodeDescription = this.add
      .text(centerX, centerY + 60, "", {
        fontSize: "14px",
        fill: "#cccccc",
        fontFamily: "Courier New",
        wordWrap: { width: 300 },
        align: "center",
      })
      .setOrigin(0.5);

    // Best scores leaderboard (right side)
    const leaderboardBaseX = centerX + 270;
    const leaderboardBaseY = centerY - 80;
    const leaderboardOffsetX = 30;
    const leaderboardOffsetY = 100;
    const leaderboardTitleExtraY = -100;
    this.leaderboardContainer = this.add.container(
      leaderboardBaseX + leaderboardOffsetX,
      leaderboardBaseY + leaderboardOffsetY,
    );

    // Placeholder for modes without leaderboards (e.g., Zen)
    this.leaderboardPlaceholder = this.add
      .text(
        leaderboardBaseX + leaderboardOffsetX,
        leaderboardBaseY + leaderboardOffsetY + 10,
        "Sandbox mode - experiment and have fun! No leaderboards.",
        {
          fontSize: "18px",
          fill: "#cccccc",
          fontFamily: "Courier New",
          align: "center",
          wordWrap: { width: 240 },
        },
      )
      .setOrigin(0.5)
      .setVisible(false);

    // Leaderboard title - anchored relative to the container, pushed further down
    this.leaderboardTitle = this.add
      .text(
        leaderboardBaseX + leaderboardOffsetX,
        leaderboardBaseY + leaderboardOffsetY + leaderboardTitleExtraY,
        "BEST SCORES",
      {
        fontSize: "20px",
        fill: "#ffffff",
        fontFamily: "Courier New",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    // Leaderboard entries will be created dynamically
    this.leaderboardEntries = [];

    // Start button (bottom center)
    this.startButton = this.add
      .text(centerX, centerY + 120, "START GAME", {
        fontSize: "24px",
        fill: "#00ff00",
        fontFamily: "Courier New",
        fontStyle: "bold",
      })
      .setOrigin(0.5)
      .setInteractive();

    this.startButton.on("pointerdown", () => {
      this.startSelectedMode();
    });

    this.startButton.on("pointerover", () => {
      this.startButton.setStyle({ fill: "#ffffff" });
    });

    this.startButton.on("pointerout", () => {
      this.startButton.setStyle({ fill: "#00ff00" });
    });

    // Settings button (bottom with border)
    const buttonWidth = 120;
    const buttonHeight = 40;
    const buttonX = centerX + 200;
    const buttonY = this.cameras.main.height - 60;

    // Create border rectangle
    this.settingsBorder = this.add.graphics();
    this.settingsBorder.lineStyle(2, 0xffffff);
    this.settingsBorder.strokeRect(
      buttonX - buttonWidth / 2,
      buttonY - buttonHeight / 2,
      buttonWidth,
      buttonHeight,
    );

    // Create button text
    this.settingsButton = this.add
      .text(buttonX, buttonY, "Settings", {
        fontSize: "18px",
        fill: "#ffffff",
        fontFamily: "Courier New",
        fontStyle: "bold",
      })
      .setOrigin(0.5)
      .setInteractive();

    this.settingsButton.on("pointerdown", () => {
      this.scene.start("SettingsScene");
    });

    this.settingsButton.on("pointerover", () => {
      this.settingsButton.setStyle({ fill: "#ffff00" });
    });

    this.settingsButton.on("pointerout", () => {
      this.settingsButton.setStyle({ fill: "#ffffff" });
    });

    // Arrow click handlers
    this.upSubmodeArrow.on("pointerdown", () => {
      this.navigateSubmode(-1);
    });

    this.downSubmodeArrow.on("pointerdown", () => {
      this.navigateSubmode(1);
    });

    // Create initial mode type list display
    this.createModeTypeListDisplay();
  }

  updateMenuLayout() {
    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.centerY;

    // Update submode arrows (center)
    if (this.upSubmodeArrow) {
      this.upSubmodeArrow.setPosition(centerX - 100, centerY + 20);
    }
    if (this.downSubmodeArrow) {
      this.downSubmodeArrow.setPosition(centerX + 100, centerY + 20);
    }

    // Update submode title and description (center)
    if (this.submodeTitle) {
      this.submodeTitle.setPosition(centerX, centerY + 20);
    }
    if (this.submodeDescription) {
      this.submodeDescription.setPosition(centerX, centerY + 60);
    }

    // Update mode type list container (left side)
    if (this.modeTypeListContainer) {
      this.modeTypeListContainer.setPosition(centerX - 350, centerY - 50);
    }

    // Update leaderboard container (right side) - keep consistent with creation offsets
    const leaderboardBaseX = centerX + 270;
    const leaderboardBaseY = centerY - 80;
    const leaderboardOffsetX = 30;
    const leaderboardOffsetY = 100;
    const leaderboardTitleOffsetX = 15;
    const leaderboardTitleExtraY = -100;
    if (this.leaderboardContainer) {
      this.leaderboardContainer.setPosition(
        leaderboardBaseX + leaderboardOffsetX,
        leaderboardBaseY + leaderboardOffsetY,
      );
    }
    if (this.leaderboardTitle) {
      this.leaderboardTitle.setPosition(
        leaderboardBaseX + leaderboardTitleOffsetX,
        leaderboardBaseY + leaderboardOffsetY + leaderboardTitleExtraY,
      );
    }

    // Update start button (bottom center)
    if (this.startButton) {
      this.startButton.setPosition(centerX, centerY + 120);
    }

    // Update settings button (bottom with border)
    if (this.settingsButton && this.settingsBorder) {
      const buttonWidth = 120;
      const buttonHeight = 40;
      const buttonX = centerX + 200;
      const buttonY = this.cameras.main.height - 60;

      this.settingsButton.setPosition(buttonX, buttonY);

      // Update border
      this.settingsBorder.clear();
      this.settingsBorder.lineStyle(2, 0xffffff);
      this.settingsBorder.strokeRect(
        buttonX - buttonWidth / 2,
        buttonY - buttonHeight / 2,
        buttonWidth,
        buttonHeight,
      );
    }

    createOrUpdateGlobalOverlay(this, this.getOverlayModeInfo());
  }

  setupKeyboardControls() {
    if (this.input && this.input.keyboard && this.input.keyboard.removeAllListeners) {
      this.input.keyboard.removeAllListeners();
    }

    // Left/Right for submode navigation within selected mode type
    this.input.keyboard.on("keydown-LEFT", () => {
      this.navigateSubmode(-1);
    });

    this.input.keyboard.on("keydown-RIGHT", () => {
      this.navigateSubmode(1);
    });

    // Up/Down for mode type selection (all displayed vertically)
    this.input.keyboard.on("keydown-UP", () => {
      this.navigateModeType(-1);
    });

    this.input.keyboard.on("keydown-DOWN", () => {
      this.navigateModeType(1);
    });

    // Enter to start game
    this.input.keyboard.on("keydown-ENTER", () => {
      this.startSelectedMode();
    });

    // Escape for settings
    this.input.keyboard.on("keydown-ESC", () => {
      this.scene.start("SettingsScene");
    });
  }

  navigateModeType(direction) {
    const numModeTypes = this.modeTypes.length;
    this.currentModeTypeIndex =
      (this.currentModeTypeIndex + direction + numModeTypes) % numModeTypes;
    this.currentSubmodeIndex = 0; // Reset to first submode in new mode type
    this.updateMenuDisplay();
  }

  navigateSubmode(direction) {
    const currentModeType = this.modeTypes[this.currentModeTypeIndex];
    const numSubmodes = currentModeType.modes.length;
    this.currentSubmodeIndex =
      (this.currentSubmodeIndex + direction + numSubmodes) % numSubmodes;
    this.updateMenuDisplay();
  }

  getOverlayModeInfo() {
    const currentModeType = this.modeTypes[this.currentModeTypeIndex];
    const currentSubmode = currentModeType.modes[this.currentSubmodeIndex];
    return buildModeInfo(currentSubmode.id, currentSubmode.name || currentSubmode.id);
  }

  createModeTypeListDisplay() {
    // Clear existing mode type list
    if (this.modeTypeListContainer && this.modeTypeListContainer.removeAll) {
      this.modeTypeListContainer.removeAll(true);
    }

    const modeTypes = this.modeTypes;

    // Create mode type list entries
    modeTypes.forEach((modeType, index) => {
      const modeTypeY = index * 50; // Increased spacing between mode types

      // Mode type name text positioned relative to container
      const modeTypeColor =
        index === this.currentModeTypeIndex
          ? this.getDifficultyColor(modeType.name)
          : "#666666";
      const modeTypeText = this.add
        .text(0, modeTypeY, modeType.name, {
          fontSize: "18px",
          fill: modeTypeColor,
          fontFamily: "Courier New",
          fontStyle: index === this.currentModeTypeIndex ? "bold" : "normal",
        })
        .setOrigin(0, 0.5);

      // Make selected mode type interactive
      if (index === this.currentModeTypeIndex) {
        modeTypeText.setInteractive();
        modeTypeText.on("pointerdown", () => {
          this.currentModeTypeIndex = index;
          this.currentSubmodeIndex = 0; // Reset to first submode
          this.updateMenuDisplay();
        });
      }

      // Add to container
      if (this.modeTypeListContainer && this.modeTypeListContainer.add) {
        this.modeTypeListContainer.add(modeTypeText);
      }
    });
  }

  updateLeaderboardDisplay() {
    if (this.leaderboardEntries && this.leaderboardEntries.length > 0) {
      this.leaderboardEntries.forEach((entry) => {
        Object.values(entry).forEach((t) => t && t.destroy && t.destroy());
      });
    }
    this.leaderboardEntries = [];

    const currentModeType = this.modeTypes[this.currentModeTypeIndex];
    const currentSubmode = currentModeType.modes[this.currentSubmodeIndex];
    const modeId = currentSubmode.id;
    const isPuzzleMode = this.isPuzzleMode(modeId);
    const leaderboard = this.getLeaderboard(modeId);

    if (isPuzzleMode) {
      const entry = leaderboard[0] || {};
      const placeholders = {
        stage: entry.stage || "—",
        completion: entry.completionRate != null ? `${entry.completionRate}%` : "—",
        time: entry.time || "--:--.--",
      };

      const baseX = this.leaderboardContainer.x;
      const baseY = this.leaderboardContainer.y;

      const stageText = this.add
        .text(baseX, baseY - 20, `Best Stage: ${placeholders.stage}`, {
          fontSize: "24px",
          fill: "#ffff00",
          fontFamily: "Courier New",
          fontStyle: "bold",
        })
        .setOrigin(0.5, 0.5);

      const completionText = this.add
        .text(baseX, baseY + 10, `Completion Rate: ${placeholders.completion}`, {
          fontSize: "18px",
          fill: "#ffffff",
          fontFamily: "Courier New",
          fontStyle: "bold",
        })
        .setOrigin(0.5, 0.5);

      const timeText = this.add
        .text(baseX, baseY + 40, `Time Taken: ${placeholders.time}`, {
          fontSize: "18px",
          fill: "#cccccc",
          fontFamily: "Courier New",
          fontStyle: "bold",
        })
        .setOrigin(0.5, 0.5);

      this.leaderboardEntries.push({ stageText, completionText, timeText });
      return;
    }

    const maxEntries = 5;
    const padded = [...leaderboard];
    while (padded.length < maxEntries) padded.push(null);

    const rowHeight = 48;
    const startY =
      this.leaderboardContainer.y - ((maxEntries - 1) * rowHeight) / 2 + 30;

    padded.slice(0, maxEntries).forEach((entry, index) => {
      const y = startY + index * rowHeight;

      const formatted = this.formatLeaderboardEntry(modeId, entry);
      const leftText = this.add
        .text(this.leaderboardContainer.x - 110, y, formatted.left, {
          fontSize: "24px",
          fill: "#ffff00",
          fontFamily: "Courier New",
          fontStyle: "bold",
        })
        .setOrigin(0, 0.5);

      // Stack secondary fields (middle/right) in one column
      const secondaryX = this.leaderboardContainer.x + 40;
      const middleText = this.add
        .text(secondaryX, y - rowHeight * 0.2, formatted.middle, {
          fontSize: "16px",
          fill: "#00ffff",
          fontFamily: "Courier New",
          fontStyle: "bold",
        })
        .setOrigin(0.5, 0.5);

      const rightText = this.add
        .text(secondaryX, y + rowHeight * 0.2, formatted.right, {
          fontSize: "16px",
          fill: "#cccccc",
          fontFamily: "Courier New",
          fontStyle: "bold",
        })
        .setOrigin(0.5, 0.5);

      this.leaderboardEntries.push({ leftText, middleText, rightText });
    });
  }

  updateLeaderboard(modeId) {
    // modeId is accepted for compatibility; display uses current selection
    this.updateLeaderboardDisplay();
  }

  updateMenuDisplay() {
    const currentModeType = this.modeTypes[this.currentModeTypeIndex];
    const currentSubmode = currentModeType.modes[this.currentSubmodeIndex];
    const modeId = currentSubmode.id;

    // Update submode display
    this.submodeTitle.setText(currentSubmode.name);
    this.submodeDescription.setText(currentSubmode.description);

    // Update submode arrows (vertical navigation)
    const numSubmodes = currentModeType.modes.length;
    this.upSubmodeArrow.setStyle({
      fill: this.currentSubmodeIndex > 0 ? "#ffffff" : "#444444",
    });
    this.downSubmodeArrow.setStyle({
      fill: this.currentSubmodeIndex < numSubmodes - 1 ? "#ffffff" : "#444444",
    });

    // Recreate mode type list with updated selection highlighting
    this.createModeTypeListDisplay();

    // Update leaderboard (hide for Zen)
    if (modeId === "zen") {
      if (this.leaderboardEntries && this.leaderboardEntries.length > 0) {
        this.leaderboardEntries.forEach((entry) => {
          Object.values(entry).forEach((t) => t && t.destroy && t.destroy());
        });
      }
      this.leaderboardEntries = [];
      if (this.leaderboardContainer) this.leaderboardContainer.setVisible(false);
      if (this.leaderboardTitle) this.leaderboardTitle.setVisible(false);
      if (this.leaderboardPlaceholder)
        this.leaderboardPlaceholder.setVisible(true);
    } else {
      if (this.leaderboardContainer) this.leaderboardContainer.setVisible(true);
      if (this.leaderboardTitle) this.leaderboardTitle.setVisible(true);
      if (this.leaderboardPlaceholder)
        this.leaderboardPlaceholder.setVisible(false);
      this.updateLeaderboard(currentSubmode.id);
    }

    createOrUpdateGlobalOverlay(this, { ...this.getOverlayModeInfo(), showMode: false });
  }

  startSelectedMode() {
    const currentModeType = this.modeTypes[this.currentModeTypeIndex];
    const currentSubmode = currentModeType.modes[this.currentSubmodeIndex];
    const modeId = currentSubmode.id;
    this.selectedMode = modeId;
    try {
      const rootMgr = this.game && this.game.scene ? this.game.scene : this.scene;
      rootMgr && rootMgr.getScenes && rootMgr.getScenes(true).map((s) => s.scene.key);
      if (this.game && this.game.canvas && this.game.canvas.parentNode) {
        this.game.canvas.parentNode.querySelectorAll("canvas");
      }
    } catch (e) {
      console.warn("[MenuScene] failed to inspect scene state before start", e);
    }

    // Ensure fresh loader/loading/game scenes to avoid stale references causing blank screens
    const rootMgr = this.game && this.game.scene ? this.game.scene : this.scene;
    const recreateScene = (key, ctor) => {
      try {
        if (rootMgr.isActive(key)) {
          rootMgr.stop(key);
        }
        if (rootMgr.getScene(key)) {
          rootMgr.remove(key, true);
        }
        rootMgr.add(key, new ctor(), false);
      } catch (err) {
        console.error(`[MenuScene] failed to recreate scene ${key}`, err);
      }
    };
    recreateScene("AssetLoaderScene", AssetLoaderScene);
    recreateScene("LoadingScreenScene", LoadingScreenScene);
    recreateScene("GameScene", GameScene);

    // Initialize mode manager and load the selected mode
    if (typeof getModeManager === "undefined") {
      console.error(
        "Mode manager not available - make sure mode files are loaded",
      );
      // Fallback to default mode
      this.scene.start("AssetLoaderScene", { mode: "tgm1" });
      return;
    }

    const modeManager = getModeManager();
    const mode = modeManager.getMode(modeId);

    if (!mode) {
      console.error("[MenuScene] Mode not found", { modeId });
      // Still proceed to asset loader so it can fail gracefully or show message
      this.scene.start("AssetLoaderScene", { mode: modeId });
      return;
    }

    this.selectedModeId = modeId;

    // Versus modes route through MatchmakingScene for online pairing
    if (modeId === "versus_guideline" || modeId === "versus_tgm") {
      const queueType = modeId === "versus_tgm" ? "tgm" : "guideline";
      this.scene.start("MatchmakingScene", { queueType });
      return;
    }

    // Start the AssetLoaderScene first; it will continue to LoadingScreenScene -> GameScene
    const startLevelCap = getStartingLevelCapForMode(mode);
    this.scene.start("AssetLoaderScene", {
      mode: modeId,
      gameMode: mode,
      startingLevel: getConfiguredStartingLevel(startLevelCap),
    });
  }

  isPuzzleMode(modeId) {
    return modeId === "tgm3_sakura";
  }

  // Sakura: during Ready/Go, pressing Hold advances sequence (handled by mode)
  advanceSakuraSequenceWithHold() {
    if (
      this.gameMode &&
      typeof this.gameMode.advanceSequenceWithHold === "function" &&
      this.gameMode.isReadyGoActive &&
      this.gameMode.isReadyGoActive()
    ) {
      this.gameMode.advanceSequenceWithHold(this);
    }
  }

  getLeaderboard(modeId) {
    const key = `leaderboard_${modeId}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        console.warn("Failed to parse leaderboard", modeId, e);
      }
    }

    // Fallback: migrate legacy single best score if present
    const legacyKey = `bestScore_${modeId}`;
    const legacyStored = localStorage.getItem(legacyKey);
    if (legacyStored && this.getBestScore) {
      const legacy = this.getBestScore(modeId);
      const migrated = [legacy];
      localStorage.setItem(key, JSON.stringify(migrated));
      return migrated;
    }
    return [];
  }

  saveLeaderboardEntryToModeId(modeId, entry) {
    if ((this.startingLevel || 0) > 0) return;
    const key = `leaderboard_${modeId}`;
    const list = this.getLeaderboard(modeId);
    list.push(entry);
    const deduped = [];
    const seen = new Set();
    list
      .filter(Boolean)
      .sort((a, b) => this.compareEntries(modeId, a, b))
      .forEach((e) => {
        const sig = JSON.stringify({
          time: e.time,
          score: e.score,
          level: e.level,
          grade: e.grade,
          lines: e.lines,
          pps: e.pps,
        });
        if (!seen.has(sig)) {
          seen.add(sig);
          deduped.push(e);
        }
      });
    const capped = deduped.slice(0, this.isPuzzleMode(modeId) ? 1 : 5);
    localStorage.setItem(key, JSON.stringify(capped));
    this.leaderboardSaved = true;
  }

  saveLeaderboardEntry(modeId, entry) {
    this.saveLeaderboardEntryToModeId(modeId, entry);

    const selectedModeId =
      typeof this.selectedMode === "string" && this.selectedMode !== "Mode 1"
        ? this.selectedMode
        : null;

    if (selectedModeId && selectedModeId !== modeId) {
      this.saveLeaderboardEntryToModeId(selectedModeId, entry);
    }
  }

  getGradeValue(grade) {
    const gradeValues = {
      9: 0,
      8: 1,
      7: 2,
      6: 3,
      5: 4,
      4: 5,
      3: 6,
      2: 7,
      1: 8,
      S1: 9,
      S2: 10,
      S3: 11,
      S4: 12,
      S5: 13,
      S6: 14,
      S7: 15,
      S8: 16,
      S9: 17,
      M: 18,
      GM: 19,
    };
    return gradeValues[grade] || 0;
  }

  compareEntries(modeId, a, b) {
    const getVal = (val) => (val === undefined || val === null ? 0 : val);
    const parseNumTime = (t) => {
      if (!t || typeof t !== "string") return Number.POSITIVE_INFINITY;
      const parts = t.split(":");
      if (parts.length !== 2) return Number.POSITIVE_INFINITY;
      const [m, s] = parts;
      const sec = parseFloat(s);
      if (Number.isNaN(sec)) return Number.POSITIVE_INFINITY;
      const minutes = parseInt(m, 10);
      if (Number.isNaN(minutes)) return Number.POSITIVE_INFINITY;
      return minutes * 60 + sec;
    };

    const byGrade = () =>
      this.getGradeValue(getVal(b.grade)) - this.getGradeValue(getVal(a.grade));
    const byDesc = (x, y) => getVal(y) - getVal(x);
    const byAsc = (x, y) => getVal(x) - getVal(y);

    switch (modeId) {
      case "tgm2_normal": // Normal
        return (
          byDesc(a.score, b.score) ||
          byAsc(parseNumTime(a.time), parseNumTime(b.time))
        );
      case "easy_easy": // Easy
        return (
          byDesc(a.hanabi, b.hanabi) ||
          byAsc(parseNumTime(a.time), parseNumTime(b.time))
        );
      case "sprint_40":
      case "sprint_100": // Sprint
        return (
          byAsc(parseNumTime(a.time), parseNumTime(b.time)) ||
          byDesc(a.score, b.score) ||
          byDesc(a.pps, b.pps)
        );
      case "ultra": // Ultra
        return (
          byDesc(a.score, b.score) ||
          byAsc(parseNumTime(a.time), parseNumTime(b.time)) ||
          byDesc(a.pps, b.pps)
        );
      case "marathon": // Marathon
        return (
          byDesc(a.lines, b.lines) ||
          byAsc(parseNumTime(a.time), parseNumTime(b.time)) ||
          byDesc(a.pps, b.pps)
        );
      case "konoha_easy":
      case "konoha_hard": // All Clear
        return (
          byDesc(a.allClears, b.allClears) ||
          byDesc(a.level, b.level) ||
          byAsc(parseNumTime(a.time), parseNumTime(b.time))
        );
      case "tgm1":
      case "tgm2":
      case "tgm_plus":
      case "tgm3":
      case "tgm4":
      case "master_20g":
      case "tadeath":
      case "shirase":
      case "tgm4_rounds":
      case "asuka_easy":
      case "asuka_normal":
      case "asuka_hard": // Master, 20G, Race
        return (
          byGrade() ||
          byDesc(a.level, b.level) ||
          byAsc(parseNumTime(a.time), parseNumTime(b.time))
        );
      case "tgm3_sakura": // Puzzle
        return (
          byDesc(a.stage, b.stage) ||
          byDesc(a.completionRate, b.completionRate) ||
          byAsc(parseNumTime(a.time), parseNumTime(b.time))
        );
      default:
        // Generic: prefer score desc, time asc
        return (
          byDesc(a.score, b.score) ||
          byAsc(parseNumTime(a.time), parseNumTime(b.time))
        );
    }
  }

  formatLeaderboardEntry(modeId, entry) {
    if (!entry) {
      return { left: "—", middle: "—", right: "—" };
    }

    const fmtTime = (t) => t || "--:--.--";
    const fmtNum = (n) => (n === undefined || n === null ? "—" : n.toString());
    const fmtPps = (n) =>
      n === undefined || n === null ? "—" : Number(n).toFixed(2);

    switch (modeId) {
      case "tgm2_normal": // Normal
        return {
          left: fmtNum(entry.score),
          middle: fmtTime(entry.time),
          right: "",
        };
      case "easy_easy": // Easy - Hanabi | Score | Level
      case "easy_hard": // Easy Hard variant
        return {
          left: fmtNum(entry.hanabi || "—"),
          middle: fmtNum(entry.score || "—"),
          right: `L${fmtNum(entry.level || 0)}`,
        };
      case "sprint_40":
      case "sprint_100": // Sprint
        return {
          left: fmtTime(entry.time),
          middle: fmtNum(entry.score),
          right: fmtPps(entry.pps),
        };
      case "ultra": // Ultra
        return {
          left: fmtNum(entry.score),
          middle: fmtTime(entry.time),
          right: fmtPps(entry.pps),
        };
      case "marathon": // Marathon
        return {
          left: fmtNum(entry.lines),
          middle: fmtPps(entry.pps),
          right: fmtTime(entry.time),
        };
      case "konoha_easy":
      case "konoha_hard": // All Clear
        return {
          left: fmtNum(entry.allClears),
          middle: fmtNum(entry.level),
          right: fmtTime(entry.time),
        };
      case "tgm1":
      case "tgm2":
      case "tgm_plus":
      case "tgm3":
      case "tgm4":
      case "master_20g":
      case "tadeath":
      case "shirase":
      case "tgm4_rounds":
      case "asuka_easy":
      case "asuka_normal":
      case "asuka_hard": // Master, 20G, Race
        return {
          left: entry.grade || "9",
          middle: `L${fmtNum(entry.level)}`,
          right: fmtTime(entry.time),
        };
      default:
        return {
          left: fmtNum(entry.score),
          middle: fmtNum(entry.level || ""),
          right: fmtTime(entry.time),
        };
    }
  }

  getBestScore(mode) {
    const key = `bestScore_${mode}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Ensure all required properties exist with fallbacks
        return {
          score: parsed.score || 0,
          level: parsed.level || 0,
          grade: parsed.grade || "9",
          time: parsed.time || "--:--.--",
        };
      } catch (error) {
        console.warn(`Failed to parse stored score for mode ${mode}:`, error);
      }
    }
    return { score: 0, level: 0, grade: "9", time: "--:--.--" };
  }

  // Get difficulty color for a mode type
  getDifficultyColor(modeTypeName) {
    if (typeof getModeManager !== "undefined") {
      const modeManager = getModeManager();
      return (
        modeManager.difficultyColors[modeTypeName.toLowerCase()] || "#ffffff"
      );
    }
    // Fallback colors if mode manager not available
    const fallbackColors = {
      easy: "#00ff00", // green
      standard: "#0088ff", // blue
      master: "#888888", // grey
      "20g": "#ff0000", // red
      race: "#ff8800", // orange
      "all clear": "#ff69b4", // pink
      puzzle: "#8800ff", // purple
    };
    return fallbackColors[modeTypeName.toLowerCase()] || "#ffffff";
  }

  update() {
    // Check for window resize and update layout if needed
    const currentWindowWidth = window.innerWidth;
    const currentWindowHeight = window.innerHeight;

    if (
      this.windowWidth !== currentWindowWidth ||
      this.windowHeight !== currentWindowHeight
    ) {
      this.windowWidth = currentWindowWidth;
      this.windowHeight = currentWindowHeight;
      this.updateMenuLayout();
    }

    // Keep overlay in sync (e.g., in case of external changes)
    if (this.globalOverlayTexts) {
      createOrUpdateGlobalOverlay(this, { ...this.getOverlayModeInfo(), showMode: false });
    }
  }
}

class SettingsScene extends Phaser.Scene {
  constructor() {
    super({ key: "SettingsScene" });
    this.keybindLabels = {};
    this.keybindTexts = {};
    this.listeningForKey = null;
    this.keybindActions = {
      moveLeft: "Move Left",
      moveRight: "Move Right",
      softDrop: "Soft Drop",
      rotateCW: "Rotate CW",
      rotateCW2: "Rotate CW (Alt)",
      rotateCCW: "Rotate CCW",
      rotateCCW2: "Rotate CCW (Alt)",
      rotate180: "Rotate 180",
      hardDrop: "Hard Drop",
      hold: "Hold",
      pause: "Pause",
      menu: "Return to Menu",
      restart: "Restart",
    };

    // Volume controls
    this.mainVolumeLabel = null;
    this.mainVolumeText = null;
    this.mainVolumeSlider = null;
    this.mainVolumeSliderFill = null;
    this.mainVolumeKnob = null;

    this.bgmVolumeLabel = null;
    this.bgmVolumeText = null;
    this.bgmVolumeSlider = null;
    this.bgmVolumeSliderFill = null;
    this.bgmVolumeKnob = null;

    this.sfxVolumeLabel = null;
    this.sfxVolumeText = null;
    this.sfxVolumeSlider = null;
    this.sfxVolumeSliderFill = null;
    this.sfxVolumeKnob = null;

    // ARS lock reset mode toggle
    this.arsResetModeText = null;

    // Timing sliders (frames)
    this.dasLabel = null;
    this.dasText = null;
    this.dasSlider = null;
    this.dasSliderFill = null;
    this.dasSliderKnob = null;
    this.draggingDAS = false;
    this.draggingARR = false;
    this.draggingARE = false;
    this.draggingLineARE = false;
    this.draggingSDF = false;
    this.arrLabel = null;
    this.arrText = null;
    this.arrSlider = null;
    this.arrSliderFill = null;
    this.arrSliderKnob = null;
    this.areLabel = null;
    this.areText = null;
    this.areSlider = null;
    this.areSliderFill = null;
    this.areSliderKnob = null;
    this.lineAreLabel = null;
    this.lineAreText = null;
    this.lineAreSlider = null;
    this.lineAreSliderFill = null;
    this.lineAreSliderKnob = null;
    this.sdfLabel = null;
    this.sdfText = null;
    this.sdfSlider = null;
    this.sdfSliderFill = null;
    this.sdfSliderKnob = null;
    this.startingLevelLabel = null;
    this.startingLevelValueText = null;
    this.startingLevelDownText = null;
    this.startingLevelUpText = null;
    this.forceMRollLabel = null;
    this.forceMRollText = null;

    // Zen sandbox toggles
    this.zenBagText = null;
    this.zenAttackTableText = null;
    this.zenCheeseModeText = null;
    this.zenCheesePercentText = null;
    this.zenCheeseRowsText = null;
    this.zenCheeseIntervalText = null;
    this.zenSpinModeText = null;
    this.zenInfiniteResetsText = null;
    this.settingsTabs = [];
    this.activeSettingsTab = "controls";
    this.settingTabObjects = {};
  }

  preload() {
    const ensureImageTexture = (key, url) => {
      if (this.textures.exists(key)) {
        const existingTexture = this.textures.get(key);
        const src =
          existingTexture && existingTexture.source
            ? existingTexture.source[0]
            : null;
        if (!src || !src.image) {
          this.textures.remove(key);
        }
      }
      if (!this.textures.exists(key)) {
        this.load.image(key, url);
      }
    };

    ensureImageTexture("mino_srs", "img/mino.png");
    ensureImageTexture("mino_ars", "img/minoARS.png");
    ensureImageTexture("mono", "img/mono.png");
    ensureImageTexture("mono_ars", "img/monoARS.png");
  }

  create() {
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;
    this.tPieceX = centerX;
    this.tPieceY = centerY - 35;

    this.events.once("shutdown", () => {
      if (this.input && this.input.keyboard) {
        this.input.keyboard.off("keydown", this.onKeyDown, this);
      }
    });

    createOrUpdateGlobalOverlay(this, { modeLabel: "Mode: —", modeTypeName: "" });

    // Title - moved up 50px
    this.add
      .text(centerX, centerY - 200, "Settings", {
        fontSize: "36px",
        fill: "#ffffff",
        fontFamily: "Courier New",
      })
      .setOrigin(0.5);

    const tabY = centerY - 145;
    this.settingsTabs = [
      { key: "controls", label: "Controls", x: centerX - 330 },
      { key: "handling", label: "Handling", x: centerX - 110 },
      { key: "rotation", label: "Rotation System", x: centerX + 130 },
      { key: "audio", label: "Audio", x: centerX + 350 },
    ].map((tab) => {
      const text = this.add
        .text(tab.x, tabY, tab.label, {
          fontSize: "18px",
          fill: "#ffffff",
          fontFamily: "Courier New",
        })
        .setOrigin(0.5)
        .setInteractive();
      text.on("pointerdown", () => {
        this.setSettingsTab(tab.key);
      });
      return { ...tab, text };
    });

    // Rotation system toggle - moved up 50px
    const rotationSystem = localStorage.getItem("rotationSystem") || "SRS";
    this.rotationText = this.add
      .text(centerX, centerY - 95, `Rotation System: ${rotationSystem}`, {
        fontSize: "24px",
        fill: "#ffffff",
        fontFamily: "Courier New",
      })
      .setOrigin(0.5)
      .setInteractive();

    this.rotationText.on("pointerdown", () => {
      const currentSystem = localStorage.getItem("rotationSystem") || "SRS";
      const newSystem = currentSystem === "SRS" ? "ARS" : "SRS";
      localStorage.setItem("rotationSystem", newSystem);
      this.rotationSystem = newSystem;
      this.rotationText.setText(`Rotation System: ${newSystem}`);
      this.updateRotationSystemDisplay(newSystem);
      this.updateArsResetModeVisibility(newSystem);
    });

    // Add T piece display under rotation system text
    this.rotationSystem = rotationSystem;
    this.tPieceDisplay = this.createTPieceDisplay(this.tPieceX, this.tPieceY, this.rotationSystem);
    // Ensure initial display uses correct texture/tint for current selection
    this.updateRotationSystemDisplay(this.rotationSystem);

    // ARS lock reset mode toggle (only relevant when ARS is selected)
    const arsResetIsMove =
      (localStorage.getItem("arsMoveReset") || "false") === "true";
    // ARS reset label (two-line: label + value)
    this.arsResetLabel = this.add
      .text(centerX, centerY + 55, "ARS Lock Reset", {
        fontSize: "18px",
        fill: "#ffffff",
        fontFamily: "Courier New",
      })
      .setOrigin(0.5);

    this.arsResetModeText = this.add
      .text(
        centerX,
        centerY + 80,
        arsResetIsMove ? "Move (SRS-style)" : "Step (default)",
        {
          fontSize: "18px",
          fill: "#ffffff",
          fontFamily: "Courier New",
        },
      )
      .setOrigin(0.5)
      .setInteractive();
    this.arsResetModeText.on("pointerdown", () => {
      const current = (localStorage.getItem("arsMoveReset") || "false") === "true";
      const next = !current;
      localStorage.setItem("arsMoveReset", next.toString());
      this.updateArsResetModeText(next);
    });
    this.updateArsResetModeVisibility(rotationSystem);

    // Keybind settings - moved to left side
    const keybindsX = centerX;
    const keybindsY = centerY - 95;

    const keybindsHeader = this.add
      .text(keybindsX, keybindsY - 45, "Keybinds (Click to change)", {
        fontSize: "20px",
        fill: "#ffff00",
        fontFamily: "Courier New",
      })
      .setOrigin(0.5);

    let yOffset = keybindsY;
    const spacing = 35;
    const keybindActionKeys = Object.keys(this.keybindActions);
    const keybindRows = Math.ceil(keybindActionKeys.length / 2);

    keybindActionKeys.forEach((action, index) => {
      const columnX = index < keybindRows ? centerX - 290 : centerX + 290;
      yOffset = keybindsY + (index % keybindRows) * spacing;
      // Label
      this.keybindLabels[action] = this.add
        .text(columnX - 25, yOffset, this.keybindActions[action] + ":", {
          fontSize: "18px",
          fill: "#ffffff",
          fontFamily: "Courier New",
        })
        .setOrigin(1, 0.5); // Right-aligned

      // Current keybind
      const currentKey = this.getCurrentKeybind(action);
      this.keybindTexts[action] = this.add
        .text(columnX + 35, yOffset, currentKey, {
          fontSize: "18px",
          fill: "#00ff00",
          fontFamily: "Courier New",
          fontStyle: "bold",
        })
        .setOrigin(0, 0.5)
        .setInteractive(); // Left-aligned

      this.keybindTexts[action].on("pointerdown", () => {
        this.startListeningForKey(action);
      });
    });

    // Volume controls - moved to right side with main volume control
    const volumeX = centerX - 280; // Moved to right
    const volumeY = centerY - 45;

    // Main Volume
    this.mainVolumeLabel = this.add
      .text(volumeX, volumeY - 60, "Master Volume", {
        fontSize: "20px",
        fill: "#ffff00",
        fontFamily: "Courier New",
      })
      .setOrigin(0.5);

    // Main Volume slider background
    const mainSliderX = volumeX;
    const mainSliderY = volumeY - 20;
    const sliderWidth = 200;
    const sliderHeight = 10;

    this.mainVolumeSlider = this.add.graphics();
    this.mainVolumeSlider.fillStyle(0x333333);
    this.mainVolumeSlider.fillRect(
      mainSliderX - sliderWidth / 2,
      mainSliderY - sliderHeight / 2,
      sliderWidth,
      sliderHeight,
    );

    // Main Volume slider fill
    this.mainVolumeSliderFill = this.add.graphics();
    this.mainVolumeSliderFill.fillStyle(0x00ff00);
    this.mainVolumeSliderFill.fillRect(
      mainSliderX - sliderWidth / 2,
      mainSliderY - sliderHeight / 2,
      sliderWidth * this.getMasterVolume(),
      sliderHeight,
    );

    // Main Volume slider knob
    this.mainVolumeKnob = this.add.graphics();
    this.mainVolumeKnob.fillStyle(0xffffff);
    this.mainVolumeKnob.fillCircle(
      mainSliderX - sliderWidth / 2 + sliderWidth * this.getMasterVolume(),
      mainSliderY,
      8,
    );

    // Main Volume percentage text
    this.mainVolumeText = this.add
      .text(
        mainSliderX,
        mainSliderY + 30,
        `${Math.round(this.getMasterVolume() * 100)}%`,
        {
          fontSize: "16px",
          fill: "#ffffff",
          fontFamily: "Courier New",
        },
      )
      .setOrigin(0.5);

    // Make Main slider interactive
    this.mainVolumeSlider.setInteractive(
      new Phaser.Geom.Rectangle(
        mainSliderX - sliderWidth / 2,
        mainSliderY - sliderHeight / 2,
        sliderWidth,
        sliderHeight,
      ),
      Phaser.Geom.Rectangle.Contains,
    );
    this.mainVolumeSlider.on("pointerdown", (pointer) => {
      this.draggingMainVolume = true;
      this.updateMainVolumeFromPointer(pointer);
    });
    this.mainVolumeSlider.on("pointermove", (pointer) => {
      if (pointer.isDown) {
        this.draggingMainVolume = true;
        this.updateMainVolumeFromPointer(pointer);
      }
    });
    this.input.on("pointermove", (pointer) => {
      if (this.draggingMainVolume && pointer.isDown) {
        this.updateMainVolumeFromPointer(pointer);
      }
    });
    this.input.on("pointerup", () => {
      this.draggingMainVolume = false;
    });

    const bgmSliderX = centerX;
    const bgmSliderY = mainSliderY;

    // BGM Volume
    this.bgmVolumeLabel = this.add
      .text(bgmSliderX, volumeY - 60, "BGM Volume", {
        fontSize: "20px",
        fill: "#ffff00",
        fontFamily: "Courier New",
      })
      .setOrigin(0.5);

    // BGM Volume slider background

    this.bgmVolumeSlider = this.add.graphics();
    this.bgmVolumeSlider.fillStyle(0x333333);
    this.bgmVolumeSlider.fillRect(
      bgmSliderX - sliderWidth / 2,
      bgmSliderY - sliderHeight / 2,
      sliderWidth,
      sliderHeight,
    );

    // BGM Volume slider fill
    this.bgmVolumeSliderFill = this.add.graphics();
    this.bgmVolumeSliderFill.fillStyle(0x00ff00);
    this.bgmVolumeSliderFill.fillRect(
      bgmSliderX - sliderWidth / 2,
      bgmSliderY - sliderHeight / 2,
      sliderWidth * this.getBGMVolume(),
      sliderHeight,
    );

    // BGM Volume slider knob
    this.bgmVolumeKnob = this.add.graphics();
    this.bgmVolumeKnob.fillStyle(0xffffff);
    this.bgmVolumeKnob.fillCircle(
      bgmSliderX - sliderWidth / 2 + sliderWidth * this.getBGMVolume(),
      bgmSliderY,
      8,
    );

    // BGM Volume percentage text
    this.bgmVolumeText = this.add
      .text(
        bgmSliderX,
        bgmSliderY + 30,
        `${Math.round(this.getBGMVolume() * 100)}%`,
        {
          fontSize: "16px",
          fill: "#ffffff",
          fontFamily: "Courier New",
        },
      )
      .setOrigin(0.5);

    // Make BGM slider interactive
    this.bgmVolumeSlider.setInteractive(
      new Phaser.Geom.Rectangle(
        bgmSliderX - sliderWidth / 2,
        bgmSliderY - sliderHeight / 2,
        sliderWidth,
        sliderHeight,
      ),
      Phaser.Geom.Rectangle.Contains,
    );
    this.bgmVolumeSlider.on("pointerdown", (pointer) => {
      this.draggingBGMVolume = true;
      this.updateBGMVolumeFromPointer(pointer);
    });
    this.bgmVolumeSlider.on("pointermove", (pointer) => {
      if (pointer.isDown) {
        this.draggingBGMVolume = true;
        this.updateBGMVolumeFromPointer(pointer);
      }
    });
    this.input.on("pointermove", (pointer) => {
      if (this.draggingBGMVolume && pointer.isDown) {
        this.updateBGMVolumeFromPointer(pointer);
      }
    });
    this.input.on("pointerup", () => {
      this.draggingBGMVolume = false;
    });

    const sfxSliderX = centerX + 280;
    const sfxSliderY = mainSliderY;

    // SFX Volume
    this.sfxVolumeLabel = this.add
      .text(sfxSliderX, volumeY - 60, "SFX Volume", {
        fontSize: "20px",
        fill: "#ffff00",
        fontFamily: "Courier New",
      })
      .setOrigin(0.5);

    // SFX Volume slider background

    this.sfxVolumeSlider = this.add.graphics();
    this.sfxVolumeSlider.fillStyle(0x333333);
    this.sfxVolumeSlider.fillRect(
      sfxSliderX - sliderWidth / 2,
      sfxSliderY - sliderHeight / 2,
      sliderWidth,
      sliderHeight,
    );

    // SFX Volume slider fill
    this.sfxVolumeSliderFill = this.add.graphics();
    this.sfxVolumeSliderFill.fillStyle(0x00ff00);
    this.sfxVolumeSliderFill.fillRect(
      sfxSliderX - sliderWidth / 2,
      sfxSliderY - sliderHeight / 2,
      sliderWidth * this.getSFXVolume(),
      sliderHeight,
    );

    // SFX Volume slider knob
    this.sfxVolumeKnob = this.add.graphics();
    this.sfxVolumeKnob.fillStyle(0xffffff);
    this.sfxVolumeKnob.fillCircle(
      sfxSliderX - sliderWidth / 2 + sliderWidth * this.getSFXVolume(),
      sfxSliderY,
      8,
    );

    // SFX Volume percentage text
    this.sfxVolumeText = this.add
      .text(
        sfxSliderX,
        sfxSliderY + 30,
        `${Math.round(this.getSFXVolume() * 100)}%`,
        {
          fontSize: "16px",
          fill: "#ffffff",
          fontFamily: "Courier New",
        },
      )
      .setOrigin(0.5);

    // Make SFX slider interactive
    this.sfxVolumeSlider.setInteractive(
      new Phaser.Geom.Rectangle(
        sfxSliderX - sliderWidth / 2,
        sfxSliderY - sliderHeight / 2,
        sliderWidth,
        sliderHeight,
      ),
      Phaser.Geom.Rectangle.Contains,
    );
    this.sfxVolumeSlider.on("pointerdown", (pointer) => {
      this.draggingSFXVolume = true;
      this.updateSFXVolumeFromPointer(pointer);
    });
    this.sfxVolumeSlider.on("pointermove", (pointer) => {
      if (pointer.isDown) {
        this.draggingSFXVolume = true;
        this.updateSFXVolumeFromPointer(pointer);
      }
    });
    this.input.on("pointermove", (pointer) => {
      if (this.draggingSFXVolume && pointer.isDown) {
        this.updateSFXVolumeFromPointer(pointer);
      }
    });
    this.input.on("pointerup", () => {
      this.draggingSFXVolume = false;
      this.draggingDAS = false;
      this.draggingARR = false;
      this.draggingARE = false;
      this.draggingLineARE = false;
      this.draggingSDF = false;
    });

    // Timing sliders (right column, aligned with master volume)
    const timingX = centerX - 300; // move timing sliders further right of audio sliders
    const timingY = centerY - 95; // so DAS slider center lines up with master volume slider
    const timingSliderWidth = 200;
    const timingSliderHeight = 10;

    // DAS slider
    this.dasLabel = this.add
      .text(timingX, timingY, "DAS (frames)", {
        fontSize: "20px",
        fill: "#ffff00",
        fontFamily: "Courier New",
      })
      .setOrigin(0.5);
    const dasValue = this.getTimingFrames("timing_das_frames", 10);
    const dasSliderY = timingY + 30;

    this.dasSlider = this.add.graphics();
    this.dasSlider.fillStyle(0x333333);
    this.dasSlider.fillRect(
      timingX - timingSliderWidth / 2,
      dasSliderY - timingSliderHeight / 2,
      timingSliderWidth,
      timingSliderHeight,
    );

    this.dasSliderFill = this.add.graphics();
    this.dasSliderFill.fillStyle(0x00ff00);
    this.dasSliderFill.fillRect(
      timingX - timingSliderWidth / 2,
      dasSliderY - timingSliderHeight / 2,
      timingSliderWidth * this.timingToPct(dasValue, 1, 20),
      timingSliderHeight,
    );

    this.dasSliderKnob = this.add.graphics();
    this.dasSliderKnob.fillStyle(0xffffff);
    this.dasSliderKnob.fillCircle(
      timingX - timingSliderWidth / 2 + timingSliderWidth * this.timingToPct(dasValue, 1, 20),
      dasSliderY,
      8,
    );

    this.dasText = this.add
      .text(timingX, dasSliderY + 25, `${dasValue.toFixed(1)}f`, {
        fontSize: "16px",
        fill: "#ffffff",
        fontFamily: "Courier New",
      })
      .setOrigin(0.5);

    this.dasSlider.setInteractive(
      new Phaser.Geom.Rectangle(
        timingX - timingSliderWidth / 2,
        dasSliderY - timingSliderHeight / 2,
        timingSliderWidth,
        timingSliderHeight,
      ),
      Phaser.Geom.Rectangle.Contains,
    );
    this.dasSlider.on("pointerdown", (pointer) => {
      this.draggingDAS = true;
      this.updateDASFromPointer(pointer, { x: timingX, width: timingSliderWidth, y: dasSliderY });
    });
    this.dasSlider.on("pointermove", (pointer) => {
      if (pointer.isDown) {
        this.draggingDAS = true;
        this.updateDASFromPointer(pointer, { x: timingX, width: timingSliderWidth, y: dasSliderY });
      }
    });
    this.input.on("pointermove", (pointer) => {
      if (this.draggingDAS && pointer.isDown) {
        this.updateDASFromPointer(pointer, { x: timingX, width: timingSliderWidth, y: dasSliderY });
      }
    });
    // Initial visual sync for DAS
    this.updateDASDisplay(dasValue, { x: timingX, width: timingSliderWidth, y: dasSliderY });

    // ARR slider
    const arrValue = this.getTimingFrames("timing_arr_frames", 2);
    const arrSliderY = dasSliderY + 70;
    this.arrLabel = this.add
      .text(timingX, arrSliderY - 30, "ARR (frames)", {
        fontSize: "20px",
        fill: "#ffff00",
        fontFamily: "Courier New",
      })
      .setOrigin(0.5);

    this.arrSlider = this.add.graphics();
    this.arrSlider.fillStyle(0x333333);
    this.arrSlider.fillRect(
      timingX - timingSliderWidth / 2,
      arrSliderY - timingSliderHeight / 2,
      timingSliderWidth,
      timingSliderHeight,
    );

    this.arrSliderFill = this.add.graphics();
    this.arrSliderFill.fillStyle(0x00ff00);
    this.arrSliderFill.fillRect(
      timingX - timingSliderWidth / 2,
      arrSliderY - timingSliderHeight / 2,
      timingSliderWidth * this.timingToPct(arrValue, 0, 5),
      timingSliderHeight,
    );

    this.arrSliderKnob = this.add.graphics();
    this.arrSliderKnob.fillStyle(0xffffff);
    this.arrSliderKnob.fillCircle(
      timingX - timingSliderWidth / 2 + timingSliderWidth * this.timingToPct(arrValue, 0, 5),
      arrSliderY,
      8,
    );

    this.arrText = this.add
      .text(timingX, arrSliderY + 25, `${arrValue.toFixed(1)}f`, {
        fontSize: "16px",
        fill: "#ffffff",
        fontFamily: "Courier New",
      })
      .setOrigin(0.5);

    this.arrSlider.setInteractive(
      new Phaser.Geom.Rectangle(
        timingX - timingSliderWidth / 2,
        arrSliderY - timingSliderHeight / 2,
        timingSliderWidth,
        timingSliderHeight,
      ),
      Phaser.Geom.Rectangle.Contains,
    );
    this.arrSlider.on("pointerdown", (pointer) => {
      this.draggingARR = true;
      this.updateARRFromPointer(pointer, { x: timingX, width: timingSliderWidth, y: arrSliderY });
    });
    this.arrSlider.on("pointermove", (pointer) => {
      if (pointer.isDown) {
        this.draggingARR = true;
        this.updateARRFromPointer(pointer, { x: timingX, width: timingSliderWidth, y: arrSliderY });
      }
    });
    this.input.on("pointermove", (pointer) => {
      if (this.draggingARR && pointer.isDown) {
        this.updateARRFromPointer(pointer, { x: timingX, width: timingSliderWidth, y: arrSliderY });
      }
    });
    this.updateARRDisplay(arrValue, { x: timingX, width: timingSliderWidth, y: arrSliderY });

    // ARE slider
    const areValue = this.getTimingFrames("timing_are_frames", 7);
    const areSliderY = arrSliderY + 70;
    this.areLabel = this.add
      .text(timingX, areSliderY - 30, "ARE (frames)", {
        fontSize: "20px",
        fill: "#ffff00",
        fontFamily: "Courier New",
      })
      .setOrigin(0.5);

    this.areSlider = this.add.graphics();
    this.areSlider.fillStyle(0x333333);
    this.areSlider.fillRect(
      timingX - timingSliderWidth / 2,
      areSliderY - timingSliderHeight / 2,
      timingSliderWidth,
      timingSliderHeight,
    );

    this.areSliderFill = this.add.graphics();
    this.areSliderFill.fillStyle(0x00ff00);
    this.areSliderFill.fillRect(
      timingX - timingSliderWidth / 2,
      areSliderY - timingSliderHeight / 2,
      timingSliderWidth * this.timingToPct(areValue, 0, 60),
      timingSliderHeight,
    );

    this.areSliderKnob = this.add.graphics();
    this.areSliderKnob.fillStyle(0xffffff);
    this.areSliderKnob.fillCircle(
      timingX - timingSliderWidth / 2 + timingSliderWidth * this.timingToPct(areValue, 0, 60),
      areSliderY,
      8,
    );

    this.areText = this.add
      .text(timingX, areSliderY + 25, `${areValue.toFixed(0)}f`, {
        fontSize: "16px",
        fill: "#ffffff",
        fontFamily: "Courier New",
      })
      .setOrigin(0.5);

    this.areSlider.setInteractive(
      new Phaser.Geom.Rectangle(
        timingX - timingSliderWidth / 2,
        areSliderY - timingSliderHeight / 2,
        timingSliderWidth,
        timingSliderHeight,
      ),
      Phaser.Geom.Rectangle.Contains,
    );
    this.areSlider.on("pointerdown", (pointer) => {
      this.draggingARE = true;
      this.updateAREFromPointer(pointer, { x: timingX, width: timingSliderWidth, y: areSliderY });
    });
    this.areSlider.on("pointermove", (pointer) => {
      if (pointer.isDown) {
        this.draggingARE = true;
        this.updateAREFromPointer(pointer, { x: timingX, width: timingSliderWidth, y: areSliderY });
      }
    });
    this.input.on("pointermove", (pointer) => {
      if (this.draggingARE && pointer.isDown) {
        this.updateAREFromPointer(pointer, { x: timingX, width: timingSliderWidth, y: areSliderY });
      }
    });
    this.updateAREDisplay(areValue, { x: timingX, width: timingSliderWidth, y: areSliderY });

    // Line ARE / Line Clear Delay slider
    const lineAreValue = this.getTimingFrames("timing_line_are_frames", 7);
    const lineAreX = centerX + 300;
    const lineAreSliderY = dasSliderY;
    this.lineAreLabel = this.add
      .text(lineAreX, lineAreSliderY - 30, "Line ARE / LCD (frames)", {
        fontSize: "20px",
        fill: "#ffff00",
        fontFamily: "Courier New",
      })
      .setOrigin(0.5);

    this.lineAreSlider = this.add.graphics();
    this.lineAreSlider.fillStyle(0x333333);
    this.lineAreSlider.fillRect(
      lineAreX - timingSliderWidth / 2,
      lineAreSliderY - timingSliderHeight / 2,
      timingSliderWidth,
      timingSliderHeight,
    );

    this.lineAreSliderFill = this.add.graphics();
    this.lineAreSliderFill.fillStyle(0x00ff00);
    this.lineAreSliderFill.fillRect(
      lineAreX - timingSliderWidth / 2,
      lineAreSliderY - timingSliderHeight / 2,
      timingSliderWidth * this.timingToPct(lineAreValue, 0, 60),
      timingSliderHeight,
    );

    this.lineAreSliderKnob = this.add.graphics();
    this.lineAreSliderKnob.fillStyle(0xffffff);
    this.lineAreSliderKnob.fillCircle(
      lineAreX - timingSliderWidth / 2 + timingSliderWidth * this.timingToPct(lineAreValue, 0, 60),
      lineAreSliderY,
      8,
    );

    this.lineAreText = this.add
      .text(lineAreX, lineAreSliderY + 25, `${lineAreValue.toFixed(0)}f`, {
        fontSize: "16px",
        fill: "#ffffff",
        fontFamily: "Courier New",
      })
      .setOrigin(0.5);

    this.lineAreSlider.setInteractive(
      new Phaser.Geom.Rectangle(
        lineAreX - timingSliderWidth / 2,
        lineAreSliderY - timingSliderHeight / 2,
        timingSliderWidth,
        timingSliderHeight,
      ),
      Phaser.Geom.Rectangle.Contains,
    );
    this.lineAreSlider.on("pointerdown", (pointer) => {
      this.draggingLineARE = true;
      this.updateLineAREFromPointer(pointer, {
        x: lineAreX,
        width: timingSliderWidth,
        y: lineAreSliderY,
      });
    });
    this.lineAreSlider.on("pointermove", (pointer) => {
      if (pointer.isDown) {
        this.draggingLineARE = true;
        this.updateLineAREFromPointer(pointer, {
          x: lineAreX,
          width: timingSliderWidth,
          y: lineAreSliderY,
        });
      }
    });
    this.input.on("pointermove", (pointer) => {
      if (this.draggingLineARE && pointer.isDown) {
        this.updateLineAREFromPointer(pointer, {
          x: lineAreX,
          width: timingSliderWidth,
          y: lineAreSliderY,
        });
      }
    });
    this.updateLineAREDisplay(lineAreValue, {
      x: lineAreX,
      width: timingSliderWidth,
      y: lineAreSliderY,
    });

    // SDF slider (5x–40x and 20G)
    const sdfDefault = 6; // 6x default
    const sdfValue = this.getStoredTiming("timing_sdf_mult", sdfDefault);
    const sdfSliderY = lineAreSliderY + 70;
    this.sdfLabel = this.add
      .text(lineAreX, sdfSliderY - 30, "SDF (x speed)", {
        fontSize: "20px",
        fill: "#ffff00",
        fontFamily: "Courier New",
      })
      .setOrigin(0.5);

    this.sdfSlider = this.add.graphics();
    this.sdfSlider.fillStyle(0x333333);
    this.sdfSlider.fillRect(
      lineAreX - timingSliderWidth / 2,
      sdfSliderY - timingSliderHeight / 2,
      timingSliderWidth,
      timingSliderHeight,
    );

    this.sdfSliderFill = this.add.graphics();
    this.sdfSliderFill.fillStyle(0x00ff00);
    this.sdfSliderFill.fillRect(
      lineAreX - timingSliderWidth / 2,
      sdfSliderY - timingSliderHeight / 2,
      timingSliderWidth * this.timingToPct(sdfValue, 5, 100),
      timingSliderHeight,
    );

    this.sdfSliderKnob = this.add.graphics();
    this.sdfSliderKnob.fillStyle(0xffffff);
    this.sdfSliderKnob.fillCircle(
      lineAreX - timingSliderWidth / 2 + timingSliderWidth * this.timingToPct(sdfValue, 5, 100),
      sdfSliderY,
      8,
    );

    const sdfDisplay = this.formatSDFDisplay(sdfValue);
    this.sdfText = this.add
      .text(lineAreX, sdfSliderY + 25, sdfDisplay, {
        fontSize: "16px",
        fill: "#ffffff",
        fontFamily: "Courier New",
      })
      .setOrigin(0.5);

    this.sdfSlider.setInteractive(
      new Phaser.Geom.Rectangle(
        lineAreX - timingSliderWidth / 2,
        sdfSliderY - timingSliderHeight / 2,
        timingSliderWidth,
        timingSliderHeight,
      ),
      Phaser.Geom.Rectangle.Contains,
    );
    this.sdfSlider.on("pointerdown", (pointer) => {
      this.draggingSDF = true;
      this.updateSDFFromPointer(pointer, { x: lineAreX, width: timingSliderWidth, y: sdfSliderY });
    });
    this.sdfSlider.on("pointermove", (pointer) => {
      if (pointer.isDown) {
        this.draggingSDF = true;
        this.updateSDFFromPointer(pointer, { x: lineAreX, width: timingSliderWidth, y: sdfSliderY });
      }
    });
    this.input.on("pointermove", (pointer) => {
      if (this.draggingSDF && pointer.isDown) {
        this.updateSDFFromPointer(pointer, { x: lineAreX, width: timingSliderWidth, y: sdfSliderY });
      }
    });
    this.updateSDFDisplay(sdfValue, { x: lineAreX, width: timingSliderWidth, y: sdfSliderY });

    const startLevelY = sdfSliderY + 70;
    this.startingLevelLabel = this.add
      .text(lineAreX, startLevelY - 26, "Starting Level", {
        fontSize: "20px",
        fill: "#ffff00",
        fontFamily: "Courier New",
      })
      .setOrigin(0.5);

    this.startingLevelDownText = this.add
      .text(lineAreX - 90, startLevelY, "<", {
        fontSize: "28px",
        fill: "#ffffff",
        fontFamily: "Courier New",
      })
      .setOrigin(0.5)
      .setInteractive();
    this.startingLevelDownText.on("pointerdown", () => {
      this.adjustStartingLevel(-100);
    });

    this.startingLevelValueText = this.add
      .text(lineAreX, startLevelY, this.getStartingLevelValue().toString().padStart(3, "0"), {
        fontSize: "24px",
        fill: "#00ff00",
        fontFamily: "Courier New",
        fontStyle: "bold",
      })
      .setOrigin(0.5)
      .setInteractive();
    this.startingLevelValueText.on("pointerdown", () => {
      this.adjustStartingLevel(100);
    });

    this.startingLevelUpText = this.add
      .text(lineAreX + 90, startLevelY, ">", {
        fontSize: "28px",
        fill: "#ffffff",
        fontFamily: "Courier New",
      })
      .setOrigin(0.5)
      .setInteractive();
    this.startingLevelUpText.on("pointerdown", () => {
      this.adjustStartingLevel(100);
    });

    const forceMRollY = startLevelY + 60;
    const forceMRollEnabled = this.getForceMRollEnabled();
    this.forceMRollLabel = this.add
      .text(lineAreX, forceMRollY - 24, "Force M-Roll (TGM2 Master)", {
        fontSize: "20px",
        fill: "#ffff00",
        fontFamily: "Courier New",
      })
      .setOrigin(0.5);

    this.forceMRollText = this.add
      .text(lineAreX, forceMRollY, forceMRollEnabled ? "ON" : "OFF", {
        fontSize: "22px",
        fill: forceMRollEnabled ? "#00ff00" : "#ffffff",
        fontFamily: "Courier New",
        fontStyle: "bold",
      })
      .setOrigin(0.5)
      .setInteractive();
    this.forceMRollText.on("pointerdown", () => {
      const next = !this.getForceMRollEnabled();
      localStorage.setItem("forceMRoll", next ? "true" : "false");
      this.updateForceMRollDisplay(next);
    });

    // Reset to defaults button - moved down 70px
    this.resetButton = this.add
      .text(centerX, centerY + 210, "Reset to Defaults", {
        fontSize: "18px",
        fill: "#ff8800",
        fontFamily: "Courier New",
      })
      .setOrigin(0.5)
      .setInteractive();

    this.resetButton.on("pointerdown", () => {
      this.resetKeybindsToDefaults();
    });

    // Reset high scores button - moved down 70px
    this.resetScoresButton = this.add
      .text(centerX, centerY + 255, "Reset High Scores", {
        fontSize: "18px",
        fill: "#ff8800",
        fontFamily: "Courier New",
      })
      .setOrigin(0.5)
      .setInteractive();

    this.resetScoresButton.on("pointerdown", () => {
      this.resetHighScores();
    });

    this.settingTabObjects = {
      controls: [
        keybindsHeader,
        ...Object.values(this.keybindLabels),
        ...Object.values(this.keybindTexts),
      ],
      handling: [
        this.dasLabel,
        this.dasSlider,
        this.dasSliderFill,
        this.dasSliderKnob,
        this.dasText,
        this.arrLabel,
        this.arrSlider,
        this.arrSliderFill,
        this.arrSliderKnob,
        this.arrText,
        this.areLabel,
        this.areSlider,
        this.areSliderFill,
        this.areSliderKnob,
        this.areText,
        this.lineAreLabel,
        this.lineAreSlider,
        this.lineAreSliderFill,
        this.lineAreSliderKnob,
        this.lineAreText,
        this.sdfLabel,
        this.sdfSlider,
        this.sdfSliderFill,
        this.sdfSliderKnob,
        this.sdfText,
        this.startingLevelLabel,
        this.startingLevelDownText,
        this.startingLevelValueText,
        this.startingLevelUpText,
        this.forceMRollLabel,
        this.forceMRollText,
      ],
      rotation: [
        this.rotationText,
        this.tPieceDisplay?.container,
        this.arsResetLabel,
        this.arsResetModeText,
      ],
      audio: [
        this.mainVolumeLabel,
        this.mainVolumeSlider,
        this.mainVolumeSliderFill,
        this.mainVolumeKnob,
        this.mainVolumeText,
        this.bgmVolumeLabel,
        this.bgmVolumeSlider,
        this.bgmVolumeSliderFill,
        this.bgmVolumeKnob,
        this.bgmVolumeText,
        this.sfxVolumeLabel,
        this.sfxVolumeSlider,
        this.sfxVolumeSliderFill,
        this.sfxVolumeKnob,
        this.sfxVolumeText,
      ],
    };
    this.setSettingsTab(this.activeSettingsTab);

    // Back to menu - moved down 70px
    this.backButton = this.add
      .text(centerX, centerY + 310, "Back to Menu", {
        fontSize: "24px",
        fill: "#ffffff",
        fontFamily: "Courier New",
      })
      .setOrigin(0.5)
      .setInteractive();

    this.backButton.on("pointerdown", () => {
      this.scene.start("MenuScene");
    });

    // Setup keyboard input for keybind changes
    this.input.keyboard.on("keydown", this.onKeyDown, this);
  }

  setSettingsTab(tabKey) {
    this.activeSettingsTab = tabKey;
    this.settingsTabs.forEach((tab) => {
      tab.text.setFill(tab.key === tabKey ? "#ffff00" : "#ffffff");
    });
    Object.keys(this.settingTabObjects).forEach((key) => {
      const visible = key === tabKey;
      this.settingTabObjects[key].forEach((object) => {
        if (!object) return;
        if (typeof object.setVisible === "function") object.setVisible(visible);
        if (object.input) object.input.enabled = visible;
      });
    });
    this.updateArsResetModeVisibility(this.rotationSystem);
  }

  getCurrentKeybind(action) {
    const keybinds = this.getKeybinds();
    const keyCode = keybinds[action];

    // Create reverse mapping for key codes to names
    const reverseKeyMap = {};
    Object.keys(Phaser.Input.Keyboard.KeyCodes).forEach((key) => {
      reverseKeyMap[Phaser.Input.Keyboard.KeyCodes[key]] = key;
    });

    const keyName = reverseKeyMap[keyCode];

    const displayMap = {
      LEFT: "←",
      RIGHT: "→",
      UP: "↑",
      DOWN: "↓",
      SPACE: "Space",
      ESC: "Esc",
      ENTER: "Enter",
      SHIFT: "Shift",
      CTRL: "Ctrl",
      ALT: "Alt",
      BACKSPACE: "Backspace",
      TAB: "Tab",
      CAPSLOCK: "Caps Lock",
      NUMLOCK: "Num Lock",
      SCROLLLOCK: "Scroll Lock",
      PAUSE: "Pause",
      INSERT: "Insert",
      HOME: "Home",
      PAGEUP: "Page Up",
      PAGEDOWN: "Page Down",
      END: "End",
      DELETE: "Delete",
    };

    let displayName = displayMap[keyName] || keyName;
    if (!keyName) displayName = "Key " + keyCode;
    return displayName;
  }

  getKeybinds() {
    const defaultKeybinds = {
      moveLeft: Phaser.Input.Keyboard.KeyCodes.Z,
      moveRight: Phaser.Input.Keyboard.KeyCodes.C,
      softDrop: Phaser.Input.Keyboard.KeyCodes.S,
      rotateCW: Phaser.Input.Keyboard.KeyCodes.K,
      rotateCW2: Phaser.Input.Keyboard.KeyCodes.UP,
      rotateCCW: Phaser.Input.Keyboard.KeyCodes.SPACE,
      rotateCCW2: Phaser.Input.Keyboard.KeyCodes.SPACE,
      rotate180: Phaser.Input.Keyboard.KeyCodes.X,
      hold: Phaser.Input.Keyboard.KeyCodes.SHIFT,
      pause: Phaser.Input.Keyboard.KeyCodes.ESC,
      menu: Phaser.Input.Keyboard.KeyCodes.ESC, // Menu and Pause share key
      start: Phaser.Input.Keyboard.KeyCodes.ENTER,
      restart: Phaser.Input.Keyboard.KeyCodes.C,
    };

    const stored = localStorage.getItem("keybinds");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return { ...defaultKeybinds, ...parsed };
      } catch (e) {
        console.error("Failed to parse stored keybinds:", e);
      }
    }

    return defaultKeybinds;
  }

  isZenSandboxActive() {
    const modeId =
      (this.gameMode && typeof this.gameMode.getModeId === "function"
        ? this.gameMode.getModeId()
        : this.selectedMode) || "";
    const modeIdLower = typeof modeId === "string" ? modeId.toLowerCase() : "";
    const isZen = modeIdLower.includes("zen");
    if (isZen && !this.zenSandboxConfig && typeof ZenSandboxHelper !== "undefined") {
      // Lazy-load config so Zen behavior remains active even if sandbox config was not preloaded
      this.zenSandboxConfig = ZenSandboxHelper.loadConfig?.() || this.zenSandboxConfig;
      if (ZenSandboxHelper.resetRuntime) {
        ZenSandboxHelper.resetRuntime(this, this.zenSandboxConfig);
      }
    }
    return isZen;
  }

  tickZenCheese(deltaSeconds = 0) {
    if (!this.isZenSandboxActive || !this.isZenSandboxActive()) return;
    if (!this.zenSandboxConfig) return;
    if (!this.board) return;
    if (this.isPaused) return;
    const { cheeseMode, cheeseInterval, cheesePercent } = this.zenSandboxConfig;
    if (cheeseMode !== "fixed_timing") return;
    const interval = Math.max(0.1, Number(cheeseInterval) || 0.1);
    const rows = 1; // spawn one line at a time for timed injections
    const percent = Math.max(0, Math.min(100, Number(cheesePercent) || 0));
    this.zenCheeseTimer = (this.zenCheeseTimer || 0) + deltaSeconds;
    if (this.zenCheeseTimer >= interval) {
      this.board.addCheeseRows(rows, percent);
      this.playGarbageSfx?.(rows);
      this.zenCheeseTimer = 0;
    }
  }

  applyZenCheeseRows(trigger, clearedCount = 0) {
    if (!this.board || !this.zenSandboxConfig) return;
    const { cheeseMode } = this.zenSandboxConfig;
    if (cheeseMode !== "fixed_rows") return;
    this.ensureZenCheeseBaseline(trigger === "line_clear" ? clearedCount : 0);
  }

  ensureZenCheeseBaseline(clearedCount = 0) {
    if (!this.board || !this.zenSandboxConfig) return;
    const { cheeseMode, cheeseRows, cheesePercent } = this.zenSandboxConfig;
    if (cheeseMode !== "fixed_rows") return;
    // Ensure board grids exist so cheese rows can be injected (e.g., immediately on mode start)
    if (!Array.isArray(this.board.grid) || this.board.grid.length === 0) {
      const rowsCount =
        Number.isFinite(this.board.rows) && this.board.rows > 0 ? this.board.rows : 22;
      const cols = Number.isFinite(this.board.cols) && this.board.cols > 0 ? this.board.cols : 10;
      this.board.grid = Array.from({ length: rowsCount }, () => Array(cols).fill(0));
      this.board.fadeGrid = Array.from({ length: rowsCount }, () => Array(cols).fill(0));
      this.board.rows = rowsCount;
      this.board.cols = cols;
    }
    const rowsTarget = Math.max(1, Math.floor(Number(cheeseRows) || 1));
    const percent = Math.max(0, Math.min(100, Number(cheesePercent) || 0));
    const bottomGarbage = this.countBottomCheeseRows();
    const missing = Math.max(0, rowsTarget - bottomGarbage);
    // Use Board API to append rows; do not overwrite existing bottom rows
    if (missing > 0 && typeof this.board.addCheeseRows === "function") {
      this.board.addCheeseRows(missing, percent);
    }
  }

  countCheeseRows() {
    if (!this.board || !Array.isArray(this.board.grid)) return 0;
    return this.board.grid.reduce((acc, row) => {
      if (!row || row.length === 0) return acc;
      const allGarbageOrEmpty = row.every((cell) => cell === 0 || cell === 0x444444);
      const hasGarbageBlock = row.some((cell) => cell === 0x444444);
      return acc + (allGarbageOrEmpty && hasGarbageBlock ? 1 : 0);
    }, 0);
  }

  // Counts consecutive garbage rows from the bottom, stopping at the first non-garbage row.
  countBottomCheeseRows() {
    if (!this.board || !Array.isArray(this.board.grid)) return 0;
    let bottomGarbage = 0;
    for (let r = this.board.grid.length - 1; r >= 0; r--) {
      const row = this.board.grid[r];
      if (!row || row.length === 0) break;
      const allGarbageOrEmpty = row.every((cell) => cell === 0 || cell === 0x444444);
      const hasGarbageBlock = row.some((cell) => cell === 0x444444);
      if (allGarbageOrEmpty && hasGarbageBlock) {
        bottomGarbage += 1;
      } else {
        break;
      }
    }
    return bottomGarbage;
  }

  // Hard writer for fixed_rows: directly set bottom rows to garbage with a sliding hole.
  setFixedRowsCheeseBaseline(rowsTarget = 1, percent = 0) {
    if (!this.board) return;
    const rows = Math.max(1, Math.floor(Number(rowsTarget) || 1));
    const cols = Number.isFinite(this.board.cols) && this.board.cols > 0 ? this.board.cols : 10;
    if (!Array.isArray(this.board.grid) || this.board.grid.length === 0) {
      this.board.grid = Array.from({ length: rows }, () => Array(cols).fill(0));
    }
    for (let i = 0; i < rows; i++) {
      const rowIdx = this.board.grid.length - 1 - i;
      if (rowIdx < 0) break;
      if (clampedPercent > 0) {
        this.cheeseHoleShiftAccumulator += shiftChance;
        if (this.cheeseHoleShiftAccumulator >= 1) {
          this.cheeseHoleShiftAccumulator -= 1;
          let newHole = Math.floor(Math.random() * cols);
          if (newHole === this.zenCheeseHoleCol) newHole = (newHole + 1) % cols;
          this.zenCheeseHoleCol = newHole;
          if (this.board) this.board.cheeseHoleCol = this.zenCheeseHoleCol;
        }
      }
      this.board.grid[rowIdx] = Array.from({ length: cols }, (_v, c) =>
        c === this.zenCheeseHoleCol ? 0 : 0x444444,
      );
      if (Array.isArray(this.board.fadeGrid) && this.board.fadeGrid[rowIdx]) {
        this.board.fadeGrid[rowIdx] = Array(cols).fill(0);
      }
    }
  }

  playGarbageSfx(lines = 1) {
    if (!this.sound) return;
    const masterVol =
      typeof this.getMasterVolumeSetting === "function" ? this.getMasterVolumeSetting() : 1;
    const sfxVol =
      typeof this.getSFXVolumeSetting === "function" ? this.getSFXVolumeSetting() : 1;
    const volume = 1 * masterVol * sfxVol;
    try {
      // Use dedicated instance so it layers over other SFX (e.g., next-piece sounds)
      const sfx = this.sound.add("garbage", { volume, detune: 0, rate: 1 });
      sfx?.once?.("complete", () => {
        try {
          sfx.destroy();
        } catch {}
      });
      sfx?.play();
    } catch (err) {
      // ignore SFX errors
    }
  }

  handleZenTopout() {
    if (!this.isZenSandboxActive()) {
      return;
    }
    if (this.zenTopoutCooldown) {
      // If cooldown is stuck without a pending finish, clear it and proceed
      if (!this.zenTopoutPendingFinish) {
        this.zenTopoutCooldown = false;
      } else {
        // If cooldown is active but a finish is pending, force-complete to break the stall
        this.finishZenTopout("reenter_force_finish");
        return;
      }
    }
    this.zenTopoutFreezeLogged = false;
    this.zenTopoutCooldown = true;
    this.zenTopoutFreezeActive = true;
    this.zenTopoutPendingFinish = true;
    // Preempt any default GAME OVER handling while Zen recovery is in progress
    this.suppressGameOverOnce = true;
    this.zenTopoutFreezeStart = this.time?.now || Date.now();
    // Stop interacting with the current piece to avoid lock loops during the delay
    this.currentPiece = null;
    this.isGrounded = false;
    this.lockDelay = 0;
    this.lockResetCount = 0;
    this.lineClearDelayActive = false;
    this.lineClearDelayDuration = 0;
    this.pendingLineAREDelay = 0;
    this.areActive = false;
    this.lineClearPhase = false;
    this.gravityAccum = 0;

    // Delay full board reset + respawn to satisfy the 2s topout pause.
    // Fallbacks:
    // - Phaser timer (preferred)
    // - window.setTimeout (safety) to avoid softlock if timer system is paused/missing
    if (this.time && typeof this.time.delayedCall === "function") {
      this.time.delayedCall(2000, () => {
        if (typeof this.finishZenTopout === "function") {
          this.finishZenTopout("timer");
        }
      });
    } else {
      if (typeof this.finishZenTopout === "function") {
        this.finishZenTopout("no_timer");
      }
    }
    if (typeof window !== "undefined" && typeof window.setTimeout === "function") {
      window.setTimeout(() => {
        if (this.zenTopoutPendingFinish && typeof this.finishZenTopout === "function") {
          this.finishZenTopout("window_fallback");
        }
      }, 2200);
    }
  }

  // Emergency: immediate topout recovery without relying on timers/flags
  forceZenTopoutImmediate(reason = "fallback") {
    try {
      console.warn("[ZenTopout] force immediate", { reason });
      // Clear board
      if (this.board) {
        if (typeof this.board.clearAll === "function") {
          this.board.clearAll();
        } else if (Array.isArray(this.board.grid) && Array.isArray(this.board.fadeGrid)) {
          for (let r = 0; r < this.board.rows; r++) {
            this.board.grid[r] = Array(this.board.cols).fill(0);
            this.board.fadeGrid[r] = Array(this.board.cols).fill(0);
          }
        }
        this.ensureZenCheeseBaseline?.(0);
      }
      this.clearedLines = [];
      this.pendingPowerup = null;
      this.minoRowFadeAlpha = {};
      this.minoFadeActive = false;
      this.fadingComplete = false;
      this.gameOverFadeDoneTime = null;
      this.zenTopoutCooldown = false;
      this.zenTopoutFreezeActive = false;
      this.zenTopoutPendingFinish = false;
      this.suppressGameOverOnce = false;
      this.currentPiece = null;
      this.isGrounded = false;
      if (this.nextPieces.length < 6) this.generateNextPieces();
      this.spawnPiece();
    } catch (err) {
      try {
        console.error("[ZenTopout] force immediate error", err);
      } catch {}
      this.zenTopoutCooldown = false;
      this.zenTopoutFreezeActive = false;
      this.zenTopoutPendingFinish = false;
    }
  }

  finishZenTopout(reason = "timer") {
    if (!this.zenTopoutPendingFinish) {
      return;
    }
    try {
      this.zenTopoutPendingFinish = false;
      // Ensure GAME OVER state is cleared for Zen recovery
      this.gameOver = false;
      this.showGameOverText = false;
      this.gameOverTextTimer = 0;
      this.gameOverSfxPlayed = true;
      this.gameOverFadeDoneTime = null;

      // Clear board and reset transient states
      if (this.board) {
        if (typeof this.board.clearAll === "function") {
          this.board.clearAll();
        } else if (Array.isArray(this.board.grid) && Array.isArray(this.board.fadeGrid)) {
          for (let r = 0; r < this.board.rows; r++) {
            this.board.grid[r] = Array(this.board.cols).fill(0);
            this.board.fadeGrid[r] = Array(this.board.cols).fill(0);
          }
        }
        // Reapply fixed garbage baseline after topout
        this.ensureZenCheeseBaseline(0);
      }
      this.playSfx?.("fall");
      this.clearedLines = [];
      this.pendingPowerup = null;
      this.minoRowFadeAlpha = {};
      this.minoFadeActive = false;
      this.fadingComplete = false;
      this.gameOverFadeDoneTime = null;

      // Allow new spawns and reset cooldown
      this.zenTopoutCooldown = false;
      this.zenTopoutFreezeActive = false;
      this.suppressGameOverOnce = false;
      this.currentPiece = null;
      this.isGrounded = false;
      // Ensure next queue exists
      if (this.nextPieces.length < 6) {
        this.generateNextPieces();
      }
      // Immediately respawn a fresh piece to recover from topout
      this.spawnPiece();
    } catch (err) {
      // Hard fail-safe: reset cooldown so next update can attempt normal spawn path
      this.zenTopoutCooldown = false;
      this.zenTopoutFreezeActive = false;
      this.zenTopoutPendingFinish = false;
      this.currentPiece = null;
    }
  }

  isZenInfiniteResets() {
    return this.isZenSandboxActive() && this.zenSandboxConfig?.movementResetsInfinite;
  }

  // ... rest of the code remains the same ...
  getZenSpinMode() {
    if (!this.isZenSandboxActive()) return "standard";
    return this.zenSandboxConfig?.spinType || "standard";
  }

  getZenGravityRowsPerSecond(deltaSeconds = 0) {
    if (!this.zenSandboxConfig) return null;
    this.zenGravityTime = (this.zenGravityTime || 0) + (deltaSeconds || 0);
    const cfg = this.zenSandboxConfig;
    const mode = cfg.gravityMode || "none";
    if (mode === "none") return 0;
    if (mode === "static") {
      const rowsPerFrame = Number(cfg.gravityRowsPerFrame || 0) || 0;
      return rowsPerFrame * 60;
    }
    // time-based presets with 30s steps
    const elapsed = this.zenGravityTime || 0;
    const steps = Math.floor(elapsed / 30);
    const presets = {
      minimal: { base: 0.4, inc: 0 }, // constant gentle gravity
      slow: { base: 0.3, inc: 0.1 },
      medium: { base: 0.6, inc: 0.2 },
      fast: { base: 1.2, inc: 0.4 },
    };
    const sel = presets[mode] || presets.minimal;
    const rowsPerSecond = sel.base + steps * sel.inc;
    return Math.min(rowsPerSecond, 20); // clamp to avoid runaway
  }

  getGuidelineAttack(lines, spinInfo, isAllClear, prevBackToBack) {
    const isSpin = !!(spinInfo && spinInfo.isSpin);
    const spinType = spinInfo ? spinInfo.spinType : null;
    const isMini = spinType && spinType.includes("mini");
    // Base attack table for non-spins
    const baseTable = [0, 0, 1, 2, 4]; // 0-4 lines

    let base = 0;
    if (isSpin) {
      if (isMini) {
        base = lines === 2 ? 1 : 0; // mini double = 1, mini single = 0
      } else {
        base = 2 * lines; // tspin clears: 2x lines
      }
    } else {
      base = baseTable[lines] || 0;
    }

    const isDifficult = (lines >= 4 || (isSpin && lines > 0)) && lines > 0;
    const b2bBonus = prevBackToBack && isDifficult ? 1 : 0;
    const allClearBonus = isAllClear ? 10 : 0;

    // Combo additive table (0-indexed by combo count)
    const comboCount = Math.max(0, this.comboCount || 0);
    const comboTable = [0, 0, 1, 1, 2, 2, 2, 3, 3, 3, 3, 3, 3];
    const comboBonus = comboCount < comboTable.length ? comboTable[comboCount] : 4;

    const attack = base + b2bBonus + allClearBonus + comboBonus;

    // B2B chain bookkeeping (reuse existing rules)
    const prevChain = this.b2bChainCount ?? -1;
    let newChain = prevChain;
    let b2bBroken = false;
    if (isDifficult) {
      if (prevChain < 0) {
        newChain = 0; // first difficult clear starts chain at 0
      } else {
        newChain = b2bBonus ? prevChain + 1 : 1;
      }
    } else {
      if (lines > 0) {
        if (prevBackToBack) {
          b2bBroken = true;
        }
        newChain = -1;
      } else {
        newChain = prevChain; // no clear does not break chain
      }
    }
    this.b2bChainCount = newChain;

    return {
      attack,
      isDifficult,
      b2bMaintained: !!b2bBonus,
      b2bBroken,
      prevChain,
      newChain,
    };
  }

  startListeningForKey(action) {
    if (!this.keybindTexts[action]) return;
    if (this.listeningForKey && this.keybindTexts[this.listeningForKey]) {
      this.keybindTexts[this.listeningForKey].setText(this.getCurrentKeybind(this.listeningForKey));
      this.keybindTexts[this.listeningForKey].setStyle({ fill: "#00ff00" });
    }
    this.listeningForKey = action;
    this.keybindTexts[action].setText("Press key...");
    this.keybindTexts[action].setStyle({ fill: "#ffff00" });
  }

  onKeyDown(event) {
    if (this.listeningForKey) {
      const action = this.listeningForKey;
      const keyCode = event.keyCode;

      // Save the new keybind
      const keybinds = this.getKeybinds();
      keybinds[action] = keyCode;
      localStorage.setItem("keybinds", JSON.stringify(keybinds));

      // Update display using the same method as getCurrentKeybind
      const currentKey = this.getCurrentKeybind(action);
      this.keybindTexts[action].setText(currentKey);
      this.keybindTexts[action].setStyle({ fill: "#00ff00" });

      this.listeningForKey = null;
    }
  }

  resetKeybindsToDefaults() {
    localStorage.removeItem("keybinds");
    localStorage.removeItem("masterVolume");
    localStorage.removeItem("timing_das_frames");
    localStorage.removeItem("timing_arr_frames");
    localStorage.removeItem("timing_are_frames");
    localStorage.removeItem("timing_line_are_frames");
    localStorage.removeItem("timing_sdf_mult");
    localStorage.removeItem("startingLevel");
    localStorage.removeItem("forceMRoll");
    // Refresh all keybind displays
    Object.keys(this.keybindActions).forEach((action) => {
      const currentKey = this.getCurrentKeybind(action);
      this.keybindTexts[action].setText(currentKey);
    });
    // Reset volume display
    this.updateVolumeDisplay();
    // Reset timing displays
    this.updateDASDisplay(10, {
      x: this.dasSlider ? this.dasSlider.getBounds().centerX : 0,
      width: this.dasSlider ? this.dasSlider.getBounds().width : 200,
      y: this.dasSlider ? this.dasSlider.getBounds().centerY : 0,
    });
    this.updateARRDisplay(2, {
      x: this.arrSlider ? this.arrSlider.getBounds().centerX : 0,
      width: this.arrSlider ? this.arrSlider.getBounds().width : 200,
      y: this.arrSlider ? this.arrSlider.getBounds().centerY : 0,
    });
    this.updateAREDisplay(7, {
      x: this.areSlider ? this.areSlider.getBounds().centerX : 0,
      width: this.areSlider ? this.areSlider.getBounds().width : 200,
      y: this.areSlider ? this.areSlider.getBounds().centerY : 0,
    });
    this.updateLineAREDisplay(7, {
      x: this.lineAreSlider ? this.lineAreSlider.getBounds().centerX : 0,
      width: this.lineAreSlider ? this.lineAreSlider.getBounds().width : 200,
      y: this.lineAreSlider ? this.lineAreSlider.getBounds().centerY : 0,
    });
    this.updateSDFDisplay(6, {
      x: this.sdfSlider ? this.sdfSlider.getBounds().centerX : 0,
      width: this.sdfSlider ? this.sdfSlider.getBounds().width : 200,
      y: this.sdfSlider ? this.sdfSlider.getBounds().centerY : 0,
    });
    this.updateStartingLevelDisplay(0);
    this.updateForceMRollDisplay(false);
  }

  getStartingLevelValue() {
    return getConfiguredStartingLevel();
  }

  updateStartingLevelDisplay(value = this.getStartingLevelValue()) {
    if (this.startingLevelValueText) {
      this.startingLevelValueText.setText(value.toString().padStart(3, "0"));
    }
  }

  adjustStartingLevel(delta) {
    const current = this.getStartingLevelValue();
    const next = normalizeStartLevel(current + delta, { maxLevel: 1200 });
    localStorage.setItem("startingLevel", String(next));
    this.updateStartingLevelDisplay(next);
  }

  getForceMRollEnabled() {
    return (localStorage.getItem("forceMRoll") || "false") === "true";
  }

  updateForceMRollDisplay(enabled = this.getForceMRollEnabled()) {
    if (!this.forceMRollText) return;
    this.forceMRollText.setText(enabled ? "ON" : "OFF");
    this.forceMRollText.setFill(enabled ? "#00ff00" : "#ffffff");
  }

  // Volume control methods
  getMasterVolume() {
    const volume = localStorage.getItem("masterVolume");
    return volume ? parseFloat(volume) : 1.0;
  }

  getBGMVolume() {
    const volume = localStorage.getItem("bgmVolume");
    return volume ? parseFloat(volume) : 1.0;
  }

  getSFXVolume() {
    const volume = localStorage.getItem("sfxVolume");
    return volume ? parseFloat(volume) : 1.0;
  }

  setMasterVolume(volume) {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    localStorage.setItem("masterVolume", clampedVolume.toString());
    this.updateMainVolumeDisplay();
    this.applyEffectiveVolumes();
  }

  setBGMVolume(volume) {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    localStorage.setItem("bgmVolume", clampedVolume.toString());
    this.updateBGMVolumeDisplay();
    this.applyEffectiveVolumes();
  }

  setSFXVolume(volume) {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    localStorage.setItem("sfxVolume", clampedVolume.toString());
    this.updateSFXVolumeDisplay();
    this.applyEffectiveVolumes();
  }

  applyEffectiveVolumes() {
    // SettingsScene adjusts the global sound manager (master only)
    const master = this.getMasterVolume();
    if (this.sound && typeof this.sound.setVolume === "function") {
      this.sound.setVolume(master);
    }
  }

  updateMainVolumeFromPointer(pointer) {
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;
    const sliderX = centerX - 280; // Main slider X position
    const sliderWidth = 200;
    const sliderY = centerY - 65; // Match slider draw position

    // Calculate volume based on pointer position
    const relativeX = pointer.x - (sliderX - sliderWidth / 2);
    const volume = Math.max(0, Math.min(1, relativeX / sliderWidth));

    this.setMasterVolume(volume);
  }

  updateBGMVolumeFromPointer(pointer) {
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;
    const sliderX = centerX; // BGM slider X position
    const sliderWidth = 200;
    const sliderY = centerY - 65; // Match slider draw position

    // Calculate volume based on pointer position
    const relativeX = pointer.x - (sliderX - sliderWidth / 2);
    const volume = Math.max(0, Math.min(1, relativeX / sliderWidth));

    this.setBGMVolume(volume);
  }

  updateSFXVolumeFromPointer(pointer) {
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;
    const sliderX = centerX + 280; // SFX slider X position
    const sliderWidth = 200;
    const sliderY = centerY - 65; // Match slider draw position

    // Calculate volume based on pointer position
    const relativeX = pointer.x - (sliderX - sliderWidth / 2);
    const volume = Math.max(0, Math.min(1, relativeX / sliderWidth));

    this.setSFXVolume(volume);
  }

  getStoredTiming(key, defaultValue) {
    const raw = localStorage.getItem(key);
    if (raw === null || raw === undefined) return defaultValue;
    const parsed = parseFloat(raw);
    return Number.isFinite(parsed) ? parsed : defaultValue;
  }

  setStoredTiming(key, value) {
    localStorage.setItem(key, value);
  }

  framesToMs(frames) {
    return (frames / BASE_FPS) * 1000;
  }

  msToFrames(ms) {
    return (ms / 1000) * BASE_FPS;
  }

  getTimingMs(key, defaultFrames) {
    const defaultMs = this.framesToMs(defaultFrames);
    const raw = this.getStoredTiming(key, defaultMs);
    if (!Number.isFinite(raw)) return defaultMs;
    // Backward compatibility: if old frame value was stored (small number), convert to ms
    if (raw >= 0 && raw <= 120 && raw <= defaultFrames * 2) {
      // Heuristic: values in plausible frame range treated as frames
      return this.framesToMs(raw);
    }
    return raw;
  }

  getTimingFrames(key, defaultFrames) {
    const ms = this.getTimingMs(key, defaultFrames);
    return this.msToFrames(ms);
  }

  setTimingFromFrames(key, frames) {
    const ms = this.framesToMs(frames);
    this.setStoredTiming(key, ms);
  }

  clampStep(value, min, max, step) {
    const clamped = Math.min(Math.max(value, min), max);
    const stepped = Math.round(clamped / step) * step;
    return Math.min(Math.max(stepped, min), max);
  }

  timingToPct(value, min, max) {
    const clamped = Math.min(Math.max(value, min), max);
    return (clamped - min) / (max - min || 1);
  }

  formatSDFDisplay(value) {
    if (value >= 100) return "20G";
    return `${value.toFixed(0)}x`;
  }

  updateDASFromPointer(pointer, slider) {
    if (!slider) return;
    const { x, width } = slider;
    const min = 1;
    const max = 20;
    const step = 0.1;
    const relativeX = pointer.x - (x - width / 2);
    const pct = Math.max(0, Math.min(1, relativeX / width));
    const raw = min + pct * (max - min);
    const value = this.clampStep(raw, min, max, step);
    this.setTimingFromFrames("timing_das_frames", value);
    this.updateDASDisplay(value, { x, width, y: slider.y });
  }

  updateDASDisplay(value, slider) {
    if (!slider) return;
    const { x, width, y } = slider;
    const pct = this.timingToPct(value, 1, 20);
    if (this.dasSliderFill) {
      this.dasSliderFill.clear();
      this.dasSliderFill.fillStyle(0x00ff00);
      this.dasSliderFill.fillRect(x - width / 2, y - 5, width * pct, 10);
    }
    if (this.dasSliderKnob) {
      this.dasSliderKnob.clear();
      this.dasSliderKnob.fillStyle(0xffffff);
      this.dasSliderKnob.fillCircle(x - width / 2 + width * pct, y, 8);
    }
    if (this.dasText) {
      this.dasText.setText(`${value.toFixed(1)}f`);
    }
  }

  updateARRFromPointer(pointer, slider) {
    if (!slider) return;
    const { x, width } = slider;
    const min = 0;
    const max = 5;
    const step = 0.1;
    const relativeX = pointer.x - (x - width / 2);
    const pct = Math.max(0, Math.min(1, relativeX / width));
    const raw = min + pct * (max - min);
    const value = this.clampStep(raw, min, max, step);
    this.setTimingFromFrames("timing_arr_frames", value);
    this.updateARRDisplay(value, { x, width, y: slider.y });
  }

  updateARRDisplay(value, slider) {
    if (!slider) return;
    const { x, width, y } = slider;
    const pct = this.timingToPct(value, 0, 5);
    if (this.arrSliderFill) {
      this.arrSliderFill.clear();
      this.arrSliderFill.fillStyle(0x00ff00);
      this.arrSliderFill.fillRect(x - width / 2, y - 5, width * pct, 10);
    }
    if (this.arrSliderKnob) {
      this.arrSliderKnob.clear();
      this.arrSliderKnob.fillStyle(0xffffff);
      this.arrSliderKnob.fillCircle(x - width / 2 + width * pct, y, 8);
    }
    if (this.arrText) {
      this.arrText.setText(`${value.toFixed(1)}f`);
    }
  }

  updateAREFromPointer(pointer, slider) {
    if (!slider) return;
    const { x, width } = slider;
    const min = 0;
    const max = 60;
    const step = 1;
    const relativeX = pointer.x - (x - width / 2);
    const pct = Math.max(0, Math.min(1, relativeX / width));
    const raw = min + pct * (max - min);
    const value = this.clampStep(raw, min, max, step);
    this.setTimingFromFrames("timing_are_frames", value);
    this.updateAREDisplay(value, { x, width, y: slider.y });
  }

  updateAREDisplay(value, slider) {
    if (!slider) return;
    const { x, width, y } = slider;
    const pct = this.timingToPct(value, 0, 60);
    if (this.areSliderFill) {
      this.areSliderFill.clear();
      this.areSliderFill.fillStyle(0x00ff00);
      this.areSliderFill.fillRect(x - width / 2, y - 5, width * pct, 10);
    }
    if (this.areSliderKnob) {
      this.areSliderKnob.clear();
      this.areSliderKnob.fillStyle(0xffffff);
      this.areSliderKnob.fillCircle(x - width / 2 + width * pct, y, 8);
    }
    if (this.areText) {
      this.areText.setText(`${value.toFixed(0)}f`);
    }
  }

  updateLineAREFromPointer(pointer, slider) {
    if (!slider) return;
    const { x, width } = slider;
    const min = 0;
    const max = 60;
    const step = 1;
    const relativeX = pointer.x - (x - width / 2);
    const pct = Math.max(0, Math.min(1, relativeX / width));
    const raw = min + pct * (max - min);
    const value = this.clampStep(raw, min, max, step);
    this.setTimingFromFrames("timing_line_are_frames", value);
    this.updateLineAREDisplay(value, { x, width, y: slider.y });
  }

  updateLineAREDisplay(value, slider) {
    if (!slider) return;
    const { x, width, y } = slider;
    const pct = this.timingToPct(value, 0, 60);
    if (this.lineAreSliderFill) {
      this.lineAreSliderFill.clear();
      this.lineAreSliderFill.fillStyle(0x00ff00);
      this.lineAreSliderFill.fillRect(x - width / 2, y - 5, width * pct, 10);
    }
    if (this.lineAreSliderKnob) {
      this.lineAreSliderKnob.clear();
      this.lineAreSliderKnob.fillStyle(0xffffff);
      this.lineAreSliderKnob.fillCircle(x - width / 2 + width * pct, y, 8);
    }
    if (this.lineAreText) {
      this.lineAreText.setText(`${value.toFixed(0)}f`);
    }
  }

  shouldAllowAREInputs() {
    if (this.disableIhsIrsForZeroArr) return false;
    const lineAre = this.lineAreOverride || 0;
    const lineClearDelay = this.lineClearDelayOverride || 0;
    return this.areDelay > 0 || this.pendingLineAREDelay > 0 || lineAre > 0 || lineClearDelay > 0;
  }

  updateSDFFromPointer(pointer, slider) {
    if (!slider) return;
    const { x, width } = slider;
    const min = 5;
    const max = 100; // 100 represents 20G
    const step = 1;
    const relativeX = pointer.x - (x - width / 2);
    const pct = Math.max(0, Math.min(1, relativeX / width));
    const raw = min + pct * (max - min);
    const value = this.clampStep(raw, min, max, step);
    this.setStoredTiming("timing_sdf_mult", value);
    this.updateSDFDisplay(value, { x, width, y: slider.y });
  }

  updateSDFDisplay(value, slider) {
    if (!slider) return;
    const { x, width, y } = slider;
    const pct = this.timingToPct(value, 5, 100);
    if (this.sdfSliderFill) {
      this.sdfSliderFill.clear();
      this.sdfSliderFill.fillStyle(0x00ff00);
      this.sdfSliderFill.fillRect(x - width / 2, y - 5, width * pct, 10);
    }
    if (this.sdfSliderKnob) {
      this.sdfSliderKnob.clear();
      this.sdfSliderKnob.fillStyle(0xffffff);
      this.sdfSliderKnob.fillCircle(x - width / 2 + width * pct, y, 8);
    }
    if (this.sdfText) {
      this.sdfText.setText(this.formatSDFDisplay(value));
    }
  }

  updateMainVolumeDisplay() {
    const volume = this.getMasterVolume();
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;
    const sliderX = centerX - 280;
    const sliderWidth = 200;
    const sliderY = centerY - 65;

    // Update slider fill
    if (this.mainVolumeSliderFill) {
      this.mainVolumeSliderFill.clear();
      this.mainVolumeSliderFill.fillStyle(0x00ff00);
      this.mainVolumeSliderFill.fillRect(
        sliderX - sliderWidth / 2,
        sliderY - 5,
        sliderWidth * volume,
        10,
      );
    }

    // Update knob position
    if (this.mainVolumeKnob) {
      this.mainVolumeKnob.clear();
      this.mainVolumeKnob.fillStyle(0xffffff);
      this.mainVolumeKnob.fillCircle(
        sliderX - sliderWidth / 2 + sliderWidth * volume,
        sliderY,
        8,
      );
    }

    // Update text
    if (this.mainVolumeText) {
      this.mainVolumeText.setText(`${Math.round(volume * 100)}%`);
    }
  }

  updateBGMVolumeDisplay() {
    const volume = this.getBGMVolume();
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;
    const sliderX = centerX;
    const sliderWidth = 200;
    const sliderY = centerY - 65;

    // Update slider fill
    if (this.bgmVolumeSliderFill) {
      this.bgmVolumeSliderFill.clear();
      this.bgmVolumeSliderFill.fillStyle(0x00ff00);
      this.bgmVolumeSliderFill.fillRect(
        sliderX - sliderWidth / 2,
        sliderY - 5,
        sliderWidth * volume,
        10,
      );
    }

    // Update knob position
    if (this.bgmVolumeKnob) {
      this.bgmVolumeKnob.clear();
      this.bgmVolumeKnob.fillStyle(0xffffff);
      this.bgmVolumeKnob.fillCircle(
        sliderX - sliderWidth / 2 + sliderWidth * volume,
        sliderY,
        8,
      );
    }

    // Update text
    if (this.bgmVolumeText) {
      this.bgmVolumeText.setText(`${Math.round(volume * 100)}%`);
    }
  }

  updateSFXVolumeDisplay() {
    const volume = this.getSFXVolume();
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;
    const sliderX = centerX + 280;
    const sliderWidth = 200;
    const sliderY = centerY - 65;

    // Update slider fill
    if (this.sfxVolumeSliderFill) {
      this.sfxVolumeSliderFill.clear();
      this.sfxVolumeSliderFill.fillStyle(0x00ff00);
      this.sfxVolumeSliderFill.fillRect(
        sliderX - sliderWidth / 2,
        sliderY - 5,
        sliderWidth * volume,
        10,
      );
    }

    // Update knob position
    if (this.sfxVolumeKnob) {
      this.sfxVolumeKnob.clear();
      this.sfxVolumeKnob.fillStyle(0xffffff);
      this.sfxVolumeKnob.fillCircle(
        sliderX - sliderWidth / 2 + sliderWidth * volume,
        sliderY,
        8,
      );
    }

    // Update text
    if (this.sfxVolumeText) {
      this.sfxVolumeText.setText(`${Math.round(volume * 100)}%`);
    }
  }

  resetKeybindsToDefaults() {
    localStorage.removeItem("keybinds");
    localStorage.removeItem("masterVolume");
    localStorage.removeItem("bgmVolume");
    localStorage.removeItem("sfxVolume");
    // Refresh all keybind displays
    Object.keys(this.keybindActions).forEach((action) => {
      const currentKey = this.getCurrentKeybind(action);
      this.keybindTexts[action].setText(currentKey);
    });
    // updateVolumeDisplay() {
    this.updateMainVolumeDisplay();
    this.updateBGMVolumeDisplay();
    this.updateSFXVolumeDisplay();

    this.applyEffectiveVolumes();
  }

  resetHighScores() {
    // Get all mode types from MenuScene
    const modeTypes = [
      {
        name: "EASY",
        modes: [
          {
            id: "tgm2_normal",
            name: "Normal",
            description: "Score as many points as you can within 300 levels!",
          },
          {
            id: "easy_easy",
            name: "Easy",
            description: "Clear lines, light fireworks. Have fun!",
          },
        ],
      },
      {
        name: "STANDARD",
        modes: [
          {
            id: "sprint_40",
            name: "Sprint 40L",
            description: "Clear 40 lines as fast as possible",
          },
          {
            id: "sprint_100",
            name: "Sprint 100L",
            description: "Clear 100 lines as fast as possible",
          },
          { id: "ultra", name: "Ultra", description: "2-minute score attack" },
          { id: "marathon", name: "Marathon", description: "Clear 150 lines" },
          { id: "zen", name: "Zen", description: "Endless relaxed play" },
        ],
      },
      {
        name: "MASTER",
        modes: [
          {
            id: "tgm1",
            name: "TGM1",
            description:
              "The Tetris game you know and love. Scale through the grades and be a Grand Master!",
          },
          {
            id: "tgm2",
            name: "TGM2",
            description:
              "Brand new mechanics, brand new challenges! Do you have what it takes?",
          },
          {
            id: "tgm3",
            name: "TGM3",
            description: "Try to be COOL!!, or you will REGRET!! it",
          },
          { id: "tgm4", name: "TGM4", description: "Patience is key..." },
          {
            id: "tgm_plus",
            name: "TGM+",
            description: "Rising garbage mode. Master the art of survival!",
          },
        ],
      },
      {
        name: "20G",
        modes: [
          {
            id: "master_20g",
            name: "20G",
            description: "Maximum gravity from the start! Good luck!",
          },
          {
            id: "tadeath",
            name: "T.A.Death",
            description: "Difficult 20G challenge mode. Speed is key!",
          },
          {
            id: "shirase",
            name: "Shirase",
            description: "Lightning-fast speeds. Do you have what it takes?",
          },
          {
            id: "tgm4_rounds",
            name: "Rounds",
            description:
              "Brand new, unique game mechanics. Can you handle them?",
          },
        ],
      },
      {
        name: "RACE",
        modes: [
          {
            id: "asuka_easy",
            name: "Asuka Easy",
            description: "20G Tetris stacking introduction",
          },
          {
            id: "asuka_normal",
            name: "Asuka",
            description: "Race mode. Finish 1300 levels in 7 minutes.",
          },
          {
            id: "asuka_hard",
            name: "Asuka Hard",
            description: "The true test of skill and speed!",
          },
        ],
      },
      {
        name: "ALL CLEAR",
        modes: [
          {
            id: "konoha_easy",
            name: "Konoha Easy",
            description: "Easy all-clear challenge with 5 pieces!",
          },
          {
            id: "konoha_hard",
            name: "Konoha Hard",
            description: "Hard all-clear challenge with all 7 pieces!",
          },
        ],
      },
      {
        name: "PUZZLE",
        modes: [
          {
            id: "tgm3_sakura",
            name: "TGM3-Sakura",
            description: "Puzzle mode from TGM3",
          },
          {
            id: "flashpoint",
            name: "Flashpoint",
            description: "From Flashpoint.",
          },
        ],
      },
    ];

    // Clear all high scores
    modeTypes.forEach((modeType) => {
      modeType.modes.forEach((mode) => {
        localStorage.removeItem(`bestScore_${mode.id}`);
        localStorage.removeItem(`leaderboard_${mode.id}`);
      });
    });

    // Show confirmation message
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    const confirmationText = this.add
      .text(centerX, centerY + 320, "High scores reset to defaults!", {
        fontSize: "16px",
        fill: "#00ff00",
        fontFamily: "Courier New",
      })
      .setOrigin(0.5);

    // Remove confirmation after 2 seconds
    this.time.delayedCall(2000, () => {
      confirmationText.destroy();
    });
  }

  createTPieceDisplay(centerX, centerY, system = this.rotationSystem) {
    const container = this.add.container(centerX, centerY);

    // Create T piece minos
    const minoSize = 20;
    const minos = [];

    // Get T piece shape and color based on rotation system
    const rotations =
      system === "ARS" ? SEGA_ROTATIONS.T.rotations : TETROMINOES.T.rotations;
    const color = system === "ARS" ? ARS_COLORS.T : TETROMINOES.T.color;
    const textureKey = system === "ARS" ? "mino_ars" : "mino_srs";

    // T piece shape in rotation 0 (3-wide)
    const shape = rotations[0];

    // Create mino sprites - use actual textures if available, otherwise fallback to colored rectangles
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (shape[r][c]) {
          // Center the T piece around (0,0) in the container
          const offsetX = (c - 1) * minoSize; // Center horizontally around c=1
          const offsetY = (r - 0.5) * minoSize; // Center vertically around r=0.5 (middle of the T)

          const texture = this.textures ? this.textures.get(textureKey) : null;
          const textureSource = texture && texture.source ? texture.source[0] : null;
          const hasValidTextureSource =
            !!texture && !!textureSource && !!textureSource.image;
          if (hasValidTextureSource) {
            const sprite = this.add.sprite(offsetX, offsetY, textureKey);
            sprite.setDisplaySize(minoSize, minoSize);
            sprite.setTint(color);
            minos.push(sprite);
            container.add(sprite);
          } else {
            // Fallback: create colored rectangle
            const graphics = this.add.graphics();
            graphics.fillStyle(color);
            graphics.fillRect(
              offsetX - minoSize / 2,
              offsetY - minoSize / 2,
              minoSize,
              minoSize,
            );
            minos.push(graphics);
            container.add(graphics);
          }
        }
      }
    }

    return { container, minos, rotation: 0 };
  }

  updateRotationSystemDisplay(newSystem) {
    this.rotationSystem = newSystem;

    // Rebuild T piece display to ensure correct texture/color
    if (this.tPieceDisplay && this.tPieceDisplay.container) {
      this.tPieceDisplay.container.destroy(true);
    }
    const centerX = this.tPieceX || this.cameras.main.width / 2;
    const centerY = this.tPieceY || this.cameras.main.height / 2 - 90;
    this.tPieceDisplay = this.createTPieceDisplay(centerX, centerY, newSystem);
    if (this.settingTabObjects && this.settingTabObjects.rotation) {
      this.settingTabObjects.rotation = [
        this.rotationText,
        this.tPieceDisplay?.container,
        this.arsResetLabel,
        this.arsResetModeText,
      ];
      this.tPieceDisplay.container.setVisible(this.activeSettingsTab === "rotation");
    }

    // Animate 360-degree rotation with the new shape/color
    this.tweens.add({
      targets: this.tPieceDisplay.container,
      angle: 360,
      duration: 600,
      ease: "Power2",
      onComplete: () => {
        // Reset angle to 0
        this.tPieceDisplay.container.angle = 0;
      },
    });
  }

  updateTPieceShape(tPiece, rotations, system) {
    const minoSize = 20;
    const color = system === "ARS" ? ARS_COLORS.T : TETROMINOES.T.color;
    const textureKey = system === "ARS" ? "mino_ars" : "mino_srs";

    // Get current rotation (keep same rotation index)
    const currentRotation = tPiece.rotation;
    const shape = rotations[currentRotation];

    // Clear existing minos and recreate them
    tPiece.minos.forEach((mino) => mino.destroy());
    tPiece.minos.length = 0;

    // Recreate mino sprites/graphics with new shape
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (shape[r][c]) {
          // Center the T piece around (0,0) in the container
          const offsetX = (c - 1) * minoSize; // Center horizontally around c=1
          const offsetY = (r - 0.5) * minoSize; // Center vertically around r=0.5

          const texture = this.textures ? this.textures.get(textureKey) : null;
          const textureSource = texture && texture.source ? texture.source[0] : null;
          const hasValidTextureSource =
            !!texture && !!textureSource && !!textureSource.image;
          if (hasValidTextureSource) {
            const sprite = this.add.sprite(offsetX, offsetY, textureKey);
            sprite.setDisplaySize(minoSize, minoSize);
            sprite.setTint(color);
            tPiece.minos.push(sprite);
            tPiece.container.add(sprite);
          } else {
            // Fallback: create colored rectangle
            const graphics = this.add.graphics();
            graphics.fillStyle(color);
            graphics.fillRect(
              offsetX - minoSize / 2,
              offsetY - minoSize / 2,
              minoSize,
              minoSize,
            );
            tPiece.minos.push(graphics);
            tPiece.container.add(graphics);
          }
        }
      }
    }
  }

  updateArsResetModeText(isMoveReset) {
    if (!this.arsResetModeText) return;
    this.arsResetModeText.setText(
      isMoveReset ? "Move (SRS-style)" : "Step (default)",
    );
  }

  updateArsResetModeVisibility(rotationSystem) {
    const visible = rotationSystem === "ARS" && this.activeSettingsTab === "rotation";
    if (this.arsResetModeText) this.arsResetModeText.setVisible(visible);
    if (this.arsResetLabel) this.arsResetLabel.setVisible(visible);
    if (this.arsResetModeText?.input) this.arsResetModeText.input.enabled = visible;
  }
}

class AssetLoaderScene extends Phaser.Scene {
  constructor() {
    super({ key: "AssetLoaderScene" });
  }

  init(data) {
    this.selectedMode = data.mode || "Mode 1";
    this.gameMode = data.gameMode || null; // Store gameMode from data
    this.gameModeName = data.gameModeName || null; // Store gameModeName from data
    this.startingLevel = normalizeStartLevel(data.startingLevel);
  }

  preload() {
    // Show loading text
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;
    this.loadingText = this.add
      .text(centerX, centerY, "LOADING...", {
        fontSize: "48px",
        fill: "#ffffff",
        fontFamily: "Courier New",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    const modeId = getModeInfoId(this.gameMode, this.selectedMode);
    createOrUpdateGlobalOverlay(
      this,
      buildModeInfo(modeId, this.gameMode?.getName?.() || modeId),
    );

    const ensureImageTexture = (key, url) => {
      if (this.textures.exists(key)) {
        const existingTexture = this.textures.get(key);
        const src = existingTexture && existingTexture.source ? existingTexture.source[0] : null;
        if (!src || !src.image) {
          this.textures.remove(key);
        }
      }
      if (!this.textures.exists(key)) {
        this.load.image(key, url);
      }
    };

    // Load all assets for the game
    ensureImageTexture("mino_srs", "img/mino.png");
    ensureImageTexture("mino_ars", "img/minoARS.png");
    ensureImageTexture("mono", "img/mono.png");
    ensureImageTexture("mono_ars", "img/monoARS.png");

    // Load BGM files from the correct directory paths
    try {
      // Load MP3 files from bgm directory (Phaser compatible)
      const bgmLoads = [
        ["mf1_1", "bgm/mf1_1.mp3"],
        ["mf1_2", "bgm/mf1_2.mp3"],
        ["mf1_endroll", "bgm/mf1_endroll.mp3"],
        ["mf2_3", "bgm/mf2_3.mp3"],
        ["mf2_4", "bgm/mf2_4.mp3"],
        ["mf2_endroll", "bgm/mf2_endroll.mp3"],
        ["mf3_4", "bgm/mf3_4.mp3"],
        ["mf3_6", "bgm/mf3_6.mp3"],
        ["mf4_endgame", "bgm/mf4_endgame.mp3"],
        ["mf_zen", "bgm/standard/mf_zen.mp3"],
        ["mf_std_1", "bgm/standard/mf_std_1.mp3"],
        ["mf_std_2", "bgm/standard/mf_std_2.mp3"],
        ["mf_std_3", "bgm/standard/mf_std_3.mp3"],
      ];
      bgmLoads.forEach(([key, path]) => {
        if (!this.cache.audio.exists(key)) {
          this.load.audio(key, path);
        }
      });
    } catch (error) {
      console.warn("BGM files could not be loaded from bgm directory", error);
    }

    // Load all sound effects
    const sfxLoads = [
      ["ready", "sfx/ready.wav"],
      ["go", "sfx/go.wav"],
      ["gradeup", "sfx/gradeup.wav"],
      ["complete", "sfx/complete.wav"],
      ["clear", "sfx/clear.wav"],
      ["fall", "sfx/fall.wav"],
      ["sectionchange", "sfx/sectionchange.wav"],
      ["IRS", "sfx/IRS.wav"],
      ["ground", "sfx/ground.wav"],
      ["lock", "sfx/lock.wav"],
      ["sound_s", "sfx/s.wav"],
      ["sound_z", "sfx/z.wav"],
      ["sound_t", "sfx/t.wav"],
      ["sound_j", "sfx/j.wav"],
      ["sound_l", "sfx/l.wav"],
      ["sound_o", "sfx/o.wav"],
      ["sound_i", "sfx/i.wav"],
      ["IHS", "sfx/IHS.wav"],
      ["bell", "sfx/bell.wav"],
      ["applause", "sfx/applause.wav"],
      ["combo", "sfx/combo.wav"],
      ["cool", "sfx/cool.wav"],
      ["jewelclear", "sfx/jewelclear.wav"],
      ["firework", "sfx/firework.wav"],
      ["garbage", "sfx/garbage.wav"],
      ["gameover", "sfx/gameover.wav"],
    ];
    sfxLoads.forEach(([key, path]) => {
      if (!this.cache.audio.exists(key)) {
        this.load.audio(key, path);
      }
    });

    this.load.once("complete", () => {});
  }

  create() {
    // Remove loading text and start game scene
    if (this.loadingText) {
      this.loadingText.destroy();
    }

    // Proceed to loading/ready-go scene
    this.scene.start("LoadingScreenScene", {
      mode: this.selectedMode,
      gameMode: this.gameMode,
      startingLevel: this.startingLevel,
    });
  }
}

class LoadingScreenScene extends Phaser.Scene {
  constructor() {
    super({ key: "LoadingScreenScene" });
  }

  init(data) {
    this.selectedMode = data.mode || "Mode 1";
    this.gameMode = data.gameMode || null; // Store gameMode from data
    this.startingLevel = normalizeStartLevel(data.startingLevel);
  }

  create() {
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    const modeId = getModeInfoId(this.gameMode, this.selectedMode);
    createOrUpdateGlobalOverlay(
      this,
      buildModeInfo(modeId, this.gameMode?.getName?.() || modeId),
    );

    // Show loading text briefly, then proceed directly to GameScene
    const loading = this.add
      .text(centerX, centerY, "LOADING...", {
        fontSize: "48px",
        fill: "#ffffff",
        fontFamily: "Courier New",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    this.time.delayedCall(300, () => {
      if (loading) loading.destroy();
      this.scene.start("GameScene", {
        mode: this.selectedMode,
        gameMode: this.gameMode,
        startingLevel: this.startingLevel,
      });
    });
  }
}

class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
    this.board = new Board();
    this.board.scene = this;
    this.currentPiece = null;
    this.holdPiece = null;
    this.canHold = true;
    this.holdRequest = false;
    this.nextPieces = []; // Initialize next pieces array
    this.gravityTimer = 0.0;
    this.gravityAccum = 0.0;
    // lockDelay is a timer; lockDelayMax is the per-mode limit
    this.lockDelay = 0;
    this.lockDelayMax = 0.5;
    this.lockResetCount = 0; // Number of lock delay resets on current piece (SRS limit)
    // defer starting the lock timer until after the first grounded frame
    this.lockDelayBufferedStart = false;
    this.suppressPieceRenderThisFrame = false;
    this.lastGroundedY = null; // Track last grounded row for ARS lock reset rule
    this.isGrounded = false;
    this.level = 0;
    this.startingLevel = this.level; // Preserve the starting level for restarts
    this.piecesPlaced = 0; // Track pieces for level system
    this.score = 0;
    this.grade = null;
    this.internalGrade = null;
    this.gradeDisplay = null;
    this.gradeText = null;
    this.gradePointsText = null;
    this.asukaKitaLabel = null;
    this.asukaKitaText = null;
    this.nextGradeText = null;
    this.levelDisplay = null;
    this.rollBonus = 0;
    this.sectionPerformance = [];
    this.coolAnnouncementsTargets = {};
    this.coolAnnouncementsShown = new Set();
    this.tgm3BagQueue = [];
    this.tgm3DroughtCounters = null;
    this.bgmInternalLevelBuffer = 0;
    this.regretAnnouncementsPending = {};
    this.regretAnnouncementsShown = new Set();
    this.coolDebugLogged = false;
    this.coolRegretText = null;
    this.coolRegretBlinkEvent = null;
    this.coolRegretHideEvent = null;
    this.bravoText = null;
    this.bravoHideEvent = null;
    this.bravoActive = false;
    this.sectionPerfTexts = [];
    this.sectionTimes = [];
    this.torikanFailed = false;
    this.torikanChecked = { 500: false, 1000: false };
    this.torikanFailActive = false;
    this.torikanFailTimer = 0;
    this.torikanFailMessageShown = false;
    this.torikanFailGameOverShown = false;
    this.garbageCountdown = 0;
    this.garbageInterval = 1.5; // seconds between garbage rows in Shirase post-500
    this.shiraseGarbageQuota = 0; // Rising garbage quota (500-999)
    this.shiraseGarbageCounter = 0; // Counter per doc (increments per piece, decrements per line)
    this.shiraseTorikanLevel = null;
    this.monochromeApplied = false;
    this.monochromeActive = false;
    this.monochromeTextureKey = null;
    this.bigBlocksActive = false;
    this.xrayActive = false;
    this.xrayColumn = 0;
    this.strobeActive = false;
    this.regretMessageTimer = 0;
    this.tapInternalGradeText = null;
    this.regretMessageText = null;
    this.playfieldBorder = null;
    this.gameOver = false;
    this.visibleRows = 20; // Only show bottom 20 rows of the 22-row matrix
    // Calculate cell size and positioning for full screen
    this.calculateLayout();

    // DAS (Delayed Auto Shift) variables - will be set by mode
    this.dasDelay = 16 / 60; // seconds until auto-repeat starts
    this.arrDelay = 1 / 60; // seconds between repeats
    this.softDropMultiplier = 6; // soft drop speed multiplier (5–100, 100 = 20G)
    this.leftKeyPressed = false;
    this.rightKeyPressed = false;
    this.leftTimer = 0;
    this.rightTimer = 0;
    this.leftInRepeat = false;
    this.rightInRepeat = false;
    this.softDropPressed = false;
    this.softDropMovedThisPiece = false;
    this.skipDASMovementAfterSpawn = false;

    // Rotation and action key states
    this.kKeyPressed = false;
    this.spaceKeyPressed = false;
    this.lKeyPressed = false;
    this.rotate180Pressed = false;
    this.xKeyPressed = false;

    // ARE (Appearance Delay) - will be set by mode
    this.areDelay = 30 / 60; // seconds until next piece appears
    this.areTimer = 0;
    this.areActive = false;
    this.lineClearDelayActive = false;
    this.lineClearDelayDuration = 0;
    this.pendingLineAREDelay = 0;
    this.disableIhsIrsForZeroArr = false;
    this.zenSandboxConfig = null;
    this.zenSandboxRuntime = { bagQueue: [], bagType: null };
    this.zenCheeseTimer = 0;
    this.hasSpawnedPiece = false;
    this.garbageLinesClearedLast = 0;
    this.zenTopoutCooldown = false;
    this.zenTopoutFreezeActive = false;
    this.zenTopoutPendingFinish = false;
    this.zenTopoutFreezeStart = 0;
    this.zenSandboxLogOnce = false;
    this.zenTopoutFreezeLogged = false;
    this.zenGravityTime = 0;
    this.zenSandboxInitDone = false;
    this.suppressGameOverOnce = false;

    if (typeof ZenSandboxHelper !== "undefined" && ZenSandboxHelper.ensureScene) {
      ZenSandboxHelper.ensureScene(this);
    }
    if (typeof this.tickZenCheese !== "function") {
      this.tickZenCheese = function (deltaSeconds = 0) {
        if (!this.isZenSandboxActive || !this.isZenSandboxActive()) return;
        if (!this.zenSandboxConfig || !this.board) return;
        if (this.isPaused) return;
        const { cheeseMode, cheeseInterval, cheesePercent } = this.zenSandboxConfig;
        if (cheeseMode !== "fixed_timing") return;
        if (!this.hasSpawnedPiece) return;
        const interval = Math.max(0.1, Number(cheeseInterval) || 0.1);
        const rows = 1;
        const percent = Math.max(0, Math.min(100, Number(cheesePercent) || 0));
        this.zenCheeseTimer = (this.zenCheeseTimer || 0) + deltaSeconds;
        if (this.zenCheeseTimer >= interval) {
          this.board.addCheeseRows(rows, percent);
          if (typeof this.playGarbageSfx === "function") this.playGarbageSfx(rows);
          this.zenCheeseTimer = 0;
        }
      };
    }
    // Fallback: ensure applyZenCheeseRows exists for sandbox cheese logic
    if (typeof this.applyZenCheeseRows !== "function") {
      this.applyZenCheeseRows = function (trigger, clearedCount = 0) {
        if (
          typeof GameScene !== "undefined" &&
          GameScene.prototype &&
          typeof GameScene.prototype.applyZenCheeseRows === "function"
        ) {
          return GameScene.prototype.applyZenCheeseRows.call(this, trigger, clearedCount);
        }
        return undefined;
      };
    }
    // Fallback: ensure cheese helpers exist on instance
    if (typeof this.ensureZenCheeseBaseline !== "function") {
      this.ensureZenCheeseBaseline = function (clearedCount = 0) {
        if (
          typeof GameScene !== "undefined" &&
          GameScene.prototype &&
          typeof GameScene.prototype.ensureZenCheeseBaseline === "function"
        ) {
          return GameScene.prototype.ensureZenCheeseBaseline.call(this, clearedCount);
        }
        return undefined;
      };
    }
    if (typeof this.countCheeseRows !== "function") {
      this.countCheeseRows = function () {
        if (
          typeof GameScene !== "undefined" &&
          GameScene.prototype &&
          typeof GameScene.prototype.countCheeseRows === "function"
        ) {
          return GameScene.prototype.countCheeseRows.call(this);
        }
        return 0;
      };
    }
    // Fallback: ensure handleZenTopout exists to avoid runtime errors in sandbox
    if (typeof this.handleZenTopout !== "function") {
      this.handleZenTopout = function () {
        if (
          typeof GameScene !== "undefined" &&
          GameScene.prototype &&
          typeof GameScene.prototype.handleZenTopout === "function"
        ) {
          return GameScene.prototype.handleZenTopout.call(this);
        }
        return undefined;
      };
    }
    if (typeof this.isZenSandboxActive !== "function") {
      this.isZenSandboxActive = function () {
        const modeId =
          (this.gameMode && typeof this.gameMode.getModeId === "function"
            ? this.gameMode.getModeId()
            : this.selectedMode) || "";
        const modeIdLower = typeof modeId === "string" ? modeId.toLowerCase() : "";
        return modeIdLower.includes("zen") && !!this.zenSandboxConfig;
      };
    }
    if (typeof this.getZenSpinMode !== "function") {
      this.getZenSpinMode = function () {
        if (!this.isZenSandboxActive || !this.isZenSandboxActive()) return "standard";
        return (this.zenSandboxConfig && this.zenSandboxConfig.spinType) || "standard";
      };
    }
    if (typeof this.isZenInfiniteResets !== "function") {
      this.isZenInfiniteResets = function () {
        // Ensure Zen config/runtime are loaded before filling queue so first bag uses selected randomizer
        const modeIdForZen =
          (this.gameMode && typeof this.gameMode.getModeId === "function"
            ? this.gameMode.getModeId()
            : this.selectedMode) || "";
        const isZenMode = typeof modeIdForZen === "string" && modeIdForZen.toLowerCase().includes("zen");
        if (isZenMode && (!this.zenSandboxConfig || !this.zenSandboxRuntime)) {
          if (typeof ZenSandboxHelper !== "undefined" && ZenSandboxHelper.loadConfig) {
            const cfg = ZenSandboxHelper.loadConfig();
            this.zenSandboxConfig = cfg;
            if (ZenSandboxHelper.resetRuntime) ZenSandboxHelper.resetRuntime(this, cfg);
          }
        }
        const isZenSandbox = this.isZenSandboxActive && this.isZenSandboxActive();
        return isZenSandbox && this.zenSandboxConfig?.movementResetsInfinite;
      };
    }
    if (typeof this.getZenSandboxPiece !== "function") {
      this.getZenSandboxPiece = function () {
        // Ensure config/runtime present so the very first bag uses the selected randomizer
        if (!this.zenSandboxConfig && typeof ZenSandboxHelper !== "undefined" && ZenSandboxHelper.loadConfig) {
          this.zenSandboxConfig = ZenSandboxHelper.loadConfig();
        }
        if (this.zenSandboxConfig && typeof ZenSandboxHelper !== "undefined" && ZenSandboxHelper.resetRuntime) {
          if (!this.zenSandboxRuntime || this.zenSandboxRuntime.bagType !== this.zenSandboxConfig.bagType) {
            ZenSandboxHelper.resetRuntime(this, this.zenSandboxConfig);
          }
        }
        if (!this.zenSandboxConfig) return this.getRandomPiece();
        const helper = typeof ZenSandboxHelper !== "undefined" ? ZenSandboxHelper : null;
        if (helper && helper.nextPieceFromBag) {
          const piece = helper.nextPieceFromBag(this);
          return piece;
        }
        // Fallback: simple random piece using existing utilities
        const type = this.getRandomPiece ? this.getRandomPiece() : "I";
        return type;
      };
    }
    if (typeof this.updateZenSandboxDisplay !== "function") {
      this.updateZenSandboxDisplay = function () {
        if (!this.isZenSandboxActive || !this.isZenSandboxActive()) return;
        const mode = (this.zenSandboxConfig?.displayMode || "versus").toLowerCase();
        const showNone = mode === "none";
        const isReadyGo = !!this.readyGoPhase;
        const isUltraMode = this.selectedMode === "ultra";
        const isZenMode = this.selectedMode === "zen";
        const showAttack = !showNone && (mode === "versus" || mode === "efficiency");
        const showAtkPerPiece = showAttack && mode === "efficiency";
        // Hide piece/PPS metrics during Ready/Go and when display mode is none
        const showPps = !showNone && (mode === "versus" || mode === "speed" || mode === "efficiency");
        const showScore = !showNone && mode === "speed";
        const showScorePerPiece =
          (isUltraMode && !showNone) || (isZenMode && mode === "speed");
        const showFinesse =
          !showNone && (mode === "speed" || mode === "efficiency") && !!this.finesseEnabled;
        const showTime = !showNone && mode === "versus";

        const setGroupVisible = (elems, visible) => {
          elems
            .filter(Boolean)
            .forEach((el) => el.setVisible(!!visible));
        };

        const attackElems = [
          this.vsLabel,
          this.vsScoreText,
          this.attackLabel,
          this.attackTotalText,
          this.attackPerMinLabel,
          this.attackPerMinText,
        ];
        const atkPerPieceElems = [this.attackPerPieceLabel, this.attackPerPieceText];
        const ppsElems = [
          this.pieceCountLabel,
          this.pieceCountText,
          this.ppsLabel,
          this.ppsText,
          this.rawPpsLabel,
          this.rawPpsText,
        ];
        const scoreElems = [this.scoreLabel, this.scoreText];
        const scorePerPieceElems = [this.scorePerPieceLabel, this.scorePerPieceText];
        const finesseElems = [
          this.finesseInputLabel,
          this.finesseInputText,
          this.inputPerPieceLabel,
          this.inputPerPieceText,
          this.finesseTexts?.header,
          this.finesseTexts?.streakAcc,
          this.finesseTexts?.errors,
        ];
        const timeElems = [this.timeText];
        const linesElems = [
          this.levelLabel,
          this.levelDisplayLabel,
          this.levelDisplayText,
          this.levelBar,
          this.currentLevelText,
          this.capLevelText,
        ];

        setGroupVisible(attackElems, showAttack);
        setGroupVisible(atkPerPieceElems, showAtkPerPiece);
        setGroupVisible(ppsElems, showPps);
        setGroupVisible(scoreElems, showScore);
        setGroupVisible(scorePerPieceElems, showScorePerPiece);
        setGroupVisible(finesseElems, showFinesse);
        setGroupVisible(timeElems, showTime);
        setGroupVisible(linesElems, !showNone);

        if (this.spikeText) {
          const canShowSpike = showAttack && !this.readyGoPhase;
          this.spikeText.setVisible(canShowSpike);
        }
      };
    }
    this.loadZenSandboxConfig();
    if (typeof this.updateZenSandboxDisplay === "function") {
      this.updateZenSandboxDisplay();
    }

    // Line clear animation tracking
    this.clearedLines = []; // Lines being cleared for animation
    this.isClearingLines = false; // Flag for line clear animation phase
    this.lineClearPhase = false; // True during line clear ARE, false during normal ARE

    // ARE input tracking for IRS/IHS/DAS
    this.areRotationDirection = 0;
    this.areHoldPressed = false;
    this.areLeftHeld = false;
    this.areRightHeld = false;
    this.areLeftDasCharge = 0;
    this.areRightDasCharge = 0;
    this.skipDASMovementAfterSpawn = false;
    this.areRotationKeys = { k: false, space: false, l: false }; // Track which rotation keys are held during ARE

    // Enhanced scoring system
    this.comboCount = -1; // -1 means no combo active
    this.standardComboCount = -1;
    this.lastClearType = null; // 'single', 'double', 'triple', 'tetris', 'tspin'
    this.backToBack = false;
    this.totalLines = 0;
    this.lastPieceType = null;
    this.lastTetrisNoCombo = false; // Tracks a fresh tetris without prior combo for SFX chaining
    this.lastActionWasRotation = false;
    this.totalAttack = 0;
    this.totalGarbageCleared = 0;
    this.attackSpike = 0;
    this.lastAttackTime = 0;
    this.attackTotalText = null;
    this.attackPerMinText = null;
    this.attackPerPieceText = null;
    this.attackPerPieceLabel = null;
    this.spikeText = null;
    this.vsScoreText = null;
    this.scorePerPieceLabel = null;
    this.scorePerPieceText = null;
    this.inputPerPieceLabel = null;
    this.inputPerPieceText = null;
    this.spikeFadeTween = null;
    this.b2bChainText = null;
    this.b2bChainCount = -1;
    this.standardComboText = null;
    this.standardComboFadeTween = null;
    this.standardComboLastLineTime = 0;
    this.standardComboCount = -1;
    this.clearBannerGroup = null;
    this.clearBannerLine1 = null;
    this.clearBannerLine2 = null;
    this.clearBannerTween = null;
    this.clearBannerHideEvent = null;
    this.clearBannerBaseX = 0;
    this.clearBannerStartX = 0;
    this.clearBannerY = 0;
    this.clearBannerDuration = 1000;
    this.clearBannerActive = false;
    this.createClearBannerUI = (levelBottomY, scoreRowHeight, uiFontSize) => {
      const line1Font = Math.max(uiFontSize + 12, 28);
      const line2Font = Math.max(uiFontSize + 6, 22);
      const xBase = this.borderOffsetX - 80; // 50px further left
      const yBase =
        this.borderOffsetY + this.playfieldHeight / 2 - (line1Font + line2Font) / 2;

      this.clearBannerBaseX = xBase;
      this.clearBannerStartX = xBase + 30; // start right, slide left
      this.clearBannerY = yBase;

      this.clearBannerLine1 = this.add
        .text(0, 0, "", {
          fontSize: `${line1Font}px`,
          fill: "#ffffff",
          fontFamily: "Courier New",
          fontStyle: "bold",
          align: "left",
        })
        .setOrigin(0, 0);
      this.clearBannerLine2 = this.add
        .text(0, line1Font + 6, "", {
          fontSize: `${line2Font}px`,
          fill: "#ffffff",
          fontFamily: "Courier New",
          fontStyle: "bold",
          align: "left",
        })
        .setOrigin(0, 0);
      this.clearBannerGroup = this.add.container(
        this.clearBannerStartX,
        this.clearBannerY,
        [this.clearBannerLine1, this.clearBannerLine2],
      );
      this.clearBannerGroup.setAlpha(0);
      this.clearBannerGroup.setVisible(false);
      this.clearBannerGroup.setDepth(2000);
    };
    this.getPieceColorHex = (type) => {
      let colorInt = 0xffffff;
      if (this.rotationSystem === "ARS") {
        colorInt = ARS_COLORS[type] ?? colorInt;
      } else if (TETROMINOES[type] && TETROMINOES[type].color != null) {
        colorInt = TETROMINOES[type].color;
      }
      return `#${colorInt.toString(16).padStart(6, "0")}`;
    };
    this.hideClearBanner = () => {
      if (this.clearBannerHideEvent) {
        this.clearBannerHideEvent.remove(false);
        this.clearBannerHideEvent = null;
      }
      if (this.clearBannerTween) {
        this.clearBannerTween.stop();
        this.clearBannerTween = null;
      }
      if (this.clearBannerGroup) {
        this.clearBannerGroup.setVisible(false);
        this.clearBannerGroup.setAlpha(0);
        this.clearBannerGroup.x = this.clearBannerStartX || 0;
      }
      this.clearBannerActive = false;
    };
    this.showClearBanner = (clearType, spinInfo = {}, lines = 0, pieceType = null) => {
      if (
        !this.clearBannerGroup ||
        !this.clearBannerLine1 ||
        !this.clearBannerLine2
      ) {
        return;
      }
      const { isSpin } = spinInfo || {};
      const lineCount = Number(lines) || 0;
      if (lineCount === 0 && !isSpin) {
        this.hideClearBanner();
        return;
      }

      const colorHex = isSpin ? this.getPieceColorHex(pieceType) : "#ffffff";
      const line1Text = isSpin ? `${(pieceType || "").toUpperCase()}-SPIN` : "";
      let normalizedClear = clearType || "--";
      if (isSpin) {
        normalizedClear =
          normalizedClear.replace(/t-?spin\s*/i, "").trim() || normalizedClear;
      }
      normalizedClear = normalizedClear.toUpperCase();

      this.clearBannerLine1.setText(line1Text).setColor(colorHex);
      this.clearBannerLine1.setVisible(!!line1Text);
      const line2Y = isSpin ? this.clearBannerLine1.height + 6 : 0;
      this.clearBannerLine2.setY(line2Y);
      this.clearBannerLine2.setText(normalizedClear || "--").setColor(colorHex);

      this.clearBannerGroup.setVisible(true);
      this.clearBannerGroup.setAlpha(0);
      this.clearBannerGroup.x = this.clearBannerStartX;

      if (this.clearBannerTween) {
        this.clearBannerTween.stop();
        this.clearBannerTween = null;
      }
      if (this.clearBannerHideEvent) {
        this.clearBannerHideEvent.remove(false);
        this.clearBannerHideEvent = null;
      }

      this.clearBannerTween = this.tweens.add({
        targets: this.clearBannerGroup,
        x: this.clearBannerBaseX,
        alpha: 1,
        duration: 200,
        ease: "Sine.easeOut",
      });

      this.clearBannerActive = true;
      this.clearBannerHideEvent = this.time.delayedCall(
        this.clearBannerDuration,
        () => this.hideClearBanner(),
        [],
        this,
      );
    };
    this.spinRotatedWhileGrounded = false;

    this.isTSpin = false;

    // Piece active time tracking for scoring
    this.pieceActiveTime = 0;
    this.pieceSpawnTime = 0;

    // Drop tracking for scoring
    this.softDropRows = 0;
    this.hardDropRows = 0;

    // Time tracking for grade system
    this.startTime = null;
    this.currentTime = 0;
    this.bestTime = null;
    this.gradeHistory = [];
    this.sectionTimes = []; // Track time for each 100-level section
    this.sectionCoolTimes = []; // Track time to *70 per section for COOL

    this.sectionStartTime = 0;
    this.currentSection = 0;
    this.sectionTetrises = [];
    this.currentSectionTetrisCount = 0;
    this.section70Captured = new Set();

    // Piece per second tracking
    this.totalPiecesPlaced = 0; // Total pieces that have entered the playfield
    this.activeTime = 0; // Time spent not in ARE (piece movement time)
    this.areTime = 0; // Time spent in ARE phases
    this.conventionalPPS = 0; // PPS including ARE time
    this.rawPPS = 0; // PPS excluding ARE time
    this.maxPpsRecorded = 0;
    this.worstChoke = 0; // Longest active time (frames) for a single piece
    this.ppsHistory = [];
    this.ppsLockSampleIndices = [];
    this.ppsSampleTimer = 0;
    this.ppsSampleInterval = 0.5; // seconds
    this.ppsGraphGraphics = null;
    this.ppsGraphArea = null;
    this.ppsLegendText = null;
    this.ppsSummaryText = null;

    // Leaderboard tracking
    this.leaderboardSaved = false;

    // Finesse tracking (SRS only)
    this.finesseEnabled = false;
    this.finesseErrors = 0;
    this.finessePieces = 0;
    this.finesseCleanPieces = 0;
    this.finesseInputCount = 0;
    this.finesseStreak = 0;
    this.finesseCurrentInputs = { moves: 0, rotations: 0 };
    this.finesseTexts = {
      header: null,
      streakAcc: null,
      errors: null,
    };
    this.finesseInputText = null;
    this.zenSandboxPanelGroup = null;
    this.finesseInputLabel = null;
    this.finesseActiveForPiece = false;
    this.finesseLastAccuracy = 0;

    // Sections and level caps
    this.sectionCap = 99; // Start at first section cap
    this.sectionTransition = false;
    this.sectionMessage = null;
    this.sectionMessageTimer = 0;

    // Piece randomizer history (TGM1 system)
    this.pieceHistory = ["Z", "Z", "S", "S"]; // Start with [Z,Z,S,S] as specified
    this.pieceHistoryIndex = 0; // Current position in history for rotation
    this.firstPiece = true; // Track if this is the first piece
    this.isFirstSpawn = true; // Track if this is the first spawn for level setting
    // 7-bag randomizer queue (used by guideline-style modes)
    this.bagQueue = [];
    this.bagDrawCount = 0;
    this.bagDebugSeen = new Set();

    // Validate piece history to ensure it's correct
    this.validatePieceHistory();
    // Reset spin/hanabi for new run
    this.spinRotatedWhileGrounded = false;
    this.hanabiCounter = 0;
    // Ensure particle arrays exist before clearing
    this.hanabiParticles = [];
    this.hanabiPool = [];
    this.clearHanabiParticles();
    this.levelMaxSoundPlayed = false;
    this.lastBellLevel = -1;

    // Pause functionality
    this.isPaused = false;
    this.pauseOverlay = null;

    // BGM system
    this.stage1BGM = null;
    this.stage2BGM = null;
    this.currentBGM = null;
    this.bgmEnabled = true;
    this.bgmTracks = {};
    this.bgmStarted = false;

    // Loop point configuration for BGM tracks
    this.loopPoints = {
      stage1: { start: 56.862, end: 113.708 },
      stage2: { start: 97.622, end: 203.217 },
    };

    this.bgmLoopTimer = null;

    // Track if BGM has been played for the first time
    this.bgmFirstPlay = {
      stage1: true,
      stage2: true,
    };

    // Re-apply mode timing configuration in case restart reset defaults
    this.applyModeConfiguration();
    this.applyInitialGradeFromMode();


    // Credits system
    this.creditsActive = false;
    this.creditsTimer = 0;
    this.creditsDuration = 61.6; // 61.60 seconds
    this.creditsText = null;
    this.creditsScrollSpeed = 0.5; // pixels per frame
    this.creditsAlpha = 1;
    this.congratulationsActive = false;
    this.gameComplete = false;
    this.level999Reached = false; // Track when level 999 is reached for TGM behavior
    this.creditsFinalized = false;
    this.creditsBgmStarted = false;
    this.rollFailedDuringRoll = false;

    this.invisibleStackActive = false;
    this.fadingRollActive = false;
    this.minoFadeActive = false;
    this.minoFadeProgress = 0;
    this.minoFadeDelay = 30 / 60; // seconds between each row fade (will be calculated dynamically)
    this.minoFadeTimer = 0;
    this.minoFadePerRowDuration = 0;
    this.placedMinos = []; // Track all placed minos for fading
    this.placedMinoRows = []; // Track rows containing minos for row-by-row fading
    this.fadingComplete = false; // Track when fading is complete
    this.minoRowFadeAlpha = {}; // Row -> alpha during fading
    this.rollType = null; // 'fading' or 'mroll'
    this.rollLinesCleared = 0;
    this.rollFadeLastExpireTime = 0;
    this.creditsTransitionStartTime = null;
    this.gameOverFadeDoneTime = null;
    this.showGameOverText = false;
    this.gameOverMessage = "GAME OVER";

    this.gameOverTextDelay = 3; // seconds until GAME OVER text appears
    this.gameOverTextTimer = 0;
    this.showGameOverText = false;
    this.gameOverSfxPlayed = false;

    // GM grade tracking
    this.gmConditions = {
      level300: { achieved: false, time: 0, score: 0 },
      level500: { achieved: false, time: 0, score: 0 },
      level999: { achieved: false, time: 0, score: 0 },
    };

    // Rotation system selection
    this.rotationSystem =
      localStorage.getItem("rotationSystem") || "SRS"; // 'SRS' or 'ARS'
    this.arsMoveResetEnabled =
      (localStorage.getItem("arsMoveReset") || "false") === "true";
    this.rotationSystemDisplay = null;
    this.initialGradeBaseline = null;
    this.initialGradeBaselineValue = null;
    this.initialInternalGradeBaseline = null;

    // Keybind and IRS display
    this.irsActivated = false;

    // FPS limiter
    this.lastUpdateTime = 0;
    this.deltaTime = 1 / 60; // Default delta time

    // Pause time tracking
    this.pauseStartTime = null;
    this.totalPausedTime = 0;
    this.metricsPauseActive = false;
    this.metricsPauseStart = null;

    // Mode and best score tracking
    this.selectedMode = null;
    this.gameMode = null; // Will be set by init method

    // Loading and ready-go phases
    this.loadingPhase = true;
    this.readyGoPhase = false;
    this.gameStarted = false;

    // Game over timer
    this.gameOverTimer = 0;

    // Soft drop ground sound tracking
    this.wasGroundedDuringSoftDrop = false;

    // Preview piece shown during Ready/Go
    this.previewPiece = null;

    // Section stop handling (TGM-style)
    this.levelStopActive = false;
  }

  isNormalOrEasyMode() {
    const modeId =
      (this.gameMode && typeof this.gameMode.getModeId === "function"
        ? this.gameMode.getModeId()
        : this.selectedMode) || "";
    const id = typeof modeId === "string" ? modeId.toLowerCase() : "";
    return id.includes("normal") || id.includes("easy");
  }

  // Get border color based on selected mode
  getModeTypeBorderColor() {
    if (
      this.gameMode &&
      this.gameMode.modeId &&
      typeof getModeManager !== "undefined"
    ) {
      const modeManager = getModeManager();
      const color = modeManager.modeColors[this.gameMode.modeId];
      return color || 0xffffff;
    }

    return 0xffffff; // Default white
  }

  getOverlayModeInfo() {
    const modeId = getModeInfoId(this.gameMode, this.selectedMode);
    const modeNameHint =
      (this.gameMode && typeof this.gameMode.getName === "function"
        ? this.gameMode.getName()
        : this.selectedMode) || modeId;
    return buildModeInfo(modeId, modeNameHint);
  }

  formatTimeValue(seconds) {
    if (seconds === null || seconds === undefined) return "--:--.--";
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const cs = Math.floor((seconds % 1) * 100);
    return `${minutes}:${secs.toString().padStart(2, "0")}.${cs
      .toString()
      .padStart(2, "0")}`;
  }

  getSectionLength() {
    return this.selectedMode === "marathon" ? 10 : 100;
  }

  getSectionBasisValue() {
    return this.selectedMode === "marathon" ? this.totalLines : this.level;
  }

  // Finesse tracking helpers
  incrementFinesseMove() {
    if (
      !this.finesseEnabled ||
      !this.finesseActiveForPiece ||
      !this.currentPiece ||
      !this.currentPiece.finesseInputs
    ) {
      return;
    }
    this.currentPiece.finesseInputs.moves += 1;
  }

  recordFinesseInput() {
    if (this.areActive) return;
    this.finesseInputCount += 1;
    this.updateFinesseInputUI();
  }

  incrementFinesseRotation() {
    if (
      !this.finesseEnabled ||
      !this.finesseActiveForPiece ||
      !this.currentPiece ||
      !this.currentPiece.finesseInputs
    ) {
      return;
    }
    this.currentPiece.finesseInputs.rotations += 1;
  }

  resetFinessePieceInputs(piece) {
    if (!piece || !this.finesseEnabled) return;
    piece.finesseInputs = { moves: 0, rotations: 0 };
    this.finesseActiveForPiece = true;
  }

  evaluateFinesseOnLock(piece) {
    if (!this.finesseEnabled || !piece) return;
    const leftCol = getLeftmostColumn(piece);
    const minimalMoves = getSrsMinimalMoves(piece.type, piece.rotation, leftCol);
    const minimalRotations = getSrsMinimalRotations(piece.type, piece.rotation);
    if (minimalMoves === null || minimalRotations === null) {
      return;
    }
    const actual = computeFinesseActual(piece);
    const moveOveruse = Math.max(0, actual.moves - minimalMoves);
    const rotationOveruse = Math.max(0, actual.rotations - minimalRotations);
    const pieceErrors = moveOveruse + rotationOveruse; // each extra input counts as 1 error

    this.finessePieces += 1;
    if (pieceErrors > 0) {
      this.finesseErrors += pieceErrors;
      this.finesseStreak = 0;
    } else {
      this.finesseCleanPieces += 1;
      this.finesseStreak += 1;
    }
    const clean = Math.max(0, this.finesseCleanPieces);
    this.finesseLastAccuracy =
      this.finessePieces > 0 ? (clean / this.finessePieces) * 100 : 100;
    this.updateFinesseUI();
  }

  updateFinesseUI() {
    const { header, streakAcc, errors } = this.finesseTexts;
    const mode = (this.zenSandboxConfig?.displayMode || "versus").toLowerCase();
    const allowByMode =
      !this.zenSandboxConfig || mode === "speed" || mode === "efficiency";
    const visible = this.finesseEnabled && allowByMode && header && streakAcc && errors;
    if (!header || !streakAcc || !errors) return;
    header.setVisible(visible);
    streakAcc.setVisible(visible);
    errors.setVisible(visible);
    if (!visible) return;
    const streakVal = this.finesseStreak;
    const accVal =
      this.finessePieces > 0
        ? Math.max(0, Math.min(100, this.finesseLastAccuracy))
        : 100;
    const errorVal = this.finesseErrors;
    streakAcc.setText(`${streakVal.toString()}   ${accVal.toFixed(1)}%`);
    errors.setText(`${errorVal} errors`);
  }

  updateFinesseInputUI() {
    const mode = (this.zenSandboxConfig?.displayMode || "versus").toLowerCase();
    const allowByMode = !this.zenSandboxConfig || mode === "speed" || mode === "efficiency";
    const show =
      !!(
        this.finesseEnabled &&
        allowByMode &&
        this.finesseInputLabel &&
        this.finesseInputText &&
        this.inputPerPieceLabel &&
        this.inputPerPieceText
      );
    if (
      !this.finesseInputLabel ||
      !this.finesseInputText ||
      !this.inputPerPieceLabel ||
      !this.inputPerPieceText
    )
      return;
    this.finesseInputLabel.setVisible(show);
    this.finesseInputText.setVisible(show);
    this.inputPerPieceLabel.setVisible(show);
    this.inputPerPieceText.setVisible(show);
    if (!show) return;
    const inputs = this.finesseInputCount || 0;
    const pieces = Math.max(1, this.totalPiecesPlaced || 0);
    const inputsPerPiece = inputs / pieces;
    this.finesseInputText.setText(`${inputs}`);
    this.inputPerPieceText.setText(inputsPerPiece.toFixed(2));
  }

  getMaxSectionsForTracker() {
    if (this.selectedMode === "marathon") {
      const targetLines =
        this.gameMode && typeof this.gameMode.targetLines === "number"
          ? this.gameMode.targetLines
          : 999;
      return Math.ceil(targetLines / this.getSectionLength());
    }
    const modeId =
      this.gameMode && typeof this.gameMode.getModeId === "function"
        ? this.gameMode.getModeId()
        : this.selectedMode;
    if (modeId === "tgm3_shirase") {
      return 13;
    }
    return 10;
  }

  isPuzzleMode(modeId) {
    return modeId === "tgm3_sakura";
  }

  getGradeValue(grade) {
    const gradeValues = {
      9: 0,
      8: 1,
      7: 2,
      6: 3,
      5: 4,
      4: 5,
      3: 6,
      2: 7,
      1: 8,
      S1: 9,
      S2: 10,
      S3: 11,
      S4: 12,
      S5: 13,
      S6: 14,
      S7: 15,
      S8: 16,
      S9: 17,
      M: 18,
      GM: 19,
    };
    return gradeValues[grade] || 0;
  }

  compareEntries(modeId, a, b) {
    const getVal = (val) => (val === undefined || val === null ? 0 : val);
    const parseNumTime = (t) => {
      if (!t || typeof t !== "string") return Number.POSITIVE_INFINITY;
      const parts = t.split(":");
      if (parts.length !== 2) return Number.POSITIVE_INFINITY;
      const [m, s] = parts;
      const sec = parseFloat(s);
      if (Number.isNaN(sec)) return Number.POSITIVE_INFINITY;
      const minutes = parseInt(m, 10);
      if (Number.isNaN(minutes)) return Number.POSITIVE_INFINITY;
      return minutes * 60 + sec;
    };

    const byGrade = () =>
      this.getGradeValue(getVal(b.grade)) - this.getGradeValue(getVal(a.grade));
    const byDesc = (x, y) => getVal(y) - getVal(x);
    const byAsc = (x, y) => getVal(x) - getVal(y);

    switch (modeId) {
      case "tgm2_normal": // Normal
        return (
          byDesc(a.score, b.score) ||
          byAsc(parseNumTime(a.time), parseNumTime(b.time))
        );
      case "easy_easy": // Easy
        return (
          byDesc(a.hanabi, b.hanabi) ||
          byAsc(parseNumTime(a.time), parseNumTime(b.time))
        );
      case "sprint_40":
      case "sprint_100": // Sprint
        return (
          byAsc(parseNumTime(a.time), parseNumTime(b.time)) ||
          byDesc(a.score, b.score) ||
          byDesc(a.pps, b.pps)
        );
      case "ultra": // Ultra
        return (
          byDesc(a.score, b.score) ||
          byAsc(parseNumTime(a.time), parseNumTime(b.time)) ||
          byDesc(a.pps, b.pps)
        );
      case "marathon": // Marathon
        return (
          byDesc(a.lines, b.lines) ||
          byAsc(parseNumTime(a.time), parseNumTime(b.time)) ||
          byDesc(a.pps, b.pps)
        );
      case "konoha_easy":
      case "konoha_hard": // All Clear
        return (
          byDesc(a.allClears, b.allClears) ||
          byDesc(a.level, b.level) ||
          byAsc(parseNumTime(a.time), parseNumTime(b.time))
        );
      case "tgm1":
      case "tgm2":
      case "tgm_plus":
      case "tgm3":
      case "tgm4":
      case "master_20g":
      case "tadeath":
      case "shirase":
      case "tgm4_rounds":
      case "asuka_easy":
      case "asuka_normal":
      case "asuka_hard": // Master, 20G, Race
        return (
          byGrade() ||
          byDesc(a.level, b.level) ||
          byAsc(parseNumTime(a.time), parseNumTime(b.time))
        );
      case "tgm3_sakura": // Puzzle
        return (
          byDesc(a.stage, b.stage) ||
          byDesc(a.completionRate, b.completionRate) ||
          byAsc(parseNumTime(a.time), parseNumTime(b.time))
        );
      default:
        // Generic: prefer score desc, time asc
        return (
          byDesc(a.score, b.score) ||
          byAsc(parseNumTime(a.time), parseNumTime(b.time))
        );
    }
  }

  init(data) {

    this.selectedMode = data.mode || "Mode 1";
    this.gameMode = data.gameMode || null;
    this.startingLevel = normalizeStartLevel(
      data.startingLevel !== undefined ? data.startingLevel : getConfiguredStartingLevel(),
    );
    this.level = this.startingLevel;
    this.customStartingLevelActive = this.startingLevel > 0;

    // Reset first-piece state for fresh runs (handles returning from main menu)
    this.pieceHistory = ["Z", "Z", "S", "S"];
    this.pieceHistoryIndex = 0;
    this.firstPiece = true;
    this.isFirstSpawn = true;
    this.bagQueue = [];
    this.bagDrawCount = 0;
    this.bagDebugSeen = new Set();

    // Load mode if not provided
    if (!this.gameMode && typeof getModeManager !== "undefined") {
      const modeManager = getModeManager();
      this.gameMode = modeManager.getMode(this.selectedMode);
    } else if (this.gameMode === null) {
      const modeManager = getModeManager();
      this.gameMode = modeManager.getMode(this.selectedMode);
    }

    // Fallback to default if no mode loaded
    if (!this.gameMode) {
      console.warn("No game mode loaded, using fallback configuration");
      this.gameMode = {
        getConfig: () => ({
          gravity: { type: "tgm1", value: 0, curve: null },
          das: 16 / 60,
          arr: 1 / 60,
          are: 30 / 60,
          lockDelay: 0.5,
          nextPieces: 1,
          holdEnabled: false,
          ghostEnabled: true,
          levelUpType: "piece",
          lineClearBonus: 1,
          gravityLevelCap: 999,
          specialMechanics: {},
        }),
        getGravitySpeed: (level) => this.getTGM1GravitySpeed(level),
        getName: () => "Fallback Mode",
      };
    }

    const modeStartingLevelCap = getStartingLevelCapForMode(this.gameMode);
    this.startingLevel = normalizeStartLevel(this.startingLevel, {
      maxLevel: modeStartingLevelCap,
    });
    this.level = this.startingLevel;
    this.customStartingLevelActive = this.startingLevel > 0;

    // Ensure mode-dependent timing/gravity state reflects configured starting level.
    this.syncModeStateToStartingLevel();

    // Apply mode configuration to game settings
    this.applyModeConfiguration();
    this.applyInitialGradeFromMode();

    const modeId =
      (this.gameMode && typeof this.gameMode.getModeId === "function"
        ? this.gameMode.getModeId()
        : this.selectedMode) || "";
    const modeNameHint =
      (this.gameMode && typeof this.gameMode.getName === "function"
        ? this.gameMode.getName()
        : this.selectedMode) || modeId;
    createOrUpdateGlobalOverlay(this, buildModeInfo(modeId, modeNameHint));
  }

  applyInitialGradeFromMode() {
    const modeConfig = this.gameMode ? this.gameMode.getConfig() : {};
    const hasGrading = modeConfig.hasGrading !== false;

    if (!hasGrading) {
      this.grade = null;
      this.internalGrade = null;
      this.initialGradeBaseline = null;
      this.initialGradeBaselineValue = null;
      this.initialInternalGradeBaseline = null;
      return;
    }

    // Reset mode grading state if supported
    if (this.gameMode) {
      if (typeof this.gameMode.resetGrading === "function") {
        this.gameMode.resetGrading(this);
      }
      if (this.gameMode.tgm2Grading && typeof this.gameMode.tgm2Grading.reset === "function") {
        this.gameMode.tgm2Grading.reset();
      }
      if (this.gameMode.tgm3Grading && typeof this.gameMode.tgm3Grading.reset === "function") {
        this.gameMode.tgm3Grading.reset();
      }
    }

    // Always start from the mode's lowest grade (or default "9"), ignoring any carried-over state
    // or mode getters that might be holding previous run values.
    const configLowestGrade =
      modeConfig && typeof modeConfig.lowestGrade === "string"
        ? modeConfig.lowestGrade
        : null;
    const baselineGrade = configLowestGrade ?? "9";
    const baselineInternal =
      typeof modeConfig.initialInternalGrade === "number"
        ? modeConfig.initialInternalGrade
        : 0;

    this.initialGradeBaseline = baselineGrade;
    this.initialGradeBaselineValue = this.getGradeValue(baselineGrade);
    this.initialInternalGradeBaseline = baselineInternal;

    this.grade = baselineGrade;
    this.internalGrade = baselineInternal;

    // If UI already exists, refresh visibility/text
    this.updateGradeUIVisibility?.();

    // Lock in baseline before any pieces spawn
    this.totalPiecesPlaced = 0;
  }

  syncModeStateToStartingLevel() {
    const startLevel = normalizeStartLevel(
      this.startingLevel !== undefined && this.startingLevel !== null
        ? this.startingLevel
        : this.level,
    );
    this.level = startLevel;
    if (!this.gameMode) return;

    const coolBonus = typeof this.gameMode.coolBonus === "number" ? this.gameMode.coolBonus : 0;
    const internalLevel = startLevel + coolBonus;

    if (
      Object.prototype.hasOwnProperty.call(this.gameMode, "internalLevel") ||
      typeof this.gameMode.updateTimingPhase === "function"
    ) {
      this.gameMode.internalLevel = internalLevel;
    }
    if (Object.prototype.hasOwnProperty.call(this.gameMode, "displayLevel")) {
      this.gameMode.displayLevel = startLevel;
    }
    if (Object.prototype.hasOwnProperty.call(this.gameMode, "bgmStopLevel")) {
      this.gameMode.bgmStopLevel = internalLevel;
    }
    if (typeof this.gameMode.updateTimingPhase === "function") {
      this.gameMode.updateTimingPhase(internalLevel);
    }
  }

  markGroundedSpin() {
    this.spinRotatedWhileGrounded = true;
    if (
      this.gameMode &&
      typeof this.gameMode.onRotateWhileGrounded === "function"
    ) {
      this.gameMode.onRotateWhileGrounded(this);
    }
  }

  spawnHanabiBurst(count = 1) {
    // Disable hanabi for TGM2 Normal mode
    if (this.gameMode && this.gameMode.modeId === "tgm2_normal") {
      return;
    }
    // Play firework SFX in Easy modes
    const modeId =
      this.gameMode && typeof this.gameMode.getModeId === "function"
        ? this.gameMode.getModeId()
        : this.selectedMode;
    if (modeId === "easy_easy" || modeId === "easy_normal") {
      try {
        this.sound?.add("firework", { volume: 0.6 })?.play();
      } catch {}
    }
    if (!this.hanabiContainer) return;
    const particlesToSpawn = Math.min(
      this.hanabiMaxActive - this.hanabiParticles.length,
      Math.max(2, Math.min(12, count * 3)),
    );
    const originX = this.matrixOffsetX + (this.cellSize * this.board.cols) / 2;
    const originY = this.matrixOffsetY + (this.cellSize * this.visibleRows) / 3;
    for (let i = 0; i < particlesToSpawn; i++) {
      let g = this.hanabiPool.pop();
      if (!g) {
        g = this.add.graphics();
      } else {
        g.clear();
      }
      const angle = Math.random() * Math.PI * 2;
      const speed = 40 + Math.random() * 60;
      const life = 0.35 + Math.random() * 0.2;
      const radius = 2 + Math.random() * 2;
      const color = Phaser.Display.Color.GetColor(
        200 + Math.floor(Math.random() * 55),
        200 + Math.floor(Math.random() * 55),
        120 + Math.floor(Math.random() * 135),
      );
      g.fillStyle(color, 1);
      g.fillCircle(0, 0, radius);
      g.x = originX;
      g.y = originY;
      g.setDepth(1000);
      this.hanabiContainer.add(g);
      this.hanabiParticles.push({
        g,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 30,
        life,
      });
    }
    this.hanabiCounter += count;
  }

  updateHanabiParticles(deltaTime) {
    if (!this.hanabiParticles.length) return;
    const remaining = [];
    for (const p of this.hanabiParticles) {
      p.life -= deltaTime;
      if (p.life <= 0) {
        p.g.clear();
        p.g.setVisible(false);
        this.hanabiPool.push(p.g);
        continue;
      }
      p.vy += 120 * deltaTime;
      p.g.x += p.vx * deltaTime;
      p.g.y += p.vy * deltaTime;
      p.g.setAlpha(Math.max(0, p.life / 0.5));
      remaining.push(p);
    }
    this.hanabiParticles = remaining;
  }

  clearHanabiParticles() {
    this.hanabiParticles.forEach((p) => {
      if (p.g) {
        p.g.clear();
        p.g.destroy();
      }
    });
    this.hanabiParticles = [];
    this.hanabiPool = [];
  }

  updatePlacementHint() {
    if (!this.hintGraphics) return;
    this.hintGraphics.clear();
    if (
      !this.currentPiece ||
      this.areActive ||
      this.gameOver ||
      this.lineClearDelayActive ||
      this.loadingPhase ||
      this.readyGoPhase ||
      !this.isNormalOrEasyMode()
    ) {
      this.hintPlacement = null;
      this.hintSignature = null;
      return;
    }
    const hintColor = this.currentPiece && this.currentPiece.color
      ? this.currentPiece.color
      : 0x00e0ff;

    // Scoring helpers (lightweight clone and analysis)
    const rows = this.board.rows;
    const cols = this.board.cols;
    const baseGrid = this.board.grid;
    let boardSignature = "";
    for (let r = 0; r < rows; r++) {
      const row = baseGrid[r];
      for (let c = 0; c < cols; c++) {
        boardSignature += row[c] ? "1" : "0";
      }
    }
    const hintSignature = `${this.currentPiece.type}|${this.rotationSystem}|${rows}x${cols}|${boardSignature}`;

    if (this.hintSignature !== hintSignature) {
      const makeGridWithPiece = (piece) => {
        const grid = baseGrid.map((row) => row.slice());
        for (let r = 0; r < piece.shape.length; r++) {
          for (let c = 0; c < piece.shape[r].length; c++) {
            if (!piece.shape[r][c]) continue;
            const gx = piece.x + c;
            const gy = piece.y + r;
            if (gy >= 0 && gy < rows && gx >= 0 && gx < cols) {
              grid[gy][gx] = 1;
            }
          }
        }
        return grid;
      };

      const computeHeights = (grid) => {
        const heights = Array(cols).fill(0);
        for (let x = 0; x < cols; x++) {
          let y = 0;
          while (y < rows && grid[y][x] === 0) y++;
          heights[x] = rows - y;
        }
        return heights;
      };

      const scorePlacement = (piece) => {
        const grid = makeGridWithPiece(piece);
        const heights = computeHeights(grid);

        // Holes: empty cell with at least one filled above
        let holes = 0;
        let coveredHoles = 0;
        for (let x = 0; x < cols; x++) {
          let seenBlock = false;
          for (let y = 0; y < rows; y++) {
            const filled = grid[y][x] !== 0;
            if (filled) {
              seenBlock = true;
            } else if (seenBlock) {
              holes++;
              // Covered hole: if there is also a block immediately above
              if (y > 0 && grid[y - 1][x] !== 0) coveredHoles++;
            }
          }
        }

        // Surface stats
        const maxHeight = Math.max(...heights);
        const aggregateHeight = heights.reduce((a, b) => a + b, 0);
        let bumpiness = 0;
        for (let i = 0; i < cols - 1; i++) {
          bumpiness += Math.abs(heights[i] - heights[i + 1]);
        }

        // Ceiling penalty (hidden rows: y < 2)
        let aboveCeilPenalty = 0;
        for (let r = 0; r < piece.shape.length; r++) {
          for (let c = 0; c < piece.shape[r].length; c++) {
            if (!piece.shape[r][c]) continue;
            const gy = piece.y + r;
            if (gy < 2) {
              aboveCeilPenalty += (2 - gy) * 50;
            }
          }
        }

        // Weighted score (lower is better)
        const score =
          holes * 1000 +
          coveredHoles * 800 +
          bumpiness * 5 +
          aggregateHeight * 2 +
          maxHeight * 3 +
          aboveCeilPenalty +
          piece.x * 0.01; // slight tie-breaker to favor leftmost

        return score;
      };

      const placements = [];
      const rotations = [0, 1, 2, 3];
      const pieceType = this.currentPiece.type;
      for (const rot of rotations) {
        const shape = new Piece(pieceType, this.rotationSystem, rot).shape;
        const width = shape[0].length;
        for (let x = -2; x < this.board.cols; x++) {
          const tmpPiece = new Piece(pieceType, this.rotationSystem, rot);
          tmpPiece.x = x;
          tmpPiece.y = -4;
          // Move down until collision
          while (this.board.isValidPosition(tmpPiece, tmpPiece.x, tmpPiece.y + 1)) {
            tmpPiece.y += 1;
          }
          if (!this.board.isValidPosition(tmpPiece, tmpPiece.x, tmpPiece.y)) {
            continue;
          }
          // Skip if out of bounds horizontally
          if (tmpPiece.x < -2 || tmpPiece.x + width > this.board.cols + 2) {
            continue;
          }

          const score = scorePlacement(tmpPiece);
          placements.push({ score, piece: tmpPiece });
        }
      }

      if (!placements.length) {
        this.hintPlacement = null;
        this.hintSignature = hintSignature;
        return;
      }
      placements.sort((a, b) => a.score - b.score);
      this.hintPlacement = placements[0].piece;
      this.hintSignature = hintSignature;
    }

    if (!this.hintPlacement) return;
    const startRow = 2;
    const cell = this.cellSize;
    const offX = this.matrixOffsetX;
    const offY = this.matrixOffsetY;
    this.hintGraphics.lineStyle(2, hintColor, 0.4);
    for (let r = 0; r < this.hintPlacement.shape.length; r++) {
      for (let c = 0; c < this.hintPlacement.shape[r].length; c++) {
        if (!this.hintPlacement.shape[r][c]) continue;
        const x = this.hintPlacement.x + c;
        const y = this.hintPlacement.y + r;
        const drawY = y - startRow;
        if (drawY < 0) continue;
        this.hintGraphics.strokeRect(
          offX + x * cell - cell / 2,
          offY + drawY * cell - cell / 2,
          cell,
          cell,
        );
      }
    }

    // Apply smooth blink (alpha oscillation)
    const blinkSpeed = 2; // Hz
    const t = this.time.now / 1000;
    const alpha = 0.3 + 0.2 * (1 + Math.sin(2 * Math.PI * blinkSpeed * t));
    this.hintGraphics.setAlpha(Math.min(1, Math.max(0, alpha)));
  }

  preload() {
    // Assets are loaded in AssetLoaderScene
    // This preload is intentionally empty to avoid duplicate loading
  }

  // Timing helpers (ms-backed storage, frame-facing UI)
  getStoredTiming(key, defaultValue) {
    const raw = localStorage.getItem(key);
    if (raw === null || raw === undefined) return defaultValue;
    const parsed = parseFloat(raw);
    return Number.isFinite(parsed) ? parsed : defaultValue;
  }

  setStoredTiming(key, value) {
    localStorage.setItem(key, value);
  }

  framesToMs(frames) {
    return (frames / 60) * 1000;
  }

  msToFrames(ms) {
    return (ms / 1000) * 60;
  }

  getTimingMs(key, defaultFrames) {
    const defaultMs = this.framesToMs(defaultFrames);
    const raw = this.getStoredTiming(key, defaultMs);
    if (!Number.isFinite(raw)) return defaultMs;
    // Backward compatibility: treat plausible frame values as frames
    if (raw >= 0 && raw <= 120 && raw <= defaultFrames * 2) {
      return this.framesToMs(raw);
    }
    return raw;
  }

  getTimingFrames(key, defaultFrames) {
    const ms = this.getTimingMs(key, defaultFrames);
    return this.msToFrames(ms);
  }

  setTimingFromFrames(key, frames) {
    const ms = this.framesToMs(frames);
    this.setStoredTiming(key, ms);
  }

  // Apply mode-specific configuration to game settings
  applyModeConfiguration() {
    if (!this.gameMode) {
      console.warn("No gameMode available, using default configuration");
      return;
    }

    const config = this.gameMode.getConfig();

    if (!config) {
      console.warn("No config found in gameMode, using default");
      return;
    }

    const modeId =
      (this.gameMode && typeof this.gameMode.getModeId === "function"
        ? this.gameMode.getModeId()
        : this.selectedMode) || "";
    const modeIdLower = typeof modeId === "string" ? modeId.toLowerCase() : "";
    const isEligibleTimingOverride = [
      "sprint_40",
      "sprint_100",
      "sprint",
      "ultra",
      "zen",
      "marathon",
    ].some(
      (id) => modeIdLower.includes(id),
    );
    this.isEligibleTimingOverride = isEligibleTimingOverride;

    // Rotation system + ARS reset behavior
    const storedRotation = localStorage.getItem("rotationSystem") || "SRS";
    const configRotation = config.rotationSystem || null;
    this.rotationSystem = configRotation || storedRotation;

    const storedArsMoveReset =
      (localStorage.getItem("arsMoveReset") || "false") === "true";
    const configArsMoveReset =
      config.specialMechanics && typeof config.specialMechanics.arsMoveResetEnabled === "boolean"
        ? config.specialMechanics.arsMoveResetEnabled
        : null;
    this.arsMoveResetEnabled =
      configArsMoveReset !== null ? configArsMoveReset : storedArsMoveReset;

    // Apply timing configurations - use mode methods if available for progressive timings
    // Timing overrides now stored in milliseconds for precision
    // Base timings from mode, then override with user settings for eligible modes (user wins)
    this.dasDelay =
      this.gameMode.getDAS && typeof this.gameMode.getDAS === "function"
        ? this.gameMode.getDAS()
        : config.das || 16 / 60;
    if (isEligibleTimingOverride) {
      const storedDasFrames = this.getTimingFrames("timing_das_frames", 10); // slider default 10f
      const clamped = Math.min(Math.max(storedDasFrames, 1), 20);
      this.dasDelay = clamped / 60;
    }
    this.disableIhsIrsForZeroArr = false;

    this.arrDelay =
      this.gameMode.getARR && typeof this.gameMode.getARR === "function"
        ? this.gameMode.getARR()
        : config.arr || 1 / 60;
    if (isEligibleTimingOverride) {
      const storedArrFrames = this.getTimingFrames("timing_arr_frames", 2); // slider default 2f
      const clamped = Math.min(Math.max(storedArrFrames, 0), 5);
      this.arrDelay = clamped / 60;
    }
    if (isEligibleTimingOverride && this.arrDelay <= 0) {
      this.disableIhsIrsForZeroArr = true;
    }
    this.areOverride = null;
    this.areDelay =
      this.gameMode.getARE && typeof this.gameMode.getARE === "function"
        ? this.gameMode.getARE()
        : config.are || 30 / 60;
    if (isEligibleTimingOverride) {
      const storedAreFrames = this.getTimingFrames("timing_are_frames", 7); // slider default 7f
      const clamped = Math.min(Math.max(storedAreFrames, 0), 60);
      this.areDelay = clamped / 60;
      this.areOverride = clamped / 60;
    }
    this.lineAreOverride = null;
    this.lineClearDelayOverride = null;
    if (isEligibleTimingOverride) {
      const storedLineAreFrames = this.getTimingFrames("timing_line_are_frames", 7); // slider default 7f
      const clamped = Math.min(Math.max(storedLineAreFrames, 0), 60);
      this.lineAreOverride = clamped / 60;
      this.lineClearDelayOverride = clamped / 60;
    }

    // If ARR is zero, force zero ARE/line ARE/line clear delay to spawn immediately and disable IHS/IRS
    if (this.disableIhsIrsForZeroArr) {
      this.areDelay = 0;
      this.areOverride = 0;
      this.lineAreOverride = 0;
      this.lineClearDelayOverride = 0;
    }
    // Soft drop speed multiplier (keep as-is, scalar not time-based)
    // Non-Standard modes: fixed 1G speed (1 row per frame)
    this.softDropMultiplier = 1;
    if (this.usesStandardDropBehavior()) {
      const storedSdf = this.getStoredTiming("timing_sdf_mult", null);
      if (storedSdf !== null) {
        const clamped = Math.min(Math.max(storedSdf, 5), 100);
        this.softDropMultiplier = clamped;
      } else {
        this.softDropMultiplier = config.softDropMultiplier || 6;
      }
    }

    // Debug: detailed timing state
    const rawDasMs = this.getStoredTiming("timing_das_frames", null);
    const rawArrMs = this.getStoredTiming("timing_arr_frames", null);
    const rawAreMs = this.getStoredTiming("timing_are_frames", null);
    const rawLineAreMs = this.getStoredTiming("timing_line_are_frames", null);
    const timingDebug = {
      modeId,
      isEligibleTimingOverride,
      stored: {
        das: rawDasMs,
        arr: rawArrMs,
        are: rawAreMs,
        lineAre: rawLineAreMs,
        sdf: this.getStoredTiming("timing_sdf_mult", null),
      },
      appliedFrames: {
        das: Math.round(this.dasDelay * 60 * 1000) / 1000,
        arr: Math.round(this.arrDelay * 60 * 1000) / 1000,
        are: Math.round(this.areDelay * 60 * 1000) / 1000,
        lineAre:
          this.lineAreOverride !== null
            ? Math.round(this.lineAreOverride * 60 * 1000) / 1000
            : null,
      },
      appliedSeconds: {
        das: this.dasDelay,
        arr: this.arrDelay,
        are: this.areDelay,
        lineAre: this.lineAreOverride,
      },
      softDropMultiplier: this.softDropMultiplier,
    };
    this.lockDelayMax =
      this.gameMode.getLockDelay &&
      typeof this.gameMode.getLockDelay === "function"
        ? this.gameMode.getLockDelay()
        : config.lockDelay || 0.5;

    // Apply other configurations
    this.nextPiecesCount = config.nextPieces || 1;
    this.holdEnabled = config.holdEnabled || false;
    this.ghostEnabled = typeof config.ghostEnabled === "boolean" ? config.ghostEnabled : true;
    if (this.isTgm4Mode()) {
      this.nextPiecesCount = 6;
      this.holdEnabled = true;
    }
    if (this.isNormalOrEasyMode()) {
      this.ghostEnabled = true;
    }
    this.hanabiParticles = [];
    this.hanabiPool = [];
    this.hanabiContainer = null;
    this.hintGraphics = null;
    this.hintPlacement = null;
    this.lowEndFireworks = true;
    this.hanabiMaxActive = 80;
    this.spinRotatedWhileGrounded = false;
    this.hanabiCounter = 0;
    this.levelUpType = config.levelUpType || "piece";
    this.lineClearBonus = config.lineClearBonus || 1;
    this.gravityLevelCap = config.gravityLevelCap || 999;
    this.nextPiecesCount = config.nextPieces || 1; // Number of next pieces to show

    // Store modeId for easy reference
    this.modeId = this.gameMode.modeId || null;

    // Enable finesse tracking only for SRS and sprint/ultra modes
    const isSprintMode =
      this.selectedMode === "sprint_40" || this.selectedMode === "sprint_100";
    const isUltraMode = this.selectedMode === "ultra";
    const isZenMode = this.selectedMode === "zen";
    this.finesseEnabled =
      this.rotationSystem === "SRS" && (isSprintMode || isUltraMode || isZenMode);
    if (!this.finesseEnabled) {
      this.finesseErrors = 0;
      this.finessePieces = 0;
      this.finesseCleanPieces = 0;
      this.finesseInputCount = 0;
      this.finesseStreak = 0;
      this.finesseCurrentInputs = { moves: 0, rotations: 0 };
      this.finesseActiveForPiece = false;
      this.finesseLastAccuracy = 0;
      this.updateFinesseInputUI?.();
    }

    // Debug: log applied timing overrides for eligible modes
    if (isEligibleTimingOverride) {
      console.log("[TimingOverride]", {
        modeId,
        dasFrames: Math.round(this.dasDelay * 60),
        arrFrames: Math.round(this.arrDelay * 60),
        areFrames: Math.round(this.areDelay * 60),
        lineAreFrames:
          this.lineAreOverride !== null ? Math.round(this.lineAreOverride * 60) : null,
        sdfMult: this.softDropMultiplier,
      });
    }
  }

  // Leaderboard helpers (GameScene)
  isPuzzleMode(modeId) {
    return modeId === "tgm3_sakura";
  }

  getGradeValue(grade) {
    const gradeValues = {
      9: 0,
      8: 1,
      7: 2,
      6: 3,
      5: 4,
      4: 5,
      3: 6,
      2: 7,
      1: 8,
      S1: 9,
      S2: 10,
      S3: 11,
      S4: 12,
      S5: 13,
      S6: 14,
      S7: 15,
      S8: 16,
      S9: 17,
      M: 18,
      GM: 19,
    };
    return gradeValues[grade] || 0;
  }

  compareEntries(modeId, a, b) {
    const getVal = (val) => (val === undefined || val === null ? 0 : val);
    const parseNumTime = (t) => {
      if (!t || typeof t !== "string") return Number.POSITIVE_INFINITY;
      const parts = t.split(":");
      if (parts.length !== 2) return Number.POSITIVE_INFINITY;
      const [m, s] = parts;
      const sec = parseFloat(s);
      if (Number.isNaN(sec)) return Number.POSITIVE_INFINITY;
      const minutes = parseInt(m, 10);
      if (Number.isNaN(minutes)) return Number.POSITIVE_INFINITY;
      return minutes * 60 + sec;
    };

    const byGrade = () =>
      this.getGradeValue(getVal(b.grade)) - this.getGradeValue(getVal(a.grade));
    const byDesc = (x, y) => getVal(y) - getVal(x);
    const byAsc = (x, y) => getVal(x) - getVal(y);

    switch (modeId) {
      case "tgm2_normal": // Normal
        return (
          byDesc(a.score, b.score) ||
          byAsc(parseNumTime(a.time), parseNumTime(b.time))
        );
      case "easy_easy": // Easy
        return (
          byDesc(a.hanabi, b.hanabi) ||
          byDesc(a.lines, b.lines) ||
          byAsc(parseNumTime(a.time), parseNumTime(b.time))
        );
      case "easy_hard": // Hard
        return (
          byDesc(a.hanabi, b.hanabi) ||
          byDesc(a.lines, b.lines) ||
          byAsc(parseNumTime(a.time), parseNumTime(b.time))
        );
      case "tgm2_master":
      case "tgmplus":
      case "tgm2_death":
        return (
          byDesc(a.level, b.level) ||
          byAsc(parseNumTime(a.time), parseNumTime(b.time)) ||
          byGrade()
        );
      case "marathon":
      case "ultra":
      case "zen":
      case "sprint_40":
      case "sprint_100":
        return (
          byAsc(parseNumTime(a.time), parseNumTime(b.time)) ||
          byDesc(a.lines, b.lines) ||
          byDesc(a.score, b.score)
        );
      default:
        // Generic: prefer score desc, time asc
        return (
          byDesc(a.score, b.score) ||
          byAsc(parseNumTime(a.time), parseNumTime(b.time))
        );
    }
  }

  shouldAllowAREInputs() {
    const lineAre = this.lineAreOverride || 0;
    const lineClearDelay = this.lineClearDelayOverride || 0;
    return this.areDelay > 0 || this.pendingLineAREDelay > 0 || lineAre > 0 || lineClearDelay > 0;
  }

  resetActiveDASState() {
    this.leftKeyPressed = false;
    this.rightKeyPressed = false;
    this.leftTimer = 0;
    this.rightTimer = 0;
    this.leftInRepeat = false;
    this.rightInRepeat = false;
  }

  updateBufferedDASInput(leftPressed, rightPressed, deltaSeconds) {
    this.areLeftHeld = !!leftPressed;
    this.areRightHeld = !!rightPressed;
    this.areLeftDasCharge = this.areLeftHeld
      ? Math.min(this.dasDelay, (this.areLeftDasCharge || 0) + deltaSeconds)
      : 0;
    this.areRightDasCharge = this.areRightHeld
      ? Math.min(this.dasDelay, (this.areRightDasCharge || 0) + deltaSeconds)
      : 0;
  }

  primeDASForSpawn(allowDasInputs) {
    const leftHeldAtSpawn = allowDasInputs && this.areLeftHeld;
    const rightHeldAtSpawn = allowDasInputs && this.areRightHeld;
    const leftChargeAtSpawn = leftHeldAtSpawn ? Math.min(this.dasDelay, this.areLeftDasCharge || 0) : 0;
    const rightChargeAtSpawn = rightHeldAtSpawn ? Math.min(this.dasDelay, this.areRightDasCharge || 0) : 0;

    this.resetActiveDASState();

    if (leftHeldAtSpawn) {
      this.leftKeyPressed = true;
      this.leftTimer = leftChargeAtSpawn;
    }
    if (rightHeldAtSpawn) {
      this.rightKeyPressed = true;
      this.rightTimer = rightChargeAtSpawn;
    }
    if (leftHeldAtSpawn || rightHeldAtSpawn) {
      this.skipDASMovementAfterSpawn = true;
    }

    this.areLeftHeld = false;
    this.areRightHeld = false;
    this.areLeftDasCharge = 0;
    this.areRightDasCharge = 0;
  }

  getLeaderboard(modeId) {
    const key = `leaderboard_${modeId}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        console.warn("Failed to parse leaderboard", modeId, e);
      }
    }

    // Fallback: migrate legacy single best score if present
    const legacyKey = `bestScore_${modeId}`;
    const legacyStored = localStorage.getItem(legacyKey);
    if (legacyStored && this.getBestScore) {
      const legacy = this.getBestScore(modeId);
      const migrated = [legacy];
      localStorage.setItem(key, JSON.stringify(migrated));
      return migrated;
    }
    return [];
  }

  saveLeaderboardEntryToModeId(modeId, entry) {
    if ((this.startingLevel || 0) > 0) return;
    const key = `leaderboard_${modeId}`;
    const list = this.getLeaderboard(modeId);
    list.push(entry);
    const deduped = [];
    const seen = new Set();
    list
      .filter(Boolean)
      .sort((a, b) => this.compareEntries(modeId, a, b))
      .forEach((e) => {
        const sig = JSON.stringify({
          time: e.time,
          score: e.score,
          level: e.level,
          grade: e.grade,
          lines: e.lines,
          pps: e.pps,
        });
        if (!seen.has(sig)) {
          seen.add(sig);
          deduped.push(e);
        }
      });
    const capped = deduped.slice(0, this.isPuzzleMode(modeId) ? 1 : 5);
    localStorage.setItem(key, JSON.stringify(capped));
    this.leaderboardSaved = true;
  }

  saveLeaderboardEntry(modeId, entry) {
    this.saveLeaderboardEntryToModeId(modeId, entry);

    const selectedModeId =
      typeof this.selectedMode === "string" && this.selectedMode !== "Mode 1"
        ? this.selectedMode
        : null;

    if (selectedModeId && selectedModeId !== modeId) {
      this.saveLeaderboardEntryToModeId(selectedModeId, entry);
    }
  }

  calculateLayout() {
    // Calculate layout based on current window size
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // Calculate optimal cell size to utilize more of the screen space
    // Use more aggressive sizing to fill the screen better
    const maxCellWidth = Math.floor((windowWidth * 0.8) / this.board.cols); // Use 80% of width for playfield
    const maxCellHeight = Math.floor((windowHeight * 0.9) / this.visibleRows); // Use 90% of height for playfield
    this.cellSize = Math.min(maxCellWidth, maxCellHeight, 40); // Cap at 40 for better utilization

    // Ensure minimum cell size for readability
    this.cellSize = Math.max(this.cellSize, 20);

    // Calculate playfield dimensions and store as instance properties
    this.playfieldWidth = this.cellSize * this.board.cols;
    this.playfieldHeight = this.cellSize * this.visibleRows;

    // Center the border with better screen utilization
    this.borderOffsetX = Math.floor((windowWidth - this.playfieldWidth) / 2);
    this.borderOffsetY =
      Math.floor((windowHeight - this.playfieldHeight) / 2) - 30; // Adjusted for better centering

    // Move the matrix to the right within the border
    this.matrixOffsetX = this.borderOffsetX + 17; // Shifted 2px left to align with border
    this.matrixOffsetY = this.borderOffsetY + 20;

    // Store window dimensions for UI positioning
    this.windowWidth = windowWidth;
    this.windowHeight = windowHeight;

    if (this.globalOverlayTexts) {
      createOrUpdateGlobalOverlay(this, this.getOverlayModeInfo());
    }
  }

  setupUI() {
    const uiFontSize = Math.max(
      16,
      Math.min(24, Math.floor(this.cellSize * 0.8)),
    );
    const largeFontSize = Math.max(
      20,
      Math.min(32, Math.floor(this.cellSize * 1.2)),
    );
    const xlargeFontSize = Math.max(
      28,
      Math.min(48, Math.floor(this.cellSize * 1.8)),
    );
    const timeFontSize = Math.max(
      24,
      Math.min(40, Math.floor(this.cellSize * 1.5)),
    ); // Larger for time

    // UI positioned to the left of border, moved 50px right
    const uiX = Math.max(20, this.borderOffsetX - 200) + 50;

    // Grade display - next to matrix on left, right-aligned, moved 25px right
    // Only show for modes that use grading
    const modeConfig = this.gameMode ? this.gameMode.getConfig() : {};
    const hasGrading = modeConfig.hasGrading !== false;
    const modeId =
      this.gameMode && typeof this.gameMode.getModeId === "function"
        ? this.gameMode.getModeId()
        : this.selectedMode;
    const specialMechanics = modeConfig.specialMechanics || {};
    const isTADeathMode = modeId === "tadeath" || modeId === "ta_death";
    const isTGM2Mode =
      Boolean(specialMechanics.tgm2Grading) ||
      (typeof modeId === "string" && modeId.startsWith("tgm2"));
    const isTgm3 = modeId === "tgm3_master" || modeId === "tgm3" || modeId === "tgm3_shirase" || modeId === "shirase";
    const isTgm4 = typeof modeId === "string" && modeId.startsWith("tgm4");
    const hideGradePoints =
      isTADeathMode ||
      modeId === "tgm1" ||
      modeId === "master_20g" ||
      modeId === "tgm3_shirase" ||
      modeId === "shirase" ||
      (!isTgm3 &&
        this.gameMode &&
        typeof this.gameMode.isTwentyGMode === "function" &&
        this.gameMode.isTwentyGMode());
    this.shouldShowGradePoints = !hideGradePoints;
    this.shouldShowNextGradeText =
      hasGrading &&
      !isTADeathMode &&
      !isTGM2Mode &&
      !isTgm4 &&
      modeId !== "tgm3_master" &&
      modeId !== "tgm3" &&
      modeId !== "tgm3_shirase" &&
      modeId !== "shirase";

    if (hasGrading) {
      const gradeX = uiX + 25;
      const isTgm3Master = modeId === "tgm3_master" || modeId === "tgm3";
      const isShiraseMode = modeId === "tgm3_shirase" || modeId === "shirase";
      // Push grade down in Ti-like modes so it doesn't overlap HOLD
      const gradeYOffset = isTgm3Master || isShiraseMode || isTgm4 ? 140 : 0;
      const gradeY = this.borderOffsetY + gradeYOffset;
      const gradeWidth = 80;
      this.gradeDisplay = this.add.graphics();
      this.gradeDisplay.lineStyle(2, 0xffffff);
      this.gradeDisplay.strokeRect(gradeX, gradeY, gradeWidth, 80);
      const initialDisplayedGrade =
        this.initialGradeBaseline !== null && this.initialGradeBaseline !== undefined
          ? this.initialGradeBaseline
          : (this.grade ?? "9");
      this.grade = initialDisplayedGrade;
      const gradeTextValue = this.grade ?? "9";
      const gradeVisible = !!gradeTextValue;
      this.gradeText = this.add
        .text(gradeX + gradeWidth / 2, gradeY + 40, gradeTextValue, {
          fontSize: `${xlargeFontSize}px`,
          fill: "#fff",
          fontFamily: "Courier New",
          fontStyle: "bold",
          align: "center",
        })
        .setOrigin(0.5);
      this.gradeDisplay.setVisible(gradeVisible);
      this.gradeText.setVisible(gradeVisible);
      if (this.gradePointsText) {
        this.gradePointsText.destroy();
        this.gradePointsText = null;
      }
      if (this.shouldShowGradePoints) {
        this.gradePointsText = this.add
          .text(gradeX + gradeWidth / 2, gradeY + 90, "0", {
            fontSize: `${largeFontSize - 4}px`,
            fill: "#ffffff",
            fontFamily: "Courier New",
            fontStyle: "bold",
            align: "center",
          })
          .setOrigin(0.5, 0);
        this.gradePointsText.setVisible(gradeVisible);
      }
      if (this.shouldShowNextGradeText) {
        if (this.nextGradeText) {
          this.nextGradeText.destroy();
          this.nextGradeText = null;
        }
        this.nextGradeText = this.add
          .text(gradeX + gradeWidth / 2, gradeY + 130, "", {
            fontSize: `${uiFontSize - 2}px`,
            fill: "#cccccc",
            fontFamily: "Courier New",
            fontStyle: "normal",
            align: "center",
          })
          .setOrigin(0.5, 0);
        this.nextGradeText.setWordWrapWidth(gradeWidth * 1.5);
        this.nextGradeText.setVisible(gradeVisible);
        this.updateNextGradeText();
      } else if (this.nextGradeText) {
        this.nextGradeText.destroy();
        this.nextGradeText = null;
      }
      this.updateGradeUIVisibility();
    }

    // Level display - next to matrix on left, right-aligned, moved 60px up and 20px right
    const levelBottomY = this.borderOffsetY + this.playfieldHeight - 60;
    const levelRowHeight = 20; // Decreased spacing
    const levelFontSize = Math.max(
      24,
      Math.min(36, Math.floor(this.cellSize * 1.0)),
    ); // Increased font

    // Determine mode types
    const isMarathonMode = !!(this.selectedMode && this.selectedMode === "marathon");
    const isUltraMode = !!(this.selectedMode && this.selectedMode === "ultra");
    const isZenMode = !!(this.selectedMode === "zen");
    const isSprintMode = !!(
      this.selectedMode &&
      (this.selectedMode === "sprint_40" || this.selectedMode === "sprint_100")
    );
    const isLineCountMode = !!(
      isMarathonMode || isUltraMode || isZenMode || isSprintMode
    );

    // For Marathon mode, add separate level display above
    if (isMarathonMode) {
      this.levelDisplayLabel = this.add
        .text(uiX + 135, levelBottomY - 4.5 * levelRowHeight - 83, "LEVEL", {
          fontSize: `${uiFontSize - 4}px`,
          fill: "#fff",
          fontFamily: "Courier New",
          fontStyle: "bold",
        })
        .setOrigin(1, 0);
      this.levelDisplayText = this.add
        .text(uiX + 140, levelBottomY - 4 * levelRowHeight - 83, "1", {
          fontSize: `${levelFontSize}px`,
          fill: "#fff",
          fontFamily: "Courier New",
          fontStyle: "bold",
          align: "right",
        })
        .setOrigin(1, 0);
    }

    // Level/Lines label and display
    const levelLabelText = isLineCountMode ? "LINES" : "LEVEL";
    this.levelLabel = this.add
      .text(
        uiX + 135,
        levelBottomY - 3.5 * levelRowHeight - 43,
        levelLabelText,
        {
          fontSize: `${uiFontSize}px`,
          fill: "#fff",
          fontFamily: "Courier New",
          fontStyle: "bold",
        },
      )
      .setOrigin(1, 0);
    // Level bar and texts will be added in draw

    // Score display - next to matrix on left, right-aligned, moved 30px up and 20px right
    const scoreRowHeight = 25;
    this.scoreLabel = this.add
      .text(uiX + 135, levelBottomY, "SCORE", {
        fontSize: `${uiFontSize - 4}px`,
        fill: "#fff",
        fontFamily: "Courier New",
        fontStyle: "bold",
      })
      .setOrigin(1, 0);
    this.scoreText = this.add
      .text(uiX + 140, levelBottomY + 15, "0", {
        fontSize: `${xlargeFontSize}px`,
        fill: "#fff",
        fontFamily: "Courier New",
        fontStyle: "bold",
        align: "right",
      })
      .setOrigin(1, 0);
    this.scorePerPieceLabel = this.add
      .text(uiX + 135, levelBottomY + 61, "SCORE/PIECE", {
        fontSize: `${uiFontSize - 6}px`,
        fill: "#cccccc",
        fontFamily: "Courier New",
        fontStyle: "bold",
      })
      .setOrigin(1, 0);
    this.scorePerPieceText = this.add
      .text(uiX + 140, levelBottomY + 76, "0.00", {
        fontSize: `${largeFontSize}px`,
        fill: "#ffffff",
        fontFamily: "Courier New",
        fontStyle: "bold",
        align: "right",
      })
      .setOrigin(1, 0);

    // Clear banner (line clear/spin indicator) - slides in from left of matrix
    this.createClearBannerUI(levelBottomY, scoreRowHeight, uiFontSize);

    // Piece per second displays - moved to right side of matrix, aligned with bottom of stack
    const ppsX = this.borderOffsetX + this.cellSize * this.board.cols + 20;
    const ppsY = this.borderOffsetY + this.playfieldHeight - 40; // Align with bottom of stack
    const spikeY = this.borderOffsetY + this.playfieldHeight * 0.5;

    // Attack metrics (above PPS)
    const atkLabelStyle = {
      fontSize: `${uiFontSize - 4}px`,
      fill: "#ffdd55",
      fontFamily: "Courier New",
      fontStyle: "bold",
      align: "right",
    };
    const atkValueStyle = {
      fontSize: `${largeFontSize}px`,
      fill: "#ffffff",
      fontFamily: "Courier New",
      fontStyle: "bold",
      align: "right",
    };
    const atkSubStyle = {
      fontSize: `${uiFontSize - 6}px`,
      fill: "#cccccc",
      fontFamily: "Courier New",
      fontStyle: "bold",
      align: "right",
    };

    const uiParent = this.overlayGroup || this.gameGroup;
    const atkX = uiX + 135;
    const atkBaseY = levelBottomY - 3.5 * levelRowHeight - 220; // moved up by 70px
    const atkRow = 18;
    this.vsLabel = this.add.text(atkX, atkBaseY, "VS", atkLabelStyle).setOrigin(1, 0);
    this.vsScoreText = this.add
      .text(atkX + 5, atkBaseY + atkRow, "0.00", {
        fontSize: `${largeFontSize - 8}px`,
        fill: "#a0d8ff",
        fontFamily: "Courier New",
        fontStyle: "bold",
        align: "right",
      })
      .setOrigin(1, 0);
    this.attackLabel = this.add.text(atkX, atkBaseY + atkRow * 2, "ATK", atkLabelStyle).setOrigin(1, 0);
    this.attackTotalText = this.add
      .text(atkX + 5, atkBaseY + atkRow * 3, "0", atkValueStyle)
      .setOrigin(1, 0);
    this.attackPerMinLabel = this.add
      .text(atkX, atkBaseY + atkRow * 4 + 4, "ATK/MIN", atkSubStyle)
      .setOrigin(1, 0);
    this.attackPerMinText = this.add
      .text(atkX + 5, atkBaseY + atkRow * 5 + 4, "0.00", {
        fontSize: `${largeFontSize - 6}px`,
        fill: "#cccccc",
        fontFamily: "Courier New",
        fontStyle: "bold",
        align: "right",
      })
      .setOrigin(1, 0);
    this.attackPerPieceLabel = this.add
      .text(atkX, atkBaseY + atkRow * 6 + 8, "ATK/PIECE", atkSubStyle)
      .setOrigin(1, 0);
    this.attackPerPieceText = this.add
      .text(atkX + 5, atkBaseY + atkRow * 7 + 8, "0.00", {
        fontSize: `${largeFontSize - 6}px`,
        fill: "#cccccc",
        fontFamily: "Courier New",
        fontStyle: "bold",
        align: "right",
      })
      .setOrigin(1, 0);
    this.spikeText = this.add
      .text(atkX, spikeY, "SPIKE 0", {
        fontSize: `${uiFontSize - 4}px`,
        fill: "#ffaa33",
        fontFamily: "Courier New",
        fontStyle: "bold",
        align: "right",
      })
      .setOrigin(1, 0)
      .setVisible(false);
    const attackUIElements = [
      this.vsLabel,
      this.vsScoreText,
      this.attackLabel,
      this.attackTotalText,
      this.attackPerMinLabel,
      this.attackPerMinText,
      this.attackPerPieceLabel,
      this.attackPerPieceText,
      this.spikeText,
    ];
    // Show attack metrics only in Zen (spike text is separately hidden during Ready/Go)
    const showAttackUI = isZenMode;
    attackUIElements.forEach((el) => {
      if (el === this.spikeText) {
        el.setVisible(isZenMode && !this.readyGoPhase);
      } else {
        el.setVisible(showAttackUI);
      }
      if (isZenMode) {
        el.setDepth(2000);
      }
    });
    uiParent.addMultiple(attackUIElements);

    if (isZenMode && typeof this.updateZenSandboxDisplay === "function") {
      this.updateZenSandboxDisplay();
    }

    // Finesse tracking display (sprint/ultra with SRS)
    const finesseMode = (this.zenSandboxConfig?.displayMode || "versus").toLowerCase();
    const finesseVisible =
      !!this.finesseEnabled &&
      (!this.isZenSandboxActive ||
        !this.isZenSandboxActive() ||
        finesseMode === "speed" ||
        finesseMode === "efficiency");
    const finesseY = ppsY - 110;
    const inputY = finesseY - 86; // moved up further
    this.finesseInputLabel = this.add
      .text(ppsX, inputY, "INPUTS", {
        fontSize: `${uiFontSize - 6}px`,
        fill: "#cccccc",
        fontFamily: "Courier New",
        fontStyle: "bold",
      })
      .setOrigin(0, 0)
      .setVisible(finesseVisible);
    this.finesseInputText = this.add
      .text(ppsX, inputY + 15, "0", {
        fontSize: `${uiFontSize - 2}px`,
        fill: "#ffffff",
        fontFamily: "Courier New",
        fontStyle: "bold",
      })
      .setOrigin(0, 0)
      .setVisible(finesseVisible);
    this.inputPerPieceLabel = this.add
      .text(ppsX, inputY + 30, "INPUT/PIECE", {
        fontSize: `${uiFontSize - 8}px`,
        fill: "#999999",
        fontFamily: "Courier New",
        fontStyle: "bold",
      })
      .setOrigin(0, 0)
      .setVisible(finesseVisible);
    this.inputPerPieceText = this.add
      .text(ppsX, inputY + 45, "0.00", {
        fontSize: `${uiFontSize - 4}px`,
        fill: "#ffffff",
        fontFamily: "Courier New",
        fontStyle: "bold",
      })
      .setOrigin(0, 0)
      .setVisible(finesseVisible);
    this.finesseTexts.header = this.add
      .text(ppsX, finesseY, "FINESSE", {
        fontSize: `${uiFontSize - 4}px`,
        fill: "#ffdd55",
        fontFamily: "Courier New",
        fontStyle: "bold",
      })
      .setOrigin(0, 0)
      .setVisible(finesseVisible);
    this.finesseTexts.streakAcc = this.add
      .text(ppsX, finesseY + 15, "0   100.0%", {
        fontSize: `${uiFontSize - 2}px`,
        fill: "#ffffff",
        fontFamily: "Courier New",
        fontStyle: "bold",
      })
      .setOrigin(0, 0)
      .setVisible(finesseVisible);
    this.finesseTexts.errors = this.add
      .text(ppsX, finesseY + 30, "0 errors", {
        fontSize: `${uiFontSize - 6}px`,
        fill: "#cccccc",
        fontFamily: "Courier New",
        fontStyle: "bold",
      })
      .setOrigin(0, 0)
      .setVisible(finesseVisible);
    uiParent.addMultiple([
      this.finesseInputLabel,
      this.finesseInputText,
      this.inputPerPieceLabel,
      this.inputPerPieceText,
      this.finesseTexts.header,
      this.finesseTexts.streakAcc,
      this.finesseTexts.errors,
    ]);

    // B2B chain display on left side, lower than clear banner
    const b2bX = this.borderOffsetX - 80; // align above stack near clear banner
    const b2bY = this.borderOffsetY + this.playfieldHeight / 2 - uiFontSize - 10;
    this.b2bChainText = this.add
      .text(b2bX, b2bY, "B2B x0", {
        fontSize: `${uiFontSize - 2}px`,
        fill: "#ffff55",
        fontFamily: "Courier New",
        fontStyle: "bold",
        align: "left",
      })
      .setOrigin(0, 0)
      .setDepth(2000)
      .setVisible(false);
    uiParent.add(this.b2bChainText);

    // Standard combo display (for sprint/ultra/marathon/zen)
    this.standardComboNumberText = this.add
      .text(0, 0, "0", {
        fontSize: `${uiFontSize}px`,
        fill: "#88ff88",
        fontFamily: "Courier New",
        fontStyle: "bold",
        align: "left",
      })
      .setOrigin(0, 0);
    this.standardComboLabelText = this.add
      .text(this.standardComboNumberText.width + 6, 2, "COMBO", {
        fontSize: `${uiFontSize - 4}px`,
        fill: "#88ff88",
        fontFamily: "Courier New",
        fontStyle: "bold",
        align: "left",
      })
      .setOrigin(0, 0);
    this.standardComboText = this.add
      .container(b2bX, b2bY - 24, [
        this.standardComboNumberText,
        this.standardComboLabelText,
      ])
      .setVisible(false);
    uiParent.add(this.standardComboText);

    this.hanabiLabel = this.add
      .text(ppsX, ppsY - 40, "HANABI", {
        fontSize: `${uiFontSize - 4}px`,
        fill: "#fff",
        fontFamily: "Courier New",
        fontStyle: "bold",
      })
      .setOrigin(0, 0);
    this.hanabiTextInGame = this.add
      .text(ppsX, ppsY - 25, "0", {
        fontSize: `${largeFontSize}px`,
        fill: "#ffff88",
        fontFamily: "Courier New",
        fontStyle: "bold",
        align: "left",
      })
      .setOrigin(0, 0);
    const showPieceCount =
      isZenMode || isUltraMode || isSprintMode || isMarathonMode;

    this.pieceCountLabel = this.add
      .text(ppsX, ppsY - 45, "PIECES", {
        fontSize: `${uiFontSize - 6}px`,
        fill: "#ccc",
        fontFamily: "Courier New",
        fontStyle: "bold",
      })
      .setOrigin(0, 0)
      .setVisible(showPieceCount);
    this.pieceCountText = this.add
      .text(ppsX, ppsY - 30, "0", {
        fontSize: `${largeFontSize - 4}px`,
        fill: "#fff",
        fontFamily: "Courier New",
        fontStyle: "bold",
        align: "left",
      })
      .setOrigin(0, 0)
      .setVisible(showPieceCount);

    this.ppsLabel = this.add
      .text(ppsX, ppsY, "PPS", {
        fontSize: `${uiFontSize - 4}px`,
        fill: "#fff",
        fontFamily: "Courier New",
        fontStyle: "bold",
      })
      .setOrigin(0, 0);
    this.ppsText = this.add
      .text(ppsX, ppsY + 15, "0.00", {
        fontSize: `${largeFontSize}px`,
        fill: "#fff",
        fontFamily: "Courier New",
        fontStyle: "bold",
        align: "left",
      })
      .setOrigin(0, 0);
    this.rawPpsLabel = this.add
      .text(ppsX, ppsY + 40, "RAW PPS", {
        fontSize: `${uiFontSize - 6}px`,
        fill: "#ccc",
        fontFamily: "Courier New",
        fontStyle: "bold",
      })
      .setOrigin(0, 0);
    this.rawPpsText = this.add
      .text(ppsX, ppsY + 55, "0.00", {
        fontSize: `${largeFontSize - 4}px`,
        fill: "#ccc",
        fontFamily: "Courier New",
        fontStyle: "bold",
        align: "left",
      })
      .setOrigin(0, 0);

    const showAsukaKitas = typeof modeId === "string" && modeId.startsWith("tgm4_asuka");
    this.asukaKitaLabel = this.add
      .text(ppsX, ppsY - 85, "KITAS", {
        fontSize: `${uiFontSize - 6}px`,
        fill: "#ccc",
        fontFamily: "Courier New",
        fontStyle: "bold",
      })
      .setOrigin(0, 0)
      .setVisible(showAsukaKitas);
    this.asukaKitaText = this.add
      .text(ppsX, ppsY - 70, "0", {
        fontSize: `${largeFontSize - 4}px`,
        fill: "#ffff88",
        fontFamily: "Courier New",
        fontStyle: "bold",
        align: "left",
      })
      .setOrigin(0, 0)
      .setVisible(showAsukaKitas);

    // Show Hanabi counter only in Easy mode
    const showHanabi = modeId === "tgm3_easy";
    if (this.hanabiLabel) this.hanabiLabel.setVisible(showHanabi);
    if (this.hanabiTextInGame) this.hanabiTextInGame.setVisible(showHanabi);

    const clearSectionTrackerRefs = () => {
      this.ppsSummaryText = null;
      this.ppsGraphGraphics = null;
      this.ppsGraphArea = null;
      this.ppsLegendText = null;
      this.halfTimeTexts = null;
      this.sectionSectionLabels = null;
      this.sectionTimeTexts = null;
      this.sectionTotalTexts = null;
      this.sectionTallyTexts = null;
    };

    const shouldShowSectionTracker =
      !(isUltraMode || isZenMode) && modeId !== "tgm3_sakura";
    const shouldShowZenPanel = isZenMode && this.zenSandboxConfig;
    if (this.sectionTrackerGroup) {
      this.sectionTrackerGroup.destroy(true);
      this.sectionTrackerGroup = null;
      clearSectionTrackerRefs();
    }
    if (this.zenSandboxPanelGroup) {
      this.zenSandboxPanelGroup.destroy(true);
      this.zenSandboxPanelGroup = null;
    }

    if (!shouldShowSectionTracker) {
      clearSectionTrackerRefs();
    }

    if (shouldShowSectionTracker) {
      const trackerX = Math.max(20, this.borderOffsetX - 430);
      const trackerWidth = 240;
      const gradePanelLeftX = hasGrading ? uiX + 25 : uiX;
      const shouldShiftTrackerDown = trackerX + trackerWidth >= gradePanelLeftX - 10;
      const trackerY = shouldShiftTrackerDown
        ? this.borderOffsetY + 170
        : this.borderOffsetY - 10;
      const sectionRowHeight = Math.max(16, Math.floor(this.cellSize * 0.6));
      this.sectionTrackerGroup = this.add.container(trackerX, trackerY);

      const isTgm2Normal =
      modeId === "tgm2_normal" || modeId === "normal" || modeId === "tgm2normal";

      if (isSprintMode) {
        const header = this.add.text(0, 0, "PPS GRAPH", {
          fontSize: `${uiFontSize}px`,
          fill: "#fff",
          fontFamily: "Courier New",
          fontStyle: "bold",
        });
        this.sectionTrackerGroup.add(header);

        const graphWidth = 120;
        const graphY = sectionRowHeight + 6;
        const graphMargin = graphY; // keep bottom margin equal to top margin
        const graphHeight = Math.max(
          140,
          this.scale.height - (trackerY + graphY + graphMargin),
        );
        this.ppsGraphArea = {
          x: 0,
          y: graphY,
          width: graphWidth,
          height: graphHeight,
        };
        this.ppsGraphGraphics = this.add.graphics();
        this.sectionTrackerGroup.add(this.ppsGraphGraphics);

        // Summary text under graph
        const summaryStyle = {
          fontSize: `${uiFontSize - 6}px`,
          fill: "#ccc",
          fontFamily: "Courier New",
          fontStyle: "bold",
        };
        this.ppsSummaryText = this.add.text(
          0,
          graphY + graphHeight + 6,
          "Max PPS: -- | Worst choke: --",
          summaryStyle,
        );
        this.sectionTrackerGroup.add(this.ppsSummaryText);

        // Legend: clarify that top of chart is most recent
        const legendStyle = {
          fontSize: `${uiFontSize - 8}px`,
          fill: "#ccc",
          fontFamily: "Courier New",
          fontStyle: "bold",
        };
        this.ppsLegendText = this.add.text(
          -70,
          graphY + graphHeight * 0.5,
          "← TIME",
          legendStyle,
        ).setAngle(90);
        this.ppsLegendText.setOrigin(0.5, 0.5);
        this.sectionTrackerGroup.add(this.ppsLegendText);

        const yLabel = this.add.text(
          graphWidth + 6,
          graphY - 6,
          "PPS",
          {
            fontSize: `${uiFontSize - 6}px`,
            fill: "#ccc",
            fontFamily: "Courier New",
            fontStyle: "bold",
          },
        );
        this.sectionTrackerGroup.add(yLabel);
      } else {
        const header = this.add.text(0, 0, "SECTIONS", {
          fontSize: `${uiFontSize}px`,
          fill: "#fff",
          fontFamily: "Courier New",
          fontStyle: "bold",
        });
        this.sectionTrackerGroup.add(header);

        const sectionLabelFontSize = Math.max(10, uiFontSize - 6);
        const sectionTimeFontSize = Math.max(12, uiFontSize - 4);
        const rowLineHeight = Math.max(12, Math.floor(sectionLabelFontSize * 1.1));
        const rowHeight = rowLineHeight +
          Math.max(14, Math.floor(sectionTimeFontSize * 1.1));

        this.halfTimeTexts = null;
        let tableStartY = sectionRowHeight;
        const isShiraseMode =
          modeId === "tgm3_shirase" || modeId === "shirase" || modeId === "tgm3_shirase_mode";
        const isEasyMode = modeId === "tgm3_easy";

        if (!isTgm2Normal && !isMarathonMode && !isShiraseMode && !isEasyMode) {
          const colWidth = 120;
          const labelStyle = {
            fontSize: `${sectionLabelFontSize}px`,
            fill: "#ccc",
            fontFamily: "Courier New",
            fontStyle: "bold",
          };
          const timeStyle = {
            fontSize: `${sectionTimeFontSize}px`,
            fill: "#fff",
            fontFamily: "Courier New",
            fontStyle: "bold",
          };

          const half1Label = this.add.text(
            0,
            sectionRowHeight,
            "1ST HALF",
            labelStyle,
          );
          const half1Time = this.add.text(
            0,
            sectionRowHeight + rowLineHeight,
            "--:--.--",
            timeStyle,
          );
          const half2Label = this.add
            .text(colWidth, sectionRowHeight, "2ND HALF", labelStyle)
            .setVisible(false);
          const half2Time = this.add
            .text(colWidth, sectionRowHeight + rowLineHeight, "--:--.--", timeStyle)
            .setVisible(false);

          this.sectionTrackerGroup.add([half1Label, half1Time, half2Label, half2Time]);
          this.halfTimeTexts = [
            { label: half1Label, time: half1Time },
            { label: half2Label, time: half2Time },
          ];

          tableStartY = sectionRowHeight + rowHeight + 6;
        }

        this.sectionSectionLabels = [];
        this.sectionTimeTexts = [];
        this.sectionTotalTexts = [];

        this.sectionTallyTexts = [];
        const sectionLength = this.getSectionLength();
        const maxSections = this.getMaxSectionsForTracker();
        const trackerMaxLevel =
          this.gameMode && typeof this.gameMode.getGravityLevelCap === "function"
            ? (typeof this.gameMode.getDisplayLevelCap === "function"
                ? this.gameMode.getDisplayLevelCap()
                : this.gameMode.getGravityLevelCap())
            : this.gravityLevelCap || 999;
        for (let i = 0; i < maxSections; i++) {
          const sectionStart = i * sectionLength;
          const sectionEnd = i === maxSections - 1
            ? trackerMaxLevel
            : sectionStart + sectionLength - 1;
          const y = tableStartY + i * rowHeight;

          const label = this.add.text(
            0,
            y,
            `${sectionStart.toString().padStart(3, "0")}-${sectionEnd
              .toString()
              .padStart(3, "0")}`,
            {
              fontSize: `${sectionLabelFontSize}px`,
              fill: "#ccc",
              fontFamily: "Courier New",
              fontStyle: "bold",
            },
          );
          const timeText = this.add.text(0, y + rowLineHeight, "--:--.--", {
            fontSize: `${sectionTimeFontSize}px`,
            fill: "#fff",
            fontFamily: "Courier New",
            fontStyle: "bold",
          });

          const tallyText = this.add.text(140, y, "", {
            fontSize: `${sectionLabelFontSize}px`,
            fill: "#fff",
            fontFamily: "Courier New",
            fontStyle: "bold",
          });
          const perfText = this.add.text(200, y, "", {
            fontSize: `${Math.max(sectionLabelFontSize - 2, 12)}px`,
            fill: "#ffff55",
            fontFamily: "Courier New",
            fontStyle: "bold",
          });
          const totalText = this.add.text(140, y + rowLineHeight, "--:--.--", {
            fontSize: `${sectionTimeFontSize}px`,
            fill: "#fff",
            fontFamily: "Courier New",
            fontStyle: "bold",
          });

          label.setVisible(false);
          timeText.setVisible(false);
          tallyText.setVisible(false);
          perfText.setVisible(false);
          totalText.setVisible(false);

          this.sectionTrackerGroup.add([label, timeText, tallyText, perfText, totalText]);
          this.sectionSectionLabels.push(label);
          this.sectionTimeTexts.push(timeText);
          this.sectionTallyTexts.push(tallyText);
          this.sectionPerfTexts.push(perfText);
          this.sectionTotalTexts.push(totalText);
        }

        // Staff roll grade bonus display placeholder
        const rollBonusY = tableStartY + maxSections * rowHeight + 6;
        this.staffRollBonusText = this.add.text(0, rollBonusY, "ROLL BONUS: --", {
          fontSize: `${sectionLabelFontSize}px`,
          fill: "#ccc",
          fontFamily: "Courier New",
          fontStyle: "bold",
        });
        this.sectionTrackerGroup.add(this.staffRollBonusText);
        // Hidden by default; only shown during TGM3 credits roll
        this.staffRollBonusText.setVisible(false);

        // TAP internal grade (TGM2-style mapping, no COOL bonus)
        const tapGradeY = rollBonusY + rowHeight;
        this.tapInternalGradeText = this.add.text(0, tapGradeY, "TAP GRADE: --", {
          fontSize: `${sectionLabelFontSize}px`,
          fill: "#ffffaa",
          fontFamily: "Courier New",
          fontStyle: "bold",
        });
        this.sectionTrackerGroup.add(this.tapInternalGradeText);
        this.tapInternalGradeText.setVisible(false);
      }
    }

    // Zen sandbox panel (left side, above everything)
    if (
      shouldShowZenPanel &&
      typeof ZenSandboxHelper !== "undefined" &&
      typeof ZenSandboxHelper.renderPanel === "function"
    ) {
      const panelX = Math.max(20, this.borderOffsetX - 750);
      const panelY = Math.max(10, this.borderOffsetY - 30);
      const panel = ZenSandboxHelper.renderPanel(this, this.zenSandboxConfig, {
        x: panelX,
        y: panelY,
        cellSize: this.cellSize,
      });
      if (panel && typeof panel.setDepth === "function") {
        panel.setDepth(10000);
      }
    }

    // Time - centered below border, larger font, bold
    if (this.timeText && !this.timeText.scene) {
      this.timeText = null;
    }
    if (!this.timeText) {
      this.timeText = this.add
        .text(
          this.borderOffsetX + this.playfieldWidth / 2,
          this.borderOffsetY + this.playfieldHeight + 50,
          "0:00.00",
          {
            fontSize: `${timeFontSize}px`,
            fill: "#fff",
            fontFamily: "Courier New",
            fontStyle: "bold",
            align: "center",
          },
        )
        .setOrigin(0.5, 0);
      // COOL/REGRET banner above stopwatch
      this.coolRegretText = this.add
        .text(
          this.borderOffsetX + this.playfieldWidth / 2,
          this.borderOffsetY + this.playfieldHeight + 22,
          "",
          {
            fontSize: `${Math.max(timeFontSize - 4, 18)}px`,
            fill: "#ffff55",
            fontFamily: "Courier New",
            fontStyle: "bold",
            align: "center",
          },
        )
        .setOrigin(0.5, 0.5)
        .setVisible(false)
        .setDepth(9999);
    } else {
      // Update position and style if text already exists
      this.timeText.setPosition(
        this.borderOffsetX + this.playfieldWidth / 2,
        this.borderOffsetY + this.playfieldHeight + 50,
      );
      this.timeText.setStyle({ fontSize: `${timeFontSize}px` });
    }

    // Playfield border - adjusted to fit exactly 10x20 with smaller width and height
    // Use mode type color for border
    const modeTypeColor = this.getModeTypeBorderColor();
    this.playfieldBorder = this.add.graphics();
    this.playfieldBorder.lineStyle(3, modeTypeColor);
    this.playfieldBorder.strokeRect(
      this.borderOffsetX - 4,
      this.borderOffsetY - 3,
      this.cellSize * this.board.cols + 4,
      this.cellSize * this.visibleRows + 5,
    ); // Height reduced by 1px, width expanded 1px left
  }

  create() {
    // Initialize game elements here (spawn deferred until after READY/GO)
    this.gameGroup = this.add.group();
    ensureMonochromeMinoTextures(this);
    // Overlay group for transient UI (e.g., READY/GO) that must survive draw() clears
    this.overlayGroup = this.add.group();
    this.hanabiContainer = this.add.group();
    this.hintGraphics = this.add.graphics({
      lineStyle: { width: 2, color: 0x00e0ff, alpha: 0.5 },
    });
    this.powerupEffectHandler =
      typeof PowerupEffectHandler !== "undefined"
        ? new PowerupEffectHandler(this)
        : null;
    this.pendingPowerup = null;
    this.powerupSpawned = { free_fall: false, del_even: false };
    this.powerupCells = new Map();
    const powerupLabelSize = Math.max(12, Math.floor(this.cellSize * 0.6));
    this.powerupStatusText = this.add.text(
      this.borderOffsetX,
      this.borderOffsetY - 28,
      "",
      {
        fontSize: `${powerupLabelSize}px`,
        fill: "#0ff",
        fontFamily: "Courier New",
        fontStyle: "bold",
      },
    );
    this.gameGroup.add(this.powerupStatusText);
    this.cursors = this.input.keyboard.createCursorKeys();

    // Scene instances can be reused across restarts; reset runtime flags/timers.
    this.board = new Board();
    this.board.scene = this;
    this.currentPiece = null;
    this.holdPiece = null;
    this.canHold = true;
    this.holdRequest = false;
    this.nextPieces = [];
    this.pairsQueue = [];
    this.lastClassicPiece = null;
    this.areActive = false;
    this.areTimer = 0;
    this.isClearingLines = false;
    this.clearedLines = [];
    this.lineClearPhase = false;

    this.score = 0;
    this.totalLines = 0;
    this.piecesPlaced = 0;
    this.comboCount = -1;
    this.backToBack = false;
    this.lastClearType = null;
    this.lastPieceType = null;
    this.totalAttack = 0;
    this.attackSpike = 0;
    this.lastAttackTime = 0;
    this.b2bChainCount = -1;
    this.standardComboCount = -1;
    this.standardComboLastLineTime = 0;
    if (this.standardComboNumberText && this.standardComboLabelText) {
      this.standardComboNumberText.setText("0");
      this.standardComboLabelText.setText("COMBO");
      this.standardComboLabelText.setX(this.standardComboNumberText.width + 6);
    }
    if (this.standardComboText) {
      this.standardComboText.setVisible(false);
      this.standardComboText.setAlpha(1);
      this.standardComboText.setScale(1);
    }
    if (this.b2bChainText) {
      this.b2bChainText.setText("B2B x0");
      this.b2bChainText.setVisible(false);
      this.b2bChainText.setColor("#ffff55");
      this.b2bChainText.setAlpha(1);
      this.b2bChainText.setScale(1);
    }
    if (this.hideClearBanner) this.hideClearBanner();

    this.level = this.startingLevel != null ? this.startingLevel : 0;
    this.currentSection = Math.floor(this.getSectionBasisValue() / this.getSectionLength());
    this.sectionStartTime = 0;
    this.sectionTimes = [];
    this.sectionTetrises = [];
    this.currentSectionTetrisCount = 0;

    this.isGrounded = false;
    this.lockDelay = 0;
    this.lockDelayBufferedStart = false;
    this.skipDASMovementAfterSpawn = false;
    this.stackAlpha = 0.8;

    // Reset randomizer / first-spawn logic so the first spawned piece does not increment level.
    this.pieceHistory = ["Z", "Z", "S", "S"];
    this.pieceHistoryIndex = 0;
    this.firstPiece = true;
    this.isFirstSpawn = true;
    this.bagQueue = this.createShuffledBag();
    this.bagDrawCount = 0;
    this.bagDebugSeen = new Set();
    this.guidelineBagSeed = null;
    this.validatePieceHistory();

    // Start with an empty preview queue; generateNextPieces will fill using the active randomizer
    this.nextPieces = [];

    // Reset stack/credits/fade systems
    this.invisibleStackActive = false;
    this.fadingRollActive = false;
    this.minoFadeActive = false;
    this.minoFadeProgress = 0;
    this.minoFadeTimer = 0;
    this.minoFadePerRowDuration = 0;
    this.placedMinos = [];
    this.placedMinoRows = [];
    this.fadingComplete = false;
    this.minoRowFadeAlpha = {};
    this.gameOverFadeDoneTime = null;
    this.showGameOverText = false;
    this.gameOverTextTimer = 0;
    this.gameOverSfxPlayed = false;
    this.creditsPending = false;
    this.creditsActive = false;
    this.creditsTimer = 0;
    this.creditsDuration = 61.6;
    this.creditsBgmStarted = false;
    this.creditsTransitionStartTime = null;
    this.rollFadeLastExpireTime = 0;
    this.gradeLineColor = "none";
    this.congratulationsActive = false;
    this.gameComplete = false;
    this.sprintCompleted = false;

    this.gameOver = false;
    this.gameOverTimer = 0;
    this.isPaused = false;
    this.pauseStartTime = null;
    this.totalPausedTime = 0;
    this.level999Reached = false;
    this.readyGoPhase = false;
    this.loadingPhase = true;
    this.gameStarted = false;

    // Ensure layout values are correct for UI drawing (level bar, border, etc.)
    this.calculateLayout();

    this.events.once("shutdown", () => {
      if (this.bgmLoopTimer) {
        this.bgmLoopTimer.remove(false);
        this.bgmLoopTimer = null;
      }
      if (this.currentBGM) {
        this.currentBGM.stop();
        this.currentBGM = null;
      }
      const bgmObjects = [
        this.stage1BGM,
        this.stage2BGM,
        this.tgm2_stage1,
        this.tgm2_stage2,
        this.tgm2_stage3,
        this.tgm2_stage4,
      ];
      bgmObjects.forEach((bgm) => {
        if (bgm) {
          bgm.stop();
          bgm.destroy();
        }
      });
      this.stage1BGM = null;
      this.stage2BGM = null;
      this.tgm2_stage1 = null;
      this.tgm2_stage2 = null;
      this.tgm2_stage3 = null;
      this.tgm2_stage4 = null;
      if (this.tweens) this.tweens.killAll();
      if (this.time) this.time.removeAllEvents();

      // Clear UI refs
      this.timeText = null;
      this.levelLabel = null;
      this.levelDisplayLabel = null;
      this.levelDisplayText = null;
      this.currentLevelText = null;
      this.capLevelText = null;
      this.levelBar = null;
      this.scoreLabel = null;
      this.scoreText = null;
      this.ppsLabel = null;
      this.ppsText = null;
      this.pieceCountLabel = null;
      this.pieceCountText = null;
      this.rawPpsLabel = null;
      this.rawPpsText = null;
      this.gradeDisplay = null;
      this.gradeText = null;
      this.gradePointsText = null;
      this.nextGradeText = null;
      this.playfieldBorder = null;
      this.minoRowFadeAlpha = null;
      if (this.hanabiLabel) this.hanabiLabel.destroy();
      if (this.hanabiTextInGame) this.hanabiTextInGame.destroy();
      if (this.asukaKitaLabel) this.asukaKitaLabel.destroy();
      if (this.asukaKitaText) this.asukaKitaText.destroy();
      this.hanabiLabel = null;
      this.hanabiTextInGame = null;
      this.asukaKitaLabel = null;
      this.asukaKitaText = null;
    });

    const keybinds = (() => {
      const defaultKeybinds = {
        moveLeft: Phaser.Input.Keyboard.KeyCodes.Z,
        moveRight: Phaser.Input.Keyboard.KeyCodes.C,
        softDrop: Phaser.Input.Keyboard.KeyCodes.S,
        rotateCW: Phaser.Input.Keyboard.KeyCodes.K,
        rotateCW2: Phaser.Input.Keyboard.KeyCodes.UP,
        rotateCCW: Phaser.Input.Keyboard.KeyCodes.SPACE,
        rotateCCW2: Phaser.Input.Keyboard.KeyCodes.L,
        rotate180: Phaser.Input.Keyboard.KeyCodes.X,
        hardDrop: Phaser.Input.Keyboard.KeyCodes.X,
        hold: Phaser.Input.Keyboard.KeyCodes.SHIFT,
        pause: Phaser.Input.Keyboard.KeyCodes.ESC,
        menu: Phaser.Input.Keyboard.KeyCodes.M,
        restart: Phaser.Input.Keyboard.KeyCodes.ENTER,
      };
      const stored = localStorage.getItem("keybinds");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          return { ...defaultKeybinds, ...parsed };
        } catch (e) {}
      }
      return defaultKeybinds;
    })();

    const ensureKeyCode = (code, fallback) =>
      Number.isInteger(code) ? code : fallback;
    const makeKey = (keyCode, fallback) =>
      this.input.keyboard.addKey(ensureKeyCode(keyCode, fallback));

    this.keys = {
      left: makeKey(keybinds.moveLeft, Phaser.Input.Keyboard.KeyCodes.Z),
      right: makeKey(keybinds.moveRight, Phaser.Input.Keyboard.KeyCodes.C),
      softDrop: makeKey(keybinds.softDrop, Phaser.Input.Keyboard.KeyCodes.S),
      hardDrop: makeKey(keybinds.hardDrop, Phaser.Input.Keyboard.KeyCodes.X),
      rotateCW: makeKey(keybinds.rotateCW, Phaser.Input.Keyboard.KeyCodes.K),
      rotateCW2: makeKey(keybinds.rotateCW2, Phaser.Input.Keyboard.KeyCodes.UP),
      rotateCCW: makeKey(
        keybinds.rotateCCW,
        Phaser.Input.Keyboard.KeyCodes.SPACE,
      ),
      rotateCCW2: makeKey(keybinds.rotateCCW2, Phaser.Input.Keyboard.KeyCodes.L),
      rotate180: makeKey(keybinds.rotate180, Phaser.Input.Keyboard.KeyCodes.X),
      hold: makeKey(keybinds.hold, Phaser.Input.Keyboard.KeyCodes.SHIFT),
      pause: makeKey(keybinds.pause, Phaser.Input.Keyboard.KeyCodes.ESC),
      menu: makeKey(keybinds.menu, Phaser.Input.Keyboard.KeyCodes.M),
      restart: makeKey(keybinds.restart, Phaser.Input.Keyboard.KeyCodes.ENTER),
    };

    this.input.keyboard.addCapture([
      keybinds.moveLeft,
      keybinds.moveRight,
      keybinds.softDrop,
      keybinds.hardDrop,
      keybinds.rotateCW,
      keybinds.rotateCW2,
      keybinds.rotateCCW,
      keybinds.rotateCCW2,
      keybinds.rotate180,
      keybinds.hold,
      keybinds.pause,
      keybinds.menu,
      keybinds.restart,
    ]);
    this.restartKey = this.keys.restart;

    // Initialize time tracking; actual start time is set on GO
    this.startTime = null;
    this.gameStartTime = null;
    this.currentTime = 0;
    this.sectionStartTime = 0;
    this.currentSection = Math.floor(this.getSectionBasisValue() / this.getSectionLength());
    this.currentSectionTetrisCount = 0;
    this.section70Captured = new Set();
    if (Array.isArray(this.sectionCoolTimes)) {
      this.sectionCoolTimes = [];
    }
    this.tgm3BagQueue = [];
    this.tgm3DroughtCounters = null;
    this.bravoActive = false;
    if (this.bravoHideEvent) {
      this.bravoHideEvent.remove(false);
      this.bravoHideEvent = null;
    }
    if (this.bravoText) {
      this.bravoText.setVisible(false);
    }
    this.bgmInternalLevelBuffer = 0;
    this.totalPausedTime = 0;
    this.isPaused = false;
    this.pauseStartTime = null;

    // Initialize game mode first so grading/config is ready
    if (this.gameMode && this.gameMode.initializeGameState) {
      this.gameMode.initializeForGameScene(this);
    }
    // Ensure grade is initialized at mode start (before UI and first piece)
    this.applyInitialGradeFromMode();

    // UI
    this.setupUI();

    // Initialize BGM system (playback deferred until first spawn)
    this.initializeBGM();
    this.bgmStarted = false;
    // Ensure any leftover BGM from previous scene is stopped
    this.stopCurrentBGM();
    this.applyEffectiveVolumesScene();

    // Prepare next queue (but do not spawn yet)
    if (this.nextPieces.length < 6) {
      this.generateNextPieces();
    }

    // Initialize versus mode networking if match data is present
    if (window.__versusMatchData || (this.gameMode && this.gameMode.getConfig &&
        this.gameMode.getConfig().specialMechanics &&
        this.gameMode.getConfig().specialMechanics.versus)) {
      initVersusMode(this);
    }

    // Show READY/GO; spawn will occur after GO
    this.loadingPhase = false;
    this.showReadyGo();

    createOrUpdateGlobalOverlay(this, this.getOverlayModeInfo());
  }

  initializeBGM() {
    try {
      const addTrack = (key, opts = {}) => {
        const base = 0.5;
        const vol = base * this.getMasterVolumeSetting() * this.getBGMVolumeSetting();
        return this.sound.add(key, { loop: false, volume: vol, ...opts });
      };
      this.bgmTracks = {
        mf1_1: addTrack("mf1_1", { loop: true }),
        mf1_2: addTrack("mf1_2", { loop: true }),
        mf1_endroll: addTrack("mf1_endroll", { loop: true }),
        mf2_3: addTrack("mf2_3", { loop: true }),
        mf2_4: addTrack("mf2_4", { loop: true }),
        mf2_endroll: addTrack("mf2_endroll", { loop: true }),
        mf3_4: addTrack("mf3_4", { loop: true }),
        mf3_6: addTrack("mf3_6", { loop: true }),
        mf4_endgame: addTrack("mf4_endgame", { loop: true }),
        mf_zen: addTrack("mf_zen", { loop: true }),
        mf_std_1: addTrack("mf_std_1", { loop: true }),
        mf_std_2: addTrack("mf_std_2", { loop: true }),
        mf_std_3: addTrack("mf_std_3", { loop: true }),
      };
      this.stage1BGM = this.bgmTracks.mf1_1;
      this.stage2BGM = this.bgmTracks.mf1_2;
      this.currentBgmKey = null;
      this.bgmStarted = false;
    } catch (error) {
      console.error(
        "Failed to initialize BGM audio objects. BGM functionality may be limited.",
        error,
      );
    }
  }

  startInitialBGM() {
    if (!this.bgmEnabled) return;
    this.bgmStarted = true;
    this.updateBGM();
  }

  updateBGM() {
    if (!this.bgmEnabled || !this.bgmStarted) return;
    this.updateModeBGM();
  }

  getMasterVolumeSetting() {
    const v = localStorage.getItem("masterVolume");
    return v ? parseFloat(v) : 1.0;
  }

  getBGMVolumeSetting() {
    const v = localStorage.getItem("bgmVolume");
    return v ? parseFloat(v) : 1.0;
  }

  getSFXVolumeSetting() {
    const v = localStorage.getItem("sfxVolume");
    return v ? parseFloat(v) : 1.0;
  }

  getSfxVolumeFactor(base = 1) {
    return base * this.getMasterVolumeSetting() * this.getSFXVolumeSetting();
  }

  playSfx(key, baseVolume = 1) {
    const vol = this.getSfxVolumeFactor(baseVolume);
    try {
      return this.sound?.add(key, { volume: vol })?.play();
    } catch (e) {
      console.warn("Sfx play error", key, e);
    }
    return null;
  }

  showCoolRegretBanner(kind) {
    // Recreate banner if missing (defensive)
    if (!this.coolRegretText) {
      const fontSize = this.timeText?.style?.fontSize || `${Math.max(this.uiScale * 24, 18)}px`;
      this.coolRegretText = this.add
        .text(
          this.borderOffsetX + this.playfieldWidth / 2,
          this.borderOffsetY + this.playfieldHeight + 22,
          "",
          {
            fontSize,
            fill: "#ffff55",
            fontFamily: "Courier New",
            fontStyle: "bold",
            align: "center",
          },
        )
        .setOrigin(0.5, 0.5)
        .setVisible(false)
        .setDepth(9999);
    }
    // Clear previous timers
    if (this.coolRegretBlinkEvent) {
      this.coolRegretBlinkEvent.remove(false);
      this.coolRegretBlinkEvent = null;
    }
    if (this.coolRegretHideEvent) {
      this.coolRegretHideEvent.remove(false);
      this.coolRegretHideEvent = null;
    }

    const upperKind = (kind || "").toUpperCase();
    this.coolRegretText.setText(upperKind);
    this.coolRegretText.setVisible(true);
    this.coolRegretText.setAlpha(1);
    this.coolRegretText.setColor("#ffff55");
    this.children.bringToTop(this.coolRegretText);

    // Blink between yellow and white every 150ms for 3s total
    let toggle = false;
    this.coolRegretBlinkEvent = this.time.addEvent({
      delay: 150,
      loop: true,
      callback: () => {
        toggle = !toggle;
        this.coolRegretText.setColor(toggle ? "#ffffff" : "#ffff55");
      },
    });
    this.coolRegretHideEvent = this.time.delayedCall(
      3000,
      () => {
        if (this.coolRegretBlinkEvent) {
          this.coolRegretBlinkEvent.remove(false);
          this.coolRegretBlinkEvent = null;
        }
        this.coolRegretText.setVisible(false);
      },
      [],
      this,
    );

    // Play COOL sfx when applicable
    if (upperKind === "COOL") {
      this.playSfx("cool", 0.7);
    }
  }

  isBoardCompletelyEmpty() {
    if (!this.board || !Array.isArray(this.board.grid)) return false;
    // Treat any falsy cell (0, null, undefined) as empty to avoid mismatches across modes
    return this.board.grid.every((row) => row.every((cell) => !cell));
  }

  isAllClearAfterLines(linesToClear) {
    if (!this.board || !Array.isArray(this.board.grid)) return false;
    if (!Array.isArray(linesToClear) || linesToClear.length === 0) return false;
    const cleared = new Set(linesToClear);
    for (let r = 0; r < this.board.rows; r++) {
      if (cleared.has(r)) continue; // these rows will be removed
      const row = this.board.grid[r];
      if (!row || !row.every((cell) => !cell)) {
        return false; // found occupancy outside cleared rows
      }
    }
    return true;
  }

  showBravoBanner() {
    // Reuse if exists
    if (!this.bravoText) {
      const fontSize = this.timeText?.style?.fontSize || `${Math.max(this.uiScale * 28, 20)}px`;
      this.bravoText = this.add
        .text(
          this.borderOffsetX + this.playfieldWidth / 2,
          this.borderOffsetY + this.playfieldHeight / 2,
          "BRAVO!!",
          {
            fontSize,
            fill: "#ffdd44",
            fontFamily: "Courier New",
            fontStyle: "bold",
            align: "center",
          },
        )
        .setOrigin(0.5, 0.5)
        .setDepth(9999)
        .setAlpha(0);
      if (this.overlayGroup) {
        this.overlayGroup.add(this.bravoText);
      } else {
        this.gameGroup.add(this.bravoText);
      }
    }

    if (this.bravoHideEvent) {
      this.bravoHideEvent.remove(false);
      this.bravoHideEvent = null;
    }

    this.bravoActive = true;
    this.bravoText.setText("BRAVO!!");
    this.bravoText.setAlpha(0);
    this.bravoText.setScale(0);
    this.bravoText.setAngle(0);
    this.bravoText.setVisible(true);
    this.children.bringToTop(this.bravoText);

    try {
      this.sound?.add("firework", { volume: 0.85 })?.play();
    } catch {}

    // Timeline: grow + spin in 1s, then fade and slightly shrink over 3s
    const tl = this.tweens.createTimeline();
    tl.add({
      targets: this.bravoText,
      scale: { from: 0, to: 1 },
      alpha: { from: 0, to: 1 },
      angle: { from: 0, to: 360 },
      duration: 1000,
      ease: "Cubic.easeOut",
    });
    tl.add({
      targets: this.bravoText,
      scale: { from: 1, to: 0.9 },
      alpha: { from: 1, to: 0 },
      duration: 3000,
      ease: "Cubic.easeInOut",
    });
    tl.setCallback("onComplete", () => {
      if (this.bravoText) {
        this.bravoText.setVisible(false);
      }
      this.bravoActive = false;
      this.bravoHideEvent = null;
    });
    tl.play();
  }

  getAttackTableForSpin(spinType, lineClear) {
    const selectedAttackTable = this.getSelectedAttackTable();
    const basis = this.getSectionBasisValue();
    const pendingEntries = Object.entries(this.coolAnnouncementsTargets || {});
    if (pendingEntries.length === 0) return;

    pendingEntries.forEach(([secStr, target]) => {
      const sec = Number.parseInt(secStr, 10);
      if (typeof target !== "number" || this.coolAnnouncementsShown.has(sec)) return;
      const windowStart = target;
      const windowEnd = target + 11; // 80–90 inclusive if target is 80–90
      if (basis >= windowStart && basis <= windowEnd) {
        this.showCoolRegretBanner("COOL");
        this.coolAnnouncementsShown.add(sec);
        delete this.coolAnnouncementsTargets[sec];
      }
    });
  }

  checkCoolRegretAnnouncements() {
    const sectionLength = this.getSectionLength();
    const basis = this.getSectionBasisValue();
    const pendingEntries = Object.entries(this.coolAnnouncementsTargets || {});
    if (pendingEntries.length === 0) return;

    pendingEntries.forEach(([secStr, target]) => {
      const sec = Number.parseInt(secStr, 10);
      if (typeof target !== "number" || this.coolAnnouncementsShown.has(sec)) return;
      const windowStart = target;
      const windowEnd = target + 11; // 80–90 inclusive if target is 80–90
      if (basis >= windowStart && basis <= windowEnd) {
        this.showCoolRegretBanner("COOL");
        this.coolAnnouncementsShown.add(sec);
        delete this.coolAnnouncementsTargets[sec];
      }
    });
  }

  applyEffectiveVolumesScene() {
    const master = this.getMasterVolumeSetting();
    const bgm = this.getBGMVolumeSetting();
    const sfx = this.getSFXVolumeSetting();

    if (this.sound && typeof this.sound.setVolume === "function") {
      // Manager volume applies master only; per-sound uses sfx/base
      this.sound.setVolume(master);
    }

    if (this.bgmTracks) {
      Object.entries(this.bgmTracks).forEach(([key, track]) => {
        if (track && track.setVolume) {
          const base = 0.5; // consistent base
          track.setVolume(base * master * bgm);
        }
      });
    }

    if (this.currentBGM && this.currentBGM.setVolume) {
      const base = 0.5;
      this.currentBGM.setVolume(base * master * bgm);
    }
  }

  getBgmSchedule(modeId) {
    const sharedTGM1 = [
      { end: 499, key: "mf1_1" },
      { end: 999, key: "mf1_2" },
    ];
    const sharedTADeath = [
      { end: 299, key: "mf1_2" },
      { end: 499, key: "mf2_3" },
      { end: 999, key: "mf2_4" },
    ];
    const sharedShirase = [
      { end: 499, key: "mf2_4" },
      { end: 699, key: "mf3_4" },
      { end: 999, key: "mf1_2" },
      { end: 1299, key: "mf3_6" },
    ];
    const sharedAsuka = [
      { end: 999, key: "mf2_4" },
      { end: 1300, key: "mf3_4" },
    ];
    const schedules = {
      normal: { segments: [{ end: 299, key: "mf1_1" }, { end: 999, key: "mf1_2" }], credits: "mf2_endroll" },
      easy_normal: { segments: [{ end: 199, key: "mf1_1" }, { end: 999, key: "mf1_endroll" }], credits: "mf2_endroll" },
      easy_easy: { segments: [{ end: 199, key: "mf1_1" }, { end: 999, key: "mf1_endroll" }], credits: "mf1_endroll" },
      marathon: { segments: [{ end: 49, key: "mf_std_1" }, { end: 99, key: "mf_std_2" }, { end: 999, key: "mf_std_3" }], credits: "mf2_endroll" },
      sprint_40: { segments: [{ end: 999, key: "mf1_1" }] },
      sprint_100: { segments: [{ end: 999, key: "mf1_1" }] },
      ultra: { segments: [{ end: 999, key: "mf1_1" }] },
      zen: { segments: [{ end: 999, key: "mf_zen" }] },
      tgm1: { segments: sharedTGM1, credits: "mf2_endroll" },
      tgm_plus: { segments: sharedTGM1, credits: "mf2_endroll" },
      "master_20g": { segments: sharedTGM1, credits: "mf2_endroll" },
      tgm2: {
        segments: [
          { end: 499, key: "mf1_1" },
          { end: 699, key: "mf1_2" },
          { end: 899, key: "mf2_3" },
          { end: 999, key: "mf2_4" },
        ],
        credits: "mf2_endroll",
      },
      tgm3: {
        segments: [
          { end: 499, key: "mf1_1" },
          { end: 799, key: "mf1_2" },
          { end: 1899, key: "mf2_4" },
        ],
        credits: "mf2_endroll",
      },
      tgm4: {
        segments: [
          { end: 299, key: "mf1_1" },
          { end: 499, key: "mf1_2" },
          { end: 999, key: "mf2_3" },
        ],
        credits: "mf2_endroll",
      },
      tadeath: { segments: sharedTADeath, credits: "mf1_endroll" },
      shirase: { segments: sharedShirase, credits: "mf2_endroll" },
      tgm4_rounds: {
        segments: [
          { end: 299, key: "mf1_2" },
          { end: 699, key: "mf3_4" },
          { end: 999, key: "mf3_6" },
          { end: 1299, key: "mf2_3" },
          { end: 2600, key: "mf2_4" },
        ],
        credits: "mf2_endroll",
        endgame: "mf4_endgame",
      },
      tgm4_1_1: { segments: sharedTGM1, credits: "mf2_endroll" },
      tgm4_2_1: { segments: sharedTADeath, credits: "mf2_endroll" },
      tgm4_3_1: {
        segments: [
          { end: 499, key: "mf2_4" },
          { end: 999, key: "mf3_4" },
          { end: 1299, key: "mf1_2" },
          { end: 2000, key: "mf3_6" },
        ],
        credits: "mf2_endroll",
      },
      tgm4_4_1: { segments: [{ end: 999, key: "mf3_6" }], credits: "mf2_endroll" },
      asuka_easy: { segments: sharedAsuka },
      asuka_normal: { segments: sharedAsuka },
      asuka_hard: { segments: sharedAsuka },
      tgm3_sakura: { segments: [{ end: 999, key: "mf1_1" }] },
    };
    return schedules[modeId] || { segments: sharedTGM1, credits: "mf2_endroll" };
  }

  playBgmByKey(key) {
    if (!key || !this.bgmTracks || !this.bgmTracks[key]) return;
    const audio = this.bgmTracks[key];
    if (this.currentBGM && this.currentBGM !== audio) {
      this.currentBGM.stop();
    }
    audio.play({ loop: true });
    this.currentBGM = audio;
    this.currentBgmKey = key;
  }

  stopCurrentBGM() {
    if (this.currentBGM) {
      this.currentBGM.stop();
      this.currentBGM = null;
      this.currentBgmKey = null;
    }
  }

  updateModeBGM() {
    const modeId =
      (this.gameMode && typeof this.gameMode.getModeId === "function"
        ? this.gameMode.getModeId()
        : this.selectedMode) || "tgm1";

    // Custom BGM flow for Marathon: use line count with stop windows
    if (
      modeId === "marathon" &&
      this.gameMode &&
      typeof this.gameMode.linesCleared === "number"
    ) {
      const lines = this.gameMode.linesCleared;

      // Stop all music once the goal is hit
      if (lines >= 150) {
        this.stopCurrentBGM();
        return;
      }

      // Determine which track should be active, with intentional silent gaps
      let desiredKey = null;
      if (lines < 55) {
        desiredKey = "mf_std_1"; // lines 0-54
      } else if (lines < 60) {
        // Silent gap between 55-59
        this.stopCurrentBGM();
        return;
      } else if (lines < 115) {
        desiredKey = "mf_std_2"; // lines 60-114
      } else if (lines < 120) {
        // Silent gap between 115-119
        this.stopCurrentBGM();
        return;
      } else {
        desiredKey = "mf_std_3"; // lines 120-149
      }

      if (desiredKey && this.currentBgmKey !== desiredKey) {
        this.playBgmByKey(desiredKey);
      }
      return;
    }

    const schedule = this.getBgmSchedule(modeId);
    if (!schedule || !schedule.segments || !schedule.segments.length) return;

    const maxSegment = schedule.segments[schedule.segments.length - 1];
    const internalLevel =
      this.gameMode && typeof this.gameMode.internalLevel === "number"
        ? this.gameMode.internalLevel
        : this.level;
    const bgmStopLevel =
      this.gameMode && typeof this.gameMode.bgmStopLevel === "number"
        ? this.gameMode.bgmStopLevel
        : internalLevel;
    const stopLevel = Math.max(
      bgmStopLevel,
      typeof this.bgmInternalLevelBuffer === "number" ? this.bgmInternalLevelBuffer : 0,
    );
    let segment = schedule.segments.find((s) => internalLevel <= s.end);
    if (!segment) segment = maxSegment;
    const isLast = segment === maxSegment;

    // Stop 10 levels early unless in final segment
    if (!isLast && stopLevel >= segment.end - 9) {
      this.stopCurrentBGM();
      return;
    }

    if (this.currentBgmKey !== segment.key) {
      this.playBgmByKey(segment.key);
    }
  }

  // Legacy loop-point manager kept for compatibility; no-op with unified BGM
  manageBGMLoopMode() {}

  showReadyGo() {
    this.readyGoPhase = true;
    const centerX = this.game.config.width / 2;
    const centerY = this.game.config.height / 2;

    // Re-apply zen display rules during Ready/Go (hide PPS/pieces when displayMode is "none")
    if (typeof this.updateZenSandboxDisplay === "function") {
      this.updateZenSandboxDisplay();
    }

    // Pre-initialize PPS/UI at scene display so sprint modes start at zero
    this.totalPiecesPlaced = 0;
    this.activeTime = 0;
    this.areTime = 0;
    this.conventionalPPS = 0;
    this.rawPPS = 0;
    this.maxPpsRecorded = 0;
    this.worstChoke = 0;
    this.ppsHistory = [];
    this.ppsLockSampleIndices = [];
    this.ppsSampleTimer = 0;
    this.lastPpsRecordedPieceCount = 0;
    if (this.ppsText) this.ppsText.setText("0.00");
    if (this.pieceCountText) this.pieceCountText.setText("0");
    if (this.rawPpsText) this.rawPpsText.setText("0.00");
    if (this.ppsGraphGraphics) this.ppsGraphGraphics.clear();
    if (this.ppsSummaryText && this.ppsSummaryText.scene) {
      this.ppsSummaryText.setText("Max PPS: -- | Worst choke: --");
    }

    // Prepare first piece during Ready/Go so it is visible (peek without consuming queue)
    if (!this.previewPiece) {
      if (this.nextPieces.length < 6) {
        this.generateNextPieces();
      }
      const rawNext = this.nextPieces[0];
      let pieceType =
        typeof rawNext === "string"
          ? rawNext
          : typeof rawNext?.type === "string"
            ? rawNext.type
            : typeof rawNext?.piece === "string"
              ? rawNext.piece
              : rawNext;
      if (typeof pieceType !== "string") {
        pieceType = "I";
      }
      pieceType = pieceType.toUpperCase();

      this.previewPiece = new Piece(pieceType, this.rotationSystem, 0);
    }

    const readyText = this.add
      .text(centerX, centerY, "READY", {
        fontSize: "64px",
        fill: "#ffff00",
        fontFamily: "Courier New",
        fontStyle: "bold",
      })
      .setOrigin(0.5);
    // Render Ready/Go above everything
    this.children.bringToTop(readyText);
    this.overlayGroup.add(readyText);
    readyText.setDepth(9999);

    const sfxReadyVol = 0.7 * this.getMasterVolumeSetting() * this.getSFXVolumeSetting();
    this.sound?.add("ready", { volume: sfxReadyVol })?.play();

    // Ensure Zen config is loaded before applying cheese
    if (!this.zenSandboxConfig && typeof ZenSandboxHelper !== "undefined" && ZenSandboxHelper.loadConfig) {
      this.zenSandboxConfig = ZenSandboxHelper.loadConfig();
    }
    // Seed a persistent cheese hole column for the session (fixed across injections when percent=0)
    if (this.board && !Number.isInteger(this.zenCheeseHoleCol)) {
      const cols = Number.isFinite(this.board.cols) && this.board.cols > 0 ? this.board.cols : 10;
      this.zenCheeseHoleCol = Math.floor(Math.random() * cols) % cols;
    }
    // Apply cheese previews in Zen sandbox modes (fixed_rows only; fixed_timing waits for first spawn)
    if (this.isZenSandboxActive && this.isZenSandboxActive() && this.board && this.zenSandboxConfig) {
      const { cheeseMode, cheeseRows, cheesePercent } = this.zenSandboxConfig;
      if (cheeseMode === "fixed_rows") {
        // Immediately inject target rows to avoid missing baseline at spawn
        if (typeof this.board.addCheeseRows === "function") {
          const rows = Math.max(1, Math.floor(Number(cheeseRows) || 1));
          const percent = Math.max(0, Math.min(100, Number(cheesePercent) || 0));
          this.board.addCheeseRows(rows, percent);
        }
        this.ensureZenCheeseBaseline?.(0);
      } else if (cheeseMode === "fixed_timing") {
        // Do not inject before first spawn; start timer at first spawn
        this.zenCheeseTimer = 0;
      }
    }

    this.time.delayedCall(1000, () => {
      readyText.destroy();

      const goText = this.add
        .text(centerX, centerY, "GO", {
          fontSize: "64px",
          fill: "#00ff00",
          fontFamily: "Courier New",
          fontStyle: "bold",
        })
        .setOrigin(0.5);
      this.children.bringToTop(goText);
      this.overlayGroup.add(goText);
      goText.setDepth(9999);

      const sfxGoVol = 0.7 * this.getMasterVolumeSetting() * this.getSFXVolumeSetting();
      this.sound?.add("go", { volume: sfxGoVol })?.play();

      this.time.delayedCall(500, () => {
        goText.destroy();
        this.readyGoPhase = false;
        this.gameStarted = true;
        // Start timer at GO
        this.startTime = Date.now();
        this.gameStartTime = this.startTime;
        this.currentTime = 0;
        this.sectionStartTime = 0;
        // Hard reset PPS metrics/UI at run start (covers sprint modes)
        this.totalPiecesPlaced = 0;
        this.activeTime = 0;
        this.areTime = 0;
        this.conventionalPPS = 0;
        this.rawPPS = 0;
        this.maxPpsRecorded = 0;
        this.worstChoke = 0;
        this.ppsHistory = [];
        this.lastPpsRecordedPieceCount = 0;
        if (this.ppsText) this.ppsText.setText("0.00");
        if (this.rawPpsText) this.rawPpsText.setText("0.00");
        if (this.ppsGraphGraphics) this.ppsGraphGraphics.clear();
        if (this.ppsSummaryText && this.ppsSummaryText.scene) {
          this.ppsSummaryText.setText("Max PPS: -- | Worst choke: --");
        }
        this.previewPiece = null;
        if (this.nextPieces.length < 6) {
          this.generateNextPieces();
        }
        this.sectionStartTime = this.currentTime;
        this.currentSection = Math.floor(this.getSectionBasisValue() / this.getSectionLength());
        this.currentSectionTetrisCount = 0;
        this.spawnPiece();
        this.startInitialBGM();
      });
    });
  }

  updateTimer() {
    if (
      !this.gameStarted ||
      !this.startTime ||
      this.isPaused ||
      this.level999Reached ||
      this.gameOver ||
      this.zenTopoutFreezeActive ||
      this.metricsPauseActive ||
      (this.minoFadeActive && this.gameOverFadeDoneTime === null) ||
      this.creditsActive
    ) {
      return;
    }
    this.currentTime = (Date.now() - this.startTime) / 1000;
    // Keep PPS UI clamped to zero when no pieces have been placed yet
    if (this.totalPiecesPlaced === 0) {
      this.conventionalPPS = 0;
      this.rawPPS = 0;
      if (this.ppsText) this.ppsText.setText("0.00");
      if (this.rawPpsText) this.rawPpsText.setText("0.00");
    }
  }

  update(time, delta) {
    // Track delta time in seconds for consistency
    this.deltaTime = delta / 1000;

    // If loading or not fully initialized, skip gameplay but still draw UI (next queue, etc.)
    if (this.loadingPhase) {
      this.draw();
      return;
    }

    // Ensure spike text stays hidden during Ready/Go without affecting other attack UI
    if (this.spikeText && this.readyGoPhase) {
      this.spikeText.setVisible(false);
    }

    // During Zen topout freeze, halt all mechanics and timers but keep drawing current frame.
    // Safety: if the Phaser timer failed to fire, finish after 2s based on wall-clock time.
    if (this.zenTopoutFreezeActive) {
      if (!this.zenTopoutFreezeLogged) {
        try {
          console.log("[ZenTopout] freeze tick", {
            pending: this.zenTopoutPendingFinish,
            start: this.zenTopoutFreezeStart,
            now: this.time?.now || Date.now(),
          });
        } catch {}
        this.zenTopoutFreezeLogged = true;
      }
      const finishZenSafe = (reason = "freeze_tick") => {
        if (typeof this.finishZenTopout === "function") {
          try {
            this.finishZenTopout(reason);
            return;
          } catch (err) {
            try {
              console.error("[ZenTopout] finishZenTopout threw, falling back", err);
            } catch {}
          }
        }
        // Inline fallback: clear board and respawn without GAME OVER UI/SFX
        this.zenTopoutPendingFinish = false;
        this.zenTopoutFreezeActive = false;
        this.zenTopoutCooldown = false;
        this.zenTopoutFreezeStart = 0;
        this.gameOver = false;
        this.showGameOverText = false;
        this.gameOverTextTimer = 0;
        this.gameOverSfxPlayed = true;
        this.gameOverFadeDoneTime = null;
        if (this.board) {
          if (typeof this.board.clearAll === "function") {
            this.board.clearAll();
          } else if (Array.isArray(this.board.grid) && Array.isArray(this.board.fadeGrid)) {
            for (let r = 0; r < this.board.rows; r++) {
              this.board.grid[r] = Array(this.board.cols).fill(0);
              this.board.fadeGrid[r] = Array(this.board.cols).fill(0);
            }
          }
          this.ensureZenCheeseBaseline?.(0);
        }
        this.playSfx?.("fall");
        this.currentPiece = null;
        this.isGrounded = false;
        if (this.nextPieces.length < 6) this.generateNextPieces();
        this.spawnPiece?.();
      };
      const now = this.time?.now || Date.now();
      if (this.zenTopoutPendingFinish && this.zenTopoutFreezeStart && now - this.zenTopoutFreezeStart >= 2000) {
        finishZenSafe("freeze_tick");
      }
      // Safety: if freeze is stuck but pending got cleared, force finish after 2.5s
      if (!this.zenTopoutPendingFinish && this.zenTopoutFreezeStart && now - this.zenTopoutFreezeStart >= 2500) {
        this.zenTopoutPendingFinish = true;
        finishZenSafe("freeze_watchdog");
      }
      // Suppress GAME OVER UI/SFX while frozen
      this.gameOver = false;
      this.showGameOverText = false;
      this.gameOverTextTimer = 0;
      this.gameOverSfxPlayed = true;
      this.gameOverFadeDoneTime = null;
      // Continue mino fade progression during freeze
      if (this.minoFadeActive) {
        this.minoFadeTimer += this.deltaTime;
        const totalRows = this.placedMinoRows.length;
        if (totalRows === 0 || this.minoFadePerRowDuration <= 0) {
          this.minoFadeActive = false;
          this.fadingComplete = true;
        } else if (this.minoFadeProgress < totalRows) {
          const rowIndex = this.minoFadeProgress;
          const rowToFade = this.placedMinoRows[rowIndex];
          const perRow = this.minoFadePerRowDuration;
          const alpha = Math.max(0, 1 - this.minoFadeTimer / perRow);
          this.minoRowFadeAlpha[rowToFade] = alpha;
          if (this.minoFadeTimer >= perRow) {
            this.minoFadeTimer = 0;
            this.minoFadeProgress++;
            this.minoRowFadeAlpha[rowToFade] = 0;
            if (this.minoFadeProgress >= totalRows) {
              this.minoFadeActive = false;
              this.fadingComplete = true;
            }
          }
        }
      }
      this.draw();
      return;
    }

    // Zen sandbox: timed cheese injection
    this.tickZenCheese(this.deltaTime);
    // During READY/GO sequence, still allow directional keys to be sampled for DAS/ARE carry
    if (this.readyGoPhase && !this.gameStarted) {
      if (this.keys) {
        const leftDown =
          !!(this.cursors?.left && this.cursors.left.isDown) ||
          !!(this.keys.left && this.keys.left.isDown);
        const rightDown =
          !!(this.cursors?.right && this.cursors.right.isDown) ||
          !!(this.keys.right && this.keys.right.isDown);
        const zKeyDown = !!(this.keys.left && this.keys.left.isDown);
        const cKeyDown = !!(this.keys.right && this.keys.right.isDown);
        this.updateBufferedDASInput(leftDown || zKeyDown, rightDown || cKeyDown, this.deltaTime);
      }
      this.draw();
      return;
    }

    // Safety: ensure input keys are initialized before use
    if (!this.keys || !this.cursors) {
      return;
    }

    // Input handling (null-safe)
    const isDown = (key) => !!(key && key.isDown);
    const justDown = (key) => !!(key && Phaser.Input.Keyboard.JustDown(key));

    // Handle pause before gameplay inputs so no movement/rotation/drop can run while paused.
    if (justDown(this.keys.pause) && !this.gameOver) {
      this.togglePause();
    }
    if (this.isPaused) {
      if (justDown(this.keys.menu)) {
        this.goToMenu();
        return;
      }
      this.draw();
      return;
    }

    // Custom key bindings (safe for modes that don't define all keys)
    const zKeyDown = isDown(this.keys.left);
    const cKeyDown = isDown(this.keys.right);
    const sKeyDown = isDown(this.keys.softDrop);
    const xKeyDown = isDown(this.keys.hardDrop);
    const rotate180Down = isDown(this.keys.rotate180);
    const kKeyDown = isDown(this.keys.rotateCW) || isDown(this.keys.rotateCW2);
    const spaceKeyDown =
      isDown(this.keys.rotateCCW) || isDown(this.keys.rotateCCW2);
    const lKeyDown = isDown(this.keys.rotateCCW2);
    const startDown = isDown(this.keys.start);
    const startJustDown = justDown(this.keys.start);
    const holdJustDown = justDown(this.keys.hold);
    if (holdJustDown) {
      this.holdRequest = true;
      // If currently in ARE, mark for IHS; otherwise try to consume immediately later in the frame
      if (this.areActive) {
        this.initialHoldSystem = true;
      }
    }

    // Global hold consumption pass (piece-active, not in ARE)
    if (
      this.holdEnabled &&
      this.holdRequest &&
      !this.areActive &&
      this.currentPiece
    ) {
      if (this.performHoldSwap({ bypassCanHold: false, isIHS: false })) {
        this.holdRequest = false;
      } else {
      }
    }

    const leftDown = isDown(this.cursors.left);
    const rightDown = isDown(this.cursors.right);
    const downDown = isDown(this.cursors.down);
    const softDropHeld = downDown || sKeyDown;
    const leftPressed = leftDown || zKeyDown;
    const rightPressed = rightDown || cKeyDown;
    const bothPressed = leftPressed && rightPressed;

    // During top-out, ignore all movement/rotation. Only allow Start/Restart to return to menu.
    if (this.gameOver) {
      this.leftKeyPressed = false;
      this.rightKeyPressed = false;
      this.leftInRepeat = false;
      this.rightInRepeat = false;
      this.leftTimer = 0;
      this.rightTimer = 0;
      this.kKeyPressed = false;
      this.spaceKeyPressed = false;
      this.lKeyPressed = false;
      this.xKeyPressed = false;
      if (justDown(this.restartKey)) {
        this.goToMenu();
        return;
      }
      // Let game-over logic (fade/timers/UI) run below, but skip movement/rotation.
    }

    // Update lightweight fireworks particles
    this.updateHanabiParticles(this.deltaTime);
    // Update BGM scheduling
    this.updateBGM();
    // Fallback: ensure section transition/evaluation fires when basis passes threshold
    {
      const sectionLength = this.getSectionLength();
      const maxLevel =
        this.gameMode && typeof this.gameMode.getGravityLevelCap === "function"
          ? (typeof this.gameMode.getDisplayLevelCap === "function"
              ? this.gameMode.getDisplayLevelCap()
              : this.gameMode.getGravityLevelCap())
          : this.gravityLevelCap || 999;
      const basis = this.getSectionBasisValue();
      const targetSection = Math.floor(basis / sectionLength);
      const allowBackfill = (this.startingLevel || 0) === 0;
      const needsFirstEval =
        allowBackfill &&
        targetSection > 0 &&
        typeof this.sectionTimes[targetSection - 1] !== "number";
      const forceFirstSection =
        allowBackfill &&
        basis >= sectionLength &&
        typeof this.sectionTimes[0] !== "number";
      if (
        (needsFirstEval || targetSection > this.currentSection || forceFirstSection) &&
        this.level < maxLevel
      ) {
        this.handleSectionTransition(targetSection || 1);
      }
    }
    // Check COOL/REGRET banner scheduling after any potential section transition
    this.checkCoolRegretAnnouncements();

    const skipDASMovementThisFrame = !this.gameOver && this.skipDASMovementAfterSpawn;
    if (!this.gameOver) {
      this.skipDASMovementAfterSpawn = false;
    }

    if (this.gameOver) {
      // Skip any input-driven movement/rotation/drop.
    } else if (this.rotationSystem === "ARS") {

      // Hold first (if supported and not in ARE)
      if (!this.areActive && this.holdEnabled && this.holdRequest) {
        if (this.performHoldSwap({ bypassCanHold: false, isIHS: false })) {
          this.holdRequest = false;
        }
      }
      // ARS: Process rotation before movement

      // Track rotation keys for immediate response
      this.kKeyPressed = this.kKeyPressed || false;
      this.spaceKeyPressed = this.spaceKeyPressed || false;
      this.lKeyPressed = this.lKeyPressed || false;
      this.xKeyPressed = this.xKeyPressed || false;

      // K key for clockwise rotation - immediate response
      if (kKeyDown && !this.kKeyPressed) {
        this.kKeyPressed = true;
        if (
          this.currentPiece &&
          this.currentPiece.rotate(this.board, 1, this.rotationSystem)
        ) {
          this.resetLockDelay();
          if (this.currentPiece && !this.currentPiece.canMoveDown(this.board)) {
            this.markGroundedSpin();
          } else {
            this.spinRotatedWhileGrounded = false;
          }
        } else if (this.currentPiece) {
          this.isGrounded = !this.currentPiece.canMoveDown(this.board);
          // Don't play ground sound on rotation failure
        }
      } else if (!kKeyDown && this.kKeyPressed) {
        this.kKeyPressed = false;
      }

      // 180 rotation - immediate response
      if (rotate180Down && !this.rotate180Pressed) {
        this.rotate180Pressed = true;
        if (this.currentPiece) {
          const first = this.currentPiece.rotate(this.board, 1, this.rotationSystem);
          const second = this.currentPiece.rotate(this.board, 1, this.rotationSystem);
          if (first || second) {
            this.resetLockDelay();
            if (this.currentPiece && !this.currentPiece.canMoveDown(this.board)) {
              this.markGroundedSpin();
            } else {
              this.spinRotatedWhileGrounded = false;
            }
          } else {
            this.isGrounded = !this.currentPiece.canMoveDown(this.board);
          }
        }
      } else if (!rotate180Down && this.rotate180Pressed) {
        this.rotate180Pressed = false;
      }

      // Space key for counter-clockwise rotation - immediate response
      if (spaceKeyDown && !this.spaceKeyPressed) {
        this.spaceKeyPressed = true;
        if (
          this.currentPiece &&
          this.currentPiece.rotate(this.board, -1, this.rotationSystem)
        ) {
          this.resetLockDelay();
          if (this.currentPiece && !this.currentPiece.canMoveDown(this.board)) {
            this.markGroundedSpin();
          } else {
            this.spinRotatedWhileGrounded = false;
          }
        } else if (this.currentPiece) {
          this.isGrounded = !this.currentPiece.canMoveDown(this.board);
        }
      } else if (!spaceKeyDown && this.spaceKeyPressed) {
        this.spaceKeyPressed = false;
      }

      // L key for counter-clockwise rotation - immediate response
      if (lKeyDown && !this.lKeyPressed) {
        this.lKeyPressed = true;
        if (
          this.currentPiece &&
          this.currentPiece.rotate(this.board, -1, this.rotationSystem)
        ) {
          this.resetLockDelay();
          if (this.currentPiece && !this.currentPiece.canMoveDown(this.board)) {
            this.markGroundedSpin();
          } else {
            this.spinRotatedWhileGrounded = false;
          }
        } else if (this.currentPiece) {
          this.isGrounded = !this.currentPiece.canMoveDown(this.board);
        }
      } else if (!lKeyDown && this.lKeyPressed) {
        this.lKeyPressed = false;
      }

      // X key for hard drop - immediate response
      if (xKeyDown && !this.xKeyPressed) {
        this.xKeyPressed = true;
        // Disable hard drop on TGM1 and 20G modes
        if (!this.isLegacySoftDropLockMode() && this.currentPiece) {
          this.recordFinesseInput(); // Count the keypress
          // Calculate hard drop rows before dropping
          const ghost = this.currentPiece.getGhostPosition(this.board);
          this.hardDropRows = ghost.y - this.currentPiece.y;
          this.currentPiece.hardDrop(this.board);
          // In ARS, begin lock delay instead of instant lock
          this.isGrounded = true;
          this.lockDelay = this.deltaTime;
          this.lockDelayBufferedStart = false;
          this.currentPiece.playGroundSound(this);
          this.spinRotatedWhileGrounded = false;
        }
      } else if (!xKeyDown && this.xKeyPressed) {
        this.xKeyPressed = false;
      }

      // Track key states for DAS using custom keys (z for left, c for right)
      if (leftPressed && !bothPressed && !this.leftKeyPressed) {
        this.leftKeyPressed = true;
        this.leftTimer = 0;
        this.leftInRepeat = false;
        // Initial movement
        if (
          !skipDASMovementThisFrame &&
          this.currentPiece &&
          this.currentPiece.move(this.board, -1, 0)
        ) {
          this.incrementFinesseMove();
          this.recordFinesseInput(); // Count key press, not DAS
          this.resetLockDelay();
          this.spinRotatedWhileGrounded = false;
        }
        // Don't set grounded state here - let gravity/soft drop logic handle it
      }
      if (rightPressed && !bothPressed && !this.rightKeyPressed) {
        this.rightKeyPressed = true;
        this.rightTimer = 0;
        this.rightInRepeat = false;
        // Initial movement
        if (
          !skipDASMovementThisFrame &&
          this.currentPiece &&
          this.currentPiece.move(this.board, 1, 0)
        ) {
          this.incrementFinesseMove();
          this.recordFinesseInput(); // Count key press, not DAS
          this.resetLockDelay();
          this.spinRotatedWhileGrounded = false;
        }
        // Don't set grounded state here - let gravity/soft drop logic handle it
      }
    } else {
      // Hold first (if supported and not in ARE)
      if (!this.areActive && this.holdEnabled && this.holdRequest) {
        if (this.performHoldSwap({ bypassCanHold: false, isIHS: false })) {
          this.holdRequest = false;
        }
      }
      // SRS: Process movement before rotation

      // Track key states for DAS using custom keys (z for left, c for right)
      if ((leftDown || zKeyDown) && !this.leftKeyPressed) {
        this.leftKeyPressed = true;
        this.leftTimer = 0;
        this.leftInRepeat = false;
        // Initial movement
        if (
          !skipDASMovementThisFrame &&
          this.currentPiece &&
          this.currentPiece.move(this.board, -1, 0)
        ) {
          this.incrementFinesseMove();
          this.recordFinesseInput(); // Count key press, not DAS
          this.resetLockDelay();
        }
        // Don't set grounded state here - let gravity/soft drop logic handle it
      }
      if ((rightDown || cKeyDown) && !this.rightKeyPressed) {
        this.rightKeyPressed = true;
        this.rightTimer = 0;
        this.rightInRepeat = false;
        // Initial movement
        if (
          !skipDASMovementThisFrame &&
          this.currentPiece &&
          this.currentPiece.move(this.board, 1, 0)
        ) {
          this.incrementFinesseMove();
          this.recordFinesseInput(); // Count key press, not DAS
          this.resetLockDelay();
        }
        // Don't set grounded state here - let gravity/soft drop logic handle it
      }

      // Track rotation keys for immediate response
      this.kKeyPressed = this.kKeyPressed || false;
      this.spaceKeyPressed = this.spaceKeyPressed || false;
      this.lKeyPressed = this.lKeyPressed || false;
      this.xKeyPressed = this.xKeyPressed || false;

      // K key for clockwise rotation - immediate response
      if (kKeyDown && !this.kKeyPressed) {
        this.kKeyPressed = true;
        if (
          this.currentPiece &&
          this.currentPiece.rotate(this.board, 1, this.rotationSystem)
        ) {
          this.incrementFinesseRotation();
          this.recordFinesseInput(); // Count key press, not DAS
          this.resetLockDelay();
        } else if (this.currentPiece) {
          this.isGrounded = !this.currentPiece.canMoveDown(this.board);
          // Don't play ground sound on rotation failure
        }
      } else if (!kKeyDown && this.kKeyPressed) {
        this.kKeyPressed = false;
      }

      // Space key for counter-clockwise rotation - immediate response
      if (spaceKeyDown && !this.spaceKeyPressed) {
        this.spaceKeyPressed = true;
        if (
          this.currentPiece &&
          this.currentPiece.rotate(this.board, -1, this.rotationSystem)
        ) {
          this.incrementFinesseRotation();
          this.recordFinesseInput(); // Count key press, not DAS
          this.resetLockDelay();
          if (this.currentPiece && !this.currentPiece.canMoveDown(this.board)) {
            this.markGroundedSpin();
          }
        } else if (this.currentPiece) {
          this.isGrounded = !this.currentPiece.canMoveDown(this.board);
        }
      } else if (!spaceKeyDown && this.spaceKeyPressed) {
        this.spaceKeyPressed = false;
      }

      // L key for counter-clockwise rotation - immediate response
      if (lKeyDown && !this.lKeyPressed) {
        this.lKeyPressed = true;
        if (
          this.currentPiece &&
          this.currentPiece.rotate(this.board, -1, this.rotationSystem)
        ) {
          this.incrementFinesseRotation();
          this.recordFinesseInput(); // Count key press, not DAS
          this.resetLockDelay();
          if (this.currentPiece && !this.currentPiece.canMoveDown(this.board)) {
            this.markGroundedSpin();
          }
        } else if (this.currentPiece) {
          this.isGrounded = !this.currentPiece.canMoveDown(this.board);
        }
      } else if (!lKeyDown && this.lKeyPressed) {
        this.lKeyPressed = false;
      }

      // X key for hard drop - immediate response
      if (xKeyDown && !this.xKeyPressed) {
        this.xKeyPressed = true;
        // Disable hard drop on TGM1 and 20G modes
        if (!this.isLegacySoftDropLockMode() && this.currentPiece) {
          this.recordFinesseInput(); // Count the keypress
          // Calculate hard drop rows before dropping
          const ghost = this.currentPiece.getGhostPosition(this.board);
          this.hardDropRows = ghost.y - this.currentPiece.y;
          this.currentPiece.hardDrop(this.board);
          // For ARS, place without instant lock; for others, lock immediately
          if (this.rotationSystem === "ARS") {
            this.isGrounded = true;
            this.lockDelay = this.deltaTime;
            this.lockDelayBufferedStart = false;
            this.currentPiece.playGroundSound(this);
          } else {
            this.lockPiece();
          }
        }
      } else if (!xKeyDown && this.xKeyPressed) {
        this.xKeyPressed = false;
      }
    }

    // Handle DAS for left key (cursors.left or z key)
    if (!skipDASMovementThisFrame && this.leftKeyPressed && leftPressed && !bothPressed) {
      this.leftTimer += this.deltaTime;
      if (!this.leftInRepeat) {
        // Wait for DAS delay
        if (this.leftTimer >= this.dasDelay) {
          this.leftInRepeat = true;
          this.leftTimer -= this.dasDelay;
          if (this.currentPiece) {
            const moved = this.currentPiece.move(this.board, -1, 0);
            if (moved) {
              this.resetLockDelay();
            } else {
              // Piece tried to move left during DAS - no ground sound for movement failures
            }
            // Don't set grounded state here - let gravity/soft drop logic handle it
          }
        }
      } else if (this.leftInRepeat) {
        // Handle ARR (Auto Repeat Rate)
        if (this.arrDelay <= 0) {
          // Instant travel to wall when ARR is 0
          if (this.currentPiece) {
            let movedAny = false;
            let guard = this.board.cols + 2;
            while (guard-- > 0 && this.currentPiece.move(this.board, -1, 0)) {
              movedAny = true;
            }
            if (movedAny) {
              this.resetLockDelay();
            }
          }
          this.leftTimer = 0;
        } else {
          while (this.leftTimer >= this.arrDelay) {
            this.leftTimer -= this.arrDelay;
            if (this.currentPiece) {
              const moved = this.currentPiece.move(this.board, -1, 0);
              if (moved) {
                this.resetLockDelay();
              } else {
                // Piece tried to move left during ARR - no ground sound for movement failures
              }
              // Don't set grounded state here - let gravity/soft drop logic handle it
            }
          }
        }
      }
    }

    // Handle DAS for right key (cursors.right or c key)
    if (!skipDASMovementThisFrame && this.rightKeyPressed && rightPressed && !bothPressed) {
      this.rightTimer += this.deltaTime;
      if (!this.rightInRepeat) {
        // Wait for DAS delay
        if (this.rightTimer >= this.dasDelay) {
          this.rightInRepeat = true;
          this.rightTimer -= this.dasDelay;
          if (this.currentPiece) {
            const moved = this.currentPiece.move(this.board, 1, 0);
            if (moved) {
              this.resetLockDelay();
            } else {
              // Piece tried to move right during DAS - no ground sound for movement failures
            }
            // Don't set grounded state here - let gravity/soft drop logic handle it
          }
        }
      } else {
        // Handle ARR (Auto Repeat Rate)
        if (this.arrDelay <= 0) {
          // Instant travel to wall when ARR is 0
          if (this.currentPiece) {
            let movedAny = false;
            let guard = this.board.cols + 2;
            while (guard-- > 0 && this.currentPiece.move(this.board, 1, 0)) {
              movedAny = true;
            }
            if (movedAny) {
              this.resetLockDelay();
            }
          }
          this.rightTimer = 0;
        } else {
          while (this.rightTimer >= this.arrDelay) {
            this.rightTimer -= this.arrDelay;
            if (this.currentPiece) {
              const moved = this.currentPiece.move(this.board, 1, 0);
              if (moved) {
                this.resetLockDelay();
              } else {
                // Piece tried to move right during ARR - no ground sound for movement failures
              }
              // Don't set grounded state here - let gravity/soft drop logic handle it
            }
          }
        }
      }
    }

    // Key release handling
    if (!leftPressed && this.leftKeyPressed) {
      this.leftKeyPressed = false;
      this.leftTimer = 0;
      this.leftInRepeat = false;
    }
    if (!rightPressed && this.rightKeyPressed) {
      this.rightKeyPressed = false;
      this.rightTimer = 0;
      this.rightInRepeat = false;
    }
    if (!rotate180Down && this.rotate180Pressed) {
      this.rotate180Pressed = false;
    }

    // Update placement hint each frame
    this.updatePlacementHint();

    // Handle ARE input tracking - allow during loading for initial piece handling
    const allowAreInputs = this.shouldAllowAREInputs();
    if (this.areActive || !this.currentPiece) {
      if (allowAreInputs) {
        this.updateBufferedDASInput(leftDown || zKeyDown, rightDown || cKeyDown, this.deltaTime);
        this.areRotationKeys.k = kKeyDown;
        this.areRotationKeys.space = spaceKeyDown;
        this.areRotationKeys.l = lKeyDown;

        // Determine rotation direction based on currently held keys during ARE
        // Priority: K (clockwise) > Space/L (counter-clockwise)
        // Deactivate if keys are released during ARE
        if (kKeyDown) {
          this.areRotationDirection = 1;
          if (!this.irsActivated) {
            this.irsActivated = true;
          }
        } else if (spaceKeyDown || lKeyDown) {
          this.areRotationDirection = -1;
          if (!this.irsActivated) {
            this.irsActivated = true;
          }
        } else {
          this.areRotationDirection = 0;
          if (this.irsActivated) {
            this.irsActivated = false;
          }
        }

        // Hold functionality for ARE - check if hold key is currently held during ARE
        const holdCurrentlyHeld = this.holdEnabled && isDown(this.keys.hold);
        if (holdCurrentlyHeld && !this.areHoldPressed) {
          this.areHoldPressed = true;
        } else if (!holdCurrentlyHeld && this.areHoldPressed) {
          this.areHoldPressed = false;
        }
      } else {
        // ARE inputs disabled when delays are 0
        this.areRotationKeys = { k: false, space: false, l: false };
        this.areRotationDirection = 0;
        this.irsActivated = false;
        this.areHoldPressed = false;
        if (!this.isFirstSpawn) {
          this.areLeftDasCharge = 0;
          this.areRightDasCharge = 0;
        }
      }
    } else {
      // Reset ARE rotation tracking when not in ARE and piece exists
      this.areRotationKeys = { k: false, space: false, l: false };
      this.areRotationDirection = 0;
      this.irsActivated = false;
      this.areHoldPressed = false;
    }

    // Update mino fading system (runs even when game is over)
    if (this.minoFadeActive) {
      this.minoFadeTimer += this.deltaTime;

      const totalRows = this.placedMinoRows.length;
      if (totalRows === 0 || this.minoFadePerRowDuration <= 0) {
        this.minoFadeActive = false;
        this.fadingComplete = true;
        if (!this.zenTopoutPendingFinish && !this.zenTopoutFreezeActive && this.gameOverFadeDoneTime === null) {
          this.gameOverFadeDoneTime = this.time.now;
        }
        if (this.creditsPending) {
          this.beginPendingCreditsTransition();
        }
      } else if (this.minoFadeProgress < totalRows) {
        const rowIndex = this.minoFadeProgress;
        const rowToFade = this.placedMinoRows[rowIndex];
        const perRow = this.minoFadePerRowDuration;
        const alpha = Math.max(0, 1 - this.minoFadeTimer / perRow);
        this.minoRowFadeAlpha[rowToFade] = alpha;

        if (this.minoFadeTimer >= perRow) {
          this.minoFadeTimer = 0;
          this.minoFadeProgress++;
          this.minoRowFadeAlpha[rowToFade] = 0;
          if (this.minoFadeProgress >= totalRows) {
            this.minoFadeActive = false;
            this.fadingComplete = true;
            if (!this.zenTopoutPendingFinish && !this.zenTopoutFreezeActive && this.gameOverFadeDoneTime === null) {
              this.gameOverFadeDoneTime = this.time.now;
            }
            if (this.creditsPending) {
              this.beginPendingCreditsTransition();
            }
          }
        }
      }
    }

    // Fail-safe: if pending credits somehow outlives fade completion, force transition.
    if (this.creditsPending && !this.minoFadeActive && !this.creditsActive) {
      this.beginPendingCreditsTransition();
    }

    // Update game over timer (runs even when game is over)
    if (this.gameOver) {
      this.gameOverTimer += this.deltaTime;
      if (this.gameOverTimer >= 10) {
        // 10 seconds
        this.saveBestScore();
        this.goToMenu();
        return;
      }
    }

    // Torikan fail staged flow for TGM3 Master
    if (this.torikanFailActive) {
      this.torikanFailTimer += this.deltaTime;
      // Show message after 1s
      if (!this.torikanFailMessageShown && this.torikanFailTimer >= 1) {
        this.torikanFailMessageShown = true;
        this.gameOverMessage = "Excellent... but let's go better next time";
      }
      // Trigger GAME OVER after 5s
      if (!this.torikanFailGameOverShown && this.torikanFailTimer >= 5) {
        this.torikanFailGameOverShown = true;
        this.showGameOverScreen();
      }
      // Return to menu after 10s from fail start
      if (this.torikanFailTimer >= 10) {
        this.goToMenu();
        return;
      }
      // Skip further update logic during staged fail
      this.draw();
      return;
    }
    // Suppress GAME OVER during Zen recovery; otherwise show after fade
    const suppressGameOverUI = this.zenTopoutFreezeActive || this.zenTopoutPendingFinish;
    if (suppressGameOverUI) {
      this.showGameOverText = false;
      this.gameOverTextTimer = 0;
      this.gameOverSfxPlayed = true;
      this.gameOverFadeDoneTime = null;
    } else if (!this.creditsActive && !this.creditsPending && this.fadingComplete && this.gameOverFadeDoneTime !== null) {
      const elapsedSinceFade = this.time.now - this.gameOverFadeDoneTime;
      if (elapsedSinceFade >= 3000) {
        this.showGameOverText = true;
        this.metricsPauseActive = false; // resume metrics after topout animation finishes
        if (!this.gameOverSfxPlayed) {
          this.gameOverSfxPlayed = true;
          this.playSfx?.("gameover", 0.8);
        }
      }
    }

    // Determine if metrics should pause (topout animation, pause, zen freeze, credits, etc.)
    const topoutAnimActive =
      this.minoFadeActive ||
      this.zenTopoutFreezeActive ||
      (this.gameOver && !this.fadingComplete);
    if (topoutAnimActive) {
      if (!this.metricsPauseActive) {
        this.metricsPauseActive = true;
        this.metricsPauseStart = Date.now();
      }
    } else if (this.metricsPauseActive) {
      // Exiting metrics pause: shift timers so elapsed excludes the paused duration
      const pausedMs = this.metricsPauseStart ? Date.now() - this.metricsPauseStart : 0;
      const pausedSec = pausedMs / 1000;
      if (pausedMs > 0) {
        if (this.startTime) this.startTime += pausedMs;
        if (this.gameStartTime) this.gameStartTime += pausedMs;
        if (this.sectionStartTime !== null && this.sectionStartTime !== undefined) {
          this.sectionStartTime += pausedSec;
        }
        if (this.lastAttackTime) this.lastAttackTime += pausedSec;
      }
      this.metricsPauseActive = false;
      this.metricsPauseStart = null;
    }
    const metricsPaused =
      this.isPaused ||
      this.level999Reached ||
      this.creditsActive ||
      this.metricsPauseActive ||
      (this.gameOver && !this.showGameOverText);

    // Update time tracking using Date.now() for reliability
    if (!metricsPaused) {
      this.updateTimer();
    }
    if (!metricsPaused) {
      this.tickAttackDecay(this.currentTime || 0);
      this.tickStandardCombo(this.currentTime || 0);
    }
    if (!metricsPaused) {
      this.updateAttackUI();
    }

    // Handle BGM first play vs loop mode
    this.manageBGMLoopMode();

    // Track active time and ARE time for PPS calculations (ignore paused time)
    if (!metricsPaused && !this.gameOver) {
      if (!this.areActive) {
        this.activeTime += this.deltaTime;
      } else {
        this.areTime += this.deltaTime;
      }
    }

    // Sakura-specific input (skip, hold-advance) before pause/game over exit
    if (
      this.gameMode &&
      typeof this.gameMode.handleSakuraInput === "function" &&
      this.selectedMode === "tgm3_sakura"
    ) {
      this.gameMode.handleSakuraInput(
        this,
        { startDown, startJustDown, holdJustDown },
        this.deltaTime,
      );
    }

    // Skip ALL game logic if game over
    if (this.gameOver) {
      // Still update UI for pause screen
      this.draw();
      return;
    }

    if (!this.currentPiece) {
      // If no active piece, only return early when not in ARE; otherwise let ARE progress below.
      if (!this.areActive) {
        this.draw();
        return;
      }
    } else if (!this.areActive) {
      // Track key states for DAS using custom keys (z for left, c for right)
      // Allow DAS during loading for initial piece handling
      // Soft drop handling - only when s key is held
      if (softDropHeld) {
        const softDropJustPressed = !this.softDropPressed;
        if (softDropJustPressed) {
          this.softDropPressed = true;
          this.recordFinesseInput(); // Count the keypress, not the repeats
        }
        let movedRows = 0;
        // Non-Standard modes: use time-based 1G speed (60 rows/second)
        // Standard modes: use multiplier-based per-frame movement
        if (!this.usesStandardDropBehavior()) {
          // Time-based 1G soft drop for non-Standard modes
          const softDropRowsPerSecond = 60; // 1G = 60 rows/second
          if (!this.softDropAccum) this.softDropAccum = 0;
          this.softDropAccum += softDropRowsPerSecond * this.deltaTime;
          const rowsToFall = Math.floor(this.softDropAccum);
          if (rowsToFall > 0) {
            for (let i = 0; i < rowsToFall; i++) {
              if (this.currentPiece.move(this.board, 0, 1)) {
                movedRows += 1;
                this.resetLockDelay();
                this.wasGroundedDuringSoftDrop = false;
                this.softDropMovedThisPiece = true;
                this.softDropRows += 1;
              } else {
                break;
              }
            }
            this.softDropAccum -= rowsToFall;
          }
        } else {
          // Standard modes: use multiplier-based movement
          const softDropRowsPerSecond =
            this.softDropMultiplier >= 100
              ? 20 * BASE_FPS
              : Math.max(1, this.softDropMultiplier) * BASE_FPS;
          if (!this.softDropAccum) this.softDropAccum = 0;
          this.softDropAccum += softDropRowsPerSecond * this.deltaTime;
          const maxSteps = Math.floor(this.softDropAccum);
          for (let i = 0; i < maxSteps; i++) {
            if (this.currentPiece.move(this.board, 0, 1)) {
              movedRows += 1;
              this.resetLockDelay();
              this.wasGroundedDuringSoftDrop = false;
              this.softDropMovedThisPiece = true;
              this.softDropRows += 1;
            } else {
              break;
            }
          }
          if (maxSteps > 0) this.softDropAccum = Math.max(0, this.softDropAccum - maxSteps);
        }

        const canMoveFurther = this.board.isValidPosition(
          this.currentPiece,
          this.currentPiece.x,
          this.currentPiece.y + 1,
        );

        if (!canMoveFurther) {
          if (!this.isGrounded) {
            // Lock immediately when soft drop is held and piece touches ground (TGM1 and 20G modes)
            if (this.isLegacySoftDropLockMode()) {
              if (this.softDropMovedThisPiece) {
                if (
                  !this.wasGroundedDuringSoftDrop &&
                  this.currentPiece.isTouchingGround(this.board)
                ) {
                  this.currentPiece.playGroundSound(this);
                }
                this.lockPiece();
                this.wasGroundedDuringSoftDrop = true;
              } else {
                this.isGrounded = true;
              }
            } else {
              // Non-TGM1/20G modes: use original logic based on rotation system
              if (this.rotationSystem === "ARS") {
                if (
                  !this.wasGroundedDuringSoftDrop &&
                  this.currentPiece.isTouchingGround(this.board)
                ) {
                  this.currentPiece.playGroundSound(this);
                }
                this.lockPiece();
                this.wasGroundedDuringSoftDrop = true;
              } else {
                this.isGrounded = true;
                if (
                  !this.wasGroundedDuringSoftDrop &&
                  this.currentPiece.isTouchingGround(this.board)
                ) {
                  this.currentPiece.playGroundSound(this);
                  this.wasGroundedDuringSoftDrop = true;
                }
              }
            }
          } else {
            // Already grounded - lock immediately if soft drop is held in TGM1/20G modes
            if (
              this.isLegacySoftDropLockMode() &&
              (this.softDropMovedThisPiece || softDropJustPressed)
            ) {
              this.lockPiece();
            }
          }
        } else if (movedRows === 0) {
          // No movement, still airborne
          this.wasGroundedDuringSoftDrop = false;
        }
        // If piece was already grounded, don't increment lock delay
      } else {
        // Reset flag when soft drop key is not held
        this.softDropPressed = false;
        this.wasGroundedDuringSoftDrop = false;
        this.softDropAccum = 0; // Reset accumulation for non-Standard modes
      }

      // Single press actions (keep JustDown for these)
      if (justDown(this.cursors.down) && !downDown) {
        this.recordFinesseInput(); // Count the keypress
        if (this.currentPiece.move(this.board, 0, 1)) {
          this.resetLockDelay();
        } else if (!this.isGrounded) {
          if (this.rotationSystem === "ARS") {
            // Single-tap soft drop in ARS: lock on contact
            if (this.currentPiece.isTouchingGround(this.board)) {
              this.currentPiece.playGroundSound(this);
            }
            this.lockPiece();
          } else {
            // Only start lock delay if piece wasn't already grounded
            this.isGrounded = true;
            this.lockDelay += this.deltaTime;
            if (this.lockDelay >= this.lockDelayMax) {
              // 30 frames = 0.5 seconds
              this.lockPiece();
            }
          }
        } else {
          // Piece is already grounded but tried to move down - play ground sound only if touching ground
          if (this.currentPiece.isTouchingGround(this.board)) {
            this.currentPiece.playGroundSound(this);
          }
        }
        // If piece was already grounded, don't increment lock delay
      }
      // Hold functionality for modes that support it
      if (this.holdEnabled && this.holdRequest) {
        if (this.performHoldSwap({ bypassCanHold: false, isIHS: false })) {
          this.holdRequest = false;
        }
      }
    }

    // Gravity (TGM-style curve, time-based to be FPS independent)
    const zenActive =
      typeof this.isZenSandboxActive === "function" ? this.isZenSandboxActive() : false;
    if (!this.areActive) {
      // Only apply gravity when not in ARE
      const skipGravityThisFrame = this.skipGravityThisFrame;
      if (skipGravityThisFrame) {
        this.skipGravityThisFrame = false;
      }
      let zenRowsPerSecond = null;
      // Only apply zen sandbox gravity override if zen mode is actually active
      if (zenActive && this.zenSandboxConfig) {
        const cfg = this.zenSandboxConfig;
        const mode = cfg.gravityMode || "none";
        if (mode === "none") {
          zenRowsPerSecond = 0;
        } else if (mode === "static") {
          const rpf = Number(cfg.gravityRowsPerFrame || 0) || 0;
          zenRowsPerSecond = rpf * 60;
        } else {
          // fallback to helper if available (presets)
          if (typeof this.getZenGravityRowsPerSecond === "function") {
            zenRowsPerSecond = this.getZenGravityRowsPerSecond(this.deltaTime);
          }
        }
      }
      const internalGravity = Math.max(1, this.getTGMGravitySpeed(this.level));
      if (!this.currentPiece) return;

      if (skipGravityThisFrame) {
        this.gravityAccum = 0;
      } else if (internalGravity >= 5120) {
        this.currentPiece.hardDrop(this.board);
        this.isGrounded = true;
        this.lastGroundedY = this.currentPiece ? this.currentPiece.y : this.lastGroundedY;
        this.gravityAccum = 0;
      } else {
        if (softDropHeld) {
          this.gravityAccum = 0;
        } else {
          if (
            this.isGrounded &&
            this.board.isValidPosition(
              this.currentPiece,
              this.currentPiece.x,
              this.currentPiece.y + 1,
            )
          ) {
            this.isGrounded = false;
            this.lockDelay = 0;
            this.lastGroundedY = null;
          }

          // rowsPerSecond derived from internalGravity (1/256G units) assuming 60 fps baseline
          let rowsPerSecond = (internalGravity / 256) * 60;
          if (typeof zenRowsPerSecond === "number") {
            rowsPerSecond = zenRowsPerSecond;
          }
          this.gravityAccum += rowsPerSecond * this.deltaTime; // deltaTime in seconds

          const rowsToFall = Math.floor(this.gravityAccum);
          if (rowsToFall > 0) {
            let movedRows = 0;
            for (let i = 0; i < rowsToFall; i++) {
              if (this.currentPiece.move(this.board, 0, 1)) {
                movedRows++;
                this.isGrounded = false;
                this.resetLockDelay();
              } else {
                // Piece can't move down anymore
                if (!this.isGrounded) {
                  this.isGrounded = true;
                  this.lockDelay = this.deltaTime; // Start counting from current delta time
                  this.currentPiece.playGroundSound(this);
                }
                break;
              }
            }
            // retain fractional remainder only if we moved; if blocked, drop any accumulated
            this.gravityAccum = movedRows > 0 ? this.gravityAccum - movedRows : 0;
          }
        }
      }
    }

    // Count lock delay continuously when grounded (increment after initial frame)
    if (this.isGrounded && this.currentPiece && !this.areActive) {
      // If we just spawned onto the stack in 20G, start counting on the first active frame
      if (this.lockDelayBufferedStart) {
        this.lockDelayBufferedStart = false;
        this.lockDelay = this.deltaTime;
      } else {
        // If grounded and lock delay hasn't started, begin it now
        if (this.lockDelay === 0) {
          this.lockDelay = this.deltaTime;
        } else {
          this.lockDelay += this.deltaTime;
        }

        if (this.lockDelay >= this.lockDelayMax) {
          // 30 frames = 0.5 seconds
          this.lockPiece();
        }
      }
    }

    // ARE (Appearance Delay) handling
    if (this.areActive) {
      this.areTimer += this.deltaTime;
      let areTransitions = 0;
      while (this.areActive && areTransitions < 4) {
        const currentDelay = this.areDelay;
        if (currentDelay > 0) {
          if (this.areTimer < currentDelay) break;
          this.areTimer -= currentDelay;
        } else {
          this.areTimer = 0;
        }
        areTransitions += 1;
        if (this.lineClearDelayActive) {
          // Line clear delay completed, perform flash fade-out and enter line ARE
          this.lineClearDelayActive = false;
          this.lineClearPhase = true;
          this.areDelay =
            this.pendingLineAREDelay !== null && this.pendingLineAREDelay !== undefined
              ? this.pendingLineAREDelay
              : 41 / 60;
          this.areTimer = 0;

          // Now clear lines and play fall sound at the beginning of line ARE
          this.clearStoredLines();
          if (this.deleteBottomRowRequested && this.board?.deleteBottomRow) {
            this.board.deleteBottomRow();
            this.deleteBottomRowRequested = false;
          }
          const fallSound = this.sound.add("fall", { volume: 0.7 });
          fallSound.play();
          this.isClearingLines = false;
          this.lineClearDelayDuration = 0;
          this.pendingLineAREDelay = 0;
        } else if (this.lineClearPhase) {
          // Line ARE completed, spawn next piece
          this.lineClearPhase = false;
          this.areActive = false;
          this.spawnPiece();
        } else {
          // Normal ARE completed, spawn next piece
          this.areActive = false;
          this.spawnPiece();
        }
      }
    }

    // Update piece active time for scoring
    if (this.currentPiece && this.pieceSpawnTime > 0) {
      this.pieceActiveTime += 1; // Increment by 1 frame per update call
    }

    // Update grade based on performance (only for modes with grading)
    if (!this.creditsActive) {
      const modeConfig = this.gameMode ? this.gameMode.getConfig() : {};
      const hasGrading = modeConfig.hasGrading !== false;
      if (hasGrading) {
        // Before any piece is placed, pin grade/internalGrade to baseline and skip external getters.
        if (this.totalPiecesPlaced === 0) {
          if (this.initialGradeBaseline) this.grade = this.initialGradeBaseline;
          if (typeof this.initialInternalGradeBaseline === "number") {
            this.internalGrade = this.initialInternalGradeBaseline;
          }
          this.updateGradeUIVisibility();
        } else if (this.gameMode && typeof this.gameMode.getDisplayedGrade === "function") {
          const displayedGrade = this.gameMode.getDisplayedGrade();
          const baselineValue =
            typeof this.initialGradeBaselineValue === "number"
              ? this.initialGradeBaselineValue
              : -Infinity;
          const currentValue = this.getGradeValue(this.grade);
          const displayedValue = this.getGradeValue(displayedGrade);

          // Only accept displayed grade if it is not below the initial baseline
          // and not below the current grade.
          if (
            displayedGrade &&
            displayedValue >= baselineValue &&
            displayedValue >= currentValue
          ) {
            this.grade = displayedGrade;
          } else if (this.grade == null && this.initialGradeBaseline) {
            this.grade = this.initialGradeBaseline;
          }

          if (this.gameMode && typeof this.gameMode.getInternalGrade === "function") {
            const internalGrade = this.gameMode.getInternalGrade();
            if (typeof internalGrade === "number") {
              // Do not overwrite with lower than baseline internal grade
              const baselineInternal =
                typeof this.initialInternalGradeBaseline === "number"
                  ? this.initialInternalGradeBaseline
                  : null;
              if (
                baselineInternal === null ||
                internalGrade >= baselineInternal ||
                this.internalGrade == null
              ) {
                this.internalGrade = internalGrade;
              }
            }
          } else if (this.internalGrade == null && this.initialInternalGradeBaseline !== null) {
            this.internalGrade = this.initialInternalGradeBaseline;
          }
          this.updateGradeUIVisibility();
        } else {
          this.updateGrade();
        }
        this.updateGradeUIVisibility();
      }
    }

    // Calculate piece per second rates (skip during credits)
    if (!metricsPaused && !this.creditsActive) {
      this.updatePPS();
    }

    // Update section message
    if (this.sectionMessage) {
      this.sectionMessageTimer--;
      if (this.sectionMessageTimer <= 0) {
        this.sectionMessage = null;
      }
    }

    // Update game mode (for TGM2 grading system, powerup minos, etc.)
    if (this.gameMode && this.gameMode.update) {
      this.gameMode.update(this, this.deltaTime);
    }

    // Update versus mode (board sync, garbage application, HUD)
    if (this.versusActive) {
      updateVersusMode(this, this.deltaTime);
    }

    // Update credits system
    if (this.creditsActive) {
      this.creditsTimer += this.deltaTime; // Use deltaTime for frame-rate independence

      // End credits after duration
      if (this.creditsTimer >= this.creditsDuration) {
        this.finalizeCreditsRoll();
      }
    }

    // Draw

  this.draw();
}

  // Safeguard: PPS updater (noop if metrics not in use)
  updatePPS() {
    // If PPS tracking fields exist, keep lightweight calculation; otherwise skip.
    if (typeof this.computePPS === "function") {
      if (this.zenTopoutFreezeActive) return;
      // If no pieces placed yet, clamp to zero and clear graph/history
      if (!this.totalPiecesPlaced) {
        this.conventionalPPS = 0;
        this.rawPPS = 0;
        if (this.ppsText) this.ppsText.setText("0.00");
        if (this.rawPpsText) this.rawPpsText.setText("0.00");
        if (this.ppsGraphGraphics) this.ppsGraphGraphics.clear();
        if (Array.isArray(this.ppsHistory)) this.ppsHistory.length = 0;
        if (Array.isArray(this.ppsLockSampleIndices)) this.ppsLockSampleIndices.length = 0;
        this.lastPpsRecordedPieceCount = 0;
        this.ppsSampleTimer = 0;
        return;
      }

      this.computePPS();

      // Time-based sampling for PPS graph
      const dt = this.deltaTime || 0;
      this.ppsSampleTimer += dt;
      while (this.ppsSampleTimer >= this.ppsSampleInterval) {
        this.ppsSampleTimer -= this.ppsSampleInterval;
        this.ppsHistory.push(this.conventionalPPS);
        if (this.ppsHistory.length > 200) {
          this.ppsHistory.shift();
          if (Array.isArray(this.ppsLockSampleIndices)) {
            this.ppsLockSampleIndices = this.ppsLockSampleIndices
              .map((idx) => idx - 1)
              .filter((idx) => idx >= 0);
          }
        }
      }
    }
  }

  // Compute piece-per-second metrics (conventional includes ARE; raw excludes ARE)
  computePPS() {
    const totalTime = this.activeTime + this.areTime;
    if (totalTime > 0) {
      this.conventionalPPS = this.totalPiecesPlaced / totalTime;
    }
    if (this.activeTime > 0) {
      this.rawPPS = this.totalPiecesPlaced / this.activeTime;
    }
    // Clamp to finite numbers to avoid NaN in UI
    if (!Number.isFinite(this.conventionalPPS)) this.conventionalPPS = 0;
    if (!Number.isFinite(this.rawPPS)) this.rawPPS = 0;
  }

  getShiraseQuotaForLevel(level) {
    if (level < 500 || level >= 1000) return 0;
    if (level < 600) return 20;
    if (level < 700) return 18;
    if (level < 800) return 10;
    if (level < 900) return 9;
    return 8; // 900-999
  }

  raiseShiraseGarbage() {
    if (!this.board || !this.board.grid || !this.board.grid.length) return;
    try {
      console.log("[Shirase] raiseShiraseGarbage", {
        hasPlayGarbage: typeof this.playGarbageSfx === "function",
      });
    } catch {}
    const bottomRowIndex = this.board.rows - 1;
    const bottomRow = this.board.grid[bottomRowIndex] || [];
    const garbageRow = bottomRow.map((cell) => (cell ? 0x444444 : 0));
    // Raise stack: remove top row, push garbage clone at bottom
    this.board.grid.shift();
    this.board.grid.push(garbageRow);
    if (this.board.fadeGrid) {
      this.board.fadeGrid.shift();
      this.board.fadeGrid.push(Array(this.board.cols).fill(0));
    }
    // Garbage SFX – invoke helper if present; otherwise play directly with log
    try {
      if (typeof GameScene !== "undefined" && GameScene.prototype.playGarbageSfx) {
        GameScene.prototype.playGarbageSfx.call(this, 1);
      } else if (this.sound) {
        console.log("[SFX][Shirase] direct play fallback", { hasSound: !!this.sound });
        const sfx = this.sound.add("garbage", { volume: 1, detune: 0, rate: 1 });
        sfx?.once?.("complete", () => {
          try {
            sfx.destroy();
          } catch {}
        });
        sfx?.play();
      }
    } catch (err) {
      console.warn("[Shirase] playGarbageSfx fallback error", err);
    }
  }

  spawnPiece() {
    // Block piece spawning while transition fade is running before credits start.
    if (this.minoFadeActive) {
      return;
    }

    if (
      this.creditsActive &&
      this.creditsBGM &&
      !this.creditsBgmStarted &&
      this.bgmEnabled &&
      !this.isPaused
    ) {
      this.creditsBGM.play();
      this.creditsBgmStarted = true;
    }

    // Mark that gameplay pieces have begun spawning (enables timed cheese/SFX gating)
    if (!this.hasSpawnedPiece) {
      this.hasSpawnedPiece = true;
      this.zenCheeseTimer = 0; // start timing from first spawn
    }
    // Shirase garbage check before spawning next piece (during ARE)
    const modeId =
      (this.gameMode && typeof this.gameMode.getModeId === "function"
        ? this.gameMode.getModeId()
        : this.selectedMode) || "";
    const isShiraseMode =
      modeId === "tgm3_shirase" || modeId === "shirase" || modeId === "tgm3_shirase_mode";
    if (isShiraseMode && this.level >= 500 && this.level < 1000) {
      const quota = this.getShiraseQuotaForLevel(this.level);
      if (quota > 0 && this.shiraseGarbageCounter >= quota) {
        this.raiseShiraseGarbage();
        this.shiraseGarbageCounter = 0;
      }
    }

    if (this.nextPieces.length < 6) {
      this.generateNextPieces();
    }
    // Reset lock reset tracking for new piece
    this.lockResetCount = 0;
    this.lastGroundedY = null;
    this.softDropMovedThisPiece = false;
    // Reset spin tracking for new piece
    this.spinRotatedWhileGrounded = false;

    // Sanitize next piece entry
    const rawNext = this.nextPieces.shift();
    let pieceType =
      typeof rawNext === "string"
        ? rawNext
        : typeof rawNext?.type === "string"
          ? rawNext.type
          : typeof rawNext?.piece === "string"
            ? rawNext.piece
            : rawNext;
    let pieceTextureKey =
      rawNext && typeof rawNext === "object" && rawNext.textureKey
        ? rawNext.textureKey
        : null;
    if (typeof pieceType !== "string") {
      pieceType = "I";
    }
    pieceType = pieceType.toUpperCase();

    const modeIdLower = typeof modeId === "string" ? modeId.toLowerCase() : "";
    const isTgm3Mode =
      modeIdLower === "tgm3" ||
      modeIdLower === "tgm3_master" ||
      modeIdLower === "tgm3_easy" ||
      modeIdLower === "tgm3_sakura" ||
      modeIdLower === "tgm3_shirase" ||
      modeIdLower === "shirase";

    // For Ti modes, update history on actual spawn so later history checks use real recent pieces.
    if (isTgm3Mode) {
      this.pieceHistory.shift();
      this.pieceHistory.push(pieceType);
      this.validatePieceHistory();
    }

    // Immediately top up queue so previews stay at 6 after consuming one
    if (this.nextPieces.length < 6) {
      this.generateNextPieces();
    }

    // Determine mode and powerup gating (TGM2 Normal only)
    const isTgm2Normal =
      modeIdLower === "tgm2_normal" || modeIdLower === "normal" || modeIdLower === "tgm2normal";
    let powerupType = null;
    if (isTgm2Normal) {
      // Force powerup spawn at/after thresholds if not yet spawned
      if (this.level >= 200 && !this.powerupSpawned.del_even) {
        powerupType = "del_even";
      } else if (this.level >= 100 && !this.powerupSpawned.free_fall) {
        powerupType = "free_fall";
      }
    }

    // Create piece (powerup if allowed)
    if (
      powerupType &&
      typeof PowerupMino !== "undefined" &&
      PowerupMino.createPowerupPiece
    ) {
      this.currentPiece = PowerupMino.createPowerupPiece(
        pieceType,
        powerupType,
        this.rotationSystem,
      );
      // Track for status label
      this.activePowerupType = powerupType;
      // Mark as spawned to guarantee once-per-level
      if (powerupType === "free_fall") this.powerupSpawned.free_fall = true;
      if (powerupType === "del_even") this.powerupSpawned.del_even = true;
    } else {
      this.currentPiece = new Piece(
        pieceType,
        this.rotationSystem,
        0,
        pieceTextureKey,
      );
      this.activePowerupType = null;
    }

    if (this.gameMode && typeof this.gameMode.onPieceSpawn === "function") {
      const modePiece =
        this.gameMode.onPieceSpawn.length >= 2
          ? this.gameMode.onPieceSpawn(this.currentPiece, this)
          : this.gameMode.onPieceSpawn(this);
      if (modePiece) {
        this.currentPiece = modePiece;
      }
    }

    // Shirase garbage counter increment per piece spawn (500-999)
    if (isShiraseMode && this.level >= 500 && this.level < 1000) {
      this.shiraseGarbageCounter += 1;
    }

    if (this.isFirstSpawn && this.gameMode && !this.isEligibleTimingOverride) {
      this.dasDelay =
        this.gameMode.getDAS && typeof this.gameMode.getDAS === "function"
          ? this.gameMode.getDAS()
          : this.dasDelay;
      this.arrDelay =
        this.gameMode.getARR && typeof this.gameMode.getARR === "function"
          ? this.gameMode.getARR()
          : this.arrDelay;
      this.areDelay =
        this.gameMode.getARE && typeof this.gameMode.getARE === "function"
          ? this.gameMode.getARE()
          : this.areDelay;
    }


    // Track if piece will be pre-rotated for spawn validation
    let wasPreRotated = false;

    // IRS sound will be played after IRS is applied

    // Play next mino sound for the piece that will spawn NEXT (not current piece)
    if (this.nextPieces.length > 0) {
      const rawNextSound = this.nextPieces[0];
      let nextSoundType =
        typeof rawNextSound === "string"
          ? rawNextSound
          : typeof rawNextSound?.type === "string"
            ? rawNextSound.type
            : typeof rawNextSound?.piece === "string"
              ? rawNextSound.piece
              : rawNextSound;
      if (typeof nextSoundType !== "string") {
        nextSoundType = "I";
      }
      const nextPieceSoundKey = `sound_${nextSoundType.toLowerCase()}`;
      this.playSfx(nextPieceSoundKey, 0.4);
    }

    if (
      !this.board.isValidPosition(
        this.currentPiece,
        this.currentPiece.x,
        this.currentPiece.y,
      )
    ) {
      // If prerotated piece can't spawn, try shifting up to give player a chance
      if (wasPreRotated) {
        let shifted = false;
        for (let shiftY = -1; shiftY >= -3; shiftY--) {
          if (
            this.board.isValidPosition(
              this.currentPiece,
              this.currentPiece.x,
              this.currentPiece.y + shiftY,
            )
          ) {
            this.currentPiece.y += shiftY;
            shifted = true;
            break;
          }
        }
        if (!shifted) {
          const zenActive = this.isZenSandboxActive();
          if (zenActive) {
            const recoverZenTopout = () => {
              try {
                console.log("[ZenTopout] inline recover (after shift)");
              } catch {}
              // Drive default topout visuals: fade stack and slow BGM, then clear and respawn without GAME OVER text.
              const startTime = this.time?.now || Date.now();
              this.zenTopoutPendingFinish = true;
              this.zenTopoutFreezeActive = true;
              this.zenTopoutCooldown = false;
              this.zenTopoutFreezeStart = startTime;
              this.suppressGameOverOnce = true;
              this.gameOver = false;
              this.showGameOverText = false;
              this.gameOverTextTimer = 0;
              this.gameOverSfxPlayed = true;
              this.gameOverFadeDoneTime = null;
              if (this.gameOverText?.setVisible) this.gameOverText.setVisible(false);
              else if (this.gameOverText?.setAlpha) this.gameOverText.setAlpha(0);
              // Prime mino fade based on current stack
              try {
                this.placedMinos = [];
                this.placedMinoRows = [];
                this.minoRowFadeAlpha = {};
                this.fadingComplete = false;
                for (let r = 0; r < this.board.rows; r++) {
                  for (let c = 0; c < this.board.cols; c++) {
                    const cell = this.board.grid[r][c];
                    if (cell) {
                      this.placedMinos.push({ x: c, y: r, color: cell, faded: false });
                      if (!this.placedMinoRows.includes(r)) this.placedMinoRows.push(r);
                    }
                  }
                }
                this.placedMinoRows.sort((a, b) => b - a);
                const rowCount = this.placedMinoRows.length;
                this.minoFadePerRowDuration = rowCount > 0 ? 2 / rowCount : 2;
                this.minoFadeActive = true;
                this.minoFadeProgress = 0;
                this.minoFadeTimer = 0;
              } catch (err) {
                try {
                  console.error("[ZenTopout] inline fade init error (after shift)", err);
                } catch {}
              }
              // Slow BGM during delay (ramp 1x -> 0.25x over 2s)
              try {
                const originalRate =
                  this.currentBGM && typeof this.currentBGM.rate === "number"
                    ? this.currentBGM.rate
                    : 1;
                this._zenTopoutBgmRate = originalRate;
                if (this.currentBGM) {
                  if (this.tweens?.add) {
                    this.tweens.add({
                      targets: this.currentBGM,
                      rate: 0.25,
                      duration: 2000,
                      ease: "Linear",
                    });
                  } else if (this.currentBGM.setRate) {
                    this.currentBGM.setRate(0.25);
                  } else {
                    this.currentBGM.rate = 0.25;
                  }
                }
              } catch {}
              const restoreBgmRate = () => {
                try {
                  const rate = this._zenTopoutBgmRate || 1;
                  if (this.tweens?.add && this.currentBGM) {
                    this.tweens.add({
                      targets: this.currentBGM,
                      rate,
                      duration: 300,
                      ease: "Linear",
                    });
                  } else if (this.currentBGM?.setRate) {
                    this.currentBGM.setRate(rate);
                  } else if (this.currentBGM) {
                    this.currentBGM.rate = rate;
                  }
                  this._zenTopoutBgmRate = null;
                } catch {}
              };
              const finalizeTopout = () => {
                try {
                  // Clear board like default topout but skip GAME OVER UI
                  if (this.board) {
                    if (typeof this.board.clearAll === "function") {
                      this.board.clearAll();
                    } else if (Array.isArray(this.board.grid) && Array.isArray(this.board.fadeGrid)) {
                      for (let r = 0; r < this.board.rows; r++) {
                        this.board.grid[r] = Array(this.board.cols).fill(0);
                        this.board.fadeGrid[r] = Array(this.board.cols).fill(0);
                      }
                    }
                    this.ensureZenCheeseBaseline?.(0);
                  }
                  this.playSfx?.("fall");
                  this.currentPiece = null;
                  this.isGrounded = false;
                  if (this.nextPieces.length < 6) this.generateNextPieces();
                  this.zenTopoutPendingFinish = false;
                  this.zenTopoutFreezeActive = false;
                  this.zenTopoutCooldown = false;
                  this.zenTopoutFreezeStart = 0;
                  restoreBgmRate();
                  if (this.time?.delayedCall) {
                    this.time.delayedCall(0, () => this.spawnPiece());
                  } else if (typeof setTimeout === "function") {
                    setTimeout(() => this.spawnPiece(), 0);
                  } else {
                    this.spawnPiece();
                  }
                } catch (err) {
                  try {
                    console.error("[ZenTopout] inline finalize error (after shift)", err);
                  } catch {}
                  this.zenTopoutPendingFinish = false;
                  this.zenTopoutFreezeActive = false;
                  this.zenTopoutCooldown = false;
                  restoreBgmRate();
                }
              };
              const doClear = () => {
                try {
                  console.log("[ZenTopout] doClear (after shift)");
                } catch {}
                finalizeTopout();
              };
              if (this.time?.delayedCall) {
                this.time.delayedCall(2000, doClear);
              } else if (typeof setTimeout === "function") {
                setTimeout(doClear, 2000);
              } else {
                doClear();
              }
              return;
            };
            try {
              console.log("[ZenTopout] spawn fail after shift", {
                prerotated: wasPreRotated,
                pos: { x: this.currentPiece?.x, y: this.currentPiece?.y },
                zenActive,
                mode: this.gameMode?.getModeId?.() || this.selectedMode,
                hasConfig: !!this.zenSandboxConfig,
                level: this.level,
              });
            } catch {}
            recoverZenTopout();
            return;
          }
          // Still can't spawn after shifting - in Zen, do a silent recover; otherwise game over
          if (this.isZenSandboxActive()) {
            this.zenTopoutPendingFinish = true;
            this.zenTopoutFreezeActive = true;
            this.zenTopoutCooldown = false;
            this.zenTopoutFreezeStart = this.time?.now || Date.now();
            this.gameOver = false;
            this.showGameOverText = false;
            this.gameOverTextTimer = 0;
            this.gameOverSfxPlayed = true;
            this.gameOverFadeDoneTime = null;
            if (typeof this.finishZenTopout === "function") {
              this.finishZenTopout("zen_fallback_after_shift_fail");
            } else {
              // Inline fallback clear/spawn
              if (this.board) {
                if (typeof this.board.clearAll === "function") {
                  this.board.clearAll();
                } else if (Array.isArray(this.board.grid) && Array.isArray(this.board.fadeGrid)) {
                  for (let r = 0; r < this.board.rows; r++) {
                    this.board.grid[r] = Array(this.board.cols).fill(0);
                    this.board.fadeGrid[r] = Array(this.board.cols).fill(0);
                  }
                }
                this.ensureZenCheeseBaseline?.(0);
              }
              this.playSfx?.("fall");
              this.currentPiece = null;
              this.isGrounded = false;
              if (this.nextPieces.length < 6) this.generateNextPieces();
              this.spawnPiece();
            }
            return;
          }
          // Non-zen: game over
          if (this.currentBGM) {
            this.currentBGM.stop();
            this.currentBGM = null;
          }
          this.showGameOverScreen();
          return;
        }
      } else {
        const zenActive = this.isZenSandboxActive();
        if (zenActive) {
          try {
            console.log("[ZenTopout] spawn fail no-shift", {
              prerotated: wasPreRotated,
              pos: { x: this.currentPiece?.x, y: this.currentPiece?.y },
              zenActive,
              mode: this.gameMode?.getModeId?.() || this.selectedMode,
              hasConfig: !!this.zenSandboxConfig,
              level: this.level,
            });
          } catch {}
          // Use the Zen-specific showGameOverScreen copy and return
          this.showGameOverScreen();
          return;
        }
        // Game over - piece can't spawn (reached top of visible area)
        // Stop BGM on game over
        if (this.currentBGM) {
          this.currentBGM.stop();
          this.currentBGM = null;
        }

        // Show game over screen
        this.showGameOverScreen();
        return;
      }
    }

    const hasInstantSpawnGravity = this.getTGMGravitySpeed(this.level) >= 5120;
    this.resetLockDelay();
    this.isGrounded = false;
    this.gravityAccum = 0;
    this.skipGravityThisFrame = false;

    // Track piece spawn time for scoring
    this.pieceSpawnTime = this.time.now;
    this.pieceActiveTime = 0;

    // Preserve ARE input states so we can apply IRS/IHS correctly after swapping
    const allowAreInputs = this.shouldAllowAREInputs();
    const allowDasInputs = allowAreInputs || this.isFirstSpawn;
    const rotationDirectionAtSpawn = allowAreInputs ? this.areRotationDirection : 0;
    const rotationKeysAtSpawn = allowAreInputs ? { ...this.areRotationKeys } : {};
    const holdPressedAtSpawn = allowAreInputs ? this.areHoldPressed : false;

    // Reset ARE rotation and hold tracking for the next cycle
    this.areRotationDirection = 0;
    this.areHoldPressed = false;

    // Handle ARE hold (Initial Hold System) for modes that support hold
    if (allowAreInputs && this.holdEnabled && holdPressedAtSpawn) {
      this.performHoldSwap({ bypassCanHold: true, isIHS: true });
      // Consume the request so it doesn't double-trigger after spawn
      this.holdRequest = false;
    }

    const irsRotationDirection = rotationDirectionAtSpawn;

    // Apply IRS to the spawning piece (which may have been swapped by IHS)
    if (allowAreInputs && irsRotationDirection === 1) {
      this.currentPiece.rotation = 1; // Clockwise 90 degrees
      this.currentPiece.shape = this.currentPiece.getRotatedShape();
      wasPreRotated = true;
    } else if (allowAreInputs && irsRotationDirection === -1) {
      this.currentPiece.rotation = 3; // Counter-clockwise 90 degrees
      this.currentPiece.shape = this.currentPiece.getRotatedShape();
      wasPreRotated = true;
    }

    // Prevent the held rotation key from rotating again on the first active frame after spawn.
    // Otherwise, the piece can rotate twice (IRS + immediate input rotation), which can apply kicks (often +1Y).
    if (allowAreInputs && rotationKeysAtSpawn.k) {
      this.kKeyPressed = true;
    }
    if (allowAreInputs && rotationKeysAtSpawn.space) {
      this.spaceKeyPressed = true;
    }
    if (allowAreInputs && rotationKeysAtSpawn.l) {
      this.lKeyPressed = true;
    }

    // IRS rotates the piece without kicks; ensure the rotated spawn is still valid.
    if (
      wasPreRotated &&
      !this.board.isValidPosition(
        this.currentPiece,
        this.currentPiece.x,
        this.currentPiece.y,
      )
    ) {
      let shifted = false;
      for (let shiftY = -1; shiftY >= -3; shiftY--) {
        if (
          this.board.isValidPosition(
            this.currentPiece,
            this.currentPiece.x,
            this.currentPiece.y + shiftY,
          )
        ) {
          this.currentPiece.y += shiftY;
          shifted = true;
          break;
        }
      }

      if (!shifted) {
        if (this.currentBGM) {
          this.currentBGM.stop();
          this.currentBGM = null;
        }
        this.showGameOverScreen();
        return;
      }
    }

    // Log IRS+IHS combination
    // Play IRS sound if piece was pre-rotated
    if (wasPreRotated) {
      this.playSfx("IRS", 0.5);
    }

    if (hasInstantSpawnGravity) {
      this.currentPiece.hardDrop(this.board);
      this.isGrounded = true;
      this.lastGroundedY = this.currentPiece ? this.currentPiece.y : this.lastGroundedY;
      this.lockDelayBufferedStart = true;
      this.lockDelay = 0;
      this.gravityAccum = 0;
      this.skipGravityThisFrame = true;
    }

    // Reset finesse tracking for the freshly active piece
    this.resetFinessePieceInputs(this.currentPiece);

    this.primeDASForSpawn(allowDasInputs);

    // Update level on piece spawn
    if (this.isFirstSpawn) {
      // Only set level to 0 when starting from level 0
      if (!this.startingLevel || this.startingLevel === 0) {
        this.level = 0;
      }
      this.isFirstSpawn = false;
    } else {
      this.updateLevel("piece");
    }
  }

  generateNextPieces(minCount = 6) {
    const modeId =
      (this.gameMode && typeof this.gameMode.getModeId === "function"
        ? this.gameMode.getModeId()
        : this.selectedMode) || "";
    const modeIdLower = typeof modeId === "string" ? modeId.toLowerCase() : "";
    const isGuidelineBagMode =
      modeIdLower.includes("ultra") ||
      modeIdLower.includes("sprint") ||
      modeIdLower.includes("marathon");
    const isZenMode = modeIdLower.includes("zen");
    if (isGuidelineBagMode) {
      // Force a fresh standard 7-bag when entering guideline modes to avoid stale/randomized bags
      // from prior Zen sessions or other modes.
      const needsNewBag =
        this.guidelineBagSeed !== modeIdLower ||
        !Array.isArray(this.bagQueue) ||
        this.bagQueue.length < 7 ||
        this.bagDrawCount > 0;
      if (needsNewBag) {
        this.bagQueue = this.createShuffledBag();
        this.bagDrawCount = 0;
        this.bagDebugSeen = new Set();
        this.guidelineBagSeed = modeIdLower;
      }
      // Ignore any Zen sandbox bag/runtime for these modes
      this.zenSandboxConfig = null;
      this.zenSandboxRuntime = { bagQueue: [], bagType: null };
    }
    if (isZenMode) {
      if (!this.zenSandboxConfig) {
        if (typeof ZenSandboxHelper !== "undefined" && ZenSandboxHelper.loadConfig) {
          this.zenSandboxConfig = ZenSandboxHelper.loadConfig();
        } else if (typeof ZenSandboxHelper !== "undefined" && ZenSandboxHelper.defaults) {
          this.zenSandboxConfig = { ...ZenSandboxHelper.defaults };
        } else {
          this.zenSandboxConfig = { bagType: "7bag" };
        }
      }
      if (typeof ZenSandboxHelper !== "undefined" && ZenSandboxHelper.resetRuntime) {
        const needsReset =
          !this.zenSandboxRuntime ||
          this.zenSandboxRuntime.bagType !== this.zenSandboxConfig.bagType ||
          !this.zenSandboxInitDone;
        if (needsReset) {
          ZenSandboxHelper.resetRuntime(this, this.zenSandboxConfig);
          if (Array.isArray(this.nextPieces)) this.nextPieces.length = 0;
          this.zenSandboxInitDone = true;
        }
      }
    }
    // Treat any Zen mode as sandbox for piece generation (config is loaded above)
    const isZenSandbox = isZenMode;
    const prefersTGMRand =
      !isGuidelineBagMode &&
      (modeIdLower.startsWith("tgm") ||
        modeIdLower.includes("shirase") ||
        modeIdLower.includes("death") ||
        modeIdLower.includes("plus") ||
        modeIdLower.includes("tgm4_rounds") ||
        modeIdLower === "master_20g");
    const isShiraseMode =
      modeId === "tgm3_shirase" || modeId === "shirase" || modeId === "tgm3_shirase_mode";
    const monoActive = isShiraseMode && this.level >= 1000;
    const monoTextureKey = this.rotationSystem === "ARS" ? "mono_ars" : "mono";

    const isTgm3Mode =
      modeIdLower === "tgm3" ||
      modeIdLower === "tgm3_master" ||
      modeIdLower === "tgm3_easy" ||
      modeIdLower === "tgm3_sakura" ||
      modeIdLower === "tgm3_shirase" ||
      modeIdLower === "shirase";
    // Default to 7-bag whenever we're not using a custom generator or TGM3 35-bag.
    const use7Bag =
      isGuidelineBagMode ||
      (!(this.gameMode && this.gameMode.generateNextPiece) && !prefersTGMRand && !isTgm3Mode);

    // Helper to normalize piece type strings
    const normalizeType = (p) =>
      typeof p === "string"
        ? p.toUpperCase()
        : typeof p?.type === "string"
          ? p.type.toUpperCase()
          : typeof p?.piece === "string"
            ? p.piece.toUpperCase()
            : null;

    while (this.nextPieces.length < minCount) {
      // Check if current mode supports powerup minos
      let piece;
      if (isZenSandbox) {
        piece = this.getZenSandboxPiece();
      } else if (this.gameMode && this.gameMode.generateNextPiece) {
        piece = this.gameMode.generateNextPiece(this);
      } else if (isTgm3Mode) {
        piece = this.generateTgm3Piece();
      } else if (use7Bag) {
        piece = this.generate7BagPiece();
      } else {
        // Non-7-bag path: use TGM1 history unless explicitly classic or pairs
        const prefersClassic = this.selectedMode === "classic" || this.selectedMode === "classic_mode";
        const prefersPairs = this.selectedMode === "pairs" || this.selectedMode === "pairs_mode";
        if (prefersPairs) {
          piece = this.generatePairsPiece();
        } else if (prefersClassic) {
          piece = this.generateClassicPiece();
        } else {
          piece = this.generateTGM1Piece();
        }
      }

      const entry =
        monoActive && piece && typeof piece === "object" && !piece.textureKey
          ? { ...piece, textureKey: monoTextureKey }
          : monoActive && typeof piece === "string"
            ? { type: piece, textureKey: monoTextureKey }
            : piece;

      const queueIndex = this.nextPieces.length; // 0-based index where this piece will sit

      // Ti-specific: apply history rejection only to the piece immediately after the visible 3-preview window (index 3).
      if (isTgm3Mode) {
        let tgm3Candidate = entry;
        if (queueIndex === 3) {
          let attempts = 0;
          while (
            attempts < 6 &&
            normalizeType(tgm3Candidate) &&
            this.pieceHistory.includes(normalizeType(tgm3Candidate))
          ) {
            tgm3Candidate = this.generateTgm3Piece();
            attempts++;
          }
        }

        // Enforce first-piece S/Z/O restriction for Ti modes, but do not apply full history filter.
        this.nextPieces.push(
          this.applyFirstPieceRestriction(
            tgm3Candidate,
            modeIdLower,
            false, // keep history-only-on-index-3 behavior
          ),
        );
        continue;
      }

      const applyHistory =
        !use7Bag &&
        !isTgm3Mode &&
        !(this.gameMode && this.gameMode.generateNextPiece) &&
        !prefersClassic &&
        !prefersPairs;
      this.nextPieces.push(
        this.applyFirstPieceRestriction(
          entry,
          modeIdLower,
          applyHistory, // enforce history only on TGM1 generator path
        ),
      );
    }
  }

  validatePieceHistory() {
    // Ensure piece history contains exactly 4 pieces and no null/undefined values
    if (!this.pieceHistory || this.pieceHistory.length !== 4) {
      this.pieceHistory = ["Z", "Z", "S", "S"]; // Reset to initial state
    }

    // Filter out any null, undefined, or invalid pieces
    const validPieces = Object.keys(TETROMINOES);
    this.pieceHistory = this.pieceHistory.filter(
      (piece) => piece && validPieces.includes(piece),
    );

    // If history got too small, fill with default pieces
    while (this.pieceHistory.length < 4) {
      this.pieceHistory.push("Z"); // Default fallback
    }

    // Ensure we never have more than 4 pieces
    if (this.pieceHistory.length > 4) {
      this.pieceHistory = this.pieceHistory.slice(-4); // Keep only last 4
    }
  }

  generateClassicPiece() {
    // Classic: random with no immediate repeats
    const pieces = Object.keys(TETROMINOES);
    const last = this.lastClassicPiece || null;
    const pool = pieces.filter((p) => p !== last);
    const pick = pool[Math.floor(Math.random() * pool.length)];
    this.lastClassicPiece = pick;
    return pick;
  }

  generatePairsPiece() {
    // Pairs: choose two minos at a time and emit A,B,B,A before choosing a new pair
    if (!Array.isArray(this.pairsQueue)) this.pairsQueue = [];
    if (this.pairsQueue.length === 0) {
      const bag = this.createShuffledBag();
      for (let i = 0; i < bag.length; i += 2) {
        const a = bag[i];
        const b = bag[(i + 1) % bag.length];
        this.pairsQueue.push(a, b, b, a);
      }
    }
    return this.pairsQueue.shift();
  }

  generateTGM1Piece() {
    // TGM1 randomizer algorithm:
    // 1. Keep a history of four recent pieces (start with [Z,Z,S,S])
    // 2. Generate a piece, then check if the piece is in the history
    // 3. If it does, generate another piece (retry generating another piece up to 6 times)
    // 4. The first piece can never be S, Z, or O

    const types = Object.keys(TETROMINOES);
    let generatedPiece;
    let attempts = 0;

    // First piece restriction: cannot be S, Z, or O
    if (this.firstPiece) {
      const firstPieceTypes = ["I", "J", "L", "T"]; // Exclude S, Z, O
      generatedPiece =
        firstPieceTypes[Math.floor(Math.random() * firstPieceTypes.length)];
      this.firstPiece = false;
    } else {
      // Generate piece with history checking
      do {
        generatedPiece = types[Math.floor(Math.random() * types.length)];
        attempts++;
      } while (this.pieceHistory.includes(generatedPiece) && attempts < 6);
    }

    // Update history: maintain exactly 4 most recent pieces
    // Remove oldest piece and add new piece
    this.pieceHistory.shift(); // Remove first (oldest) element
    this.pieceHistory.push(generatedPiece); // Add new piece at end

    // Ensure history never exceeds 4 pieces (safety check)
    if (this.pieceHistory.length > 4) {
      this.pieceHistory = this.pieceHistory.slice(-4); // Keep only last 4
    }

    return generatedPiece;
  }

  generateTgm3Piece() {
    const PIECES = ["I", "J", "L", "O", "S", "T", "Z"];

    if (!this.tgm3DroughtCounters) {
      this.tgm3DroughtCounters = {};
      PIECES.forEach((p) => {
        this.tgm3DroughtCounters[p] = 0;
      });
    }
    if (!Array.isArray(this.tgm3BagQueue)) {
      this.tgm3BagQueue = [];
    }

    const pickMaxDroughtPiece = () => {
      let max = -1;
      let chosen = "I";
      PIECES.forEach((p) => {
        const d = this.tgm3DroughtCounters[p] ?? 0;
        if (d > max || (d === max && p < chosen)) {
          max = d;
          chosen = p;
        }
      });
      return chosen;
    };

    const shuffleArray = (arr) => {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    };

    const ensureBag = () => {
      if (this.tgm3BagQueue.length === 0) {
        const bag = [];
        for (let i = 0; i < 5; i++) {
          bag.push(...PIECES);
        }
        this.tgm3BagQueue = shuffleArray(bag);
      }
    };

    ensureBag();

    const piece = this.tgm3BagQueue.shift();

    // Update drought counters
    PIECES.forEach((p) => {
      this.tgm3DroughtCounters[p] = (this.tgm3DroughtCounters[p] ?? 0) + 1;
    });
    this.tgm3DroughtCounters[piece] = 0;

    // Append current max-drought piece to keep bag length at 35
    const droughtPiece = pickMaxDroughtPiece();
    this.tgm3BagQueue.push(droughtPiece);

    return piece;
  }

  applyFirstPieceRestriction(rawPiece, modeIdLower = "", enforceHistory = false) {
    if (!this.firstPiece) return rawPiece;

    const exempt =
      modeIdLower === "ultra" ||
      modeIdLower === "marathon" ||
      modeIdLower === "zen" ||
      modeIdLower.startsWith("sprint");

    if (exempt) {
      this.firstPiece = false;
      return rawPiece;
    }

    // For all non-exempt modes, always enforce history safety on the very first piece
    const enforceFirst = true;

    const type =
      typeof rawPiece === "string"
        ? rawPiece.toUpperCase()
        : typeof rawPiece?.type === "string"
          ? rawPiece.type.toUpperCase()
          : typeof rawPiece?.piece === "string"
            ? rawPiece.piece.toUpperCase()
            : null;
    const textureKey = rawPiece && typeof rawPiece === "object" ? rawPiece.textureKey : null;

    // If first piece in non-exempt mode, reject S/Z/O and also avoid any history collision.
    const disallowed = ["S", "Z", "O"];
    if (!type || disallowed.includes(type) || (enforceFirst && this.pieceHistory.includes(type))) {
      // pick from safe set and avoid current history if possible
      const allowed = ["I", "J", "L", "T"].filter(
        (p) => !this.pieceHistory.includes(p),
      );
      const pool = allowed.length > 0 ? allowed : ["I", "J", "L", "T"];
      const replacement = pool[Math.floor(Math.random() * pool.length)];

      this.firstPiece = false;

      if (typeof rawPiece === "string") {
        return { type: replacement, textureKey };
      }
      if (rawPiece && typeof rawPiece === "object") {
        return { ...rawPiece, type: replacement, piece: replacement, textureKey };
      }
      return { type: replacement, textureKey };
    }

    // Allowed piece: keep original
    this.firstPiece = false;
    return rawPiece;
  }

  createShuffledBag() {
    const bag = ["I", "J", "L", "O", "S", "T", "Z"];
    for (let i = bag.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [bag[i], bag[j]] = [bag[j], bag[i]];
    }
    return bag;
  }

  generate7BagPiece() {
    if (!Array.isArray(this.bagQueue)) {
      this.bagQueue = [];
    }
    // Refill only when a bag is fully consumed to keep bags separate and unique.
    if (this.bagQueue.length === 0) {
      this.bagQueue = this.createShuffledBag();
      this.bagDrawCount = 0;
      this.bagDebugSeen = new Set();
    }
    if (!this.bagDebugSeen) this.bagDebugSeen = new Set();

    const piece = this.bagQueue.shift();
    this.bagDrawCount++;
    this.bagDebugSeen.add(piece);

    if (this.bagDrawCount === 7) {
      if (this.bagDebugSeen.size !== 7) {
        console.warn(
          "[7-BAG DEBUG] Incomplete bag detected:",
          Array.from(this.bagDebugSeen),
        );
      }
      this.bagDebugSeen = new Set();
      this.bagDrawCount = 0;
    }
    return piece;
  }

  // Developer harness: logs and returns the first n bags to verify uniqueness.
  debugLogBags(bagCount = 3) {
    const results = [];
    // Preserve live state so gameplay is not affected.
    const originalQueue = Array.isArray(this.bagQueue) ? [...this.bagQueue] : [];
    const originalDrawCount = this.bagDrawCount;
    const originalDebugSeen = this.bagDebugSeen ? new Set(this.bagDebugSeen) : null;
    const originalFirstPiece = this.firstPiece;

    this.bagQueue = [];
    this.bagDrawCount = 0;
    this.bagDebugSeen = new Set();
    this.firstPiece = originalFirstPiece;

    for (let i = 0; i < bagCount; i++) {
      const pieces = [];
      for (let j = 0; j < 7; j++) {
        pieces.push(this.generate7BagPiece());
      }
      const unique = new Set(pieces);
      results.push({
        bag: i + 1,
        pieces: pieces.join(""),
        size: unique.size,
        hasDuplicate: unique.size !== 7,
      });
    }

    console.table(results);

    // Restore live state.
    this.bagQueue = originalQueue;
    this.bagDrawCount = originalDrawCount;
    this.bagDebugSeen = originalDebugSeen;
    this.firstPiece = originalFirstPiece;

    return results;
  }

  lockPiece() {
    // Play lock sound
    this.playSfx("lock", 0.6);

    // Track pieces placed for PPS calculation (freeze piece counter during credits roll).
    if (!this.creditsActive) {
      this.totalPiecesPlaced++;
      if (this.pieceCountText) this.pieceCountText.setText(this.totalPiecesPlaced.toString());
    }
    this.updateFinesseInputUI?.();
    // Track worst choke (longest active time)
    this.worstChoke = Math.max(this.worstChoke, this.pieceActiveTime || 0);

    // Start lock flash effect
    this.startLockFlash();

    const rollClock = this.creditsActive ? this.creditsTimer || 0 : this.currentTime || 0;
    let pieceFadeExpireAt = null;
    if (this.fadingRollActive && !this.invisibleStackActive) {
      const modeIdForFade =
        (this.gameMode && typeof this.gameMode.getModeId === "function"
          ? this.gameMode.getModeId()
          : this.selectedMode) || "";
      const modeKeyForFade = typeof modeIdForFade === "string" ? modeIdForFade.toLowerCase() : "";
      // Ti disappearing roll: blocks disappear 5s after lock.
      const fadeLifetimeSec =
        modeKeyForFade === "tgm3" || modeKeyForFade === "tgm3_master" ? 5 : 4;
      const baseExpire = rollClock + fadeLifetimeSec;
      const minGap = 1 / 60;
      pieceFadeExpireAt = Math.max(baseExpire, (this.rollFadeLastExpireTime || 0) + minGap);
      this.rollFadeLastExpireTime = pieceFadeExpireAt;
    }

    // Track placed minos before placing the piece
    for (let r = 0; r < this.currentPiece.shape.length; r++) {
      for (let c = 0; c < this.currentPiece.shape[r].length; c++) {
        if (this.currentPiece.shape[r][c]) {
          const boardX = this.currentPiece.x + c;
          const boardY = this.currentPiece.y + r;
          this.trackPlacedMino(boardX, boardY, this.currentPiece.color);

          if (
            this.fadingRollActive &&
            !this.invisibleStackActive &&
            boardY >= 0 &&
            boardY < this.board.rows &&
            boardX >= 0 &&
            boardX < this.board.cols
          ) {
            this.board.fadeGrid[boardY][boardX] = pieceFadeExpireAt;
          }
        }
      }
    }

    this.board.placePiece(
      this.currentPiece,
      this.currentPiece.x,
      this.currentPiece.y,
    );

    // Mode hook: notify piece lock (e.g., Easy combo reset on no clear)
    if (this.gameMode && typeof this.gameMode.onPieceLock === "function") {
      this.gameMode.onPieceLock(this.currentPiece, this);
    }

    // Finesse evaluation on lock (SRS sprint/ultra only)
    this.evaluateFinesseOnLock(this.currentPiece);
    this.finesseActiveForPiece = false;

    // Check for spin (T: 3-corner, others: immobile)
    const spinInfo = this.detectSpin(this.currentPiece, this.board);
    this.lastSpinInfo = spinInfo;

    // Detect cleared lines for animation (don't clear them yet)
    const linesToClear = [];
    const allCompletedLines = [];
    // Check ALL rows in the board (0-21) to find complete lines
    for (let r = 0; r < this.board.rows; r++) {
      if (this.board.grid[r].every((cell) => cell !== 0)) {
        allCompletedLines.push(r);
        if (!this.board.isFrozenLine?.(r)) {
          linesToClear.push(r);
        }
      }
    }
    const effectiveLinesCleared =
      this.gameMode && typeof this.gameMode.getEffectiveLineClearCount === "function"
        ? this.gameMode.getEffectiveLineClearCount(this, linesToClear, allCompletedLines)
        : linesToClear.length;

    // Count cleared garbage rows (grey cheese rows are 0x444444)
    let garbageLinesCleared = 0;
    if (linesToClear.length > 0 && this.board?.grid) {
      garbageLinesCleared = linesToClear.reduce((acc, rowIndex) => {
        const row = this.board.grid[rowIndex] || [];
        const hasGarbageBlock = row.some((cell) => cell === 0x444444);
        return acc + (hasGarbageBlock ? 1 : 0);
      }, 0);
    }
    this.lastClearedHadGarbage = garbageLinesCleared > 0;
    this.garbageLinesClearedLast = garbageLinesCleared;

    // Store cleared lines for animation
    this.clearedLines = linesToClear;

    // Track pending powerup activation if any part of the powerup piece is cleared
    this.pendingPowerup = null;
    if (
      this.currentPiece &&
      this.currentPiece.isPowerup &&
      this.currentPiece.powerupType &&
      linesToClear.length > 0
    ) {
      const positions =
        typeof this.currentPiece.getPowerupCellPositions === "function"
          ? this.currentPiece.getPowerupCellPositions()
          : [];
      const clearedSet = new Set(linesToClear);
      const hit = positions.some((p) => clearedSet.has(p.boardY));
      if (hit) {
        this.pendingPowerup = {
          type: this.currentPiece.powerupType,
        };
        this.powerupCells.set(this.pendingPowerup.type, positions);
      }
    }

    const hadComboActive = this.comboCount > 0;
    const isTetrisClear = effectiveLinesCleared === 4;

    // SFX flags for Tetris and immediate follow-up clear
    let playApplause = false;
    let playComboChime = false;
    if (linesToClear.length > 0 && this.lastTetrisNoCombo) {
      playComboChime = true;
    }
    if (isTetrisClear && !hadComboActive) {
      playApplause = true;
    }

    if (!this.creditsActive && effectiveLinesCleared === 4) {
      const sectionIndex = Math.floor(this.getSectionBasisValue() / this.getSectionLength());
      if (sectionIndex === this.currentSection) {
        this.currentSectionTetrisCount++;
      }
    }

    // Update score with enhanced system
    const prevBackToBack = this.backToBack;
    const isAllClearFlag =
      linesToClear.length > 0 && this.isAllClearAfterLines && this.isAllClearAfterLines(linesToClear);
    this.updateScore(effectiveLinesCleared, this.currentPiece.type, spinInfo, {
      isAllClear: isAllClearFlag,
    });
    if (garbageLinesCleared > 0) {
      this.totalGarbageCleared = (this.totalGarbageCleared || 0) + garbageLinesCleared;
    }
    const triggeredBravo = linesToClear.length > 0 && this.isAllClearAfterLines(linesToClear);
    if (triggeredBravo) {
      const modeId =
        (this.gameMode && typeof this.gameMode.getModeId === "function"
          ? this.gameMode.getModeId()
          : this.selectedMode) || "unknown";
      try {
        `[BRAVO] mode=${modeId} lines=${linesToClear.length} level=${this.level} score=${this.score}`;
      } catch {}
      this.showBravoBanner();
    }
    // Zen cheese injection on line clears when configured (only in Zen sandbox modes)
    if (this.isZenSandboxActive && this.isZenSandboxActive()) {
      if (this.zenSandboxConfig && this.zenSandboxConfig.cheeseMode === "fixed_rows") {
        if (garbageLinesCleared > 0) {
          // Call helper (if present) and also force baseline directly for safety
          const rowsTarget = Math.max(1, Math.floor(Number(this.zenSandboxConfig.cheeseRows) || 1));
          const percent = Math.max(0, Math.min(100, Number(this.zenSandboxConfig.cheesePercent) || 0));
          const bottom = this.countBottomCheeseRows?.() || 0;
          const missing = Math.max(0, rowsTarget - bottom);
          const fillAmount = Math.min(missing, garbageLinesCleared);
          if (fillAmount > 0) {
            if (this.board && typeof this.board.addCheeseRows === "function") {
              this.board.addCheeseRows(fillAmount, percent);
            } else if (typeof this.ensureZenCheeseBaseline === "function") {
              // Fallback: baseline may add up to target, but limited by fillAmount through missing clamp
              this.ensureZenCheeseBaseline(linesToClear.length);
            }
          }
        }
      }
    }

    // Attack computation and B2B chain UI
    const attackResult = this.computeAttack(
      effectiveLinesCleared,
      spinInfo,
      triggeredBravo,
      prevBackToBack,
    );
    if (attackResult) {
      this.updateAttackStats(attackResult.attack, this.currentTime || 0);
      this.updateAttackUI();
      const shouldShowB2B =
        this.shouldShowB2BChain() &&
        (attackResult.isDifficult || attackResult.b2bBroken || attackResult.newChain >= 1);
      if (shouldShowB2B && this.b2bChainText) this.b2bChainText.setVisible(true);
      this.showB2BChain(
        attackResult.b2bMaintained,
        attackResult.b2bBroken,
        attackResult.prevChain,
        attackResult.newChain,
      );
      if (!shouldShowB2B && this.b2bChainText) this.b2bChainText.setVisible(false);
    }

    // Standard combo for zen/marathon/sprint/ultra
    if (this.isStandardComboMode()) {
      this.updateStandardCombo(effectiveLinesCleared > 0, this.currentTime || 0);
    }

    // Only adjust level for actual line clears; piece-based increments happen on spawn
    if (effectiveLinesCleared > 0) {
      this.updateLevel("lines", effectiveLinesCleared);
    }
    this.canHold = true;

    // Play Tetris / combo sounds with explicit sequencing
    if (linesToClear.length > 0) {
      try {
        if (playApplause) {
          this.sound?.add("applause", { volume: 0.8 })?.play();
        }
        if (playComboChime) {
          this.sound?.add("combo", { volume: 0.7 })?.play();
        }
      } catch {}
    }

    // Update Tetris->follow-up clear state
    if (linesToClear.length === 0) {
      this.lastTetrisNoCombo = false;
    } else if (playComboChime) {
      this.lastTetrisNoCombo = false; // consumed the follow-up
    } else if (playApplause) {
      this.lastTetrisNoCombo = true; // arm for next clear
    } else {
      this.lastTetrisNoCombo = false;
    }

    // Handle powerup effects for TGM2 mode
    if (this.gameMode && this.gameMode.handleLineClear) {
      this.gameMode.handleLineClear(
        this,
        effectiveLinesCleared,
        this.currentPiece.type,
      );
    }

    this.currentPiece = null;
    const hasPhysicalLineClear = linesToClear.length > 0;
    const shouldUseLineClearDelay = hasPhysicalLineClear || effectiveLinesCleared === 4;

    if (shouldUseLineClearDelay) {
      const lineClearDelay =
        this.isEligibleTimingOverride && this.lineClearDelayOverride !== null
          ? this.lineClearDelayOverride
          : this.gameMode && this.gameMode.getLineClearDelay
            ? this.gameMode.getLineClearDelay()
            : 40 / 60;
      const lineAREDelay =
        this.isEligibleTimingOverride && this.lineAreOverride !== null
          ? this.lineAreOverride
          : this.gameMode && this.gameMode.getLineARE
            ? this.gameMode.getLineARE()
            : 41 / 60;
      this.lineClearDelayDuration = lineClearDelay;
      this.pendingLineAREDelay = lineAREDelay;
      this.areDelay = lineClearDelay;
      this.areTimer = 0;
      this.areActive = true;
      this.lineClearDelayActive = true;
      this.lineClearPhase = false;
      this.isClearingLines = true;
      this.resetActiveDASState();
      // Reset ARE input state when ARE starts
      this.areRotationDirection = 0;
      this.areHoldPressed = false;

      // Play clear sound
      this.playSfx("clear", 0.7);
    } else {
      // Start normal ARE (prefer explicit override, else mode timing)
      const normalARE =
        this.isEligibleTimingOverride && this.areOverride !== null
          ? this.areOverride
          : this.gameMode && this.gameMode.getARE
            ? this.gameMode.getARE()
            : 30 / 60;
      this.areDelay = normalARE;
      this.areTimer = 0;
      this.areActive = true;
      this.lineClearPhase = false;
      this.isClearingLines = false;
      this.lineClearDelayActive = false;
      this.lineClearDelayDuration = 0;
      this.pendingLineAREDelay = 0;
      this.resetActiveDASState();
      // Reset ARE input state when ARE starts
      this.areRotationDirection = 0;
      this.areHoldPressed = false;
    }

    // Shirase garbage counter decrement on line clears (500-999)
    const modeId =
      (this.gameMode && typeof this.gameMode.getModeId === "function"
        ? this.gameMode.getModeId()
        : this.selectedMode) || "";
    const isShiraseMode =
      modeId === "tgm3_shirase" || modeId === "shirase" || modeId === "tgm3_shirase_mode";
    if (isShiraseMode && this.level >= 500 && this.level < 1000) {
      this.shiraseGarbageCounter = Math.max(
        0,
        this.shiraseGarbageCounter - linesToClear.length,
      );
    }

    // If item animation is active (e.g., powerup activation), delay ARE start by 2 seconds
    if (this.gameMode && this.gameMode.itemAnimationActive) {
      this.areTimer = -2; // Delay ARE start by 2 seconds
    }
  }

  // Reset piece to its default orientation (used when moving into hold)
  resetPieceToDefaultRotation(piece) {
    const rotations =
      this.rotationSystem === "ARS"
        ? SEGA_ROTATIONS[piece.type].rotations
        : TETROMINOES[piece.type].rotations;
    piece.rotation = 0;
    piece.shape = rotations[0].map((row) => [...row]);
  }

  getNextPieceTypeFromQueue() {
    const entry = this.getNextPieceEntryFromQueue();
    return entry.type;
  }

  getNextPieceEntryFromQueue() {
    if (this.nextPieces.length < 1) {
      this.generateNextPieces();
    }
    if (this.nextPieces.length < 1) {
      return { type: "I", textureKey: null };
    }
    const raw = this.nextPieces.shift();
    let t =
      typeof raw === "string"
        ? raw
        : typeof raw?.type === "string"
          ? raw.type
          : typeof raw?.piece === "string"
            ? raw.piece
            : raw;
    if (typeof t !== "string") t = "I";
    const textureKey =
      raw && typeof raw === "object" && raw.textureKey
        ? raw.textureKey
        : null;
    return { type: t.toUpperCase(), textureKey };
  }

  performHoldSwap({ bypassCanHold = false, isIHS = false } = {}) {
    if (!this.holdEnabled) return false;
    if (!bypassCanHold && !this.canHold) return false;
    if (!this.currentPiece) return false;

    const currentType = this.currentPiece.type;
    const currentTextureKey = this.currentPiece.textureKey || null;

    // Normalize existing hold piece if stored as string
    if (this.holdPiece && typeof this.holdPiece === "string") {
      this.holdPiece = new Piece(this.holdPiece, this.rotationSystem, 0);
    }

    if (this.holdPiece) {
      // Swap current with held
      const holdType = this.holdPiece.type;
      const holdTextureKey = this.holdPiece.textureKey || null;
      this.holdPiece = new Piece(currentType, this.rotationSystem, 0, currentTextureKey);
      this.currentPiece = new Piece(holdType, this.rotationSystem, 0, holdTextureKey);
    } else {
      // Move current to hold, pull next from queue
      this.holdPiece = new Piece(currentType, this.rotationSystem, 0, currentTextureKey);
      const nextEntry = this.getNextPieceEntryFromQueue();
      this.currentPiece = new Piece(nextEntry.type, this.rotationSystem, 0, nextEntry.textureKey);
    }

    // Reset position/rotation on the new current piece
    this.currentPiece.x = 3;
    this.currentPiece.y = 1;
    this.resetPieceToDefaultRotation(this.currentPiece);

    this.canHold = false;
    this.resetLockDelay();
    this.isGrounded = false;

    // Play hold/IHS sound if available
    try {
      const soundKey = isIHS ? "IHS" : "lock";
      const snd = this.sound?.add(soundKey, { volume: isIHS ? 0.6 : 0.4 });
      snd?.play();
    } catch {}

    return true;
  }

  // Hold functionality for modes that support it
  hold() {
    this.performHoldSwap({ bypassCanHold: false, isIHS: false });
  }

  clearStoredLines() {
    // ROBUST FIX: Clear lines without index shifting issues
    // Instead of splice/unshift, build a new grid without the cleared lines
    const clearedCount = this.clearedLines.length;

    // Safety: if a powerup row is being cleared but pendingPowerup isn't set (e.g., grid-stored powerup cells), detect it here.
    if (!this.pendingPowerup && this.clearedLines.length > 0) {
      for (const rowIdx of this.clearedLines) {
        const row = this.board.grid[rowIdx] || [];
        const cellWithPower = row.find(
          (cell) => cell && typeof cell === "object" && cell.powerupType,
        );
        if (cellWithPower) {
          this.pendingPowerup = { type: cellWithPower.powerupType };
          // cache positions for restoration (best-effort)
          const positions = [];
          for (let c = 0; c < row.length; c++) {
            const cell = row[c];
            if (cell && typeof cell === "object" && cell.powerupType === cellWithPower.powerupType) {
              positions.push({
                boardX: c,
                boardY: rowIdx,
                powerupType: cell.powerupType,
                originalColor: cell.originalColor,
                color: cell.color,
              });
            }
          }
          this.powerupCells.set(cellWithPower.powerupType, positions);
          break;
        }
      }
    }

    // Phase 1: Clear originally detected lines
    if (this.clearedLines.length > 0) {
      // Create a new grid without the cleared lines
      const newGrid = [];
      const newFadeGrid = [];
      const clearedSet = new Set(this.clearedLines);

      // Add all non-cleared rows to new grid
      for (let r = 0; r < this.board.rows; r++) {
        if (!clearedSet.has(r)) {
          newGrid.push(this.board.grid[r]);
          newFadeGrid.push(this.board.fadeGrid[r]);
        }
      }

      // Add empty rows at the top to maintain grid size
      const emptyRowsNeeded = this.clearedLines.length;
      for (let i = 0; i < emptyRowsNeeded; i++) {
        newGrid.unshift(Array(this.board.cols).fill(0));
        newFadeGrid.unshift(Array(this.board.cols).fill(0));
      }

      // Replace the entire grid
      this.board.grid = newGrid;
      this.board.fadeGrid = newFadeGrid;
    }

    // Powerup effects (run after normal clears, before extra-line pass)
    if (this.pendingPowerup && this.powerupEffectHandler) {
      this.powerupEffectHandler.executePowerupByType(this.pendingPowerup.type);
      // Restore remaining cells of the powerup piece to original mino color/texture
      const cells = this.powerupCells.get(this.pendingPowerup.type) || [];
      for (const cell of cells) {
        const { boardX, boardY, originalColor } = cell;
        if (
          boardY >= 0 &&
          boardY < this.board.rows &&
          boardX >= 0 &&
          boardX < this.board.cols &&
          this.board.grid[boardY][boardX] !== 0
        ) {
          const restoreColor =
            typeof originalColor === "number"
              ? originalColor
              : this.board.grid[boardY][boardX].color || this.board.grid[boardY][boardX];
          this.board.grid[boardY][boardX] = restoreColor;
        }
      }
      // Normalize any remaining powerup objects on the board to plain colors
      for (let r = 0; r < this.board.rows; r++) {
        for (let c = 0; c < this.board.cols; c++) {
          const cell = this.board.grid[r][c];
          if (cell && typeof cell === "object" && cell.color) {
            const fallbackColor =
              typeof cell.originalColor === "number"
                ? cell.originalColor
                : typeof cell.color === "number"
                  ? cell.color
                  : 0;
            this.board.grid[r][c] = fallbackColor;
          }
        }
      }
      this.powerupCells.delete(this.pendingPowerup.type);
      if (this.powerupStatusText) this.powerupStatusText.setText("");
      this.pendingPowerup = null;
    }

    // Extra-line pass for certain modes (e.g., 2P garbage handling) - kept for compatibility
    if (typeof this.performExtraLinePass === "function") {
      this.performExtraLinePass();
    }

    // After grid mutations, re-apply fixed_rows baseline if configured AND garbage was cleared
    if (
      this.zenSandboxConfig &&
      this.zenSandboxConfig.cheeseMode === "fixed_rows" &&
      this.lastClearedHadGarbage
    ) {
      const rowsTarget = Math.max(1, Math.floor(Number(this.zenSandboxConfig.cheeseRows) || 1));
      const percent = Math.max(0, Math.min(100, Number(this.zenSandboxConfig.cheesePercent) || 0));
      const bottom = this.countBottomCheeseRows?.() || 0;
      const missing = Math.max(0, rowsTarget - bottom);
      const refill = Math.min(missing, this.garbageLinesClearedLast || 0);
      if (refill > 0) {
        // Add only the amount of garbage actually cleared (capped by missing)
        if (typeof this.ensureZenCheeseBaseline === "function") {
          this.ensureZenCheeseBaseline(clearedCount);
        } else if (this.board && typeof this.board.addCheeseRows === "function") {
          this.board.addCheeseRows(refill, percent);
        }
      }
    }

    // Reset cleared lines after processing
    this.clearedLines = [];

    // Phase 2: CRITICAL FIX - Re-check for any newly completed lines
    const additionalLines = [];
    for (let r = 0; r < this.board.rows; r++) {
      if (this.board.grid[r].every((cell) => cell !== 0)) {
        additionalLines.push(r);
      }
    }

    // Clear any additional lines that became complete
    if (additionalLines.length > 0) {
      const newGrid = [];
      const newFadeGrid = [];
      const clearedSet = new Set(additionalLines);

      for (let r = 0; r < this.board.rows; r++) {
        if (!clearedSet.has(r)) {
          newGrid.push(this.board.grid[r]);
          newFadeGrid.push(this.board.fadeGrid[r]);
        }
      }

      const emptyRowsNeeded = additionalLines.length;
      for (let i = 0; i < emptyRowsNeeded; i++) {
        newGrid.unshift(Array(this.board.cols).fill(0));
        newFadeGrid.unshift(Array(this.board.cols).fill(0));
      }

      this.board.grid = newGrid;
      this.board.fadeGrid = newFadeGrid;
    }

    // Final hard inject after all cleanup to ensure target garbage rows exist
    if (
      this.zenSandboxConfig &&
      this.zenSandboxConfig.cheeseMode === "fixed_rows" &&
      this.lastClearedHadGarbage
    ) {
      const rowsTarget = Math.max(1, Math.floor(Number(this.zenSandboxConfig.cheeseRows) || 1));
      const percent = Math.max(0, Math.min(100, Number(this.zenSandboxConfig.cheesePercent) || 0));
      const bottom = this.countBottomCheeseRows?.() || 0;
      const missing = Math.max(0, rowsTarget - bottom);
      if (missing > 0) {
        if (this.board && typeof this.board.addCheeseRows === "function") {
          this.board.addCheeseRows(missing, percent);
        } else if (typeof this.ensureZenCheeseBaseline === "function") {
          this.ensureZenCheeseBaseline(0);
        }
      }
    }
  }

  resetLockDelay() {
    const isActuallyGrounded =
      this.currentPiece && this.board
        ? !this.currentPiece.canMoveDown(this.board)
        : this.isGrounded;

    if (this.isGrounded && !isActuallyGrounded) {
      this.isGrounded = false;
      this.lockDelay = 0;
      this.lastGroundedY = null;
      this.wasGroundedDuringSoftDrop = false;
      return;
    }

    // SRS: limit lock delay resets to prevent infinite stalling (unless Zen infinite resets)
    if (this.rotationSystem === "SRS" && isActuallyGrounded && !this.isZenInfiniteResets()) {
      if (this.lockResetCount >= 15) {
        return;
      }
      this.lockResetCount++;
    }

    // ARS: lock reset rules
    if (this.rotationSystem === "ARS" && isActuallyGrounded) {
      // If move-reset is enabled, behave like SRS (limited by 15 total resets unless Zen infinite)
      if (this.arsMoveResetEnabled) {
        if (!this.isZenInfiniteResets() && this.lockResetCount >= 15) {
          return;
        }
        this.lockResetCount++;
        this.lockDelay = 0;
        this.isGrounded = true; // stay grounded
        this.wasGroundedDuringSoftDrop = false;
        return;
      }

      // Default ARS step-reset: only allow reset after dropping at least one row while grounded
      const currentY = this.currentPiece ? this.currentPiece.y : null;
      if (currentY === null) return;
      if (this.lastGroundedY === null) {
        this.lastGroundedY = currentY;
        // First grounded frame after touch: start counting lock delay
        this.lockDelay = 0;
        this.wasGroundedDuringSoftDrop = false;
        return;
      }
      // Require downward progress of at least one row while staying grounded
      if (!this.isZenInfiniteResets() && currentY <= this.lastGroundedY) {
        // No progress: do not reset timer (unless infinite resets enabled)
        return;
      }
      this.lastGroundedY = currentY;
      // Keep grounded state but reset the timer
      this.lockDelay = 0;
      this.wasGroundedDuringSoftDrop = false;
      return;
    }

    // Default reset behavior
    this.lockDelay = 0;
    this.maxPpsRecorded = Math.max(this.maxPpsRecorded, this.conventionalPPS);

    // Track PPS history per placed piece for sprint graph
    if (this.totalPiecesPlaced > this.lastPpsRecordedPieceCount) {
      this.ppsHistory.push(this.conventionalPPS);
      this.lastPpsRecordedPieceCount = this.totalPiecesPlaced;
      if (Array.isArray(this.ppsLockSampleIndices)) {
        this.ppsLockSampleIndices.push(this.ppsHistory.length - 1);
      }
      // Keep history reasonable
      if (this.ppsHistory.length > 200) {
        this.ppsHistory.shift();
        if (Array.isArray(this.ppsLockSampleIndices)) {
          this.ppsLockSampleIndices = this.ppsLockSampleIndices
            .map((idx) => idx - 1)
            .filter((idx) => idx >= 0);
        }
      }
    }
  }

  drawSprintPpsGraph() {
    if (!this.ppsGraphGraphics || !this.ppsGraphArea) {
      return;
    }
    const history = this.ppsHistory || [];
    const { x, y, width, height } = this.ppsGraphArea;
    const g = this.ppsGraphGraphics;

    g.clear();
    g.fillStyle(0x0a0a0a, 0.6);
    g.fillRect(x, y, width, height);
    g.lineStyle(1, 0xffffff, 0.5);
    g.strokeRect(x - 1, y - 1, width + 2, height + 2);

    if (!history.length) {
      if (this.ppsSummaryText) {
        const chokeSec = (this.worstChoke || 0) / 60;
        this.ppsSummaryText.setText(
          `Max PPS: ${this.maxPpsRecorded.toFixed(2)} | Worst choke: ${chokeSec.toFixed(2)}s`,
        );
      }
      return;
    }

    const maxPoints = Math.max(2, Math.min(history.length, 120));
    const visibleHistory = history.slice(-maxPoints);
    const maxPps = Math.max(1.5, ...visibleHistory);

    // Draw line graph: newest at top (vertical axis is reversed)
    const stepY = height / (visibleHistory.length - 1 || 1);
    const pts = visibleHistory.map((pps, idx) => {
      const px = x + Math.min(width, Math.max(1, (pps / maxPps) * width));
      const py = y + height - idx * stepY;
      return { px, py };
    });

    g.lineStyle(2, 0x00ffd0, 1);
    g.beginPath();
    pts.forEach((p, i) => {
      if (i === 0) g.moveTo(p.px, p.py);
      else g.lineTo(p.px, p.py);
    });
    g.strokePath();

    // Draw dots at piece lock samples
    if (Array.isArray(this.ppsLockSampleIndices) && this.ppsLockSampleIndices.length) {
      const startIndex = history.length - visibleHistory.length;
      g.fillStyle(0xffffff, 1);
      this.ppsLockSampleIndices.forEach((lockIdx) => {
        if (lockIdx < startIndex || lockIdx >= history.length) return;
        const pt = pts[lockIdx - startIndex];
        if (pt) g.fillCircle(pt.px, pt.py, 3);
      });
    }

    if (this.ppsSummaryText) {
      const chokeSec = (this.worstChoke || 0) / 60;
      this.ppsSummaryText.setText(
        `Max PPS: ${this.maxPpsRecorded.toFixed(2)} | Worst choke: ${chokeSec.toFixed(2)}s`,
      );
    }
  }

  updateScore(
    lines,
    pieceType = null,
    spinInfo = { isSpin: false, isTSpin: false },
    options = {},
  ) {
    // Don't update score during credits roll
    if (this.creditsActive) {
      if (this.rollType) {
        this.rollLinesCleared += lines;
        if (lines > 0) {
          this.lastClearDuringRoll = { lines, time: this.currentTime };
        }
      }
      return;
    }

    // Skip default scoring for modes with custom scoring (e.g., TGM2 Normal x6 multiplier)
    const modeConfig = this.gameMode && typeof this.gameMode.getConfig === "function"
      ? this.gameMode.getConfig()
      : {};
    if (modeConfig.customScoring) {
      this.totalLines += lines;
      this.softDropRows = 0;
      this.hardDropRows = 0;
      this.lastPieceType = pieceType;
      return;
    }

    // Determine scoring system based on mode
    const guidelineModes = new Set([
      "marathon",
      "sprint_40",
      "sprint_100",
      "ultra",
      "zen",
    ]);

    const selectedModeKey =
      typeof this.selectedMode === "string"
        ? this.selectedMode
        : this.selectedModeId || "";

    const isTwentyGMode =
      (this.gameMode && typeof this.gameMode.isTwentyGMode === "function"
        ? this.gameMode.isTwentyGMode()
        : false) || selectedModeKey === "master_20g";

    const isStandardMode = !isTwentyGMode && guidelineModes.has(selectedModeKey);

    if (isStandardMode) {
      this.updateGuidelineScore(lines, pieceType, spinInfo, options);
    } else {
      this.updateTGM1Score(lines, pieceType, spinInfo);
    }
  }

  updateGuidelineScore(
    lines,
    pieceType = null,
    spinInfo = { isSpin: false, isTSpin: false },
    options = {},
  ) {
    let points = 0;
    let clearType = null;
    const { isSpin, isTSpin } = spinInfo || {};

    // Base scoring per standardscoring.md (no level multiplier)
    const lineBase = [0, 100, 300, 500, 800];
    const spinBase = [400, 800, 1200, 1600, 2600]; // any spin with lines (T or otherwise)

    const isAllClear = !!options.isAllClear;

    // Compute base points for the clear
    if (lines > 0 || isSpin) {
      const idx = Math.min(lines, 4);
      if (isSpin) {
        points += spinBase[idx] || 0;
        if (lines === 0) clearType = "spin zero";
        else clearType = `spin ${["zero", "single", "double", "triple", "quad"][idx]}`;
      } else {
        points += lineBase[lines] || 0;
        clearType = ["", "single", "double", "triple", "quad"][lines] || null;
      }

      // Back-to-back 1.5x for difficult clears (quad or any spin with lines)
      const isDifficult = lines >= 4 || (isSpin && lines > 0);
      if (this.backToBack && isDifficult) {
        points = Math.floor(points * 1.5);
        clearType = clearType ? `${clearType} b2b` : "b2b";
      }
      this.backToBack = isDifficult;

      // All clear bonus
      if (isAllClear) {
        points += 3500;
        clearType = clearType ? `${clearType} all clear` : "all clear";
      }
    } else {
      this.comboCount = -1;
    }

    // Combos: start at -1; first clear sets to 0, second consecutive clear reaches 1
    if (lines > 0) {
      if (this.comboCount < 0) {
        this.comboCount = 0;
      } else {
        this.comboCount += 1;
      }
      points += this.comboCount * 50;
    } else {
      this.comboCount = -1;
    }

    // Drop bonuses (flat, not level-scaled)
    points += this.softDropRows; // 1 per soft drop cell
    points += this.hardDropRows * 2; // 2 per hard drop cell

    // Reset drop counters for next piece
    this.softDropRows = 0;
    this.hardDropRows = 0;

    this.score += points;
    this.totalLines += lines;
    const isSprintMode =
      this.selectedMode === "sprint_40" || this.selectedMode === "sprint_100";
    if (isSprintMode) {
      const sprintTarget = this.selectedMode === "sprint_100" ? 100 : 40;
      this.totalLines = Math.min(this.totalLines, sprintTarget);
    }
    this.lastClearType = clearType;
    this.showClearBanner(clearType, spinInfo, lines, pieceType);

    // Track piece for potential T-spin detection next time
    this.lastPieceType = pieceType;
  }

  updateTGM1Score(lines, pieceType = null, spinInfo = { isSpin: false, isTSpin: false }) {
    // Official TGM1 scoring formula:
    // Score = ceil([level + cleared lines]/4 + soft dropped rows + (2 * hard dropped rows))
    //        * cleared lines * combo * bravo

    let points = 0;
    let clearType = null;

    // Calculate combo value
    // Combo = Previous combo value + (2 * Cleared lines) - 2, or 1 if no lines cleared
    let combo = 1; // Default for no lines cleared
    if (lines > 0) {
      this.comboCount = this.comboCount === -1 ? 0 : this.comboCount;
      this.comboCount += 2 * lines - 2;
      combo = Math.max(1, this.comboCount + 1); // +1 because combo starts at 1
    } else {
      this.comboCount = -1;
    }

    // Calculate bravo bonus (perfect clear)
    let bravo = 1;
    if (lines > 0) {
      if (this.isBoardCompletelyEmpty()) {
        bravo = 4;
        clearType = "bravo";
      }
    }

    // Main scoring formula
    if (lines > 0) {
      const baseScore = Math.ceil(
        (this.level + lines) / 4 + this.softDropRows + 2 * this.hardDropRows,
      );
      points = baseScore * lines * combo * bravo;
    }

    // Reset drop counters for next piece
    this.softDropRows = 0;
    this.hardDropRows = 0;

    this.score += points;
    this.totalLines += lines;
    if (this.selectedMode === "sprint_40") {
      this.totalLines = Math.min(this.totalLines, 40);
    }
    this.lastClearType = clearType;

    // Track piece for potential T-spin detection next time
    this.lastPieceType = pieceType;
  }

  updateLevel(type, amount = 1) {
    if (this.creditsActive) {
      return;
    }
    const oldLevel = this.level;

    const modeId =
      (this.gameMode && typeof this.gameMode.getModeId === "function"
        ? this.gameMode.getModeId()
        : this.selectedMode) || "";
    const modeIdLower = typeof modeId === "string" ? modeId.toLowerCase() : "";
    const isExemptStopMode =
      modeIdLower === "zen" ||
      modeIdLower === "marathon" ||
      modeIdLower.startsWith("sprint") ||
      modeIdLower === "ultra" ||
      modeIdLower === "tgm2_normal";

    if (type === "piece") {
      this.piecesPlaced++;
    }

    // Use mode-specific level update logic
    let newLevel = this.level;
    if (this.gameMode && this.gameMode.onLevelUpdate) {
      newLevel = this.gameMode.onLevelUpdate(
        this.level,
        oldLevel,
        type,
        amount,
      );
    } else {
      // Default logic with TGM3 line bonuses (triple +1, tetris +2)
      if (type === "piece") {
        newLevel += 1;
      } else if (type === "lines") {
        const bonus = amount === 3 ? 1 : amount === 4 ? 2 : 0;
        newLevel += amount + bonus;
      }
    }

    // Apply level stop: at x99 only line clears may advance (non-exempt modes)
    const atStopLevel = oldLevel % 100 === 99;
    if (!isExemptStopMode && type === "piece" && atStopLevel) {
      newLevel = oldLevel;
    }

    this.level = newLevel;

    // Ensure level never exceeds mode's gravity level cap
    const maxLevel =
      this.gameMode && typeof this.gameMode.getDisplayLevelCap === "function"
        ? this.gameMode.getDisplayLevelCap()
        : this.gameMode
          ? this.gameMode.getGravityLevelCap()
          : 999;
    if (this.level > maxLevel) {
      this.level = maxLevel;
    }

    // Torikan checks
    const isShiraseMode =
      this.selectedMode === "tgm3_shirase" || this.selectedMode === "shirase";
    const isTGM3Master =
      this.selectedMode === "tgm3" || this.selectedMode === "tgm3_master";
    if ((isShiraseMode || isTGM3Master) && !this.torikanFailed) {
      const specMech =
        (this.gameMode &&
          typeof this.gameMode.getConfig === "function" &&
          this.gameMode.getConfig()?.specialMechanics) ||
        {};
      const times =
        specMech.torikanTimes &&
        (this.rotationSystem === "ARS" || this.rotationSystem === "classic"
          ? specMech.torikanTimes.classic
          : specMech.torikanTimes.world);
      if (times) {
        if (this.level >= 500 && !this.torikanChecked[500]) {
          this.torikanChecked[500] = true;
          if (this.currentTime > (times.level500 || Infinity)) {
            this.torikanFailed = true;
            if (isShiraseMode) this.grade = "S5";
            // TGM3 Master/Shirase torikan fail: trigger staged fail sequence instead of immediate game over
            if (isTGM3Master || isShiraseMode) {
              this.torikanFailActive = true;
              this.torikanFailTimer = 0;
              this.torikanFailMessageShown = false;
              this.torikanFailGameOverShown = false;
              this.startMinoFading();
              // Stop BGM immediately
              if (this.currentBGM) {
                this.currentBGM.stop();
                this.currentBGM = null;
              }
              if (this.creditsBGM) {
                this.creditsBGM.stop();
                this.creditsBGM = null;
              }
              // Clear held inputs
              this.leftKeyPressed = false;
              this.rightKeyPressed = false;
              this.leftInRepeat = false;
              this.rightInRepeat = false;
              this.leftTimer = 0;
              this.rightTimer = 0;
              this.kKeyPressed = false;
              this.spaceKeyPressed = false;
              this.lKeyPressed = false;
              this.xKeyPressed = false;
              return;
            }
            this.showGameOverScreen();
            return;
          }
        }
        if (isShiraseMode && this.level >= 1000 && !this.torikanChecked[1000]) {
          this.torikanChecked[1000] = true;
          if (this.currentTime > (times.level1000 || Infinity)) {
            this.torikanFailed = true;
            this.grade = "S10";
            this.torikanFailActive = true;
            this.torikanFailTimer = 0;
            this.torikanFailMessageShown = false;
            this.torikanFailGameOverShown = false;
            this.startMinoFading();
            if (this.currentBGM) {
              this.currentBGM.stop();
              this.currentBGM = null;
            }
            if (this.creditsBGM) {
              this.creditsBGM.stop();
              this.creditsBGM = null;
            }
            this.leftKeyPressed = false;
            this.rightKeyPressed = false;
            this.leftInRepeat = false;
            this.rightInRepeat = false;
            this.leftTimer = 0;
            this.rightTimer = 0;
            this.kKeyPressed = false;
            this.spaceKeyPressed = false;
            this.lKeyPressed = false;
            this.xKeyPressed = false;
            return;
          }
        }
      }
    }

    const specialMechanics =
      (this.gameMode &&
        typeof this.gameMode.getConfig === "function" &&
        this.gameMode.getConfig()?.specialMechanics) ||
      {};
    const sectionStops = Array.isArray(specialMechanics.sectionStops)
      ? specialMechanics.sectionStops
      : [];
    const isNormalMode = this.isNormalOrEasyMode() && !sectionStops.length;
    const stopLevelHit =
      !isNormalMode && sectionStops.includes(this.level) && this.level !== this.lastBellLevel;

    // Play bell at x99 level stops (once per stop) except Normal mode bypass
    if (this.level % 100 === 99 && this.level !== this.lastBellLevel && !isNormalMode) {
      this.lastBellLevel = this.level;
      try {
        const bell = this.sound?.add("bell", { volume: 0.6 });
        bell?.play();
      } catch {}
    }

    // Enforce section stop by freezing level until a line clear occurs (handled via stop flag)
    if (stopLevelHit) {
      this.lastBellLevel = this.level;
      this.levelStopActive = true;
    } else if (!stopLevelHit) {
      // Clear stop when advancing via line clear at stop levels
      this.levelStopActive = false;
    }

    // Easy mode completion handling (TGM2-style finish -> credits)
    const easyCompletionLevel =
      specialMechanics && typeof specialMechanics.easyCompletionLevel === "number"
        ? specialMechanics.easyCompletionLevel
        : null;
    if (
      easyCompletionLevel !== null &&
      !this.creditsActive &&
      this.level >= easyCompletionLevel
    ) {
      this.level = easyCompletionLevel;
      // Clear stack with fading animation, then start credits roll
      this.startMinoFading();
      const creditsDuration =
        typeof specialMechanics.creditsDuration === "number"
          ? specialMechanics.creditsDuration
          : 55;
      if (this.gameMode && typeof this.gameMode.onCreditsStart === "function") {
        this.gameMode.onCreditsStart(this);
      }
      this.startCredits(creditsDuration);
    }

    // Play complete when reaching max level once (non-easy completion)
    if (this.level >= maxLevel && !this.levelMaxSoundPlayed && easyCompletionLevel === null) {
      this.levelMaxSoundPlayed = true;
      try {
        const complete = this.sound?.add("complete", { volume: 0.8 });
        complete?.play();
      } catch {}
    }

    // Shirase monochrome activation 1000-1299
    if (isShiraseMode) {
      if (this.level >= 1000) {
        if (!this.monochromeActive) {
          this.monochromeActive = true;
        }
        this.board?.applyMonochromeTextures(this);
        this.shiraseGarbageCounter = 0; // Disable garbage after 1000
        // Big roll: pieces become double-size cells (2x2 per mino) for 1300 roll
        if (this.level >= 1300) {
          this.bigBlocksActive = true;
        } else {
          this.bigBlocksActive = false;
        }
      } else {
        if (this.monochromeActive) {
          this.monochromeActive = false;
          this.board?.clearMonochromeTextures();
        }
        this.bigBlocksActive = false;
      }
    }

    // Update mode-specific timings in case they change with level (but don't overwrite user overrides)
    if (this.gameMode && !this.isEligibleTimingOverride) {
      this.dasDelay =
        this.gameMode.getDAS && typeof this.gameMode.getDAS === "function"
          ? this.gameMode.getDAS()
          : 16 / 60;
      this.arrDelay =
        this.gameMode.getARR && typeof this.gameMode.getARR === "function"
          ? this.gameMode.getARR()
          : 1 / 60;
      this.areDelay =
        this.gameMode.getARE && typeof this.gameMode.getARE === "function"
          ? this.gameMode.getARE()
          : 30 / 60;
      this.lockDelay =
        this.gameMode.getLockDelay && typeof this.gameMode.getLockDelay === "function"
          ? this.gameMode.getLockDelay()
          : 0.5;
    }

    // Check for section transitions
    const sectionLength = this.getSectionLength();
    const newBasis = this.getSectionBasisValue();
    const oldBasis =
      this.selectedMode === "marathon"
        ? type === "lines"
          ? Math.max(0, newBasis - amount)
          : newBasis
        : oldLevel;
    const oldSection = Math.floor(oldBasis / sectionLength);
    const newSection = Math.floor(newBasis / sectionLength);

    // Capture *70 time for COOL if reached in current section
    const sectionStart = newSection * sectionLength;
    const coolThresholdLevel = sectionStart + 70;
    if (
      this.level >= coolThresholdLevel &&
      !this.section70Captured.has(newSection)
    ) {
      const coolTime = this.currentTime - this.sectionStartTime;
      this.sectionCoolTimes[newSection] = coolTime;
      this.section70Captured.add(newSection);
      if (this.gameMode) {
        this.gameMode.sectionCoolTimes = this.gameMode.sectionCoolTimes || [];
        this.gameMode.sectionCoolTimes[newSection] = coolTime;
      }
      // Buffer internal level for BGM (includes COOL bonus) at *70
      const internalLevelForBgmStop =
        this.gameMode && typeof this.gameMode.bgmStopLevel === "number"
          ? this.gameMode.bgmStopLevel
          : this.gameMode && typeof this.gameMode.internalLevel === "number"
            ? this.gameMode.internalLevel
            : this.level;
      this.bgmInternalLevelBuffer = Math.max(this.bgmInternalLevelBuffer || 0, internalLevelForBgmStop);
      // Early COOL banner scheduling for current section (esp. 000-099)
      if (
        this.gameMode &&
        typeof this.gameMode.evaluateSectionPerformance === "function"
      ) {
        const sectionIndexForEval = newSection + 1; // 1-based for evaluator
        const earlyResult = this.gameMode.evaluateSectionPerformance(
          sectionIndexForEval,
          coolTime,
          coolTime,
        );
        if (earlyResult === "cool") {
          const sectionLength = this.getSectionLength();
          const baseLevel = newSection * sectionLength;
          const targetLevel = baseLevel + 80 + Math.floor(Math.random() * 11); // 80-90 inclusive
          this.coolAnnouncementsTargets[newSection] = targetLevel;
          this.coolAnnouncementsShown.delete(newSection);
          // Early scheduling done; banner will fire in checkCoolRegretAnnouncements.
        }
      }
    }

    if (newSection > oldSection && this.level < maxLevel) {
      this.handleSectionTransition(newSection);
    }

    // Check for important level milestones
    const milestones = [100, 200, 300, 500, maxLevel];
    if (milestones.includes(this.level) && this.level !== oldLevel) {
      if (this.level === maxLevel) {
        const sectionLength = this.getSectionLength();
        const basisAtMax = this.getSectionBasisValue();
        const oldBasisForMax =
          this.selectedMode === "marathon" && type === "lines"
            ? Math.max(0, basisAtMax - amount)
            : oldLevel;
        const lastSectionIndex = Math.floor(oldBasisForMax / sectionLength);
        if (
          typeof this.sectionTimes[lastSectionIndex] !== "number" &&
          lastSectionIndex === this.currentSection
        ) {
          this.sectionTimes[lastSectionIndex] = this.currentTime - this.sectionStartTime;
          this.sectionTetrises[lastSectionIndex] = this.currentSectionTetrisCount;
          if (
            typeof this.sectionCoolTimes[lastSectionIndex] !== "number" &&
            this.section70Captured.has(lastSectionIndex)
          ) {
            this.sectionCoolTimes[lastSectionIndex] = this.currentTime - this.sectionStartTime;
          }
        }

        // Ensure the last section completion hook runs (no transition after max level)
        if (
          this.gameMode &&
          typeof this.gameMode.onSectionComplete === "function" &&
          typeof this.sectionTimes[lastSectionIndex] === "number"
        ) {
          try {
            this.gameMode.onSectionComplete(
              this,
              lastSectionIndex,
              this.sectionTimes[lastSectionIndex],
            );
          } catch (e) {
            console.warn("[maxLevel] onSectionComplete failed", e);
          }
        }

        // Start credits when reaching max level
        this.level999Reached = true;

        const isTGM2Mode =
          this.selectedMode && this.selectedMode.startsWith("tgm2") && maxLevel === 999;
        const isTGM3MasterMode =
          (this.selectedMode === "tgm3" || this.selectedMode === "tgm3_master") &&
          maxLevel === 999;
        const isShiraseMode =
          this.selectedMode === "tgm3_shirase" || this.selectedMode === "shirase";

        // TGM2/TGM3 Master: run stack fade before credits; credits start once fade completes.
        if (isTGM2Mode || isTGM3MasterMode) {
          this.creditsPending = true;
          this.creditsTransitionStartTime = this.time?.now ?? Date.now();
          this.invisibleStackActive = false;
          this.fadingRollActive = false;
          this.startMinoFading();
        } else {
          if (this.gameMode && typeof this.gameMode.onCreditsStart === "function") {
            this.gameMode.onCreditsStart(this);
          }
          this.startCredits();
        }
      }
    }

    // Update BGM based on level
    this.updateBGM();
  }

  handleSectionTransition(section) {
    if (typeof section !== "number" || section <= this.currentSection) return;
    this.sectionTransition = true;
    const sectionLength = this.getSectionLength();

    const completedSection = section - 1;
    if (completedSection >= 0) {
      this.sectionTimes[completedSection] = this.currentTime - this.sectionStartTime;
      this.sectionTetrises[completedSection] = this.currentSectionTetrisCount;
      // Persist section times into mode for COOL/REGRET checks that need previous section timing
      if (this.gameMode && Array.isArray(this.sectionTimes)) {
        this.gameMode.sectionTimes = this.gameMode.sectionTimes || [];
        this.gameMode.sectionTimes[completedSection] = this.sectionTimes[completedSection];
      }

      // Mode hook for section completion (used by multiple TGM variants)
      if (this.gameMode && typeof this.gameMode.onSectionComplete === "function") {
        try {
          this.gameMode.onSectionComplete(
            this,
            completedSection,
            this.sectionTimes[completedSection],
          );
        } catch (e) {
          console.warn("[handleSectionTransition] onSectionComplete failed", e);
        }
      }

      // COOL/REGRET evaluation for TGM3 Master
      if (
        this.gameMode &&
        typeof this.gameMode.evaluateSectionPerformance === "function" &&
        typeof this.gameMode.onSectionCool === "function" &&
        typeof this.gameMode.onSectionRegret === "function"
      ) {
        const sectionTime = this.sectionTimes[completedSection];
        const coolTime =
          this.sectionCoolTimes && typeof this.sectionCoolTimes[completedSection] === "number"
            ? this.sectionCoolTimes[completedSection]
            : null;
        const evalSectionIndex = completedSection + 1; // shift to 1-based for COOL/REGRET
        const result = this.gameMode.evaluateSectionPerformance(
          evalSectionIndex,
          sectionTime,
          coolTime,
        );
        const modeId =
          this.gameMode && typeof this.gameMode.getModeId === "function"
            ? this.gameMode.getModeId()
            : this.selectedMode;
        if (result === "cool") {
          this.gameMode.onSectionCool();
          // Only add generic rollBonus for non-TGM3 Master modes
          if (
            typeof this.rollBonus === "number" &&
            modeId !== "tgm3_master" &&
            modeId !== "tgm3"
          ) {
            this.rollBonus += 1;
          }
          this.sectionPerformance[completedSection] = "COOL";
          // Schedule COOL announcement in the current section between *80-*90
          // COOL should announce in the section where it was earned.
          const currentSectionIndex = completedSection;
          const baseLevel = currentSectionIndex * sectionLength;
          const targetLevel = baseLevel + 80 + Math.floor(Math.random() * 11); // 80-90 inclusive
          this.coolAnnouncementsTargets[currentSectionIndex] = targetLevel;
          this.coolAnnouncementsShown.delete(currentSectionIndex);
        } else if (result === "regret") {
          this.gameMode.onSectionRegret();
          this.sectionPerformance[completedSection] = "REGRET";
          // Show REGRET once at start of next section
          const nextSection = section;
          this.regretAnnouncementsPending[nextSection] = true;
        } else {
          this.sectionPerformance[completedSection] = null;
        }
      }

      this.sectionStartTime = this.currentTime;
      this.currentSection = section;
      this.currentSectionTetrisCount = 0;
      // Reset *70 capture for the new section
      if (Array.isArray(this.sectionCoolTimes)) {
        this.sectionCoolTimes[section] = undefined;
      }
      if (this.section70Captured instanceof Set) {
        this.section70Captured.delete(section);
      }
      // Show REGRET immediately at section start if pending
      if (this.regretAnnouncementsPending[section] && !this.regretAnnouncementsShown.has(section)) {
        this.showCoolRegretBanner("REGRET");
        this.regretAnnouncementsShown.add(section);
        delete this.regretAnnouncementsPending[section];
      }
      // Apply TGM3 internal timing/gravity phase on section entry using internal level with COOL bonus
      if (
        this.gameMode &&
        typeof this.gameMode.getModeId === "function" &&
        this.gameMode.getModeId() === "tgm3_master" &&
        typeof this.gameMode.updateTimingPhase === "function"
      ) {
        const sectionLength = this.getSectionLength();
        const internalLevel =
          section * sectionLength + (typeof this.gameMode.coolBonus === "number" ? this.gameMode.coolBonus : 0);
        this.gameMode.internalLevel = internalLevel;
        this.gameMode.bgmStopLevel = internalLevel;
        this.gameMode.updateTimingPhase(internalLevel);
      }
    }

    // Play section change sound
    this.playSfx("sectionchange", 0.6);

    // Section completion messages removed - uncomment if needed for other modes
    /*
        // Show section completion message
        const sectionStart = (section - 1) * 100;
        let sectionEnd = section * 100 - 1;
        if (section >= 5) {
            sectionEnd = 999;
        }
        this.showSectionMessage(`Section ${sectionStart}-${sectionEnd} Complete!`);
        */

    // Adjust section cap based on mode (default to Normal mode)
    if (this.selectedMode === "marathon") {
      this.sectionCap = (section + 1) * 10;
    } else {
      this.sectionCap = (section + 1) * 100;
      if (section >= 9) {
        this.sectionCap = 999;
      }
    }
  }

  getTGMGravitySpeed(level) {
    // Use mode-based gravity calculation if mode is available
    if (this.gameMode) {
      const effLevel =
        typeof this.gameMode.internalLevel === "number"
          ? this.gameMode.internalLevel
          : level;
      return this.gameMode.getGravitySpeed(effLevel);
    }

    // Fallback to TGM1 curve if no mode
    return this.getTGM1GravitySpeed(level);
  }

  // Official TGM1 Internal Gravity system (fallback method)
  getTGM1GravitySpeed(level) {
    // Official TGM1 Internal Gravity system
    // Returns Internal Gravity value in 1/256 G units
    // Based on Internal Gravity values in the TGM1 specification

    let internalGravity;

    if (level < 30) internalGravity = 4;
    else if (level < 35) internalGravity = 6;
    else if (level < 40) internalGravity = 8;
    else if (level < 50) internalGravity = 10;
    else if (level < 60) internalGravity = 12;
    else if (level < 70) internalGravity = 16;
    else if (level < 80) internalGravity = 32;
    else if (level < 90) internalGravity = 48;
    else if (level < 100) internalGravity = 64;
    else if (level < 120) internalGravity = 80;
    else if (level < 140) internalGravity = 96;
    else if (level < 160) internalGravity = 112;
    else if (level < 170) internalGravity = 128;
    else if (level < 200) internalGravity = 144;
    else if (level < 220) internalGravity = 4;
    else if (level < 230) internalGravity = 32;
    else if (level < 233) internalGravity = 64;
    else if (level < 236) internalGravity = 96;
    else if (level < 239) internalGravity = 128;
    else if (level < 243) internalGravity = 160;
    else if (level < 247) internalGravity = 192;
    else if (level < 251) internalGravity = 224;
    else if (level < 300)
      internalGravity = 256; // 1G
    else if (level < 330)
      internalGravity = 512; // 2G
    else if (level < 360)
      internalGravity = 768; // 3G
    else if (level < 400)
      internalGravity = 1024; // 4G
    else if (level < 420)
      internalGravity = 1280; // 5G
    else if (level < 450)
      internalGravity = 1024; // 4G
    else if (level < 500)
      internalGravity = 768; // 3G
    else internalGravity = 5120; // 20G

    return internalGravity;
  }

  detectSpin(piece, board) {
    if (!piece || !board) return { isSpin: false, isTSpin: false, spinType: null };
    if (piece.type === "O") return { isSpin: false, isTSpin: false, spinType: null };

    const spinMode = this.getZenSpinMode();
    if (spinMode === "t_only" && piece.type !== "T") {
      return { isSpin: false, isTSpin: false, spinType: null };
    }
    if (spinMode === "all") {
      return { isSpin: true, isTSpin: piece.type === "T", spinType: `${piece.type}-spin` };
    }

    // Build set of current piece cells to ignore self-collision
    const pieceCells = new Set();
    for (let r = 0; r < piece.shape.length; r++) {
      for (let c = 0; c < piece.shape[r].length; c++) {
        if (!piece.shape[r][c]) continue;
        pieceCells.add(`${piece.x + c},${piece.y + r}`);
      }
    }

    const cellBlocked = (x, y) => {
      if (x < 0 || x >= board.cols || y >= board.rows) return true;
      if (y < 0) return false; // above visible area is allowed
      const key = `${x},${y}`;
      if (pieceCells.has(key)) return false; // ignore current piece footprint
      return !!board.grid[y][x];
    };

    const canMove = (dx, dy) => {
      for (const key of pieceCells) {
        const [px, py] = key.split(",").map(Number);
        const nx = px + dx;
        const ny = py + dy;
        if (nx < 0 || nx >= board.cols || ny >= board.rows) return false;
        if (ny < 0) continue; // off-screen above is ok
        if (cellBlocked(nx, ny)) return false;
      }
      return true;
    };

    // T: 3-corner rule with grounding guard and self-aware occupancy
    if (piece.type === "T") {
      // Require grounded
      if (canMove(0, 1)) return { isSpin: false, isTSpin: false, spinType: null };

      // Require last movement to be a rotation while grounded
      if (!this.spinRotatedWhileGrounded) {
        return { isSpin: false, isTSpin: false, spinType: null };
      }

      const corners = [
        [piece.x - 1, piece.y - 1],
        [piece.x + 1, piece.y - 1],
        [piece.x - 1, piece.y + 1],
        [piece.x + 1, piece.y + 1],
      ];
      let filledCorners = 0;
      for (const [cx, cy] of corners) {
        if (cellBlocked(cx, cy)) filledCorners++;
      }
      if (filledCorners >= 3) {
        return { isSpin: true, isTSpin: true, spinType: "t-spin" };
      }
      if (filledCorners === 2) {
        return { isSpin: true, isTSpin: false, spinType: "t-spin mini" };
      }
      return { isSpin: false, isTSpin: false, spinType: null };
    }

    // Non-T: immobile rule as requested:
    // must be grounded (cannot move down) AND cannot move 1 left, 1 right, or 1 up.

    // Grounded check (cannot move down)
    const isGrounded = !canMove(0, 1);
    if (!isGrounded) return { isSpin: false, isTSpin: false, spinType: null };

    const blockedLeft = !canMove(-1, 0);
    const blockedRight = !canMove(1, 0);
    const blockedUp = !canMove(0, -1);
    const blockedDown = !canMove(0, 1);

    const isImmobile = blockedDown && blockedLeft && blockedRight && blockedUp;
    return {
      isSpin: isImmobile,
      isTSpin: false,
      spinType: isImmobile ? `${piece.type}-spin` : null,
    };
  }

  isStandardComboMode() {
    const m = this.selectedMode;
    return m === "ultra" || m === "zen" || m === "marathon" || m === "sprint_40" || m === "sprint_100";
  }

  getCurrentModeId() {
    if (typeof this.modeId === "string" && this.modeId) return this.modeId;
    if (this.gameMode && typeof this.gameMode.getModeId === "function") {
      return this.gameMode.getModeId();
    }
    return this.selectedMode;
  }

  isTgm4Mode() {
    const modeId = this.getCurrentModeId();
    return typeof modeId === "string" && modeId.startsWith("tgm4");
  }

  usesStandardDropBehavior() {
    return this.isStandardComboMode() || this.isTgm4Mode();
  }

  isLegacySoftDropLockMode() {
    const modeId = this.getCurrentModeId();
    return modeId === "tgm1" || modeId === "master_20g";
  }

  shouldShowB2BChain() {
    return this.isStandardComboMode();
  }

  updateStandardCombo(onLineClear, nowSeconds) {
    if (!this.standardComboText) return;
    if (this.standardComboFadeTween) {
      this.standardComboFadeTween.stop();
      this.standardComboFadeTween = null;
    }
    if (onLineClear) {
      this.standardComboCount = this.standardComboCount < 0 ? 0 : this.standardComboCount + 1;
      this.standardComboLastLineTime = nowSeconds || 0;
      if (this.standardComboCount >= 1) {
        this.standardComboNumberText?.setText(`${this.standardComboCount}`);
        this.standardComboLabelText?.setX((this.standardComboNumberText?.width || 0) + 6);
        this.standardComboText.setAlpha(1);
        this.standardComboText.setVisible(true);
        this.standardComboText.setScale(1);
        this.tweens.add({
          targets: this.standardComboText,
          scale: { from: 1, to: 1.2 },
          duration: 140,
          yoyo: true,
          ease: "Back.easeOut",
        });
      }
    }
  }

  tickStandardCombo(nowSeconds) {
    if (!this.standardComboText) return;
    if (this.standardComboCount < 0) return;
    const idle = nowSeconds - (this.standardComboLastLineTime || 0);
    if (idle > 1.25) {
      if (!this.standardComboFadeTween) {
        this.standardComboFadeTween = this.tweens.add({
          targets: this.standardComboText,
          alpha: { from: this.standardComboText.alpha, to: 0 },
          duration: 320,
          onComplete: () => {
            this.standardComboFadeTween = null;
            this.standardComboText.setVisible(false);
            this.standardComboCount = -1;
          },
        });
      }
    }
  }

  computeAttack(lines, spinInfo, isAllClear, prevBackToBack) {
    // Zen sandbox: optional guideline attack table
    if (
      this.isZenSandboxActive() &&
      this.zenSandboxConfig &&
      this.zenSandboxConfig.attackTableType === "guideline" &&
      typeof this.getGuidelineAttack === "function"
    ) {
      return this.getGuidelineAttack(lines, spinInfo, isAllClear, prevBackToBack);
    }

    const baseTable = [0, 0, 1, 2, 4];
    const isSpin = !!(spinInfo && spinInfo.isSpin);
    const spinType = spinInfo ? spinInfo.spinType : null;
    const isMini = spinType && spinType.includes("mini");
    const isDifficult = (lines >= 4 || (isSpin && lines > 0)) && lines > 0;

    // Base attack
    let base = 0;
    if (isSpin) {
      if (isMini) {
        base = lines === 2 ? 1 : 0;
      } else {
        base = 2 * lines;
      }
    } else {
      base = baseTable[lines] || 0;
    }

    // B2B bonus when chain is maintained
    const b2bMaintained = prevBackToBack && isDifficult;
    if (b2bMaintained) base += 1;

    // All clear bonus
    if (isAllClear) base += 10;

    // Treat the first clear in a chain as combo 0 so Tetrises start at base 4 (not 5)
    const comboVal = Math.max(0, (this.comboCount || 0) - 1);
    let attack = 0;
    if (base > 0) {
      // comboVal is -1 before first clear, 0 on first clear, 1 on second clear, etc.
      attack = Math.floor(base * (1 + 0.25 * Math.max(0, comboVal)));
    } else if (comboVal >= 2) {
      attack = Math.floor(Math.log(1 + 1.25 * comboVal));
    }

    // B2B chain bookkeeping
    const prevChain = this.b2bChainCount ?? -1;
    let newChain = prevChain;
    let b2bBroken = false;
    if (isDifficult) {
      if (prevChain < 0) {
        newChain = 0; // first difficult clear starts chain at 0
      } else {
        newChain = b2bMaintained ? prevChain + 1 : 1;
      }
    } else {
      if (lines > 0) {
        if (prevBackToBack) {
          b2bBroken = true;
        }
        newChain = -1;
      } else {
        // No clear (piece placement) does not break chain
        newChain = prevChain;
      }
    }
    this.b2bChainCount = newChain;

    return {
      attack,
      isDifficult,
      b2bMaintained,
      b2bBroken,
      prevChain,
      newChain,
    };
  }

  updateAttackStats(attack, nowSeconds) {
    if (attack <= 0) return;

    if (this.spikeFadeTween) {
      this.spikeFadeTween.stop();
      this.spikeFadeTween = null;
    }
    if (this.spikeText) {
      this.spikeText.setAlpha(1);
      this.spikeText.setVisible(true);
      this.spikeText.setScale(1);
      this.tweens.add({
        targets: this.spikeText,
        scale: { from: 1, to: 1.18 },
        duration: 120,
        yoyo: true,
        ease: "Cubic.easeOut",
      });
    }

    const elapsedSinceLast = nowSeconds - (this.lastAttackTime || 0);
    if (elapsedSinceLast > 1) {
      this.attackSpike = 0;
    }
    this.lastAttackTime = nowSeconds;
    this.totalAttack = (this.totalAttack || 0) + attack;
    this.attackSpike = (this.attackSpike || 0) + attack;
  }

  tickAttackDecay(nowSeconds) {
    if (!this.lastAttackTime) return;
    const idle = nowSeconds - this.lastAttackTime;
    if (this.attackSpike > 0 && idle > 1) {
      this.attackSpike = 0;
      if (this.spikeFadeTween) {
        this.spikeFadeTween.stop();
        this.spikeFadeTween = null;
      }
      if (this.spikeText) {
        this.spikeText.setAlpha(0);
        this.spikeText.setVisible(false);
      }
      this.updateAttackUI();
    } else if (this.attackSpike > 0 && idle > 0.5) {
      if (!this.spikeFadeTween && this.spikeText) {
        this.spikeFadeTween = this.tweens.add({
          targets: this.spikeText,
          alpha: { from: this.spikeText.alpha, to: 0 },
          duration: 500,
          onComplete: () => {
            this.spikeFadeTween = null;
            if (this.spikeText) {
              this.spikeText.setVisible(false);
            }
          },
        });
      }
    }
  }

  updateAttackUI() {
    if (
      !this.attackTotalText ||
      !this.attackPerMinText ||
      !this.spikeText ||
      !this.attackPerPieceText
    )
      return;

    // Hide spike counter outside Zen or during Ready/Go
    const isZenMode =
      typeof this.isZenSandboxActive === "function" ? this.isZenSandboxActive() : false;
    if (this.readyGoPhase) {
      this.spikeText.setVisible(false);
      return;
    }
    if (!isZenMode) {
      this.spikeText.setVisible(false);
      // Still update totals/ATK per min if UI is shown elsewhere (e.g., Zen only)
      return;
    }
    const elapsed = Math.max(0.0001, this.currentTime || 0); // avoid div/0
    const atkPerMin = (this.totalAttack / elapsed) * 60;
    const piecesPlaced = Math.max(1, this.totalPiecesPlaced || 0);
    const atkPerPiece = this.totalAttack / piecesPlaced;

    this.attackTotalText.setText(`${Math.floor(this.totalAttack) || 0}`);
    this.attackPerMinText.setText(atkPerMin.toFixed(2));
    this.attackPerPieceText.setText(atkPerPiece.toFixed(2));

    if (this.attackSpike >= 8) {
      const spike = Math.floor(this.attackSpike);
      const t = Math.min(spike / 20, 1);
      const lerp = (a, b, k) => Math.round(a + (b - a) * k);
      const r = lerp(255, 255, t);
      const g = lerp(170, 40, t);
      const b = lerp(51, 40, t);
      const hex = (n) => n.toString(16).padStart(2, "0");
      const color = `#${hex(r)}${hex(g)}${hex(b)}`;
      this.spikeText.setColor(color);
      this.spikeText.setText(`SPIKE ${spike}`);
      this.spikeText.setVisible(true);
    } else {
      this.spikeText.setVisible(false);
    }

    // VS score: (attack sent + garbage cleared) / pieces * PPS * 100
    if (this.vsScoreText) {
      const pieces = Math.max(1, this.totalPiecesPlaced || 0);
      const pps = Number.isFinite(this.conventionalPPS) ? this.conventionalPPS : 0;
      const totalVsAttack = Number(this.totalAttack || 0) + Number(this.totalGarbageCleared || 0);
      const vsScore = ((totalVsAttack / pieces) * pps * 100).toFixed(2);
      this.vsScoreText.setText(vsScore);
    }
  }

  showB2BChain(b2bMaintained, b2bBroken, prevChain, newChain) {
    if (!this.b2bChainText) return;
    if (!this.shouldShowB2BChain()) {
      this.b2bChainText.setVisible(false);
      return;
    }
    this.b2bChainText.setText(`B2B x${newChain}`);

    if (b2bMaintained && newChain > prevChain) {
      this.b2bChainText.setColor("#ffff55");
      this.b2bChainText.setScale(1);
      this.tweens.add({
        targets: this.b2bChainText,
        scale: { from: 1, to: 1.2 },
        duration: 140,
        yoyo: true,
        ease: "Cubic.easeOut",
      });
    } else if (b2bBroken) {
      // Only flash if chain was at least 2; otherwise hide quietly
      if (prevChain >= 2) {
        this.b2bChainText.setText("B2B x0");
        this.b2bChainText.setColor("#ff4444");
        this.b2bChainText.setScale(1);
        this.b2bChainText.setVisible(true);
        this.tweens.add({
          targets: this.b2bChainText,
          alpha: { from: 1, to: 0.3 },
          duration: 120,
          yoyo: true,
          repeat: 2, // 3 flashes total
          onComplete: () => {
            this.b2bChainText.setAlpha(1);
            this.b2bChainText.setColor("#ffff55");
            this.b2bChainText.setVisible(false);
          },
        });
      } else {
        this.b2bChainText.setVisible(false);
      }
    } else if (newChain <= 0) {
      this.b2bChainText.setVisible(false);
    } else {
      this.b2bChainText.setVisible(true);
    }
  }

  updateGrade() {
    // Official TGM1 grade progression based on score thresholds with time requirements for GM
    const score = this.score;
    const time = this.currentTime;
    const level = this.level;

    let newGrade = "9"; // Default grade

    // Track GM conditions
    if (level >= 300 && score >= 12000 && time <= 4 * 60 + 15) {
      // 4:15
      this.gmConditions.level300.achieved = true;
      this.gmConditions.level300.time = time;
      this.gmConditions.level300.score = score;
    }
    if (level >= 500 && score >= 40000 && time <= 7 * 60 + 30) {
      // 7:30
      this.gmConditions.level500.achieved = true;
      this.gmConditions.level500.time = time;
      this.gmConditions.level500.score = score;
    }
    if (level >= 999 && score >= 126000 && time <= 13 * 60 + 30) {
      // 13:30
      this.gmConditions.level999.achieved = true;
      this.gmConditions.level999.time = time;
      this.gmConditions.level999.score = score;
    }

    // Grand Master requirements (all three conditions must be achieved)
    if (
      this.gmConditions.level300.achieved &&
      this.gmConditions.level500.achieved &&
      this.gmConditions.level999.achieved
    ) {
      newGrade = "GM";
    }
    // Regular grade progression based on score thresholds (from tetris.wiki)
    else if (score >= 120000) newGrade = "S9";
    else if (score >= 100000) newGrade = "S8";
    else if (score >= 82000) newGrade = "S7";
    else if (score >= 66000) newGrade = "S6";
    else if (score >= 52000) newGrade = "S5";
    else if (score >= 40000) newGrade = "S4";
    else if (score >= 30000) newGrade = "S3";
    else if (score >= 22000) newGrade = "S2";
    else if (score >= 16000) newGrade = "S1";
    else if (score >= 12000) newGrade = "1";
    else if (score >= 8000) newGrade = "2";
    else if (score >= 5500) newGrade = "3";
    else if (score >= 3500) newGrade = "4";
    else if (score >= 2000) newGrade = "5";
    else if (score >= 1400) newGrade = "6";
    else if (score >= 800) newGrade = "7";
    else if (score >= 400) newGrade = "8";
    // Keep grade 9 for scores below 400 points

    const previousGrade = this.grade;
    const previousDisplayedGrade =
      this.gradeText && typeof this.gradeText.text === "string"
        ? this.gradeText.text.trim()
        : previousGrade;
    const previousDisplayedValue = this.getGradeValue(previousDisplayedGrade);
    const newGradeValue = this.getGradeValue(newGrade);
    const previousGradeValue = this.getGradeValue(previousGrade);

    // Update grade if it improved (only upgrade, don't downgrade)
    if (newGradeValue > previousGradeValue) {
      this.grade = newGrade;
      if (newGradeValue > previousDisplayedValue) {
        this.animateGradeUpgrade();
      }
      this.gradeHistory.push({
        grade: newGrade,
        level: this.level,
        time: this.currentTime,
        score: score,
      });
    }
  }

  getGradeValue(grade) {
    const gradeValues = {
      9: 0,
      8: 1,
      7: 2,
      6: 3,
      5: 4,
      4: 5,
      3: 6,
      2: 7,
      1: 8,
      S1: 9,
      S2: 10,
      S3: 11,
      S4: 12,
      S5: 13,
      S6: 14,
      S7: 15,
      S8: 16,
      S9: 17,
      M: 18,
      GM: 19,
    };
    return gradeValues[grade] || 0;
  }

  updateGradeUIVisibility() {
    if (!this.gradeDisplay || !this.gradeText) return;

    const gradeValue =
      typeof this.grade === "string" ? this.grade.trim() : this.grade;
    const hasGrade =
      gradeValue !== undefined &&
      gradeValue !== null &&
      gradeValue !== "" &&
      gradeValue !== 0;

    this.gradeDisplay.setVisible(hasGrade);
    this.gradeText.setVisible(hasGrade);
    if (this.gradePointsText) {
      this.gradePointsText.setVisible(hasGrade && this.shouldShowGradePoints !== false);
    }

    if (this.nextGradeText) {
      this.nextGradeText.setVisible(
        hasGrade && this.shouldShowNextGradeText,
      );
    }
  }

  updateNextGradeText() {
    if (!this.nextGradeText || !this.shouldShowNextGradeText) return; // Skip if grade display not created

    const gradeThresholds = {
      9: 400,
      8: 800,
      7: 1400,
      6: 2000,
      5: 3500,
      4: 5500,
      3: 8000,
      2: 12000,
      1: 16000,
      S1: 22000,
      S2: 30000,
      S3: 40000,
      S4: 52000,
      S5: 66000,
      S6: 82000,
      S7: 100000,
      S8: 120000,
      S9: 126000,
      GM: Infinity,
    };
    const nextThreshold = gradeThresholds[this.grade];
    if (nextThreshold === Infinity) { // Infinity is used for GM grade, so display this at S9
      this.nextGradeText.setText("Next grade at ?????? points");
    } else {
      this.nextGradeText.setText(`Next grade at  ${nextThreshold} points`);
    }
  }

  animateGradeUpgrade() {
    // Play grade up sound
    this.playSfx("gradeup", 0.6);

    // Simple flash animation (only if grade text exists)
    if (this.gradeText) {
      this.gradeText.setTint(0xffff00);
      this.time.delayedCall(200, () => {
        this.gradeText.setTint(0xffffff);
      });
      this.time.delayedCall(400, () => {
        this.gradeText.setTint(0xffff00);
      });
      this.time.delayedCall(600, () => {
        this.gradeText.setTint(0xffffff);
      });
    }
  }

  getHeldKeys() {
    const held = [];
    if (this.leftKeyPressed) held.push("Z");
    if (this.rightKeyPressed) held.push("C");
    if (this.kKeyPressed) held.push("K");
    if (this.spaceKeyPressed) held.push("Space");
    if (this.lKeyPressed) held.push("L");
    if (this.xKeyPressed) held.push("X");
    if (this.keys.s.isDown) held.push("S");
    return held;
  }

  restartGame() {
    // Check if mode uses grading
    const modeConfig = this.gameMode ? this.gameMode.getConfig() : {};
    const hasGrading = modeConfig.hasGrading !== false;

    // Reset all game variables
    this.board = new Board();
    this.board.scene = this;
    this.currentPiece = null;
    this.holdPiece = null;
    this.canHold = true;
    this.nextPieces = [];
    this.gravityTimer = 0.0;
    this.gravityAccum = 0.0;
    this.lockDelay = 0;
    this.isGrounded = false;
    this.level = this.startingLevel || 0; // Use preserved starting level or default to 0
    this.piecesPlaced = 0; // Reset piece counter
    this.score = 0;
    this.grade = null;
    this.internalGrade = null;
    this.gameOver = false;
    this.sectionCap = 99;
    this.sectionTransition = false;
    this.sectionMessage = null;
    this.sectionMessageTimer = 0;
    this.comboCount = -1;
    this.backToBack = false;
    this.totalLines = 0;
    this.lastClearType = null;
    this.gradeHistory = [];
    this.sectionTimes = [];
    this.sectionStartTime = 0;
    this.currentSection = Math.floor(this.getSectionBasisValue() / this.getSectionLength());
    this.sectionTetrises = [];
    this.currentSectionTetrisCount = 0;

    // Reset piece active time tracking
    this.pieceActiveTime = 0;
    this.pieceSpawnTime = 0;

    // Reset drop tracking
    this.softDropRows = 0;
    this.hardDropRows = 0;

    // Reset piece per second tracking
    this.totalPiecesPlaced = 0;
    this.activeTime = 0;
    this.areTime = 0;
    this.conventionalPPS = 0;
    this.rawPPS = 0;
    this.maxPpsRecorded = 0;
    this.worstChoke = 0;
    this.ppsHistory = [];
    this.ppsLockSampleIndices = [];
    this.ppsSampleTimer = 0;
    this.lastPpsRecordedPieceCount = 0;
    this.ppsGraphGraphics = null;
    this.ppsGraphArea = null;
    if (this.ppsSummaryText) {
      this.ppsSummaryText.setText("Max PPS: -- | Worst choke: --");
    }
    if (this.pieceCountText) this.pieceCountText.setText("0");
    this.finesseActiveForPiece = false;

    // Reset leaderboard saved flag so new runs can submit once
    this.leaderboardSaved = false;

    // Reset TGM1 randomizer
    this.pieceHistory = ["Z", "Z", "S", "S"]; // Reset to initial state
    this.pieceHistoryIndex = 0;
    this.firstPiece = true;
    this.isFirstSpawn = true;

    // Reset BGM first play flags
    this.bgmFirstPlay = {
      stage1: true,
      stage2: true,
    };

    // Reset key states
    this.kKeyPressed = false;
    this.spaceKeyPressed = false;
    this.lKeyPressed = false;
    this.rotate180Pressed = false;
    this.xKeyPressed = false;

    // Reset mino fading system
    this.placedMinos = [];
    this.placedMinoRows = [];
    this.minoFadeActive = false;
    this.fadingComplete = false;
    this.showGameOverText = false;

    this.invisibleStackActive = false;
    this.fadingRollActive = false;

    // Reset loading phases
    this.loadingPhase = true;
    this.readyGoPhase = false;
    this.gameStarted = false;

    // Validate piece history to ensure it's correct after reset
    this.validatePieceHistory();

    // Sync mode internal level/timing phase before READY/GO so first spawn uses correct gravity.
    this.syncModeStateToStartingLevel();
    this.applyModeConfiguration();

    // Reapply mode grading baseline after full reset
    this.applyInitialGradeFromMode();

    // Reset time tracking; actual start time is set on GO
    this.startTime = null;
    this.gameStartTime = null;
    this.currentTime = 0;
    this.pauseStartTime = null;
    this.totalPausedTime = 0;
    this.level999Reached = false; // Reset level 999 flag

    // Clear game elements
    this.gameGroup.clear(true, true);

    // Stop and destroy current BGM
    if (this.currentBGM) {
      this.currentBGM.stop();
      this.currentBGM = null;
    }

    // Clear all BGM objects to ensure clean restart
    if (this.stage1BGM) {
      this.stage1BGM.destroy();
      this.stage1BGM = null;
    }
    if (this.stage2BGM) {
      this.stage2BGM.destroy();
      this.stage2BGM = null;
    }

    // Clear TGM2 BGM objects
    if (this.tgm2_stage1) {
      this.tgm2_stage1.destroy();
      this.tgm2_stage1 = null;
    }
    if (this.tgm2_stage2) {
      this.tgm2_stage2.destroy();
      this.tgm2_stage2 = null;
    }
    if (this.tgm2_stage3) {
      this.tgm2_stage3.destroy();
      this.tgm2_stage3 = null;
    }
    if (this.tgm2_stage4) {
      this.tgm2_stage4.destroy();
      this.tgm2_stage4 = null;
    }

    // Reset UI
    this.scoreText.setText("0");
    this.currentLevelText.setText("0");
    if (hasGrading) {
      this.gradeText.setText("9");
    }
    // Reset Marathon mode separate level display
    if (isMarathonMode && this.levelDisplayText) {
      this.levelDisplayText.setText("1");
    }
    this.timeText.setText("0:00.00");
    this.ppsText.setText("0.00");
    this.rawPpsText.setText("0.00");

    // Restart loading sequence
    this.time.delayedCall(500, () => {
      this.loadingPhase = false;
      this.showReadyGo();
    });

    // Restart game (queue prep only; spawn happens after GO in showReadyGo)
    this.generateNextPieces();

    // Restart BGM
    this.updateBGM();
  }

  togglePause() {
    this.isPaused = !this.isPaused;

    // Handle time tracking during pause using Date.now()
    if (this.isPaused) {
      // Pausing: record the pause start time
      this.pauseStartTime = Date.now();
    } else {
      if (this.pauseStartTime && this.startTime) {
        const now = Date.now();
        const pausedDuration = now - this.pauseStartTime;
        this.startTime += pausedDuration;
        this.pauseStartTime = null;
      }
    }

    // Pause/resume BGM
    if (this.currentBGM) {
      if (this.isPaused) {
        this.currentBGM.pause();
      } else {
        this.currentBGM.resume();
      }
    }
    if (this.creditsBGM) {
      if (this.isPaused) {
        this.creditsBGM.pause();
      } else if (this.creditsActive) {
        if (!this.creditsBgmStarted && this.currentPiece && this.bgmEnabled) {
          this.creditsBGM.play();
          this.creditsBgmStarted = true;
        } else {
          this.creditsBGM.resume();
        }
      }
    }
  }

  goToMenu() {
    // Centralized safe return to menu to avoid stale scenes causing blank screens
    const mgr = this.scene;
    const rootMgr = this.game && this.game.scene ? this.game.scene : mgr;

    try {
      if (rootMgr && typeof rootMgr.getScenes === "function") {
        rootMgr.getScenes(true).map((s) => s.scene.key);
      }
    } catch (e) {
      console.warn("[goToMenu] failed to inspect scene state", e);
    }

    ["AssetLoaderScene", "LoadingScreenScene", "GameScene"].forEach((key) => {
      if (rootMgr.isActive(key)) {
        rootMgr.stop(key);
      }
    });

    // Remove any stray canvas elements left by previous Phaser instances
    const activeCanvas = this.game && this.game.canvas;
    if (activeCanvas && activeCanvas.parentNode) {
      const canvases = Array.from(activeCanvas.parentNode.querySelectorAll("canvas"));
      canvases.forEach((c) => {
        if (c !== activeCanvas && c.parentNode) {
          c.parentNode.removeChild(c);
        }
      });
    }

    // Re-add fresh scene instances to guarantee clean state
    const ensureScene = (key, ctor) => {
      if (!rootMgr.getScene(key)) {
        try {
          rootMgr.add(key, new ctor(), false);
        } catch (e) {
          console.error(`[goToMenu] failed to add ${key}`, e);
        }
      }
    };
    ensureScene("AssetLoaderScene", AssetLoaderScene);
    ensureScene("LoadingScreenScene", LoadingScreenScene);
    ensureScene("GameScene", GameScene);

    // Fully restart MenuScene to ensure it is active/visible
    let menu = rootMgr.getScene("MenuScene");
    const hasMenuKey = rootMgr.keys && rootMgr.keys["MenuScene"];
    if (!menu || !hasMenuKey) {
      try {
        const menuInstance = new MenuScene({ key: "MenuScene" });
        rootMgr.add("MenuScene", menuInstance, true);
        menu = rootMgr.getScene("MenuScene");
      } catch (e) {
        console.error("[goToMenu] failed to add MenuScene", e);
      }
    } else if (rootMgr.isActive("MenuScene") || rootMgr.isSleeping("MenuScene")) {
      rootMgr.stop("MenuScene");
      menu = null;
    }

    try {
      if (!rootMgr.isActive("MenuScene")) {
        rootMgr.start("MenuScene");
      }
    } catch (e) {
      console.error("[goToMenu] start MenuScene failed", e);
    }
    if (rootMgr.isActive("MenuScene")) {
      rootMgr.bringToTop("MenuScene");
      rootMgr.resume("MenuScene");
    }
    menu = rootMgr.getScene("MenuScene");
    if (menu && menu.scene) {
      menu.scene.setVisible(true);
      menu.scene.wake();
      if (typeof menu.setupKeyboardControls === "function") {
        menu.setupKeyboardControls();
      }
      if (menu.cameras && menu.cameras.main) {
        menu.cameras.main.visible = true;
      }
    }
  }

  startCredits(creditsDurationSec = null) {
    this.creditsActive = true;
    this.creditsTimer = 0;
    if (creditsDurationSec != null) {
      this.creditsDuration = creditsDurationSec;
    }
    // Allow continuous play/spawn during credits
    this.creditsGameplayEnabled = true;
    // Easy mode credits use hanabi bonuses during roll if configured
    this.creditsHanabi = false;
    const specialMechanics =
      (this.gameMode &&
        typeof this.gameMode.getConfig === "function" &&
        this.gameMode.getConfig()?.specialMechanics) ||
      {};
    if (specialMechanics.creditsHanabi) {
      this.creditsHanabi = true;
    }
    this.rollLinesCleared = 0;
    this.rollFailedDuringRoll = false;
    this.creditsFinalized = false;
    this.creditsBgmStarted = false;
    this.rollFadeLastExpireTime = 0;

    // Determine roll type based on mode flags
    this.rollType = null;
    if (this.gameMode) {
      if (this.gameMode.mRollStarted) {
        this.rollType = "mroll";
        this.invisibleStackActive = true;
        this.fadingRollActive = false;
      } else if (this.gameMode.fadingRollActive) {
        this.rollType = "fading";
        this.monochromeActive = false;
        this.bigBlocksActive = false;
      }
    }

    // Show roll bonus counter only for TGM3 credits roll
    const modeId =
      (this.gameMode && typeof this.gameMode.getModeId === "function"
        ? this.gameMode.getModeId()
        : this.selectedMode) || "";
    const modeIdLower = typeof modeId === "string" ? modeId.toLowerCase() : "";
    const showRollBonus = modeIdLower === "tgm3" || modeIdLower === "tgm3_master";
    if (this.staffRollBonusText) {
      this.staffRollBonusText.setVisible(showRollBonus);
    }

    // Play completion sound if GM grade achieved
    if (this.grade === "GM") {
      this.playSfx("complete", 0.8);
    }

    // Load credits BGM if available
    try {
      // Credits BGM: mf1_endroll for TGM3 Easy and T.A.Death, mf1_2 for TGM2 Normal, mf2_endroll for all others
      let creditsBGMKey = "mf2_endroll";
      if (this.selectedMode === "tgm2_normal") creditsBGMKey = "mf1_2";
      else if (this.selectedMode === "tgm3_easy" || this.selectedMode === "tadeath") creditsBGMKey = "mf1_endroll";
      this.creditsBGM = this.sound.add(creditsBGMKey, {
        loop: true,
        volume: 0.3,
      });
      // Start playback on first spawned credits piece.
    } catch (error) {
      console.warn("Credits BGM could not be loaded:", error);
    }

    // Stop current BGM
    if (this.currentBGM) {
      this.currentBGM.stop();
      this.currentBGM = null;
    }
  }

  beginPendingCreditsTransition() {
    if (!this.creditsPending || this.creditsActive) return;
    this.creditsPending = false;

    // Transition to credits roll: actually clear the board state (not just visual fade).
    this.currentPiece = null;
    this.isGrounded = false;
    this.lockDelay = 0;
    this.gravityAccum = 0;
    if (this.board) {
      if (typeof this.board.clearAll === "function") {
        this.board.clearAll();
      } else if (Array.isArray(this.board.grid)) {
        for (let r = 0; r < this.board.rows; r++) {
          this.board.grid[r] = Array(this.board.cols).fill(0);
          if (Array.isArray(this.board.fadeGrid) && this.board.fadeGrid[r]) {
            this.board.fadeGrid[r] = Array(this.board.cols).fill(0);
          }
        }
      }
      if (typeof this.board.resetFadeState === "function") {
        this.board.resetFadeState();
      }
    }
    this.placedMinos = [];
    this.placedMinoRows = [];
    this.minoRowFadeAlpha = {};
    // Credits flow should not inherit topout GAME OVER timers.
    this.fadingComplete = false;
    this.gameOverFadeDoneTime = null;
    this.showGameOverText = false;
    this.gameOverTextTimer = 0;
    this.gameOverSfxPlayed = true;
    // Ensure we are not stuck in an old ARE state after fade completion.
    this.areActive = false;
    this.areTimer = 0;

    this.creditsActive = true;
    if (this.gameMode && typeof this.gameMode.onCreditsStart === "function") {
      this.gameMode.onCreditsStart(this);
    }
    this.startCredits();

    // Kick off the first credits piece explicitly; otherwise some paths can
    // enter credits with no active piece and no pending ARE spawn.
    if (!this.currentPiece && !this.gameOver) {
      const nowMs = this.time?.now ?? Date.now();
      const startedAtMs =
        typeof this.creditsTransitionStartTime === "number"
          ? this.creditsTransitionStartTime
          : nowMs;
      // Guarantee 3.0s from fade-start to first credits spawn.
      const spawnDelayMs = Math.max(0, 3000 - (nowMs - startedAtMs));
      if (this.time?.delayedCall) {
        this.time.delayedCall(spawnDelayMs, () => {
          if (!this.currentPiece && this.creditsActive && !this.minoFadeActive) {
            this.spawnPiece();
          }
        });
      } else if (typeof setTimeout === "function") {
        setTimeout(() => {
          if (!this.currentPiece && this.creditsActive && !this.minoFadeActive) {
            this.spawnPiece();
          }
        }, spawnDelayMs);
      } else if (this.creditsActive && !this.minoFadeActive) {
        this.spawnPiece();
      }
    }
  }

  finalizeCreditsRoll() {
    if (this.creditsFinalized) return;
    this.creditsFinalized = true;
    this.creditsActive = false;

    // Hide roll bonus counter once credits are done
    if (this.staffRollBonusText) {
      this.staffRollBonusText.setVisible(false);
    }

    // Stop credits BGM if still playing
    if (this.creditsBGM) {
      this.creditsBGM.stop();
      this.creditsBGM = null;
    }
    this.creditsBgmStarted = false;

    // Staff roll grading: add roll bonus based on roll performance
    if (typeof this.rollBonus === "number") {
      const rollFactor = this.rollType === "mroll" ? 1.0 : 0.5;
      this.rollBonus += (this.rollLinesCleared || 0) * rollFactor;
      // For TGM3 Master: feed roll bonus into grading system (displayed grade) instead of rollBonus accumulation
      const modeId =
        this.gameMode && typeof this.gameMode.getModeId === "function"
          ? this.gameMode.getModeId()
          : this.selectedMode;
      if (
        (modeId === "tgm3_master" || modeId === "tgm3") &&
        this.gameMode &&
        typeof this.gameMode.addStaffRollBonus === "function" &&
        typeof this.gameMode.addStaffRollLines === "function"
      ) {
        this.gameMode.addStaffRollLines(this.rollLinesCleared || 0, this.rollType === "mroll" ? "mroll" : "fading");
      }
    }

    // Mode-specific credits end hook
    if (this.gameMode && typeof this.gameMode.onCreditsEnd === "function") {
      this.gameMode.onCreditsEnd(this);
    }

    // Show Hanabi summary after credits if available
    if (this.gameMode && this.gameMode.hanabi !== undefined) {
      this.showHanabiSummary(this.gameMode.hanabi);
    }

    // If invisible stack was active for fading roll, restore visibility
    if (this.invisibleStackActive) {
      this.invisibleStackActive = false;
    }

    // Grade line color: orange on successful roll clear, green on fail/topout
    if (this.rollFailedDuringRoll) {
      this.setGradeLineColor("green");
    } else {
      this.setGradeLineColor("orange");
    }

    // Delegate to mode-specific finish if available
    if (this.gameMode && typeof this.gameMode.finishCreditRoll === "function") {
      this.gameMode.finishCreditRoll(this);
      return;
    }

    // Fallback: end the game normally
    this.showGameOverScreen();
  }

  trackPlacedMino(x, y, color) {
    // Add mino to tracking list for fading
    this.placedMinos.push({ x, y, color, faded: false });

    // Track rows that contain minos for row-by-row fading
    if (!this.placedMinoRows.includes(y)) {
      this.placedMinoRows.push(y);
    }
  }

  startMinoFading() {
    // Rebuild placed mino tracking from current board state to ensure all rows fade.
    this.placedMinos = [];
    this.placedMinoRows = [];
    for (let y = 0; y < this.board.rows; y++) {
      for (let x = 0; x < this.board.cols; x++) {
        const cell = this.board.grid[y][x];
        if (cell) {
          this.placedMinos.push({ x, y, color: cell, faded: false });
          if (!this.placedMinoRows.includes(y)) {
            this.placedMinoRows.push(y);
          }
        }
      }
    }
    // Include the active piece in fading, if present
    if (this.currentPiece && this.currentPiece.shape) {
      for (let r = 0; r < this.currentPiece.shape.length; r++) {
        for (let c = 0; c < this.currentPiece.shape[r].length; c++) {
          if (this.currentPiece.shape[r][c]) {
            const x = this.currentPiece.x + c;
            const y = this.currentPiece.y + r;
            if (
              y >= 0 &&
              y < this.board.rows &&
              x >= 0 &&
              x < this.board.cols
            ) {
              this.board.grid[y][x] = this.currentPiece.color;
              this.placedMinos.push({ x, y, color: this.currentPiece.color, faded: false });
              if (!this.placedMinoRows.includes(y)) {
                this.placedMinoRows.push(y);
              }
            }
          }
        }
      }
    }

    this.minoFadeActive = true;
    this.minoFadeProgress = 0;
    this.minoFadeTimer = 0;
    this.gameOverTextTimer = 0;
    this.showGameOverText = false;
    this.minoRowFadeAlpha = {};

    // Stop BGM immediately when game over and fading starts
    if (this.currentBGM) {
      this.currentBGM.stop();
      this.currentBGM = null;
    }

    // Sort rows from bottom to top for proper fading order
    this.placedMinoRows.sort((a, b) => b - a); // Descending order

    // Calculate fade timing to complete all rows in ~2 seconds total
    const rowCount = this.placedMinoRows.length;
    if (rowCount > 0) {
      this.minoFadePerRowDuration = 2 / rowCount;
    } else {
      this.minoFadePerRowDuration = 2;
    }
  }

  startLockFlash() {
    // Store the locked piece's color and position for the flash effect
    const flashColor = this.currentPiece ? this.currentPiece.color : 0xffffff;
    const stackAlpha = this.stackAlpha || 0.8;
    let activePieceAlpha = 1;
    if (this.isGrounded && this.lockDelay > 0) {
      const fadeFrac = Math.min(this.lockDelay / (this.lockDelayMax || 0.5), 1);
      activePieceAlpha = 1 - fadeFrac * 0.6;
    }

    // Build a cell-precise overlay so only occupied minos flash
    const bigBlocks = !!this.bigBlocksActive;
    const blockSize = bigBlocks ? this.cellSize * 2 : this.cellSize;

    // Create a temporary flash overlay covering only the mino cells
    const flashOverlay = this.add.graphics();
    const flashCells = [];

    if (this.currentPiece) {
      for (let r = 0; r < this.currentPiece.shape.length; r++) {
        for (let c = 0; c < this.currentPiece.shape[r].length; c++) {
          if (!this.currentPiece.shape[r][c]) continue;
          const boardX = this.currentPiece.x + c;
          const boardY = this.currentPiece.y + r;
          if (boardY < 2) continue; // off-screen spawn rows
          const drawX = this.matrixOffsetX + boardX * this.cellSize;
          const drawY = this.matrixOffsetY + (boardY - 2) * this.cellSize;
          const renderX = bigBlocks ? drawX - this.cellSize / 2 : drawX;
          const renderY = bigBlocks ? drawY - this.cellSize / 2 : drawY;
          const left = renderX - blockSize / 2;
          const top = renderY - blockSize / 2;
          flashCells.push({ left, top });
        }
      }
    }

    // Render above board and independent of gameGroup clearing
    flashOverlay.setDepth(9999);

    const paintOverlay = (color, alpha) => {
      flashOverlay.clear();
      flashOverlay.fillStyle(color, alpha);
      for (let i = 0; i < flashCells.length; i++) {
        const cell = flashCells[i];
        flashOverlay.fillRect(cell.left, cell.top, blockSize, blockSize);
      }
    };

    // Fixed 3-frame lock animation:
    // frame 1: active piece opacity
    // frame 2: white
    // frame 3: stack opacity
    const frameMs = 1000 / BASE_FPS;
    paintOverlay(flashColor, activePieceAlpha);
    this.time.delayedCall(frameMs, () => {
      if (!flashOverlay || !flashOverlay.scene) return;
      paintOverlay(0xffffff, activePieceAlpha);
      this.time.delayedCall(frameMs, () => {
        if (!flashOverlay || !flashOverlay.scene) return;
        paintOverlay(flashColor, stackAlpha);
        this.time.delayedCall(frameMs, () => {
          if (flashOverlay && flashOverlay.scene) flashOverlay.destroy();
        });
      });
    });
  }

  saveBestScore() {
    if (this.leaderboardSaved) return;
    if (!this.selectedMode) return;
    if (typeof this.saveLeaderboardEntry !== "function") return;
    if ((this.startingLevel || 0) > 0) return;

    // For sprint modes, only save completed runs (40L/100L)
    if (
      (this.selectedMode === "sprint_40" || this.selectedMode === "sprint_100") &&
      !this.sprintCompleted
    ) {
      return;
    }

    // Sakura: store best stage/time/completion from mode
    if (this.selectedMode === "tgm3_sakura" && this.gameMode) {
      const stage = this.gameMode.bestStageReached || 0;
      const completionRate = Number(((stage / 27) * 100).toFixed(1));
      const bestTimeSeconds = this.gameMode.bestTimeSeconds;
      const time =
        bestTimeSeconds === null || bestTimeSeconds === undefined
          ? "--:--.--"
          : this.formatTimeValue(bestTimeSeconds);
      const entry = { stage, completionRate, time };
      this.saveLeaderboardEntry(this.selectedMode, entry);
      this.leaderboardSaved = true;
      return;
    }

    // Fallback generic entry; mode-specific handlers should prefer saveLeaderboardEntry directly.
    const entry = {
      hanabi: this.gameMode && this.gameMode.hanabi !== undefined ? this.gameMode.hanabi : undefined,
      score: this.score,
      level: this.level,
      lines: this.lines,
      grade: this.grade,
      time:
        this.currentTime !== undefined && this.currentTime !== null
          ? `${Math.floor(this.currentTime / 60)
              .toString()
              .padStart(2, "0")}:${Math.floor(this.currentTime % 60)
              .toString()
              .padStart(2, "0")}.${Math.floor((this.currentTime % 1) * 100)
              .toString()
              .padStart(2, "0")}`
          : undefined,
      pps: this.conventionalPPS != null ? Number(this.conventionalPPS.toFixed(2)) : undefined,
    };
    this.saveLeaderboardEntry(this.selectedMode, entry);
    this.leaderboardSaved = true;
  }

  getBestScore(mode) {
    const key = `bestScore_${mode}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored);
    }
    return { score: 0, level: 0, grade: "9", time: "--:--.--" };
  }

  showGameOverScreen() {
    // Zen: use custom recover-only flow (no GAME OVER text) and keep matrix visible
    if (this.isZenSandboxActive && this.isZenSandboxActive()) {
      try {
        console.log("[ZenTopout] showGameOverScreen zen path", {
          gameOver: this.gameOver,
          showText: this.showGameOverText,
          pending: this.zenTopoutPendingFinish,
          freeze: this.zenTopoutFreezeActive,
          cooldown: this.zenTopoutCooldown,
          suppressOnce: this.suppressGameOverOnce,
          goTextVisible: this.gameOverText?.visible,
          goTextAlpha: this.gameOverText?.alpha,
          boardRows: this.board?.rows,
        });
      } catch {}
      // Block gameplay input and ARE progression during topout delay
      this._zenSavedAREDelay = this.areDelay;
      this.areActive = true;
      this.areTimer = 0;
      this.areDelay = 9999; // large sentinel to prevent ARE completion
      this.lineClearDelayActive = false;
      this.lineClearPhase = false;
      this.pendingLineAREDelay = 0;
      // Drop any active piece to avoid repeated locks during the delay
      this.currentPiece = null;
      this.isGrounded = false;
      this.lockDelay = 0;
      this.lockResetCount = 0;
      this.gravityAccum = 0;
      this.gameOver = false;
      this.showGameOverText = false;
      this.gameOverTextTimer = 0;
      this.gameOverSfxPlayed = true;
      this.gameOverFadeDoneTime = null;
      this.suppressGameOverOnce = true;
      // Clear any invisibility/roll flags that could hide pieces
      this.invisibleStackActive = false;
      this.fadingRollActive = false;
      this.minoFadeActive = false;
      // Ensure any existing text is hidden
      if (this.gameOverText?.setVisible) this.gameOverText.setVisible(false);
      else if (this.gameOverText?.setAlpha) this.gameOverText.setAlpha(0);
      // Remove any lingering game over text objects from the scene
      try {
        if (this.gameGroup?.getChildren) {
          this.gameGroup.getChildren().forEach((child) => {
            if (
              child?.text &&
              (child.text === this.gameOverMessage || child.text === "GAME OVER")
            ) {
              child.destroy?.();
            }
          });
        }
      } catch {}
      try {
        console.log("[ZenTopout] hide gameOverText zen", {
          visible: this.gameOverText?.visible,
          alpha: this.gameOverText?.alpha,
        });
      } catch {}

      // Build fade data like default topout but skip the GAME OVER overlay
      try {
        this.placedMinos = [];
        this.placedMinoRows = [];
        this.minoRowFadeAlpha = {};
        this.fadingComplete = false;
        for (let r = 0; r < this.board.rows; r++) {
          for (let c = 0; c < this.board.cols; c++) {
            const cell = this.board.grid[r][c];
            if (cell) {
              this.placedMinos.push({ x: c, y: r, color: cell, faded: false });
              if (!this.placedMinoRows.includes(r)) this.placedMinoRows.push(r);
            }
          }
        }
        this.placedMinoRows.sort((a, b) => b - a);
        const rowCount = this.placedMinoRows.length;
        this.minoFadePerRowDuration = rowCount > 0 ? 2 / rowCount : 2;
        this.minoFadeActive = true;
        this.minoFadeProgress = 0;
        this.minoFadeTimer = 0;
        console.log("[ZenTopout] fade init zen", {
          placed: this.placedMinos.length,
          rows: this.placedMinoRows.slice(0, 5),
          rowCount,
        });
      } catch {}

      // Slow BGM similar to default topout
      try {
        const originalRate =
          this.currentBGM && typeof this.currentBGM.rate === "number" ? this.currentBGM.rate : 1;
        this._zenTopoutBgmRate = originalRate;
        if (this.currentBGM) {
          if (this.tweens?.add) {
            this.tweens.add({
              targets: this.currentBGM,
              rate: 0.25,
              duration: 2000,
              ease: "Linear",
            });
          } else if (this.currentBGM.setRate) {
            this.currentBGM.setRate(0.25);
          } else {
            this.currentBGM.rate = 0.25;
          }
        }
        console.log("[ZenTopout] bgm slow zen", {
          originalRate: this._zenTopoutBgmRate,
          hasBgm: !!this.currentBGM,
        });
      } catch {}

      const restoreBgmRate = () => {
        try {
          const rate = this._zenTopoutBgmRate || 1;
          if (this.tweens?.add && this.currentBGM) {
            this.tweens.add({
              targets: this.currentBGM,
              rate,
              duration: 300,
              ease: "Linear",
            });
          } else if (this.currentBGM?.setRate) {
            this.currentBGM.setRate(rate);
          } else if (this.currentBGM) {
            this.currentBGM.rate = rate;
          }
          this._zenTopoutBgmRate = null;
          console.log("[ZenTopout] bgm restore zen", { rate });
        } catch {}
      };

      // Clear stack and respawn without hiding the matrix or showing GAME OVER text
      const finalizeZenTopout = () => {
        try {
          if (this.board) {
            if (typeof this.board.clearAll === "function") {
              this.board.clearAll();
            } else if (Array.isArray(this.board.grid) && Array.isArray(this.board.fadeGrid)) {
              for (let r = 0; r < this.board.rows; r++) {
                this.board.grid[r] = Array(this.board.cols).fill(0);
                this.board.fadeGrid[r] = Array(this.board.cols).fill(0);
              }
            }
            this.ensureZenCheeseBaseline?.(0);
            // Ensure fade grid is fully reset to avoid invisible stack artifacts
            if (Array.isArray(this.board.fadeGrid)) {
              for (let r = 0; r < this.board.fadeGrid.length; r++) {
                this.board.fadeGrid[r] = Array(this.board.cols).fill(0);
              }
            }
            if (typeof this.board.resetFadeState === "function") {
              this.board.resetFadeState();
            }
          }
          this.playSfx?.("fall");
          this.currentPiece = null;
          this.isGrounded = false;
          if (this.nextPieces.length < 6) this.generateNextPieces();
          // Ensure a fresh next queue entry exists before spawn to avoid empty texture/render issues
          if (this.nextPieces.length === 0) this.generateNextPieces();
          // Clear hold without affecting next queue
          this.holdPiece = null;
          this.canHold = true;
          this.holdRequest = false;
          // Reset render-suppression flags so the next piece draws
          this.suppressPieceRenderThisFrame = false;
          this.suppressPieceRenderNextFrame = false;
          this.skipGravityThisFrame = false;
          // Stop fade once clear completes
          this.minoFadeActive = false;
          this.fadingComplete = false;
          this.placedMinos = [];
          this.placedMinoRows = [];
          this.invisibleStackActive = false;
          this.fadingRollActive = false;
          console.log("[ZenTopout] finalize zen", {
            nextLen: this.nextPieces?.length,
            goTextVisible: this.gameOverText?.visible,
            goTextAlpha: this.gameOverText?.alpha,
            suppressRender: this.suppressPieceRenderThisFrame,
            suppressNext: this.suppressPieceRenderNextFrame,
            skipGravity: this.skipGravityThisFrame,
          });
          this.zenTopoutPendingFinish = false;
          this.zenTopoutFreezeActive = false;
          this.zenTopoutCooldown = false;
          this.zenTopoutFreezeStart = 0;
          // Restore ARE handling
          this.areDelay =
            this._zenSavedAREDelay !== undefined && this._zenSavedAREDelay !== null
              ? this._zenSavedAREDelay
              : this.areDelay;
          this._zenSavedAREDelay = null;
          this.areTimer = 0;
          this.areActive = false;
          restoreBgmRate();
          if (this.time?.delayedCall) {
            this.time.delayedCall(0, () => this.spawnPiece());
          } else if (typeof setTimeout === "function") {
            setTimeout(() => this.spawnPiece(), 0);
          } else {
            this.spawnPiece();
          }
        } catch (err) {
          try {
            console.error("[ZenTopout] finalize error (showGameOverScreen zen path)", err);
          } catch {}
          this.zenTopoutPendingFinish = false;
          this.zenTopoutFreezeActive = false;
          this.zenTopoutCooldown = false;
          restoreBgmRate();
        }
      };

      const doClear = () => {
        finalizeZenTopout();
      };

      // Drive the fade for 2s then clear
      if (this.time?.delayedCall) {
        console.log("[ZenTopout] schedule clear (delayedCall)");
        this.time.delayedCall(2000, doClear);
      } else if (typeof setTimeout === "function") {
        console.log("[ZenTopout] schedule clear (setTimeout)");
        setTimeout(doClear, 2000);
      } else {
        console.log("[ZenTopout] immediate clear (no timer)");
        doClear();
      }
      return;
    }

    // One-shot suppression (used by Zen recoveries that haven't activated freeze yet)
    if (this.suppressGameOverOnce) {
      this.suppressGameOverOnce = false;
      this.gameOver = false;
      this.showGameOverText = false;
      this.gameOverTextTimer = 0;
      this.gameOverSfxPlayed = true;
      this.gameOverFadeDoneTime = null;
      return;
    }

    if (this.creditsActive) {
      this.rollFailedDuringRoll = true;
      // Topping out during credits is a fail: set to at least green line
      this.rollHighestLine = Math.max(this.rollHighestLine, 18);
    }
    this.gameOver = true;
    this.gameOverTimer = 0; // Start timer for 10 seconds
    if (!this.torikanFailActive) {
      this.gameOverMessage = this.sprintCompleted ? "CONGRATULATIONS" : "GAME OVER";
    }
    this.finesseActiveForPiece = false;

    // Show Hanabi summary if available
    if (this.gameMode && this.gameMode.hanabi !== undefined) {
      this.showHanabiSummary(this.gameMode.hanabi);
    }

    // Freeze section tracking so the losing section remains counted and displayed.
    if (
      this.sectionTimes &&
      typeof this.currentSection === "number" &&
      typeof this.sectionStartTime === "number" &&
      typeof this.sectionTimes[this.currentSection] !== "number"
    ) {
      this.sectionTimes[this.currentSection] = this.currentTime - this.sectionStartTime;
      if (this.sectionTetrises) {
        this.sectionTetrises[this.currentSection] = this.currentSectionTetrisCount;
      }
    }

    // Clear any held input state so pieces cannot keep moving during game over.
    this.leftKeyPressed = false;
    this.rightKeyPressed = false;
    this.leftInRepeat = false;
    this.rightInRepeat = false;
    this.leftTimer = 0;
    this.rightTimer = 0;
    this.kKeyPressed = false;
    this.spaceKeyPressed = false;
    this.lKeyPressed = false;
    this.xKeyPressed = false;

    if (this.bgmLoopTimer) {
      this.bgmLoopTimer.remove(false);
      this.bgmLoopTimer = null;
    }

    // Stop any playing BGM (stage BGM or credits BGM)
    if (this.currentBGM) {
      this.currentBGM.stop();
      this.currentBGM = null;
    }
    if (this.creditsBGM) {
      this.creditsBGM.stop();
      this.creditsBGM = null;
    }

    // Stop stage BGM objects
    const stageBgms = [this.stage1BGM, this.stage2BGM];
    stageBgms.forEach((bgm) => {
      if (bgm) {
        if (bgm.isPlaying) {
          bgm.stop();
        }
        bgm.destroy();
      }
    });
    this.stage1BGM = null;
    this.stage2BGM = null;

    // Stop TGM2 BGM objects
    const tgm2Bgms = [
      this.tgm2_stage1,
      this.tgm2_stage2,
      this.tgm2_stage3,
      this.tgm2_stage4,
    ];
    tgm2Bgms.forEach((bgm) => {
      if (bgm) {
        if (bgm.isPlaying) {
          bgm.stop();
        }
        bgm.destroy();
      }
    });
    this.tgm2_stage1 = null;
    this.tgm2_stage2 = null;
    this.tgm2_stage3 = null;
    this.tgm2_stage4 = null;

    // Start mino fading immediately
    this.startMinoFading();

    // Handle game over in game mode (for TGM2, powerup minos, etc.)
    if (this.gameMode && this.gameMode.onGameOver) {
      this.gameMode.onGameOver(this);
    }
  }

  showHanabiSummary(hanabiValue) {
    const text = `Hanabi: ${hanabiValue}`;
    if (this.hanabiText && this.hanabiText.destroy) {
      this.hanabiText.destroy();
    }
    this.hanabiText = this.add
      .text(
        this.borderOffsetX + this.playfieldWidth / 2,
        this.borderOffsetY + this.playfieldHeight + 80,
        text,
        {
          fontSize: "24px",
          fill: "#ffff88",
          fontFamily: "Courier New",
          fontStyle: "bold",
          align: "center",
        },
      )
      .setOrigin(0.5, 0);
  }

  drawCreditsScreen() {
    // Don't draw credits if game is paused
    if (this.isPaused) {
      return;
    }

    // Create scrolling credits text behind the tetrominos (under the matrix)
    const creditsLayout = [
      { text: "MINO FREEFALL Pre-beta", type: "title" },
      { text: "WORK IN PROGRESS", type: "title"},
      { text: "", type: "spacer" },
      { text: "Created by", type: "section" },
      { text:"The Colorbleed Neon team", type: "content"},
      { text: "Neneko, the one and only", type:"content"},
      { text: "member of the team", type:"content"},
      { text: "", type: "spacer" },
      { text: "Special Thanks", type: "section" },
      { text: "Caithness", type: "content" },
      { text: "switchpalacecorner A.K.A spc", type: "content" },
      { text: "EdenGT", type: "content" },
      { text: "colour_thief", type: "content" },
      { text: "ItzBlack", type: "content" },
      { text: "Shard Nguyen", type: "content" },
      { text: "Vz61", type: "content" },
      { text: "And everyone from the", type: "content" },
      { text: "THEABSOLUTE.PLUS Discord server", type: "content" },
      { text: "As well as", type: "section" },
      { text: "Friends & Family", type: "content" },
      { text: "LumiBach, the ICT teacher", type: "content" },
      { text: "", type: "spacer" },
      { text: "Music & Sound", type: "section" },
      { text: "Taken from Texmaster", type: "content" },
      { text: "and various games", type: "content" },
      { text: "Original BGMs", type: "content" },
      { text: "is coming soon", type: "content" },
      { text: "", type: "spacer" },
      { text: "Inspired by", type: "section" },
      { text: "Tetris: The Grand Master Series", type: "content" },
      { text: "Texmaster 2009", type: "content" },
      { text: "TETR.IO", type: "content" },
      { text: "", type: "spacer" },
      { text: "Technical Implementation", type: "section" },
      { text: "Phaser 3 Game Framework", type: "content" },
      { text: "from phaser.io", type: "content" },
      { text: "TGM mechanics", type: "content" },
      { text: "12 hours of coding a day", type: "content" },
      { text: "Grade Recognition System", type: "section" },
      { text: "20G Gravity", type: "content" },
      { text: "", type: "spacer" },
      { text: "Piece Randomizer", type: "section" },
      { text: "TGM History Checking System", type: "content" },
      { text: "Also called IRM", type: "content" },
      { text: "", type: "spacer" },
      { text: "BGM", type: "section" },
      { text: "Interstellar Pack", type: "content" },
      { text: "by DavidKBD", type: "content" },      
      { text: "", type: "spacer" },
      { text: "If you have made it this far", type: "closing" },
      { text: "You are pretty good at this game", type: "closing" },
      { text: "", type: "spacer" },
      { text: "Thank you for playing!", type: "closing" },
      { text: "-- Created by Colorbleed Neon --", type: "closing" },
    ];

    // Per-type styling to keep layout modifiable
    const lineStyles = {
      title: { fontSize: 36, color: "#ffff00", lineHeight: 44 },
      section: { fontSize: 24, color: "#00ffff", lineHeight: 34 },
      content: { fontSize: 20, color: "#ffffff", lineHeight: 30 },
      closing: { fontSize: 22, color: "#ff00ff", lineHeight: 32 },
      spacer: { fontSize: 20, color: "#ffffff", lineHeight: 20 },
    };

    // Build positioned lines so we can preserve order (including spacers)
    const lines = creditsLayout.map((entry) => {
      const style = lineStyles[entry.type] || lineStyles.content;
      return {
        ...entry,
        style,
        height: style.lineHeight,
      };
    });

    const visibleMatrixHeight = this.cellSize * this.visibleRows; // Height of visible matrix area
    const totalCreditsHeight = lines.reduce((sum, line) => sum + line.height, 0);
    const matrixBottomY = this.borderOffsetY + this.playfieldHeight;
    const matrixTopY = this.borderOffsetY;
    const centerX =
      this.matrixOffsetX + (this.cellSize * this.board.cols) / 2 - 5; // Center horizontally over matrix, shifted 5px left

    // Start just below the matrix so the first line scrolls in immediately
    const firstLineHeight = lines[0]?.height || 30;
    const startGap = 8; // small gap so first line begins offscreen
    const creditsStartY = matrixBottomY + firstLineHeight / 2 + startGap;

    // Compute total distance so the last line fully clears the top exactly at creditsDuration
    let cumulative = 0;
    const lastIndex = lines.length - 1;
    const lastLineHeight = lines[lastIndex]?.height || 30;
    const lastLineCenterOffset =
      lines.reduce((acc, line, idx) => {
        const offset = acc.offset + line.height / 2;
        acc.positions.push(offset);
        acc.offset += line.height;
        return acc;
      }, { offset: 0, positions: [] }).positions[lastIndex] || 0;

    const totalScrollDistance =
      creditsStartY + lastLineCenterOffset + lastLineHeight / 2 - matrixTopY;
    this.creditsScrollSpeed = totalScrollDistance / this.creditsDuration; // pixels per second

    // Clamp to duration so we don't loop; end position aligns with creditsDuration
    const scrollProgress =
      Math.min(this.creditsTimer, this.creditsDuration) *
      this.creditsScrollSpeed;

    // Draw lines in order; keep spacing by using cumulative offsets
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lineCenterOffset = cumulative + line.height / 2;
      const y = creditsStartY - scrollProgress + lineCenterOffset;
      cumulative += line.height;

      // Only draw if within or overlapping the matrix area
      if (y + line.height / 2 < matrixTopY || y - line.height / 2 > matrixBottomY) {
        continue;
      }

      const { fontSize, color } = line.style;
      const textObj = this.add
        .text(centerX, y, line.text, {
          fontSize: `${fontSize}px`,
          fill: color,
          stroke: "#000000",
          strokeThickness: 2,
          fontFamily: "Courier New",
          fontStyle: "bold",
          wordWrap: { width: this.cellSize * this.board.cols - 30 },
          align: "center",
        })
        .setOrigin(0.5);
      this.gameGroup.add(textObj);
    }
  }

  drawLevelBar() {
    // If Zen display mode is "none", hide level/lines UI entirely
    if (this.isZenSandboxActive && this.isZenSandboxActive()) {
      const mode = (this.zenSandboxConfig?.displayMode || "").toLowerCase();
      if (mode === "none") {
        [
          this.levelLabel,
          this.levelDisplayLabel,
          this.levelDisplayText,
          this.currentLevelText,
          this.capLevelText,
          this.levelBar,
        ]
          .filter(Boolean)
          .forEach((el) => {
            el.setVisible(false);
            if (el.clear) el.clear();
          });
        return;
      }
    }

    const uiX = Math.max(20, this.borderOffsetX - 200) + 50;
    const levelBottomY = this.borderOffsetY + this.playfieldHeight - 60;
    const levelRowHeight = 20; // Decreased spacing
    const rightX = uiX + 120;
    const levelFontSize = Math.max(
      24,
      Math.min(36, Math.floor(this.cellSize * 1.0)),
    ); // Increased font

    // Determine mode types
    const isMarathonMode = this.selectedMode === "marathon";
    const isUltraMode = this.selectedMode === "ultra";
    const isZenMode = this.selectedMode === "zen";
    const isSprintMode =
      this.selectedMode &&
      (this.selectedMode === "sprint_40" || this.selectedMode === "sprint_100");
    const isLineCountMode = isMarathonMode || isUltraMode || isZenMode || isSprintMode;

    if (this.currentLevelText && !this.currentLevelText.scene) {
      this.currentLevelText = null;
    }
    if (this.capLevelText && !this.capLevelText.scene) {
      this.capLevelText = null;
    }
    if (this.levelBar && !this.levelBar.scene) {
      this.levelBar = null;
    }
    if (this.levelDisplayText && !this.levelDisplayText.scene) {
      this.levelDisplayText = null;
    }
    if (this.levelDisplayLabel && !this.levelDisplayLabel.scene) {
      this.levelDisplayLabel = null;
    }

    // For Marathon mode, update separate level display
    if (isMarathonMode && this.levelDisplayText) {
      this.levelDisplayText.setText((this.level + 1).toString());
    }

    // For Zen/Ultra modes, only show lines cleared, no level bar or cap
    if (isZenMode || isUltraMode) {
      // Current lines - top row
      const currentY = levelBottomY - 3 * levelRowHeight;
      const currentLinesText = this.totalLines.toString();
      if (!this.currentLevelText) {
        this.currentLevelText = this.add
          .text(rightX + 17, currentY - 30, currentLinesText, {
            fontSize: `${levelFontSize}px`,
            fill: "#fff",
            fontFamily: "Courier New",
            fontStyle: "bold",
            align: "right",
          })
          .setOrigin(1, 0);
      } else {
        this.currentLevelText.setText(currentLinesText);
      }
      return; // Don't draw bar or cap for Zen mode
    }

    // Calculate section cap based on mode
    let sectionCap;
    if (isMarathonMode) {
      // Marathon: next multiple of 10 above current lines
      sectionCap = Math.ceil((this.totalLines + 1) / 10) * 10;
    } else if (isSprintMode) {
      // Sprint: 40 for sprint_40, 100 for sprint_100
      sectionCap = this.selectedMode === "sprint_40" ? 40 : 100;
    } else {
      // TGM modes: default section calculation
      const rawMaxLevel =
        this.gameMode && typeof this.gameMode.getDisplayLevelCap === "function"
          ? this.gameMode.getDisplayLevelCap()
          : this.gameMode
            ? this.gameMode.getGravityLevelCap()
            : 999;
      const maxLevel = Number.isFinite(rawMaxLevel) ? rawMaxLevel : 999;
      const section = Math.floor(this.level / 100);
      if (maxLevel === 300) {
        // TGM2 Normal: always show 300 as the cap
        sectionCap = 300;
      } else {
        sectionCap = Math.min((section + 1) * 100, maxLevel);
      }
    }

    // Current level/lines - top row
    const currentY = levelBottomY - 3 * levelRowHeight;
    const currentValue =
      isLineCountMode ? this.totalLines.toString() : this.level.toString();
    if (!this.currentLevelText) {
      this.currentLevelText = this.add
        .text(rightX + 17, currentY - 30, currentValue, {
          fontSize: `${levelFontSize}px`,
          fill: "#fff",
          fontFamily: "Courier New",
          fontStyle: "bold",
          align: "right",
        })
        .setOrigin(1, 0);
    } else {
      this.currentLevelText.setText(currentValue);
    }

    // Bar - middle row, white background with red fill
    {
      const barY = levelBottomY - 2 * levelRowHeight;
      const barWidth = 60;
      const barHeight = 4;
      const barX = rightX - barWidth;
      const internalGravity = this.getTGMGravitySpeed(this.level);
      // Green bar: percentage of sub-1G gravity (0–256)
      const greenRatio = Math.min(internalGravity / 256, 1);
      // Red overlay: gravity beyond 1G, scaled up to 20G (5120)
      const redRatio =
        internalGravity > 256
          ? Math.min((internalGravity - 256) / (5120 - 256), 1)
          : 0;

      if (!this.levelBar) {
        this.levelBar = this.add.graphics();
      }
      this.levelBar.clear();
      // White background
      this.levelBar.fillStyle(0xffffff);
      this.levelBar.fillRect(barX + 14, barY - 15, barWidth, barHeight);
      // Green fill for sub-1G portion
      this.levelBar.fillStyle(0x00ff00);
      this.levelBar.fillRect(
        barX + 14,
        barY - 15,
        barWidth * greenRatio,
        barHeight,
      );
      // Red overlay for gravity beyond 1G
      if (redRatio > 0) {
        this.levelBar.fillStyle(0xff0000);
        this.levelBar.fillRect(
          barX + 14,
          barY - 15,
          barWidth * redRatio,
          barHeight,
        );
      }
    }

    // Cap level - bottom row
    const capY = levelBottomY - levelRowHeight;
    const capText = sectionCap.toString();
    if (!this.capLevelText) {
      this.capLevelText = this.add
        .text(rightX + 17, capY - 25, capText, {
          fontSize: `${levelFontSize}px`,
          fill: "#fff",
          fontFamily: "Courier New",
          fontStyle: "bold",
          align: "right",
        })
        .setOrigin(1, 0);
    } else {
      this.capLevelText.setText(capText);
    }
  }

  draw() {
    // Check if mode uses grading
    const modeConfig = this.gameMode ? this.gameMode.getConfig() : {};
    const hasGrading = modeConfig.hasGrading !== false;

    // Capture and immediately clear one-frame render suppression so it never persists
    const suppressRender = this.suppressPieceRenderThisFrame;
    this.suppressPieceRenderThisFrame = false;
    this.gameGroup.clear(true, true);

    // Show loading text during loading phase
    if (this.loadingPhase) {
      const centerX = this.cameras.main.width / 2;
      const centerY = this.cameras.main.height / 2;
      const loadingText = this.add
        .text(centerX, centerY, "LOADING...", {
          fontSize: "48px",
          fill: "#ffffff",
          fontFamily: "Courier New",
          fontStyle: "bold",
        })
        .setOrigin(0.5);
      this.gameGroup.add(loadingText);
      return; // Don't draw anything else during loading
    }

    // Draw credits screen first (behind everything)
    if (this.creditsActive) {
      this.drawCreditsScreen();
    }

    // Draw matrix and border during ready-go and after
    if (this.readyGoPhase || this.gameStarted) {
      // Border adjusted to fit exactly 10x20 with smaller width and height
      // Use mode type color for border
      const modeTypeColor = this.getModeTypeBorderColor();
      this.playfieldBorder = this.add.graphics();
      this.playfieldBorder.lineStyle(3, modeTypeColor);
      this.playfieldBorder.strokeRect(
        this.borderOffsetX - 4,
        this.borderOffsetY - 3,
        this.cellSize * this.board.cols + 4,
        this.cellSize * this.visibleRows + 5,
      ); // Height reduced by 1px, width expanded 1px left
      this.gameGroup.add(this.playfieldBorder);

      // Draw game elements using matrix offset (skip during game over after fading)
      // During game over fading, keep drawing the stack so row-by-row alpha can be applied.
      if (
        this.gameStarted &&
        (!this.gameOver || this.minoFadeActive) &&
        !this.fadingComplete
      ) {
        this.board.draw(
          this,
          this.matrixOffsetX,
          this.matrixOffsetY,
          this.cellSize,
        );
      }
    }

    // Draw line clear animation if active
    if (this.isClearingLines && this.clearedLines.length > 0) {
      // Calculate fading alpha based on progress through line clear ARE
      const fadeProgress = this.areTimer / this.areDelay; // 0 to 1
      const fadeAlpha = Math.max(0.2, 1.0 - fadeProgress); // Fade from 1.0 to 0.2

      // Draw cleared lines with fading effect, respecting stack dimming
      for (const lineRow of this.clearedLines) {
        // Only draw if line is in visible area (row 2 and below)
        if (lineRow >= 2) {
          for (let col = 0; col < this.board.cols; col++) {
            const textureKey =
              this.rotationSystem === "ARS" ? "mino_ars" : "mino_srs";
            const texture = this.textures ? this.textures.get(textureKey) : null;
            const textureSource = texture && texture.source ? texture.source[0] : null;
            const hasValidTextureSource =
              !!texture && !!textureSource && !!textureSource.image;

            // Apply stack dimming to cleared cells so brightness is consistent
            const cellAlpha = fadeAlpha * (this.stackAlpha || 1);

            if (hasValidTextureSource) {
              const sprite = this.add.sprite(
                this.matrixOffsetX + col * this.cellSize,
                this.matrixOffsetY + (lineRow - 2) * this.cellSize,
                textureKey,
              );
              sprite.setDisplaySize(this.cellSize, this.cellSize);
              sprite.setTint(0xffffff); // White for cleared lines
              sprite.setAlpha(cellAlpha);
              this.gameGroup.add(sprite);
            } else {
              const graphics = this.add.graphics();
              graphics.fillStyle(0xffffff, cellAlpha);
              graphics.fillRect(
                this.matrixOffsetX + col * this.cellSize - this.cellSize / 2,
                this.matrixOffsetY + (lineRow - 2) * this.cellSize -
                  this.cellSize / 2,
                this.cellSize,
                this.cellSize,
              );
              this.gameGroup.add(graphics);
            }
          }
        }
      }
    }
    // Draw current/ghost only during active play; during game over fading we already merged the active piece into the board
    if (
      this.currentPiece &&
      !this.gameOver &&
      !this.minoFadeActive &&
      !this.fadingComplete &&
      !suppressRender
    ) {
      // Ghost piece: always visible in Easy/Normal modes, only 0-100 in other modes
      if (this.isNormalOrEasyMode() || this.level <= 100) {
        const ghost = this.currentPiece.getGhostPosition(this.board);
        ghost.draw(
          this,
          this.matrixOffsetX,
          this.matrixOffsetY,
          this.cellSize,
          true,
        );
      }

      // Calculate alpha for lock delay fade effect
      let pieceAlpha = 1;
      if (this.isGrounded && this.lockDelay > 0) {
        // Fade from 100% to 40% over the configured lock delay window
        const fadeFrac = Math.min(this.lockDelay / (this.lockDelayMax || 0.5), 1);
        pieceAlpha = 1 - fadeFrac * 0.6;
      }

      this.currentPiece.draw(
        this,
        this.matrixOffsetX,
        this.matrixOffsetY,
        this.cellSize,
        false,
        pieceAlpha,
      );

      // Blinking yellow border around active piece
      const blinkAlpha = 0.5 + 0.5 * Math.sin(this.time.now * 0.02);
      const bigBlocks = !!this.bigBlocksActive;
      const outlineCellSize = bigBlocks ? this.cellSize * 2 : this.cellSize;
      for (let r = 0; r < this.currentPiece.shape.length; r++) {
        for (let c = 0; c < this.currentPiece.shape[r].length; c++) {
          if (!this.currentPiece.shape[r][c]) continue;
          const pieceY = this.currentPiece.y + r;
          if (pieceY < 2) continue; // off-screen spawn rows
          const drawX = this.matrixOffsetX + (this.currentPiece.x + c) * this.cellSize;
          const drawY = this.matrixOffsetY + (pieceY - 2) * this.cellSize;
          const renderX = bigBlocks ? drawX - this.cellSize / 2 : drawX;
          const renderY = bigBlocks ? drawY - this.cellSize / 2 : drawY;
          const outline = this.add.graphics();
          outline.lineStyle(2, 0xffff00, blinkAlpha);
          outline.strokeRect(
            renderX - outlineCellSize / 2,
            renderY - outlineCellSize / 2,
            outlineCellSize,
            outlineCellSize,
          );
          this.gameGroup.add(outline);
        }
      }
    }

    // Update UI
    this.scoreText.setText(this.score.toString());
    if (this.scorePerPieceText) {
      const piecesForScore = Math.max(1, this.totalPiecesPlaced || 0);
      const scorePerPiece = this.score / piecesForScore;
      this.scorePerPieceText.setText(scorePerPiece.toFixed(2));
    }

    // Update grade display only for modes that use grading
    if (hasGrading) {
      const fetchedGrade =
        this.gameMode && typeof this.gameMode.getDisplayedGrade === "function"
          ? this.gameMode.getDisplayedGrade()
          : null;
      const tgm3Grade =
        this.gameMode && this.gameMode.tgm3Grading && typeof this.gameMode.tgm3Grading.getDisplayedGrade === "function"
          ? this.gameMode.tgm3Grading.getDisplayedGrade()
          : null;
      const gradeToShow =
        (typeof fetchedGrade === "string" && fetchedGrade.trim() !== "" && fetchedGrade) ||
        (typeof tgm3Grade === "string" && tgm3Grade.trim() !== "" && tgm3Grade) ||
        (this.grade && this.grade) ||
        (this.initialGradeBaseline ?? "9");
      this.grade = gradeToShow;
      if (this.gradeText) {
        this.gradeText.setText(gradeToShow);
      }
      if (this.gradePointsText) {
        const gradePoints =
          (this.gameMode && typeof this.gameMode.getGradePoints === "function"
            ? this.gameMode.getGradePoints()
            : null) ??
          (this.gameMode &&
            this.gameMode.tgm3Grading &&
            typeof this.gameMode.tgm3Grading.getGradePoints === "function"
            ? this.gameMode.tgm3Grading.getGradePoints()
            : this.gameMode &&
                this.gameMode.tgm3Grading &&
                typeof this.gameMode.tgm3Grading.gradePoints !== "undefined"
              ? this.gameMode.tgm3Grading.gradePoints
              : null);
        const gpVal = gradePoints != null ? gradePoints.toString() : "0";
        this.gradePointsText.setText(gpVal);
      }

      if (this.nextGradeText && this.shouldShowNextGradeText) {
        this.updateNextGradeText();
      } else if (this.nextGradeText) {
        this.nextGradeText.setVisible(false);
      }

      // TAP-style internal grade (TGM2 mapping, no COOL bonuses)
      if (
        this.tapInternalGradeText &&
        this.gameMode &&
        this.gameMode.tgm3Grading &&
        typeof this.gameMode.tgm3Grading.getBaseDisplayedGrade === "function"
      ) {
        const tapGrade = this.gameMode.tgm3Grading.getBaseDisplayedGrade();
        this.tapInternalGradeText.setText(`TAP GRADE: ${tapGrade ?? "--"}`);
        this.tapInternalGradeText.setVisible(true);
      } else if (this.tapInternalGradeText) {
        this.tapInternalGradeText.setVisible(false);
      }

      this.updateGradeUIVisibility();
    }

    // Update piece per second displays
    this.ppsText.setText(this.conventionalPPS.toFixed(2));
    this.rawPpsText.setText(this.rawPPS.toFixed(2));
    if (this.asukaKitaText) {
      const kitaCount =
        this.gameMode && typeof this.gameMode.kitas === "number"
          ? this.gameMode.kitas
          : this.kitas || 0;
      this.asukaKitaText.setText(kitaCount.toString());
    }
    if (
      this.ppsGraphGraphics &&
      this.ppsGraphArea &&
      this.selectedMode &&
      (this.selectedMode === "sprint_40" || this.selectedMode === "sprint_100")
    ) {
      this.drawSprintPpsGraph();
    }

    // Draw level bar
    this.drawLevelBar();

    // Format and display time
    const isUltraMode = this.selectedMode === "ultra";
    let timeToDisplay = this.currentTime;

    if (isUltraMode) {
      const timeLimit =
        this.gameMode && this.gameMode.timeLimit ? this.gameMode.timeLimit : 120;
      const elapsedActiveTime =
        this.gameMode && typeof this.gameMode.elapsedActiveTime === "number"
          ? this.gameMode.elapsedActiveTime
          : this.currentTime;
      timeToDisplay = Math.max(0, timeLimit - elapsedActiveTime);
    }

    const minutes = Math.floor(timeToDisplay / 60);
    const seconds = Math.floor(timeToDisplay % 60);
    const centiseconds = Math.floor((timeToDisplay % 1) * 100);
    const timeString = `${minutes}:${seconds.toString().padStart(2, "0")}.${centiseconds.toString().padStart(2, "0")}`;

    if (this.timeText) {
      this.timeText.setText(timeString);
    } else {
    }

    if (
      this.sectionTrackerGroup &&
      this.sectionTimeTexts &&
      this.sectionTotalTexts &&
      this.sectionSectionLabels
    ) {
      const modeId =
        this.gameMode && typeof this.gameMode.getModeId === "function"
          ? this.gameMode.getModeId()
          : this.selectedMode;
      const isTgm3Mode = typeof modeId === "string" && modeId.startsWith("tgm3");
      const isTgm2Normal = modeId === "tgm2_normal";
      const isMarathonMode = this.selectedMode === "marathon";
      const maxLevel =
        this.gameMode && typeof this.gameMode.getGravityLevelCap === "function"
          ? (typeof this.gameMode.getDisplayLevelCap === "function"
              ? this.gameMode.getDisplayLevelCap()
              : this.gameMode.getGravityLevelCap())
          : this.gravityLevelCap || 999;

      const sectionLength = this.getSectionLength();
      const maxSections = this.getMaxSectionsForTracker();
      const basis = this.getSectionBasisValue();
      const basisLastSectionIndex = Math.min(
        maxSections - 1,
        Math.max(0, Math.floor(Math.max(0, basis - 1) / sectionLength)),
      );
      const lastSectionIndex = Math.min(
        maxSections - 1,
        Math.max(
          basisLastSectionIndex,
          typeof this.currentSection === "number" ? this.currentSection : 0,
        ),
      );
      const displayedCurrentSection = Math.min(this.currentSection, lastSectionIndex);

      const sectionTimesArray = [];
      const sectionTetrisesArray = [];
      for (let i = 0; i < maxSections; i++) {
        if (i > lastSectionIndex) {
          sectionTimesArray.push(null);
          sectionTetrisesArray.push(null);
          continue;
        }

        const storedFullTime =
          this.sectionTimes && typeof this.sectionTimes[i] === "number"
            ? this.sectionTimes[i]
            : undefined;
        const storedCoolTime =
          this.sectionCoolTimes && typeof this.sectionCoolTimes[i] === "number"
            ? this.sectionCoolTimes[i]
            : undefined;
        const storedTetrises = this.sectionTetrises ? this.sectionTetrises[i] : undefined;
        const isCurrent =
          i === displayedCurrentSection &&
          !this.gameOver &&
          (!isMarathonMode ? this.level < maxLevel : true) &&
          typeof storedFullTime !== "number";
        const currentElapsed = this.currentTime - this.sectionStartTime;
        // Main section stopwatch should continue past *70; only COOL split freezes.
        const timeValue =
          typeof storedFullTime === "number"
            ? storedFullTime
            : isCurrent
              ? currentElapsed
              : null;
        sectionTimesArray.push(timeValue);

        const tetrisValue =
          typeof storedTetrises === "number"
            ? storedTetrises
            : isCurrent
              ? this.currentSectionTetrisCount || 0
              : null;
        sectionTetrisesArray.push(tetrisValue);
      }

      let runningTotal = 0;
      for (let i = 0; i < this.sectionTimeTexts.length; i++) {
        const shouldShow = i <= displayedCurrentSection && i <= lastSectionIndex;
        this.sectionSectionLabels[i].setVisible(shouldShow);
        this.sectionTimeTexts[i].setVisible(shouldShow);
        if (this.sectionTallyTexts && this.sectionTallyTexts[i]) {
          this.sectionTallyTexts[i].setVisible(shouldShow);
        }
        if (this.sectionPerfTexts && this.sectionPerfTexts[i]) {
          this.sectionPerfTexts[i].setVisible(shouldShow);
        }

        const storedFullTime =
          this.sectionTimes && typeof this.sectionTimes[i] === "number"
            ? this.sectionTimes[i]
            : undefined;
        const storedCoolTime =
          this.sectionCoolTimes && typeof this.sectionCoolTimes[i] === "number"
            ? this.sectionCoolTimes[i]
            : undefined;
        const liveTime =
          typeof storedFullTime === "number"
            ? storedFullTime
            : i === displayedCurrentSection
              ? this.currentTime - this.sectionStartTime
              : undefined;
        // In TGM3, cumulative totals should use the COOL (0-*70) split; otherwise use full time.
        const splitTime = isTgm3Mode
          ? typeof storedCoolTime === "number"
            ? storedCoolTime
            : typeof liveTime === "number"
              ? liveTime
              : undefined
          : typeof storedFullTime === "number"
            ? storedFullTime
            : typeof liveTime === "number"
              ? liveTime
              : undefined;
        const hasCompletedTime = typeof splitTime === "number";
        this.sectionTotalTexts[i].setVisible(shouldShow && hasCompletedTime);

        if (!shouldShow) {
          continue;
        }

        const val = sectionTimesArray[i];
        this.sectionTimeTexts[i].setText(this.formatTimeValue(val));

        const tVal = sectionTetrisesArray[i];
        if (this.sectionTallyTexts && this.sectionTallyTexts[i]) {
          const tallyText =
            typeof tVal === "number" && tVal > 0 ? "x".repeat(Math.min(tVal, 6)) : "";
          this.sectionTallyTexts[i].setText(tallyText);
        }
        if (this.sectionPerfTexts && this.sectionPerfTexts[i]) {
          const perf =
            Array.isArray(this.sectionPerformance) && this.sectionPerformance[i]
              ? this.sectionPerformance[i]
              : "";
          this.sectionPerfTexts[i].setText(perf);
          this.sectionPerfTexts[i].setColor(perf === "COOL" ? "#ffff55" : "#ff7777");
        }

        if (hasCompletedTime) {
          if (isTgm3Mode) {
            // TGM3: right column shows per-section *70 split time, resetting each section
            this.sectionTotalTexts[i].setText(this.formatTimeValue(splitTime));
          } else {
            runningTotal += splitTime || 0;
            this.sectionTotalTexts[i].setText(this.formatTimeValue(runningTotal));
          }
        }
      }

      if (this.halfTimeTexts && this.halfTimeTexts.length >= 2) {
        const firstHalf = sectionTimesArray
          .slice(0, 5)
          .reduce((sum, t) => (t !== null && t !== undefined ? sum + t : sum), 0);
        const secondHalf = sectionTimesArray
          .slice(5)
          .reduce((sum, t) => (t !== null && t !== undefined ? sum + t : sum), 0);

        this.halfTimeTexts[0].time.setText(this.formatTimeValue(firstHalf || 0));
        this.halfTimeTexts[1].time.setText(this.formatTimeValue(secondHalf || 0));

        const showSecondHalf = displayedCurrentSection >= 5;
        this.halfTimeTexts[1].label.setVisible(showSecondHalf);
        this.halfTimeTexts[1].time.setVisible(showSecondHalf);
      }
    }

    // Draw NEXT label - positioned to the right of border
    const nextX = this.borderOffsetX + this.cellSize * this.board.cols + 20;
    const nextY = this.borderOffsetY;
    const nextFontSize = Math.max(
      16,
      Math.min(24, Math.floor(this.cellSize * 0.8)),
    );

    const nextLabel = this.add.text(nextX, nextY, "NEXT", {
      fontSize: `${nextFontSize}px`,
      fill: "#fff",
      fontFamily: "Courier New",
      fontStyle: "bold",
    });
    this.gameGroup.add(nextLabel);

    // Draw multiple next pieces based on mode configuration
    const maxNextPieces = this.nextPiecesCount || 1;
    const previewCellSize = Math.max(8, Math.floor(this.cellSize * 0.6)); // Smaller preview pieces
    let queuedPowerupType = null;
    for (let i = 0; i < Math.min(maxNextPieces, this.nextPieces.length); i++) {
      // Sanitize preview type to avoid undefined rotations
      const rawNext = this.nextPieces[i];
      let previewType =
        typeof rawNext === "string"
          ? rawNext
          : typeof rawNext?.type === "string"
            ? rawNext.type
            : typeof rawNext?.piece === "string"
              ? rawNext.piece
              : rawNext;
      if (typeof previewType !== "string") {
        previewType = "I";
      }

      // Detect queued powerup (if raw object carries powerupType)
      if (!queuedPowerupType && rawNext && typeof rawNext === "object" && rawNext.powerupType) {
        queuedPowerupType = rawNext.powerupType;
      }

      const previewTextureKey =
        rawNext && typeof rawNext === "object" && rawNext.textureKey
          ? rawNext.textureKey
          : this.rotationSystem === "ARS"
            ? "mino_ars"
            : "mino_srs";
      const nextPiece = new Piece(previewType, this.rotationSystem, 0, previewTextureKey);
      // Use matrix-relative positioning like the main game pieces
      nextPiece.x = 0;
      nextPiece.y = 2; // Start from the top visible row
      // Position the next piece area to the right of the playfield
      const nextAreaOffsetX =
        this.borderOffsetX + this.cellSize * this.board.cols + 20;
      const nextAreaOffsetY =
        this.borderOffsetY + 30 + i * (previewCellSize * 3 + 4); // Closer spacing
      nextPiece.draw(this, nextAreaOffsetX, nextAreaOffsetY, previewCellSize);
    }

    // Update powerup status text based on next queue if not already showing active
    if (!this.pendingPowerup && this.powerupStatusText) {
      if (queuedPowerupType) {
        this.powerupStatusText.setText(
          queuedPowerupType === "free_fall"
            ? "POWERUP: FREE FALL"
            : queuedPowerupType === "del_even"
              ? "POWERUP: DEL EVEN"
              : ""
        );
      } else if (!this.activePowerupType) {
        this.powerupStatusText.setText("");
      }
    }

    // Draw HOLD label and piece for modes that support hold
    if (this.holdEnabled) {
      const holdX = this.borderOffsetX - 80;
      const holdY = this.borderOffsetY;
      const holdFontSize = Math.max(
        16,
        Math.min(24, Math.floor(this.cellSize * 0.8)),
      );

      const holdLabel = this.add.text(holdX, holdY, "HOLD", {
        fontSize: `${holdFontSize}px`,
        fill: "#fff",
        fontFamily: "Courier New",
        fontStyle: "bold",
      });
      this.gameGroup.add(holdLabel);

      // Draw hold piece with same size as preview pieces
      if (this.holdPiece) {
        const previewCellSize = Math.max(8, Math.floor(this.cellSize * 0.6));
        // Create a copy of the hold piece with default rotation for display
        let holdType =
          typeof this.holdPiece.type === "string" ? this.holdPiece.type : "I";
        const displayPiece = new Piece(holdType, this.holdPiece.rotationSystem, 0, this.holdPiece.textureKey || null);
        displayPiece.x = 0;
        displayPiece.y = 2; // Start from the top visible row
        displayPiece.draw(this, holdX, holdY + 30, previewCellSize);
      }
    }



    // Add playfield border to game group (already created above)
    this.gameGroup.add(this.playfieldBorder);

    // Draw pause overlay - centered on screen
    if (this.isPaused) {
      const overlay = this.add.rectangle(
        this.windowWidth / 2,
        this.windowHeight / 2,
        this.windowWidth,
        this.windowHeight,
        0x000000,
        0.8,
      );
      overlay.setDepth(1000000);
      const pauseFontSize = Math.max(
        48,
        Math.min(72, Math.floor(this.cellSize * 2.4)),
      );
      const pauseText = this.add
        .text(this.windowWidth / 2, this.windowHeight / 2 - 50, "PAUSED", {
          fontSize: `${pauseFontSize}px`,
          fill: "#ffff00",
          stroke: "#000",
          strokeThickness: 2,
          fontFamily: "Courier New",
          fontStyle: "bold",
        })
        .setOrigin(0.5);
      pauseText.setDepth(1000001);
      const resumeFontSize = Math.max(
        16,
        Math.min(28, Math.floor(this.cellSize * 0.9)),
      );
      const resumeText = this.add
        .text(
          this.windowWidth / 2,
          this.windowHeight / 2 + 50,
          "Press ESC to resume",
          {
            fontSize: `${resumeFontSize}px`,
            fill: "#fff",
            fontFamily: "Courier New",
            fontStyle: "normal",
          },
        )
        .setOrigin(0.5);
      resumeText.setDepth(1000001);
      const menuText = this.add
        .text(
          this.windowWidth / 2,
          this.windowHeight / 2 + 90,
          "Press M to return to menu",
          {
            fontSize: `${resumeFontSize - 4}px`,
            fill: "#ffcccc",
            fontFamily: "Courier New",
            fontStyle: "normal",
          },
        )
        .setOrigin(0.5);
      menuText.setDepth(1000001);
      this.gameGroup.add(overlay);
      this.gameGroup.add(pauseText);
      this.gameGroup.add(resumeText);
      this.gameGroup.add(menuText);
    }

    // Draw game over text - centered on screen (only after 3 seconds)
    // Skip in Zen to avoid overlay
    if (this.showGameOverText && !(this.isZenSandboxActive && this.isZenSandboxActive())) {
      const gameOverFontSize = Math.max(
        48,
        Math.min(72, Math.floor(this.cellSize * 1.5)),
      );

      const centerY = this.windowHeight / 2;
      const centerX = this.windowWidth / 2;

      const gameOverText = this.add
        .text(centerX, centerY, this.gameOverMessage || "GAME OVER", {
          fontSize: `${gameOverFontSize}px`,
          fill: this.sprintCompleted ? "#00ff88" : "#ff0000",
          stroke: "#000",
          strokeThickness: 6,
          fontFamily: "Courier New",
          fontStyle: "bold",
        })
        .setOrigin(0.5);
      this.gameGroup.add(gameOverText);
    }
  }
}

// ---------------------------------------------------------------------------
// MatchmakingScene — Queue UI, rating display, opponent info
// ---------------------------------------------------------------------------
class MatchmakingScene extends Phaser.Scene {
  constructor() {
    super({ key: "MatchmakingScene" });
    this.networkManager = null;
    this.queueType = null;
    this.searchingText = null;
    this.waitTimer = 0;
    this.dots = 0;
  }

  init(data) {
    this.queueType = data.queueType || "guideline";
    this.serverUrl = data.serverUrl || "ws://localhost:8080";
  }

  create() {
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    // Background
    this.cameras.main.setBackgroundColor("#000000");

    // Title
    this.add
      .text(centerX, 60, "VERSUS — MATCHMAKING", {
        fontSize: "32px",
        fill: "#ffcc00",
        fontFamily: "Courier New",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    // Initialize NetworkManager
    if (!window.__minoNetworkManager) {
      window.__minoNetworkManager = new NetworkManager();
    }
    this.networkManager = window.__minoNetworkManager;

    // Player ID (persisted in localStorage)
    let playerId = localStorage.getItem("mino_player_id");
    if (!playerId) {
      playerId = "p_" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
      localStorage.setItem("mino_player_id", playerId);
    }
    let playerName = localStorage.getItem("mino_player_name") || "Player";

    // Rating display
    this.ratingText = this.add
      .text(centerX, 120, "Rating: ...", {
        fontSize: "20px",
        fill: "#ffffff",
        fontFamily: "Courier New",
      })
      .setOrigin(0.5);

    this.statsText = this.add
      .text(centerX, 150, "", {
        fontSize: "16px",
        fill: "#888888",
        fontFamily: "Courier New",
      })
      .setOrigin(0.5);

    // Queue type label
    const queueLabel = this.queueType === "tgm" ? "TGM Versus" : "Guideline Versus";
    this.add
      .text(centerX, 200, `Queue: ${queueLabel}`, {
        fontSize: "22px",
        fill: "#00ffff",
        fontFamily: "Courier New",
      })
      .setOrigin(0.5);

    // Searching text
    this.searchingText = this.add
      .text(centerX, centerY, "Searching for opponent...", {
        fontSize: "24px",
        fill: "#ffff00",
        fontFamily: "Courier New",
      })
      .setOrigin(0.5);

    this.waitTimeText = this.add
      .text(centerX, centerY + 40, "0s", {
        fontSize: "16px",
        fill: "#666666",
        fontFamily: "Courier New",
      })
      .setOrigin(0.5);

    // Cancel button
    const cancelBtn = this.add
      .text(centerX, centerY + 100, "[ CANCEL ]", {
        fontSize: "20px",
        fill: "#ff4444",
        fontFamily: "Courier New",
        fontStyle: "bold",
      })
      .setOrigin(0.5)
      .setInteractive();

    cancelBtn.on("pointerdown", () => {
      this.networkManager.cancelQueue();
      this.networkManager.disconnect();
      this.scene.start("MenuScene");
    });
    cancelBtn.on("pointerover", () => cancelBtn.setStyle({ fill: "#ff8888" }));
    cancelBtn.on("pointerout", () => cancelBtn.setStyle({ fill: "#ff4444" }));

    // Keyboard cancel
    this.input.keyboard.on("keydown-ESC", () => {
      this.networkManager.cancelQueue();
      this.networkManager.disconnect();
      this.scene.start("MenuScene");
    });

    // Network event handlers
    this.networkManager.on("identified", (data) => {
      this.ratingText.setText(
        data.provisional
          ? "Rating: ? (provisional)"
          : `Rating: ${data.rating}`
      );
      this.statsText.setText(`W: ${data.wins}  L: ${data.losses}  Games: ${data.gamesPlayed}`);
      // Join queue after identification
      this.networkManager.joinQueue(this.queueType);
    });

    this.networkManager.on("queued", () => {
      this.searchingText.setText("Searching for opponent...");
    });

    this.networkManager.on("match_found", (data) => {
      this.searchingText.setText(`Opponent found: ${data.opponent.name}`);
      // Transition to game after brief delay
      this.time.delayedCall(500, () => {
        const modeId = this.queueType === "tgm" ? "versus_tgm" : "versus_guideline";
        const modeManager = getModeManager();
        const mode = modeManager.getMode(modeId);

        // Store match data for GameScene
        window.__versusMatchData = {
          seed: data.seed,
          startTimestamp: data.startTimestamp,
          opponent: data.opponent,
          queueType: data.queueType,
          roomId: data.roomId,
        };

        const startLevelCap = typeof getStartingLevelCapForMode === "function"
          ? getStartingLevelCapForMode(mode)
          : 999;
        this.scene.start("AssetLoaderScene", {
          mode: modeId,
          gameMode: mode,
          startingLevel: 0,
        });
      });
    });

    this.networkManager.on("reconnect_failed", () => {
      this.searchingText.setText("Connection failed. Press ESC to return.");
      this.searchingText.setStyle({ fill: "#ff0000" });
    });

    // Connect and identify
    this.networkManager.connect(this.serverUrl);
    this.networkManager.identify(playerId, playerName);
  }

  update(time, delta) {
    this.waitTimer += delta / 1000;
    const secs = Math.floor(this.waitTimer);
    if (this.waitTimeText) {
      this.waitTimeText.setText(`${secs}s`);
    }
    // Animate dots
    this.dots = (this.dots + 1) % 120;
    const dotCount = Math.floor(this.dots / 30) + 1;
    if (this.searchingText && this.searchingText.text.startsWith("Searching")) {
      this.searchingText.setText("Searching for opponent" + ".".repeat(dotCount));
    }
  }
}

// ---------------------------------------------------------------------------
// VersusHUD — Opponent field preview, garbage queue, timer, connection status
// Drawn as an overlay on top of GameScene when in versus mode.
// ---------------------------------------------------------------------------
class VersusHUD {
  constructor(scene) {
    this.scene = scene;
    this.container = null;
    this.opponentGrid = [];
    this.garbageQueue = 0;
    this.garbageBar = null;
    this.latencyText = null;
    this.timerText = null;
    this.opponentNameText = null;
    this.connectionDot = null;
  }

  create() {
    const scene = this.scene;
    const cam = scene.cameras.main;
    const x = cam.width - 180;
    const y = 40;

    this.container = scene.add.container(x, y);

    // Opponent name
    const matchData = window.__versusMatchData;
    const oppName = matchData?.opponent?.name || "Opponent";
    this.opponentNameText = scene.add
      .text(0, 0, oppName, {
        fontSize: "14px",
        fill: "#ffcc00",
        fontFamily: "Courier New",
        fontStyle: "bold",
      })
      .setOrigin(0);
    this.container.add(this.opponentNameText);

    // Mini playfield (10x20 grid, each cell 6px)
    const cellSize = 6;
    const gridX = 0;
    const gridY = 20;
    this.miniGraphics = scene.add.graphics();
    this.container.add(this.miniGraphics);
    this.miniGridX = gridX;
    this.miniGridY = gridY;
    this.miniCellSize = cellSize;

    // Draw empty grid border
    this.miniGraphics.lineStyle(1, 0x444444);
    this.miniGraphics.strokeRect(gridX, gridY, cellSize * 10, cellSize * 20);

    // Garbage bar (right of mini field)
    this.garbageGraphics = scene.add.graphics();
    this.container.add(this.garbageGraphics);
    this.garbageBarX = gridX + cellSize * 10 + 4;
    this.garbageBarY = gridY;
    this.garbageBarHeight = cellSize * 20;

    // Connection latency
    this.latencyText = scene.add
      .text(0, gridY + cellSize * 20 + 8, "-- ms", {
        fontSize: "11px",
        fill: "#666666",
        fontFamily: "Courier New",
      })
      .setOrigin(0);
    this.container.add(this.latencyText);

    // Connection dot
    this.connectionDot = scene.add.graphics();
    this.container.add(this.connectionDot);
    this.updateConnectionDot(true);

    // Timer (for TGM mode)
    this.timerText = scene.add
      .text(0, gridY + cellSize * 20 + 24, "", {
        fontSize: "14px",
        fill: "#ffffff",
        fontFamily: "Courier New",
        fontStyle: "bold",
      })
      .setOrigin(0);
    this.container.add(this.timerText);

    // Opponent rating
    const oppRating = matchData?.opponent?.provisional
      ? "?"
      : (matchData?.opponent?.rating || "?");
    this.oppRatingText = scene.add
      .text(80, 0, `[${oppRating}]`, {
        fontSize: "12px",
        fill: "#888888",
        fontFamily: "Courier New",
      })
      .setOrigin(0);
    this.container.add(this.oppRatingText);

    this.container.setDepth(1000);
  }

  updateOpponentBoard(boardData) {
    if (!this.miniGraphics || !boardData) return;
    this.miniGraphics.clear();

    const cs = this.miniCellSize;
    const ox = this.miniGridX;
    const oy = this.miniGridY;

    // Draw border
    this.miniGraphics.lineStyle(1, 0x444444);
    this.miniGraphics.strokeRect(ox, oy, cs * 10, cs * 20);

    // Draw filled cells
    for (let r = 0; r < 20 && r < boardData.length; r++) {
      const row = boardData[r];
      if (!row) continue;
      for (let c = 0; c < 10 && c < row.length; c++) {
        if (row[c] !== 0) {
          this.miniGraphics.fillStyle(0xaaaaaa, 0.8);
          this.miniGraphics.fillRect(ox + c * cs, oy + r * cs, cs - 1, cs - 1);
        }
      }
    }
  }

  updateGarbageQueue(count) {
    this.garbageQueue = count;
    if (!this.garbageGraphics) return;
    this.garbageGraphics.clear();

    const maxRows = 20;
    const barWidth = 6;
    const filledRows = Math.min(count, maxRows);
    const cs = this.miniCellSize;

    // Draw bar background
    this.garbageGraphics.fillStyle(0x222222, 1);
    this.garbageGraphics.fillRect(
      this.garbageBarX, this.garbageBarY, barWidth, this.garbageBarHeight
    );

    // Draw filled portion (from bottom)
    if (filledRows > 0) {
      const fillHeight = filledRows * cs;
      this.garbageGraphics.fillStyle(0xff0000, 0.8);
      this.garbageGraphics.fillRect(
        this.garbageBarX,
        this.garbageBarY + this.garbageBarHeight - fillHeight,
        barWidth,
        fillHeight
      );
    }
  }

  updateLatency(ms) {
    if (!this.latencyText) return;
    const color = ms < 50 ? "#00ff00" : ms < 100 ? "#ffff00" : "#ff0000";
    this.latencyText.setText(`${ms}ms`);
    this.latencyText.setStyle({ fill: color, fontSize: "11px", fontFamily: "Courier New" });
  }

  updateTimer(remainingSeconds) {
    if (!this.timerText) return;
    if (remainingSeconds <= 0) {
      this.timerText.setText("TIME!");
      this.timerText.setStyle({ fill: "#ff0000", fontSize: "14px", fontFamily: "Courier New", fontStyle: "bold" });
    } else {
      const min = Math.floor(remainingSeconds / 60);
      const sec = Math.floor(remainingSeconds % 60);
      this.timerText.setText(`${min}:${sec.toString().padStart(2, "0")}`);
      const color = remainingSeconds <= 30 ? "#ff4444" : "#ffffff";
      this.timerText.setStyle({ fill: color, fontSize: "14px", fontFamily: "Courier New", fontStyle: "bold" });
    }
  }

  updateConnectionDot(connected) {
    if (!this.connectionDot) return;
    this.connectionDot.clear();
    this.connectionDot.fillStyle(connected ? 0x00ff00 : 0xff0000, 1);
    this.connectionDot.fillCircle(150, 6, 4);
  }

  destroy() {
    if (this.container) {
      this.container.destroy(true);
      this.container = null;
    }
  }
}

// ---------------------------------------------------------------------------
// Versus integration helpers for GameScene
// ---------------------------------------------------------------------------
function initVersusMode(gameScene) {
  const matchData = window.__versusMatchData;
  if (!matchData) return;

  const nm = window.__minoNetworkManager;
  if (!nm) return;

  gameScene.networkManager = nm;
  gameScene.versusActive = true;
  gameScene.versusGarbageQueue = 0;
  gameScene.versusSeed = matchData.seed;

  // Create VersusHUD
  gameScene.versusHUD = new VersusHUD(gameScene);
  gameScene.versusHUD.create();

  // Board update interval (send compressed board to opponent every 500ms)
  gameScene.versusBoardTimer = 0;

  // Network event listeners for GameScene
  nm.on("garbage_incoming", (data) => {
    gameScene.versusGarbageQueue += data.rows;
    if (gameScene.versusHUD) {
      gameScene.versusHUD.updateGarbageQueue(gameScene.versusGarbageQueue);
    }
  });

  nm.on("opponent_board_update", (board) => {
    if (gameScene.versusHUD) {
      gameScene.versusHUD.updateOpponentBoard(board);
    }
  });

  nm.on("latency", (ms) => {
    if (gameScene.versusHUD) {
      gameScene.versusHUD.updateLatency(ms);
    }
  });

  nm.on("opponent_disconnected", () => {
    if (gameScene.versusHUD) {
      gameScene.versusHUD.updateConnectionDot(false);
    }
  });

  nm.on("opponent_reconnected", () => {
    if (gameScene.versusHUD) {
      gameScene.versusHUD.updateConnectionDot(true);
    }
  });

  nm.on("request_checksum", () => {
    if (gameScene.board && gameScene.board.grid) {
      const checksum = computeBoardChecksum(gameScene.board.grid);
      nm.sendBoardChecksum(checksum);
    }
  });

  nm.on("match_end", (data) => {
    gameScene.versusMatchResult = data;
    showVersusResult(gameScene, data);
  });

  // Clear match data so it doesn't persist
  window.__versusMatchData = null;
}

function updateVersusMode(gameScene, deltaTime) {
  if (!gameScene.versusActive || !gameScene.networkManager) return;

  // Apply queued garbage
  if (gameScene.versusGarbageQueue > 0 && !gameScene.lineClearDelayActive) {
    const rows = gameScene.versusGarbageQueue;
    gameScene.versusGarbageQueue = 0;
    if (gameScene.board) {
      gameScene.board.addCheeseRows(rows, 50);
    }
    if (gameScene.versusHUD) {
      gameScene.versusHUD.updateGarbageQueue(0);
    }
  }

  // Periodic board updates to opponent
  gameScene.versusBoardTimer = (gameScene.versusBoardTimer || 0) + deltaTime;
  if (gameScene.versusBoardTimer >= 0.5) {
    gameScene.versusBoardTimer = 0;
    if (gameScene.board && gameScene.board.grid) {
      // Send bottom 20 rows
      const grid = gameScene.board.grid;
      const visible = grid.slice(Math.max(0, grid.length - 20));
      const compressed = visible.map((row) => row.map((c) => (c !== 0 ? 1 : 0)));
      gameScene.networkManager.sendBoardUpdate(compressed);
    }
  }

  // Update TGM timer display
  if (
    gameScene.versusHUD &&
    gameScene.gameMode &&
    typeof gameScene.gameMode.getRemainingTime === "function"
  ) {
    gameScene.versusHUD.updateTimer(gameScene.gameMode.getRemainingTime());
  }
}

function computeBoardChecksum(grid) {
  let hash = 0;
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      hash = ((hash << 5) - hash + (grid[r][c] !== 0 ? 1 : 0)) | 0;
    }
  }
  return hash;
}

function showVersusResult(gameScene, data) {
  const centerX = gameScene.cameras.main.width / 2;
  const centerY = gameScene.cameras.main.height / 2;

  const won = data.winnerId === gameScene.networkManager?.playerId;
  const resultText = won ? "YOU WIN!" : "YOU LOSE";
  const resultColor = won ? "#00ff88" : "#ff4444";

  // Overlay background
  const overlay = gameScene.add.graphics();
  overlay.fillStyle(0x000000, 0.7);
  overlay.fillRect(0, 0, gameScene.cameras.main.width, gameScene.cameras.main.height);
  overlay.setDepth(2000);

  gameScene.add
    .text(centerX, centerY - 60, resultText, {
      fontSize: "48px",
      fill: resultColor,
      fontFamily: "Courier New",
      fontStyle: "bold",
      stroke: "#000",
      strokeThickness: 4,
    })
    .setOrigin(0.5)
    .setDepth(2001);

  const deltaStr = data.ratingDelta >= 0 ? `+${data.ratingDelta}` : `${data.ratingDelta}`;
  const ratingLine = data.provisional
    ? `Rating: ? (provisional) (${deltaStr})`
    : `Rating: ${data.newRating} (${deltaStr})`;

  gameScene.add
    .text(centerX, centerY, ratingLine, {
      fontSize: "20px",
      fill: "#ffffff",
      fontFamily: "Courier New",
    })
    .setOrigin(0.5)
    .setDepth(2001);

  const reasonMap = { topout: "Top Out", disconnect: "Disconnect", time_expired: "Time Up" };
  gameScene.add
    .text(centerX, centerY + 35, `Reason: ${reasonMap[data.reason] || data.reason}`, {
      fontSize: "16px",
      fill: "#888888",
      fontFamily: "Courier New",
    })
    .setOrigin(0.5)
    .setDepth(2001);

  // Return to menu button
  const menuBtn = gameScene.add
    .text(centerX, centerY + 90, "[ RETURN TO MENU ]", {
      fontSize: "20px",
      fill: "#00ffff",
      fontFamily: "Courier New",
      fontStyle: "bold",
    })
    .setOrigin(0.5)
    .setInteractive()
    .setDepth(2001);

  menuBtn.on("pointerdown", () => {
    gameScene.scene.start("MenuScene");
  });
  menuBtn.on("pointerover", () => menuBtn.setStyle({ fill: "#ffffff" }));
  menuBtn.on("pointerout", () => menuBtn.setStyle({ fill: "#00ffff" }));

  // Keyboard: Enter to return
  gameScene.input.keyboard.once("keydown-ENTER", () => {
    gameScene.scene.start("MenuScene");
  });
}

// Initialize game after all classes are defined
const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  parent: "game-container",
  // Improve text sharpness on high-DPI displays
  resolution: window.devicePixelRatio || 1,
  scene: [
    MenuScene,
    SettingsScene,
    MatchmakingScene,
    AssetLoaderScene,
    LoadingScreenScene,
    GameScene,
  ],
  backgroundColor: "#000000",
  fps: 60,
  render: {
    antialias: false,
    pixelArt: true,
    roundPixels: true,
    desynchronized: false,
    powerPreference: "high-performance",
    clearBeforeRender: true,
  },
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
};

const existingGame = window.__minoGame;
if (existingGame && typeof existingGame.destroy === "function") {
  try {
    existingGame.destroy(true);
  } catch (e) {
  }
  window.__minoGame = null;
}

const gameContainer = document.getElementById("game-container");
if (gameContainer) {
  while (gameContainer.firstChild) {
    gameContainer.removeChild(gameContainer.firstChild);
  }
}

const game = new Phaser.Game(config);
window.__minoGame = game;

// Limit frame rate to 60fps
game.loop.maxFps = 60;

// Handle window resize
if (window.__minoResizeHandler) {
  window.removeEventListener("resize", window.__minoResizeHandler);
}

window.__minoResizeHandler = () => {
  const activeGame = window.__minoGame;
  if (!activeGame || !activeGame.scale) return;

  activeGame.scale.resize(window.innerWidth, window.innerHeight);
  if (activeGame.scene.scenes.length > 0) {
    const scene = activeGame.scene.scenes[0];
    if (scene && scene.calculateLayout) {
      scene.calculateLayout();
      if (scene.setupUI) {
        scene.setupUI();
      }
    }
  }
  // Ensure the game is resized correctly on window resize
  window.addEventListener("resize", resizeGame);
};
window.addEventListener("resize", window.__minoResizeHandler);
