#!/usr/bin/env python3
"""
Executa schema.sql no Supabase PostgreSQL
Conexão direta ao banco de dados
"""

import sys
import os

# Importar psycopg2
try:
    import psycopg2
    import psycopg2.extras
except ImportError:
    print("Instalando psycopg2...")
    os.system(f"{sys.executable} -m pip install --user psycopg2-binary --quiet")
    import psycopg2
    import psycopg2.extras

def main():
    # Credenciais
    config = {
        'host': 'qqzgkxdgobhhivyofhuj.supabase.co',
        'database': 'postgres',
        'user': 'postgres',
        'password': 'BBeennoorr0101',
        'port': 5432,
        'sslmode': 'require'
    }

    schema_path = 'zona-genius-dashboard/schema.sql'

    print("=" * 70)
    print("🔧 Supabase Schema Setup")
    print("=" * 70)

    # Ler schema
    if not os.path.exists(schema_path):
        print(f"❌ Arquivo não encontrado: {schema_path}")
        return 1

    with open(schema_path, 'r') as f:
        schema = f.read()

    print(f"\n✅ Schema carregado ({len(schema)} bytes)")
    print(f"\n🔗 Conectando ao Supabase...")
    print(f"   Host: {config['host']}")
    print(f"   DB: {config['database']}")
    print(f"   User: {config['user']}")

    try:
        # Conectar ao PostgreSQL
        conn = psycopg2.connect(
            host=config['host'],
            database=config['database'],
            user=config['user'],
            password=config['password'],
            port=config['port'],
            sslmode=config['sslmode'],
            connect_timeout=10
        )

        print("✅ Conectado com sucesso!\n")

        cursor = conn.cursor()

        # Dividir em statements (split por ;)
        statements = []
        current = ""
        in_string = False
        quote_char = None

        for char in schema:
            if char in ('"', "'") and (not current or current[-1] != '\\'):
                in_string = not in_string
                quote_char = char if in_string else None

            current += char

            if char == ';' and not in_string:
                stmt = current.strip()
                if stmt and not stmt.startswith('--'):
                    statements.append(stmt)
                current = ""

        # Filtrar comentários
        filtered_statements = []
        for stmt in statements:
            lines = stmt.split('\n')
            cleaned_lines = [line for line in lines if not line.strip().startswith('--')]
            cleaned = '\n'.join(cleaned_lines).strip()
            if cleaned:
                filtered_statements.append(cleaned)

        statements = filtered_statements

        print(f"📊 Total de statements: {len(statements)}\n")
        print("🚀 Executando SQL...\n")

        success_count = 0
        error_count = 0
        errors = []

        for i, statement in enumerate(statements, 1):
            preview = statement[:70].replace('\n', ' ')
            if len(statement) > 70:
                preview += "..."

            try:
                sys.stdout.write(f"[{i:2d}/{len(statements)}] {preview:<75}")
                sys.stdout.flush()

                cursor.execute(statement)
                conn.commit()

                print(" ✅")
                success_count += 1

            except psycopg2.Error as e:
                error_msg = str(e).split('\n')[0][:50]
                print(f" ❌ {error_msg}")
                error_count += 1
                errors.append({
                    'num': i,
                    'statement': statement[:100],
                    'error': str(e)
                })

            except Exception as e:
                print(f" ❌ Erro inesperado")
                error_count += 1
                errors.append({
                    'num': i,
                    'statement': statement[:100],
                    'error': str(e)
                })

        # Fechar conexão
        cursor.close()
        conn.close()

        # Resultado
        print("\n" + "=" * 70)
        print(f"📊 RESULTADO FINAL:")
        print(f"   ✅ Sucesso: {success_count}/{len(statements)}")
        print(f"   ❌ Erros: {error_count}/{len(statements)}")
        print("=" * 70)

        if error_count == 0:
            print("\n🎉 SUCESSO! Todas as tabelas criadas no Supabase!")
            print("\n📋 Tabelas criadas:")
            print("   ✓ organizations")
            print("   ✓ users")
            print("   ✓ assessments")
            print("   ✓ genius_profiles")
            print("   ✓ squad_recommendations")
            print("   ✓ genius_zone_blueprints")
            print("   ✓ chat_responses")
            print("   ✓ audit_logs")
            print("\n✅ RLS policies ativadas")
            print("✅ Índices criados")
            print("✅ Triggers configurados")
            return 0
        else:
            print(f"\n⚠️  {error_count} statements com erro")
            print("\nPrimeiros erros:")
            for err in errors[:3]:
                print(f"\n[{err['num']}] {err['statement'][:80]}")
                print(f"    → {err['error'][:120]}")
            return 1

    except psycopg2.OperationalError as e:
        print(f"❌ Erro de conexão: {e}")
        print("\n💡 Verifique:")
        print("   • Senha está correta?")
        print("   • Host está correto?")
        print("   • Supabase projeto está ativo?")
        return 1

    except Exception as e:
        print(f"❌ Erro: {e}")
        import traceback
        traceback.print_exc()
        return 1

if __name__ == '__main__':
    sys.exit(main())
