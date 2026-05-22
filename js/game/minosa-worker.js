let minosaInstance = null;
let minosaLoaded = false;

function ensureMinosaLoaded() {
  if (minosaLoaded) return;
  importScripts("./Minosa.js");
  minosaLoaded = true;
}

function ensureMinosaInstance() {
  ensureMinosaLoaded();
  if (!minosaInstance) {
    minosaInstance =
      typeof getMinosaInstance === "function"
        ? getMinosaInstance()
        : typeof Minosa !== "undefined"
          ? Minosa.getSharedInstance()
          : null;
  }
  return minosaInstance;
}

self.onmessage = (event) => {
  const data = event?.data || {};

  if (data.type === "init") {
    try {
      if (data.tetrominoes) {
        self.TETROMINOES = data.tetrominoes;
      }
      if (data.segaRotations) {
        self.SEGA_ROTATIONS = data.segaRotations;
      }
      ensureMinosaInstance();
      self.postMessage({ type: "ready" });
    } catch (error) {
      self.postMessage({
        type: "ready",
        error: error?.message || String(error),
      });
    }
    return;
  }

  if (data.type !== "evaluate_turn") return;

  try {
    const minosa = ensureMinosaInstance();
    const result =
      minosa && typeof minosa.evaluateVersusTurn === "function"
        ? minosa.evaluateVersusTurn(data.options || {})
        : null;
    self.postMessage({
      type: "evaluate_turn_result",
      requestId: data.requestId,
      result,
    });
  } catch (error) {
    self.postMessage({
      type: "evaluate_turn_result",
      requestId: data.requestId,
      error: error?.message || String(error),
    });
  }
};
