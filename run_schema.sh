#!/bin/bash
# Executa schema.sql no Supabase via psql

# CREDENCIAIS
SUPABASE_HOST="qqzgkxdgobhhivyofhuj.supabase.co"
SUPABASE_DB="postgres"
SUPABASE_USER="postgres"
SUPABASE_PASSWORD="BBeennoorr0101"
SUPABASE_PORT="5432"

echo "🔧 Conectando ao Supabase PostgreSQL..."
echo "   Host: $SUPABASE_HOST"

# Executar schema.sql
PGPASSWORD="$SUPABASE_PASSWORD" psql \
  --host="$SUPABASE_HOST" \
  --port="$SUPABASE_PORT" \
  --username="$SUPABASE_USER" \
  --dbname="$SUPABASE_DB" \
  --file="zona-genius-dashboard/schema.sql"

echo ""
echo "✅ Done!"
