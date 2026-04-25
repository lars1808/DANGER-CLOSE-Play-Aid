// DANGER CLOSE — data, defaults, and localStorage utilities
(function () {
  const DEFAULT_EQUIPMENT = [
    // Armor
    { id: 'eq_armor_light',   name: 'Light Armor',        type: 'Armor',             description: '-1 to final DEF result. No protection bonus.', reqCost: 0, mobilityMod: 0,  owned: 2 },
    { id: 'eq_armor_medium',  name: 'Medium Armor',        type: 'Armor',             description: 'No special properties. The standard issue.', reqCost: 0, mobilityMod: -1, owned: 5 },
    { id: 'eq_armor_heavy',   name: 'Heavy Armor',         type: 'Armor',             description: '+1 to final DEF result. Bulky but protective.', reqCost: 0, mobilityMod: -2, owned: 2 },
    // Service Weapons
    { id: 'eq_carbine',       name: 'Carbine',             type: 'Service Weapon',    description: '+1 ATK when Engaged in Tight Space. -1 ATK when Engaged in Open Space.', reqCost: 0, mobilityMod: 0, owned: 3 },
    { id: 'eq_ar',            name: 'Assault Rifle',       type: 'Service Weapon',    description: 'No special properties. The reliable workhorse.', reqCost: 0, mobilityMod: 0, owned: 5 },
    { id: 'eq_marksman',      name: 'Marksman Rifle',      type: 'Service Weapon',    description: '+1 ATK when Engaged in Exposed Cover. -1 ATK when Engaged in Dense Cover.', reqCost: 0, mobilityMod: 0, owned: 2 },
    // Special Weapons
    { id: 'eq_utility_kit',   name: 'Utility Kit',         type: 'Special Weapon',    description: 'Smokes, flares, flashbangs. Active (1 Ammo each): Smoke: +1 Mobility this Exchange. Flashbang (Tight spaces): Flanking ATK benefit. Flare (Outdoors): +2–4 ATK, all Flanked Troopers Mobility Check or Injury.', reqCost: 0, mobilityMod: 0,  owned: 0 },
    { id: 'eq_lmg',           name: 'LMG',                 type: 'Special Weapon',    description: 'Passive: +1 DEF for a Trooper receiving Covering Fire from this weapon.', reqCost: 1, mobilityMod: -1, owned: 0 },
    { id: 'eq_hmg',           name: 'HMG',                 type: 'Special Weapon',    description: 'Active (1 Ammo): Covering Fire for up to 3 Troopers. Passive: +1 ATK when Fortified.', reqCost: 2, mobilityMod: -2, owned: 0 },
    { id: 'eq_sniper',        name: 'Sniper Rifle',        type: 'Special Weapon',    description: 'Passive: +1 ATK when Fortified. Additional +1 ATK when Fortified and didn\'t Move last Exchange.', reqCost: 1, mobilityMod: -1, owned: 0 },
    { id: 'eq_gren_launcher', name: 'Grenade Launcher',    type: 'Special Weapon',    description: 'Active (1 Ammo each): Hit a Hard Target directly, or grant another Trooper the Flanking benefit next Offense Roll.', reqCost: 1, mobilityMod: -1, owned: 0 },
    { id: 'eq_melee',         name: 'Melee Weapon',        type: 'Special Weapon',    description: 'Passive: When Moving Up to Flanking, can move to Flanked instead — grants +3 ATK.', reqCost: 0, mobilityMod: -1, owned: 0 },
    { id: 'eq_rocket',        name: 'Rocket Launcher',     type: 'Special Weapon',    description: 'Active: +3 ATK, or deal 2 Hits to a Hard Target. Single use.', reqCost: 1, mobilityMod: -1, owned: 0 },
    { id: 'eq_plasma',        name: 'Plasma Rifle',        type: 'Special Weapon',    description: 'Active (no Ammo): Roll 1d6. 1: +2 Injury + destroyed. 2–3: +1 Injury, +1 ATK. 4–5: +2 ATK or 1 Hit. 6: +3 ATK or 2 Hits.', reqCost: 3, mobilityMod: -1, owned: 0 },
    // Special Equipment
    { id: 'eq_demo',          name: 'Demolition Charges',  type: 'Special Equipment', description: 'Place when cleared, or at GAINING GROUND+ during Engagement. Requires 2 Exchanges.', reqCost: 0, mobilityMod: -1, owned: 0 },
    { id: 'eq_jump',          name: 'Jump Pack',           type: 'Special Equipment', description: 'Once per Engagement: instantly shift to any Offensive/Defensive position of choice.', reqCost: 2, mobilityMod: -1, owned: 0 },
    { id: 'eq_drone',         name: 'Drone Gear',          type: 'Special Equipment', description: '+1 to each Advance Roll. Does not stack with multiple Drone Gear.', reqCost: 0, mobilityMod: -1, owned: 0 },
    { id: 'eq_medic',         name: 'Medic Gear',          type: 'Special Equipment', description: 'Patch Wounded Troopers back to OK when out of combat.', reqCost: 0, mobilityMod: -1, owned: 0 },
    { id: 'eq_radio',         name: 'Radio Gear',          type: 'Special Equipment', description: 'Once per Mission: call artillery strike, hits in 1d2 Exchanges. +2 Momentum, Hard Targets destroyed. All Troopers Mobility Check or 1d3 Injury.', reqCost: 1, mobilityMod: -1, owned: 0 },
    { id: 'eq_supply',        name: 'Supply Backpack',     type: 'Special Equipment', description: 'Holds 6 extra Ammo for redistribution outside of combat.', reqCost: 1, mobilityMod: -1, owned: 0 },
    { id: 'eq_enviro',        name: 'Environmental Gear',  type: 'Special Equipment', description: 'Withstand dangerous environments or traverse hazardous terrain. One set equips 2 Troopers.', reqCost: 0, mobilityMod: -1, owned: 0 },
  ];

  const TROOPER_TAGS        = ['Forceful', 'Technical', 'Steady', 'Sharp'];
  const DUTY_STATUSES       = ['Active Duty', 'Recovering', 'Retired', 'KIA'];
  const STATUSES            = ['OK', 'Grazed', 'Wounded', 'Bleeding Out', 'Dead'];
  const OFFENSIVE_POSITIONS = ['Limited', 'Engaged', 'Flanking'];
  const DEFENSIVE_POSITIONS = ['Flanked', 'In Cover', 'Fortified'];
  const MOMENTUM_LEVELS     = ['DEFEAT', 'FALTERING', 'LOSING GROUND', 'CONTESTED', 'GAINING GROUND', 'BREAKING THROUGH', 'VICTORY'];
  const COVER_OPTIONS       = ['Exposed', 'Normal', 'Dense'];
  const SPACE_OPTIONS       = ['Tight', 'Transitional', 'Open'];
  const CONTENT_OPTIONS     = ['Empty', 'Boon', 'TL1', 'TL2', 'TL3', 'TL4', 'Cleared'];
  const DIFFICULTIES        = ['Routine', 'Hazardous', 'Desperate'];
  const AIRSPACES           = ['Clear', 'Contested', 'Hostile'];
  const MISSION_STATUSES    = ['TBD', 'Active', 'Success', 'Partial Success', 'Failure'];
  const EQUIPMENT_TYPES     = ['Armor', 'Service Weapon', 'Special Weapon', 'Special Equipment'];

  function genId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  function load(key, def) {
    try {
      const s = localStorage.getItem('dc_' + key);
      return s ? JSON.parse(s) : (typeof def === 'function' ? def() : def);
    } catch (e) { return typeof def === 'function' ? def() : def; }
  }

  function save(key, val) {
    try { localStorage.setItem('dc_' + key, JSON.stringify(val)); } catch (e) {}
  }

  function calcMobility(gearIds, equipmentList) {
    const BASE = 5;
    const mod = (gearIds || []).reduce((sum, gid) => {
      const item = equipmentList.find(e => e.id === gid);
      return sum + (item ? (item.mobilityMod || 0) : 0);
    }, 0);
    return BASE + mod;
  }

  function flankingBonusNum(mobility) {
    if (mobility >= 5) return 3;
    if (mobility >= 4) return 2;
    return 1;
  }

  function flankingBonusLabel(mobility) {
    return '+' + flankingBonusNum(mobility) + ' ATK';
  }

  function statusColor(status) {
    if (status === 'OK')           return 'status-ok';
    if (status === 'Grazed')       return 'status-grazed';
    if (status === 'Wounded')      return 'status-wounded';
    if (status === 'Bleeding Out') return 'status-bleeding';
    if (status === 'Dead')         return 'status-dead';
    return '';
  }

  function momentumColor(m) {
    if (m === 'DEFEAT')           return 'mom-defeat';
    if (m === 'FALTERING')        return 'mom-bad';
    if (m === 'LOSING GROUND')    return 'mom-bad';
    if (m === 'CONTESTED')        return 'mom-neutral';
    if (m === 'GAINING GROUND')   return 'mom-good';
    if (m === 'BREAKING THROUGH') return 'mom-good';
    if (m === 'VICTORY')          return 'mom-victory';
    return '';
  }

  function contentColor(c) {
    if (!c) return '';
    if (c === 'Empty' || c === 'Boon') return 'content-safe';
    if (c === 'Cleared')               return 'content-cleared';
    return 'content-threat';
  }

  function createTrooper(overrides) {
    return Object.assign({ id: genId(), name: 'New Trooper', rank: '', callsign: '', squad: '', grit: 1, maxGrit: 3, maxAmmo: 3, mobility: 4, tag: 'Forceful', gear: [], deployed: false, dutyStatus: 'Active Duty', notes: '' }, overrides || {});
  }

  function createMission(overrides) {
    return Object.assign({ id: genId(), name: 'New Mission', status: 'TBD', difficulty: 'Routine', airspace: 'Contested', type: '', objective: '', stakes: '', location: '', notes: '', deployedTroopers: [], sectors: [], createdAt: Date.now() }, overrides || {});
  }

  function createMissionTrooper(trooper) {
    return { trooperId: trooper.id, status: 'OK', grit: trooper.grit, ammo: 3, offensivePosition: 'Engaged', defensivePosition: 'In Cover', suppressed: false, atkDice: 0, defDice: 0 };
  }

  function createSector(overrides) {
    return Object.assign({ id: genId(), name: 'Sector ' + (Math.floor(Math.random() * 90) + 10), momentum: 'CONTESTED', cover: 'Normal', space: 'Transitional', content: 'TL1', pressure: 0, exchanges: 0, notes: '' }, overrides || {});
  }

  window.DC = {
    DEFAULT_EQUIPMENT, TROOPER_TAGS, DUTY_STATUSES, STATUSES, OFFENSIVE_POSITIONS, DEFENSIVE_POSITIONS,
    MOMENTUM_LEVELS, COVER_OPTIONS, SPACE_OPTIONS, CONTENT_OPTIONS, DIFFICULTIES,
    AIRSPACES, MISSION_STATUSES, EQUIPMENT_TYPES,
    genId, load, save,
    calcMobility, flankingBonusNum, flankingBonusLabel,
    statusColor, momentumColor, contentColor,
    createTrooper, createMission, createMissionTrooper, createSector
  };
})();
