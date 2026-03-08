const express    = require('express');
const http       = require('http');
const { Server } = require('socket.io');
const { spawn, exec } = require('child_process');
const path       = require('path');
const fs         = require('fs');
const yaml       = require('js-yaml');
const os         = require('os');
const net        = require('net');

const app    = express();
const server = http.createServer(app);
const io     = new Server(server, { cors: { origin: '*' } });

const PORT        = 7681;
const PROJECT_ROOT = path.join(__dirname, '..');
const REGISTRY_PATH = path.join(PROJECT_ROOT, 'squads/squad-creator/data/squad-registry.yaml');
const CLAUDE_DIR    = path.join(os.homedir(), '.claude', 'projects');

// ── node-pty (opcional) ──────────────────────────────
let pty = null;
for (const lib of ['node-pty-prebuilt-multiarch', 'node-pty']) {
  try { pty = require(lib); break; } catch {}
}
console.log(pty ? '[pty] modo PTY completo' : '[pty] modo pipe (fallback)');

// ── CORS (aceita chamadas do Hub Next.js) ────────────
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// ── Static ───────────────────────────────────────────
app.use(express.static(path.join(__dirname, 'public')));

// ── Utils ────────────────────────────────────────────
function getLocalIP() {
  for (const ifaces of Object.values(os.networkInterfaces())) {
    for (const i of ifaces) {
      if (i.family === 'IPv4' && !i.internal) return i.address;
    }
  }
  return 'localhost';
}

function detectShell() {
  for (const s of [process.env.SHELL, '/bin/zsh', '/bin/bash', '/bin/sh'].filter(Boolean)) {
    try { if (fs.existsSync(s)) return s; } catch {}
  }
  return '/bin/sh';
}

// ── API: info ────────────────────────────────────────
app.get('/api/info', (req, res) => {
  res.json({ ip: getLocalIP(), port: PORT, ptyMode: !!pty, version: '2.0' });
});

// ── API: squads ──────────────────────────────────────
app.get('/api/squads', (req, res) => {
  try {
    const data = yaml.load(fs.readFileSync(REGISTRY_PATH, 'utf8'));
    return res.json(data.squads || {});
  } catch {}
  try {
    const squads = {};
    const squadsDir = path.join(PROJECT_ROOT, 'squads');
    for (const folder of fs.readdirSync(squadsDir)) {
      const full = path.join(squadsDir, folder);
      if (!fs.statSync(full).isDirectory()) continue;
      const cfg = path.join(full, 'config.yaml');
      squads[folder] = fs.existsSync(cfg)
        ? yaml.load(fs.readFileSync(cfg, 'utf8'))
        : { purpose: 'Squad disponivel', agent_names: [] };
    }
    res.json(squads);
  } catch { res.json({}); }
});

// ── API: stats ───────────────────────────────────────
app.get('/api/stats', (req, res) => {
  let squadsCount = 0, agentsCount = 0, conversationsCount = 0, projectsCount = 0;

  try {
    const reg = yaml.load(fs.readFileSync(REGISTRY_PATH, 'utf8'));
    squadsCount  = Object.keys(reg.squads || {}).length;
    agentsCount  = reg.metadata?.total_agents || 0;
  } catch {}

  try {
    const projects = fs.readdirSync(CLAUDE_DIR).filter(p =>
      fs.statSync(path.join(CLAUDE_DIR, p)).isDirectory()
    );
    projectsCount = projects.length;
    for (const p of projects) {
      conversationsCount += fs.readdirSync(path.join(CLAUDE_DIR, p))
        .filter(f => f.endsWith('.jsonl')).length;
    }
  } catch {}

  res.json({
    activeSessions:    io.sockets.sockets.size,
    squadsCount,
    agentsCount,
    conversationsCount,
    projectsCount,
    uptimeSeconds:     Math.floor(process.uptime()),
    nodeVersion:       process.version,
    ptyMode:           !!pty,
  });
});

// ── API: conversas ───────────────────────────────────
app.get('/api/conversations', (req, res) => {
  const result = [];
  try {
    const projects = fs.readdirSync(CLAUDE_DIR).filter(p =>
      fs.statSync(path.join(CLAUDE_DIR, p)).isDirectory()
    );

    for (const project of projects) {
      const pDir = path.join(CLAUDE_DIR, project);
      const files = fs.readdirSync(pDir).filter(f => f.endsWith('.jsonl'));
      // Decode folder name → project path
      const projectName = '/' + project.replace(/^-/, '').replace(/-/g, '/');

      for (const file of files) {
        const filePath = path.join(pDir, file);
        let stat;
        try { stat = fs.statSync(filePath); } catch { continue; }

        let userMessages = 0, firstText = '';
        try {
          const lines = fs.readFileSync(filePath, 'utf8').split('\n').filter(Boolean);
          for (const line of lines) {
            try {
              const obj = JSON.parse(line);
              if (obj.type === 'user') {
                userMessages++;
                if (!firstText) {
                  const c = obj.message?.content;
                  firstText = typeof c === 'string' ? c
                    : Array.isArray(c) ? (c.find(x => x.type === 'text')?.text || '') : '';
                  // Strip XML tags and trim
                  firstText = firstText.replace(/<[^>]+>/g, '').trim().slice(0, 120);
                }
              }
            } catch {}
          }
        } catch {}

        result.push({
          id:           file.replace('.jsonl', ''),
          project:      projectName,
          projectKey:   project,
          userMessages,
          firstText,
          lastModified: stat.mtime,
          size:         stat.size,
        });
      }
    }
  } catch {}

  result.sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified));
  res.json(result.slice(0, 100));
});

// ── API: agents ──────────────────────────────────────
app.get('/api/agents', (req, res) => {
  const core = [
    { id: 'aios-master',      name: 'AIOS Master', role: 'Framework',    avatar: '⭐', color: '#FFD700' },
    { id: 'dev',              name: 'Dex',         role: 'Dev',          avatar: '💻', color: '#2060FF' },
    { id: 'qa',               name: 'QA',          role: 'Quality',      avatar: '🔍', color: '#00C896' },
    { id: 'architect',        name: 'Aria',        role: 'Architecture', avatar: '🏛️', color: '#9B59FF' },
    { id: 'pm',               name: 'Morgan',      role: 'Product',      avatar: '📋', color: '#FF8C00' },
    { id: 'po',               name: 'Pax',         role: 'Owner',        avatar: '🎯', color: '#FF3366' },
    { id: 'sm',               name: 'River',       role: 'Scrum',        avatar: '🌊', color: '#00D4FF' },
    { id: 'analyst',          name: 'Analyst',     role: 'Analysis',     avatar: '📊', color: '#C060FF' },
    { id: 'devops',           name: 'Gage',        role: 'DevOps',       avatar: '🚀', color: '#FF6B35' },
    { id: 'data-engineer',    name: 'Dara',        role: 'Database',     avatar: '🗄️', color: '#40E0D0' },
    { id: 'ux-design-expert', name: 'UX Expert',   role: 'Design',       avatar: '🎨', color: '#FF69B4' },
  ];
  let squads = {};
  try {
    const data = yaml.load(fs.readFileSync(REGISTRY_PATH, 'utf8'));
    squads = data.squads || {};
  } catch {}
  res.json({ core, squads });
});

// ── API: conversation detail ─────────────────────────
app.get('/api/conversation/:projectKey/:convId', (req, res) => {
  const { projectKey, convId } = req.params;
  const filePath = path.join(CLAUDE_DIR, projectKey, `${convId}.jsonl`);
  const messages = [];
  try {
    const lines = fs.readFileSync(filePath, 'utf8').split('\n').filter(Boolean);
    for (const line of lines) {
      try {
        const obj = JSON.parse(line);
        if (obj.type !== 'user' && obj.type !== 'assistant') continue;
        const content = obj.message?.content;
        let text = typeof content === 'string' ? content
          : Array.isArray(content) ? content.filter(c => c.type === 'text').map(c => c.text).join('\n') : '';
        text = text.replace(/<[^>]{1,300}>/g, '').trim();
        if (!text) continue;
        messages.push({ role: obj.type, text: text.slice(0, 3000), ts: obj.timestamp || null });
      } catch {}
    }
    res.json({ messages });
  } catch {
    res.status(404).json({ error: 'Not found' });
  }
});

// ── API: activity ────────────────────────────────────
app.get('/api/activity', (req, res) => {
  const result = { processes: [], recentFiles: [] };

  // Recent Claude sessions (last 15 min)
  try {
    const cutoff = Date.now() - 15 * 60 * 1000;
    const projects = fs.readdirSync(CLAUDE_DIR).filter(p =>
      fs.statSync(path.join(CLAUDE_DIR, p)).isDirectory()
    );
    for (const proj of projects) {
      const dir = path.join(CLAUDE_DIR, proj);
      for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.jsonl'))) {
        const stat = fs.statSync(path.join(dir, f));
        if (stat.mtime.getTime() > cutoff) {
          result.recentFiles.push({
            project: '/' + proj.replace(/^-/, '').replace(/-/g, '/'),
            file: f.replace('.jsonl', ''),
            mtime: stat.mtime,
          });
        }
      }
    }
    result.recentFiles.sort((a, b) => new Date(b.mtime) - new Date(a.mtime));
  } catch {}

  // Running claude processes
  exec('ps aux | grep -i claude | grep -v grep', { timeout: 3000 }, (err, stdout) => {
    if (!err && stdout) {
      result.processes = stdout.split('\n').filter(Boolean).map(line => {
        const parts = line.trim().split(/\s+/);
        return { pid: parts[1], cpu: parts[2], cmd: parts.slice(10).join(' ').slice(0, 90) };
      }).filter(p => p.cmd);
    }
    res.json(result);
  });
});

// ── Terminal session factory ─────────────────────────
function createSession(socket) {
  const shell = detectShell();
  const env = {
    ...process.env,
    TERM: 'xterm-256color',
    COLORTERM: 'truecolor',
    LANG: process.env.LANG || 'en_US.UTF-8',
  };

  if (pty) {
    try {
      const term = pty.spawn(shell, [], {
        name: 'xterm-256color', cols: 120, rows: 30,
        cwd: PROJECT_ROOT, env,
      });
      term.onData(data => socket.emit('output', data));
      term.onExit(({ exitCode }) => socket.emit('exit', exitCode));
      return {
        write:  d => { try { term.write(d); } catch {} },
        resize: (c, r) => { try { term.resize(c, r); } catch {} },
        kill:   () => { try { term.kill(); } catch {} },
        mode: 'pty',
      };
    } catch (e) { console.warn('[pty] falhou:', e.message); }
  }

  const proc = spawn(shell, ['-i'], { cwd: PROJECT_ROOT, env, stdio: ['pipe','pipe','pipe'] });
  proc.stdout.on('data', d => socket.emit('output', d.toString('utf8')));
  proc.stderr.on('data', d => socket.emit('output', d.toString('utf8')));
  proc.on('exit', code => socket.emit('exit', code ?? 0));
  proc.on('error', e => socket.emit('output', `\r\n[erro: ${e.message}]\r\n`));
  setTimeout(() => socket.emit('output', '\x1b[33m[modo pipe]\x1b[0m\r\n'), 400);

  return {
    write:  d => { try { proc.stdin.write(d); } catch {} },
    resize: () => {},
    kill:   () => { try { proc.kill('SIGTERM'); } catch {} },
    mode: 'pipe',
  };
}

// ── WebSocket ────────────────────────────────────────
io.on('connection', socket => {
  console.log('[+]', socket.id);
  const session = createSession(socket);

  socket.on('input',  data => session.write(data));
  socket.on('resize', ({ cols, rows }) => session.resize(cols, rows));

  // Upload de arquivo
  socket.on('upload', ({ name, data }) => {
    try {
      const dir = path.join(PROJECT_ROOT, 'uploads');
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      const safe = name.replace(/[^a-zA-Z0-9._-]/g, '_');
      fs.writeFileSync(path.join(dir, safe), Buffer.from(data, 'base64'));
      socket.emit('upload-done', { path: `uploads/${safe}`, name: safe });
    } catch (e) { socket.emit('upload-error', e.message); }
  });

  socket.on('disconnect', () => {
    console.log('[-]', socket.id);
    session.kill();
  });
});

// ── Inicia liberando porta ───────────────────────────
function freePort(port, cb) {
  const t = net.createServer();
  t.once('error', () => {
    spawn('bash', ['-c', `lsof -ti:${port} | xargs kill -9 2>/dev/null`])
      .on('exit', () => setTimeout(cb, 600));
  });
  t.once('listening', () => t.close(cb));
  t.listen(port, '0.0.0.0');
}

freePort(PORT, () => {
  server.listen(PORT, '0.0.0.0', () => {
    const ip = getLocalIP();
    console.log(`
╔══════════════════════════════════════════╗
║         SIRIUS COMMAND CENTER v2.0       ║
╠══════════════════════════════════════════╣
║  Local:   http://localhost:${PORT}         ║
║  Celular: http://${ip}:${PORT}      ║
║  Modo:    ${pty ? 'PTY completo              ' : 'Pipe (fallback)            '}║
╚══════════════════════════════════════════╝
`);
  });
});
