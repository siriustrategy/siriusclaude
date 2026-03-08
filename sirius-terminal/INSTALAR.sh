#!/bin/bash
# Corrige permissoes do npm e instala dependencias
echo "Corrigindo permissoes do npm..."
sudo chown -R $(whoami) ~/.npm
echo "Instalando dependencias..."
cd "$(dirname "$0")/.."
npm install socket.io node-pty js-yaml express
echo ""
echo "Pronto! Agora rode: npm run terminal"
