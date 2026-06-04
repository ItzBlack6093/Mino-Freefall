// ---------------------------------------------------------------------------
// MR (Mino Rating) — global helper for client-side computation
// Asymptotically clamps from 0 to 40: MR = 40 * (1 - e^(-r / 1500))
// ---------------------------------------------------------------------------
function computeMRClient(glickoRating) {
  const r = Math.max(0, glickoRating);
  const mr = 40 * (1 - Math.exp(-r / 1500));
  return Math.round(mr * 100) / 100;
}

function getVersusMedalDisplay() {
  const summary =
    typeof window !== "undefined" && window.achievementSystem?.getRatingSummary
      ? window.achievementSystem.getRatingSummary()
      : null;
  const medal = summary?.medals?.versus;
  if (!medal) {
    return { label: "WHITE 0/1★", color: "#ffcc00", summary: null };
  }
  const cap = medal.cap === Infinity ? "" : `/${medal.cap}`;
  return {
    label: `${String(medal.tierLabel || "White").toUpperCase()} ${medal.stars}${cap}★`,
    color: medal.tierColor || "#ffcc00",
    summary
  };
}

function getDefaultVersusServerUrl() {
  if (typeof window !== "undefined" && typeof window.resolveMinoVersusServerUrl === "function") {
    return window.resolveMinoVersusServerUrl();
  }

  const desktopUrl =
    typeof window !== "undefined" ? window.minoDesktop?.versusServerUrl : null;
  return desktopUrl || "ws://localhost:8080";
}

const LOCAL_VERSUS_AI_STORAGE_KEY = "mino_local_versus_ai_ladder_v1";
const LOCAL_VERSUS_AI_PROFILE_COUNT = 40;
const LOCAL_VERSUS_AI_PROVISIONAL_MATCHES = 10;
const LOCAL_VERSUS_AI_WINS_TO_FINISH = 2;
const LOCAL_VERSUS_AI_PLAYER_ID = "local-player";
const LOCAL_VERSUS_AI_OPPONENT_ID = "local-minosa";
const LOCAL_VERSUS_AI_DEFAULT_RD = 350;
const LOCAL_VERSUS_AI_DEFAULT_VOLATILITY = 0.06;
const LOCAL_VERSUS_AI_OPPONENT_RD = 80;
const LOCAL_VERSUS_AI_GLICKO2_SCALE = 173.7178;
const LOCAL_VERSUS_AI_GLICKO2_TAU = 0.5;
const LOCAL_VERSUS_AI_GLICKO2_EPSILON = 0.000001;
const LOCAL_VERSUS_AI_RATINGS = Array.from({ length: LOCAL_VERSUS_AI_PROFILE_COUNT }, (_, index) =>
  Math.round((index * (40 / Math.max(1, LOCAL_VERSUS_AI_PROFILE_COUNT - 1))) * 100) / 100,
);
const LOCAL_VERSUS_AI_START_INDEX = LOCAL_VERSUS_AI_RATINGS.reduce(
  (bestIndex, value, index, values) =>
    Math.abs(value - 20) < Math.abs(values[bestIndex] - 20) ? index : bestIndex,
  0,
);

function clampLocalVersusAiIndex(index) {
  const normalized = Number.isFinite(index) ? Math.round(index) : LOCAL_VERSUS_AI_START_INDEX;
  return Math.max(0, Math.min(LOCAL_VERSUS_AI_PROFILE_COUNT - 1, normalized));
}

function clampLocalVersusAiTier(tier) {
  const normalized = Number.isFinite(Number(tier)) ? Math.round(Number(tier)) : LOCAL_VERSUS_AI_START_INDEX + 1;
  return Math.max(1, Math.min(LOCAL_VERSUS_AI_PROFILE_COUNT, normalized));
}

function clampLocalVersusAiRating(rating) {
  const normalized = Number.isFinite(Number(rating)) ? Number(rating) : 20;
  return Math.max(0, Math.min(40, Math.round(normalized * 100) / 100));
}

function normalizeLocalVersusAiRd(rd) {
  const normalized = Number.isFinite(Number(rd)) ? Number(rd) : LOCAL_VERSUS_AI_DEFAULT_RD;
  return Math.max(30, Math.min(350, Math.round(normalized * 10) / 10));
}

function normalizeLocalVersusAiVolatility(volatility) {
  const normalized =
    Number.isFinite(Number(volatility)) ? Number(volatility) : LOCAL_VERSUS_AI_DEFAULT_VOLATILITY;
  return Math.max(0.01, Math.min(1, normalized));
}

function convertLocalVersusAiRatingToGlicko(rating) {
  const clamped = Math.max(0, Math.min(39.9999, clampLocalVersusAiRating(rating)));
  if (clamped <= 0) return 0;
  return -1500 * Math.log(1 - clamped / 40);
}

function convertGlickoToLocalVersusAiRating(glickoRating) {
  return clampLocalVersusAiRating(computeMRClient(Math.max(0, Number(glickoRating) || 0)));
}

function convertLocalVersusAiToGlicko2(rating, rd) {
  return {
    mu: (rating - 1500) / LOCAL_VERSUS_AI_GLICKO2_SCALE,
    phi: rd / LOCAL_VERSUS_AI_GLICKO2_SCALE,
  };
}

function convertGlicko2ToLocalVersusAi(mu, phi) {
  return {
    rating: mu * LOCAL_VERSUS_AI_GLICKO2_SCALE + 1500,
    rd: phi * LOCAL_VERSUS_AI_GLICKO2_SCALE,
  };
}

function computeLocalVersusAiGlickoG(phi) {
  return 1 / Math.sqrt(1 + (3 * phi * phi) / (Math.PI * Math.PI));
}

function computeLocalVersusAiGlickoE(mu, opponentMu, opponentPhi) {
  return 1 / (1 + Math.exp(-computeLocalVersusAiGlickoG(opponentPhi) * (mu - opponentMu)));
}

function computeLocalVersusAiGlickoVariance(mu, opponents) {
  let sum = 0;
  for (const opponent of opponents) {
    const gPhi = computeLocalVersusAiGlickoG(opponent.phi);
    const expected = computeLocalVersusAiGlickoE(mu, opponent.mu, opponent.phi);
    sum += gPhi * gPhi * expected * (1 - expected);
  }
  return 1 / Math.max(Number.EPSILON, sum);
}

function computeLocalVersusAiGlickoDelta(mu, opponents, variance) {
  let sum = 0;
  for (const opponent of opponents) {
    const gPhi = computeLocalVersusAiGlickoG(opponent.phi);
    const expected = computeLocalVersusAiGlickoE(mu, opponent.mu, opponent.phi);
    sum += gPhi * (opponent.score - expected);
  }
  return variance * sum;
}

function computeLocalVersusAiVolatility(sigma, delta, phi, variance) {
  const a = Math.log(sigma * sigma);
  const phiSquared = phi * phi;
  const deltaSquared = delta * delta;

  function f(value) {
    const expValue = Math.exp(value);
    const denominator = phiSquared + variance + expValue;
    const p1 =
      (expValue * (deltaSquared - phiSquared - variance - expValue)) /
      (2 * denominator * denominator);
    const p2 = (value - a) / (LOCAL_VERSUS_AI_GLICKO2_TAU * LOCAL_VERSUS_AI_GLICKO2_TAU);
    return p1 - p2;
  }

  let lower = a;
  let upper;
  if (deltaSquared > phiSquared + variance) {
    upper = Math.log(deltaSquared - phiSquared - variance);
  } else {
    let k = 1;
    while (f(a - k * LOCAL_VERSUS_AI_GLICKO2_TAU) < 0) k += 1;
    upper = a - k * LOCAL_VERSUS_AI_GLICKO2_TAU;
  }

  let fLower = f(lower);
  let fUpper = f(upper);

  while (Math.abs(upper - lower) > LOCAL_VERSUS_AI_GLICKO2_EPSILON) {
    const next = lower + ((lower - upper) * fLower) / (fUpper - fLower);
    const fNext = f(next);
    if (fNext * fUpper <= 0) {
      lower = upper;
      fLower = fUpper;
    } else {
      fLower /= 2;
    }
    upper = next;
    fUpper = fNext;
  }

  return Math.exp(lower / 2);
}

function computeLocalVersusAiGlickoUpdate(state, opponentRating, score) {
  const playerRating = convertLocalVersusAiRatingToGlicko(state?.rating);
  const playerRd = normalizeLocalVersusAiRd(state?.rd);
  const playerVolatility = normalizeLocalVersusAiVolatility(state?.volatility);
  const opponentGlickoRating = convertLocalVersusAiRatingToGlicko(opponentRating);
  const opponentRd = LOCAL_VERSUS_AI_OPPONENT_RD;

  const player = convertLocalVersusAiToGlicko2(playerRating, playerRd);
  const opponent = convertLocalVersusAiToGlicko2(opponentGlickoRating, opponentRd);
  opponent.score = score;

  const variance = computeLocalVersusAiGlickoVariance(player.mu, [opponent]);
  const delta = computeLocalVersusAiGlickoDelta(player.mu, [opponent], variance);
  const nextVolatility = computeLocalVersusAiVolatility(playerVolatility, delta, player.phi, variance);
  const phiStar = Math.sqrt(player.phi * player.phi + nextVolatility * nextVolatility);
  const nextPhi = 1 / Math.sqrt(1 / (phiStar * phiStar) + 1 / variance);
  const nextMu =
    player.mu +
    nextPhi *
      nextPhi *
      computeLocalVersusAiGlickoG(opponent.phi) *
      (score - computeLocalVersusAiGlickoE(player.mu, opponent.mu, opponent.phi));
  const nextGlicko = convertGlicko2ToLocalVersusAi(nextMu, nextPhi);

  return {
    glickoRating: nextGlicko.rating,
    rating: convertGlickoToLocalVersusAiRating(nextGlicko.rating),
    rd: normalizeLocalVersusAiRd(nextGlicko.rd),
    volatility: nextVolatility,
  };
}

function getLocalVersusAiProfile(index = LOCAL_VERSUS_AI_START_INDEX) {
  const profileIndex = clampLocalVersusAiIndex(index);
  const skill = profileIndex / Math.max(1, LOCAL_VERSUS_AI_PROFILE_COUNT - 1);
  const styleBand =
    skill < 0.2
      ? "cheese"
      : skill < 0.5
        ? "cleanup"
        : skill < 0.78
          ? "opener"
          : "spike";
  return {
    index: profileIndex,
    tier: profileIndex + 1,
    rating: LOCAL_VERSUS_AI_RATINGS[profileIndex],
    skill,
    tierLabel: `${profileIndex + 1}/${LOCAL_VERSUS_AI_PROFILE_COUNT}`,
    styleBand,
    lookahead:
      styleBand === "cheese"
        ? Math.max(1, 1 + Math.floor(skill * 2))
        : styleBand === "cleanup"
          ? Math.max(2, 2 + Math.floor((skill - 0.2) * 4))
          : Math.max(3, Math.min(5, 3 + Math.floor((skill - 0.5) * 5))),
    candidateLimit:
      styleBand === "cheese"
        ? Math.max(4, Math.min(8, 4 + Math.floor(skill * 8)))
        : styleBand === "cleanup"
          ? Math.max(6, Math.min(11, 6 + Math.floor((skill - 0.2) * 8)))
          : Math.max(9, Math.min(16, 9 + Math.floor((skill - 0.5) * 14))),
    guidelinePps:
      styleBand === "cheese"
        ? 0.42 + skill * 0.9
        : styleBand === "cleanup"
          ? 0.8 + skill * 1.4
          : 1.15 + skill * 2.05,
    tgmPps: 0.45 + skill * 2.1,
    mistakeChance:
      styleBand === "cheese"
        ? Math.max(0.18, 0.42 - skill * 0.35)
        : styleBand === "cleanup"
          ? Math.max(0.08, 0.26 - (skill - 0.2) * 0.28)
          : Math.max(0.01, 0.12 - (skill - 0.5) * 0.17),
    attackMultiplier: 1,
    aggressionMultiplier: 1,
    apmTarget:
      styleBand === "cheese"
        ? 12 + skill * 18
        : styleBand === "cleanup"
          ? 22 + (skill - 0.2) * 35
          : 40 + Math.max(0, skill - 0.5) * 70,
  };
}

function getLocalVersusAiProfileForRating(rating = 20) {
  const target = clampLocalVersusAiRating(rating);
  const profileIndex = LOCAL_VERSUS_AI_RATINGS.reduce(
    (bestIndex, value, index, values) =>
      Math.abs(value - target) < Math.abs(values[bestIndex] - target) ? index : bestIndex,
    0,
  );
  return getLocalVersusAiProfile(profileIndex);
}

function getLocalVersusAiProfileForTier(tier = LOCAL_VERSUS_AI_START_INDEX + 1) {
  return getLocalVersusAiProfile(clampLocalVersusAiTier(tier) - 1);
}

function normalizeLocalVersusAiMatchRating(rating = 20, provisional = false) {
  const hiddenRating = clampLocalVersusAiRating(rating);
  if (provisional) {
    return clampLocalVersusAiTier(Math.floor(hiddenRating));
  }
  if (hiddenRating >= 39) {
    return hiddenRating;
  }
  return clampLocalVersusAiTier(Math.round(hiddenRating));
}

function interpolateLocalVersusAiProfile(progress, matchRating) {
  const clampedProgress = Math.max(0, Math.min(1, Number(progress) || 0));
  const eliteProgress = Math.pow(clampedProgress, 4);
  const eliteProfile = getLocalVersusAiProfileForTier(39);
  const maxProfile = {
    ...getLocalVersusAiProfileForTier(40),
    guidelinePps: 5.35,
    tgmPps: 5.05,
    lookahead: 7,
    candidateLimit: 28,
    mistakeChance: 0,
    attackMultiplier: 2.8,
    aggressionMultiplier: 3.2,
    apmTarget: 220,
  };
  const interpolate = (from, to) => from + (to - from) * eliteProgress;

  return {
    ...eliteProfile,
    index: interpolate(eliteProfile.index, maxProfile.index),
    tier: clampLocalVersusAiRating(matchRating),
    rating: clampLocalVersusAiRating(matchRating),
    skill: interpolate(eliteProfile.skill, maxProfile.skill),
    tierLabel: `${clampLocalVersusAiRating(matchRating).toFixed(2)}/${LOCAL_VERSUS_AI_PROFILE_COUNT}`,
    lookahead: Math.round(interpolate(eliteProfile.lookahead, maxProfile.lookahead)),
    candidateLimit: Math.round(interpolate(eliteProfile.candidateLimit, maxProfile.candidateLimit)),
    guidelinePps: interpolate(eliteProfile.guidelinePps, maxProfile.guidelinePps),
    tgmPps: interpolate(eliteProfile.tgmPps, maxProfile.tgmPps),
    mistakeChance: interpolate(eliteProfile.mistakeChance, maxProfile.mistakeChance),
    attackMultiplier: interpolate(eliteProfile.attackMultiplier, maxProfile.attackMultiplier),
    aggressionMultiplier: interpolate(
      eliteProfile.aggressionMultiplier,
      maxProfile.aggressionMultiplier,
    ),
    apmTarget: interpolate(eliteProfile.apmTarget, maxProfile.apmTarget),
  };
}

function getLocalVersusAiProfileForMatchRating(matchRating = 20) {
  const normalizedMatchRating = clampLocalVersusAiRating(matchRating);
  if (normalizedMatchRating >= 39) {
    return interpolateLocalVersusAiProfile(normalizedMatchRating - 39, normalizedMatchRating);
  }
  return getLocalVersusAiProfileForTier(normalizedMatchRating);
}

function formatLocalVersusAiMatchLabel(value) {
  const normalized = Number(value);
  if (!Number.isFinite(normalized)) return "20";
  return normalized >= 39 ? normalized.toFixed(2) : `${Math.round(normalized)}`;
}

function isLocalVersusAiProvisional(stateOrMatches = null) {
  const decisiveMatches =
    typeof stateOrMatches === "number"
      ? stateOrMatches
      : Math.max(0, Number(stateOrMatches?.matchesPlayed) || 0);
  return decisiveMatches < LOCAL_VERSUS_AI_PROVISIONAL_MATCHES;
}

function createDefaultLocalVersusAiState() {
  const rating = 20;
  const profile = getLocalVersusAiProfileForRating(rating);
  return {
    difficultyIndex: profile.index,
    rating,
    rd: LOCAL_VERSUS_AI_DEFAULT_RD,
    volatility: LOCAL_VERSUS_AI_DEFAULT_VOLATILITY,
    wins: 0,
    losses: 0,
    draws: 0,
    matchesPlayed: 0,
    roundsPlayed: 0,
  };
}

function normalizeLocalVersusAiState(rawState = null) {
  const base = createDefaultLocalVersusAiState();
  const rating = clampLocalVersusAiRating(rawState?.rating ?? base.rating);
  const profile = getLocalVersusAiProfileForRating(rating);
  return {
    ...base,
    difficultyIndex: profile.index,
    rating,
    rd: normalizeLocalVersusAiRd(rawState?.rd ?? base.rd),
    volatility: normalizeLocalVersusAiVolatility(rawState?.volatility ?? base.volatility),
    wins: Math.max(0, Number(rawState?.wins) || 0),
    losses: Math.max(0, Number(rawState?.losses) || 0),
    draws: Math.max(0, Number(rawState?.draws) || 0),
    matchesPlayed: Math.max(0, Number(rawState?.matchesPlayed) || 0),
    roundsPlayed: Math.max(0, Number(rawState?.roundsPlayed) || 0),
  };
}

function loadLocalVersusAiState() {
  try {
    const raw = localStorage.getItem(LOCAL_VERSUS_AI_STORAGE_KEY);
    if (!raw) return createDefaultLocalVersusAiState();
    return normalizeLocalVersusAiState(JSON.parse(raw));
  } catch (error) {
    console.warn("[Versus] Failed to load local AI ladder state:", error);
    return createDefaultLocalVersusAiState();
  }
}

function saveLocalVersusAiState(state) {
  const normalized = normalizeLocalVersusAiState(state);
  try {
    localStorage.setItem(LOCAL_VERSUS_AI_STORAGE_KEY, JSON.stringify(normalized));
  } catch (error) {
    console.warn("[Versus] Failed to save local AI ladder state:", error);
  }
  return normalized;
}

function getLocalVersusAiSummary() {
  const state = loadLocalVersusAiState();
  const profile = getLocalVersusAiProfileForRating(state.rating);
  return {
    ...state,
    profile,
    provisional: isLocalVersusAiProvisional(state),
  };
}

function recordLocalVersusAiDrawRound() {
  const previousState = loadLocalVersusAiState();
  const nextState = {
    ...previousState,
    roundsPlayed: previousState.roundsPlayed + 1,
  };
  const storedState = saveLocalVersusAiState(nextState);
  return {
    state: storedState,
    provisional: isLocalVersusAiProvisional(storedState),
  };
}

function getLocalVersusAiProvisionalDelta(decisiveMatchNumber = 1) {
  const normalizedMatchNumber = Math.max(1, Math.floor(Number(decisiveMatchNumber) || 1));
  return Math.round((10 / Math.pow(2, normalizedMatchNumber - 1)) * 100) / 100;
}

function getNextLocalVersusAiProvisionalRating(rating, outcome, decisiveMatchNumber = 1) {
  const currentRating = clampLocalVersusAiRating(rating);
  const delta = getLocalVersusAiProvisionalDelta(decisiveMatchNumber);
  if (outcome === "win") {
    return clampLocalVersusAiRating(currentRating + delta);
  }
  if (outcome === "loss") {
    return clampLocalVersusAiRating(currentRating - delta);
  }
  return currentRating;
}

function recordLocalVersusAiMatch(outcome, roundsPlayed = 1) {
  const previousState = loadLocalVersusAiState();
  const oldProfile = getLocalVersusAiProfileForRating(previousState.rating);
  const wasProvisional = isLocalVersusAiProvisional(previousState);
  const oldRd = normalizeLocalVersusAiRd(previousState.rd);
  const nextState = {
    ...previousState,
    roundsPlayed: previousState.roundsPlayed + Math.max(1, Number(roundsPlayed) || 1),
  };

  if (outcome === "win") {
    nextState.wins += 1;
    nextState.matchesPlayed += 1;
    const decisiveMatchNumber = nextState.matchesPlayed;
    const glickoUpdate = computeLocalVersusAiGlickoUpdate(previousState, previousState.rating, 1);
    nextState.rd = glickoUpdate.rd;
    nextState.volatility = glickoUpdate.volatility;
    nextState.rating = wasProvisional
      ? getNextLocalVersusAiProvisionalRating(previousState.rating, outcome, decisiveMatchNumber)
      : glickoUpdate.rating;
  } else if (outcome === "loss") {
    nextState.losses += 1;
    nextState.matchesPlayed += 1;
    const decisiveMatchNumber = nextState.matchesPlayed;
    const glickoUpdate = computeLocalVersusAiGlickoUpdate(previousState, previousState.rating, 0);
    nextState.rd = glickoUpdate.rd;
    nextState.volatility = glickoUpdate.volatility;
    nextState.rating = wasProvisional
      ? getNextLocalVersusAiProvisionalRating(previousState.rating, outcome, decisiveMatchNumber)
      : glickoUpdate.rating;
  }

  const storedState = saveLocalVersusAiState(nextState);
  const newProfile = getLocalVersusAiProfileForRating(storedState.rating);
  return {
    oldRating: previousState.rating,
    newRating: storedState.rating,
    oldProfile,
    newProfile,
    state: storedState,
    ratingDelta: Math.round((storedState.rating - previousState.rating) * 100) / 100,
    oldRd,
    newRd: normalizeLocalVersusAiRd(storedState.rd),
    wasProvisional,
    provisional: isLocalVersusAiProvisional(storedState),
  };
}

function getLocalVersusAiPlayerName() {
  try {
    if (typeof window !== "undefined" && window.achievementSystem?.getPlayerName) {
      const achievementName = window.achievementSystem.getPlayerName();
      if (achievementName) return achievementName;
    }
    const storedName = localStorage.getItem("mino_player_name");
    return storedName || "Player";
  } catch (error) {
    console.warn("[Versus] Failed to resolve player name:", error);
    return "Player";
  }
}

function buildLocalVersusAiOpponent(queueType, profile, provisional = false) {
  const label = queueType === "tgm" ? "Minosa TGM" : "Minosa AI";
  return {
    id: `${LOCAL_VERSUS_AI_OPPONENT_ID}-${queueType}`,
    name: provisional ? label : `${label} ${formatLocalVersusAiMatchLabel(profile.tier)}`,
    rating: profile.tier,
    provisional,
  };
}

function createLocalVersusAiMatchData(modeId, options = 1) {
  const queueType = typeof modeId === "string" && modeId.includes("tgm") ? "tgm" : "guideline";
  const summary = getLocalVersusAiSummary();
  const normalizedOptions =
    typeof options === "number"
      ? { roundNumber: options }
      : (options || {});
  const aiRating = clampLocalVersusAiRating(normalizedOptions.aiRating ?? summary.rating);
  const provisional =
    typeof normalizedOptions.provisional === "boolean"
      ? normalizedOptions.provisional
      : summary.provisional;
  const aiMatchRating = clampLocalVersusAiRating(
    normalizedOptions.aiMatchRating ?? normalizeLocalVersusAiMatchRating(aiRating, provisional),
  );
  const aiProfile = getLocalVersusAiProfileForMatchRating(aiMatchRating);
  return {
    localAi: true,
    modeId,
    queueType,
    roundNumber: Math.max(1, Number(normalizedOptions.roundNumber) || 1),
    winsToFinish: Math.max(1, Number(normalizedOptions.winsToFinish) || LOCAL_VERSUS_AI_WINS_TO_FINISH),
    playerWins: Math.max(0, Number(normalizedOptions.playerWins) || 0),
    opponentWins: Math.max(0, Number(normalizedOptions.opponentWins) || 0),
    drawRounds: Math.max(0, Number(normalizedOptions.drawRounds) || 0),
    aiRating,
    aiMatchRating,
    provisional,
    seed: Date.now(),
    startTimestamp: Date.now(),
    player: {
      id: LOCAL_VERSUS_AI_PLAYER_ID,
      name: getLocalVersusAiPlayerName(),
    },
    opponent: buildLocalVersusAiOpponent(queueType, aiProfile, provisional),
    aiProfile,
  };
}

function createEmptyLocalVersusGrid(rows, cols) {
  return Array.from({ length: rows }, () => Array(cols).fill(0));
}

function cloneLocalVersusGrid(grid) {
  return Array.isArray(grid) ? grid.map((row) => (Array.isArray(row) ? [...row] : [])) : [];
}

const MAX_VERSUS_GARBAGE_ENTRY = 8;

function getNormalizedVersusGarbageQueue(value) {
  return Math.max(0, Number(value) || 0);
}

function getIntegralVersusGarbageRows(value) {
  return Math.max(0, Math.floor(getNormalizedVersusGarbageQueue(value)));
}

function getVersusElapsedSeconds(source, fallbackSeconds = 0) {
  const modeElapsed = Number(source?.gameMode?.matchElapsed);
  if (Number.isFinite(modeElapsed) && modeElapsed >= 0) return modeElapsed;
  const sourceElapsed = Number(source?.currentTime);
  if (Number.isFinite(sourceElapsed) && sourceElapsed >= 0) return sourceElapsed;
  return Math.max(0, Number(fallbackSeconds) || 0);
}

function getVersusGarbageMultiplier(elapsedSeconds = 0) {
  const normalizedElapsed = Math.max(0, Number(elapsedSeconds) || 0);
  if (normalizedElapsed <= 120) return 1;
  return 1 + (normalizedElapsed - 120) * 0.002;
}

function scaleVersusGarbageAttack(attack, elapsedSeconds = 0) {
  const normalizedAttack = getNormalizedVersusGarbageQueue(attack);
  if (normalizedAttack <= 0) return 0;
  return normalizedAttack * getVersusGarbageMultiplier(elapsedSeconds);
}

function ensurePlayerVersusGarbageChunks(gameScene) {
  if (!gameScene) return [];
  if (!Array.isArray(gameScene.versusGarbageChunks)) {
    const legacyQueue = getNormalizedVersusGarbageQueue(gameScene.versusGarbageQueue);
    gameScene.versusGarbageChunks = legacyQueue > 0 ? [{ rows: legacyQueue, hole: null }] : [];
  }
  return gameScene.versusGarbageChunks;
}

function getPlayerVersusGarbageQueueTotal(gameScene) {
  return ensurePlayerVersusGarbageChunks(gameScene).reduce(
    (total, chunk) => total + getNormalizedVersusGarbageQueue(chunk?.rows),
    0,
  );
}

function getNextPlayerVersusGarbageHole(gameScene) {
  const cols = Math.max(1, Number(gameScene?.board?.cols) || 10);
  if (!Number.isInteger(gameScene?.versusGarbageHoleCol)) {
    gameScene.versusGarbageHoleCol = Math.floor(Math.random() * cols);
    return gameScene.versusGarbageHoleCol;
  }
  let nextHole =
    (gameScene.versusGarbageHoleCol + 1 + Math.floor(Math.random() * Math.max(1, cols - 1))) % cols;
  if (nextHole === gameScene.versusGarbageHoleCol && cols > 1) {
    nextHole = (nextHole + 1) % cols;
  }
  gameScene.versusGarbageHoleCol = nextHole;
  return nextHole;
}

function normalizePlayerVersusGarbageHole(gameScene, hole) {
  if (!Number.isInteger(hole)) return getNextPlayerVersusGarbageHole(gameScene);
  const cols = Math.max(1, Number(gameScene?.board?.cols) || 10);
  const normalizedHole = ((hole % cols) + cols) % cols;
  gameScene.versusGarbageHoleCol = normalizedHole;
  return normalizedHole;
}

function syncPlayerVersusGarbageQueue(gameScene) {
  if (!gameScene) return 0;
  gameScene.versusGarbageQueue = getPlayerVersusGarbageQueueTotal(gameScene);
  updatePlayerVersusGarbageQueueHud(gameScene);
  return gameScene.versusGarbageQueue;
}

function updatePlayerVersusGarbageQueueHud(gameScene) {
  if (!gameScene?.versusHUD || typeof gameScene.versusHUD.updatePlayerGarbageQueue !== "function") return;
  gameScene.versusHUD.updatePlayerGarbageQueue(getPlayerVersusGarbageQueueTotal(gameScene));
}

function enqueuePlayerVersusGarbageChunk(gameScene, rows, hole = null) {
  if (!gameScene) return 0;
  const incomingRows = getNormalizedVersusGarbageQueue(rows);
  if (incomingRows <= 0) return 0;
  ensurePlayerVersusGarbageChunks(gameScene).push({
    rows: incomingRows,
    hole: normalizePlayerVersusGarbageHole(gameScene, hole),
  });
  return incomingRows;
}

function enqueuePlayerVersusGarbage(gameScene, rows, hole = null) {
  if (!gameScene) return 0;
  enqueuePlayerVersusGarbageChunk(gameScene, rows, hole);
  return syncPlayerVersusGarbageQueue(gameScene);
}

function enqueuePlayerVersusGarbageChunks(gameScene, chunks = []) {
  if (!gameScene) return 0;
  for (const chunk of Array.isArray(chunks) ? chunks : []) {
    enqueuePlayerVersusGarbageChunk(gameScene, chunk?.rows, chunk?.hole ?? chunk?.holeCol);
  }
  return syncPlayerVersusGarbageQueue(gameScene);
}

function cancelPlayerVersusGarbage(gameScene, attack) {
  if (!gameScene) return 0;
  let remainingAttack = getNormalizedVersusGarbageQueue(attack);
  const chunks = ensurePlayerVersusGarbageChunks(gameScene);
  while (remainingAttack > 0 && chunks.length > 0) {
    const headRows = getNormalizedVersusGarbageQueue(chunks[0]?.rows);
    if (headRows <= 0) {
      chunks.shift();
      continue;
    }
    const canceled = Math.min(headRows, remainingAttack);
    remainingAttack -= canceled;
    const nextRows = headRows - canceled;
    if (nextRows > 0) {
      chunks[0].rows = nextRows;
    } else {
      chunks.shift();
    }
  }
  syncPlayerVersusGarbageQueue(gameScene);
  return remainingAttack;
}

function applyPlayerVersusGarbageEntry(gameScene, maxRows = MAX_VERSUS_GARBAGE_ENTRY) {
  if (!gameScene?.board || typeof gameScene.board.addCheeseRows !== "function") return 0;
  const chunks = ensurePlayerVersusGarbageChunks(gameScene);
  const availableRows = getIntegralVersusGarbageRows(getPlayerVersusGarbageQueueTotal(gameScene));
  if (availableRows <= 0) return 0;
  let entryBudget = Math.min(availableRows, getIntegralVersusGarbageRows(maxRows) || MAX_VERSUS_GARBAGE_ENTRY);
  let appliedRows = 0;
  let chunkIndex = 0;
  while (entryBudget > 0 && chunkIndex < chunks.length) {
    const chunk = chunks[chunkIndex] || {};
    const chunkRows = getNormalizedVersusGarbageQueue(chunk.rows);
    const integralChunkRows = getIntegralVersusGarbageRows(chunkRows);
    if (chunkRows <= 0) {
      chunks.splice(chunkIndex, 1);
      continue;
    }
    if (integralChunkRows <= 0) {
      chunkIndex += 1;
      continue;
    }
    const rows = Math.min(entryBudget, integralChunkRows);
    gameScene.board.addCheeseRows(rows, 0, chunk.hole);
    appliedRows += rows;
    entryBudget -= rows;
    const nextRows = chunkRows - rows;
    if (nextRows > 0) {
      chunk.rows = nextRows;
      if (getIntegralVersusGarbageRows(nextRows) <= 0) {
        chunkIndex += 1;
      }
    } else {
      chunks.splice(chunkIndex, 1);
    }
  }
  syncPlayerVersusGarbageQueue(gameScene);
  return appliedRows;
}

function resolvePlayerVersusGarbageAfterLock(gameScene, linesCleared, attack) {
  const effectiveLinesCleared = Math.max(0, Math.floor(Number(linesCleared) || 0));
  const outgoingAttack = cancelPlayerVersusGarbage(gameScene, attack);
  if (effectiveLinesCleared <= 0) {
    applyPlayerVersusGarbageEntry(gameScene, MAX_VERSUS_GARBAGE_ENTRY);
  }
  return outgoingAttack;
}

function getLocalVersusGridKey(grid) {
  if (!Array.isArray(grid)) return "";
  return grid
    .map((row) =>
      Array.isArray(row) ? row.map((cell) => (cell ? "1" : "0")).join("") : "",
    )
    .join("/");
}

function getLocalVersusAiWorkerUrl() {
  try {
    const baseHref =
      typeof window !== "undefined" && typeof window.location?.href === "string"
        ? window.location.href
        : "http://localhost/";
    return new URL("js/game/minosa-worker.js", baseHref).toString();
  } catch (error) {
    return "js/game/minosa-worker.js";
  }
}

function formatLocalVersusAiRating(value) {
  return Number.isFinite(Number(value)) ? Number(value).toFixed(2) : "20.00";
}

function formatLocalVersusMatchScore(playerWins = 0, opponentWins = 0, winsToFinish = LOCAL_VERSUS_AI_WINS_TO_FINISH) {
  const safePlayerWins = Math.max(0, Number(playerWins) || 0);
  const safeOpponentWins = Math.max(0, Number(opponentWins) || 0);
  const safeWinsToFinish = Math.max(1, Number(winsToFinish) || LOCAL_VERSUS_AI_WINS_TO_FINISH);
  return `${safePlayerWins}-${safeOpponentWins} • FT${safeWinsToFinish}`;
}

function normalizeVersusPieceType(entry) {
  const type =
    typeof entry === "string"
      ? entry
      : typeof entry?.type === "string"
        ? entry.type
        : typeof entry?.piece === "string"
          ? entry.piece
          : null;
  return typeof type === "string" ? type.toUpperCase() : null;
}

function createVersusSeededRandom(seed = Date.now()) {
  let state = 2166136261;
  const seedString = String(seed ?? Date.now());
  for (let index = 0; index < seedString.length; index += 1) {
    state ^= seedString.charCodeAt(index);
    state = Math.imul(state, 16777619);
  }
  return () => {
    state += 0x6d2b79f5;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function getVersusPreviewColorForPiece(pieceType, rotationSystem = "SRS") {
  const normalizedType = normalizeVersusPieceType(pieceType);
  if (!normalizedType) return 0xffffff;
  if (typeof RotationSystems !== "undefined") {
    return RotationSystems.getColor(normalizedType, rotationSystem);
  }
  if (rotationSystem === "ARS" && typeof ARS_COLORS !== "undefined") {
    return ARS_COLORS[normalizedType] || 0xffffff;
  }
  if (typeof TETROMINOES !== "undefined") {
    return TETROMINOES[normalizedType]?.color || 0xffffff;
  }
  return 0xffffff;
}

function getVersusPreviewCellColor(cell) {
  if (!cell) return 0;
  if (typeof cell === "number") return cell;
  if (typeof cell === "string") return getVersusPreviewColorForPiece(cell);
  if (typeof cell === "object") {
    if (typeof cell.color === "number") return cell.color;
    if (typeof cell.type === "string") return getVersusPreviewColorForPiece(cell.type);
    if (typeof cell.piece === "string") return getVersusPreviewColorForPiece(cell.piece);
  }
  return 0xffffff;
}

function getVersusQueueTypeFromScene(gameScene, matchData = null) {
  const specialMechanics =
    gameScene?.gameMode && typeof gameScene.gameMode.getConfig === "function"
      ? gameScene.gameMode.getConfig()?.specialMechanics || {}
      : {};
  return (
    matchData?.queueType ||
    specialMechanics.localAiQueueType ||
    specialMechanics.versusType ||
    "guideline"
  );
}

class SharedVersusPieceSource {
  constructor(queueType = "guideline", seed = Date.now()) {
    this.queueType = queueType === "tgm" ? "tgm" : "guideline";
    this.seed = seed;
    this.random = createVersusSeededRandom(seed);
    this.guidelineBag = [];
    this.firstGuidelinePiece = true;
    this.firstTgmPiece = true;
    this.pieceHistory = ["Z", "Z", "S", "S"];
  }

  nextPiece() {
    return this.queueType === "tgm"
      ? this.nextTgmPiece()
      : this.nextGuidelinePiece();
  }

  nextGuidelinePiece() {
    if (this.guidelineBag.length === 0) {
      this.guidelineBag = ["I", "J", "L", "O", "S", "T", "Z"];
      for (let index = this.guidelineBag.length - 1; index > 0; index -= 1) {
        const swapIndex = Math.floor(this.random() * (index + 1));
        [this.guidelineBag[index], this.guidelineBag[swapIndex]] =
          [this.guidelineBag[swapIndex], this.guidelineBag[index]];
      }
    }

    if (this.firstGuidelinePiece) {
      this.firstGuidelinePiece = false;
      const safeIndex = this.guidelineBag.findIndex((piece) => ["I", "J", "L", "T"].includes(piece));
      if (safeIndex > 0) {
        [this.guidelineBag[0], this.guidelineBag[safeIndex]] =
          [this.guidelineBag[safeIndex], this.guidelineBag[0]];
      }
    }

    return this.guidelineBag.shift() || "I";
  }

  nextTgmPiece() {
    const types = ["I", "J", "L", "O", "S", "T", "Z"];
    let piece = "I";

    if (this.firstTgmPiece) {
      const firstPieces = ["I", "J", "L", "T"];
      piece = firstPieces[Math.floor(this.random() * firstPieces.length)];
      this.firstTgmPiece = false;
    } else {
      let attempts = 0;
      do {
        piece = types[Math.floor(this.random() * types.length)];
        attempts += 1;
      } while (this.pieceHistory.includes(piece) && attempts < 6);
    }

    this.pieceHistory.shift();
    this.pieceHistory.push(piece);
    return piece;
  }
}

function createVersusPieceSourceForScene(gameScene, matchData = null) {
  const queueType = getVersusQueueTypeFromScene(gameScene, matchData);
  const seed = matchData?.seed ?? gameScene?.versusSeed ?? Date.now();
  return new SharedVersusPieceSource(queueType, seed);
}

function buildVersusBoardSnapshot(gameScene) {
  const grid = Array.isArray(gameScene?.board?.grid) ? gameScene.board.grid : [];
  const visible = grid.slice(Math.max(0, grid.length - 20));
  return visible.map((row) =>
    (Array.isArray(row) ? row : []).map((cell) => getVersusPreviewCellColor(cell)),
  );
}

function buildVersusStatsPayload(source = {}) {
  const elapsedSeconds = Math.max(
    0,
    Number(source?.elapsedSeconds ?? source?.currentTime) || 0,
  );
  const pieceCount = Math.max(
    0,
    Number(source?.pieceCount ?? source?.totalPiecesPlaced) || 0,
  );
  const attackTotal = Math.max(
    0,
    Number(source?.attackTotal ?? source?.totalAttack) || 0,
  );
  const garbageCleared = Math.max(
    0,
    Number(source?.garbageCleared ?? source?.totalGarbageCleared) || 0,
  );
  const computedPps = elapsedSeconds > 0 ? pieceCount / elapsedSeconds : 0;
  const configuredPps = Number(source?.pps ?? source?.conventionalPPS);
  const configuredRawPps = Number(source?.rawPps ?? source?.rawPPS);
  const pps = Number.isFinite(configuredPps) ? Math.max(0, configuredPps) : computedPps;
  const rawPps = Number.isFinite(configuredRawPps) ? Math.max(0, configuredRawPps) : computedPps;
  const attackPerMin = elapsedSeconds > 0 ? (attackTotal / elapsedSeconds) * 60 : 0;
  const attackPerPiece = pieceCount > 0 ? attackTotal / pieceCount : 0;
  const vsScore =
    pieceCount > 0 ? (((attackTotal + garbageCleared) / pieceCount) * pps * 100) : 0;

  return {
    elapsedSeconds,
    pieceCount,
    attackTotal,
    garbageCleared,
    pps,
    rawPps,
    attackPerMin,
    attackPerPiece,
    vsScore,
  };
}

function buildVersusPreviewPayload(gameScene) {
  const maxNextPieces = Math.max(1, Number(gameScene?.nextPiecesCount) || 1);
  const nextQueue = Array.isArray(gameScene?.nextPieces)
    ? gameScene.nextPieces
      .slice(0, maxNextPieces)
      .map(normalizeVersusPieceType)
      .filter(Boolean)
    : [];
  const holdType = normalizeVersusPieceType(gameScene?.holdPiece);
  return {
    board: buildVersusBoardSnapshot(gameScene),
    holdType,
    nextQueue,
    canHold: !!gameScene?.holdEnabled,
    incomingGarbageQueue: getPlayerVersusGarbageQueueTotal(gameScene),
    rotationSystem: gameScene?.rotationSystem || "SRS",
    stats: buildVersusStatsPayload(gameScene),
  };
}

class LocalVersusAiController {
  constructor(gameScene, matchData) {
    this.scene = gameScene;
    this.matchData = matchData || {};
    this.queueType = this.matchData.queueType || "guideline";
    this.rotationSystem = this.queueType === "tgm" ? "ARS" : "SRS";
    const summary = getLocalVersusAiSummary();
    this.hiddenRating = Number(this.matchData?.aiRating ?? summary.rating ?? 20) || 20;
    this.matchRating = clampLocalVersusAiRating(
      this.matchData?.aiMatchRating ??
        this.matchData?.opponent?.rating ??
        normalizeLocalVersusAiMatchRating(this.hiddenRating, !!this.matchData?.provisional),
    );
    this.profile = this.matchData.aiProfile || getLocalVersusAiProfileForMatchRating(this.matchRating);
    this.winsToFinish = Math.max(1, Number(this.matchData?.winsToFinish) || LOCAL_VERSUS_AI_WINS_TO_FINISH);
    this.playerWins = Math.max(0, Number(this.matchData?.playerWins) || 0);
    this.opponentWins = Math.max(0, Number(this.matchData?.opponentWins) || 0);
    this.drawRounds = Math.max(0, Number(this.matchData?.drawRounds) || 0);
    this.minosa = typeof getMinosaInstance === "function" ? getMinosaInstance() : null;
    this.rows = Math.max(20, gameScene?.board?.rows || 22);
    this.cols = Math.max(10, gameScene?.board?.cols || 10);
    this.hiddenRows = Math.max(0, this.rows - 20);
    this.grid = createEmptyLocalVersusGrid(this.rows, this.cols);
    this.visualGrid = createEmptyLocalVersusGrid(this.rows, this.cols);
    this.currentType = null;
    this.queue = [];
    this.holdType = null;
    this.canHold = this.queueType !== "tgm";
    this.pendingGarbageEntries = [];
    this.turnTimer = 0;
    this.roundResolved = false;
    this.handledTimerExpiry = false;
    this.ignoreNextGameOverCallback = false;
    this.comboCount = -1;
    this.backToBack = false;
    this.level = 0;
    this.bagQueue = [];
    this.lastClassicPiece = null;
    this.firstTgmPiece = true;
    this.pieceHistory = ["Z", "Z", "S", "S"];
    this.garbageHole = Math.floor(Math.random() * this.cols);
    this.pieceSource = createVersusPieceSourceForScene(gameScene, matchData);
    this.totalAttack = 0;
    this.totalGarbageCleared = 0;
    this.totalPiecesPlaced = 0;
    this.currentTime = 0;
    this.statsHudTimer = 0;
    this.decisionWorker = null;
    this.workerReady = false;
    this.workerDisabled = typeof Worker !== "function";
    this.decisionRequestId = 0;
    this.inflightDecision = null;
    this.readyDecision = null;

    this.ensurePieceQueue(6);
    this.advanceActivePiece();
    this.initializeDecisionWorker();
    this.requestDecisionIfNeeded();
    this.syncHudMeta();
    this.pushBoardToHud();
  }

  getModeId() {
    return this.matchData.modeId || (this.queueType === "tgm" ? "versus_tgm_ai" : "versus_guideline_ai");
  }

  getRoundNumber() {
    return Math.max(1, Number(this.matchData?.roundNumber) || 1);
  }

  syncHudMeta() {
    if (!this.scene?.versusHUD) return;
    if (typeof this.scene.versusHUD.updateMatchData === "function") {
      this.scene.versusHUD.updateMatchData({
        ...this.matchData,
        winsToFinish: this.winsToFinish,
        playerWins: this.playerWins,
        opponentWins: this.opponentWins,
      });
    }
  }

  startNextRound(nextMatch) {
    this.scene.preserveVersusBgmAcrossSceneChange = true;
    window.__minoPreservedVersusBgm = {
      bgmTracks: this.scene.bgmTracks || null,
      currentBGM: this.scene.currentBGM || null,
      currentBgmKey: this.scene.currentBgmKey || null,
      bgmStarted: !!this.scene.bgmStarted,
    };
    window.__versusMatchData = nextMatch;
    const modeManager = typeof getModeManager === "function" ? getModeManager() : null;
    const nextMode =
      modeManager && typeof modeManager.getMode === "function"
        ? modeManager.getMode(nextMatch.modeId)
        : null;
    const startScene =
      typeof startPreparedGameScene === "function"
        ? startPreparedGameScene
        : (scene, payload) => scene.scene.start("AssetLoaderScene", payload);
    startScene(this.scene, {
      mode: nextMatch.modeId,
      gameMode: nextMode,
      startingLevel: 0,
      preserveVersusBgm: true,
    });
  }

  getTurnInterval() {
    const pps = this.queueType === "tgm" ? this.profile.tgmPps : this.profile.guidelinePps;
    return 1 / Math.max(0.2, pps);
  }

  update(deltaTime) {
    if (this.roundResolved) return;
    this.currentTime += Math.max(0, Number(deltaTime) || 0);
    this.statsHudTimer += Math.max(0, Number(deltaTime) || 0);
    if (
      this.statsHudTimer >= 0.25 &&
      this.scene?.versusHUD &&
      typeof this.scene.versusHUD.updateOpponentStats === "function"
    ) {
      this.statsHudTimer = 0;
      this.scene.versusHUD.updateOpponentStats(this.buildStatsPayload());
    }

    if (this.queueType === "tgm" && this.scene?.gameMode?.timerExpired && !this.handledTimerExpiry) {
      this.handledTimerExpiry = true;
      this.handleTimerExpired();
      return;
    }

    this.turnTimer += deltaTime;
    const interval = this.getTurnInterval();
    this.turnTimer = Math.min(this.turnTimer, interval * 2);
    this.requestDecisionIfNeeded();
    if (this.turnTimer >= interval && this.playTurn()) {
      this.turnTimer = Math.max(0, this.turnTimer - interval);
    }
  }

  handlePlayerAttack(attack) {
    if (this.roundResolved || !Number.isFinite(attack) || attack <= 0) return;
    this.pendingGarbageEntries.push(getNormalizedVersusGarbageQueue(attack));
    this.invalidateDecision();
    this.pushBoardToHud();
  }

  getPendingGarbage() {
    if (!Array.isArray(this.pendingGarbageEntries) || this.pendingGarbageEntries.length === 0) return 0;
    return this.pendingGarbageEntries.reduce((total, entry) => total + getNormalizedVersusGarbageQueue(entry), 0);
  }

  handlePlayerGameOver() {
    if (this.ignoreNextGameOverCallback) {
      this.ignoreNextGameOverCallback = false;
      return;
    }
    if (this.roundResolved) return;
    if (this.queueType === "tgm" && this.scene?.gameMode?.timerExpired && !this.handledTimerExpiry) {
      this.handledTimerExpiry = true;
      this.handleTimerExpired();
      return;
    }
    this.finishRound("loss", "topout");
  }

  handleTimerExpired() {
    if (this.roundResolved) return;
    const playerLevel = Number(this.scene?.level) || 0;
    const aiLevel = Number(this.level) || 0;
    if (playerLevel === aiLevel) {
      this.finishDraw("time_expired");
      return;
    }
    this.finishRound(playerLevel > aiLevel ? "win" : "loss", "time_expired");
  }

  playTurn() {
    if (this.roundResolved) return false;

    this.ensurePieceQueue(6);
    if (!this.currentType) {
      this.advanceActivePiece();
    }
    if (!this.currentType) {
      this.finishRound("win", "topout");
      return false;
    }

    let choice = this.consumeReadyDecision();
    if (!choice && this.workerDisabled) {
      choice = this.chooseTurn();
    }
    if (!choice) {
      this.requestDecisionIfNeeded();
      return false;
    }
    if (!choice?.placement || !choice?.step) {
      this.finishRound("win", "topout");
      return false;
    }

    const placedGrid = this.minosa.placePlacement(this.grid, choice.placement, this.rows, this.cols);
    const placedVisualGrid = this.placeVisualPlacement(choice.placement, choice.step.piece);
    const nextGrid = this.minosa.clearCompletedRows(placedGrid, this.rows, this.cols);
    const nextVisualGrid = this.clearCompletedVisualRows(placedVisualGrid);
    const linesCleared = this.minosa.countClearedLines(this.grid, nextGrid, this.cols);
    const garbageLinesCleared = this.countGarbageLinesCleared(placedVisualGrid);
    const isTSpin = this.minosa.isTSpinPlacement(
      placedGrid,
      choice.placement,
      choice.step.piece,
      this.rows,
      this.cols,
    );

    this.grid = nextGrid;
    this.visualGrid = nextVisualGrid;
    this.advanceStateAfterStep(choice.step);
    this.invalidateDecision();
    this.totalPiecesPlaced += 1;
    if (garbageLinesCleared > 0) {
      this.totalGarbageCleared += garbageLinesCleared;
    }
    this.level += this.queueType === "tgm" ? 1 + linesCleared : Math.max(1, linesCleared);

    const elapsedSeconds = getVersusElapsedSeconds(this.scene, this.currentTime);
    const attack = this.resolvePendingGarbage(
      linesCleared,
      scaleVersusGarbageAttack(this.computeAttack(linesCleared, isTSpin), elapsedSeconds),
    );
    if (attack > 0) {
      this.totalAttack += attack;
      enqueuePlayerVersusGarbage(this.scene, attack);
    }

    this.pushBoardToHud();
    if (this.isToppedOut()) {
      this.finishRound("win", "topout");
      return false;
    }
    this.requestDecisionIfNeeded();
    return true;
  }

  chooseTurn() {
    if (!this.minosa || typeof this.minosa.evaluateVersusTurn !== "function") return null;
    return this.minosa.evaluateVersusTurn({
      grid: this.grid,
      rows: this.rows,
      cols: this.cols,
      rotationSystem: this.rotationSystem,
      queueType: this.queueType,
      currentType: this.currentType,
      queue: this.queue,
      holdType: this.holdType,
      canHold: this.canHold,
      matchRating: this.matchRating,
      profile: this.profile,
      lookahead: this.profile.lookahead,
      candidateLimit: this.profile.candidateLimit,
      mistakeChance: this.profile.mistakeChance,
      pieceCount: this.totalPiecesPlaced,
      elapsedSeconds: this.currentTime,
      pendingGarbage: this.getPendingGarbage(),
    });
  }

  initializeDecisionWorker() {
    if (this.workerDisabled || this.decisionWorker || this.roundResolved) return;
    try {
      this.decisionWorker = new Worker(getLocalVersusAiWorkerUrl());
      this.decisionWorker.onmessage = (event) => this.handleDecisionWorkerMessage(event);
      this.decisionWorker.onerror = (event) => {
        this.disableDecisionWorker(event?.message || event);
      };
      this.decisionWorker.postMessage({
        type: "init",
        tetrominoes: typeof TETROMINOES !== "undefined" ? TETROMINOES : null,
        segaRotations: typeof SEGA_ROTATIONS !== "undefined" ? SEGA_ROTATIONS : null,
      });
    } catch (error) {
      this.disableDecisionWorker(error);
    }
  }

  handleDecisionWorkerMessage(event) {
    const data = event?.data || {};
    if (data.type === "ready") {
      if (data.error) {
        this.disableDecisionWorker(data.error);
        return;
      }
      this.workerReady = true;
      this.requestDecisionIfNeeded();
      return;
    }
    if (data.type !== "evaluate_turn_result") return;
    if (!this.inflightDecision || data.requestId !== this.inflightDecision.requestId) return;
    const inflightDecision = this.inflightDecision;
    this.inflightDecision = null;
    if (data.error) {
      this.disableDecisionWorker(data.error);
      return;
    }
    if (inflightDecision.signature !== this.getDecisionStateSignature()) {
      this.requestDecisionIfNeeded();
      return;
    }
    this.readyDecision = {
      signature: inflightDecision.signature,
      choice: data.result || null,
    };
  }

  disableDecisionWorker(error) {
    if (error) {
      console.warn("[Versus] Local AI worker unavailable, falling back to sync Minosa:", error);
    }
    this.workerDisabled = true;
    this.workerReady = false;
    this.inflightDecision = null;
    this.readyDecision = null;
    if (this.decisionWorker) {
      try {
        this.decisionWorker.terminate();
      } catch (terminateError) {
      }
    }
    this.decisionWorker = null;
  }

  getDecisionStateSignature() {
    return [
      this.queueType,
      this.rotationSystem,
      this.currentType || "",
      this.queue.join(""),
      this.holdType || "",
      this.canHold ? "1" : "0",
      this.getPendingGarbage(),
      getLocalVersusGridKey(this.grid),
    ].join("|");
  }

  buildDecisionRequest() {
    return {
      grid: cloneLocalVersusGrid(this.grid),
      rows: this.rows,
      cols: this.cols,
      rotationSystem: this.rotationSystem,
      queueType: this.queueType,
      currentType: this.currentType,
      queue: [...this.queue],
      holdType: this.holdType,
      canHold: this.canHold,
      matchRating: this.matchRating,
      profile: { ...this.profile },
      lookahead: this.profile.lookahead,
      candidateLimit: this.profile.candidateLimit,
      mistakeChance: this.profile.mistakeChance,
      pieceCount: this.totalPiecesPlaced,
      elapsedSeconds: this.currentTime,
      pendingGarbage: this.getPendingGarbage(),
    };
  }

  requestDecisionIfNeeded() {
    if (this.roundResolved || !this.currentType || !this.minosa) return;
    const signature = this.getDecisionStateSignature();
    if (this.readyDecision?.signature === signature) return;
    if (this.inflightDecision) return;
    if (!this.workerDisabled) {
      this.initializeDecisionWorker();
      if (!this.decisionWorker || !this.workerReady) return;
      const requestId = ++this.decisionRequestId;
      this.inflightDecision = { requestId, signature };
      this.decisionWorker.postMessage({
        type: "evaluate_turn",
        requestId,
        options: this.buildDecisionRequest(),
      });
      return;
    }
    this.readyDecision = {
      signature,
      choice: this.chooseTurn(),
    };
  }

  consumeReadyDecision() {
    const signature = this.getDecisionStateSignature();
    if (this.readyDecision?.signature !== signature) {
      this.readyDecision = null;
      return null;
    }
    const readyDecision = this.readyDecision?.choice || null;
    this.readyDecision = null;
    return readyDecision;
  }

  invalidateDecision() {
    this.readyDecision = null;
  }

  advanceStateAfterStep(step) {
    let nextHoldType = this.holdType;
    let remainingQueue = [...this.queue];

    if (step.usedHold) {
      if (this.holdType) {
        nextHoldType = this.currentType;
      } else {
        nextHoldType = this.currentType;
        remainingQueue = remainingQueue.slice(1);
      }
    }

    this.holdType = nextHoldType;
    this.currentType = remainingQueue[0] || null;
    this.queue = remainingQueue.slice(this.currentType ? 1 : 0);
    this.canHold = this.queueType !== "tgm";
    this.ensurePieceQueue(6);
  }

  advanceActivePiece() {
    this.ensurePieceQueue(6);
    this.currentType = this.queue[0] || null;
    this.queue = this.queue.slice(this.currentType ? 1 : 0);
  }

  ensurePieceQueue(minCount = 6) {
    while (this.queue.length < minCount) {
      this.queue.push(this.generatePiece());
    }
  }

  generatePiece() {
    if (this.pieceSource && typeof this.pieceSource.nextPiece === "function") {
      return this.pieceSource.nextPiece();
    }
    if (this.queueType === "tgm") {
      return this.generateTgmPiece();
    }
    return this.generateGuidelinePiece();
  }

  generateGuidelinePiece() {
    if (this.bagQueue.length === 0) {
      const bag = ["I", "J", "L", "O", "S", "T", "Z"];
      for (let i = bag.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [bag[i], bag[j]] = [bag[j], bag[i]];
      }
      this.bagQueue = bag;
    }
    return this.bagQueue.shift();
  }

  generateTgmPiece() {
    const types = ["I", "J", "L", "O", "S", "T", "Z"];
    let piece = "I";

    if (this.firstTgmPiece) {
      const firstPieces = ["I", "J", "L", "T"];
      piece = firstPieces[Math.floor(Math.random() * firstPieces.length)];
      this.firstTgmPiece = false;
    } else {
      let attempts = 0;
      do {
        piece = types[Math.floor(Math.random() * types.length)];
        attempts += 1;
      } while (this.pieceHistory.includes(piece) && attempts < 6);
    }

    this.pieceHistory.shift();
    this.pieceHistory.push(piece);
    return piece;
  }

  applyGarbage(rows) {
    const garbageRows = Math.max(0, Math.floor(rows));
    if (garbageRows <= 0) return;
    this.garbageHole = (this.garbageHole + 1 + Math.floor(Math.random() * Math.max(1, this.cols - 1))) % this.cols;
    for (let index = 0; index < garbageRows; index += 1) {
      const row = Array(this.cols).fill(1);
      const visualRow = Array(this.cols).fill(0x444444);
      row[this.garbageHole] = 0;
      visualRow[this.garbageHole] = 0;
      this.grid.shift();
      this.grid.push(row);
      this.visualGrid.shift();
      this.visualGrid.push(visualRow);
    }
  }

  resolvePendingGarbage(linesCleared, attack) {
    let remainingAttack = getNormalizedVersusGarbageQueue(attack);
    if (this.pendingGarbageEntries.length > 0 && remainingAttack > 0) {
      while (remainingAttack > 0 && this.pendingGarbageEntries.length > 0) {
        const head = getNormalizedVersusGarbageQueue(this.pendingGarbageEntries[0]);
        const canceled = Math.min(head, remainingAttack);
        const nextHead = head - canceled;
        remainingAttack -= canceled;
        if (nextHead > 0) {
          this.pendingGarbageEntries[0] = nextHead;
        } else {
          this.pendingGarbageEntries.shift();
        }
      }
    }
    if (Math.max(0, Math.floor(Number(linesCleared) || 0)) <= 0 && this.pendingGarbageEntries.length > 0) {
      let entryBudget = MAX_VERSUS_GARBAGE_ENTRY;
      while (entryBudget > 0 && this.pendingGarbageEntries.length > 0) {
        const head = getNormalizedVersusGarbageQueue(this.pendingGarbageEntries[0]);
        const incomingRows = Math.min(entryBudget, getIntegralVersusGarbageRows(head));
        if (incomingRows <= 0) break;
        this.applyGarbage(incomingRows);
        const nextHead = head - incomingRows;
        entryBudget -= incomingRows;
        if (nextHead > 0) {
          this.pendingGarbageEntries[0] = nextHead;
        } else {
          this.pendingGarbageEntries.shift();
        }
      }
    }
    return remainingAttack;
  }

  isToppedOut() {
    if (!Array.isArray(this.grid) || this.hiddenRows <= 0) return false;
    for (let row = 0; row < this.hiddenRows; row += 1) {
      if (this.grid[row]?.some((cell) => cell)) {
        return true;
      }
    }
    return false;
  }

  computeAttack(lines, isTSpin) {
    const baseTable = [0, 0, 1, 2, 4];
    const attackMultiplier = Math.max(1, Number(this.profile?.attackMultiplier) || 1);
    const isDifficult = (lines >= 4 || (isTSpin && lines > 0)) && lines > 0;
    let base = 0;

    if (isTSpin) {
      base = 2 * lines;
    } else {
      base = baseTable[lines] || 0;
    }

    if (this.backToBack && isDifficult) {
      base += 1;
    }

    if (lines > 0) {
      if (this.comboCount < 0) {
        this.comboCount = 0;
      } else {
        this.comboCount += 1;
      }
    } else {
      this.comboCount = -1;
    }

    const comboValue = Math.max(0, this.comboCount);
    let attack = base;
    if (base > 0 && comboValue > 0) {
      attack = Math.floor(base * (1 + 0.25 * comboValue));
    }

    if (lines > 0) {
      this.backToBack = isDifficult;
    }

    return Math.max(0, attack * attackMultiplier);
  }

  freezeScene() {
    if (typeof this.scene.showStaticEndScreen === "function") {
      this.ignoreNextGameOverCallback = true;
      this.scene.showStaticEndScreen({
        showTextImmediately: false,
        preserveBoardVisible: true,
        autoExitDelay: 3600,
      });
    }
    this.scene.versusActive = false;
  }

  finishRound(outcome, reason) {
    if (this.roundResolved) return;
    this.roundResolved = true;
    this.destroy();
    const roundNumber = this.getRoundNumber();
    const nextPlayerWins = this.playerWins + (outcome === "win" ? 1 : 0);
    const nextOpponentWins = this.opponentWins + (outcome === "loss" ? 1 : 0);
    const matchFinished =
      nextPlayerWins >= this.winsToFinish || nextOpponentWins >= this.winsToFinish;
    this.freezeScene();
    if (!matchFinished) {
      showVersusRoundTransition(this.scene, {
        outcome,
        reason,
        roundNumber,
        nextRound: roundNumber + 1,
        playerWins: nextPlayerWins,
        opponentWins: nextOpponentWins,
        winsToFinish: this.winsToFinish,
      });
      this.scene.time.delayedCall(1400, () => {
        const nextMatch = createLocalVersusAiMatchData(this.getModeId(), {
          roundNumber: roundNumber + 1,
          winsToFinish: this.winsToFinish,
          playerWins: nextPlayerWins,
          opponentWins: nextOpponentWins,
          drawRounds: this.drawRounds,
          aiRating: this.hiddenRating,
          aiMatchRating: this.matchRating,
          provisional: !!this.matchData?.provisional,
        });
        this.startNextRound(nextMatch);
      });
      return;
    }

    const ladderUpdate = recordLocalVersusAiMatch(outcome, roundNumber);
    const versusRating =
      typeof window !== "undefined" && window.achievementSystem?.recordVersusMatch
        ? window.achievementSystem.recordVersusMatch(outcome)
        : null;
    showVersusResult(this.scene, {
      localAi: true,
      outcome,
      reason,
      roundNumber,
      playerWins: nextPlayerWins,
      opponentWins: nextOpponentWins,
      winsToFinish: this.winsToFinish,
      ratingDelta: ladderUpdate.ratingDelta,
      oldRating: ladderUpdate.oldRating,
      newRating: ladderUpdate.newRating,
      oldRd: ladderUpdate.oldRd,
      newRd: ladderUpdate.newRd,
      ladderState: ladderUpdate.state,
      provisional: ladderUpdate.provisional,
      wasProvisional: ladderUpdate.wasProvisional,
      decisiveMatchesPlayed: ladderUpdate.state.matchesPlayed,
      versusRating,
      winnerId: outcome === "win" ? LOCAL_VERSUS_AI_PLAYER_ID : LOCAL_VERSUS_AI_OPPONENT_ID,
    });
  }

  finishDraw(reason) {
    if (this.roundResolved) return;
    this.roundResolved = true;
    this.destroy();
    const roundNumber = this.getRoundNumber();
    const nextDrawRounds = this.drawRounds + 1;
    this.freezeScene();
    showVersusTieRoundTransition(this.scene, {
      reason,
      roundNumber,
      nextRound: roundNumber + 1,
      rating: this.matchRating,
      provisional: !!this.matchData?.provisional,
      playerWins: this.playerWins,
      opponentWins: this.opponentWins,
      winsToFinish: this.winsToFinish,
    });
    this.scene.time.delayedCall(1400, () => {
      const nextMatch = createLocalVersusAiMatchData(this.getModeId(), {
        roundNumber: roundNumber + 1,
        winsToFinish: this.winsToFinish,
        playerWins: this.playerWins,
        opponentWins: this.opponentWins,
        drawRounds: nextDrawRounds,
        aiRating: this.hiddenRating,
        aiMatchRating: this.matchRating,
        provisional: !!this.matchData?.provisional,
      });
      this.startNextRound(nextMatch);
    });
  }

  pushBoardToHud() {
    if (!this.scene?.versusHUD) return;
    const visible = this.visualGrid.slice(Math.max(0, this.visualGrid.length - 20));
    this.scene.versusHUD.updateOpponentState({
      board: visible.map((row) => (Array.isArray(row) ? [...row] : [])),
      holdType: this.holdType,
      nextQueue: this.queue.slice(0, Math.max(1, Number(this.scene?.nextPiecesCount) || 1)),
      canHold: this.queueType !== "tgm",
      incomingGarbageQueue: this.getPendingGarbage(),
      rotationSystem: this.rotationSystem,
      stats: this.buildStatsPayload(),
    });
    if (this.scene.versusHUD.latencyText?.text !== "LOCAL AI") {
      this.scene.versusHUD.latencyText.setText("LOCAL AI");
    }
  }

  buildStatsPayload() {
    return buildVersusStatsPayload({
      currentTime: Math.max(0, Number(this.scene?.currentTime ?? this.currentTime) || 0),
      totalPiecesPlaced: this.totalPiecesPlaced,
      totalAttack: this.totalAttack,
      totalGarbageCleared: this.totalGarbageCleared,
    });
  }

  countGarbageLinesCleared(grid) {
    if (!Array.isArray(grid)) return 0;
    return grid.reduce((count, row) => {
      if (!Array.isArray(row) || !row.length) return count;
      const filled = row.every((cell) => cell);
      const hasGarbageCell = row.some((cell) => cell === 0x444444);
      return count + (filled && hasGarbageCell ? 1 : 0);
    }, 0);
  }

  placeVisualPlacement(placement, pieceType) {
    const nextGrid = cloneLocalVersusGrid(this.visualGrid);
    const color = getVersusPreviewColorForPiece(pieceType, this.rotationSystem);
    for (let row = 0; row < placement.shape.length; row += 1) {
      for (let col = 0; col < placement.shape[row].length; col += 1) {
        if (!placement.shape[row][col]) continue;
        const boardX = placement.x + col;
        const boardY = placement.y + row;
        if (boardY >= 0 && boardY < this.rows && boardX >= 0 && boardX < this.cols) {
          nextGrid[boardY][boardX] = color;
        }
      }
    }
    return nextGrid;
  }

  clearCompletedVisualRows(grid) {
    const remainingRows = cloneLocalVersusGrid(grid).filter((row) => !row.every((cell) => cell));
    while (remainingRows.length < this.rows) {
      remainingRows.unshift(Array(this.cols).fill(0));
    }
    return remainingRows;
  }

  destroy() {
    this.workerReady = false;
    this.inflightDecision = null;
    this.readyDecision = null;
    if (this.decisionWorker) {
      try {
        this.decisionWorker.terminate();
      } catch (error) {
      }
    }
    this.decisionWorker = null;
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
    this.serverUrl = data.serverUrl || getDefaultVersusServerUrl();
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

    // Versus medal display
    this.mrText = this.add
      .text(centerX, 90, "", {
        fontSize: "28px",
        fill: "#ffcc00",
        fontFamily: "Courier New",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    // Network event handlers
    this.networkManager.on("identified", (data) => {
      const mr = computeMRClient(data.rating);
      const versusMedal = getVersusMedalDisplay();
      this.ratingText.setText(
        data.provisional
          ? "Rating: ? (provisional)"
          : `Rating: ${data.rating}  |  Glicko: ${data.rating}  |  RD: ${data.rd}`
      );
      this.mrText.setText(versusMedal.label);
      this.mrText.setFill(versusMedal.color);
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
        const startScene =
          typeof startPreparedGameScene === "function"
            ? startPreparedGameScene
            : (scene, payload) => scene.scene.start("AssetLoaderScene", payload);
        startScene(this, {
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
    this.playerGarbageQueue = 0;
    this.opponentGarbageQueue = 0;
    this.latencyText = null;
    this.timerText = null;
    this.opponentNameText = null;
    this.oppRatingText = null;
    this.scoreText = null;
    this.connectionDot = null;
    this.connectionState = true;
    this.layoutMode = "mini";
    this.opponentHoldType = null;
    this.opponentQueue = [];
    this.opponentCanHold = false;
    this.opponentRotationSystem = "SRS";
    this.opponentStats = buildVersusStatsPayload();
    this.opponentStatsTextValues = {};
    this.opponentBoardSprites = [];
    this.opponentPreviewSprites = [];
  }

  create() {
    const scene = this.scene;
    this.container = scene.add.container(0, 0);
    const matchData = scene.versusMatchData || window.__versusMatchData || {};
    this.opponentNameText = scene.add
      .text(0, 0, "Opponent", {
        fontSize: "14px",
        fill: "#ffcc00",
        fontFamily: "Courier New",
        fontStyle: "bold",
      })
      .setOrigin(0, 0);
    this.container.add(this.opponentNameText);

    this.miniGraphics = scene.add.graphics();
    this.container.add(this.miniGraphics);

    this.garbageGraphics = scene.add.graphics();
    this.container.add(this.garbageGraphics);

    this.previewGraphics = scene.add.graphics();
    this.container.add(this.previewGraphics);

    this.latencyText = scene.add
      .text(0, 0, "-- ms", {
        fontSize: "11px",
        fill: "#666666",
        fontFamily: "Courier New",
      })
      .setOrigin(0, 0);
    this.container.add(this.latencyText);

    this.connectionDot = scene.add.graphics();
    this.container.add(this.connectionDot);

    this.timerText = scene.add
      .text(0, 0, "", {
        fontSize: "14px",
        fill: "#ffffff",
        fontFamily: "Courier New",
        fontStyle: "bold",
      })
      .setOrigin(0, 0);
    this.container.add(this.timerText);

    this.oppRatingText = scene.add
      .text(0, 0, "[?]", {
        fontSize: "12px",
        fill: "#888888",
        fontFamily: "Courier New",
      })
      .setOrigin(0, 0);
    this.container.add(this.oppRatingText);

    this.scoreText = scene.add
      .text(0, 0, "", {
        fontSize: "14px",
        fill: "#00ffff",
        fontFamily: "Courier New",
        fontStyle: "bold",
      })
      .setOrigin(0.5, 0);
    this.container.add(this.scoreText);

    this.opponentVsLabel = scene.add.text(0, 0, "VS", {}).setOrigin(1, 0);
    this.opponentVsScoreText = scene.add.text(0, 0, "0.00", {}).setOrigin(1, 0);
    this.opponentAttackLabel = scene.add.text(0, 0, "ATK", {}).setOrigin(1, 0);
    this.opponentAttackTotalText = scene.add.text(0, 0, "0", {}).setOrigin(1, 0);
    this.opponentAttackPerMinLabel = scene.add.text(0, 0, "ATK/MIN", {}).setOrigin(1, 0);
    this.opponentAttackPerMinText = scene.add.text(0, 0, "0.00", {}).setOrigin(1, 0);
    this.opponentAttackPerPieceLabel = scene.add.text(0, 0, "ATK/PIECE", {}).setOrigin(1, 0);
    this.opponentAttackPerPieceText = scene.add.text(0, 0, "0.00", {}).setOrigin(1, 0);
    this.opponentPieceCountLabel = scene.add.text(0, 0, "PIECES", {}).setOrigin(0, 0);
    this.opponentPieceCountText = scene.add.text(0, 0, "0", {}).setOrigin(0, 0);
    this.opponentPpsLabel = scene.add.text(0, 0, "PPS", {}).setOrigin(0, 0);
    this.opponentPpsText = scene.add.text(0, 0, "0.00", {}).setOrigin(0, 0);
    this.opponentRawPpsLabel = scene.add.text(0, 0, "RAW PPS", {}).setOrigin(0, 0);
    this.opponentRawPpsText = scene.add.text(0, 0, "0.00", {}).setOrigin(0, 0);
    [
      this.opponentVsLabel,
      this.opponentVsScoreText,
      this.opponentAttackLabel,
      this.opponentAttackTotalText,
      this.opponentAttackPerMinLabel,
      this.opponentAttackPerMinText,
      this.opponentAttackPerPieceLabel,
      this.opponentAttackPerPieceText,
      this.opponentPieceCountLabel,
      this.opponentPieceCountText,
      this.opponentPpsLabel,
      this.opponentPpsText,
      this.opponentRawPpsLabel,
      this.opponentRawPpsText,
    ].forEach((element) => this.container.add(element));

    this.container.setDepth(1000);
    this.updateMatchData(matchData);
    this.relayout();
    this.updateConnectionDot(true);
  }

  relayout() {
    if (!this.container) return;
    this.layoutMode = this.scene?.versusWideLayout ? "full" : "mini";
    const cellSize = this.layoutMode === "full"
      ? Math.max(14, this.scene?.cellSize || 20)
      : 6;
    const uiFontSize = Math.max(
      16,
      Math.min(24, Math.floor((this.scene?.cellSize || cellSize) * 0.8)),
    );
    const largeFontSize = Math.max(
      20,
      Math.min(32, Math.floor((this.scene?.cellSize || cellSize) * 1.2)),
    );
    const boardWidth = cellSize * 10;
    const boardHeight = cellSize * 20;
    const gridY = this.layoutMode === "full" ? 0 : 20;

    this.miniGridX = 0;
    this.miniGridY = gridY;
    this.miniCellSize = cellSize;
    this.garbageBarWidth = this.layoutMode === "full" ? Math.max(10, Math.floor(cellSize * 0.35)) : 6;

    if (this.layoutMode === "full") {
      const playerBoardX = Math.floor(this.scene?.borderOffsetX || 0);
      const opponentBoardX = Math.floor(this.scene?.versusOpponentBorderOffsetX || 0);
      const opponentMatrixX = Math.floor(
        Number.isFinite(this.scene?.versusOpponentMatrixOffsetX)
          ? this.scene.versusOpponentMatrixOffsetX
          : opponentBoardX + 17,
      );
      const boardY = Math.floor((this.scene?.borderOffsetY || 40) - 3);
      const opponentMatrixY = Math.floor(
        Number.isFinite(this.scene?.matrixOffsetY)
          ? this.scene.matrixOffsetY
          : boardY + 20,
      );
      const previewPanelX = opponentBoardX + boardWidth + 26;
      this.container.setPosition(0, 0);

      this.miniGridX = opponentMatrixX;
      this.miniGridY = opponentMatrixY + gridY;
      this.playerGarbageBarX = playerBoardX + boardWidth + 8;
      this.playerGarbageBarY = boardY + gridY;
      this.playerGarbageBarHeight = boardHeight;
      this.opponentGarbageBarX = opponentBoardX - this.garbageBarWidth - 8;
      this.opponentGarbageBarY = boardY + gridY;
      this.opponentGarbageBarHeight = boardHeight;
      this.opponentPreviewX = previewPanelX;
      this.opponentHoldX = previewPanelX;
      this.opponentHoldY = boardY + 2;
      this.opponentNextX = previewPanelX;
      this.opponentNextY = boardY + 112;
      const attackX = opponentBoardX - 16;
      const attackBaseY = boardY + Math.max(56, Math.floor(boardHeight * 0.3));
      const attackRow = Math.max(16, Math.floor((this.scene?.cellSize || cellSize) * 0.9));
      const ppsX = previewPanelX;
      const ppsY = boardY + boardHeight - 40;

      this.opponentNameText.setPosition(opponentBoardX + boardWidth / 2, boardY - 52).setOrigin(0.5, 0);
      this.oppRatingText.setPosition(opponentBoardX + boardWidth / 2, boardY - 28).setOrigin(0.5, 0);
      this.scoreText.setPosition(opponentBoardX + boardWidth / 2, boardY + gridY + boardHeight + 14).setOrigin(0.5, 0);
      this.latencyText.setPosition(opponentBoardX, boardY + gridY + boardHeight + 38).setOrigin(0, 0);
      this.timerText.setPosition(opponentBoardX + boardWidth, boardY + gridY + boardHeight + 38).setOrigin(1, 0);

      const attackLabelStyle = {
        fontSize: `${uiFontSize - 4}px`,
        fill: "#ffdd55",
        fontFamily: "Courier New",
        fontStyle: "bold",
        align: "right",
      };
      const attackValueStyle = {
        fontSize: `${largeFontSize}px`,
        fill: "#ffffff",
        fontFamily: "Courier New",
        fontStyle: "bold",
        align: "right",
      };
      const attackSubStyle = {
        fontSize: `${uiFontSize - 6}px`,
        fill: "#cccccc",
        fontFamily: "Courier New",
        fontStyle: "bold",
        align: "right",
      };
      const ppsLabelStyle = {
        fontSize: `${uiFontSize - 4}px`,
        fill: "#ffffff",
        fontFamily: "Courier New",
        fontStyle: "bold",
      };
      const ppsSubStyle = {
        fontSize: `${uiFontSize - 6}px`,
        fill: "#cccccc",
        fontFamily: "Courier New",
        fontStyle: "bold",
      };
      const ppsValueStyle = {
        fontSize: `${largeFontSize}px`,
        fill: "#ffffff",
        fontFamily: "Courier New",
        fontStyle: "bold",
        align: "left",
      };
      const ppsSubValueStyle = {
        fontSize: `${largeFontSize - 4}px`,
        fill: "#cccccc",
        fontFamily: "Courier New",
        fontStyle: "bold",
        align: "left",
      };

      this.opponentVsLabel.setPosition(attackX, attackBaseY).setStyle(attackLabelStyle);
      this.opponentVsScoreText.setPosition(attackX + 5, attackBaseY + attackRow).setStyle({
        ...attackValueStyle,
        fontSize: `${largeFontSize - 8}px`,
        fill: "#a0d8ff",
      });
      this.opponentAttackLabel
        .setPosition(attackX, attackBaseY + attackRow * 2)
        .setStyle(attackLabelStyle);
      this.opponentAttackTotalText
        .setPosition(attackX + 5, attackBaseY + attackRow * 3)
        .setStyle(attackValueStyle);
      this.opponentAttackPerMinLabel
        .setPosition(attackX, attackBaseY + attackRow * 4 + 4)
        .setStyle(attackSubStyle);
      this.opponentAttackPerMinText
        .setPosition(attackX + 5, attackBaseY + attackRow * 5 + 4)
        .setStyle({ ...attackSubStyle, fontSize: `${largeFontSize - 6}px`, fill: "#cccccc" });
      this.opponentAttackPerPieceLabel
        .setPosition(attackX, attackBaseY + attackRow * 6 + 8)
        .setStyle(attackSubStyle);
      this.opponentAttackPerPieceText
        .setPosition(attackX + 5, attackBaseY + attackRow * 7 + 8)
        .setStyle({ ...attackSubStyle, fontSize: `${largeFontSize - 6}px`, fill: "#cccccc" });

      this.opponentPieceCountLabel.setPosition(ppsX, ppsY - 45).setStyle(ppsSubStyle);
      this.opponentPieceCountText.setPosition(ppsX, ppsY - 30).setStyle({
        ...ppsValueStyle,
        fontSize: `${largeFontSize - 4}px`,
      });
      this.opponentPpsLabel.setPosition(ppsX, ppsY).setStyle(ppsLabelStyle);
      this.opponentPpsText.setPosition(ppsX, ppsY + 15).setStyle(ppsValueStyle);
      this.opponentRawPpsLabel.setPosition(ppsX, ppsY + 40).setStyle(ppsSubStyle);
      this.opponentRawPpsText.setPosition(ppsX, ppsY + 55).setStyle(ppsSubValueStyle);
    } else {
      const cam = this.scene?.cameras?.main;
      if (!cam) return;
      this.container.setPosition(cam.width - 180, 40);
      this.opponentNameText.setPosition(0, 0).setOrigin(0, 0);
      this.oppRatingText.setPosition(80, 0).setOrigin(0, 0);
      this.scoreText.setPosition(boardWidth / 2, gridY + boardHeight + 8).setOrigin(0.5, 0);
      this.latencyText.setPosition(0, gridY + boardHeight + 26).setOrigin(0, 0);
      this.timerText.setPosition(0, gridY + boardHeight + 42).setOrigin(0, 0);
      this.playerGarbageBarX = boardWidth + 4;
      this.playerGarbageBarY = gridY;
      this.playerGarbageBarHeight = boardHeight;
      this.opponentGarbageBarX = null;
      this.opponentGarbageBarY = null;
      this.opponentGarbageBarHeight = null;
      this.opponentHoldX = null;
      this.opponentHoldY = null;
      this.opponentNextX = null;
      this.opponentNextY = null;
    }

    this.scoreText.setVisible(this.scoreText.text.length > 0);
    if (this.opponentGrid.length > 0) {
      this.updateOpponentBoard(this.opponentGrid);
    } else {
      this.updateOpponentBoard(Array.from({ length: 20 }, () => Array(10).fill(0)));
    }
    this.updateGarbageBars();
    this.drawOpponentPreview();
    this.updateOpponentStatsDisplay();
    this.updateConnectionDot(this.connectionState);
  }

  updateMatchData(matchData = {}) {
    const opponent = matchData?.opponent || {};
    const opponentRatingValue = opponent?.rating;
    const oppRating = opponent?.provisional ? "?" : (opponentRatingValue ?? "?");
    if (this.opponentNameText) {
      const nextName = opponent?.name || "Opponent";
      if (this.opponentNameText.text !== nextName) {
        this.opponentNameText.setText(nextName);
      }
    }
    if (this.oppRatingText) {
      const nextRating = `[${oppRating}]`;
      if (this.oppRatingText.text !== nextRating) {
        this.oppRatingText.setText(nextRating);
      }
    }
    this.updateMatchScore(matchData);
  }

  updateMatchScore(matchData = {}) {
    if (!this.scoreText) return;
    const winsToFinish = Math.max(0, Number(matchData?.winsToFinish) || 0);
    if (winsToFinish <= 0) {
      if (this.scoreText.text !== "") {
        this.scoreText.setText("");
      }
      this.scoreText.setVisible(false);
      return;
    }
    const nextScore = `MATCH ${formatLocalVersusMatchScore(
      matchData?.playerWins,
      matchData?.opponentWins,
      winsToFinish,
    )}`;
    if (this.scoreText.text !== nextScore) {
      this.scoreText.setText(nextScore);
    }
    this.scoreText.setVisible(true);
  }

  updateOpponentBoard(boardData) {
    if (!this.miniGraphics || !boardData) return;
    this.opponentGrid = Array.isArray(boardData)
      ? boardData.map((row) => (Array.isArray(row) ? [...row] : []))
      : [];
    this.miniGraphics.clear();
    this.clearRenderedOpponentBoardSprites();

    const cs = this.miniCellSize;
    const ox = this.miniGridX;
    const oy = this.miniGridY;

    this.miniGraphics.fillStyle(this.layoutMode === "full" ? 0x000000 : 0x111111, 0.9);
    this.miniGraphics.fillRect(ox, oy, cs * 10, cs * 20);
    this.miniGraphics.lineStyle(
      this.layoutMode === "full" ? 3 : 1,
      this.layoutMode === "full"
        ? this.scene.getModeTypeBorderColor()
        : 0x444444,
    );
    this.miniGraphics.strokeRect(ox, oy, cs * 10, cs * 20);
    const textureKey = this.opponentRotationSystem === "ARS" ? "mino_ars" : "mino_srs";
    const hasTexture = !!(this.scene?.textures && this.scene.textures.exists(textureKey));

    for (let r = 0; r < 20 && r < boardData.length; r++) {
      const row = boardData[r];
      if (!row) continue;
      for (let c = 0; c < 10 && c < row.length; c++) {
        if (row[c] !== 0) {
          const tint = getVersusPreviewCellColor(row[c]);
          const drawX = ox + c * cs;
          const drawY = oy + r * cs;
          if (hasTexture) {
            const sprite = this.scene.add.sprite(drawX + cs / 2, drawY + cs / 2, textureKey);
            sprite.setDisplaySize(cs, cs);
            sprite.setTint(tint);
            sprite.setAlpha(0.92);
            this.container.add(sprite);
            this.opponentBoardSprites.push(sprite);
          } else {
            this.miniGraphics.fillStyle(tint, 0.92);
            this.miniGraphics.fillRect(drawX, drawY, cs, cs);
          }
        }
      }
    }
  }

  updateGarbageQueue(count) {
    this.updatePlayerGarbageQueue(count);
  }

  updatePlayerGarbageQueue(count) {
    this.playerGarbageQueue = Math.max(0, Number(count) || 0);
    this.updateGarbageBars();
  }

  updateOpponentGarbageQueue(count) {
    this.opponentGarbageQueue = Math.max(0, Number(count) || 0);
    this.updateGarbageBars();
  }

  updateGarbageBars() {
    if (!this.garbageGraphics) return;
    this.garbageGraphics.clear();

    const maxRows = 20;
    const barWidth = this.garbageBarWidth || 6;
    const cs = this.miniCellSize;
    const drawBar = (x, y, height, count) => {
      if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(height)) return;
      const filledRows = Math.min(Math.max(0, Number(count) || 0), maxRows);
      this.garbageGraphics.fillStyle(0x222222, 1);
      this.garbageGraphics.fillRect(x, y, barWidth, height);
      if (filledRows > 0) {
        const fillHeight = filledRows * cs;
        this.garbageGraphics.fillStyle(0xff0000, 0.82);
        this.garbageGraphics.fillRect(
          x,
          y + height - fillHeight,
          barWidth,
          fillHeight,
        );
      }
    };

    drawBar(
      this.playerGarbageBarX,
      this.playerGarbageBarY,
      this.playerGarbageBarHeight,
      this.playerGarbageQueue,
    );
    if (this.layoutMode === "full") {
      drawBar(
        this.opponentGarbageBarX,
        this.opponentGarbageBarY,
        this.opponentGarbageBarHeight,
        this.opponentGarbageQueue,
      );
    }
  }

  updateOpponentState(payload = {}) {
    if (Array.isArray(payload)) {
      this.updateOpponentBoard(payload);
      return;
    }
    if (Array.isArray(payload.board)) {
      this.updateOpponentBoard(payload.board);
    }
    if (Object.prototype.hasOwnProperty.call(payload, "incomingGarbageQueue")) {
      this.updateOpponentGarbageQueue(payload.incomingGarbageQueue);
    }
    if (Array.isArray(payload.nextQueue)) {
      this.opponentQueue = payload.nextQueue
        .map(normalizeVersusPieceType)
        .filter(Boolean);
    }
    if (Object.prototype.hasOwnProperty.call(payload, "holdType")) {
      this.opponentHoldType = normalizeVersusPieceType(payload.holdType);
    }
    if (Object.prototype.hasOwnProperty.call(payload, "canHold")) {
      this.opponentCanHold = !!payload.canHold;
    }
    if (typeof payload.rotationSystem === "string") {
      this.opponentRotationSystem = payload.rotationSystem;
    }
    if (payload.stats && typeof payload.stats === "object") {
      this.updateOpponentStats(payload.stats);
    }
    this.drawOpponentPreview();
  }

  updateOpponentStats(stats = {}) {
    this.opponentStats = buildVersusStatsPayload(stats);
    this.updateOpponentStatsDisplay();
  }

  updateOpponentStatsDisplay() {
    const metricElements = [
      this.opponentVsLabel,
      this.opponentVsScoreText,
      this.opponentAttackLabel,
      this.opponentAttackTotalText,
      this.opponentAttackPerMinLabel,
      this.opponentAttackPerMinText,
      this.opponentAttackPerPieceLabel,
      this.opponentAttackPerPieceText,
      this.opponentPieceCountLabel,
      this.opponentPieceCountText,
      this.opponentPpsLabel,
      this.opponentPpsText,
      this.opponentRawPpsLabel,
      this.opponentRawPpsText,
    ];
    if (!metricElements.every(Boolean)) return;
    const showStats = this.layoutMode === "full";
    metricElements.forEach((element) => element.setVisible(showStats));
    if (!showStats) return;
    const stats = this.opponentStats || buildVersusStatsPayload();
    const formatFixed = (value, digits = 2) =>
      Number.isFinite(value) ? value.toFixed(digits) : "--";
    const formatInt = (value) =>
      Number.isFinite(value) ? `${Math.floor(value)}` : "--";
    const setMetricValue = (key, element, text) => {
      if (!element) return;
      if (this.opponentStatsTextValues[key] === text) return;
      this.opponentStatsTextValues[key] = text;
      element.setText(text);
    };
    setMetricValue("vsScore", this.opponentVsScoreText, formatFixed(stats.vsScore));
    setMetricValue("attackTotal", this.opponentAttackTotalText, formatInt(stats.attackTotal));
    setMetricValue("attackPerMin", this.opponentAttackPerMinText, formatFixed(stats.attackPerMin));
    setMetricValue("attackPerPiece", this.opponentAttackPerPieceText, formatFixed(stats.attackPerPiece));
    setMetricValue("pieceCount", this.opponentPieceCountText, formatInt(stats.pieceCount));
    setMetricValue("pps", this.opponentPpsText, formatFixed(stats.pps));
    setMetricValue("rawPps", this.opponentRawPpsText, formatFixed(stats.rawPps));
  }

  drawOpponentPreview() {
    if (!this.previewGraphics) return;
    this.previewGraphics.clear();
    this.clearRenderedOpponentPreviewSprites();
    if (this.layoutMode !== "full") {
      if (this.opponentHoldLabel) this.opponentHoldLabel.setVisible(false);
      if (this.opponentNextLabel) this.opponentNextLabel.setVisible(false);
      return;
    }

    const previewCellSize = Math.max(8, Math.floor((this.scene?.cellSize || 20) * 0.55));
    const titleStyle = {
      fontSize: `${Math.max(12, Math.floor(previewCellSize * 0.9))}px`,
      fill: "#ffffff",
      fontFamily: "Courier New",
      fontStyle: "bold",
    };

    if (this.opponentCanHold || this.opponentHoldType) {
      this.ensurePreviewLabel("opponentHoldLabel", "HOLD", this.opponentHoldX, this.opponentHoldY, titleStyle);
      this.drawPreviewPiece(
        this.opponentHoldType,
        this.opponentHoldX,
        this.opponentHoldY + 22,
        previewCellSize,
        this.opponentRotationSystem,
      );
    } else if (this.opponentHoldLabel) {
      this.opponentHoldLabel.setVisible(false);
    }

    this.ensurePreviewLabel("opponentNextLabel", "NEXT", this.opponentNextX, this.opponentNextY, titleStyle);
    this.opponentQueue.slice(0, 5).forEach((pieceType, index) => {
      this.drawPreviewPiece(
        pieceType,
        this.opponentNextX,
        this.opponentNextY + 22 + index * (previewCellSize * 3 + 6),
        previewCellSize,
        this.opponentRotationSystem,
      );
    });
  }

  ensurePreviewLabel(key, text, x, y, style) {
    const existingLabel = this[key];
    const needsRecreate =
      !existingLabel ||
      !existingLabel.scene ||
      existingLabel.active === false ||
      !existingLabel.canvas ||
      !existingLabel.context;
    if (needsRecreate) {
      if (existingLabel && typeof existingLabel.destroy === "function") {
        try {
          existingLabel.destroy();
        } catch (error) {
        }
      }
      this[key] = this.scene.add.text(x, y, text, style).setOrigin(0, 0);
      this[key].__versusStyleKey = JSON.stringify(style);
      this.container.add(this[key]);
      return;
    }
    if (this[key].text !== text) {
      this[key].setText(text);
    }
    const styleKey = JSON.stringify(style);
    if (this[key].__versusStyleKey !== styleKey) {
      this[key].setStyle(style);
      this[key].__versusStyleKey = styleKey;
    }
    if (this[key].x !== x || this[key].y !== y) {
      this[key].setPosition(x, y);
    }
    this[key].setVisible(true);
  }

  drawPreviewPiece(pieceType, x, y, cellSize, rotationSystem = "SRS") {
    const normalizedType = normalizeVersusPieceType(pieceType);
    if (!normalizedType) return;
    const rotationSet =
      typeof RotationSystems !== "undefined"
        ? RotationSystems.getRotations(normalizedType, rotationSystem)
        : rotationSystem === "ARS"
          ? SEGA_ROTATIONS?.[normalizedType]?.rotations
          : TETROMINOES?.[normalizedType]?.rotations;
    const shape = Array.isArray(rotationSet) ? rotationSet[0] : null;
    if (!Array.isArray(shape)) return;

    const occupied = [];
    for (let row = 0; row < shape.length; row += 1) {
      for (let col = 0; col < shape[row].length; col += 1) {
        if (shape[row][col]) occupied.push({ row, col });
      }
    }
    if (!occupied.length) return;

    const minRow = Math.min(...occupied.map((cell) => cell.row));
    const maxRow = Math.max(...occupied.map((cell) => cell.row));
    const minCol = Math.min(...occupied.map((cell) => cell.col));
    const maxCol = Math.max(...occupied.map((cell) => cell.col));
    const width = maxCol - minCol + 1;
    const height = maxRow - minRow + 1;
    const offsetX = x + ((4 - width) * cellSize) / 2;
    const offsetY = y + ((2.5 - height) * cellSize) / 2;
    const color = getVersusPreviewColorForPiece(normalizedType, rotationSystem);
    const textureKey =
      typeof RotationSystems !== "undefined"
        ? RotationSystems.getTextureKey(rotationSystem)
        : rotationSystem === "ARS"
          ? "mino_ars"
          : "mino_srs";
    const hasTexture = !!(this.scene?.textures && this.scene.textures.exists(textureKey));

    occupied.forEach((cell) => {
      const drawX = offsetX + (cell.col - minCol) * cellSize;
      const drawY = offsetY + (cell.row - minRow) * cellSize;
      if (hasTexture) {
        const sprite = this.scene.add.sprite(drawX + cellSize / 2, drawY + cellSize / 2, textureKey);
        sprite.setDisplaySize(cellSize, cellSize);
        sprite.setTint(color);
        sprite.setAlpha(0.94);
        this.container.add(sprite);
        this.opponentPreviewSprites.push(sprite);
      } else {
        this.previewGraphics.fillStyle(color, 0.94);
        this.previewGraphics.fillRect(drawX, drawY, cellSize - 1, cellSize - 1);
        this.previewGraphics.lineStyle(1, 0x111111, 0.5);
        this.previewGraphics.strokeRect(drawX, drawY, cellSize - 1, cellSize - 1);
      }
    });
  }

  clearRenderedOpponentBoardSprites() {
    if (!Array.isArray(this.opponentBoardSprites)) return;
    this.opponentBoardSprites.forEach((sprite) => {
      if (sprite && typeof sprite.destroy === "function") sprite.destroy();
    });
    this.opponentBoardSprites = [];
  }

  clearRenderedOpponentPreviewSprites() {
    if (!Array.isArray(this.opponentPreviewSprites)) return;
    this.opponentPreviewSprites.forEach((sprite) => {
      if (sprite && typeof sprite.destroy === "function") sprite.destroy();
    });
    this.opponentPreviewSprites = [];
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
    this.connectionState = connected !== false;
    this.connectionDot.clear();
    this.connectionDot.fillStyle(this.connectionState ? 0x00ff00 : 0xff0000, 1);
    const x =
      this.layoutMode === "full"
        ? Math.max(10, (this.scene?.versusOpponentBorderOffsetX || 0) + ((this.scene?.cellSize || 20) * 10) - 6)
        : 150;
    const y = this.layoutMode === "full"
      ? Math.max(10, (this.scene?.borderOffsetY || 40) - 18)
      : 6;
    this.connectionDot.fillCircle(x, y, 4);
  }

  destroy() {
    this.clearRenderedOpponentBoardSprites();
    this.clearRenderedOpponentPreviewSprites();
    if (this.container) {
      this.container.destroy(true);
      this.container = null;
    }
    this.miniGraphics = null;
    this.garbageGraphics = null;
    this.previewGraphics = null;
    this.latencyText = null;
    this.timerText = null;
    this.opponentNameText = null;
    this.oppRatingText = null;
    this.scoreText = null;
    this.connectionDot = null;
    this.opponentHoldLabel = null;
    this.opponentNextLabel = null;
    this.opponentVsLabel = null;
    this.opponentVsScoreText = null;
    this.opponentAttackLabel = null;
    this.opponentAttackTotalText = null;
    this.opponentAttackPerMinLabel = null;
    this.opponentAttackPerMinText = null;
    this.opponentAttackPerPieceLabel = null;
    this.opponentAttackPerPieceText = null;
    this.opponentPieceCountLabel = null;
    this.opponentPieceCountText = null;
    this.opponentPpsLabel = null;
    this.opponentPpsText = null;
    this.opponentRawPpsLabel = null;
    this.opponentRawPpsText = null;
    this.opponentStatsTextValues = {};
  }
}

// ---------------------------------------------------------------------------
// Versus integration helpers for GameScene
// ---------------------------------------------------------------------------
function cleanupVersusMode(gameScene) {
  if (!gameScene) return;
  const nm = gameScene.networkManager;
  if (nm && typeof nm.off === "function" && Array.isArray(gameScene.versusNetworkListeners)) {
    gameScene.versusNetworkListeners.forEach(({ event, handler }) => {
      nm.off(event, handler);
    });
  }
  gameScene.versusNetworkListeners = [];
  if (gameScene.versusHUD && typeof gameScene.versusHUD.destroy === "function") {
    try {
      gameScene.versusHUD.destroy();
    } catch (error) {
    }
  }
  if (gameScene.versusController && typeof gameScene.versusController.destroy === "function") {
    try {
      gameScene.versusController.destroy();
    } catch (error) {
    }
  }
  gameScene.versusHUD = null;
  gameScene.versusController = null;
  gameScene.networkManager = null;
  gameScene.versusMatchData = null;
  gameScene.versusMatchResult = null;
  gameScene.versusGarbageQueue = 0;
  gameScene.versusGarbageChunks = [];
  gameScene.versusGarbageHoleCol = null;
  gameScene.versusBoardTimer = 0;
  gameScene.versusSeed = null;
  gameScene.versusPieceSource = null;
  gameScene.versusActive = false;
}

function initVersusMode(gameScene) {
  cleanupVersusMode(gameScene);
  const modeConfig =
    gameScene.gameMode && typeof gameScene.gameMode.getConfig === "function"
      ? gameScene.gameMode.getConfig()
      : {};
  const specialMechanics = modeConfig?.specialMechanics || {};
  const matchData =
    window.__versusMatchData ||
    (specialMechanics.versus
      ? {
        modeId: typeof gameScene.gameMode?.getModeId === "function"
          ? gameScene.gameMode.getModeId()
          : gameScene.selectedMode,
        queueType: specialMechanics.versusType || "guideline",
        seed: window.__minoNetworkManager?.seed || Date.now(),
        startTimestamp: window.__minoNetworkManager?.matchStartTimestamp || Date.now(),
        opponent: window.__minoNetworkManager?.opponent || { name: "Opponent" },
      }
      : null);
  if (!matchData) return;
  gameScene.versusMatchData = { ...matchData };
  gameScene.networkManager = null;
  gameScene.versusController = null;
  gameScene.versusActive = true;
  gameScene.versusGarbageQueue = 0;
  gameScene.versusGarbageChunks = [];
  gameScene.versusGarbageHoleCol = null;
  gameScene.versusSeed = matchData.seed;
  gameScene.versusPieceSource = createVersusPieceSourceForScene(gameScene, matchData);

  // Create VersusHUD
  gameScene.versusHUD = new VersusHUD(gameScene);
  gameScene.versusHUD.create();
  if (typeof gameScene.versusHUD.updateMatchData === "function") {
    gameScene.versusHUD.updateMatchData(matchData);
  }
  if (typeof gameScene.versusHUD.updatePlayerGarbageQueue === "function") {
    gameScene.versusHUD.updatePlayerGarbageQueue(0);
  }

  // Board update interval (send state snapshot to opponent every 500ms)
  gameScene.versusBoardTimer = 0;

  if (matchData.localAi) {
    gameScene.versusController = new LocalVersusAiController(gameScene, matchData);
    window.__versusMatchData = null;
    return;
  }

  const nm = window.__minoNetworkManager;
  if (!nm) {
    gameScene.versusActive = false;
    window.__versusMatchData = null;
    return;
  }

  gameScene.networkManager = nm;
  gameScene.versusNetworkListeners = [];

  const registerNetworkListener = (event, handler) => {
    nm.on(event, handler);
    gameScene.versusNetworkListeners.push({ event, handler });
  };

  // Network event listeners for GameScene
  registerNetworkListener("garbage_incoming", (data) => {
    if (Array.isArray(data?.chunks) && data.chunks.length > 0) {
      enqueuePlayerVersusGarbageChunks(gameScene, data.chunks);
      return;
    }
    enqueuePlayerVersusGarbage(gameScene, data?.rows, data?.hole ?? data?.holeCol);
  });

  registerNetworkListener("opponent_board_update", (payload) => {
    if (gameScene.versusHUD) {
      gameScene.versusHUD.updateOpponentState(payload);
    }
  });

  registerNetworkListener("latency", (ms) => {
    if (gameScene.versusHUD) {
      gameScene.versusHUD.updateLatency(ms);
    }
  });

  registerNetworkListener("opponent_disconnected", () => {
    if (gameScene.versusHUD) {
      gameScene.versusHUD.updateConnectionDot(false);
    }
  });

  registerNetworkListener("opponent_reconnected", () => {
    if (gameScene.versusHUD) {
      gameScene.versusHUD.updateConnectionDot(true);
    }
  });

  registerNetworkListener("request_checksum", () => {
    if (gameScene.board && gameScene.board.grid) {
      const checksum = computeBoardChecksum(gameScene.board.grid);
      nm.sendBoardChecksum(checksum);
    }
  });

  registerNetworkListener("match_end", (data) => {
    gameScene.versusMatchResult = data;
    showVersusResult(gameScene, data);
  });

  // Clear match data so it doesn't persist
  window.__versusMatchData = null;
}

function updateVersusMode(gameScene, deltaTime) {
  if (!gameScene.versusActive) return;

  if (gameScene.versusController && typeof gameScene.versusController.update === "function") {
    gameScene.versusController.update(deltaTime);
  }

  if (!gameScene.networkManager) {
    if (
      gameScene.versusHUD &&
      gameScene.gameMode &&
      typeof gameScene.gameMode.getRemainingTime === "function"
    ) {
      gameScene.versusHUD.updateTimer(gameScene.gameMode.getRemainingTime());
    }
    return;
  }

  // Periodic board updates to opponent
  gameScene.versusBoardTimer = (gameScene.versusBoardTimer || 0) + deltaTime;
  if (gameScene.versusBoardTimer >= 0.5) {
    gameScene.versusBoardTimer = 0;
    if (gameScene.board && gameScene.board.grid) {
      gameScene.networkManager.sendBoardUpdate(buildVersusPreviewPayload(gameScene));
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
  gameScene.versusMatchResult = data;
  gameScene.preserveVersusBgmAcrossSceneChange = false;
  window.__minoPreservedVersusBgm = null;
  if (typeof gameScene.stopAllBGMs === "function") {
    gameScene.stopAllBGMs();
  } else if (typeof gameScene.stopCurrentBGM === "function") {
    gameScene.stopCurrentBGM();
  }
  const centerX = gameScene.cameras.main.width / 2;
  const centerY = gameScene.cameras.main.height / 2;
  const isLocalAi = data?.localAi === true;
  const won = isLocalAi
    ? data.outcome === "win"
    : data.winnerId === gameScene.networkManager?.playerId;
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

  const deltaValue = Number(data.ratingDelta) || 0;
  const deltaStr = deltaValue >= 0 ? `+${deltaValue}` : `${deltaValue}`;
  const versusMedal = getVersusMedalDisplay();
  const mrLine = `Versus ${versusMedal.label}`;

  gameScene.add
    .text(centerX, centerY - 10, mrLine, {
      fontSize: "28px",
      fill: versusMedal.color,
      fontFamily: "Courier New",
      fontStyle: "bold",
    })
    .setOrigin(0.5)
    .setDepth(2001);

  const ratingLine = isLocalAi
    ? (
      data.provisional
        ? `Calibration: ${Math.max(0, Number(data.decisiveMatchesPlayed) || 0)}/${LOCAL_VERSUS_AI_PROVISIONAL_MATCHES} decisive matches`
        : `AI: ${formatLocalVersusAiRating(data.oldRating)} -> ${formatLocalVersusAiRating(data.newRating)} (${deltaStr})  |  RD: ${normalizeLocalVersusAiRd(data.newRd).toFixed(1)}`
    )
    : data.provisional
      ? `Rating: ? (provisional) (${deltaStr})`
      : `Glicko: ${data.newRating} (${deltaStr})  |  RD: ${data.newRd}`;

  gameScene.add
    .text(centerX, centerY + 20, ratingLine, {
      fontSize: "16px",
      fill: "#ffffff",
      fontFamily: "Courier New",
    })
    .setOrigin(0.5)
    .setDepth(2001);

  const reasonMap = { topout: "Top Out", disconnect: "Disconnect", time_expired: "Time Up" };
  if (isLocalAi) {
    gameScene.add
      .text(
        centerX,
        centerY + 50,
        `Match: ${formatLocalVersusMatchScore(data.playerWins, data.opponentWins, data.winsToFinish)}`,
        {
          fontSize: "16px",
          fill: "#00ffff",
          fontFamily: "Courier New",
          fontStyle: "bold",
        },
      )
      .setOrigin(0.5)
      .setDepth(2001);
  }

  gameScene.add
    .text(centerX, centerY + (isLocalAi ? 76 : 50), `Reason: ${reasonMap[data.reason] || data.reason}`, {
      fontSize: "14px",
      fill: "#888888",
      fontFamily: "Courier New",
    })
    .setOrigin(0.5)
    .setDepth(2001);

  if (isLocalAi && data.ladderState) {
    gameScene.add
      .text(
        centerX,
        centerY + 98,
        `Match Record: W ${data.ladderState.wins}  L ${data.ladderState.losses}`,
        {
          fontSize: "14px",
          fill: "#ffffff",
          fontFamily: "Courier New",
        },
      )
      .setOrigin(0.5)
      .setDepth(2001);

    const footerLine = data.provisional
      ? `Rating unlocks after ${LOCAL_VERSUS_AI_PROVISIONAL_MATCHES} decisive matches`
      : `Matches: ${data.ladderState.matchesPlayed}  |  Rounds: ${data.ladderState.roundsPlayed}`;

    gameScene.add
      .text(centerX, centerY + 120, footerLine, {
        fontSize: "12px",
        fill: "#888888",
        fontFamily: "Courier New",
      })
      .setOrigin(0.5)
      .setDepth(2001);
  }

  // Return to menu button
  const menuBtn = gameScene.add
    .text(centerX, centerY + (isLocalAi ? 152 : 100), "[ RETURN TO MENU ]", {
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

function showVersusRoundTransition(gameScene, data) {
  const centerX = gameScene.cameras.main.width / 2;
  const centerY = gameScene.cameras.main.height / 2;
  const reasonMap = { topout: "Top Out", disconnect: "Disconnect", time_expired: "Time Up" };
  const won = data?.outcome === "win";

  const overlay = gameScene.add.graphics();
  overlay.fillStyle(0x000000, 0.7);
  overlay.fillRect(0, 0, gameScene.cameras.main.width, gameScene.cameras.main.height);
  overlay.setDepth(2000);

  gameScene.add
    .text(centerX, centerY - 56, won ? "ROUND WIN" : "ROUND LOSS", {
      fontSize: "46px",
      fill: won ? "#00ff88" : "#ff4444",
      fontFamily: "Courier New",
      fontStyle: "bold",
      stroke: "#000",
      strokeThickness: 4,
    })
    .setOrigin(0.5)
    .setDepth(2001);

  gameScene.add
    .text(
      centerX,
      centerY - 6,
      `Match: ${formatLocalVersusMatchScore(data.playerWins, data.opponentWins, data.winsToFinish)}`,
      {
        fontSize: "18px",
        fill: "#ffffff",
        fontFamily: "Courier New",
      },
    )
    .setOrigin(0.5)
    .setDepth(2001);

  gameScene.add
    .text(centerX, centerY + 24, `Reason: ${reasonMap[data.reason] || data.reason}`, {
      fontSize: "14px",
      fill: "#888888",
      fontFamily: "Courier New",
    })
    .setOrigin(0.5)
    .setDepth(2001);

  gameScene.add
    .text(centerX, centerY + 58, `Proceeding to round ${data.nextRound}...`, {
      fontSize: "18px",
      fill: "#00ffff",
      fontFamily: "Courier New",
      fontStyle: "bold",
    })
    .setOrigin(0.5)
    .setDepth(2001);
}

function showVersusTieRoundTransition(gameScene, data) {
  const centerX = gameScene.cameras.main.width / 2;
  const centerY = gameScene.cameras.main.height / 2;
  const reasonMap = { topout: "Top Out", disconnect: "Disconnect", time_expired: "Time Up" };

  const overlay = gameScene.add.graphics();
  overlay.fillStyle(0x000000, 0.7);
  overlay.fillRect(0, 0, gameScene.cameras.main.width, gameScene.cameras.main.height);
  overlay.setDepth(2000);

  gameScene.add
    .text(centerX, centerY - 56, "DRAW", {
      fontSize: "48px",
      fill: "#ffcc00",
      fontFamily: "Courier New",
      fontStyle: "bold",
      stroke: "#000",
      strokeThickness: 4,
    })
    .setOrigin(0.5)
    .setDepth(2001);

  gameScene.add
    .text(
      centerX,
      centerY - 6,
      data.provisional
        ? `Round ${data.roundNumber} tied`
        : `Round ${data.roundNumber} tied at ${formatLocalVersusAiMatchLabel(data.rating)}`,
      {
        fontSize: "18px",
        fill: "#ffffff",
        fontFamily: "Courier New",
      },
    )
    .setOrigin(0.5)
    .setDepth(2001);

  gameScene.add
    .text(
      centerX,
      centerY + 24,
      `Match: ${formatLocalVersusMatchScore(data.playerWins, data.opponentWins, data.winsToFinish)}`,
      {
        fontSize: "16px",
        fill: "#00ffff",
        fontFamily: "Courier New",
        fontStyle: "bold",
      },
    )
    .setOrigin(0.5)
    .setDepth(2001);

  gameScene.add
    .text(centerX, centerY + 48, `Reason: ${reasonMap[data.reason] || data.reason}`, {
      fontSize: "14px",
      fill: "#888888",
      fontFamily: "Courier New",
    })
    .setOrigin(0.5)
    .setDepth(2001);

  gameScene.add
    .text(centerX, centerY + 82, `Proceeding to round ${data.nextRound}...`, {
      fontSize: "18px",
      fill: "#00ffff",
      fontFamily: "Courier New",
      fontStyle: "bold",
    })
    .setOrigin(0.5)
    .setDepth(2001);
}

// Initialize game after all classes are defined
