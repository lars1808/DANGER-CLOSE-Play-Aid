// Equipment Screen — the armory
const { useState: useEState, useContext: useEContext } = React;

function EquipmentScreen() {
  const { equipment, troopers, requisition, addEquipment, updateEquipment, deleteEquipment, setRequisition } = useEContext(window.AppCtx);
  const [showOwnedOnly, setShowOwnedOnly] = useEState(false);
  const [expandedId, setExpandedId] = useEState(null);
  const [confirmDelete, setConfirmDelete] = useEState(null);

  const filtered = showOwnedOnly ? equipment.filter(e => e.owned > 0) : equipment;

  return React.createElement('div', { style: { maxWidth: 800, margin: '0 auto', padding: '24px 16px' } },
    // Header
    React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, flexWrap: 'wrap' } },
      React.createElement('div', null,
        React.createElement('h1', { style: { fontSize: 20, fontWeight: 700, color: 'var(--text)' } }, 'Equipment'),
        React.createElement('p', { style: { fontSize: 13, color: 'var(--text-3)', marginTop: 2 } }, 'Armory & requisition')
      ),
      React.createElement('div', { style: { marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' } },
        // Requisition stepper
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8, padding: '5px 12px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8 } },
          React.createElement('span', { style: { fontSize: 12, fontWeight: 600, color: 'var(--text-2)', letterSpacing: '.04em', textTransform: 'uppercase' } }, 'REQ'),
          React.createElement('div', { className: 'stepper' },
            React.createElement('button', { className: 'stepper-btn', onClick: () => setRequisition(requisition - 1) }, '−'),
            React.createElement('span', { className: 'stepper-val', style: { minWidth: 28 } }, requisition),
            React.createElement('button', { className: 'stepper-btn', onClick: () => setRequisition(requisition + 1) }, '+')
          )
        ),
        React.createElement('div', { className: 'toggle' },
          React.createElement('button', { className: `toggle-btn ${!showOwnedOnly ? 'active' : ''}`, onClick: () => setShowOwnedOnly(false) }, 'All'),
          React.createElement('button', { className: `toggle-btn ${showOwnedOnly ? 'active' : ''}`, onClick: () => setShowOwnedOnly(true) }, 'Owned')
        ),
        React.createElement('button', { className: 'btn btn-primary btn-sm', onClick: addEquipment },
          React.createElement('svg', { width: 12, height: 12, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2.5 },
            React.createElement('line', { x1: 12, y1: 5, x2: 12, y2: 19 }),
            React.createElement('line', { x1: 5, y1: 12, x2: 19, y2: 12 })
          ),
          'Add Item'
        )
      )
    ),

    // Groups
    DC.EQUIPMENT_TYPES.map(type => {
      const items = filtered.filter(e => e.type === type);
      if (items.length === 0) return null;
      return React.createElement('div', { key: type, style: { marginBottom: 24 } },
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 } },
          React.createElement('span', { className: 'section-title' }, type),
          React.createElement('div', { style: { flex: 1, height: 1, background: 'var(--border)' } })
        ),
        React.createElement('div', { className: 'card', style: { overflow: 'hidden', padding: 0 } },
          items.map((item, idx) =>
            React.createElement(EquipmentRow, {
              key: item.id, item, isLast: idx === items.length - 1,
              troopers, requisition, setRequisition,
              expanded: expandedId === item.id,
              onExpand: () => setExpandedId(expandedId === item.id ? null : item.id),
              onChange: patch => updateEquipment(item.id, patch),
              onDelete: () => setConfirmDelete(item.id),
            })
          )
        )
      );
    }),

    filtered.length === 0 && React.createElement('div', { className: 'card', style: { padding: 48, textAlign: 'center' } },
      React.createElement('p', { style: { color: 'var(--text-3)', fontSize: 14 } },
        showOwnedOnly ? 'No owned equipment. Increase ownership counts in the All view.' : 'No equipment. Add items above.'
      )
    ),

    // Delete confirm
    confirmDelete && React.createElement('div', { className: 'overlay', onClick: () => setConfirmDelete(null) },
      React.createElement('div', { className: 'modal', onClick: e => e.stopPropagation() },
        React.createElement('div', { className: 'modal-title' }, 'Delete Item'),
        React.createElement('p', { style: { color: 'var(--text-2)', fontSize: 13 } }, 'This will permanently delete this equipment item.'),
        React.createElement('div', { style: { display: 'flex', gap: 8, justifyContent: 'flex-end' } },
          React.createElement('button', { className: 'btn btn-secondary', onClick: () => setConfirmDelete(null) }, 'Cancel'),
          React.createElement('button', { className: 'btn btn-danger', onClick: () => { deleteEquipment(confirmDelete); setConfirmDelete(null); } }, 'Delete')
        )
      )
    )
  );
}

// ─── Equipment Row ────────────────────────────────────────────────────────────
function EquipmentRow({ item, isLast, troopers, requisition, setRequisition, expanded, onExpand, onChange, onDelete }) {
  const [pulsing, setPulsing] = useEState(false);

  function setOwned(v) { onChange({ owned: Math.max(0, v) }); }

  function tryIncreaseOwned() {
    if (item.reqCost > 0) {
      if (requisition >= item.reqCost) {
        setRequisition(requisition - item.reqCost);
        setOwned(item.owned + 1);
      } else {
        // Not enough REQ — pulse red
        setPulsing(false);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => setPulsing(true));
        });
        setTimeout(() => setPulsing(false), 700);
      }
    } else {
      setOwned(item.owned + 1);
    }
  }

  const equippedCount = (troopers || []).filter(t => (t.gear || []).includes(item.id)).length;
  const available = item.owned - equippedCount;

  const typeColor = {
    'Armor': 'badge-neutral',
    'Service Weapon': 'badge-neutral',
    'Special Weapon': 'badge-blue',
    'Special Equipment': 'badge-amber',
  };

  return React.createElement('div', {
    style: { borderBottom: isLast ? 'none' : '1px solid var(--border)' },
    className: pulsing ? 'pulse-red' : '',
  },
    // Main row
    React.createElement('div', {
      style: { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', cursor: 'pointer' },
      onClick: onExpand,
    },
      // Chevron
      React.createElement('svg', {
        width: 12, height: 12, viewBox: '0 0 24 24', fill: 'none', stroke: 'var(--text-3)', strokeWidth: 2,
        style: { flexShrink: 0, transition: 'transform .15s', transform: expanded ? 'rotate(90deg)' : 'none' }
      },
        React.createElement('polyline', { points: '9 18 15 12 9 6' })
      ),

      // Name (editable on expand)
      React.createElement('span', { style: { fontSize: 13, fontWeight: 600, flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, item.name),

      // Badges
      React.createElement('div', { style: { display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 }, onClick: e => e.stopPropagation() },
        item.reqCost > 0 && React.createElement('span', { className: 'badge badge-neutral', style: { fontSize: 10 } }, `REQ ${item.reqCost}`),
        item.mobilityMod !== 0 && React.createElement('span', { className: 'badge badge-neutral', style: { fontSize: 10 } }, `MOB ${item.mobilityMod}`),

        // Owned + Available inline
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }, onClick: e => e.stopPropagation() },
          React.createElement('span', { style: { fontSize: 10, fontWeight: 600, letterSpacing: '.05em', textTransform: 'uppercase', color: 'var(--text-3)', fontFamily: 'var(--font-mono)' } }, 'Owned'),
          React.createElement('div', { className: 'stepper' },
            React.createElement('button', { className: 'stepper-btn', onClick: e => { e.stopPropagation(); setOwned(item.owned - 1); } }, '−'),
            React.createElement('span', { className: 'stepper-val' }, item.owned),
            React.createElement('button', { className: 'stepper-btn', onClick: e => { e.stopPropagation(); tryIncreaseOwned(); } }, '+')
          ),
          React.createElement('span', { style: { fontSize: 10, fontWeight: 600, letterSpacing: '.05em', textTransform: 'uppercase', color: 'var(--text-3)', fontFamily: 'var(--font-mono)', marginLeft: 4 } }, 'Available'),
          React.createElement('span', {
            style: {
              fontSize: 13, fontWeight: 700, minWidth: 20, textAlign: 'center',
              fontFamily: 'var(--font-mono)',
              color: available <= 0 ? 'var(--red)' : available < item.owned ? 'var(--amber)' : 'var(--green)',
            }
          }, available)
        ),

        React.createElement('button', {
          className: 'icon-btn', title: 'Delete',
          onClick: e => { e.stopPropagation(); onDelete(); },
          style: { width: 26, height: 26 }
        },
          React.createElement('svg', { width: 12, height: 12, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2 },
            React.createElement('polyline', { points: '3 6 5 6 21 6' }),
            React.createElement('path', { d: 'M19 6l-1 14H6L5 6' }),
            React.createElement('path', { d: 'M9 6V4h6v2' })
          )
        )
      )
    ),

    // Expanded edit panel
    expanded && React.createElement('div', {
      style: { padding: '0 14px 14px 30px', display: 'flex', flexDirection: 'column', gap: 10 },
      onClick: e => e.stopPropagation()
    },
      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 10, alignItems: 'end' } },
        React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 4 } },
          React.createElement('span', { className: 'label' }, 'Name'),
          React.createElement('input', { className: 'dc-input', value: item.name, onChange: e => onChange({ name: e.target.value }) })
        ),
        React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 4 } },
          React.createElement('span', { className: 'label' }, 'Type'),
          React.createElement('select', { className: 'dc-select', value: item.type, onChange: e => onChange({ type: e.target.value }), style: { width: '100%' } },
            DC.EQUIPMENT_TYPES.map(t => React.createElement('option', { key: t, value: t }, t))
          )
        ),
        React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 4 } },
          React.createElement('span', { className: 'label' }, 'REQ Cost'),
          React.createElement('input', { className: 'dc-input', type: 'number', min: 0, value: item.reqCost,
            onChange: e => onChange({ reqCost: Math.max(0, parseInt(e.target.value) || 0) }) })
        ),
        React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 4 } },
          React.createElement('span', { className: 'label' }, 'MOB Mod'),
          React.createElement('input', { className: 'dc-input', type: 'number', min: -5, max: 0, value: item.mobilityMod,
            onChange: e => onChange({ mobilityMod: parseInt(e.target.value) || 0 }) })
        )
      ),
      React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 4 } },
        React.createElement('span', { className: 'label' }, 'Description'),
        React.createElement('textarea', { className: 'dc-textarea', value: item.description, rows: 2,
          onChange: e => onChange({ description: e.target.value }),
          placeholder: 'Effects, passive/active abilities, notes…'
        })
      )
    )
  );
}

Object.assign(window, { EquipmentScreen });
