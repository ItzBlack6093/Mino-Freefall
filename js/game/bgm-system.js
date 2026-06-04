(function (global) {
  const modernTracks = [
    { key: "mf1_1", path: "bgm/mf1_1.mp3", label: "TGM1 Stage 1" },
    { key: "mf1_2", path: "bgm/mf1_2.mp3", label: "TGM1 Stage 2" },
    { key: "mf1_endroll", path: "bgm/mf1_endroll.mp3", label: "TGM1 End Roll" },
    { key: "mf2_3", path: "bgm/mf2_3.mp3", label: "TGM2 Stage 3" },
    { key: "mf2_4", path: "bgm/mf2_4.mp3", label: "TGM2 Stage 4" },
    { key: "mf2_endroll", path: "bgm/mf2_endroll.mp3", label: "TGM2 End Roll" },
    { key: "mf3_4", path: "bgm/mf3_4.mp3", label: "TGM3 Stage 4" },
    { key: "mf3_6", path: "bgm/mf3_6.mp3", label: "TGM3 Stage 6" },
    { key: "mf4_endgame", path: "bgm/mf4_endgame.mp3", label: "TGM4 Endgame" },
    { key: "mf_zen", path: "bgm/standard/mf_zen.mp3", label: "Zen" },
    { key: "mf_std_1", path: "bgm/standard/mf_std_1.mp3", label: "Standard 1" },
    { key: "mf_std_2", path: "bgm/standard/mf_std_2.mp3", label: "Standard 2" },
    { key: "mf_std_3", path: "bgm/standard/mf_std_3.mp3", label: "Standard 3" },
    { key: "mf_konohaez", path: "bgm/konoha/mf_konohaez.mp3", label: "Konoha Easy" },
    { key: "mf_konohahard", path: "bgm/konoha/mf_konohahard.mp3", label: "Konoha Hard" },
    { key: "mf_konohahard2", path: "bgm/konoha/mf_konohahard2.mp3", label: "Konoha Hard 1000+" },
  ];

  const legacyTracks = [
    { key: "legacy_mf1_1", path: "bgm-old/tm1_1.mp3", label: "TGM1 Stage 1" },
    { key: "legacy_mf1_2", path: "bgm-old/tm1_2.mp3", label: "TGM1 Stage 2" },
    { key: "legacy_mf1_endroll", path: "bgm-old/tm1_endroll.mp3", label: "TGM1 End Roll" },
    { key: "legacy_mf2_3", path: "bgm-old/tm2_3.mp3", label: "TGM2 Stage 3" },
    { key: "legacy_mf2_4", path: "bgm-old/tm2_4.mp3", label: "TGM2 Stage 4" },
    { key: "legacy_mf3_4", path: "bgm-old/tm3_4.mp3", label: "TGM3 Stage 4" },
    { key: "legacy_mf3_6", path: "bgm-old/tm3_6.mp3", label: "TGM3 Stage 6" },
    { key: "legacy_mf_std_1", path: "bgm-old/standard/422_m1.mp3", label: "Standard 1" },
    { key: "legacy_mf_std_2", path: "bgm-old/standard/423_m2.mp3", label: "Standard 2" },
    { key: "legacy_mf_std_3", path: "bgm-old/standard/424_m3.mp3", label: "Standard 3" },
  ];

  const legacyMap = {
    mf1_1: "legacy_mf1_1",
    mf1_2: "legacy_mf1_2",
    mf1_endroll: "legacy_mf1_endroll",
    mf2_3: "legacy_mf2_3",
    mf2_4: "legacy_mf2_4",
    mf3_4: "legacy_mf3_4",
    mf3_6: "legacy_mf3_6",
    mf_zen: "legacy_mf_std_1",
    mf_std_1: "legacy_mf_std_1",
    mf_std_2: "legacy_mf_std_2",
    mf_std_3: "legacy_mf_std_3",
  };

  const tracks = [...modernTracks, ...legacyTracks];
  const tracksByKey = tracks.reduce((acc, track) => {
    acc[track.key] = Object.freeze({ loopStartSeconds: 0, ...track });
    return acc;
  }, {});

  const roomPacks = [
    {
      key: "modern",
      label: "Mino Freefall",
      color: "#00e5ff",
      tracks: modernTracks.map(({ key, label }) => ({ key, label })),
    },
    {
      key: "legacy",
      label: "Legacy",
      color: "#ffb347",
      tracks: legacyTracks.map(({ key, label }) => ({ key, label })),
    },
  ];

  function cacheHasAudio(cache, key) {
    return !!(cache && cache.audio && typeof cache.audio.exists === "function" && cache.audio.exists(key));
  }

  const BgmSystem = {
    listTracks() {
      return tracks.map((track) => ({ ...tracksByKey[track.key] }));
    },

    getTrackDefinition(key) {
      return tracksByKey[key] ? { ...tracksByKey[key] } : null;
    },

    getAudioAssets() {
      return tracks.map((track) => [track.key, track.path]);
    },

    getRoomPacks() {
      return roomPacks.map((pack) => ({
        ...pack,
        tracks: pack.tracks.map((track) => ({ ...track })),
      }));
    },

    getLegacyAssetKey(logicalKey) {
      return legacyMap[logicalKey] || null;
    },

    resolveAssetKey(logicalKey, style = "modern", cache = null) {
      if (style !== "legacy") return logicalKey;
      const legacyKey = legacyMap[logicalKey];
      if (!legacyKey) return logicalKey;
      return !cache || cacheHasAudio(cache, legacyKey) ? legacyKey : logicalKey;
    },

    getLoopBounds(key, duration = 0) {
      const definition = tracksByKey[key] || {};
      const safeDuration = Number.isFinite(duration) && duration > 0 ? duration : 0;
      const start = Math.max(0, Number(definition.loopStartSeconds) || 0);
      const configuredEnd = Number(definition.loopEndSeconds);
      const end =
        Number.isFinite(configuredEnd) && configuredEnd > start
          ? configuredEnd
          : safeDuration > start
            ? safeDuration
            : 0;
      return { start, end };
    },
  };

  global.BgmSystem = BgmSystem;

  if (typeof module !== "undefined" && module.exports) {
    module.exports = BgmSystem;
  }
})(typeof window !== "undefined" ? window : globalThis);
