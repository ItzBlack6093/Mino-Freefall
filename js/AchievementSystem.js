// AchievementSystem - Persistent player profile and achievement tracking
// Handles achievement registry, scoring, persistence, and detection

class AchievementSystem {
  constructor() {
    this.achievements = this.defineAchievements();
    this.ratingStorageKey = "mino_rating_profile_v1";
    this.ratingRunsStorageKey = "mino_rating_runs_v1";
    this.ratingMigrationKey = "mino_rating_runs_migrated_v1";
    this.ratingSkillsets = ["guideline", "grade", "20g", "bravo", "versus"];
    this.ratingStarProgressThreshold = 10;
    this.ratingMedalTiers = [
      { id: "white", label: "White", cap: 1, value: 1, color: "#f2f2f2" },
      { id: "green", label: "Green", cap: 2, value: 2, color: "#00e676" },
      { id: "blue", label: "Blue", cap: 3, value: 3, color: "#2d8cff" },
      { id: "purple", label: "Purple", cap: 5, value: 4, color: "#b84dff" },
      { id: "gold", label: "Gold", cap: 7, value: 5, color: "#ffcc33" },
      { id: "red", label: "Red", cap: Infinity, value: 6, color: "#ff4040" }
    ];
    this.ratingGradeCosts = {
      F: 1,
      E: 1,
      D: 2,
      C: 3,
      B: 4,
      A: 5,
      S: 6,
      SS: 7,
      U: 8,
      X: 10
    };
    this.ratingMilestones = this.defineRatingMilestones();
    this.loadFromStorage();
    this.ensureRatingProfile();
  }

  getDefaultRatingMedal() {
    return {
      tier: "white",
      tierIndex: 0,
      stars: 0,
      gauge: 0,
      wins: 0,
      losses: 0,
    };
  }

  getDefaultRatingProfile() {
    const medals = {};
    this.ratingSkillsets.forEach((skillset) => {
      medals[skillset] = this.getDefaultRatingMedal();
    });
    return {
      version: 1,
      gradeIndex: 0,
      gradeGauge: 0,
      totalContribution: 0,
      medals,
      updatedAt: Date.now()
    };
  }

  cloneDefaultMedalWith(rawMedal) {
    const medal = { ...this.getDefaultRatingMedal(), ...(rawMedal || {}) };
    const tierIndex = Number.isInteger(medal.tierIndex)
      ? medal.tierIndex
      : this.ratingMedalTiers.findIndex((tier) => tier.id === medal.tier);
    medal.tierIndex = Math.max(0, Math.min(this.ratingMedalTiers.length - 1, tierIndex < 0 ? 0 : tierIndex));
    medal.tier = this.ratingMedalTiers[medal.tierIndex].id;
    medal.stars = Math.max(0, Number(medal.stars) || 0);
    medal.gauge = Math.max(0, Number(medal.gauge) || 0);
    medal.wins = Math.max(0, Number(medal.wins) || 0);
    medal.losses = Math.max(0, Number(medal.losses) || 0);
    return medal;
  }

  normalizeRatingProfile(rawProfile) {
    const base = this.getDefaultRatingProfile();
    const profile = { ...base, ...(rawProfile || {}) };
    profile.gradeIndex = Math.max(0, Math.min(this.getGradeLadder().length - 1, Number(profile.gradeIndex) || 0));
    profile.gradeGauge = Math.max(0, Number(profile.gradeGauge) || 0);
    profile.totalContribution = Math.max(0, Number(profile.totalContribution) || 0);
    profile.medals = {};
    this.ratingSkillsets.forEach((skillset) => {
      profile.medals[skillset] = this.cloneDefaultMedalWith(rawProfile?.medals?.[skillset]);
    });
    profile.updatedAt = Number(profile.updatedAt) || Date.now();
    return profile;
  }

  loadRatingProfile() {
    try {
      const stored = localStorage.getItem(this.ratingStorageKey);
      return this.normalizeRatingProfile(stored ? JSON.parse(stored) : null);
    } catch (e) {
      console.warn("[AchievementSystem] Failed to load rating profile:", e);
      return this.getDefaultRatingProfile();
    }
  }

  saveRatingProfile(profile = this.ratingProfile) {
    this.ratingProfile = this.normalizeRatingProfile(profile);
    this.ratingProfile.updatedAt = Date.now();
    try {
      localStorage.setItem(this.ratingStorageKey, JSON.stringify(this.ratingProfile));
    } catch (e) {
      console.warn("[AchievementSystem] Failed to save rating profile:", e);
    }
    return this.ratingProfile;
  }

  ensureRatingProfile() {
    this.ratingProfile = this.loadRatingProfile();
    this.migrateStoredLeaderboardsToRatingRuns();
    this.processRatingRunHistory();
  }

  getGradeLadder() {
    const letters = ["F", "E", "D", "C", "B", "A", "S", "SS", "U", "X"];
    const ladder = [];
    letters.forEach((letter) => {
      for (let sub = 9; sub >= 1; sub--) {
        ladder.push(`${letter}${sub}`);
      }
    });
    ladder.push("X+");
    return ladder;
  }

  getCurrentGradeCost(profile = this.ratingProfile) {
    const label = this.getGradeLabel(profile);
    if (label === "X+") return 0;
    const letter = label.replace(/[0-9+]/g, "");
    return this.ratingGradeCosts[letter] || 10;
  }

  getRatingMedalProgressGain(points = 1, profile = this.ratingProfile) {
    const basePoints = Math.max(0, Number(points) || 0);
    if (basePoints <= 0) return 0;
    const cost = this.getCurrentGradeScalingCost(profile);
    const gainDivisor = Math.max(1, Math.ceil(cost / 3));
    return this.roundRatingProgress(basePoints / gainDivisor);
  }

  getRatingMedalProgressLoss(profile = this.ratingProfile) {
    const cost = this.getCurrentGradeScalingCost(profile);
    return Math.max(1, Math.ceil(cost / 2));
  }

  getCurrentGradeScalingCost(profile = this.ratingProfile) {
    const cost = this.getCurrentGradeCost(profile);
    return cost > 0 ? cost : this.ratingGradeCosts.X;
  }

  roundRatingProgress(value) {
    return Math.round(Math.max(0, Number(value) || 0) * 100) / 100;
  }

  addRatingMedalProgress(medal, points, profile = this.ratingProfile) {
    if (!medal) return;
    medal.gauge = this.roundRatingProgress(
      (Number(medal.gauge) || 0) + this.getRatingMedalProgressGain(points, profile)
    );
  }

  removeRatingMedalProgress(medal, profile = this.ratingProfile) {
    if (!medal) return;
    medal.gauge = this.roundRatingProgress(
      Math.max(0, (Number(medal.gauge) || 0) - this.getRatingMedalProgressLoss(profile))
    );
  }

  getGradeLabel(profile = this.ratingProfile) {
    const ladder = this.getGradeLadder();
    return ladder[Math.max(0, Math.min(ladder.length - 1, Number(profile?.gradeIndex) || 0))] || "F9";
  }

  addMainRatingPoints(points) {
    const profile = this.ratingProfile || this.getDefaultRatingProfile();
    const ladder = this.getGradeLadder();
    let remaining = Math.max(0, Number(points) || 0);
    profile.totalContribution += remaining;

    while (remaining > 0 && profile.gradeIndex < ladder.length - 1) {
      const cost = this.getCurrentGradeCost(profile);
      if (cost <= 0) break;
      const needed = cost - profile.gradeGauge;
      if (remaining >= needed) {
        remaining -= needed;
        profile.gradeIndex += 1;
        profile.gradeGauge = 0;
      } else {
        profile.gradeGauge += remaining;
        remaining = 0;
      }
    }

    if (profile.gradeIndex >= ladder.length - 1) {
      profile.gradeIndex = ladder.length - 1;
      profile.gradeGauge = 0;
    }
  }

  promoteRatingMedal(skillset, source = {}) {
    const profile = this.ratingProfile || this.getDefaultRatingProfile();
    const medal = profile.medals?.[skillset];
    if (!medal) return null;

    const tier = this.ratingMedalTiers[medal.tierIndex] || this.ratingMedalTiers[0];
    const contribution = tier.value;

    medal.stars += 1;
    if (medal.stars >= tier.cap && medal.tierIndex < this.ratingMedalTiers.length - 1) {
      medal.tierIndex += 1;
      medal.tier = this.ratingMedalTiers[medal.tierIndex].id;
      medal.stars = 0;
    }

    this.addMainRatingPoints(contribution);
    return {
      skillset,
      tier: tier.id,
      tierLabel: tier.label,
      stars: medal.stars,
      contribution,
      source
    };
  }

  defineRatingMilestones() {
    const gradeAtLeast = (threshold) => (entry) => this.getGradeValue(entry?.grade || "9") >= this.getGradeValue(threshold);
    const levelAtLeast = (threshold) => (entry) => (Number(entry?.level) || 0) >= threshold;
    const linesAtLeast = (threshold) => (entry) => (Number(entry?.lines) || 0) >= threshold;
    const scoreAtLeast = (threshold) => (entry) => (Number(entry?.score) || 0) >= threshold;
    const allClearsAtLeast = (threshold) => (entry) => (Number(entry?.allClears) || 0) >= threshold;
    const completed = (entry) => !!entry && (entry.time !== undefined || entry.score !== undefined || entry.level !== undefined || entry.allClears !== undefined);
    const any = (...predicates) => (entry) => predicates.some((predicate) => predicate(entry));
    const modes = (ids) => Array.isArray(ids) ? ids : [ids];
    const make = (id, skillset, modeIds, label, predicate, points = 1) => ({
      id,
      skillset,
      modeIds: modes(modeIds),
      label,
      predicate,
      points
    });

    return [
      make("guideline_base", "guideline", ["sprint_40", "sprint_100", "marathon", "ultra", "tgm2_normal"], "Guideline play", completed, 1),
      make("guideline_sprint40_clear", "guideline", "sprint_40", "Clear Sprint 40L", (entry) => !!entry?.time && entry.time !== "--:--.--", 1),
      make("guideline_sprint100_clear", "guideline", "sprint_100", "Clear Sprint 100L", (entry) => !!entry?.time && entry.time !== "--:--.--", 1),
      make("guideline_marathon_150", "guideline", "marathon", "Clear 150 Marathon lines", linesAtLeast(150), 1),
      make("guideline_ultra_100k", "guideline", "ultra", "Score 100,000 in Ultra", scoreAtLeast(100000), 1),
      make("guideline_ultra_250k", "guideline", "ultra", "Score 250,000 in Ultra", scoreAtLeast(250000), 2),
      make("guideline_normal_score", "guideline", "tgm2_normal", "Score 300,000 in Normal", scoreAtLeast(300000), 1),

      make("grade_base", "grade", ["tgm1", "tgm2", "tgm2_master", "tgm3", "tgm3_master", "tgm4", "tgm4_master"], "Master play", completed, 1),
      make("grade_tgm1_s1", "grade", "tgm1", "TGM1 S1", gradeAtLeast("S1"), 1),
      make("grade_tgm1_gm", "grade", "tgm1", "TGM1 GM", gradeAtLeast("GM"), 2),
      make("grade_tgm2_s9", "grade", ["tgm2", "tgm2_master"], "TGM2 Master S9", gradeAtLeast("S9"), 1),
      make("grade_tgm2_gm", "grade", ["tgm2", "tgm2_master"], "TGM2 Master GM", gradeAtLeast("GM"), 2),
      make("grade_tgm3_999", "grade", ["tgm3", "tgm3_master"], "TGM3 Master 999", levelAtLeast(999), 1),
      make("grade_tgm3_gm", "grade", ["tgm3", "tgm3_master"], "TGM3 Master GM", gradeAtLeast("GM"), 2),
      make("grade_tgm4_master", "grade", ["tgm4", "tgm4_master"], "TGM4 MASTER", gradeAtLeast("MASTER"), 1),
      make("grade_tgm4_gm", "grade", ["tgm4", "tgm4_master"], "TGM4 GM", gradeAtLeast("GM"), 2),
      make("grade_tgm4_rounds_gm", "grade", ["tgm4", "tgm4_master"], "TGM4 GM-Rounds", gradeAtLeast("GM-Rounds"), 3),

      make("twentyg_base", "20g", ["master_20g", "tadeath", "ta_death", "shirase", "tgm3_shirase", "tgm4_rounds", "tgm4_2_1", "tgm4_3_1", "tgm4_4_1"], "20G play", completed, 1),
      make("twentyg_master_500", "20g", "master_20g", "20G level 500", levelAtLeast(500), 1),
      make("twentyg_master_999", "20g", "master_20g", "20G level 999", levelAtLeast(999), 2),
      make("twentyg_death_500", "20g", ["tadeath", "ta_death"], "Death M pace", any(levelAtLeast(500), gradeAtLeast("M")), 1),
      make("twentyg_death_gm", "20g", ["tadeath", "ta_death"], "Death GM", gradeAtLeast("GM"), 2),
      make("twentyg_shirase_500", "20g", ["shirase", "tgm3_shirase"], "Shirase 500", levelAtLeast(500), 1),
      make("twentyg_shirase_1300", "20g", ["shirase", "tgm3_shirase"], "Shirase 1300", any(levelAtLeast(1300), gradeAtLeast("S13")), 2),
      make("twentyg_rounds_clear", "20g", ["tgm4_rounds", "tgm4_2_1", "tgm4_3_1", "tgm4_4_1"], "Rounds clear", any(gradeAtLeast("GM-Rounds"), linesAtLeast(20)), 2),

      make("bravo_base", "bravo", ["konoha_easy", "konoha_hard"], "Konoha play", completed, 1),
      make("bravo_easy_25", "bravo", "konoha_easy", "Konoha Easy 25 AC", allClearsAtLeast(25), 1),
      make("bravo_easy_50", "bravo", "konoha_easy", "Konoha Easy 50 AC", allClearsAtLeast(50), 2),
      make("bravo_easy_110", "bravo", "konoha_easy", "Konoha Easy clear", allClearsAtLeast(110), 3),
      make("bravo_hard_10", "bravo", "konoha_hard", "Konoha Hard 10 AC", allClearsAtLeast(10), 1),
      make("bravo_hard_25", "bravo", "konoha_hard", "Konoha Hard 25 AC", allClearsAtLeast(25), 2),
      make("bravo_hard_gm", "bravo", "konoha_hard", "Konoha Hard GM", gradeAtLeast("GM"), 3)
    ];
  }

  getRatingRuns() {
    try {
      const stored = localStorage.getItem(this.ratingRunsStorageKey);
      const parsed = stored ? JSON.parse(stored) : [];
      return Array.isArray(parsed) ? parsed.filter((run) => run && run.modeId && run.entry) : [];
    } catch (e) {
      console.warn("[AchievementSystem] Failed to load rating runs:", e);
      return [];
    }
  }

  saveRatingRuns(runs) {
    try {
      localStorage.setItem(this.ratingRunsStorageKey, JSON.stringify(Array.isArray(runs) ? runs : []));
    } catch (e) {
      console.warn("[AchievementSystem] Failed to save rating runs:", e);
    }
  }

  createRatingRunSignature(modeId, entry) {
    return JSON.stringify({
      modeId,
      time: entry?.time,
      score: entry?.score,
      allClears: entry?.allClears,
      level: entry?.level,
      grade: entry?.grade,
      gradeLineColor: entry?.gradeLineColor,
      lines: entry?.lines,
      pps: entry?.pps,
      stage: entry?.stage,
      completionRate: entry?.completionRate
    });
  }

  shouldTrackRatingRun(modeId) {
    const normalized = String(modeId || "").toLowerCase();
    return normalized && normalized !== "zen" && !normalized.startsWith("versus_");
  }

  appendRatingRun(modeId, entry) {
    if (!this.shouldTrackRatingRun(modeId) || !entry) return [];
    const runs = this.getRatingRuns();
    runs.push({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      modeId,
      entry,
      createdAt: Date.now()
    });
    this.saveRatingRuns(runs);
    return this.processRatingRunHistory();
  }

  migrateStoredLeaderboardsToRatingRuns() {
    try {
      if (localStorage.getItem(this.ratingMigrationKey) === "1") return;
      const runs = this.getRatingRuns();
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key || !key.startsWith("leaderboard_")) continue;
        const modeId = key.slice("leaderboard_".length);
        if (!this.shouldTrackRatingRun(modeId)) continue;
        const parsed = JSON.parse(localStorage.getItem(key) || "[]");
        if (!Array.isArray(parsed)) continue;
        parsed.forEach((entry, index) => {
          runs.push({
            id: `${modeId}-migrated-${index}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            modeId,
            entry,
            createdAt: Date.now() - parsed.length + index
          });
        });
      }
      this.saveRatingRuns(runs);
      localStorage.setItem(this.ratingMigrationKey, "1");
    } catch (e) {
      console.warn("[AchievementSystem] Failed to migrate rating runs:", e);
    }
  }

  processRatingRunHistory() {
    const existingProfile = this.ratingProfile || this.loadRatingProfile();
    const versusMedal = this.cloneDefaultMedalWith(existingProfile?.medals?.versus);
    const profile = this.getDefaultRatingProfile();
    profile.medals.versus = versusMedal;
    const runs = this.getRatingRuns().slice().sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
    const promotions = [];

    runs.forEach((run) => {
      this.ratingMilestones.forEach((milestone) => {
        if (milestone.skillset === "versus") return;
        if (!milestone.modeIds.includes(run.modeId)) return;
        if (!milestone.predicate(run.entry || {})) return;
        const medal = profile.medals[milestone.skillset];
        if (!medal) return;
        this.addRatingMedalProgress(medal, milestone.points, profile);
      });

      this.ratingSkillsets.forEach((skillset) => {
        if (skillset === "versus") return;
        this.ratingProfile = profile;
        const medal = profile.medals[skillset];
        if (!medal) return;
        while (medal.gauge >= this.ratingStarProgressThreshold) {
          medal.gauge -= this.ratingStarProgressThreshold;
          const promotion = this.promoteRatingMedal(skillset, {
            type: "run",
            modeId: run.modeId
          });
          if (promotion) promotions.push(promotion);
        }
      });
    });

    this.saveRatingProfile(profile);
    return promotions;
  }

  recordVersusMatch(outcome) {
    const profile = this.ratingProfile || this.loadRatingProfile();
    const medal = profile.medals.versus;
    if (!medal) return null;
    const normalizedOutcome = outcome === "win" || outcome === "loss" ? outcome : "draw";
    if (normalizedOutcome === "draw") return this.getRatingSummary();

    if (normalizedOutcome === "win") {
      medal.wins += 1;
      this.addRatingMedalProgress(medal, 1, profile);
    } else {
      medal.losses += 1;
      this.removeRatingMedalProgress(medal, profile);
    }

    const promotions = [];
    while (medal.gauge >= this.ratingStarProgressThreshold) {
      medal.gauge -= this.ratingStarProgressThreshold;
      this.ratingProfile = profile;
      const promotion = this.promoteRatingMedal("versus", { type: "versus", outcome: normalizedOutcome });
      if (promotion) promotions.push(promotion);
    }

    this.saveRatingProfile(profile);
    return { ...this.getRatingSummary(), promotions };
  }

  getVersusPromotionRequirement(medal) {
    const tier = this.ratingMedalTiers[medal?.tierIndex || 0] || this.ratingMedalTiers[0];
    return Math.max(1, tier.value);
  }

  getRatingSummary() {
    const profile = this.ratingProfile || this.loadRatingProfile();
    const medals = {};
    this.ratingSkillsets.forEach((skillset) => {
      const medal = profile.medals[skillset];
      const tier = this.ratingMedalTiers[medal.tierIndex] || this.ratingMedalTiers[0];
      medals[skillset] = {
        id: skillset,
        label: skillset === "20g" ? "20G" : skillset.charAt(0).toUpperCase() + skillset.slice(1),
        tier: tier.id,
        tierLabel: tier.label,
        tierColor: tier.color,
        stars: medal.stars,
        cap: tier.cap,
        contributionValue: tier.value,
        gauge: medal.gauge,
        wins: medal.wins,
        losses: medal.losses,
      };
    });
    return {
      grade: this.getGradeLabel(profile),
      gradeGauge: profile.gradeGauge,
      gradeCost: this.getCurrentGradeCost(profile),
      totalContribution: profile.totalContribution,
      starProgressThreshold: this.ratingStarProgressThreshold,
      medals
    };
  }

  defineAchievements() {
    return [
      // TGM1
      {
        id: "tgm1_grade_s1",
        game: "TGM1",
        description: "Get an S1 grade in TGM",
        points: 100,
        modeId: "tgm1",
        condition: "grade",
        threshold: "S1",
        operator: ">="
      },
      {
        id: "tgm1_level_300",
        game: "TGM1",
        description: "Reach level 300 in TGM",
        points: 100,
        modeId: "tgm1",
        condition: "level",
        threshold: 300
      },
      {
        id: "tgm1_level_500",
        game: "TGM1",
        description: "Reach level 500 in TGM",
        points: 200,
        modeId: "tgm1",
        condition: "level",
        threshold: 500
      },
      {
        id: "tgm1_level_700",
        game: "TGM1",
        description: "Reach level 700 in TGM",
        points: 300,
        modeId: "tgm1",
        condition: "level",
        threshold: 700
      },
      {
        id: "tgm1_level_999",
        game: "TGM1",
        description: "Reach level 999 in TGM",
        points: 500,
        modeId: "tgm1",
        condition: "level",
        threshold: 999
      },
      {
        id: "tgm1_grade_gm",
        game: "TGM1",
        description: "Complete the game with the GM grade in TGM",
        points: 800,
        modeId: "tgm1",
        condition: "grade",
        threshold: "GM",
        operator: "=="
      },

      // TAP Normal
      {
        id: "tap_normal_finish",
        game: "TAP",
        description: "Finish TAP Normal mode (credit roll)",
        points: 300,
        modeId: ["tgm2_normal", "normal"],
        condition: "credit_roll",
        threshold: true
      },

      // TAP T.A. Death
      {
        id: "tap_death_level_150",
        game: "TAP",
        description: "Reach level 150 in TAP T.A. Death",
        points: 300,
        modeId: ["tadeath", "ta_death"],
        condition: "level",
        threshold: 150
      },
      {
        id: "tap_death_level_200",
        game: "TAP",
        description: "Reach level 200 in TAP T.A. Death",
        points: 350,
        modeId: ["tadeath", "ta_death"],
        condition: "level",
        threshold: 200
      },
      {
        id: "tap_death_level_300",
        game: "TAP",
        description: "Reach level 300 in TAP T.A. Death",
        points: 400,
        modeId: ["tadeath", "ta_death"],
        condition: "level",
        threshold: 300
      },
      {
        id: "tap_death_level_400",
        game: "TAP",
        description: "Reach level 400 in TAP T.A. Death",
        points: 500,
        modeId: ["tadeath", "ta_death"],
        condition: "level",
        threshold: 400
      },
      {
        id: "tap_death_level_500",
        game: "TAP",
        description: "Reach level 500 in TAP T.A. Death",
        points: 800,
        modeId: ["tadeath", "ta_death"],
        condition: "level",
        threshold: 500
      },
      {
        id: "tap_death_level_700",
        game: "TAP",
        description: "Reach level 700 in TAP T.A. Death",
        points: 900,
        modeId: ["tadeath", "ta_death"],
        condition: "level",
        threshold: 700
      },
      {
        id: "tap_death_m",
        game: "TAP",
        description: "Get the M grade in TAP T.A. Death (level 500 at 3:25:00 or faster)",
        points: 800,
        modeId: ["tadeath", "ta_death"],
        condition: "grade",
        threshold: "M",
        operator: "=="
      },
      {
        id: "tap_death_gm",
        game: "TAP",
        description: "Get GM in TAP T.A. Death (reach level 999)",
        points: 1500,
        modeId: ["tadeath", "ta_death"],
        condition: "grade",
        threshold: "GM",
        operator: "=="
      },

      // TAP Master
      {
        id: "tap_master_s1",
        game: "TAP",
        description: "Get an S1 grade in TAP Master Mode",
        points: 100,
        modeId: "tgm2_master",
        condition: "grade",
        threshold: "S1",
        operator: ">="
      },
      {
        id: "tap_master_s7",
        game: "TAP",
        description: "Get an S7 grade in TAP Master Mode",
        points: 300,
        modeId: "tgm2_master",
        condition: "grade",
        threshold: "S7",
        operator: ">="
      },
      {
        id: "tap_master_s9",
        game: "TAP",
        description: "Get an S9 grade in TAP Master Mode",
        points: 600,
        modeId: "tgm2_master",
        condition: "grade",
        threshold: "S9",
        operator: ">="
      },
      {
        id: "tap_master_m",
        game: "TAP",
        description: "Get the M grade in TAP Master Mode",
        points: 700,
        modeId: "tgm2_master",
        condition: "grade",
        threshold: "M",
        operator: "=="
      },
      {
        id: "tap_master_level_999",
        game: "TAP",
        description: "Reach level 999 in TAP Master Mode",
        points: 700,
        modeId: "tgm2_master",
        condition: "level",
        threshold: 999
      },
      {
        id: "tap_master_clear_roll",
        game: "TAP",
        description: "Clear the semi-invisible credit roll on TAP Master Mode",
        points: 800,
        modeId: "tgm2_master",
        condition: "credit_roll",
        threshold: true
      },
      {
        id: "tap_master_gm",
        game: "TAP",
        description: "Survive the credit roll and get GM in TAP Master Mode",
        points: 1000,
        modeId: "tgm2_master",
        condition: "grade",
        threshold: "GM",
        operator: "=="
      },
      {
        id: "tap_master_orange_gm",
        game: "TAP",
        description: "Clear 32+ lines in M Roll and obtain Orange Line GM in TAP Master",
        points: 1500,
        modeId: "tgm2_master",
        condition: "orange_gm",
        threshold: true
      },

      // TGM3 Master
      {
        id: "tgm3_master_level_500",
        game: "TGM3",
        description: "Reach level 500 in TGM3 Master Mode (under 7:00:00)",
        points: 400,
        modeId: ["tgm3_master", "tgm3"],
        condition: "level_time",
        levelThreshold: 500,
        timeThreshold: 420 // 7:00 in seconds
      },
      {
        id: "tgm3_master_level_999",
        game: "TGM3",
        description: "Reach level 999 in TGM3 Master Mode",
        points: 700,
        modeId: ["tgm3_master", "tgm3"],
        condition: "level",
        threshold: 999
      },
      {
        id: "tgm3_master_mroll",
        game: "TGM3",
        description: "Clear the M-roll in TGM3 Master Mode",
        points: 1000,
        modeId: ["tgm3_master", "tgm3"],
        condition: "m_roll",
        threshold: true
      },
      {
        id: "tgm3_master_gm",
        game: "TGM3",
        description: "Obtain the GM Grade by passing the Promotional Exam in TGM3 Master",
        points: 1500,
        modeId: ["tgm3_master", "tgm3"],
        condition: "grade",
        threshold: "GM",
        operator: "=="
      },

      // TGM3 Shirase
      {
        id: "tgm3_shirase_1300",
        game: "TGM3",
        description: "Reach level 1300 in TGM3 Shirase Mode",
        points: 1800,
        modeId: ["tgm3_shirase", "shirase"],
        condition: "level",
        threshold: 1300
      },
      {
        id: "tgm3_shirase_s13",
        game: "TGM3",
        description: "Clear credit roll and get Orange Line S13 in TGM3 Shirase",
        points: 2000,
        modeId: ["tgm3_shirase", "shirase"],
        condition: "grade",
        threshold: "S13",
        operator: "=="
      },

      // TGM3 Sakura
      {
        id: "tgm3_sakura_27",
        game: "TGM3",
        description: "Clear all 27 stages in TGM3 Sakura Mode",
        points: 1000,
        modeId: "tgm3_sakura",
        condition: "stages",
        threshold: 27
      },

      // TGM3 Easy
      {
        id: "tgm3_easy_hanabi",
        game: "TGM3",
        description: "Get a high Hanabi score in TGM3 Easy mode",
        points: 300, // base, calculated dynamically
        modeId: "tgm3_easy",
        condition: "hanabi",
        threshold: 400,
        dynamic: true // points = 300 + floor((hanabi - 400) / 2)
      },

      // TGM4
      {
        id: "tgm4_normal_999",
        game: "TGM4",
        description: "Reach level 999 in TGM4 Normal",
        points: 500,
        modeId: "tgm4_normal",
        condition: "level",
        threshold: 999
      },
      {
        id: "tgm4_asuka_easy_clear",
        game: "TGM4",
        description: "Clear Asuka Easy",
        points: 500,
        modeId: "tgm4_asuka_easy",
        condition: "clear",
        threshold: true
      },
      {
        id: "tgm4_asuka_normal_1000",
        game: "TGM4",
        description: "Reach level 1000 in Asuka Normal",
        points: 800,
        modeId: "tgm4_asuka_normal",
        condition: "level",
        threshold: 1000
      },
      {
        id: "tgm4_asuka_hard_clear",
        game: "TGM4",
        description: "Clear Asuka Hard",
        points: 1000,
        modeId: "tgm4_asuka_hard",
        condition: "clear",
        threshold: true
      },
      {
        id: "tgm4_asuka_hard_1000",
        game: "TGM4",
        description: "Reach level 1000 in Asuka Hard",
        points: 1500,
        modeId: "tgm4_asuka_hard",
        condition: "level",
        threshold: 1000
      },
      {
        id: "tgm4_konoha_easy_clear",
        game: "TGM4",
        description: "Clear Konoha Easy (110 All Clears)",
        points: 800,
        modeId: "tgm4_konoha_easy",
        condition: "clear",
        threshold: true
      },
      {
        id: "tgm4_konoha_hard_gm",
        game: "TGM4",
        description: "Reach GM in Konoha Hard",
        points: 1500,
        modeId: "tgm4_konoha_hard",
        condition: "grade",
        threshold: "GM",
        operator: "=="
      },
      {
        id: "tgm4_master_999",
        game: "TGM4",
        description: "Reach level 999 in TGM4 Master",
        points: 600,
        modeId: "tgm4_master",
        condition: "level",
        threshold: 999
      },
      {
        id: "tgm4_master_1100",
        game: "TGM4",
        description: "Reach MASTER grade in TGM4 Master",
        points: 700,
        modeId: "tgm4_master",
        condition: "grade",
        threshold: "MASTER",
        operator: ">="
      },
      {
        id: "tgm4_master_2000",
        game: "TGM4",
        description: "Reach level 2000 in TGM4 Master",
        points: 1100,
        modeId: "tgm4_master",
        condition: "level",
        threshold: 2000
      },
      {
        id: "tgm4_master_gm",
        game: "TGM4",
        description: "Get GM in TGM4 Master",
        points: 1500,
        modeId: "tgm4_master",
        condition: "grade",
        threshold: "GM",
        operator: "=="
      },
      {
        id: "tgm4_master_gmrounds",
        game: "TGM4",
        description: "Get GM-Rounds or above in TGM4 Master",
        points: 2500,
        modeId: "tgm4_master",
        condition: "grade",
        threshold: "GM-Rounds",
        operator: ">="
      },
      {
        id: "tgm4_1_1_clear",
        game: "TGM4",
        description: "Clear TGM4 1.1 Mode",
        points: 800,
        modeId: "tgm4_1_1",
        condition: "clear",
        threshold: true
      },
      {
        id: "tgm4_2_1_clear",
        game: "TGM4",
        description: "Clear TGM4 2.1 Mode",
        points: 1500,
        modeId: "tgm4_2_1",
        condition: "clear",
        threshold: true
      },
      {
        id: "tgm4_3_1_clear",
        game: "TGM4",
        description: "Clear TGM4 3.1 Mode",
        points: 2500,
        modeId: "tgm4_3_1",
        condition: "clear",
        threshold: true
      },
      {
        id: "tgm4_4_1_clear",
        game: "TGM4",
        description: "Clear TGM4 4.1 Mode",
        points: 3000,
        modeId: "tgm4_4_1",
        condition: "clear",
        threshold: true
      }
    ];
  }

  loadFromStorage() {
    try {
      const completed = localStorage.getItem("mino_achievements");
      this.completed = completed ? new Set(JSON.parse(completed)) : new Set();
    } catch (e) {
      console.warn("[AchievementSystem] Failed to load achievements:", e);
      this.completed = new Set();
    }
  }

  saveToStorage() {
    try {
      localStorage.setItem("mino_achievements", JSON.stringify([...this.completed]));
    } catch (e) {
      console.warn("[AchievementSystem] Failed to save achievements:", e);
    }
  }

  getPlayerName() {
    try {
      return localStorage.getItem("mino_player_name") || null;
    } catch (e) {
      console.warn("[AchievementSystem] Failed to load player name:", e);
      return null;
    }
  }

  setPlayerName(name) {
    try {
      localStorage.setItem("mino_player_name", name.trim() || "Player");
    } catch (e) {
      console.warn("[AchievementSystem] Failed to save player name:", e);
    }
  }

  getCompleted() {
    return this.completed;
  }

  complete(id) {
    if (!this.completed.has(id)) {
      this.completed.add(id);
      this.saveToStorage();
      return true;
    }
    return false;
  }

  getScore() {
    let total = 0;
    this.completed.forEach((id) => {
      const achievement = this.achievements.find((a) => a.id === id);
      if (achievement) {
        total += achievement.points;
      }
    });
    return total;
  }

  getAchievementPoints(id) {
    const achievement = this.achievements.find((a) => a.id === id);
    return achievement ? achievement.points : 0;
  }

  checkAndUnlock(modeId, gameState) {
    const newlyUnlocked = [];
    const relevantAchievements = this.achievements.filter((a) => {
      const modes = Array.isArray(a.modeId) ? a.modeId : [a.modeId];
      return modes.includes(modeId);
    });

    relevantAchievements.forEach((achievement) => {
      if (this.completed.has(achievement.id)) return;

      let met = false;
      let points = achievement.points;

      switch (achievement.condition) {
        case "grade":
          if (gameState.grade) {
            const gradeValue = this.getGradeValue(gameState.grade);
            const thresholdValue = this.getGradeValue(achievement.threshold);
            if (achievement.operator === "==") {
              met = gameState.grade === achievement.threshold;
            } else {
              met = gradeValue >= thresholdValue;
            }
          }
          break;

        case "level":
          met = gameState.level >= achievement.threshold;
          break;

        case "level_time":
          met = gameState.level >= achievement.levelThreshold && gameState.time <= achievement.timeThreshold;
          break;

        case "credit_roll":
          met = gameState.creditsSurvived === true;
          break;

        case "m_roll":
          met = gameState.mRollCleared === true;
          break;

        case "orange_gm":
          met = gameState.grade === "GM" && (gameState.linesClearedInMRoll || 0) >= 32;
          break;

        case "stages":
          met = (gameState.stagesCleared || 0) >= achievement.threshold;
          break;

        case "hanabi":
          const hanabi = gameState.hanabi || 0;
          if (hanabi >= achievement.threshold) {
            met = true;
            if (achievement.dynamic) {
              points = 300 + Math.floor((hanabi - achievement.threshold) / 2);
            }
          }
          break;

        case "clear":
          met = gameState.modeCleared === true;
          break;
      }

      if (met) {
        this.completed.add(achievement.id);
        // Update points if dynamic
        if (points !== achievement.points) {
          achievement.points = points;
        }
        newlyUnlocked.push({ id: achievement.id, points });
      }
    });

    if (newlyUnlocked.length > 0) {
      this.saveToStorage();
    }

    return newlyUnlocked;
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
      S13: 20,
      MASTER: 21,
      "GM-Rounds": 22,
      "GM-Rounds-One": 23,
      "GM-Rounds-Two": 24,
      "GM-Rounds-Three": 25,
      "GM-Rounds-Four": 26,
      "GM-Rounds-Five": 27,
      "GM-Rounds-Six": 28,
      "GM-Rounds-Seven": 29,
      "GM-Rounds-Eight": 30,
      "GM-Rounds-Nine": 31,
      "GM-Rounds-Ten": 32,
      "GM-Rounds-Sir Tristan": 33,
      "GM-Rounds-Sir Gawain": 34,
      "GM-Rounds-Sir Lancelot": 35,
      "GM-King of Rounds": 36
    };
    return gradeValues[grade] || 0;
  }

  getAllByGroup() {
    const grouped = {};
    this.achievements.forEach((achievement) => {
      if (!grouped[achievement.game]) {
        grouped[achievement.game] = [];
      }
      grouped[achievement.game].push(achievement);
    });
    return grouped;
  }

  isCompleted(id) {
    return this.completed.has(id);
  }
}

// Initialize singleton
if (typeof window !== "undefined") {
  window.achievementSystem = new AchievementSystem();
}

// Export for Node/Module systems
if (typeof module !== "undefined" && module.exports) {
  module.exports = AchievementSystem;
}
