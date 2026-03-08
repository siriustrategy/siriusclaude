#!/bin/bash
# SIRIUS COMMAND CENTER — Iniciar em background

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

echo "╔══════════════════════════════════╗"
echo "║   SIRIUS — Iniciando...          ║"
echo "╚══════════════════════════════════╝"

# Instalar PM2 se nao tiver
if ! command -v pm2 &>/dev/null; then
  echo "Instalando PM2..."
  npm install -g pm2
fi

# Matar instancia anterior se existir
pm2 delete sirius 2>/dev/null

# Iniciar
pm2 start "$SCRIPT_DIR/server.js" \
  --name sirius \
  --cwd "$PROJECT_DIR" \
  --log-date-format "HH:mm:ss"

pm2 save

# Mostrar IP
IP=$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || echo "localhost")

echo ""
echo "SIRIUS rodando em background!"
echo "  Celular: http://${IP}:7681"
echo "  Local:   http://localhost:7681"
echo ""
echo "Comandos:"
echo "  pm2 logs sirius    → ver logs em tempo real"
echo "  pm2 stop sirius    → parar"
echo "  pm2 restart sirius → reiniciar"
