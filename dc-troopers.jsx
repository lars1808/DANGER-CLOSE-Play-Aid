// Trooper Screen — roster management
const { useState: useTState, useContext: useTContext, useCallback: useTCallback } = React;

// ─── Duty status colours (module-scope so TrooperCard can use them) ───────────
const DUTY_STATUS_STYLE = {
  'Active Duty': { color: 'var(--green)',  bg: 'var(--green-bg)'  },
  'Recovering':  { color: 'var(--amber)',  bg: 'var(--amber-bg)'  },
  'Retired':     { color: 'var(--text-3)', bg: 'var(--surface-3)' },
  'KIA':         { color: 'var(--red)',    bg: 'var(--red-bg)'    },
};

function TrooperScreen() {
  const { troopers, equipment, addTrooper, updateTrooper, deleteTrooper } = useTContext(window.AppCtx);
  const [filter, setFilter] = useTState('active');
  const [editing, setEditing] = useTState(null);
  const [confirmDelete, setConfirmDelete] = useTState(null);

  const DUTY_ORDER = ['Active Duty', 'Recovering', 'Retired', 'KIA'];

  const deployedList = troopers.filter(t => t.deployed);

  // All view: group by duty status, skip empty groups
  const dutyGroups = DUTY_ORDER
    .map(status => ({ status, list: troopers.filter(t => (t.dutyStatus || 'Active Duty') === status) }))
    .filter(g => g.list.length > 0);

  return React.createElement('div', { style: { maxWidth: 800, margin: '0 auto', padding: '24px 16px' } },
    // Header
    React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, flexWrap: 'wrap' } },
      React.createElement('div', null,
        React.createElement('h1', { style: { fontSize: 20, fontWeight: 700, color: 'var(--text)' } }, 'Troopers'),
        React.createElement('p', { style: { fontSize: 13, color: 'var(--text-3)', marginTop: 2 } },
          troopers.length === 0 ? 'No troopers yet.' : `${troopers.filter(t => t.deployed).length} deployed · ${troopers.length} total`
        )
      ),
      React.createElement('div', { style: { marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' } },
        React.createElement('div', { className: 'toggle' },
          React.createElement('button', { className: `toggle-btn ${filter === 'active' ? 'active' : ''}`, onClick: () => setFilter('active') }, 'Deployed'),
          React.createElement('button', { className: `toggle-btn ${filter === 'all' ? 'active' : ''}`, onClick: () => setFilter('all') }, 'All')
        ),
        React.createElement('button', { className: 'btn btn-primary btn-sm', onClick: addTrooper },
          React.createElement('svg', { width: 12, height: 12, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2.5 },
            React.createElement('line', { x1: 12, y1: 5, x2: 12, y2: 19 }),
            React.createElement('line', { x1: 5, y1: 12, x2: 19, y2: 12 })
          ),
          'Add Trooper'
        )
      )
    ),

    filter === 'active' && deployedList.length === 0
      ? React.createElement('div', { className: 'card', style: { padding: 48, textAlign: 'center' } },
          React.createElement('p', { style: { color: 'var(--text-3)', fontSize: 14 } },
            'No deployed troopers. Mark troopers as deployed in the All view.'
          )
        )
      : filter === 'all' && troopers.length === 0
        ? React.createElement('div', { className: 'card', style: { padding: 48, textAlign: 'center' } },
            React.createElement('p', { style: { color: 'var(--text-3)', fontSize: 14 } }, 'No troopers yet. Add one to get started.')
          )
      : filter === 'active'
        // Deployed view — flat list
        ? React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 8 } },
            deployedList.map(t =>
              React.createElement(TrooperCard, {
                key: t.id, trooper: t, equipment,
                onEdit: () => setEditing(t.id),
                onDelete: () => setConfirmDelete(t.id),
                onToggleDeploy: () => updateTrooper(t.id, { deployed: !t.deployed })
              })
            )
          )
        // All view — grouped by duty status
        : React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 20 } },
            dutyGroups.map(group =>
              React.createElement('div', { key: group.status },
                React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 } },
                  React.createElement('span', {
                    style: {
                      fontSize: 10, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase',
                      fontFamily: 'var(--font-mono)', color: (DUTY_STATUS_STYLE[group.status] || {}).color || 'var(--text-3)',
                      padding: '2px 7px', borderRadius: 1,
                      background: (DUTY_STATUS_STYLE[group.status] || {}).bg || 'var(--surface-3)',
                    }
                  }, group.status),
                  React.createElement('span', { style: { fontSize: 10, color: 'var(--text-3)', fontFamily: 'var(--font-mono)' } }, group.list.length),
                  React.createElement('div', { style: { flex: 1, height: 1, background: 'var(--border)' } })
                ),
                React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 8 } },
                  group.list.map(t =>
                    React.createElement(TrooperCard, {
                      key: t.id, trooper: t, equipment,
                      onEdit: () => setEditing(t.id),
                      onDelete: () => setConfirmDelete(t.id),
                      onToggleDeploy: () => updateTrooper(t.id, { deployed: !t.deployed })
                    })
                  )
                )
              )
            )
          ),

    // Edit modal
    editing && React.createElement(TrooperEditModal, {
      trooper: troopers.find(t => t.id === editing),
      allTroopers: troopers,
      equipment,
      onSave: patch => { updateTrooper(editing, patch); setEditing(null); },
      onClose: () => setEditing(null)
    }),

    // Delete confirm
    confirmDelete && React.createElement('div', { className: 'overlay', onClick: () => setConfirmDelete(null) },
      React.createElement('div', { className: 'modal', onClick: e => e.stopPropagation() },
        React.createElement('div', { className: 'modal-title' }, 'Delete Trooper'),
        React.createElement('p', { style: { color: 'var(--text-2)', fontSize: 13 } }, 'This will permanently delete this trooper. This cannot be undone.'),
        React.createElement('div', { style: { display: 'flex', gap: 8, justifyContent: 'flex-end' } },
          React.createElement('button', { className: 'btn btn-secondary', onClick: () => setConfirmDelete(null) }, 'Cancel'),
          React.createElement('button', { className: 'btn btn-danger', onClick: () => { deleteTrooper(confirmDelete); setConfirmDelete(null); } }, 'Delete')
        )
      )
    )
  );
}

// ─── Trooper Card (roster view) ───────────────────────────────────────────────
function TrooperCard({ trooper: t, equipment, onEdit, onDelete, onToggleDeploy }) {
  const mobility = DC.calcMobility(t.gear, equipment);
  const flank = DC.flankingBonusLabel(mobility);
  const gearItems = (t.gear || []).map(gid => equipment.find(e => e.id === gid)).filter(Boolean);

  const tagColors = { Forceful: 'badge-red', Technical: 'badge-blue', Steady: 'badge-amber', Sharp: 'badge-green' };

  return React.createElement('div', { className: 'card', style: { padding: '14px 16px' } },
    React.createElement('div', { style: { display: 'flex', alignItems: 'flex-start', gap: 12 } },
      // Deployed toggle
      React.createElement('button', {
        title: t.deployed ? 'Mark as not deployed' : 'Mark as deployed',
        onClick: onToggleDeploy,
        style: {
          width: 32, height: 32, borderRadius: '50%', flexShrink: 0, marginTop: 2,
          border: `2px solid ${t.deployed ? 'var(--green)' : 'var(--border-2)'}`,
          background: t.deployed ? 'var(--green-bg)' : 'transparent',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all .15s',
        }
      },
        t.deployed
          ? React.createElement('svg', { width: 14, height: 14, viewBox: '0 0 24 24', fill: 'none', stroke: 'var(--green)', strokeWidth: 2.5 },
              React.createElement('polyline', { points: '20 6 9 17 4 12' }))
          : null
      ),

      // Main content
      React.createElement('div', { style: { flex: 1, minWidth: 0 } },
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' } },
          React.createElement('span', { style: { fontSize: 15, fontWeight: 700 } },
            t.callsign || t.name
          ),
          t.callsign && React.createElement('span', { style: { fontSize: 13, color: 'var(--text-2)' } }, t.name),
          t.rank && React.createElement('span', { style: { fontSize: 12, color: 'var(--text-3)' } }, t.rank),
          t.squad && React.createElement('span', { className: 'badge badge-neutral', style: { fontSize: 10 } }, t.squad),
          t.tag && React.createElement('span', { className: `badge ${tagColors[t.tag] || 'badge-neutral'}` }, t.tag),
          t.dutyStatus && t.dutyStatus !== 'Active Duty' && React.createElement('span', {
            className: 'badge',
            style: {
              background: DUTY_STATUS_STYLE[t.dutyStatus]?.bg || 'var(--surface-3)',
              color: DUTY_STATUS_STYLE[t.dutyStatus]?.color || 'var(--text-3)',
            }
          }, t.dutyStatus),
        ),
        React.createElement('div', { style: { display: 'flex', gap: 16, marginTop: 6, flexWrap: 'wrap' } },
          React.createElement('span', { style: { fontSize: 12, color: 'var(--text-2)' } },
            React.createElement('span', { style: { fontWeight: 600 } }, 'Grit '), t.grit
          ),
          React.createElement('span', { style: { fontSize: 12, color: 'var(--text-2)' } },
            React.createElement('span', { style: { fontWeight: 600 } }, 'Mobility '), mobility, ' → ', flank
          ),
          gearItems.length > 0 && React.createElement('span', { style: { fontSize: 12, color: 'var(--text-3)' } },
            gearItems.map(g => g.name).join(', ')
          )
        ),
        t.notes && React.createElement('p', { style: { fontSize: 12, color: 'var(--text-3)', marginTop: 5, fontStyle: 'italic' } }, t.notes)
      ),

      // Actions
      React.createElement('div', { style: { display: 'flex', gap: 4, flexShrink: 0 } },
        React.createElement('button', { className: 'btn btn-secondary btn-xs', onClick: onEdit }, 'Edit'),
        React.createElement('button', { className: 'icon-btn', onClick: onDelete, title: 'Delete' },
          React.createElement('svg', { width: 13, height: 13, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2 },
            React.createElement('polyline', { points: '3 6 5 6 21 6' }),
            React.createElement('path', { d: 'M19 6l-1 14H6L5 6' }),
            React.createElement('path', { d: 'M10 11v6M14 11v6' }),
            React.createElement('path', { d: 'M9 6V4h6v2' })
          )
        )
      )
    )
  );
}

// ─── Trooper Edit Modal ───────────────────────────────────────────────────────
function TrooperEditModal({ trooper, allTroopers, equipment, onSave, onClose }) {
  const [form, setForm] = useTState({ ...trooper });

  function set(k, v) { setForm(f => ({ ...f, [k]: v })); }

  // For required slots: select exactly one item of a given type (radio behavior)
  function selectRequired(eid, type) {
    setForm(f => {
      const sameTypeIds = equipment.filter(e => e.type === type).map(e => e.id);
      const gear = (f.gear || []).filter(g => !sameTypeIds.includes(g));
      return { ...f, gear: [...gear, eid] };
    });
  }

  // For optional items: toggle
  function toggleGear(eid) {
    setForm(f => {
      const gear = f.gear || [];
      return { ...f, gear: gear.includes(eid) ? gear.filter(g => g !== eid) : [...gear, eid] };
    });
  }

  // Compute available count for an item (owned minus other troopers who have it equipped)
  function getAvailable(item) {
    const equippedByOthers = (allTroopers || []).filter(t => t.id !== form.id && (t.gear || []).includes(item.id)).length;
    return item.owned - equippedByOthers;
  }

  const equippedGear = form.gear || [];

  // Partition equipment by type
  const armorItems   = equipment.filter(e => e.type === 'Armor');
  const weaponItems  = equipment.filter(e => e.type === 'Service Weapon');
  const optionalItems = equipment.filter(e => e.type === 'Special Weapon' || e.type === 'Special Equipment');

  // Show all optional items; disable selection when none are available
  const availableOptional = optionalItems;

  // Computed mobility
  const computedMobility = DC.calcMobility(equippedGear, equipment);

  // Mob mod breakdown for display
  const mobBreakdown = equippedGear.reduce((acc, gid) => {
    const item = equipment.find(e => e.id === gid);
    if (item && item.mobilityMod !== 0) acc.push(`${item.mobilityMod > 0 ? '+' : ''}${item.mobilityMod} ${item.name}`);
    return acc;
  }, []);

  const selectedArmor  = armorItems.find(e => equippedGear.includes(e.id));
  const selectedWeapon = weaponItems.find(e => equippedGear.includes(e.id));
  const gearValid = !!selectedArmor && !!selectedWeapon;

  function handleSave() {
    // Persist computed mobility so mission view & card can read t.mobility
    onSave({ ...form, mobility: computedMobility });
  }

  // ── Inline row renderers (plain functions, not React components) ─
  function renderRequiredRow(item, type) {
    const checked = equippedGear.includes(item.id);
    return React.createElement('label', {
      key: item.id,
      style: {
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '5px 8px', borderRadius: 5, cursor: 'pointer',
        background: checked ? 'var(--green-bg)' : 'transparent',
        border: `1px solid ${checked ? 'color-mix(in srgb, var(--green) 30%, transparent)' : 'transparent'}`,
        transition: 'all .1s',
      }
    },
      React.createElement('input', {
        type: 'radio', name: `req-${type}`, checked,
        onChange: () => selectRequired(item.id, type),
        style: { accentColor: 'var(--green)', cursor: 'pointer', flexShrink: 0 }
      }),
      React.createElement('span', { style: { flex: 1, fontSize: 13, fontWeight: checked ? 600 : 400, color: checked ? 'var(--green)' : 'var(--text)' } }, item.name),
      item.mobilityMod !== 0
        ? React.createElement('span', { style: { fontSize: 11, color: checked ? 'var(--green)' : 'var(--text-3)', fontWeight: 600, minWidth: 28, textAlign: 'right' } },
            item.mobilityMod > 0 ? `+${item.mobilityMod}` : item.mobilityMod)
        : React.createElement('span', { style: { fontSize: 11, color: 'var(--text-3)', minWidth: 28, textAlign: 'right' } }, '—')
    );
  }

  function renderOptionalRow(item) {
    const checked = equippedGear.includes(item.id);
    const avail = getAvailable(item);
    const disabled = !checked && avail <= 0;
    return React.createElement('tr', {
      key: item.id,
      style: { opacity: disabled ? 0.45 : 1, background: checked ? 'var(--green-bg)' : 'transparent' }
    },
      React.createElement('td', { style: { padding: '5px 8px', width: 28, verticalAlign: 'middle' } },
        React.createElement('input', {
          type: 'checkbox', checked, disabled,
          onChange: () => { if (!disabled) toggleGear(item.id); },
          style: { accentColor: 'var(--green)', cursor: disabled ? 'not-allowed' : 'pointer' }
        })
      ),
      React.createElement('td', { style: { padding: '5px 4px', fontSize: 13, fontWeight: checked ? 600 : 400, color: checked ? 'var(--green)' : 'var(--text)', verticalAlign: 'middle' } }, item.name),
      React.createElement('td', { style: { padding: '5px 4px', fontSize: 11, color: 'var(--text-3)', verticalAlign: 'middle' } }, item.type),
      React.createElement('td', { style: { padding: '5px 8px', fontSize: 11, color: checked ? 'var(--green)' : 'var(--text-3)', fontWeight: 600, textAlign: 'right', verticalAlign: 'middle', minWidth: 32 } },
        item.mobilityMod !== 0 ? (item.mobilityMod > 0 ? `+${item.mobilityMod}` : item.mobilityMod) : '—'
      ),
      React.createElement('td', { style: { padding: '5px 8px', fontSize: 11, color: checked ? 'var(--green)' : disabled ? 'var(--text-3)' : 'var(--text-2)', textAlign: 'right', verticalAlign: 'middle', whiteSpace: 'nowrap' } },
        checked ? React.createElement('span', { style: { color: 'var(--green)' } }, 'Equipped')
                : disabled ? '0 owned' : `${avail} avail`
      )
    );
  }

  return React.createElement('div', { className: 'overlay', onClick: onClose },
    React.createElement('div', { className: 'modal', style: { maxWidth: 560 }, onClick: e => e.stopPropagation() },

      // Header
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', marginBottom: 4 } },
        React.createElement('h2', { className: 'modal-title' }, 'Edit Trooper'),
        React.createElement('button', { className: 'icon-btn', style: { marginLeft: 'auto' }, onClick: onClose },
          React.createElement('svg', { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2 },
            React.createElement('line', { x1: 18, y1: 6, x2: 6, y2: 18 }),
            React.createElement('line', { x1: 6, y1: 6, x2: 18, y2: 18 })
          )
        )
      ),

      // Identity
      React.createElement(FieldRow, { label: 'Name' },
        React.createElement('input', { className: 'dc-input', value: form.name, onChange: e => set('name', e.target.value), placeholder: 'Trooper name' })
      ),
      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 } },
        React.createElement(FieldRow, { label: 'Rank' },
          React.createElement('input', { className: 'dc-input', value: form.rank, onChange: e => set('rank', e.target.value), placeholder: 'e.g. Sergeant' })
        ),
        React.createElement(FieldRow, { label: 'Callsign' },
          React.createElement('input', { className: 'dc-input', value: form.callsign, onChange: e => set('callsign', e.target.value), placeholder: 'e.g. VIPER' })
        )
      ),
      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 } },
        React.createElement(FieldRow, { label: 'Squad' },
          React.createElement('input', { className: 'dc-input', value: form.squad, onChange: e => set('squad', e.target.value), placeholder: 'e.g. TIGER COMMANDOS' })
        ),
        React.createElement(FieldRow, { label: 'Tag' },
          React.createElement('select', { className: 'dc-select', value: form.tag, onChange: e => set('tag', e.target.value), style: { width: '100%' } },
            DC.TROOPER_TAGS.map(t => React.createElement('option', { key: t, value: t }, t))
          )
        )
      ),
      React.createElement(FieldRow, { label: 'Duty Status' },
        React.createElement('select', { className: 'dc-select', value: form.dutyStatus || 'Active Duty', onChange: e => set('dutyStatus', e.target.value), style: { width: '100%' } },
          DC.DUTY_STATUSES.map(s => React.createElement('option', { key: s, value: s }, s))
        )
      ),

      // Stats
      React.createElement('hr', { className: 'divider' }),
      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 } },
        React.createElement(FieldRow, { label: 'Grit (start)' },
          React.createElement('input', { className: 'dc-input', type: 'number', min: 0, max: form.maxGrit || 3, value: form.grit,
            onChange: e => set('grit', Math.max(0, Math.min(form.maxGrit || 3, parseInt(e.target.value) || 0))) })
        ),
        React.createElement(FieldRow, { label: 'Max Grit' },
          React.createElement('input', { className: 'dc-input', type: 'number', min: 0, max: 9, value: form.maxGrit !== undefined ? form.maxGrit : 3,
            onChange: e => set('maxGrit', Math.max(0, parseInt(e.target.value) || 0)) })
        ),
        React.createElement(FieldRow, { label: 'Max Ammo' },
          React.createElement('input', { className: 'dc-input', type: 'number', min: 0, max: 9, value: form.maxAmmo !== undefined ? form.maxAmmo : 3,
            onChange: e => set('maxAmmo', Math.max(0, parseInt(e.target.value) || 0)) })
        )
      ),

      // Computed mobility display
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 12, padding: '8px 10px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 7, marginTop: 2 } },
        React.createElement('div', null,
          React.createElement('div', { style: { fontSize: 11, fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--text-3)' } }, 'Mobility'),
          React.createElement('div', { style: { fontSize: 22, fontWeight: 700, color: 'var(--text)', lineHeight: 1.1, marginTop: 1 } }, computedMobility)
        ),
        React.createElement('div', { style: { flex: 1 } },
          React.createElement('div', { style: { fontSize: 11, color: 'var(--text-3)', lineHeight: 1.7 } },
            React.createElement('span', null, '5 base'),
            mobBreakdown.length > 0
              ? mobBreakdown.map((b, i) => React.createElement('span', { key: i }, ` · ${b}`))
              : null
          ),
          React.createElement('div', { style: { fontSize: 11, color: 'var(--text-3)', marginTop: 1 } },
            '→ ', React.createElement('span', { style: { fontWeight: 600, color: 'var(--green)' } }, DC.flankingBonusLabel(computedMobility)),
            React.createElement('span', { style: { color: 'var(--text-3)', marginLeft: 6 } }, '(−1 if Wounded / Bleeding Out / Dead)')
          )
        )
      ),

      // Deployed — above gear (no HR before it, flows from stats)
      React.createElement('label', { style: { display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, marginTop: 4 } },
        React.createElement('input', { type: 'checkbox', checked: form.deployed, onChange: e => set('deployed', e.target.checked), style: { width: 15, height: 15, cursor: 'pointer', accentColor: 'var(--green)' } }),
        React.createElement('span', { style: { fontWeight: 500 } }, 'Deployed'),
        React.createElement('span', { style: { color: 'var(--text-3)', fontSize: 12 } }, '— include in active missions')
      ),

      // ── Equipped Gear ────────────────────────────────────────────
      React.createElement('hr', { className: 'divider' }),
      React.createElement('div', { className: 'label', style: { marginBottom: 8 } }, 'Equipped Gear'),

      // Required: two-column table (Armor | Service Weapon)
      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12, flexShrink: 0 } },

        // Armor column
        React.createElement('div', { style: { background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 7, overflow: 'hidden' } },
          React.createElement('div', { style: { padding: '6px 10px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 6 } },
            React.createElement('span', { style: { fontSize: 11, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--text-2)' } }, 'Armor'),
            React.createElement('span', { style: { fontSize: 10, color: !selectedArmor ? 'var(--red)' : 'var(--green)', fontWeight: 600 } }, !selectedArmor ? 'Required' : '✓'),
            React.createElement('span', { style: { marginLeft: 'auto', fontSize: 10, color: 'var(--text-3)' } }, 'MOB')
          ),
          React.createElement('div', { style: { padding: '4px 2px' } },
            armorItems.map(item => renderRequiredRow(item, 'Armor'))
          )
        ),

        // Service Weapon column
        React.createElement('div', { style: { background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 7, overflow: 'hidden' } },
          React.createElement('div', { style: { padding: '6px 10px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 6 } },
            React.createElement('span', { style: { fontSize: 11, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--text-2)' } }, 'Service Weapon'),
            React.createElement('span', { style: { fontSize: 10, color: !selectedWeapon ? 'var(--red)' : 'var(--green)', fontWeight: 600 } }, !selectedWeapon ? 'Required' : '✓'),
            React.createElement('span', { style: { marginLeft: 'auto', fontSize: 10, color: 'var(--text-3)' } }, 'MOB')
          ),
          React.createElement('div', { style: { padding: '4px 2px' } },
            weaponItems.map(item => renderRequiredRow(item, 'Service Weapon'))
          )
        )
      ),

      // Optional gear table
      React.createElement('div', { style: { background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 7, overflow: 'hidden', flexShrink: 0 } },
            React.createElement('div', { style: { padding: '6px 10px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 6 } },
              React.createElement('span', { style: { fontSize: 11, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--text-2)' } }, 'Optional'),
              React.createElement('span', { style: { fontSize: 10, color: 'var(--text-3)' } }, 'showing available only'),
              React.createElement('span', { style: { marginLeft: 'auto', fontSize: 10, color: 'var(--text-3)' } }, 'MOB')
            ),
            React.createElement('table', { style: { width: '100%', borderCollapse: 'collapse' } },
              React.createElement('tbody', null,
                availableOptional.map(item => renderOptionalRow(item))
              )
            )
          ),

      // Notes (no extra HR — gear section provides visual separation)
      React.createElement(FieldRow, { label: 'Notes' },
        React.createElement('textarea', { className: 'dc-textarea', value: form.notes, onChange: e => set('notes', e.target.value), placeholder: 'Personality, relationships, history…', rows: 2 })
      ),

      // Actions
      React.createElement('div', { style: { display: 'flex', gap: 8, justifyContent: 'flex-end' } },
        React.createElement('button', { className: 'btn btn-secondary', onClick: onClose }, 'Cancel'),
        React.createElement('button', {
          className: 'btn btn-primary',
          onClick: handleSave,
          title: !gearValid ? 'Select armor and service weapon first' : ''
        }, 'Save')
      )
    )
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function FieldRow({ label, children }) {
  return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 4 } },
    React.createElement('span', { className: 'label' }, label),
    children
  );
}

Object.assign(window, { TrooperScreen, TrooperEditModal, FieldRow });
