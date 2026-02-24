#!/bin/bash
# Executa schema.sql no Supabase com SSL

SUPABASE_HOST="qqzgkxdgobhhivyofhuj.supabase.co"
SUPABASE_DB="postgres"
SUPABASE_USER="postgres"
SUPABASE_PASSWORD="BBeennoorr0101"

echo "🔧 Conectando ao Supabase PostgreSQL com SSL..."

PGPASSWORD="$SUPABASE_PASSWORD" psql \
  -h "$SUPABASE_HOST" \
  -U "$SUPABASE_USER" \
  -d "$SUPABASE_DB" \
  -p 5432 \
  --set=sslmode=require \
  -f zona-genius-dashboard/schema.sql

echo ""
echo "✅ Schema executado!"
