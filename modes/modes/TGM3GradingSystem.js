// TGM3GradingSystem - Implements TGM3/TAP-style internal grade system with corrected combo multipliers
// Grade points accrue via line clears, decay over time, and map to displayed grades.

class TGM3GradingSystem {
    constructor() {
        this.internalGrade = 0;      // 0-31+ (mapped to displayed grades)
        this.gradePoints = 0;        // 0-99, resets on promotion
        this.decayRate = 125;        // Frames per point decay, varies by grade
        this.decayTimer = 0;
        this.decayActive = true;

        this.sectionCoolBonus = 0;   // +1 per section COOL (applied to displayed grade)
        this.sectionRegretCount = 0; // Track REGRET deductions
        this.staffRollBonus = 0;     // Fractional grade bonus from staff roll

        // Grade mapping mirrors TAP/Ti internal grades
        this.gradeMapping = [
            { internal: 0, display: '9', decayRate: 125 },
            { internal: 1, display: '8', decayRate: 80 },
            { internal: 2, display: '7', decayRate: 80 },
            { internal: 3, display: '6', decayRate: 50 },
            { internal: 4, display: '5', decayRate: 45 },
            { internal: 5, display: '4', decayRate: 45 },
            { internal: 6, display: '4', decayRate: 45 },
            { internal: 7, display: '3', decayRate: 40 },
            { internal: 8, display: '3', decayRate: 40 },
            { internal: 9, display: '2', decayRate: 40 },
            { internal: 10, display: '2', decayRate: 40 },
            { internal: 11, display: '2', decayRate: 40 },
            { internal: 12, display: '1', decayRate: 30 },
            { internal: 13, display: '1', decayRate: 30 },
            { internal: 14, display: '1', decayRate: 30 },
            { internal: 15, display: 'S1', decayRate: 20 },
            { internal: 16, display: 'S1', decayRate: 20 },
            { internal: 17, display: 'S1', decayRate: 20 },
            { internal: 18, display: 'S2', decayRate: 20 },
            { internal: 19, display: 'S3', decayRate: 20 },
            { internal: 20, display: 'S4', decayRate: 15 },
            { internal: 21, display: 'S4', decayRate: 15 },
            { internal: 22, display: 'S4', decayRate: 15 },
            { internal: 23, display: 'S5', decayRate: 15 },
            { internal: 24, display: 'S5', decayRate: 15 },
            { internal: 25, display: 'S6', decayRate: 15 },
            { internal: 26, display: 'S6', decayRate: 15 },
            { internal: 27, display: 'S7', decayRate: 15 },
            { internal: 28, display: 'S7', decayRate: 15 },
            { internal: 29, display: 'S8', decayRate: 15 },
            { internal: 30, display: 'S8', decayRate: 10 },
            { internal: 31, display: 'S9', decayRate: 10 },
        ];

        // Base values per internal grade (matches TAP/Ti tables)
        this.baseValues = [
            { single: 10, double: 20, triple: 40, tetris: 50 }, // 0
            { single: 10, double: 20, triple: 30, tetris: 40 }, // 1
            { single: 10, double: 20, triple: 30, tetris: 40 }, // 2
            { single: 10, double: 15, triple: 30, tetris: 40 }, // 3
            { single: 10, double: 15, triple: 20, tetris: 40 }, // 4
            { single: 5,  double: 15, triple: 20, tetris: 30 }, // 5
            { single: 5,  double: 10, triple: 20, tetris: 30 }, // 6
            { single: 5,  double: 10, triple: 15, tetris: 30 }, // 7
            { single: 5,  double: 10, triple: 15, tetris: 30 }, // 8
            { single: 5,  double: 10, triple: 15, tetris: 30 }, // 9
            { single: 2,  double: 12, triple: 13, tetris: 30 }, // 10
            { single: 2,  double: 12, triple: 13, tetris: 30 }, // 11
            { single: 2,  double: 12, triple: 13, tetris: 30 }, // 12
            { single: 2,  double: 12, triple: 13, tetris: 30 }, // 13
            { single: 2,  double: 12, triple: 13, tetris: 30 }, // 14
            { single: 2,  double: 12, triple: 13, tetris: 30 }, // 15 (S1)
            { single: 2,  double: 12, triple: 13, tetris: 30 }, // 16
            { single: 2,  double: 12, triple: 13, tetris: 30 }, // 17
            { single: 2,  double: 12, triple: 13, tetris: 30 }, // 18 (S2)
            { single: 2,  double: 12, triple: 13, tetris: 30 }, // 19 (S3)
            { single: 2,  double: 12, triple: 13, tetris: 30 }, // 20-22 (S4)
            { single: 2,  double: 12, triple: 13, tetris: 30 }, // 23-24 (S5)
            { single: 2,  double: 12, triple: 13, tetris: 30 }, // 25-26 (S6)
            { single: 2,  double: 12, triple: 13, tetris: 30 }, // 27-28 (S7)
            { single: 2,  double: 12, triple: 13, tetris: 30 }, // 29 (S8)
            { single: 2,  double: 12, triple: 13, tetris: 30 }, // 30 (S8)
            { single: 2,  double: 12, triple: 13, tetris: 30 }, // 31+ (S9)
        ];

        // Corrected combo multipliers (Singles/Doubles/Triples/Tetrises)
        this.comboMultipliers = {
            1:  { single: 1.0, double: 1.0, triple: 1.0, tetris: 1.0 },
            2:  { single: 1.0, double: 1.2, triple: 1.4, tetris: 1.5 },
            3:  { single: 1.0, double: 1.2, triple: 1.5, tetris: 1.8 },
            4:  { single: 1.0, double: 1.4, triple: 1.6, tetris: 2.0 },
            5:  { single: 1.0, double: 1.4, triple: 1.7, tetris: 2.2 },
            6:  { single: 1.0, double: 1.4, triple: 1.8, tetris: 2.3 },
            7:  { single: 1.0, double: 1.4, triple: 1.9, tetris: 2.4 },
            8:  { single: 1.0, double: 1.5, triple: 2.0, tetris: 2.5 },
            9:  { single: 1.0, double: 1.5, triple: 2.1, tetris: 2.6 },
            10: { single: 1.0, double: 2.0, triple: 2.5, tetris: 3.0 },
        };

        this.currentCombo = 0;
        this.lastClearWasSingle = false;
        this.previousDisplayedGrade = '9';
        this.gradeUpsAchieved = 0;
        this.staffRollLines = 0;
    }

    reset() {
        this.internalGrade = 0;
        this.gradePoints = 0;
        this.decayRate = 125;
        this.decayTimer = 0;
        this.decayActive = true;
        this.sectionCoolBonus = 0;
        this.sectionRegretCount = 0;
        this.staffRollBonus = 0;
        this.staffRollLines = 0;
        this.currentCombo = 0;
        this.lastClearWasSingle = false;
        this.previousDisplayedGrade = this.getDisplayedGrade();
        this.gradeUpsAchieved = 0;
    }

    updateDecayRate() {
        // Decay rate uses internal grade capped at 31 (S9)
        // m-grades and M-grades have no decay rate
        const gradeIndex = Math.min(this.internalGrade, 31);
        const entry = this.gradeMapping[Math.min(gradeIndex, this.gradeMapping.length - 1)];
        if (entry && entry.decayRate) {
            this.decayRate = entry.decayRate;
        }
    }

    update(deltaTime) {
        if (!this.decayActive || this.gradePoints <= 0) return;
        this.decayTimer += deltaTime;
        const decayInterval = this.decayRate / 60;
        while (this.decayTimer >= decayInterval && this.gradePoints > 0) {
            this.decayTimer -= decayInterval;
            this.gradePoints = Math.max(0, this.gradePoints - 1);
        }
    }

    awardPoints(linesCleared, comboSize, level, isTetris = false) {
        if (linesCleared === 0) {
            this.currentCombo = 0;
            this.lastClearWasSingle = false;
            return 0;
        }

        if (linesCleared === 1) {
            this.lastClearWasSingle = true;
        } else {
            this.currentCombo = Math.max(1, this.currentCombo + 1);
            this.lastClearWasSingle = false;
        }

        const baseValues = this.getBaseValues();
        let baseValue = 0;
        if (isTetris || linesCleared === 4) {
            baseValue = baseValues.tetris;
        } else {
            if (linesCleared === 1) baseValue = baseValues.single;
            else if (linesCleared === 2) baseValue = baseValues.double;
            else if (linesCleared === 3) baseValue = baseValues.triple;
        }
        if (baseValue === 0) return 0;

        const comboMultiplier = this.getComboMultiplier(comboSize, linesCleared, isTetris);
        const comboAdjustedValue = Math.ceil(baseValue * comboMultiplier);
        const levelMultiplier = 1 + Math.floor(level / 250);
        const finalPoints = comboAdjustedValue * levelMultiplier;

        this.gradePoints += finalPoints;

        while (this.gradePoints >= 100) {
            this.gradePoints -= 100;
            this.internalGrade += 1;
            this.gradeUpsAchieved += 1;
            this.updateDecayRate();
            this.decayTimer = 0;
            this.gradePoints = 0;
            break;
        }

        return finalPoints;
    }

    getBaseValues() {
        const idx = Math.min(this.internalGrade, this.baseValues.length - 1);
        return this.baseValues[idx];
    }

    getComboMultiplier(comboSize, linesCleared, isTetris) {
        if (isTetris || linesCleared === 4) return 1.0;
        const effectiveCombo = Math.min(Math.max(comboSize, 1), 10);
        const entry = this.comboMultipliers[effectiveCombo];
        if (!entry) return 1.0;
        if (linesCleared === 1) return entry.single;
        if (linesCleared === 2) return entry.double;
        if (linesCleared === 3) return entry.triple ?? entry.double;
        return 1.0;
    }

    applySectionCool() {
        this.sectionCoolBonus += 1;
    }

    applySectionRegret() {
        this.sectionRegretCount += 1;
        if (this.internalGrade > 0) {
            this.internalGrade -= 1;
            this.gradePoints = 0;
            this.updateDecayRate();
        }
    }

    addStaffRollBonus(amount) {
        if (!amount || Number.isNaN(amount)) return;
        this.staffRollBonus += amount;
    }

    addStaffRollLines(lines, rollType = 'fading') {
        // rollType: 'fading' uses 0.26/0.12/0.08/0.04/0.50 table; 'mroll' uses 1.0/0.3/0.2/0.1/1.6
        if (!lines || lines < 0) return;
        this.staffRollLines += lines;
        const awards = {
            fading: { 1: 0.04, 2: 0.08, 3: 0.12, 4: 0.26, clear: 0.5 },
            mroll: { 1: 0.1, 2: 0.2, 3: 0.3, 4: 1.0, clear: 1.6 },
        };
        const table = rollType === 'mroll' ? awards.mroll : awards.fading;
        const key = Math.min(lines, 4);
        const bonus = table[key] || 0;
        this.addStaffRollBonus(bonus);
    }

    getDisplayedGrade() {
        // Base grade from internal grade (0-31, TAP grades 9 through S9)
        const gradeIndex = Math.min(this.internalGrade, this.gradeMapping.length - 1);
        const baseGrade = this.gradeMapping[gradeIndex]?.display || '9';

        // Calculate effective grade index including COOL and staff roll bonuses
        // COOL adds +1 per section, staff roll adds fractional bonus
        const netBoost = this.sectionCoolBonus - this.sectionRegretCount + this.staffRollBonus;
        const effectiveIndex = gradeIndex + netBoost;

        // m-grades: internal grade (0-31) + COOL bonus
        // m1 = S9 (31) + 1 COOL = index 32
        // m9 = S9 (31) + 9 COOLs = index 40
        if (effectiveIndex >= 32 && effectiveIndex < 41) {
            const mGrade = Math.floor(effectiveIndex - 31);
            return `m${mGrade}`;
        }

        // M-grades: staff roll bonus progression
        // M = index 41+, MK = index 42+, MV = index 43+, MO = index 44+, MM = index 45+, GM = index 46+
        if (effectiveIndex >= 46) {
            return 'GM';
        } else if (effectiveIndex >= 45) {
            return 'MM';
        } else if (effectiveIndex >= 44) {
            return 'MO';
        } else if (effectiveIndex >= 43) {
            return 'MV';
        } else if (effectiveIndex >= 42) {
            return 'MK';
        } else if (effectiveIndex >= 41) {
            return 'M';
        }

        // Fall back to base TAP grade
        return baseGrade;
    }

    // TAP-style display without COOL/REGRET bonuses
    getBaseDisplayedGrade() {
        const gradeIndex = Math.min(this.internalGrade, this.gradeMapping.length - 1);
        return this.gradeMapping[gradeIndex]?.display || '9';
    }

    getGradePoints() {
        return this.gradePoints;
    }

    getInternalGrade() {
        return this.internalGrade;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TGM3GradingSystem };
}
if (typeof window !== 'undefined') {
    window.TGM3GradingSystem = TGM3GradingSystem;
}
