(function (global) {
  const PIECES = Object.freeze(["I", "J", "L", "O", "S", "T", "Z"]);

  function clonePieces() {
    return [...PIECES];
  }

  function shuffleArray(values) {
    for (let i = values.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [values[i], values[j]] = [values[j], values[i]];
    }
    return values;
  }

  function createShuffledBag() {
    return shuffleArray(clonePieces());
  }

  function ensureRuntime(target, id) {
    const runtime = target || {};
    if (!Array.isArray(runtime.bagQueue)) runtime.bagQueue = [];
    if (!runtime.bagType) runtime.bagType = id;
    return runtime;
  }

  function updateHistory(scene, piece) {
    if (!Array.isArray(scene.pieceHistory)) scene.pieceHistory = ["Z", "Z", "S", "S"];
    scene.pieceHistory.shift();
    scene.pieceHistory.push(piece);
    if (scene.pieceHistory.length > 4) scene.pieceHistory = scene.pieceHistory.slice(-4);
  }

  const systems = {
    "7bag": {
      id: "7bag",
      label: "7-Bag",
      next(scene) {
        if (!Array.isArray(scene.bagQueue)) scene.bagQueue = [];
        if (scene.bagQueue.length === 0) {
          scene.bagQueue = createShuffledBag();
          scene.bagDrawCount = 0;
          scene.bagDebugSeen = new Set();
        }
        if (!(scene.bagDebugSeen instanceof Set)) scene.bagDebugSeen = new Set();
        const piece = scene.bagQueue.shift();
        scene.bagDrawCount = (scene.bagDrawCount || 0) + 1;
        scene.bagDebugSeen.add(piece);
        if (scene.bagDrawCount === 7) {
          if (scene.bagDebugSeen.size !== 7) {
            console.warn("[7-BAG DEBUG] Incomplete bag detected:", Array.from(scene.bagDebugSeen));
          }
          scene.bagDebugSeen = new Set();
          scene.bagDrawCount = 0;
        }
        return piece;
      },
    },
    "14bag": {
      id: "14bag",
      label: "14-Bag",
      next(runtime) {
        const state = ensureRuntime(runtime, "14bag");
        if (state.bagQueue.length === 0) state.bagQueue.push(...createShuffledBag(), ...createShuffledBag());
        return state.bagQueue.shift();
      },
    },
    "7plus1": {
      id: "7plus1",
      label: "7+1 Bag",
      next(runtime) {
        const state = ensureRuntime(runtime, "7plus1");
        if (state.bagQueue.length === 0) {
          state.bagQueue.push(...createShuffledBag(), PIECES[Math.floor(Math.random() * PIECES.length)]);
        }
        return state.bagQueue.shift();
      },
    },
    pairs: {
      id: "pairs",
      label: "Pairs",
      next(runtime) {
        const state = ensureRuntime(runtime, "pairs");
        const queue = Array.isArray(state.pairsQueue) ? state.pairsQueue : state.bagQueue;
        if (queue.length === 0) {
          const bag = createShuffledBag();
          for (let i = 0; i < bag.length; i += 2) {
            const a = bag[i];
            const b = bag[(i + 1) % bag.length];
            queue.push(a, b, b, a);
          }
        }
        if (Array.isArray(state.pairsQueue)) return state.pairsQueue.shift();
        return state.bagQueue.shift();
      },
    },
    classic: {
      id: "classic",
      label: "Classic",
      next(runtime) {
        const last = runtime.lastClassicPiece || null;
        const pool = PIECES.filter((piece) => piece !== last);
        const pick = pool[Math.floor(Math.random() * pool.length)];
        runtime.lastClassicPiece = pick;
        return pick;
      },
    },
    random: {
      id: "random",
      label: "Pure Random",
      next() {
        return PIECES[Math.floor(Math.random() * PIECES.length)];
      },
    },
    history: {
      id: "history",
      label: "History",
      next(scene) {
        let generatedPiece;
        let attempts = 0;
        if (scene.firstPiece) {
          const firstPieceTypes = ["I", "J", "L", "T"];
          generatedPiece = firstPieceTypes[Math.floor(Math.random() * firstPieceTypes.length)];
          scene.firstPiece = false;
        } else {
          if (!Array.isArray(scene.pieceHistory)) scene.pieceHistory = ["Z", "Z", "S", "S"];
          do {
            generatedPiece = PIECES[Math.floor(Math.random() * PIECES.length)];
            attempts++;
          } while (scene.pieceHistory.includes(generatedPiece) && attempts < 6);
        }
        updateHistory(scene, generatedPiece);
        return generatedPiece;
      },
    },
    tgm3: {
      id: "tgm3",
      label: "TGM3 35-Bag",
      next(scene) {
        if (!scene.tgm3DroughtCounters) {
          scene.tgm3DroughtCounters = {};
          PIECES.forEach((piece) => {
            scene.tgm3DroughtCounters[piece] = 0;
          });
        }
        if (!Array.isArray(scene.tgm3BagQueue)) scene.tgm3BagQueue = [];
        if (scene.tgm3BagQueue.length === 0) {
          const bag = [];
          for (let i = 0; i < 5; i++) bag.push(...PIECES);
          scene.tgm3BagQueue = shuffleArray(bag);
        }
        const piece = scene.tgm3BagQueue.shift();
        PIECES.forEach((candidate) => {
          scene.tgm3DroughtCounters[candidate] = (scene.tgm3DroughtCounters[candidate] || 0) + 1;
        });
        scene.tgm3DroughtCounters[piece] = 0;
        let max = -1;
        let droughtPiece = "I";
        PIECES.forEach((candidate) => {
          const drought = scene.tgm3DroughtCounters[candidate] || 0;
          if (drought > max || (drought === max && candidate < droughtPiece)) {
            max = drought;
            droughtPiece = candidate;
          }
        });
        scene.tgm3BagQueue.push(droughtPiece);
        return piece;
      },
    },
  };

  const aliases = {
    "7-bag": "7bag",
    "14-bag": "14bag",
    tgm1: "history",
  };

  const BagRandomizers = {
    PIECES,

    list() {
      return ["7bag", "14bag", "7plus1", "history", "random", "pairs", "classic", "tgm3"].map((id) => ({
        id,
        label: systems[id].label,
      }));
    },

    get(id) {
      return systems[this.normalize(id)] || systems["7bag"];
    },

    normalize(id) {
      const key = typeof id === "string" && id.trim() ? id.trim().toLowerCase() : "7bag";
      return systems[key] ? key : aliases[key] || "7bag";
    },

    createRuntime(id = "7bag") {
      return { bagQueue: [], bagType: this.normalize(id) };
    },

    createShuffledBag,

    next(target, id = target?.bagType || "7bag") {
      const normalized = this.normalize(id);
      return systems[normalized].next(target || {}, normalized);
    },
  };

  global.BagRandomizers = BagRandomizers;

  if (typeof module !== "undefined" && module.exports) {
    module.exports = BagRandomizers;
  }
})(typeof window !== "undefined" ? window : globalThis);
