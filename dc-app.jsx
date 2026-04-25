// App shell, context, and Start screen
const { useState, useEffect, useCallback, createContext, useContext } = React;
const { DC } = window;

// ─── App Context ────────────────────────────────────────────────────────────
const AppCtx = createContext(null);
window.AppCtx = AppCtx;

// ─── App Root ────────────────────────────────────────────────────────────────
function App() {
  const [theme,          setThemeState]  = useState(() => DC.load('theme', 'light'));
  const [screen,         setScreen]      = useState('start');
  const [activeMissionId,setActiveMission] = useState(null);
  const [troopers,       setTroopers]    = useState(() => DC.load('troopers', []));
  const [equipment,      setEquipment]   = useState(() => DC.load('equipment', () => DC.DEFAULT_EQUIPMENT.map(e => ({ ...e }))));
  const [missions,       setMissions]    = useState(() => DC.load('missions', []));
  const [requisition,    setReqState]    = useState(() => DC.load('requisition', 0));

  // Sync theme attribute (no persistence needed via effect — we save in setTheme)
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const setTheme = useCallback((t) => {
    setThemeState(t);
    DC.save('theme', t);
    document.documentElement.setAttribute('data-theme', t);
  }, []);

  // ── Trooper mutations ────────────────────────────────────────────
  const addTrooper    = useCallback(() => {
    setTroopers(t => { const next = [...t, DC.createTrooper({ id: DC.genId() })]; DC.save('troopers', next); return next; });
  }, []);
  const updateTrooper = useCallback((id, patch) => {
    setTroopers(t => { const next = t.map(x => x.id === id ? { ...x, ...patch } : x); DC.save('troopers', next); return next; });
  }, []);
  const deleteTrooper = useCallback((id) => {
    setTroopers(t => { const next = t.filter(x => x.id !== id); DC.save('troopers', next); return next; });
  }, []);

  // ── Equipment mutations ──────────────────────────────────────────
  const addEquipment    = useCallback(() => {
    setEquipment(e => { const next = [...e, { id: DC.genId(), name: 'New Item', type: 'Special Equipment', description: '', reqCost: 0, mobilityMod: 0, owned: 0 }]; DC.save('equipment', next); return next; });
  }, []);
  const updateEquipment = useCallback((id, patch) => {
    setEquipment(e => { const next = e.map(x => x.id === id ? { ...x, ...patch } : x); DC.save('equipment', next); return next; });
  }, []);
  const deleteEquipment = useCallback((id) => {
    setEquipment(e => { const next = e.filter(x => x.id !== id); DC.save('equipment', next); return next; });
  }, []);
  const setRequisition  = useCallback((v) => {
    const val = Math.max(0, v);
    setReqState(val);
    DC.save('requisition', val);
  }, []);

  // ── Mission mutations ────────────────────────────────────────────
  const addMission = useCallback(() => {
    const m = DC.createMission({ id: DC.genId() });
    setMissions(ms => { const next = [m, ...ms]; DC.save('missions', next); return next; });
    setActiveMission(m.id);
    setScreen('mission');
  }, []);
  const updateMission = useCallback((id, patch) => {
    setMissions(ms => { const next = ms.map(m => m.id === id ? { ...m, ...patch } : m); DC.save('missions', next); return next; });
  }, []);
  const deleteMission = useCallback((id) => {
    setMissions(ms => { const next = ms.filter(m => m.id !== id); DC.save('missions', next); return next; });
    if (activeMissionId === id) { setActiveMission(null); setScreen('start'); }
  }, [activeMissionId]);
  const openMission = useCallback((id) => {
    setActiveMission(id);
    setScreen('mission');
  }, []);

  // ── Mission-Trooper mutations ────────────────────────────────────
  const loadSquad = useCallback((missionId) => {
    const deployed = troopers.filter(t => t.deployed);
    setMissions(ms => {
      const next = ms.map(m => {
        if (m.id !== missionId) return m;
        const existing = new Set(m.deployedTroopers.map(dt => dt.trooperId));
        const newEntries = deployed.filter(t => !existing.has(t.id)).map(t => DC.createMissionTrooper(t));
        return { ...m, deployedTroopers: [...m.deployedTroopers, ...newEntries] };
      });
      DC.save('missions', next);
      return next;
    });
  }, [troopers]);

  const updateMissionTrooper = useCallback((missionId, trooperId, patch) => {
    setMissions(ms => {
      const next = ms.map(m => {
        if (m.id !== missionId) return m;
        return { ...m, deployedTroopers: m.deployedTroopers.map(dt =>
          dt.trooperId === trooperId ? { ...dt, ...patch } : dt
        )};
      });
      DC.save('missions', next);
      return next;
    });
  }, []);

  const removeMissionTrooper = useCallback((missionId, trooperId) => {
    setMissions(ms => {
      const next = ms.map(m => {
        if (m.id !== missionId) return m;
        return { ...m, deployedTroopers: m.deployedTroopers.filter(dt => dt.trooperId !== trooperId) };
      });
      DC.save('missions', next);
      return next;
    });
  }, []);

  // ── Sector mutations ──────────────────────────────────────────────
  const addSector = useCallback((missionId) => {
    const s = DC.createSector();
    setMissions(ms => {
      const next = ms.map(m => m.id === missionId ? { ...m, sectors: [...m.sectors, s] } : m);
      DC.save('missions', next);
      return next;
    });
  }, []);
  const updateSector = useCallback((missionId, sectorId, patch) => {
    setMissions(ms => {
      const next = ms.map(m => {
        if (m.id !== missionId) return m;
        return { ...m, sectors: m.sectors.map(s => s.id === sectorId ? { ...s, ...patch } : s) };
      });
      DC.save('missions', next);
      return next;
    });
  }, []);
  const deleteSector = useCallback((missionId, sectorId) => {
    setMissions(ms => {
      const next = ms.map(m => {
        if (m.id !== missionId) return m;
        return { ...m, sectors: m.sectors.filter(s => s.id !== sectorId) };
      });
      DC.save('missions', next);
      return next;
    });
  }, []);

  // ── Reset ────────────────────────────────────────────────────────
  const resetAll = useCallback(async () => {
    let defaultEquipment = DC.DEFAULT_EQUIPMENT.map(e => ({ ...e }));
    try {
      const res = await fetch('equipment.json');
      if (res.ok) defaultEquipment = await res.json();
    } catch (e) { /* fallback to hardcoded */ }
    setTroopers([]);
    setMissions([]);
    setEquipment(defaultEquipment);
    setReqState(0);
    setActiveMission(null);
    setScreen('start');
    DC.save('troopers', []);
    DC.save('missions', []);
    DC.save('equipment', defaultEquipment);
    DC.save('requisition', 0);
  }, []);
  const exportData = useCallback(() => {
    const data = JSON.stringify({ version: 1, troopers, equipment, missions, requisition }, null, 2);
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([data], { type: 'application/json' }));
    a.download = 'danger-close-backup.json';
    a.click();
  }, [troopers, equipment, missions, requisition]);

  const importData = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file'; input.accept = '.json';
    input.onchange = e => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = ev => {
        try {
          const data = JSON.parse(ev.target.result);
          if (data.troopers)    setTroopers(data.troopers);
          if (data.equipment)   setEquipment(data.equipment);
          if (data.missions)    setMissions(data.missions);
          if (data.requisition !== undefined) setReqState(data.requisition);
        } catch (err) { alert('Invalid backup file.'); }
      };
      reader.readAsText(file);
    };
    input.click();
  }, []);

  const activeMission = missions.find(m => m.id === activeMissionId) || null;

  const ctx = {
    theme, setTheme,
    screen, setScreen,
    troopers, equipment, missions, requisition,
    activeMission, activeMissionId, openMission,
    addTrooper, updateTrooper, deleteTrooper,
    addEquipment, updateEquipment, deleteEquipment, setRequisition,
    addMission, updateMission, deleteMission,
    loadSquad, updateMissionTrooper, removeMissionTrooper,
    addSector, updateSector, deleteSector,
    exportData, importData, resetAll,
  };

  const screenEl = screen === 'start'     ? React.createElement(StartScreen, null)
                 : screen === 'troopers'  ? React.createElement(window.TrooperScreen, null)
                 : screen === 'equipment' ? React.createElement(window.EquipmentScreen, null)
                 : screen === 'mission'   ? React.createElement(window.MissionScreen, null)
                 : null;

  return React.createElement(AppCtx.Provider, { value: ctx },
    React.createElement('div', { className: 'app-shell' },
      React.createElement(TopNav, null),
      React.createElement('main', { className: 'screen' }, screenEl)
    )
  );
}

// ─── Top Nav ──────────────────────────────────────────────────────────────────
function TopNav() {
  const { screen, setScreen, theme, setTheme, activeMission, exportData, importData, resetAll } = useContext(AppCtx);
  const [confirmReset, setConfirmReset] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  function navTo(s) { setScreen(s); setMenuOpen(false); }

  const navItems = React.createElement(React.Fragment, null,
    React.createElement('button', { className: `nav-btn ${screen === 'start' ? 'active' : ''}`, onClick: () => navTo('start') }, 'Missions'),
    React.createElement('button', { className: `nav-btn ${screen === 'troopers' ? 'active' : ''}`, onClick: () => navTo('troopers') }, 'Troopers'),
    React.createElement('button', { className: `nav-btn ${screen === 'equipment' ? 'active' : ''}`, onClick: () => navTo('equipment') }, 'Equipment'),
    activeMission && React.createElement(React.Fragment, null,
      React.createElement('div', { className: 'nav-sep' }),
      React.createElement('button', {
        className: `nav-btn ${screen === 'mission' ? 'active' : ''}`,
        onClick: () => navTo('mission'),
        style: { maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }
      }, activeMission.name)
    )
  );

  return React.createElement(React.Fragment, null,
    React.createElement('nav', { className: 'topnav' },
      React.createElement('span', { className: 'topnav-brand' },
        React.createElement('span', null, 'DANGER'), ' CLOSE'
      ),

      // Desktop nav
      React.createElement('div', { className: 'topnav-nav' }, navItems),

      // Hamburger (mobile only)
      React.createElement('button', {
        className: 'icon-btn hamburger-btn',
        onClick: () => setMenuOpen(o => !o),
        title: 'Menu',
        style: { marginLeft: 4 },
      },
        menuOpen
          ? React.createElement('svg', { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2 },
              React.createElement('line', { x1: 18, y1: 6, x2: 6, y2: 18 }),
              React.createElement('line', { x1: 6, y1: 6, x2: 18, y2: 18 }))
          : React.createElement('svg', { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2 },
              React.createElement('line', { x1: 3, y1: 6, x2: 21, y2: 6 }),
              React.createElement('line', { x1: 3, y1: 12, x2: 21, y2: 12 }),
              React.createElement('line', { x1: 3, y1: 18, x2: 21, y2: 18 }))
      ),

      React.createElement('div', { style: { marginLeft: 'auto' } }),

      // Export
      React.createElement('button', { className: 'icon-btn', onClick: exportData, title: 'Export backup' },
        React.createElement('svg', { width: 15, height: 15, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2 },
          React.createElement('path', { d: 'M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4' }),
          React.createElement('polyline', { points: '7 10 12 15 17 10' }),
          React.createElement('line', { x1: '12', y1: '15', x2: '12', y2: '3' })
        )
      ),
      // Import
      React.createElement('button', { className: 'icon-btn', onClick: importData, title: 'Import backup' },
        React.createElement('svg', { width: 15, height: 15, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2 },
          React.createElement('path', { d: 'M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4' }),
          React.createElement('polyline', { points: '7 10 12 5 17 10' }),
          React.createElement('line', { x1: '12', y1: '5', x2: '12', y2: '17' })
        )
      ),
      // Reset
      React.createElement('button', { className: 'icon-btn', onClick: () => setConfirmReset(true), title: 'Reset all data' },
        React.createElement('svg', { width: 15, height: 15, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2 },
          React.createElement('polyline', { points: '1 4 1 10 7 10' }),
          React.createElement('path', { d: 'M3.51 15a9 9 0 1 0 .49-4.95' })
        )
      ),
      React.createElement('div', { className: 'nav-sep' }),
      // Theme toggle
      React.createElement('button', {
        className: 'icon-btn', onClick: () => setTheme(theme === 'light' ? 'dark' : 'light'),
        title: theme === 'light' ? 'Dark mode' : 'Light mode'
      }, theme === 'light'
        ? React.createElement('svg', { width: 15, height: 15, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2 },
            React.createElement('path', { d: 'M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z' }))
        : React.createElement('svg', { width: 15, height: 15, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2 },
            React.createElement('circle', { cx: 12, cy: 12, r: 5 }),
            React.createElement('line', { x1: 12, y1: 1, x2: 12, y2: 3 }),
            React.createElement('line', { x1: 12, y1: 21, x2: 12, y2: 23 }),
            React.createElement('line', { x1: 4.22, y1: 4.22, x2: 5.64, y2: 5.64 }),
            React.createElement('line', { x1: 18.36, y1: 18.36, x2: 19.78, y2: 19.78 }),
            React.createElement('line', { x1: 1, y1: 12, x2: 3, y2: 12 }),
            React.createElement('line', { x1: 21, y1: 12, x2: 23, y2: 12 }),
            React.createElement('line', { x1: 4.22, y1: 19.78, x2: 5.64, y2: 18.36 }),
            React.createElement('line', { x1: 18.36, y1: 5.64, x2: 19.78, y2: 4.22 }))
      )
    ),

    // Mobile dropdown menu
    menuOpen && React.createElement('div', { className: 'mobile-menu' }, navItems),

    // Reset confirmation modal
    confirmReset && React.createElement('div', { className: 'overlay', onClick: () => setConfirmReset(false) },
      React.createElement('div', { className: 'modal', style: { maxWidth: 420 }, onClick: e => e.stopPropagation() },
        React.createElement('div', { className: 'modal-title', style: { color: 'var(--red)' } }, 'Reset All Data'),
        React.createElement('p', { style: { fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6 } },
          'This will remove all Troopers and Missions, and reset all Gear to default. This cannot be undone.'
        ),
        React.createElement('div', { style: { display: 'flex', gap: 8, justifyContent: 'flex-end' } },
          React.createElement('button', { className: 'btn btn-secondary', onClick: () => setConfirmReset(false) }, 'Cancel'),
          React.createElement('button', {
            className: 'btn btn-danger',
            onClick: () => { resetAll(); setConfirmReset(false); }
          }, 'Reset Everything')
        )
      )
    )
  );
}

// ─── Start Screen ─────────────────────────────────────────────────────────────
function StartScreen() {
  const { missions, addMission, deleteMission, openMission } = useContext(AppCtx);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const sorted = [...missions].sort((a, b) => b.createdAt - a.createdAt);

  function statusBadgeClass(s) {
    if (s === 'Active')          return 'badge-blue';
    if (s === 'Success')         return 'badge-green';
    if (s === 'Partial Success') return 'badge-amber';
    if (s === 'Failure')         return 'badge-red';
    return 'badge-neutral';
  }

  function difficultyBadgeClass(d) {
    if (d === 'Desperate') return 'badge-red';
    if (d === 'Hazardous') return 'badge-amber';
    return 'badge-neutral';
  }

  return React.createElement('div', { style: { maxWidth: 680, margin: '0 auto', padding: '24px 16px' } },
    // Header row
    React.createElement('div', { style: { display: 'flex', alignItems: 'center', marginBottom: 20 } },
      React.createElement('div', null,
        React.createElement('h1', { style: { fontSize: 20, fontWeight: 700, color: 'var(--text)' } }, 'Missions'),
        React.createElement('p', { style: { fontSize: 13, color: 'var(--text-3)', marginTop: 2 } },
          sorted.length === 0 ? 'No missions yet.' : `${sorted.length} mission${sorted.length === 1 ? '' : 's'}`
        )
      ),
      React.createElement('button', { className: 'btn btn-primary', style: { marginLeft: 'auto' }, onClick: addMission },
        React.createElement('svg', { width: 13, height: 13, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2.5 },
          React.createElement('line', { x1: 12, y1: 5, x2: 12, y2: 19 }),
          React.createElement('line', { x1: 5, y1: 12, x2: 19, y2: 12 })
        ),
        'New Mission'
      )
    ),

    sorted.length === 0
      ? React.createElement('div', { className: 'card', style: { padding: 48, textAlign: 'center' } },
          React.createElement('p', { style: { color: 'var(--text-3)', fontSize: 14 } }, 'No missions yet. Create one to get started.')
        )
      : React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 8 } },
          sorted.map(m =>
            React.createElement('div', {
              key: m.id,
              className: 'card',
              style: { padding: '14px 16px', cursor: 'pointer', transition: 'box-shadow .12s' },
              onClick: () => openMission(m.id),
              onMouseEnter: e => e.currentTarget.style.boxShadow = 'var(--shadow-md)',
              onMouseLeave: e => e.currentTarget.style.boxShadow = 'var(--shadow)',
            },
              React.createElement('div', { style: { display: 'flex', alignItems: 'flex-start', gap: 10 } },
                React.createElement('div', { style: { flex: 1, minWidth: 0 } },
                  React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap' } },
                    React.createElement('span', { style: { fontSize: 15, fontWeight: 600, color: 'var(--text)' } }, m.name),
                    React.createElement('span', { className: `badge ${statusBadgeClass(m.status)}` }, m.status),
                    React.createElement('span', { className: `badge ${difficultyBadgeClass(m.difficulty)}` }, m.difficulty),
                    m.airspace !== 'Clear' && React.createElement('span', { className: `badge ${m.airspace === 'Hostile' ? 'badge-red' : 'badge-amber'}` }, m.airspace + ' Airspace'),
                  ),
                  React.createElement('div', { style: { display: 'flex', gap: 12, marginTop: 5, flexWrap: 'wrap' } },
                    m.type && React.createElement('span', { style: { fontSize: 12, color: 'var(--text-3)' } }, m.type),
                    m.location && React.createElement('span', { style: { fontSize: 12, color: 'var(--text-3)' } }, m.location),
                    m.deployedTroopers.length > 0 && React.createElement('span', { style: { fontSize: 12, color: 'var(--text-3)' } },
                      m.deployedTroopers.length + ' trooper' + (m.deployedTroopers.length === 1 ? '' : 's')
                    ),
                    m.sectors.length > 0 && React.createElement('span', { style: { fontSize: 12, color: 'var(--text-3)' } },
                      m.sectors.length + ' sector' + (m.sectors.length === 1 ? '' : 's')
                    ),
                  )
                ),
                React.createElement('button', {
                  className: 'icon-btn',
                  onClick: e => { e.stopPropagation(); setConfirmDelete(m.id); },
                  title: 'Delete mission',
                  style: { flexShrink: 0 }
                },
                  React.createElement('svg', { width: 14, height: 14, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2 },
                    React.createElement('polyline', { points: '3 6 5 6 21 6' }),
                    React.createElement('path', { d: 'M19 6l-1 14H6L5 6' }),
                    React.createElement('path', { d: 'M10 11v6M14 11v6' }),
                    React.createElement('path', { d: 'M9 6V4h6v2' })
                  )
                )
              )
            )
          )
        ),

    // Delete confirm modal
    confirmDelete && React.createElement('div', { className: 'overlay', onClick: () => setConfirmDelete(null) },
      React.createElement('div', { className: 'modal', onClick: e => e.stopPropagation() },
        React.createElement('div', { className: 'modal-title' }, 'Delete Mission'),
        React.createElement('p', { style: { color: 'var(--text-2)', fontSize: 13 } }, 'This will permanently delete this mission and all its sectors. This cannot be undone.'),
        React.createElement('div', { style: { display: 'flex', gap: 8, justifyContent: 'flex-end' } },
          React.createElement('button', { className: 'btn btn-secondary', onClick: () => setConfirmDelete(null) }, 'Cancel'),
          React.createElement('button', { className: 'btn btn-danger', onClick: () => { deleteMission(confirmDelete); setConfirmDelete(null); } }, 'Delete')
        )
      )
    )
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(App));
