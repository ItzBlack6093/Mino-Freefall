// Central registry for mode metadata.
// Mode classes keep gameplay logic; this file owns menu grouping, display data,
// difficulty labels, and colors so new modes are added in one predictable place.

const MODE_DIFFICULTY_COLORS = {
    easy: '#00ff00',
    standard: '#0088ff',
    master: '#888888',
    '20g': '#ff0000',
    race: '#ff8800',
    'all clear': '#ff69b4',
    puzzle: '#8800ff',
    versus: '#ffcc00'
};

const MODE_COLORS = {
    tgm1: 0x888888,
    tgm2: 0x888888,
    tgm3: 0x888888,
    tgm4: 0x888888,
    master_20g: 0xff0000,
    tadeath: 0xff0000,
    shirase: 0xff0000,
    tgm4_rounds: 0xff0000,
    marathon: 0x0088ff,
    ultra: 0x0088ff,
    zen: 0x0088ff,
    sprint_40: 0x0088ff,
    sprint_100: 0x0088ff,
    asuka_easy: 0xff8800,
    asuka_normal: 0xff8800,
    asuka_hard: 0xff8800,
    konoha_easy: 0xff69b4,
    konoha_hard: 0xff69b4,
    tgm3_sakura: 0x8800ff,
    flashpoint: 0x8800ff,
    easy_normal: 0x00ff00,
    easy_easy: 0x00ff00,
    tgm2_master: 0x888888,
    tgm2_normal: 0x00ff00,
    tgm3_easy: 0x00ff00,
    tgm_plus: 0x888888,
    tgm4_1_1: 0x888888,
    tgm4_2_1: 0xff0000,
    tgm4_3_1: 0xff0000,
    tgm4_4_1: 0xff0000,
    versus_guideline: 0xffcc00,
    versus_tgm: 0xffcc00,
    versus_guideline_ai: 0xffcc00,
    versus_tgm_ai: 0xffcc00
};

const MODE_DEFINITIONS = {
    // EASY modes
    tgm2_normal: {
        modeClass: 'TGM2NormalMode',
        name: 'Normal',
        category: 'EASY',
        config: {
            difficulty: 'easy',
            description: 'TGM2 Normal mode with item blocks at levels 100 and 200!'
        }
    },
    tgm3_easy: {
        modeClass: 'TGM3EasyMode',
        name: 'Easy',
        category: 'EASY',
        config: {
            difficulty: 'easy',
            description: 'TGM3 Easy with Hanabi scoring and credit roll'
        }
    },

    // STANDARD modes
    sprint_40: {
        modeClass: 'Sprint40Mode',
        name: 'Sprint 40L',
        category: 'STANDARD',
        config: {
            difficulty: 'standard',
            description: 'Clear 40 lines as fast as possible'
        }
    },
    sprint_100: {
        modeClass: 'Sprint40Mode',
        name: 'Sprint 100L',
        category: 'STANDARD',
        config: {
            difficulty: 'standard',
            description: 'Clear 100 lines as fast as possible',
            specialMechanics: { targetLines: 100, timeAttack: true, speedBonus: true }
        }
    },
    ultra: {
        modeClass: 'UltraMode',
        name: 'Ultra',
        category: 'STANDARD',
        config: {
            difficulty: 'standard',
            description: '2-minute score attack'
        }
    },
    marathon: {
        modeClass: 'MarathonMode',
        name: 'Marathon',
        category: 'STANDARD',
        config: {
            difficulty: 'standard',
            description: 'Clear 150 lines'
        }
    },
    zen: {
        modeClass: 'ZenMode',
        name: 'Zen',
        category: 'STANDARD',
        config: {
            difficulty: 'standard',
            description: 'Endless relaxed play'
        }
    },

    // MASTER modes
    tgm1: {
        modeClass: 'TGM1Mode',
        name: 'TGM1',
        category: 'MASTER',
        config: {
            difficulty: 'master',
            description: 'The Tetris game you know and love. Scale through the grades and be a Grand Master!'
        }
    },
    tgm2: {
        modeClass: 'TGM2MasterMode',
        name: 'TGM2',
        category: 'MASTER',
        config: {
            difficulty: 'master',
            description: 'Brand new mechanics, brand new challenges! Do you have what it takes?'
        }
    },
    tgm_plus: {
        modeClass: 'TGMPlusMode',
        name: 'TGM+',
        category: 'MASTER',
        config: {
            difficulty: 'master',
            description: 'Rising garbage mode with fixed 24-row pattern!'
        }
    },
    tgm3: {
        modeClass: 'TGM3Mode',
        name: 'TGM3',
        category: 'MASTER',
        config: {
            difficulty: 'master',
            description: 'Try to be COOL!!, or you will REGRET!! it'
        }
    },
    tgm4: {
        modeClass: 'TGM4NormalMode',
        name: 'TGM4 Normal',
        category: 'MASTER',
        config: {
            difficulty: 'master',
            description: 'TGM4 Normal: 999 levels with TGM1-inspired speed and Zero of Ten grading'
        }
    },
    tgm4_1_1: {
        modeClass: 'TGM4OneOneMode',
        name: '1.1',
        category: 'MASTER',
        config: {
            difficulty: 'master',
            description: 'TGM4 x.1 mode inspired by TGM1 with score-based grading'
        }
    },

    // 20G modes
    master_20g: {
        modeClass: 'Mode20G',
        name: '20G',
        category: '20G',
        config: {
            difficulty: '20g',
            description: 'Maximum gravity from the start! Good luck!'
        }
    },
    tadeath: {
        modeClass: 'TADeathMode',
        name: 'T.A.Death',
        category: '20G',
        config: {
            difficulty: '20g',
            description: 'Difficult 20G challenge mode. Speed is key!'
        }
    },
    shirase: {
        modeClass: 'TGM3ShiraseMode',
        name: 'Shirase',
        category: '20G',
        config: {
            difficulty: '20g',
            description: 'Lightning-fast speeds. Do you have what it takes?'
        }
    },
    tgm4_rounds: {
        modeClass: 'TGM4MasterMode',
        name: 'Rounds',
        category: '20G',
        config: {
            difficulty: '20g',
            description: 'TGM4 Rounds: 2600-level 20G challenge with Pikii, Cyclone, and End Game hooks'
        }
    },
    tgm4_2_1: {
        modeClass: 'TGM4TwoOneMode',
        name: '2.1',
        category: '20G',
        config: {
            difficulty: '20g',
            description: 'TGM4 x.1 mode inspired by T.A. Death with a level 500 torikan'
        }
    },
    tgm4_3_1: {
        modeClass: 'TGM4ThreeOneMode',
        name: '3.1',
        category: '20G',
        config: {
            difficulty: '20g',
            description: 'TGM4 x.1 mode inspired by Shirase, extended to level 2000'
        }
    },
    tgm4_4_1: {
        modeClass: 'TGM4FourOneMode',
        name: '4.1',
        category: '20G',
        config: {
            difficulty: '20g',
            description: 'TGM4 hidden x.1 mode with fixed 20G and invisible rising-garbage roll hooks'
        }
    },

    // RACE modes
    asuka_easy: {
        modeClass: 'TGM4AsukaEasyMode',
        name: 'Asuka Easy',
        category: 'RACE',
        config: {
            difficulty: 'race',
            description: 'TGM4 Asuka Easy: 30-minute introduction to Asuka with rewinds, infinity, and Ae grading'
        }
    },
    asuka_normal: {
        modeClass: 'TGM4AsukaNormalMode',
        name: 'Asuka',
        category: 'RACE',
        config: {
            difficulty: 'race',
            description: 'TGM4 Asuka: 20G Kita race to level 1300 with vanish and invisible phases'
        }
    },
    asuka_hard: {
        modeClass: 'TGM4AsukaHardMode',
        name: 'Asuka Hard',
        category: 'RACE',
        config: {
            difficulty: 'race',
            description: 'TGM4 Asuka Hard: 4:30 carry-over Kita challenge with per-section requirements'
        }
    },

    // ALL CLEAR / PUZZLE modes
    konoha_easy: {
        modeClass: 'TGM4KonohaEasyMode',
        name: 'Konoha Easy',
        category: 'ALL CLEAR',
        config: {
            difficulty: 'puzzle',
            description: 'Get Bravos to unlock new illustrations!'
        }
    },
    konoha_hard: {
        modeClass: 'TGM4KonohaHardMode',
        name: 'Konoha Hard',
        category: 'ALL CLEAR',
        config: {
            difficulty: 'puzzle',
            description: 'All seven pieces. How far can you go?'
        }
    },
    tgm3_sakura: {
        modeClass: 'TGM3SakuraMode',
        name: 'TGM3-Sakura',
        category: 'PUZZLE',
        config: {
            difficulty: 'puzzle',
            description: 'Puzzle mode from TGM3'
        }
    },
    flashpoint: {
        modeClass: 'ZenMode',
        name: 'Flashpoint',
        category: 'PUZZLE',
        config: {
            difficulty: 'puzzle',
            description: 'From Flashpoint.'
        }
    },

    // VERSUS modes
    versus_guideline: {
        modeClass: 'VersusGuidelineMode',
        name: 'Guideline',
        category: 'VERSUS',
        config: {
            difficulty: 'versus',
            description: 'Online 1v1 - SRS rotation, garbage sends, last player standing wins.'
        }
    },
    versus_tgm: {
        modeClass: 'VersusTGMMode',
        name: 'TGM',
        category: 'VERSUS',
        config: {
            difficulty: 'versus',
            description: 'Online 1v1 - TGM rules, 3-min timer, level tiebreaker.'
        }
    },
    versus_guideline_ai: {
        modeClass: 'VersusGuidelineMode',
        name: 'Guideline VS Minosa',
        category: 'VERSUS',
        config: {
            difficulty: 'versus',
            description: 'Local 1v1 versus Minosa AI with a 40-step adaptive ladder.',
            specialMechanics: {
                localAiVersus: true,
                localAiQueueType: 'guideline'
            }
        }
    },
    versus_tgm_ai: {
        modeClass: 'VersusTGMMode',
        name: 'TGM VS Minosa',
        category: 'VERSUS',
        config: {
            difficulty: 'versus',
            description: 'Local TGM versus Minosa AI. Ties advance to the next round.',
            specialMechanics: {
                localAiVersus: true,
                localAiQueueType: 'tgm'
            }
        }
    }
};

const ModeRegistry = {
    difficultyColors: MODE_DIFFICULTY_COLORS,
    modeColors: MODE_COLORS,
    modeDefinitions: MODE_DEFINITIONS,

    getDefinition(modeId) {
        return MODE_DEFINITIONS[modeId] || null;
    },

    getModeIds() {
        return Object.keys(MODE_DEFINITIONS);
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ModeRegistry;
}

if (typeof window !== 'undefined') {
    window.ModeRegistry = ModeRegistry;
    window.MODE_DIFFICULTY_COLORS = MODE_DIFFICULTY_COLORS;
    window.MODE_COLORS = MODE_COLORS;
    window.MODE_DEFINITIONS = MODE_DEFINITIONS;
}
