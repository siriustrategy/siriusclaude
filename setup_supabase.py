#!/usr/bin/env python3
"""
Supabase Schema Setup via PostgreSQL Direct Connection
Executa schema.sql no Supabase via psycopg2
"""

import sys
import os

# Tentar importar psycopg2
try:
    import psycopg2
    import psycopg2.extras
except ImportError:
    print("❌ psycopg2 não está instalado.")
    print("📦 Instalando psycopg2...")
    os.system(f"{sys.executable} -m pip install psycopg2-binary")
    import psycopg2
    import psycopg2.extras

# Credenciais Supabase
SUPABASE_HOST = "qqzgkxdgobhhivyofhuj.supabase.co"
SUPABASE_DATABASE = "postgres"
SUPABASE_USER = "postgres"
SUPABASE_PASSWORD = None  # Será pedido ou usado via conexão anônima

# Na verdade, vamos usar a API REST do Supabase via curl
# que é mais simples e seguro

import subprocess
import json

def execute_sql_via_api(sql_statement):
    """
    Executa SQL via API REST do Supabase
    Usa curl + curl + jq para processar
    """

    # Cria um stored procedure temporário para executar SQL
    # Isso é uma forma de "workaround" do Supabase para permitir SQL arbitrary

    pass

def main():
    print("🔧 Supabase Schema Setup")
    print("=" * 60)

    # Ler schema.sql
    schema_path = "zona-genius-dashboard/schema.sql"

    if not os.path.exists(schema_path):
        print(f"❌ Arquivo não encontrado: {schema_path}")
        sys.exit(1)

    with open(schema_path, 'r') as f:
        schema = f.read()

    print(f"✅ Schema carregado ({len(schema)} bytes)")

    # Tentar conexão ao PostgreSQL do Supabase
    try:
        print("\n🔗 Conectando ao Supabase PostgreSQL...")
        print(f"   Host: {SUPABASE_HOST}")
        print(f"   Database: {SUPABASE_DATABASE}")
        print(f"   User: {SUPABASE_USER}")

        # Conexão SSL (Supabase requer SSL)
        conn = psycopg2.connect(
            host=SUPABASE_HOST,
            database=SUPABASE_DATABASE,
            user=SUPABASE_USER,
            password=SUPABASE_PASSWORD,
            port=5432,
            sslmode='require'
        )

        cursor = conn.cursor()
        print("✅ Conectado com sucesso!")

    except psycopg2.OperationalError as e:
        print(f"❌ Erro de conexão: {e}")
        print("\n💡 Sugestão: Você precisa fornecer a SENHA do PostgreSQL")
        print("   Encontre em: Supabase Dashboard > Settings > Database > Password")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Erro inesperado: {e}")
        sys.exit(1)

    # Dividir schema em statements
    statements = [
        s.strip()
        for s in schema.split(';')
        if s.strip() and not s.strip().startswith('--')
    ]

    print(f"\n📊 Total de statements: {len(statements)}")
    print("\n🚀 Executando SQL...\n")

    success_count = 0
    error_count = 0
    errors = []

    for i, statement in enumerate(statements, 1):
        # Preview do statement
        preview = statement[:60] + ('...' if len(statement) > 60 else '')
        preview = preview.replace('\n', ' ')

        try:
            sys.stdout.write(f"[{i}/{len(statements)}] {preview:<65}")
            sys.stdout.flush()

            cursor.execute(statement)
            conn.commit()

            print(" ✅")
            success_count += 1

        except psycopg2.Error as e:
            print(f" ❌")
            error_count += 1
            errors.append({
                'statement_num': i,
                'preview': preview,
                'error': str(e)
            })
            # Continuar mesmo com erro para ver todos os problemas

        except Exception as e:
            print(f" ❌ (Erro inesperado)")
            error_count += 1
            errors.append({
                'statement_num': i,
                'preview': preview,
                'error': f"Unexpected: {str(e)}"
            })

    # Fechar conexão
    cursor.close()
    conn.close()

    # Resumo
    print("\n" + "=" * 60)
    print(f"📊 RESULTADO:")
    print(f"   ✅ Sucesso: {success_count}")
    print(f"   ❌ Erros: {error_count}")

    if errors:
        print(f"\n⚠️  Erros encontrados:")
        for err in errors[:5]:  # Mostrar primeiro 5 erros
            print(f"\n   [{err['statement_num']}] {err['preview']}")
            print(f"   → {err['error'][:100]}")

        if len(errors) > 5:
            print(f"\n   ... e mais {len(errors) - 5} erros")
    else:
        print("\n🎉 Todas as tabelas criadas com sucesso!")

    return 0 if error_count == 0 else 1

if __name__ == '__main__':
    sys.exit(main())
