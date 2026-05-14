// Self-contained Glicko-2 implementation
// Reference: Mark Glickman, "Example of the Glicko-2 System" (2013)

const TAU = 0.5; // System constant (controls volatility change)
const EPSILON = 0.000001;
const GLICKO2_SCALE = 173.7178;

// Default new-player values
const DEFAULT_RATING = 1500;
const DEFAULT_RD = 350;
const DEFAULT_VOLATILITY = 0.06;
const PROVISIONAL_GAMES = 10;

function toGlicko2(rating, rd) {
  return {
    mu: (rating - 1500) / GLICKO2_SCALE,
    phi: rd / GLICKO2_SCALE,
  };
}

function fromGlicko2(mu, phi) {
  return {
    rating: mu * GLICKO2_SCALE + 1500,
    rd: phi * GLICKO2_SCALE,
  };
}

function g(phi) {
  return 1 / Math.sqrt(1 + (3 * phi * phi) / (Math.PI * Math.PI));
}

function E(mu, muJ, phiJ) {
  return 1 / (1 + Math.exp(-g(phiJ) * (mu - muJ)));
}

function computeVariance(mu, opponents) {
  let sum = 0;
  for (const opp of opponents) {
    const gPhi = g(opp.phi);
    const e = E(mu, opp.mu, opp.phi);
    sum += gPhi * gPhi * e * (1 - e);
  }
  return 1 / sum;
}

function computeDelta(mu, opponents, v) {
  let sum = 0;
  for (const opp of opponents) {
    const gPhi = g(opp.phi);
    const e = E(mu, opp.mu, opp.phi);
    sum += gPhi * (opp.score - e);
  }
  return v * sum;
}

function newVolatility(sigma, delta, phi, v) {
  const a = Math.log(sigma * sigma);
  const phiSq = phi * phi;
  const deltaSq = delta * delta;

  function f(x) {
    const ex = Math.exp(x);
    const d = phiSq + v + ex;
    const p1 = (ex * (deltaSq - phiSq - v - ex)) / (2 * d * d);
    const p2 = (x - a) / (TAU * TAU);
    return p1 - p2;
  }

  let A = a;
  let B;
  if (deltaSq > phiSq + v) {
    B = Math.log(deltaSq - phiSq - v);
  } else {
    let k = 1;
    while (f(a - k * TAU) < 0) k++;
    B = a - k * TAU;
  }

  let fA = f(A);
  let fB = f(B);

  while (Math.abs(B - A) > EPSILON) {
    const C = A + ((A - B) * fA) / (fB - fA);
    const fC = f(C);
    if (fC * fB <= 0) {
      A = B;
      fA = fB;
    } else {
      fA = fA / 2;
    }
    B = C;
    fB = fC;
  }

  return Math.exp(A / 2);
}

/**
 * Update a single player's rating after one match.
 * @param {object} player  { rating, rd, volatility, gamesPlayed }
 * @param {object} opponent { rating, rd }
 * @param {number} score   1 = win, 0 = loss, 0.5 = draw
 * @returns {object} updated player { rating, rd, volatility, gamesPlayed }
 */
function updateRating(player, opponent, score) {
  const p = toGlicko2(player.rating, player.rd);
  const o = toGlicko2(opponent.rating, opponent.rd);
  o.score = score;

  const v = computeVariance(p.mu, [o]);
  const delta = computeDelta(p.mu, [o], v);
  const sigmaNew = newVolatility(player.volatility, delta, p.phi, v);

  const phiStar = Math.sqrt(p.phi * p.phi + sigmaNew * sigmaNew);
  const phiNew = 1 / Math.sqrt(1 / (phiStar * phiStar) + 1 / v);
  const muNew = p.mu + phiNew * phiNew * g(o.phi) * (score - E(p.mu, o.mu, o.phi));

  const result = fromGlicko2(muNew, phiNew);
  return {
    rating: Math.round(result.rating),
    rd: Math.round(result.rd * 10) / 10,
    volatility: sigmaNew,
    gamesPlayed: (player.gamesPlayed || 0) + 1,
  };
}

function createNewPlayer() {
  return {
    rating: DEFAULT_RATING,
    rd: DEFAULT_RD,
    volatility: DEFAULT_VOLATILITY,
    gamesPlayed: 0,
  };
}

function isProvisional(player) {
  return (player.gamesPlayed || 0) < PROVISIONAL_GAMES;
}

module.exports = {
  updateRating,
  createNewPlayer,
  isProvisional,
  DEFAULT_RATING,
  DEFAULT_RD,
  DEFAULT_VOLATILITY,
  PROVISIONAL_GAMES,
};
