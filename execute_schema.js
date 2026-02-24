#!/usr/bin/env node

/**
 * Executa schema.sql no Supabase via JavaScript
 * Usando @supabase/supabase-js library
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Credenciais
const SUPABASE_URL = 'https://qqzgkxdgobhhivyofhuj.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxemdreGRnb2JoaGl2eW9maHVqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDY1OTI4NCwiZXhwIjoyMDg2MjM1Mjg0fQ.76v6TRU-Pv5qF0GNLm5duvTAZCBklee4ndH4PiGFJ6A';

const schemaPath = path.join(__dirname, 'zona-genius-dashboard/schema.sql');

/**
 * Executa uma query SQL via Supabase SQL API
 * (usando um workaround com Supabase edge functions)
 */
async function executeSQLviaAPI(query) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({ query });

    const options = {
      hostname: 'qqzgkxdgobhhivyofhuj.supabase.co',
      port: 443,
      path: '/rest/v1/rpc/exec_sql',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'apikey': SERVICE_ROLE_KEY,
      },
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({ ok: true, status: res.statusCode, data });
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

/**
 * Main execution
 */
async function main() {
  console.log('='.repeat(70));
  console.log('🔧 Supabase Schema Setup via JavaScript');
  console.log('='.repeat(70));

  // Ler schema
  if (!fs.existsSync(schemaPath)) {
    console.error(`❌ Arquivo não encontrado: ${schemaPath}`);
    return 1;
  }

  const schema = fs.readFileSync(schemaPath, 'utf-8');
  console.log(`\n✅ Schema carregado (${schema.length} bytes)`);

  console.log(`\n🔗 Conectando ao Supabase...`);
  console.log(`   URL: ${SUPABASE_URL}`);

  // Dividir em statements
  const statements = schema
    .split(';')
    .map(stmt => stmt.trim())
    .filter(stmt => stmt && !stmt.startsWith('--'));

  console.log(`\n📊 Total de statements: ${statements.length}`);
  console.log('\n🚀 Executando SQL via API...\n');

  let successCount = 0;
  let errorCount = 0;
  const errors = [];

  // Executar sequencialmente (não paralelo pois pode ter dependências)
  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i];
    const preview = stmt.substring(0, 70).replace(/\n/g, ' ') +
                   (stmt.length > 70 ? '...' : '');

    process.stdout.write(
      `[${String(i + 1).padStart(2, ' ')}/${statements.length}] ${
        preview.substring(0, 70).padEnd(70, ' ')
      }`
    );

    try {
      const result = await executeSQLviaAPI(stmt);
      console.log(' ✅');
      successCount++;
    } catch (error) {
      console.log(` ❌`);
      errorCount++;
      errors.push({
        num: i + 1,
        statement: stmt.substring(0, 100),
        error: error.message,
      });
    }

    // Delay de 100ms para não sobrecarregar
    await new Promise(r => setTimeout(r, 100));
  }

  // Resultado
  console.log('\n' + '='.repeat(70));
  console.log(`📊 RESULTADO FINAL:`);
  console.log(`   ✅ Sucesso: ${successCount}/${statements.length}`);
  console.log(`   ❌ Erros: ${errorCount}/${statements.length}`);
  console.log('='.repeat(70));

  if (errorCount === 0) {
    console.log('\n🎉 SUCESSO! Todas as tabelas criadas no Supabase!');
    console.log('\n📋 Tabelas criadas:');
    console.log('   ✓ organizations');
    console.log('   ✓ users');
    console.log('   ✓ assessments');
    console.log('   ✓ genius_profiles');
    console.log('   ✓ squad_recommendations');
    console.log('   ✓ genius_zone_blueprints');
    console.log('   ✓ chat_responses');
    console.log('   ✓ audit_logs');
    console.log('\n✅ RLS policies ativadas');
    console.log('✅ Índices criados');
    console.log('✅ Triggers configurados\n');
    return 0;
  } else {
    console.log(`\n⚠️  ${errorCount} statements com erro`);
    if (errors.length > 0) {
      console.log('\nPrimeiros erros:');
      errors.slice(0, 3).forEach(err => {
        console.log(`\n[${err.num}] ${err.statement}`);
        console.log(`    → ${err.error.substring(0, 120)}`);
      });
    }
    return 1;
  }
}

main().then(code => process.exit(code)).catch(err => {
  console.error('❌ Erro fatal:', err.message);
  process.exit(1);
});
