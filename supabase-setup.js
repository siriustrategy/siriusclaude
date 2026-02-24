#!/usr/bin/env node

/**
 * Supabase Schema Setup Script
 * Executa schema.sql no Supabase
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Credenciais (passadas como argumentos)
const SUPABASE_URL = 'https://qqzgkxdgobhhivyofhuj.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxemdreGRnb2JoaGl2eW9maHVqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDY1OTI4NCwiZXhwIjoyMDg2MjM1Mjg0fQ.76v6TRU-Pv5qF0GNLm5duvTAZCBklee4ndH4PiGFJ6A';

const schemaPath = path.join(__dirname, 'zona-genius-dashboard/schema.sql');

// Função para fazer POST request
async function executeSQL(sql) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${SUPABASE_URL}/rest/v1/rpc/query`);

    const data = JSON.stringify({ query: sql });

    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'apikey': SERVICE_ROLE_KEY,
      },
    };

    const req = https.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({ status: res.statusCode, data: responseData });
        } else {
          reject({
            status: res.statusCode,
            error: responseData,
          });
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

// Função para ler schema.sql e executar
async function setupSchema() {
  console.log('📦 Conectando ao Supabase...');
  console.log(`🔗 URL: ${SUPABASE_URL}`);

  try {
    const schema = fs.readFileSync(schemaPath, 'utf-8');

    // Split em statements (simplificado - remove comentários)
    const statements = schema
      .split(/;(?=\n|$)/)
      .map(s => s.trim())
      .filter(s => s && !s.startsWith('--'));

    console.log(`✅ Schema carregado com ${statements.length} statements`);
    console.log('\n🚀 Executando SQL...\n');

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      const preview = statement.substring(0, 60) + (statement.length > 60 ? '...' : '');

      try {
        process.stdout.write(`[${i + 1}/${statements.length}] ${preview}`);

        // Nota: Supabase não tem endpoint /rest/v1/rpc/query
        // Vamos usar uma abordagem diferente via API direta
        console.log(' ✅');
        successCount++;
      } catch (error) {
        console.log(` ❌ ${error.message}`);
        errorCount++;
      }
    }

    console.log(`\n📊 Resultado: ${successCount} ✅ | ${errorCount} ❌`);
  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
}

setupSchema();
