// Mission Screen — the play surface
const { useState: useMState, useContext: useMContext } = React;

// ─── Sector dropdown colour maps ─────────────────────────────────────────────
function coverColorStyle(v) {
  if (v === 'Dense')    return { bg: 'var(--green)',   fg: '#fff' };
  if (v === 'Exposed')  return { bg: 'var(--red)',     fg: '#fff' };
  return { bg: '#475569', fg: '#fff' }; // Normal
}
function spaceColorStyle(v) {
  if (v === 'Tight')         return { bg: 'var(--amber)', fg: '#fff' };
  if (v === 'Open')          return { bg: 'var(--amber)', fg: '#fff' };
  return { bg: '#475569', fg: '#fff' }; // Transitional
}
function contentColorStyle(v) {
  if (v === 'Cleared')  return { bg: 'var(--green)',   fg: '#fff' };
  if (v === 'Boon')     return { bg: 'var(--blue)',    fg: '#fff' };
  if (v === 'TL1')      return { bg: 'var(--amber)',   fg: '#fff' };
  if (v === 'TL2')      return { bg: '#b85c00',        fg: '#fff' };
  if (v === 'TL3')      return { bg: 'var(--red)',     fg: '#fff' };
  if (v === 'TL4')      return { bg: '#8b1a0a',        fg: '#fff' };
  return { bg: 'var(--surface-3)', fg: 'var(--text-2)' }; // Empty
}

// ─── Text-only colour helpers for sector bracket buttons ──────────────────────
function coverTextColor(v) {
  if (v === 'Dense')   return 'var(--green)';
  if (v === 'Exposed') return 'var(--red)';
  return 'var(--text-2)';
}
function spaceTextColor(v) {
  if (v === 'Tight') return 'var(--amber)';
  return 'var(--text-2)';
}
function contentTextColor(v) {
  if (v === 'Cleared') return 'var(--green)';
  if (v === 'Boon')    return 'var(--blue)';
  if (v === 'TL1')     return 'var(--amber)';
  if (v === 'TL2')     return 'var(--amber)';
  if (v === 'TL3')     return 'var(--red)';
  if (v === 'TL4')     return 'var(--red)';
  return 'var(--text-2)';
}

// ─── Local cycle helper ────────────────────────────────────────────────────────
function cycleVal(val, opts) {
  const i = opts.indexOf(val);
  return opts[(i + 1) % opts.length];
}

const TL_CONTENTS = new Set(['TL1','TL2','TL3','TL4']);

// ─── Momentum Tracker ─────────────────────────────────────────────────────────
const MOM_SEGS = [
  { key: 'DEFEAT',           short: 'DEF',     bg: 'var(--red)',    bgDim: 'var(--red-bg)',    fg: '#fff',            fgDim: 'var(--red)'    },
  { key: 'FALTERING',        short: 'FALT',    bg: '#c84010',       bgDim: '#fef0ea',          fg: '#fff',            fgDim: '#c84010'       },
  { key: 'LOSING GROUND',    short: 'LOSING',  bg: 'var(--amber)',  bgDim: 'var(--amber-bg)',  fg: 'var(--surface)',  fgDim: 'var(--amber)'  },
  { key: 'CONTESTED',        short: 'CONT',    bg: 'var(--text-2)', bgDim: 'var(--surface-3)', fg: 'var(--surface)',  fgDim: 'var(--text-3)' },
  { key: 'GAINING GROUND',   short: 'GAINING', bg: '#1a7a4a',       bgDim: '#e8f7ef',          fg: '#fff',            fgDim: '#1a7a4a'       },
  { key: 'BREAKING THROUGH', short: 'BREAK',   bg: 'var(--green)',  bgDim: 'var(--green-bg)',  fg: '#fff',            fgDim: 'var(--green)'  },
  { key: 'VICTORY',          short: 'VIC',     bg: '#16a34a',       bgDim: '#dcfce7',          fg: '#fff',            fgDim: '#16a34a'       },
];

// Dark-mode overrides for dim backgrounds (CSS vars handle most, but a few hardcoded ones need help)
function MomentumTracker({ value, onChange }) {
  return React.createElement('div', { className: 'mom-track' },
    MOM_SEGS.map(seg => {
      const isActive = seg.key === value;
      return React.createElement('button', {
        key: seg.key,
        className: 'mom-seg',
        title: seg.key,
        onClick: () => onChange(seg.key),
        style: {
          background: isActive ? seg.bg : seg.bgDim,
          color: isActive ? seg.fg : seg.fgDim,
          fontWeight: isActive ? 700 : 500,
          whiteSpace: 'normal', wordBreak: 'break-word', lineHeight: 1.2, fontSize: 8,
        }
      }, seg.key);
    })
  );
}

// ─── Engagement Steps ─────────────────────────────────────────────────────────
const ENG_STEPS = ['Intent', 'Offense Roll', 'Defense Rolls', 'Resolve Momentum', 'Enemy Tactics'];

// ─── Mission Screen ───────────────────────────────────────────────────────────
function MissionScreen() {
  const {
    activeMission: mission, troopers, equipment,
    updateMission, loadSquad,
    updateMissionTrooper, removeMissionTrooper,
    addSector, updateSector, deleteSector,
  } = useMContext(window.AppCtx);

  const [headerOpen, setHeaderOpen] = useMState(false);
  const [activeSectorId, setActiveSectorId] = useMState(null);
  const [engStep, setEngStep] = useMState(null);

  if (!mission) {
    return React.createElement('div', { style: { maxWidth: 760, margin: '0 auto', padding: '48px 16px', textAlign: 'center' } },
      React.createElement('p', { style: { color: 'var(--text-3)' } }, 'No mission selected. Go to Missions to open one.')
    );
  }

  const deployedTroopers = mission.deployedTroopers || [];
  const sectors = mission.sectors || [];

  // ── Position limit warnings ─────────────────────────────────────
  const activeSector = sectors.find(s => s.id === activeSectorId) || null;

  function getCoverLimit(cover) {
    if (cover === 'Exposed') return 0;
    if (cover === 'Normal')  return 2;
    return Infinity;
  }
  function getSpaceLimit(space) {
    if (space === 'Tight')        return 0;
    if (space === 'Transitional') return 2;
    return Infinity;
  }

  const fortifiedLimit = activeSector ? getCoverLimit(activeSector.cover) : Infinity;
  const flankingLimit  = activeSector ? getSpaceLimit(activeSector.space)  : Infinity;
  const fortifiedCount = deployedTroopers.filter(mt => mt.defensivePosition === 'Fortified').length;
  const flankingCount  = deployedTroopers.filter(mt => mt.offensivePosition === 'Flanking').length;

  function getTrooperWarnings(mt) {
    const w = [];
    if (mt.defensivePosition === 'Fortified' && fortifiedCount > fortifiedLimit) {
      w.push(`Cover (${activeSector.cover}): max ${fortifiedLimit === 0 ? 'none' : fortifiedLimit} Fortified`);
    }
    if (mt.offensivePosition === 'Flanking' && flankingCount > flankingLimit) {
      w.push(`Space (${activeSector.space}): max ${flankingLimit === 0 ? 'none' : flankingLimit} Flanking`);
    }
    return w;
  }

  function updateField(key, val) { updateMission(mission.id, { [key]: val }); }
  function updateMT(trooperId, patch) { updateMissionTrooper(mission.id, trooperId, patch); }
  function removeMT(trooperId) { removeMissionTrooper(mission.id, trooperId); }

  // ── ATK / Engagement calculations ───────────────────────────────
  const squadAtk = deployedTroopers.reduce((sum, mt) => sum + (mt.atkDice || 0), 0);

  const activePressure  = activeSector ? (activeSector.pressure  || 0) : 0;
  const activeExchanges = activeSector ? (activeSector.exchanges || 0) : 0;

  const tlMap = { TL1: 1, TL2: 2, TL3: 3, TL4: 4 };
  const activeTL = activeSector ? (tlMap[activeSector.content] || null) : null;
  const pressureCap = activeTL !== null ? activeTL + 1 : null;
  const pressureAtCap = pressureCap !== null && activePressure >= pressureCap;

  function setActivePressure(v) {
    if (!activeSector) return;
    const capped = pressureCap !== null ? Math.min(pressureCap, Math.max(0, v)) : Math.max(0, v);
    updateSector(mission.id, activeSector.id, { pressure: capped });
  }
  function setActiveExchanges(v) {
    if (!activeSector) return;
    updateSector(mission.id, activeSector.id, { exchanges: Math.max(0, v) });
  }

  function resetAllDice() {
    deployedTroopers.forEach(mt => {
      updateMT(mt.trooperId, { suppressed: false, atkDice: 0, defDice: 0 });
    });
  }

  return React.createElement('div', { style: { maxWidth: 960, margin: '0 auto', padding: '20px 14px' } },

    // ── Mission Header ──────────────────────────────────────────────────────
    React.createElement('div', { className: 'card', style: { marginBottom: 16, overflow: 'hidden' } },

      // Summary bar
      React.createElement('div', {
        style: { display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', cursor: 'pointer', flexWrap: 'wrap' },
        onClick: () => setHeaderOpen(o => !o),
      },
        React.createElement('input', {
          value: mission.name,
          onChange: e => updateField('name', e.target.value),
          onClick: e => e.stopPropagation(),
          style: {
            fontSize: 17, fontWeight: 700, background: 'transparent', border: 'none', outline: 'none',
            color: 'var(--text)', fontFamily: 'inherit', flex: 1, minWidth: 120, cursor: 'text',
          },
          placeholder: 'Mission name',
        }),
        React.createElement('select', {
          className: 'dc-select dc-select-sm',
          value: mission.status,
          onChange: e => { e.stopPropagation(); updateField('status', e.target.value); },
          onClick: e => e.stopPropagation(),
          style: { flexShrink: 0 }
        }, DC.MISSION_STATUSES.map(s => React.createElement('option', { key: s, value: s }, s))),
        React.createElement('select', {
          className: 'dc-select dc-select-sm',
          value: mission.difficulty,
          onChange: e => { e.stopPropagation(); updateField('difficulty', e.target.value); },
          onClick: e => e.stopPropagation(),
          style: { flexShrink: 0 }
        }, DC.DIFFICULTIES.map(d => React.createElement('option', { key: d, value: d }, d))),
        React.createElement('select', {
          className: 'dc-select dc-select-sm',
          value: mission.airspace,
          onChange: e => { e.stopPropagation(); updateField('airspace', e.target.value); },
          onClick: e => e.stopPropagation(),
          style: { flexShrink: 0 }
        }, DC.AIRSPACES.map(a => React.createElement('option', { key: a, value: a }, a + ' Airspace'))),
        React.createElement('svg', {
          width: 14, height: 14, viewBox: '0 0 24 24', fill: 'none', stroke: 'var(--text-3)', strokeWidth: 2,
          style: { flexShrink: 0, transition: 'transform .15s', transform: headerOpen ? 'rotate(180deg)' : 'none' }
        }, React.createElement('polyline', { points: '6 9 12 15 18 9' }))
      ),

      // Expanded fields
      headerOpen && React.createElement('div', {
        style: { padding: '0 16px 16px', borderTop: '1px solid var(--border)', paddingTop: 14 },
        onClick: e => e.stopPropagation()
      },
        React.createElement('div', { className: 'mission-meta-grid' },
          React.createElement(MField, { label: 'Type' },
            React.createElement('input', { className: 'dc-input', value: mission.type, onChange: e => updateField('type', e.target.value), placeholder: 'Assault, Sabotage…' })
          ),
          React.createElement(MField, { label: 'Location' },
            React.createElement('input', { className: 'dc-input', value: mission.location, onChange: e => updateField('location', e.target.value), placeholder: 'Where?' })
          ),
          React.createElement(MField, { label: 'Objective', style: { gridColumn: '1 / -1' } },
            React.createElement('input', { className: 'dc-input', value: mission.objective, onChange: e => updateField('objective', e.target.value), placeholder: 'Primary objective' })
          ),
          React.createElement(MField, { label: 'Stakes' },
            React.createElement('input', { className: 'dc-input', value: mission.stakes, onChange: e => updateField('stakes', e.target.value), placeholder: 'What\'s at stake?' })
          ),
        )
      )
    ),

    // ── Deployed Troopers ───────────────────────────────────────────────────
    React.createElement('div', { style: { marginBottom: 16 } },
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 } },
        React.createElement('span', { className: 'section-title' }, `Troopers (${deployedTroopers.length})`),
        React.createElement('div', { style: { flex: 1, height: 1, background: 'var(--border)' } }),
        React.createElement('button', {
          className: 'btn btn-secondary btn-xs',
          onClick: () => loadSquad(mission.id),
          title: 'Add all deployed troopers to this mission'
        }, 'Load Squad')
      ),
      deployedTroopers.length > 0
        ? React.createElement('div', { className: 'card', style: { padding: 0 } },
            deployedTroopers.map(mt =>
              React.createElement(window.TrooperRow, {
                key: mt.trooperId, missionTrooper: mt, mission,
                onUpdate: patch => updateMT(mt.trooperId, patch),
                onRemove: () => removeMT(mt.trooperId),
                allTroopers: troopers, allEquipment: equipment,
                warnings: getTrooperWarnings(mt),
              })
            )
          )
        : React.createElement('div', { className: 'inset', style: { padding: '20px 16px', textAlign: 'center' } },
            React.createElement('p', { style: { color: 'var(--text-3)', fontSize: 13 } },
              'No troopers loaded. Mark troopers as Deployed in the Troopers screen, then press Load Squad.'
            )
          )
    ),

    // ── Sectors ─────────────────────────────────────────────────────────────
    React.createElement('div', { style: { marginBottom: 16 } },
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 } },
        React.createElement('span', { className: 'section-title' }, `Sectors (${sectors.length})`),
        React.createElement('div', { style: { flex: 1, height: 1, background: 'var(--border)' } }),
        React.createElement('button', {
          className: 'btn btn-secondary btn-xs',
          onClick: () => addSector(mission.id)
        },
          React.createElement('svg', { width: 11, height: 11, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2.5 },
            React.createElement('line', { x1: 12, y1: 5, x2: 12, y2: 19 }),
            React.createElement('line', { x1: 5, y1: 12, x2: 19, y2: 12 })
          ),
          'Add Sector'
        )
      ),
      sectors.length === 0
        ? React.createElement('div', { className: 'inset', style: { padding: '20px 16px', textAlign: 'center' } },
            React.createElement('p', { style: { color: 'var(--text-3)', fontSize: 13 } }, 'No sectors yet. Add one to begin the advance.')
          )
        : React.createElement('div', null,
            sectors.map((sector, idx) =>
              React.createElement(SectorCard, {
                key: sector.id, sector, index: idx,
                isActive: sector.id === activeSectorId,
                onActivate: () => setActiveSectorId(id => id === sector.id ? null : sector.id),
                onChange: patch => updateSector(mission.id, sector.id, patch),
                onDelete: () => deleteSector(mission.id, sector.id),
              })
            ),
            React.createElement('button', {
              className: 'btn btn-ghost btn-sm',
              style: { color: 'var(--text-3)', width: '100%', justifyContent: 'center', border: '1px dashed var(--border)', marginTop: 4 },
              onClick: () => addSector(mission.id)
            },
              React.createElement('svg', { width: 12, height: 12, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2 },
                React.createElement('line', { x1: 12, y1: 5, x2: 12, y2: 19 }),
                React.createElement('line', { x1: 5, y1: 12, x2: 19, y2: 12 })
              ),
              'Add Sector'
            )
          )
    ),

    // ── Engagement Bar ───────────────────────────────────────────────────────
    React.createElement('div', { style: { marginBottom: 8 } },
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 } },
        React.createElement('span', { className: 'section-title' }, 'Engagement'),
        React.createElement('div', { style: { flex: 1, height: 1, background: 'var(--border)' } })
      ),
      React.createElement('div', { style: { display: 'flex', border: '1px solid var(--border)', borderRadius: 2, overflow: 'hidden' } },
        ENG_STEPS.map((step, i) =>
          React.createElement('button', {
            key: step,
            onClick: () => setEngStep(s => s === step ? null : step),
            style: {
              flex: 1,
              padding: '7px 6px',
              border: 'none',
              borderRight: i < ENG_STEPS.length - 1 ? '1px solid var(--border)' : 'none',
              background: engStep === step ? 'var(--text)' : 'var(--surface)',
              color: engStep === step ? 'var(--bg)' : 'var(--text-3)',
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '.06em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'background .12s, color .12s',
              whiteSpace: 'nowrap',
            }
          }, step)
        )
      ),
      activeSector && React.createElement('div', { style: { marginTop: 4 } },
        React.createElement(MomentumTracker, {
          value: activeSector.momentum,
          onChange: m => updateSector(mission.id, activeSector.id, { momentum: m }),
        })
      )
    ),

    // ── ATK / EXCHANGES / PRESSURE bar ──────────────────────────────────────
    React.createElement('div', {
      style: {
        display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
        marginBottom: 16,
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 2, overflow: 'hidden',
      }
    },
      // ── Section 1: ATK + reset ──
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRight: '1px solid var(--border)' } },
        React.createElement('span', { style: { fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, letterSpacing: '.06em', color: 'var(--text-3)', textTransform: 'uppercase' } }, 'ATK:'),
        React.createElement('span', { style: { fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: 'var(--text)' } }, squadAtk),
        activePressure > 0 && React.createElement('span', { style: { fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--red)', fontWeight: 600 } }, '\u2212' + activePressure + ' pres.'),
        React.createElement('div', { style: { flex: 1 } }),
        React.createElement('button', {
          style: { background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', padding: 0, display: 'flex', alignItems: 'center' },
          onClick: resetAllDice, title: 'Reset all ATK & DEF dice',
          onMouseEnter: e => e.currentTarget.style.color = 'var(--text)',
          onMouseLeave: e => e.currentTarget.style.color = 'var(--text-3)',
        },
          React.createElement('svg', { width: 12, height: 12, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2 },
            React.createElement('polyline', { points: '1 4 1 10 7 10' }),
            React.createElement('path', { d: 'M3.51 15a9 9 0 1 0 .49-4.95' })
          )
        )
      ),

      // ── Section 2: EXCHANGES ──
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRight: '1px solid var(--border)' } },
        React.createElement('span', { style: { fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, letterSpacing: '.06em', color: 'var(--text-3)', textTransform: 'uppercase', flexShrink: 0 } }, 'Exchanges:'),
        React.createElement('button', {
          style: { background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 11, color: activeSector ? 'var(--text-3)' : 'var(--border)', fontWeight: 600, padding: '0 2px' },
          onClick: () => setActiveExchanges(activeExchanges - 1),
        }, '\u2212'),
        React.createElement('span', { style: { fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: activeSector ? 'var(--text)' : 'var(--text-3)', fontVariantNumeric: 'tabular-nums', minWidth: 16, textAlign: 'center', display: 'inline-block' } }, activeExchanges),
        React.createElement('button', {
          style: { background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 11, color: activeSector ? 'var(--text-3)' : 'var(--border)', fontWeight: 600, padding: '0 2px' },
          onClick: () => setActiveExchanges(activeExchanges + 1),
        }, '+')
      ),

      // ── Section 3: PRESSURE ──
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px' } },
        React.createElement('span', { style: { fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, letterSpacing: '.06em', color: pressureAtCap ? 'var(--red)' : 'var(--text-3)', textTransform: 'uppercase', flexShrink: 0 } }, 'Pressure:'),
        React.createElement('button', {
          style: { background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 11, color: activeSector ? 'var(--text-3)' : 'var(--border)', fontWeight: 600, padding: '0 2px' },
          onClick: () => setActivePressure(activePressure - 1),
        }, '\u2212'),
        React.createElement('span', { style: { fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: pressureAtCap ? 'var(--red)' : (activeSector ? 'var(--text)' : 'var(--text-3)'), fontVariantNumeric: 'tabular-nums', minWidth: 16, textAlign: 'center', display: 'inline-block' } }, activePressure),
        React.createElement('button', {
          style: { background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 11, color: activeSector ? 'var(--text-3)' : 'var(--border)', fontWeight: 600, padding: '0 2px' },
          onClick: () => setActivePressure(activePressure + 1),
        }, '+')
      )
    ),

    // ── Mission Notes ────────────────────────────────────────────────────────
    React.createElement('div', { style: { marginBottom: 24 } },
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 } },
        React.createElement('span', { className: 'section-title' }, 'Mission Notes'),
        React.createElement('div', { style: { flex: 1, height: 1, background: 'var(--border)' } })
      ),
      React.createElement('textarea', {
        className: 'dc-textarea',
        value: mission.notes,
        onChange: e => updateField('notes', e.target.value),
        placeholder: 'Field notes, after-action observations, narrative details…',
        rows: 4,
      })
    )
  );
}

// ─── Sector Card ──────────────────────────────────────────────────────────────
function SectorCard({ sector, index, isActive, onActivate, onChange, onDelete }) {
  const [notesOpen, setNotesOpen] = useMState(false);
  const [confirmDelete, setConfirmDelete] = useMState(false);

  return React.createElement('div', { className: `sector-card${isActive ? ' sector-active' : ''}` },

    // ── Top row ──────────────────────────────────────────────────────────
    React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', flexWrap: 'wrap' } },

      // Activate radio button
      React.createElement('button', {
        className: `sector-activate-btn${isActive ? ' active' : ''}`,
        onClick: onActivate,
        title: isActive ? 'Deactivate sector' : 'Set as active sector',
      },
        isActive && React.createElement('svg', { width: 8, height: 8, viewBox: '0 0 8 8', fill: '#fff' },
          React.createElement('circle', { cx: 4, cy: 4, r: 3 })
        )
      ),

      // Index
      React.createElement('span', { style: { fontSize: 11, fontWeight: 700, color: isActive ? 'var(--green)' : 'var(--text-3)', minWidth: 20, flexShrink: 0, fontVariantNumeric: 'tabular-nums', fontFamily: 'var(--font-mono)' } },
        String(index + 1).padStart(2, '0')
      ),

      // Name
      React.createElement('input', {
        className: 'sector-name-input',
        value: sector.name,
        onChange: e => onChange({ name: e.target.value }),
        placeholder: 'Sector name…',
        style: { minWidth: 80, maxWidth: 150, flex: '0 1 130px' }
      }),

      React.createElement('div', { style: { width: 1, height: 16, background: 'var(--border)', flexShrink: 0 } }),

      // Inline bracket cycle fields: Cover, Space, Content — fixed column widths
      ...[
        { label: 'Cover',   key: 'cover',   opts: DC.COVER_OPTIONS,   colorFn: coverTextColor,   btnWidth: 72  },
        { label: 'Space',   key: 'space',   opts: DC.SPACE_OPTIONS,   colorFn: spaceTextColor,   btnWidth: 112 },
        { label: 'Content', key: 'content', opts: DC.CONTENT_OPTIONS, colorFn: contentTextColor, btnWidth: 76  },
      ].map(({ label, key, opts, colorFn, btnWidth }) =>
        React.createElement('div', { key: label, style: { display: 'flex', alignItems: 'center', gap: 3, flexShrink: 0 } },
          React.createElement('span', { style: { fontSize: 9, fontWeight: 700, color: 'var(--text-3)', letterSpacing: '.07em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap', width: 52, display: 'inline-block' } }, label + ':'),
          React.createElement('button', {
            style: { background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, color: colorFn(sector[key]), letterSpacing: '.05em', lineHeight: 1, width: btnWidth, display: 'inline-block', textAlign: 'left' },
            onClick: () => onChange({ [key]: cycleVal(sector[key], opts) }),
          }, '[' + sector[key].toUpperCase() + ']')
        )
      ),

      // Actions
      React.createElement('div', { style: { marginLeft: 'auto', display: 'flex', gap: 2, flexShrink: 0 } },
        React.createElement('button', {
          className: 'icon-btn',
          style: { width: 26, height: 26, color: notesOpen || sector.notes ? 'var(--amber)' : 'var(--text-3)' },
          onClick: () => setNotesOpen(o => !o), title: 'Toggle notes'
        },
          React.createElement('svg', { width: 12, height: 12, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2 },
            React.createElement('path', { d: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z' }),
            React.createElement('polyline', { points: '14 2 14 8 20 8' }),
            React.createElement('line', { x1: 16, y1: 13, x2: 8, y2: 13 }),
            React.createElement('line', { x1: 16, y1: 17, x2: 8, y2: 17 })
          )
        ),
        React.createElement('button', {
          className: 'icon-btn', style: { width: 26, height: 26 },
          onClick: () => setConfirmDelete(true), title: 'Delete sector'
        },
          React.createElement('svg', { width: 12, height: 12, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2 },
            React.createElement('polyline', { points: '3 6 5 6 21 6' }),
            React.createElement('path', { d: 'M19 6l-1 14H6L5 6' }),
            React.createElement('path', { d: 'M9 6V4h6v2' })
          )
        )
      )
    ),

    // ── Notes ─────────────────────────────────────────────────────────────
    notesOpen && React.createElement('div', { style: { padding: '0 12px 10px', borderTop: '1px solid var(--border)' } },
      React.createElement('textarea', {
        className: 'dc-textarea',
        value: sector.notes,
        onChange: e => onChange({ notes: e.target.value }),
        placeholder: 'Terrain details, events, what happened here…',
        rows: 2, style: { marginTop: 8 }
      })
    ),

    // Delete confirm
    confirmDelete && React.createElement('div', { className: 'overlay', onClick: () => setConfirmDelete(false) },
      React.createElement('div', { className: 'modal', onClick: e => e.stopPropagation() },
        React.createElement('div', { className: 'modal-title' }, 'Delete Sector'),
        React.createElement('p', { style: { color: 'var(--text-2)', fontSize: 13 } }, `Delete "${sector.name}"? This cannot be undone.`),
        React.createElement('div', { style: { display: 'flex', gap: 8, justifyContent: 'flex-end' } },
          React.createElement('button', { className: 'btn btn-secondary', onClick: () => setConfirmDelete(false) }, 'Cancel'),
          React.createElement('button', { className: 'btn btn-danger', onClick: () => { onDelete(); setConfirmDelete(false); } }, 'Delete')
        )
      )
    )
  );
}

function MField({ label, children, style }) {
  return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 4, ...style } },
    React.createElement('span', { className: 'label' }, label),
    children
  );
}

Object.assign(window, { MissionScreen, SectorCard, MField, MomentumTracker });
