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

