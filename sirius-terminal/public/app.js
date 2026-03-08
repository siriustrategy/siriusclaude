/* ══════════════════════════════════════════
   SIRIUS COMMAND CENTER v3.1 — App Logic
   Icones: SVG Lucide inline (sem emoji Apple)
   ══════════════════════════════════════════ */

// ── State ───────────────────────────────────────────
let currentView   = 'dashboard';
let activeTabId   = null;
const terminals   = new Map();
const tabMeta     = new Map(); // tabId → { name, iconName, iconColor }
const tabClickTimers = new Map(); // para detectar double-click
let tabCounter    = 0;
let squadsData    = {};
let agentsData    = null;
let statsInterval = null;

// ── SVG Icons (Lucide inline) ────────────────────────
const SVG_ICONS = {
  terminal:  '<polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>',
  zap:       '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
  flame:     '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
  rocket:    '<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>',
  star:      '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
  target:    '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
  globe:     '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
  bot:       '<rect width="18" height="10" x="3" y="11" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" x2="8" y1="16" y2="16"/><line x1="16" x2="16" y1="16" y2="16"/>',
  code:      '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
  wrench:    '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
  monitor:   '<rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/>',
  radio:     '<path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"/><path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"/><circle cx="12" cy="12" r="2"/><path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"/><path d="M19.1 4.9C23 8.8 23 15.2 19.1 19.1"/>',
  shield:    '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  diamond:   '<polygon points="13.73 1 8.27 1 1 8.27 1 13.73 8.27 21 13.73 21 21 13.73 21 8.27 13.73 1"/>',
  cpu:       '<rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M15 2v2M15 20v2M2 15h2M2 9h2M20 15h2M20 9h2M9 2v2M9 20v2"/>',
  layers:    '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>',
  activity:  '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>',
  database:  '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3"/>',
  cloud:     '<path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>',
};

const ICON_NAMES   = Object.keys(SVG_ICONS);
const ICON_COLORS  = [
  '#4080FF','#FF6B35','#FF3366','#00C896','#FFD700',
  '#9B59FF','#FF8C00','#00D4FF','#C060FF','#40E0D0',
  '#FF69B4','#40FFB0','#FFFFFF','#6B7DB3','#FF4444',
  '#00E5CC','#A78BFA','#34D399','#FB923C','#60A5FA',
];

function svgIcon(name, color = 'currentColor', size = 14) {
  const paths = SVG_ICONS[name] || SVG_ICONS.terminal;
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;
}

// ── Agent metadata (sem emoji — usa iniciais) ────────
const AGENT_META = {
  'aios-master':          { initials: 'AM', color: '#FFD700', name: 'AIOS Master',    role: 'Framework'     },
  'dev':                  { initials: 'DX', color: '#2060FF', name: 'Dex',            role: 'Dev'           },
  'qa':                   { initials: 'QA', color: '#00C896', name: 'QA',             role: 'Quality'       },
  'architect':            { initials: 'AR', color: '#9B59FF', name: 'Aria',           role: 'Architecture'  },
  'pm':                   { initials: 'MG', color: '#FF8C00', name: 'Morgan',         role: 'Product'       },
  'po':                   { initials: 'PX', color: '#FF3366', name: 'Pax',            role: 'Owner'         },
  'sm':                   { initials: 'RV', color: '#00D4FF', name: 'River',          role: 'Scrum'         },
  'analyst':              { initials: 'AN', color: '#C060FF', name: 'Analyst',        role: 'Analysis'      },
  'devops':               { initials: 'GG', color: '#FF6B35', name: 'Gage',           role: 'DevOps'        },
  'data-engineer':        { initials: 'DA', color: '#40E0D0', name: 'Dara',           role: 'Database'      },
  'ux-design-expert':     { initials: 'UX', color: '#FF69B4', name: 'UX Expert',      role: 'Design'        },
  'squad-chief':          { initials: 'SC', color: '#FFD700', name: 'Squad Chief',    role: 'Orchestrator'  },
  'oalanicolas':          { initials: 'ON', color: '#9B59FF', name: 'Oalanicolas',    role: 'Mind Clone'    },
  'pedro-valerio':        { initials: 'PV', color: '#2060FF', name: 'Pedro Valerio',  role: 'Process'       },
  'zona-genialidade-chief':{ initials:'ZG', color: '#00D4FF', name: 'ZG Chief',       role: 'Genius'        },
  'gay-hendricks':        { initials: 'GH', color: '#FFD700', name: 'Gay Hendricks',  role: 'Genius Zone'   },
  'roger-hamilton':       { initials: 'RH', color: '#FF8C00', name: 'R. Hamilton',    role: 'Flow'          },
  'sally-hogshead':       { initials: 'SH', color: '#FF69B4', name: 'S. Hogshead',   role: 'Fascination'   },
  'kathy-kolbe':          { initials: 'KK', color: '#FF3366', name: 'Kathy Kolbe',    role: 'Conation'      },
  'don-clifton':          { initials: 'DC', color: '#00C896', name: 'Don Clifton',    role: 'Strengths'     },
  'dan-sullivan':         { initials: 'DS', color: '#2060FF', name: 'Dan Sullivan',   role: 'Unique Ability'},
  'alex-hormozi':         { initials: 'AH', color: '#FFD700', name: 'Alex Hormozi',   role: 'Monetization'  },
  'sirius-proposals-chief':{ initials:'SP', color: '#9B59FF', name: 'SP Chief',       role: 'Proposals'     },
  'maister':              { initials: 'MA', color: '#00C896', name: 'Maister',        role: 'Trust'         },
  'blair-enns':           { initials: 'BE', color: '#FFD700', name: 'Blair Enns',     role: 'Pricing'       },
  'hormozi':              { initials: 'HZ', color: '#FF8C00', name: 'Hormozi',        role: 'Offers'        },
  'corey-quinn':          { initials: 'CQ', color: '#2060FF', name: 'Corey Quinn',    role: 'Revenue'       },
  'patrick-campbell':     { initials: 'PC', color: '#9B59FF', name: 'P. Campbell',    role: 'Pricing'       },
  'klaff':                { initials: 'OK', color: '#FF3366', name: 'Oren Klaff',     role: 'Pitch'         },
  'nancy-duarte':         { initials: 'ND', color: '#FF69B4', name: 'Nancy Duarte',   role: 'Story'         },
  'squadsiteslp-chief':   { initials: 'WC', color: '#00D4FF', name: 'Sites Chief',    role: 'LP & Sites'    },
  'steve-schoger':        { initials: 'SS', color: '#FF69B4', name: 'Steve Schoger',  role: 'UI Design'     },
  'josh-comeau':          { initials: 'JC', color: '#FFD700', name: 'Josh Comeau',    role: 'CSS Magic'     },
  'emil-kowalski':        { initials: 'EK', color: '#FF8C00', name: 'Emil Kowalski',  role: 'Animation'     },
  'adam-argyle':          { initials: 'AA', color: '#40E0D0', name: 'Adam Argyle',    role: 'CSS'           },
  'ahmad-shadeed':        { initials: 'AS', color: '#2060FF', name: 'Ahmad Shadeed',  role: 'Layout'        },
  'kevin-powell':         { initials: 'KP', color: '#9B59FF', name: 'Kevin Powell',   role: 'CSS'           },
  'maxime-heckel':        { initials: 'MH', color: '#C060FF', name: 'Maxime Heckel',  role: 'Animations'    },
  'rand-fishkin':         { initials: 'RF', color: '#00C896', name: 'Rand Fishkin',   role: 'SEO'           },
  'kevin-indig':          { initials: 'KI', color: '#FF3366', name: 'Kevin Indig',    role: 'SEO'           },
  'brian-dean':           { initials: 'BD', color: '#FF8C00', name: 'Brian Dean',     role: 'Link Build'    },
  'lily-ray':             { initials: 'LR', color: '#FF69B4', name: 'Lily Ray',       role: 'Technical SEO' },
  'joanna-wiebe':         { initials: 'JW', color: '#FFD700', name: 'Joanna Wiebe',   role: 'Copy'          },
  'oli-gardner':          { initials: 'OG', color: '#FF3366', name: 'Oli Gardner',    role: 'Conversion'    },
  'peep-laja':            { initials: 'PL', color: '#00C896', name: 'Peep Laja',      role: 'CRO'           },
  'guillermo-rauch':      { initials: 'GR', color: '#E2E8F0', name: 'G. Rauch',       role: 'Vercel'        },
  'lee-robinson':         { initials: 'LR', color: '#2060FF', name: 'Lee Robinson',   role: 'Next.js'       },
  'theo-browne':          { initials: 'TB', color: '#9B59FF', name: 'Theo Browne',    role: 'Full Stack'    },
  'matt-biilmann':        { initials: 'MB', color: '#FF8C00', name: 'Matt Biilmann',  role: 'Netlify'       },
};

function getAgentMeta(id) {
  if (AGENT_META[id]) return AGENT_META[id];
  const name = id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const COLORS = ['#2060FF','#9B59FF','#00C896','#FF8C00','#FF3366','#00D4FF','#FFD700','#FF69B4'];
  const h = id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return { initials, color: COLORS[h % COLORS.length], name, role: 'Agent' };
}

// Cor do texto sobre o fundo colorido
function initialsTextColor(hex) {
  const r = parseInt(hex.slice(1,3), 16);
  const g = parseInt(hex.slice(3,5), 16);
  const b = parseInt(hex.slice(5,7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 145 ? '#000' : '#fff';
}

const DOMAIN_ICON = {
  meta_frameworks:  'layers',
  technical:        'code',
  people_psychology:'activity',
  sales_proposals:  'target',
};

let workingAgents = new Set();

// ── Boot ────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  drawConstellation();
  addTerminalTab();
  loadAll();
  statsInterval = setInterval(loadStats, 8000);
  setInterval(rotateWorkingAgents, 6000);

  document.getElementById('mobileInput')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); sendMobile(); }
  });
  window.addEventListener('resize', fitActive);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeConvModal();
  });
});

// ── Constellation ────────────────────────────────────
function drawConstellation() {
  const c = document.getElementById('constellation');
  if (!c) return;
  const ctx = c.getContext('2d');
  const stars = [{x:16,y:4,r:2.5,b:true},{x:11,y:12,r:1.2},{x:21,y:13,r:1.2},{x:7,y:20,r:1},{x:25,y:22,r:1},{x:13,y:26,r:1}];
  const lines = [[0,1],[0,2],[1,3],[2,4],[3,5]];
  let t = 0;
  (function frame() {
    ctx.clearRect(0,0,32,32); t+=0.02;
    ctx.strokeStyle='rgba(0,80,255,.4)'; ctx.lineWidth=.7;
    lines.forEach(([a,b])=>{ ctx.beginPath(); ctx.moveTo(stars[a].x,stars[a].y); ctx.lineTo(stars[b].x,stars[b].y); ctx.stroke(); });
    stars.forEach(s=>{
      const g=s.b?(.65+.25*Math.sin(t*2)):.45;
      ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
      ctx.fillStyle=`rgba(100,160,255,${g})`; ctx.fill();
      if(s.b){ ctx.beginPath(); ctx.arc(s.x,s.y,s.r*2.5,0,Math.PI*2); ctx.fillStyle=`rgba(0,64,255,${.12+.08*Math.sin(t*2)})`; ctx.fill(); }
    });
    requestAnimationFrame(frame);
  })();
}

// ── View routing ─────────────────────────────────────
function showView(view, triggerEl) {
  currentView = view;
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById(`view-${view}`)?.classList.add('active');
  document.querySelectorAll('.nav-item').forEach(b => b.classList.toggle('active', b.dataset.view === view));
  document.querySelectorAll('.bnav-btn').forEach(b => b.classList.toggle('active', b.dataset.view === view));

  const titles = { dashboard:'Dashboard', terminal:'Terminal', squads:'Squads', sessions:'Conversas', agents:'Mission Control' };
  document.getElementById('topbarTitle').textContent = titles[view] || view;

  const mbar = document.getElementById('mobileBar');
  if (mbar) mbar.style.display = view === 'terminal' ? '' : 'none';

  if (view === 'terminal') setTimeout(fitActive, 60);
  if (view === 'agents' && !agentsData) loadAgents();
  if (view === 'dashboard') loadActivity();

  if (window.innerWidth < 768) document.getElementById('sidebar')?.classList.add('collapsed');
}

function toggleSidebar() {
  document.getElementById('sidebar')?.classList.toggle('collapsed');
}

// ── Terminal: tabs com SVG icon + rename ─────────────
function addTerminalTab() {
  tabCounter++;
  const tabId    = `t${tabCounter}`;
  const idx      = (tabCounter - 1) % ICON_NAMES.length;
  const iconName = ICON_NAMES[idx];
  const iconColor = ICON_COLORS[idx % ICON_COLORS.length];
  tabMeta.set(tabId, { name: `Terminal ${tabCounter}`, iconName, iconColor });

  const socket = io();
  setupSocketEvents(socket, tabId);

  const term = new Terminal({
    fontFamily: "'SF Mono','Fira Code','Cascadia Code',monospace",
    fontSize: 13, lineHeight: 1.3,
    cursorBlink: true, cursorStyle: 'bar', scrollback: 8000,
    theme: {
      background:'#000000', foreground:'#E0E8FF', cursor:'#2060FF',
      black:'#000000', red:'#FF3366', green:'#00C896', yellow:'#FFB800',
      blue:'#2060FF', magenta:'#C060FF', cyan:'#00D4FF', white:'#E0E8FF',
      brightBlack:'#3A4A7A', brightBlue:'#4080FF', brightGreen:'#40FFB0', brightWhite:'#FFFFFF',
    },
  });

  const fitAddon = new FitAddon.FitAddon();
  term.loadAddon(fitAddon);

  const pane = document.createElement('div');
  pane.className = 'term-pane';
  pane.id = `pane-${tabId}`;
  document.getElementById('termPanes').appendChild(pane);
  term.open(pane);
  term.onData(data => { if (socket.connected) socket.emit('input', data); });

  const tab = document.createElement('button');
  tab.className = 'term-tab';
  tab.id = `tab-${tabId}`;
  tab.innerHTML = buildTabHTML(tabId);

  // ── Double-click detection via timer (fix: button nao dispara dblclick em filhos) ──
  tab.addEventListener('click', (e) => {
    if (e.target.closest('.term-tab-close')) return;

    if (e.target.closest('.tab-icon-btn')) return; // handled by its own onclick

    const nameEl = e.target.closest('.tab-name');
    if (nameEl) {
      // Detectar double-click com timer
      if (tabClickTimers.has(tabId)) {
        clearTimeout(tabClickTimers.get(tabId));
        tabClickTimers.delete(tabId);
        startRename(tabId);
        return;
      }
      tabClickTimers.set(tabId, setTimeout(() => {
        tabClickTimers.delete(tabId);
        switchTerminalTab(tabId);
      }, 280));
      return;
    }

    switchTerminalTab(tabId);
  });

  const bar = document.getElementById('termTabsBar');
  bar.insertBefore(tab, bar.querySelector('.new-tab-btn'));

  terminals.set(tabId, { socket, term, fitAddon, pane, tab });
  switchTerminalTab(tabId);
  document.getElementById('termBadge').textContent = terminals.size;
  setTimeout(() => { try { fitAddon.fit(); } catch {} }, 120);
  return tabId;
}

function buildTabHTML(tabId) {
  const m = tabMeta.get(tabId) || { iconName: 'terminal', iconColor: '#4080FF', name: `Tab ${tabId}` };
  return [
    `<span class="tab-icon-btn" title="Mudar icone" onclick="openIconPicker('${tabId}', event)">`,
    svgIcon(m.iconName, m.iconColor, 13),
    `</span>`,
    `<span class="tab-name">${m.name}</span>`,
    `<span class="term-tab-close" onclick="closeTerminalTab('${tabId}', event)">`,
    svgIcon('x-close', '#6B7DB3', 10),
    `</span>`,
  ].join('');
}

// ── Icon picker ───────────────────────────────────────
function openIconPicker(tabId, ev) {
  ev.stopPropagation();
  document.querySelectorAll('.icon-picker-popup').forEach(p => p.remove());

  const picker = document.createElement('div');
  picker.className = 'icon-picker-popup';
  picker.innerHTML = ICON_NAMES.map((name, i) => {
    const color = ICON_COLORS[i % ICON_COLORS.length];
    return `<button class="icon-opt" onclick="setTabIcon('${tabId}','${name}','${color}')">${svgIcon(name, color, 18)}</button>`;
  }).join('');
  document.body.appendChild(picker);

  const tabEl = document.getElementById(`tab-${tabId}`);
  if (tabEl) {
    const rect = tabEl.getBoundingClientRect();
    picker.style.top  = `${rect.bottom + 4}px`;
    picker.style.left = `${rect.left}px`;
  }
  setTimeout(() => { document.addEventListener('click', () => picker.remove(), { once: true }); }, 10);
}

function setTabIcon(tabId, iconName, iconColor) {
  const meta = tabMeta.get(tabId);
  if (meta) { meta.iconName = iconName; meta.iconColor = iconColor; }
  const btn = document.querySelector(`#tab-${tabId} .tab-icon-btn`);
  if (btn) btn.innerHTML = svgIcon(iconName, iconColor, 13);
  document.querySelectorAll('.icon-picker-popup').forEach(p => p.remove());
  showToast('Icone atualizado');
}

// ── Rename ────────────────────────────────────────────
function startRename(tabId) {
  const nameEl = document.querySelector(`#tab-${tabId} .tab-name`);
  if (!nameEl) return;

  const meta = tabMeta.get(tabId) || { name: '' };
  const input = document.createElement('input');
  input.className = 'tab-rename-input';
  input.value = meta.name;
  nameEl.replaceWith(input);
  input.focus();
  input.select();

  const finish = () => {
    const val = input.value.trim() || meta.name || `Terminal ${tabId}`;
    meta.name = val;
    const span = document.createElement('span');
    span.className = 'tab-name';
    span.textContent = val;
    input.replaceWith(span);
    showToast(`"${val}"`);
  };

  input.addEventListener('blur', finish);
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter')  { e.preventDefault(); input.blur(); }
    if (e.key === 'Escape') { input.value = meta.name; input.blur(); }
  });
}

function switchTerminalTab(tabId) {
  activeTabId = tabId;
  document.querySelectorAll('.term-pane').forEach(p => p.classList.remove('active'));
  document.getElementById(`pane-${tabId}`)?.classList.add('active');
  document.querySelectorAll('.term-tab').forEach(t => t.classList.remove('active'));
  document.getElementById(`tab-${tabId}`)?.classList.add('active');
  setTimeout(() => {
    const s = terminals.get(tabId);
    if (s) { try { s.fitAddon.fit(); s.term.focus(); } catch {} }
  }, 40);
}

function closeTerminalTab(tabId, ev) {
  ev?.stopPropagation();
  const s = terminals.get(tabId);
  if (!s) return;
  try { s.socket.disconnect(); } catch {}
  try { s.term.dispose(); } catch {}
  s.pane.remove();
  s.tab.remove();
  terminals.delete(tabId);
  tabMeta.delete(tabId);
  tabClickTimers.delete(tabId);
  document.getElementById('termBadge').textContent = terminals.size || 1;
  const remaining = [...terminals.keys()];
  if (remaining.length > 0) switchTerminalTab(remaining[remaining.length - 1]);
  else addTerminalTab();
}

function fitActive() {
  if (!activeTabId) return;
  const s = terminals.get(activeTabId);
  if (s) try { s.fitAddon.fit(); } catch {}
}

// ── Socket events ────────────────────────────────────
function setupSocketEvents(socket, tabId) {
  socket.on('connect', () => {
    setStatus('connected', 'Online');
    const s = terminals.get(tabId);
    if (s) try { s.term.focus(); } catch {}
  });
  socket.on('disconnect', () => setStatus('error', 'Offline'));
  socket.on('output', data => {
    const s = terminals.get(tabId);
    if (s) s.term.write(data);
  });
  socket.on('exit', code => {
    const s = terminals.get(tabId);
    if (s) s.term.writeln(`\r\n\x1b[33m[sessao encerrada — codigo ${code}]\x1b[0m`);
  });
  socket.on('upload-done', ({ name }) => showToast(`${name} enviado`));
  socket.on('upload-error', msg => showToast(`Erro: ${msg}`));
}

function setStatus(state, label) {
  document.querySelectorAll('.status-dot').forEach(d => d.className = `status-dot ${state}`);
  document.getElementById('sidebarStatus').textContent = label;
  document.getElementById('pillLabel').textContent = label;
}

// ── Mobile input ─────────────────────────────────────
function sendMobile() {
  const input = document.getElementById('mobileInput');
  if (!input || !activeTabId) return;
  const s = terminals.get(activeTabId);
  if (!s?.socket.connected) return;
  s.socket.emit('input', (input.value || '') + '\r');
  input.value = '';
  try { s.term.focus(); } catch {}
}

function sendQuick(cmd) {
  if (!activeTabId) return;
  const s = terminals.get(activeTabId);
  if (!s?.socket.connected) return;
  s.socket.emit('input', cmd);
  if (cmd !== '\t') {
    const input = document.getElementById('mobileInput');
    if (input) { input.value = cmd.trimEnd(); input.focus(); }
  }
  try { s.term.focus(); } catch {}
}

function sendCtrl(key) {
  if (!activeTabId) return;
  const s = terminals.get(activeTabId);
  if (!s?.socket.connected) return;
  s.socket.emit('input', String.fromCharCode(key.toUpperCase().charCodeAt(0) - 64));
}

function copySelection() {
  if (!activeTabId) return;
  const s = terminals.get(activeTabId);
  if (!s) return;
  const sel = s.term.getSelection();
  if (!sel) { showToast('Selecione um texto'); return; }
  navigator.clipboard?.writeText(sel).then(() => showToast('Copiado!')).catch(() => showToast('Copiado!'));
}

function uploadFile(input) {
  const file = input.files[0];
  if (!file || !activeTabId) return;
  const s = terminals.get(activeTabId);
  if (!s?.socket.connected) return;
  showToast(`Enviando ${file.name}...`);
  const reader = new FileReader();
  reader.onload = () => s.socket.emit('upload', { name: file.name, data: reader.result.split(',')[1] });
  reader.readAsDataURL(file);
  input.value = '';
}

function injectAgent(agentName) {
  showView('terminal', document.querySelector('[data-view="terminal"]'));
  setTimeout(() => {
    if (!activeTabId) return;
    const s = terminals.get(activeTabId);
    if (s?.socket.connected) {
      s.socket.emit('input', `/${agentName} `);
      showToast(`/${agentName} → terminal`);
      try { s.term.focus(); } catch {}
    }
  }, 120);
}

// ── Data loading ─────────────────────────────────────
async function loadAll() {
  await Promise.all([loadStats(), loadSquads(), loadConversations(), loadActivity()]);
}

async function loadStats() {
  try {
    const r = await fetch('/api/stats').then(r => r.json());
    document.getElementById('statSessions').textContent      = r.activeSessions ?? '—';
    document.getElementById('statSquads').textContent        = r.squadsCount ?? '—';
    document.getElementById('statAgents').textContent        = r.agentsCount ?? '—';
    document.getElementById('statConversations').textContent = r.conversationsCount ?? '—';
    document.getElementById('convBadge').textContent         = r.conversationsCount ?? '—';
    document.getElementById('sidebarMode').textContent       = r.ptyMode ? 'PTY completo' : 'Modo pipe';
  } catch {}
}

async function loadSquads() {
  try {
    squadsData = await fetch('/api/squads').then(r => r.json());
    renderSquads(squadsData);
    renderDashSquads(squadsData);
    document.getElementById('squadsCount').textContent = `${Object.keys(squadsData).length} squads`;
  } catch {}
}

async function loadConversations() {
  try {
    const convs = await fetch('/api/conversations').then(r => r.json());
    renderSessions(convs);
    renderRecentList(convs.slice(0, 5));
    document.getElementById('sessionsCount').textContent = `${convs.length} conversas`;
  } catch {}
}

async function loadAgents() {
  try {
    const data = await fetch('/api/agents').then(r => r.json());
    agentsData = data;
    renderMissionControl(data);
    const total = data.core.length + Object.values(data.squads).reduce((s, sq) => s + (sq.agent_names?.length || 0), 0);
    document.getElementById('agentsBadge').textContent = total;
    document.getElementById('statAgents').textContent  = total;
  } catch {}
}

async function loadActivity() {
  try {
    const data = await fetch('/api/activity').then(r => r.json());
    renderActivity(data);
  } catch {}
}

// ── Mission Control ───────────────────────────────────
function renderMissionControl(data) {
  const el = document.getElementById('agentsView');
  if (!el) return;
  simulateWorkingAgents(data);

  let html = `
    <div class="mc-section">
      <div class="mc-section-label">
        ${svgIcon('cpu', '#6B7DB3', 13)}
        <span>AIOS Core — Sistema Operacional de IA</span>
      </div>
      <div class="mc-grid">
        ${data.core.map(a => {
          const m = AGENT_META[a.id] || getAgentMeta(a.id);
          return agentCardHTML(a.id, m.initials, m.color, a.name, a.role);
        }).join('')}
      </div>
    </div>
  `;

  for (const [squadId, squad] of Object.entries(data.squads)) {
    const agents = squad.agent_names || [];
    if (!agents.length) continue;
    const domainIcon = DOMAIN_ICON[squad.domain] || 'layers';
    html += `
      <div class="mc-section">
        <div class="mc-section-label">
          ${svgIcon(domainIcon, '#6B7DB3', 13)}
          <span>${squadId}</span>
          <span class="mc-domain-tag">${squad.domain || ''}</span>
        </div>
        <div class="mc-grid">
          ${agents.map(id => {
            const m = getAgentMeta(id);
            return agentCardHTML(id, m.initials, m.color, m.name, m.role);
          }).join('')}
        </div>
      </div>
    `;
  }

  el.innerHTML = html;
}

function agentCardHTML(id, initials, color, name, role) {
  const isWorking = workingAgents.has(id);
  const textColor = initialsTextColor(color);
  return `
    <div class="agent-mc-card${isWorking ? ' working' : ''}" data-agent-id="${id}"
      onclick="injectAgent('${id}')" style="--ag-color:${color}" title="@${id}">
      ${isWorking ? '<div class="agent-working-dot"></div>' : ''}
      <div class="agent-mc-avatar${isWorking ? ' pulse' : ''}">
        <div class="agent-initials" style="background:${color};color:${textColor}">${initials}</div>
      </div>
      <div class="agent-mc-name">${name}</div>
      <div class="agent-mc-role">${role}</div>
    </div>
  `;
}

function simulateWorkingAgents(data) {
  workingAgents.clear();
  const all = [
    ...data.core.map(a => a.id),
    ...Object.values(data.squads).flatMap(s => s.agent_names || []),
  ];
  const n = Math.floor(Math.random() * 3) + 2;
  for (let i = 0; i < n; i++) workingAgents.add(all[Math.floor(Math.random() * all.length)]);
}

function rotateWorkingAgents() {
  if (!agentsData) return;
  simulateWorkingAgents(agentsData);
  document.querySelectorAll('.agent-mc-card').forEach(card => {
    const id = card.dataset.agentId;
    if (!id) return;
    const isWorking = workingAgents.has(id);
    card.classList.toggle('working', isWorking);
    const avatar = card.querySelector('.agent-mc-avatar');
    if (avatar) avatar.classList.toggle('pulse', isWorking);
    let dot = card.querySelector('.agent-working-dot');
    if (isWorking && !dot) {
      dot = document.createElement('div');
      dot.className = 'agent-working-dot';
      card.insertBefore(dot, card.firstChild);
    } else if (!isWorking && dot) {
      dot.remove();
    }
  });
}

// ── Activity ──────────────────────────────────────────
function renderActivity(data) {
  const el = document.getElementById('activityList');
  if (!el) return;
  const files = data.recentFiles || [];
  if (!files.length) {
    el.innerHTML = '<div class="loading-row dim">Sem atividade nos ultimos 15 min</div>';
    return;
  }
  el.innerHTML = files.slice(0, 6).map(f => `
    <div class="activity-item">
      <span class="activity-dot"></span>
      <div class="activity-info">
        <div class="activity-proj">${f.project.split('/').filter(Boolean).pop() || f.project}</div>
        <div class="activity-time">${timeAgo(new Date(f.mtime))}</div>
      </div>
    </div>
  `).join('');
}

// ── Conversation modal ────────────────────────────────
async function openConversation(projectKey, convId, projectName) {
  const modal = document.getElementById('convModal');
  const title = document.getElementById('convModalTitle');
  const sub   = document.getElementById('convModalSub');
  const body  = document.getElementById('convModalBody');
  if (!modal) return;

  title.textContent = projectName.split('/').filter(Boolean).pop() || projectName;
  if (sub) sub.textContent = projectName;
  body.innerHTML = '<div class="loading-row">Carregando...</div>';
  modal.classList.add('open');

  try {
    const data = await fetch(
      `/api/conversation/${encodeURIComponent(projectKey)}/${encodeURIComponent(convId)}`
    ).then(r => r.json());

    if (!data.messages?.length) {
      body.innerHTML = '<div class="loading-row">Nenhuma mensagem encontrada</div>';
      return;
    }

    body.innerHTML = data.messages.map(msg => `
      <div class="msg-wrap ${msg.role}">
        <div class="msg-role-label">${msg.role === 'user' ? 'Voce' : 'Claude'}</div>
        <div class="msg-bubble ${msg.role}">${escapeHtml(msg.text)}</div>
      </div>
    `).join('');
    body.scrollTop = body.scrollHeight;
  } catch {
    body.innerHTML = '<div class="loading-row">Erro ao carregar</div>';
  }
}

function closeConvModal() {
  document.getElementById('convModal')?.classList.remove('open');
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br>');
}

// ── Squads ────────────────────────────────────────────
function renderSquads(squads) {
  const grid = document.getElementById('squadsGrid');
  if (!grid) return;
  const entries = Object.entries(squads);
  if (!entries.length) { grid.innerHTML = '<div class="loading-row">Nenhum squad</div>'; return; }
  grid.innerHTML = '';
  entries.forEach(([id, squad]) => {
    const agents = squad.agent_names || [];
    const card = document.createElement('div');
    card.className = 'squad-card';
    card.innerHTML = `
      <div class="squad-card-header" onclick="toggleSquad(this)">
        <div class="squad-info">
          <div class="squad-name">${id}</div>
          <div class="squad-domain">${squad.domain || 'general'}</div>
        </div>
        <div class="squad-meta">
          <span class="squad-badge">${agents.length} agents</span>
          <span class="squad-chevron">▶</span>
        </div>
      </div>
      <div class="squad-body">
        ${squad.purpose ? `<div class="squad-purpose">${squad.purpose.slice(0, 200)}…</div>` : ''}
        <div class="agents-list">
          ${agents.map(a => `<button class="agent-chip" onclick="injectAgent('${a}')"><span class="agent-dot"></span>/${a}</button>`).join('')}
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

function toggleSquad(header) {
  header.closest('.squad-card').classList.toggle('open');
}

function renderDashSquads(squads) {
  const el = document.getElementById('dashSquadChips');
  if (!el) return;
  el.innerHTML = Object.keys(squads).map(id =>
    `<button class="squad-chip-btn" onclick="showView('squads', document.querySelector('[data-view=squads]'))">${id}</button>`
  ).join('') || '<div class="loading-row">Nenhum squad</div>';
}

// ── Sessions ──────────────────────────────────────────
function renderSessions(convs) {
  const el = document.getElementById('sessionsList');
  if (!el) return;
  if (!convs.length) { el.innerHTML = '<div class="loading-row">Nenhuma conversa</div>'; return; }
  el.innerHTML = '';
  convs.forEach(c => {
    const d = new Date(c.lastModified);
    const dateStr = d.toLocaleDateString('pt-BR', { day:'2-digit', month:'short' });
    const timeStr = d.toLocaleTimeString('pt-BR', { hour:'2-digit', minute:'2-digit' });
    const item = document.createElement('div');
    item.className = 'session-item clickable';
    item.onclick = () => openConversation(c.projectKey, c.id, c.project);
    item.innerHTML = `
      <div class="session-project">${c.project}</div>
      <div class="session-text">${c.firstText || '(sem preview)'}</div>
      <div class="session-meta">
        <span>${dateStr} ${timeStr}</span>
        <span class="session-badge">${c.userMessages} msgs</span>
        <span class="session-hint">ver →</span>
      </div>
    `;
    el.appendChild(item);
  });
}

function renderRecentList(convs) {
  const el = document.getElementById('recentList');
  if (!el) return;
  if (!convs.length) { el.innerHTML = '<div class="loading-row">Nenhuma conversa</div>'; return; }
  el.innerHTML = '';
  convs.forEach(c => {
    const item = document.createElement('div');
    item.className = 'recent-item';
    item.onclick = () => openConversation(c.projectKey, c.id, c.project);
    item.innerHTML = `
      <div class="recent-project">${c.project.split('/').filter(Boolean).pop() || c.project}</div>
      <div class="recent-text">${c.firstText || '(sem preview)'}</div>
      <div class="recent-meta"><span>${timeAgo(new Date(c.lastModified))}</span><span>${c.userMessages} msgs</span></div>
    `;
    el.appendChild(item);
  });
}

function timeAgo(date) {
  const s = Math.floor((Date.now() - date) / 1000);
  if (s < 60) return 'agora';
  if (s < 3600) return `${Math.floor(s/60)}min atras`;
  if (s < 86400) return `${Math.floor(s/3600)}h atras`;
  return `${Math.floor(s/86400)}d atras`;
}

// ── Toast ────────────────────────────────────────────
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2200);
}
