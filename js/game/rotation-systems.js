(function (global) {
  function cloneMatrix(matrix) {
    return matrix.map((row) => [...row]);
  }

  function getGlobal(name) {
    if (typeof global[name] !== "undefined") return global[name];
    try {
      return globalThis[name];
    } catch {
      return undefined;
    }
  }

  const systems = {
    SRS: {
      id: "SRS",
      label: "SRS",
      family: "SRS",
      legacy: true,
      get pieces() {
        return getGlobal("TETROMINOES") || {};
      },
      get colors() {
        return null;
      },
      get kicks() {
        return getGlobal("SRS_KICKS") || {};
      },
      textureKey: "mino_srs",
      monoTextureKey: "mono",
    },
    "SRS-X": {
      id: "SRS-X",
      label: "SRS-X",
      family: "SRS",
      get pieces() {
        return getGlobal("TETROMINOES") || {};
      },
      get colors() {
        return null;
      },
      get kicks() {
        return getGlobal("SRS_KICKS") || {};
      },
      textureKey: "mino_srs",
      monoTextureKey: "mono",
    },
    ARS: {
      id: "ARS",
      label: "ARS",
      family: "ARS",
      legacy: true,
      get pieces() {
        return getGlobal("SEGA_ROTATIONS") || {};
      },
      get colors() {
        return getGlobal("ARS_COLORS") || {};
      },
      get kicks() {
        return getGlobal("ARS_KICKS") || {};
      },
      textureKey: "mino_ars",
      monoTextureKey: "mono_ars",
    },
    DRS: {
      id: "DRS",
      label: "DRS",
      family: "ARS",
      get pieces() {
        return getGlobal("SEGA_ROTATIONS") || {};
      },
      get colors() {
        return getGlobal("ARS_COLORS") || {};
      },
      get kicks() {
        return getGlobal("ARS_KICKS") || {};
      },
      textureKey: "mino_ars",
      monoTextureKey: "mono_ars",
    },
  };

  const SRSX_180_KICKS = {
    JLSTZ_180: [
      [[0, 0], [0, 1], [1, 1], [-1, 1], [1, 0], [-1, 0], [0, -1], [1, -1], [-1, -1]],
      [[0, 0], [1, 0], [1, 1], [1, 2], [0, 1], [0, 2], [-1, 1], [-1, 2], [-1, 0]],
      [[0, 0], [0, -1], [-1, -1], [1, -1], [-1, 0], [1, 0], [0, 1], [-1, 1], [1, 1]],
      [[0, 0], [-1, 0], [-1, 1], [-1, 2], [0, 1], [0, 2], [1, 1], [1, 2], [1, 0]],
    ],
    I_180: [
      [[0, 0], [0, 1], [0, -1], [2, 0], [-2, 0], [1, 0], [-1, 0], [2, 1], [-2, 1], [1, 1], [-1, 1]],
      [[0, 0], [1, 0], [-1, 0], [0, 2], [0, -2], [1, 1], [-1, 1], [1, -1], [-1, -1]],
      [[0, 0], [0, -1], [0, 1], [-2, 0], [2, 0], [-1, 0], [1, 0], [-2, -1], [2, -1], [-1, -1], [1, -1]],
      [[0, 0], [-1, 0], [1, 0], [0, 2], [0, -2], [-1, 1], [1, 1], [-1, -1], [1, -1]],
    ],
  };

  const BASIC_180_KICKS = [
    [[0, 0]],
    [[0, 0]],
    [[0, 0]],
    [[0, 0]],
  ];

  const DRS_KICKS = {
    RIGHT: [
      [[0, 0], [1, 0], [-1, 0], [0, 1], [1, 1], [-1, 1]],
      [[0, 0], [1, 0], [-1, 0], [0, 1], [1, 1], [-1, 1]],
      [[0, 0], [1, 0], [-1, 0], [0, 1], [1, 1], [-1, 1]],
      [[0, 0], [1, 0], [-1, 0], [0, 1], [1, 1], [-1, 1]],
    ],
    LEFT: [
      [[0, 0], [-1, 0], [1, 0], [0, 1], [-1, 1], [1, 1]],
      [[0, 0], [-1, 0], [1, 0], [0, 1], [-1, 1], [1, 1]],
      [[0, 0], [-1, 0], [1, 0], [0, 1], [-1, 1], [1, 1]],
      [[0, 0], [-1, 0], [1, 0], [0, 1], [-1, 1], [1, 1]],
    ],
  };

  function resolveKickTable(kickTable, fromRotation, toRotation) {
    if (!Array.isArray(kickTable)) return null;
    if (Array.isArray(kickTable[fromRotation])) return kickTable[fromRotation];
    return kickTable[`${fromRotation}>${toRotation}`] || null;
  }

  function tryKick(piece, board, newShape, newRotation, kickTable) {
    const table = resolveKickTable(kickTable, piece.rotation, newRotation);
    if (!Array.isArray(table)) return false;
    for (let i = 0; i < table.length; i++) {
      const kick = table[i];
      const newX = piece.x + kick[0];
      const newY = piece.y + kick[1];
      if (board.isValidPosition({ shape: newShape }, newX, newY)) {
        piece.x = newX;
        piece.y = newY;
        piece.shape = cloneMatrix(newShape);
        piece.rotation = newRotation;
        return true;
      }
    }
    return false;
  }

  const RotationSystems = {
    list() {
      return Object.values(systems)
        .filter((system) => !system.legacy)
        .map(({ id, label, textureKey, monoTextureKey }) => ({
          id,
          label,
          textureKey,
          monoTextureKey,
        }));
    },

    normalize(system) {
      const value = typeof system === "string" ? system.toUpperCase() : "SRS";
      if (value === "SRS" || value === "SRSX" || value === "SRS_X") return "SRS-X";
      if (value === "ARS" || value === "TGM" || value === "CLASSIC") return "DRS";
      return systems[value] && !systems[value].legacy ? value : "SRS-X";
    },

    get(system = "SRS") {
      return systems[this.normalize(system)] || systems["SRS-X"];
    },

    getPieceDefinition(type, system = "SRS") {
      return this.get(system).pieces?.[type] || systems["SRS-X"].pieces?.[type] || null;
    },

    getRotations(type, system = "SRS") {
      return this.getPieceDefinition(type, system)?.rotations || [];
    },

    getColor(type, system = "SRS") {
      const config = this.get(system);
      return config.colors?.[type] || config.pieces?.[type]?.color || systems["SRS-X"].pieces?.[type]?.color || 0xffffff;
    },

    getTextureKey(system = "SRS", monochrome = false) {
      const config = this.get(system);
      return monochrome ? config.monoTextureKey : config.textureKey;
    },

    isArsFamily(system = "SRS") {
      return this.get(system).family === "ARS";
    },

    isSrsFamily(system = "SRS") {
      return this.get(system).family === "SRS";
    },

    getKickTable(type, system = "SRS", direction = 1) {
      const normalized = this.normalize(system);
      const kicks = this.get(normalized).kicks;
      if (normalized === "DRS") {
        return direction === 1 ? DRS_KICKS.RIGHT : DRS_KICKS.LEFT;
      }
      if (normalized === "SRS-X" && Math.abs(direction) === 2) {
        return type === "I" ? SRSX_180_KICKS.I_180 : SRSX_180_KICKS.JLSTZ_180;
      }
      if (Math.abs(direction) === 2) return BASIC_180_KICKS;
      const isCW = direction === 1;
      if (normalized === "ARS") {
        if (type === "I") return isCW ? kicks.I_CW : kicks.I_CCW;
        if (type === "T" && kicks.T_CW && kicks.T_CCW) return isCW ? kicks.T_CW : kicks.T_CCW;
        return isCW ? kicks.JLSZ_CW || kicks.JLSTZ_CW : kicks.JLSZ_CCW || kicks.JLSTZ_CCW;
      }
      if (type === "I") return isCW ? kicks.I_CW : kicks.I_CCW;
      return isCW ? kicks.JLSTZ_CW : kicks.JLSTZ_CCW;
    },

    rotatePiece(piece, board, direction, system = piece?.rotationSystem || "SRS") {
      if (!piece || !board) return false;
      const normalized = this.normalize(system);
      const rotations = this.getRotations(piece.type, normalized);
      if (!rotations.length) return false;
      const rotationStates = rotations.length;
      const normalizedDirection =
        Math.abs(direction) === 2 ? 2 : direction > 0 ? 1 : -1;
      const newRotation = (piece.rotation + normalizedDirection + rotationStates) % rotationStates;
      const newShape = rotations[newRotation];

      if (piece.type === "O") {
        if (board.isValidPosition({ shape: newShape }, piece.x, piece.y)) {
          piece.shape = cloneMatrix(newShape);
          piece.rotation = newRotation;
          return true;
        }
        return false;
      }

      return tryKick(piece, board, newShape, newRotation, this.getKickTable(piece.type, normalized, normalizedDirection));
    },
  };

  global.RotationSystems = RotationSystems;

  if (typeof module !== "undefined" && module.exports) {
    module.exports = RotationSystems;
  }
})(typeof window !== "undefined" ? window : globalThis);
