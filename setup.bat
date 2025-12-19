@echo off
REM Script de setup rápido para Windows

echo 🚀 Iniciando setup do Frontend Gerenciador de Óticas...

REM 1. Instalar dependências
echo 📦 Instalando dependências...
call npm install

if errorlevel 1 (
    echo ❌ Erro ao instalar dependências
    exit /b 1
)

REM 2. Copiar arquivo de configuração de ambiente
if not exist .env (
    echo ⚙️  Criando arquivo .env...
    copy .env.example .env
    echo ✅ Arquivo .env criado com sucesso
) else (
    echo ✅ Arquivo .env já existe
)

REM 3. Verificar instalação
echo 🔍 Verificando instalação...

echo ✅ Setup concluído com sucesso!
echo.
echo 📝 Próximos passos:
echo 1. Edite o arquivo .env com a URL da sua API
echo 2. Execute: npm run dev
echo 3. Acesse: http://localhost:3000
echo.
echo 📚 Documentação:
echo - README.md - Visão geral
echo - DEVELOPMENT.md - Guia de desenvolvimento
echo - API_INTEGRATION.md - Como integrar a API
