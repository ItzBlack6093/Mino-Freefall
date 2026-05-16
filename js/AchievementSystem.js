// AchievementSystem - Persistent player profile and achievement tracking
// Handles achievement registry, scoring, persistence, and detection

class AchievementSystem {
  constructor() {
    this.achievements = this.defineAchievements();
    this.loadFromStorage();
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
      "GM-Rounds": 22
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
