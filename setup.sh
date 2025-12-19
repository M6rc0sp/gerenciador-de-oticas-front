#!/bin/bash

# Script de setup rápido para o gerenciador-de-oticas-front

echo "🚀 Iniciando setup do Frontend Gerenciador de Óticas..."

# 1. Instalar dependências
echo "📦 Instalando dependências..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Erro ao instalar dependências"
    exit 1
fi

# 2. Copiar arquivo de configuração de ambiente
if [ ! -f .env ]; then
    echo "⚙️  Criando arquivo .env..."
    cp .env.example .env
    echo "✅ Arquivo .env criado com sucesso"
else
    echo "✅ Arquivo .env já existe"
fi

# 3. Verificar instalação
echo "🔍 Verificando instalação..."
npm run lint --help > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo "✅ Setup concluído com sucesso!"
    echo ""
    echo "📝 Próximos passos:"
    echo "1. Edite o arquivo .env com a URL da sua API"
    echo "2. Execute: npm run dev"
    echo "3. Acesse: http://localhost:3000"
    echo ""
    echo "📚 Documentação:"
    echo "- README.md - Visão geral"
    echo "- DEVELOPMENT.md - Guia de desenvolvimento"
    echo "- API_INTEGRATION.md - Como integrar a API"
else
    echo "⚠️  Setup finalizado, mas com possíveis avisos"
fi
