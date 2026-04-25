// TrooperRow — compact mission-screen trooper component
const { useState: useTRState, useEffect: useTREffect, useRef: useTRRef } = React;

// ─── Color maps ───────────────────────────────────────────────────────────────
function statusColorStyle(s) {
  if (s === 'OK')           return { bg: 'var(--green)',   fg: '#fff' };
  if (s === 'Grazed')       return { bg: '#ca8a04',        fg: '#fff' };
  if (s === 'Wounded')      return { bg: 'var(--amber)',   fg: '#fff' };
  if (s === 'Bleeding Out') return { bg: 'var(--red)',     fg: '#fff' };
  if (s === 'Dead')         return { bg: 'var(--text-3)',  fg: '#fff' };
  return { bg: 'var(--surface-2)', fg: 'var(--text)' };
}

function offColorStyle(p) {
  if (p === 'Flanking') return { bg: 'var(--green)',   fg: '#fff' };
  if (p === 'Limited')  return { bg: 'var(--text-3)',  fg: '#fff' };
  return { bg: '#475569', fg: '#fff' }; // Engaged
}

function defColorStyle(p) {
  if (p === 'Fortified') return { bg: 'var(--green)',  fg: '#fff' };
  if (p === 'Flanked')   return { bg: 'var(--red)',    fg: '#fff' };
  return { bg: '#475569', fg: '#fff' }; // In Cover
}

// ─── ColoredSelect ────────────────────────────────────────────────────────────
function ColoredSelect({ value, options, onChange, colorFn, minWidth }) {
  const [open, setOpen] = useTRState(false);
  const ref = useTRRef(null);
  const current = colorFn(value);

  // Close on outside click
  useTREffect(() => {
    if (!open) return;
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const chevronSvg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23ffffff'/%3E%3C/svg%3E")`;

  return React.createElement('div', { ref, style: { position: 'relative', flexShrink: 0, zIndex: open ? 300 : 'auto' } },
    // Trigger
    React.createElement('button', {
      style: {
        padding: '0 20px 0 7px', borderRadius: 2, border: 'none',
        background: current.bg, color: current.fg,
        fontFamily: 'inherit', fontSize: 10, fontWeight: 700,
        height: 26, lineHeight: '26px',
        cursor: 'pointer', letterSpacing: '.03em',
        backgroundImage: chevronSvg,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 6px center',
        minWidth: minWidth || 80,
        width: minWidth || 80,
        whiteSpace: 'nowrap', lineHeight: '1.6',
        transition: 'opacity .1s',
      },
      onClick: e => { e.stopPropagation(); setOpen(o => !o); }
    }, value),

    // Dropdown
    open && React.createElement('div', {
      style: {
        position: 'absolute', top: 'calc(100% + 3px)', left: 0, zIndex: 400,
        minWidth: '100%', background: 'var(--surface)',
        border: '1px solid var(--border)', borderRadius: 8,
        boxShadow: 'var(--shadow-md)', overflow: 'hidden',
      }
    },
      options.map((opt, i) => {
        const c = colorFn(opt);
        return React.createElement('button', {
          key: opt,
          style: {
            display: 'block', width: '100%', padding: '8px 12px',
            border: 'none', borderBottom: i < options.length - 1 ? '1px solid rgba(0,0,0,.08)' : 'none',
            background: c.bg, color: c.fg,
            fontFamily: 'inherit', fontSize: 12, fontWeight: 700,
            cursor: 'pointer', textAlign: 'left', letterSpacing: '.03em',
            opacity: opt === value ? 1 : 0.85,
            outline: opt === value ? '2px solid rgba(255,255,255,.5)' : 'none',
            outlineOffset: '-2px',
          },
          onMouseEnter: e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.filter = 'brightness(1.1)'; },
          onMouseLeave: e => { e.currentTarget.style.opacity = opt === value ? '1' : '0.85'; e.currentTarget.style.filter = ''; },
          onClick: e => { e.stopPropagation(); onChange(opt); setOpen(false); }
        }, opt);
      })
    )
  );
}

// ─── Tooltip ──────────────────────────────────────────────────────────────────
function DCTooltip({ text, children }) {
  const [show, setShow] = useTRState(false);
  return React.createElement('span', {
    className: 'dc-tooltip-wrap',
    style: { position: 'relative', zIndex: show ? 500 : 'auto' },
    onMouseEnter: () => setShow(true),
    onMouseLeave: () => setShow(false),
  },
    children,
    show && React.createElement('div', { className: 'dc-tooltip', style: { zIndex: 500 } }, text)
  );
}

const OFF_TIPS = {
  'Limited':  'Limited\nPinned or obstructed. Reduced ability to fire: -1 ATK.',
  'Engaged':  'Engaged\nStandard firing position. Full ATK contribution.',
  'Flanking': 'Flanking\nExposed angle with clear line of fire. Adds Flanking Bonus ATK, but less protected.',
};

const DEF_TIPS = {
  'Flanked':   'Flanked\nEnemy has an angle on you. Direct Fire on 1–3.',
  'In Cover':  'In Cover\nStandard defensive position. Direct Fire on 1–2.',
  'Fortified': 'Fortified\nSolid cover, well-protected. Direct Fire on 1 only.',
};

// ─── Gear Info Lightbox ───────────────────────────────────────────────────────
function GearLightbox({ item, onClose }) {
  const typeColors = {
    'Armor':             { badge: 'badge-neutral' },
    'Service Weapon':    { badge: 'badge-neutral' },
    'Special Weapon':    { badge: 'badge-blue'    },
    'Special Equipment': { badge: 'badge-amber'   },
  };
  const tc = typeColors[item.type] || { badge: 'badge-neutral' };

  return React.createElement('div', {
    className: 'overlay',
    onClick: onClose,
    style: { zIndex: 600 },
  },
    React.createElement('div', {
      className: 'modal',
      style: { maxWidth: 400 },
      onClick: e => e.stopPropagation(),
    },
      // Header
      React.createElement('div', { style: { display: 'flex', alignItems: 'flex-start', gap: 10 } },
        React.createElement('div', { style: { flex: 1 } },
          React.createElement('div', { style: { fontSize: 18, fontWeight: 700, color: 'var(--text)', lineHeight: 1.2 } }, item.name),
          React.createElement('div', { style: { display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap', alignItems: 'center' } },
            React.createElement('span', { className: `badge ${tc.badge}` }, item.type),
            item.reqCost > 0 && React.createElement('span', { className: 'badge badge-neutral' }, `REQ ${item.reqCost}`),
            item.mobilityMod !== 0 && React.createElement('span', { className: 'badge badge-neutral' },
              `MOB ${item.mobilityMod > 0 ? '+' : ''}${item.mobilityMod}`
            )
          )
        ),
        React.createElement('button', { className: 'icon-btn', onClick: onClose },
          React.createElement('svg', { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2 },
            React.createElement('line', { x1: 18, y1: 6, x2: 6, y2: 18 }),
            React.createElement('line', { x1: 6, y1: 6, x2: 18, y2: 18 })
          )
        )
      ),
      item.description && React.createElement('p', {
        style: { fontSize: 13, color: 'var(--text-2)', lineHeight: 1.7, marginTop: 4, padding: '10px 12px', background: 'var(--surface-2)', borderRadius: 7, border: '1px solid var(--border)' }
      }, item.description),
      React.createElement('div', { style: { display: 'flex', justifyContent: 'flex-end' } },
        React.createElement('button', { className: 'btn btn-secondary btn-sm', onClick: onClose }, 'Close')
      )
    )
  );
}

// ─── Cycle helper ─────────────────────────────────────────────────────────────
function cycleVal(val, opts) {
  const i = opts.indexOf(val);
  return opts[(i + 1) % opts.length];
}

// ─── Text-only colour helpers (no backgrounds) ────────────────────────────────
function statusTextColor(s) {
  if (s === 'OK')           return 'var(--green)';
  if (s === 'Grazed')       return 'var(--amber)';
  if (s === 'Wounded')      return 'var(--amber)';
  if (s === 'Bleeding Out') return 'var(--red)';
  if (s === 'Dead')         return 'var(--text-3)';
  return 'var(--text)';
}
function offTextColor(p) {
  if (p === 'Flanking') return 'var(--green)';
  if (p === 'Limited')  return 'var(--text-3)';
  return 'var(--text-2)';
}
function defTextColor(p) {
  if (p === 'Flanked')   return 'var(--red)';
  if (p === 'Fortified') return 'var(--green)';
  return 'var(--text-2)';
}

// ─── TrooperRow ───────────────────────────────────────────────────────────────
function TrooperRow({ missionTrooper: mt, mission, onUpdate, onRemove, allTroopers, allEquipment, warnings }) {
  const [expanded, setExpanded] = useTRState(false);
  const [gearModal, setGearModal] = useTRState(null);

  const trooper = allTroopers.find(t => t.id === mt.trooperId);
  if (!trooper) return null;

  const hasWarning = warnings && warnings.length > 0;
  const displayName = trooper.callsign || trooper.name;
  const maxGrit = trooper.maxGrit !== undefined ? trooper.maxGrit : 3;
  const maxAmmo = trooper.maxAmmo !== undefined ? trooper.maxAmmo : 3;
  const atkDice = mt.atkDice || 0;
  const defDice = mt.defDice || 0;

  const gearItems = (trooper.gear || []).map(gid => allEquipment.find(e => e.id === gid)).filter(Boolean);
  const tagColors = { Forceful: 'badge-red', Technical: 'badge-blue', Steady: 'badge-amber', Sharp: 'badge-green' };

  // Bare counter — fixed-width cell, uppercase bold label, tabular numeral
  function InlineCounter({ label, value, onDec, onInc }) {
    const nudge = {
      background: 'none', border: 'none', cursor: 'pointer', padding: '0 2px',
      fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-3)',
      lineHeight: 1, transition: 'color .1s', fontWeight: 600,
    };
    return React.createElement('span', { style: { display: 'flex', alignItems: 'center', gap: 1 } },
      React.createElement('span', { style: { fontSize: 10, fontWeight: 700, color: 'var(--text-3)', letterSpacing: '.06em', fontFamily: 'var(--font-mono)', marginRight: 3, textTransform: 'uppercase' } }, label),
      React.createElement('button', { style: nudge, onClick: onDec, onMouseEnter: e => e.currentTarget.style.color = 'var(--text)', onMouseLeave: e => e.currentTarget.style.color = 'var(--text-3)' }, '\u2212'),
      React.createElement('span', { style: { fontSize: 12, fontWeight: 700, color: 'var(--text)', fontVariantNumeric: 'tabular-nums', fontFamily: 'var(--font-mono)', width: 16, textAlign: 'center', display: 'inline-block' } }, value),
      React.createElement('button', { style: nudge, onClick: onInc, onMouseEnter: e => e.currentTarget.style.color = 'var(--text)', onMouseLeave: e => e.currentTarget.style.color = 'var(--text-3)' }, '+')
    );
  }

  // Bracket toggle — uppercase, fixed width
  function BracketBtn({ value, color, bold, width, onClick, title: t }) {
    return React.createElement('button', {
      style: { background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: bold ? 700 : 600, color, letterSpacing: '.05em', lineHeight: 1, width, textAlign: 'left', display: 'block' },
      onClick, title: t,
    }, '[' + value + ']');
  }

  const dot = React.createElement('span', { style: { color: 'var(--border-2)', fontSize: 10, userSelect: 'none', display: 'flex', alignItems: 'center' } }, '\u00b7');

  return React.createElement('div', {
    className: `trooper-row${hasWarning ? ' trooper-row-warned' : ''}`,
    style: { position: 'relative', overflow: 'visible', padding: '7px 12px' }
  },

    // ── Single console line — CSS grid for rigid column alignment ──────────
    React.createElement('div', {
      style: {
        display: 'grid',
        gridTemplateColumns: '14px 88px 10px 108px 80px 88px 56px 10px 94px 100px 72px 72px 24px',
        alignItems: 'center',
        columnGap: 4,
      }
    },

      // Expand arrow
      React.createElement('button', {
        style: { background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', padding: 0, fontSize: 9, fontFamily: 'var(--font-mono)', lineHeight: 1 },
        onClick: () => setExpanded(x => !x),
      }, expanded ? '\u25be' : '\u25b8'),

      // Name
      React.createElement('span', {
        style: { fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 13, letterSpacing: '.05em', color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }
      }, displayName),

      dot,

      // Status — bold uppercase colored, click to cycle
      React.createElement('button', {
        style: { background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', color: statusTextColor(mt.status), lineHeight: 1, textAlign: 'left', width: '100%' },
        onClick: () => onUpdate({ status: cycleVal(mt.status, DC.STATUSES) }),
        title: 'Click to cycle',
      }, mt.status),

      // Offensive — bracketed uppercase
      React.createElement(BracketBtn, { value: mt.offensivePosition.toUpperCase(), color: offTextColor(mt.offensivePosition), bold: false, width: '100%', onClick: () => onUpdate({ offensivePosition: cycleVal(mt.offensivePosition, DC.OFFENSIVE_POSITIONS) }), title: OFF_TIPS[mt.offensivePosition] || 'Click to cycle' }),

      // Defensive — bracketed uppercase
      React.createElement(BracketBtn, { value: mt.defensivePosition.toUpperCase(), color: defTextColor(mt.defensivePosition), bold: false, width: '100%', onClick: () => onUpdate({ defensivePosition: cycleVal(mt.defensivePosition, DC.DEFENSIVE_POSITIONS) }), title: DEF_TIPS[mt.defensivePosition] || 'Click to cycle' }),

      // SUPP
      React.createElement(BracketBtn, { value: 'SUPP', color: mt.suppressed ? 'var(--red)' : 'var(--text-3)', bold: mt.suppressed, width: '100%', onClick: () => onUpdate({ suppressed: !mt.suppressed }), title: mt.suppressed ? 'Clear suppression' : 'Mark suppressed' }),

      dot,

      // GRIT
      React.createElement(InlineCounter, { label: 'GRIT', value: mt.grit,  onDec: () => onUpdate({ grit: Math.max(0, mt.grit - 1) }),    onInc: () => onUpdate({ grit: Math.min(maxGrit, mt.grit + 1) }) }),
      // AMMO
      React.createElement(InlineCounter, { label: 'AMMO', value: mt.ammo,  onDec: () => onUpdate({ ammo: Math.max(0, mt.ammo - 1) }),    onInc: () => onUpdate({ ammo: Math.min(maxAmmo, mt.ammo + 1) }) }),
      // ATK
      React.createElement(InlineCounter, { label: 'ATK',  value: atkDice,  onDec: () => onUpdate({ atkDice: Math.max(0, atkDice - 1) }), onInc: () => onUpdate({ atkDice: atkDice + 1 }) }),
      // DEF
      React.createElement(InlineCounter, { label: 'DEF',  value: defDice,  onDec: () => onUpdate({ defDice: Math.max(0, defDice - 1) }), onInc: () => onUpdate({ defDice: defDice + 1 }) }),

      // Remove ×
      React.createElement('button', {
        style: { background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', padding: 0, fontSize: 13, fontFamily: 'var(--font-mono)', opacity: 0.4, lineHeight: 1, justifySelf: 'end' },
        onClick: onRemove, title: 'Remove from mission',
        onMouseEnter: e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.color = 'var(--red)'; },
        onMouseLeave: e => { e.currentTarget.style.opacity = '0.4'; e.currentTarget.style.color = 'var(--text-3)'; },
      }, '\u00d7')
    ),

    // ── Expanded details ───────────────────────────────────────────────────
    expanded && React.createElement('div', { className: 'trooper-row-expand' },
      React.createElement('div', { style: { display: 'flex', gap: 20, flexWrap: 'wrap' } },
        React.createElement('div', { style: { minWidth: 160 } },
          React.createElement('div', { className: 'label', style: { marginBottom: 4 } }, 'Identity'),
          React.createElement('div', { style: { fontSize: 12, color: 'var(--text-2)', lineHeight: 1.7 } },
            trooper.rank  && React.createElement('div', null, trooper.rank),
            trooper.squad && React.createElement('div', null, trooper.squad),
            trooper.tag   && React.createElement('span', { className: `badge ${tagColors[trooper.tag] || 'badge-neutral'}`, style: { marginTop: 2 } }, trooper.tag)
          )
        ),
        gearItems.length > 0 && React.createElement('div', { style: { flex: 1, minWidth: 160 } },
          React.createElement('div', { className: 'label', style: { marginBottom: 4 } }, 'Gear — click for details'),
          React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 4 } },
            gearItems.map(g =>
              React.createElement('button', {
                key: g.id, className: 'gear-chip',
                style: { cursor: 'pointer', background: 'var(--surface-2)', border: '1px solid var(--border-2)', transition: 'background .1s' },
                onMouseEnter: e => e.currentTarget.style.background = 'var(--surface-3)',
                onMouseLeave: e => e.currentTarget.style.background = 'var(--surface-2)',
                onClick: () => setGearModal(g),
              }, g.name)
            )
          )
        ),
        trooper.notes && React.createElement('div', { style: { flex: 1, minWidth: 160 } },
          React.createElement('div', { className: 'label', style: { marginBottom: 4 } }, 'Notes'),
          React.createElement('p', { style: { fontSize: 12, color: 'var(--text-2)', fontStyle: 'italic', lineHeight: 1.5 } }, trooper.notes)
        )
      )
    ),

    // Gear lightbox
    gearModal && React.createElement(GearLightbox, { item: gearModal, onClose: () => setGearModal(null) })
  );
}

Object.assign(window, { TrooperRow, DCTooltip, ColoredSelect });
