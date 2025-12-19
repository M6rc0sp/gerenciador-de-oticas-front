#!/bin/bash

# Verificação pós-setup

echo "🔍 Verificando estrutura do projeto..."
echo ""

FILES=(
  "package.json"
  "tsconfig.json"
  "vite.config.ts"
  "index.html"
  ".env.example"
  "src/main.tsx"
  "src/app/App.tsx"
  "src/app/Router.tsx"
  "src/pages/Categories.tsx"
  "src/components/CreateCategoryModal.tsx"
  "src/components/CategoryCard.tsx"
  "src/services/categoryService.ts"
  "src/hooks/useCategories.ts"
  "src/types/category.ts"
  "README.md"
  "DEVELOPMENT.md"
)

MISSING=0

for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "✅ $file"
  else
    echo "❌ $file (AUSENTE)"
    MISSING=$((MISSING + 1))
  fi
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ $MISSING -eq 0 ]; then
  echo "✅ Todos os arquivos foram criados com sucesso!"
  echo ""
  echo "🚀 Você pode agora:"
  echo "  1. npm install"
  echo "  2. npm run dev"
  echo "  3. Acessar http://localhost:3000"
else
  echo "⚠️  Foram encontrados $MISSING arquivos ausentes"
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
