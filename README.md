# Gerenciador de Óticas - Frontend

Frontend moderno em React/TypeScript para o Gerenciador de Óticas, integrado com Nimbus Design System da Nuvemshop.

## 📋 Funcionalidades

- Gerenciamento de categorias hierárquicas
- Autenticação integrada com NexoSync
- Interface responsiva com Nimbus DS
- Suporte a I18n (internacionalização)
- Drag-and-drop para reordenação de categorias

## 🚀 Instalação

```bash
npm install
```

## 📦 Desenvolvimento

```bash
npm run dev
```

## 🏗️ Build

```bash
npm run build
```

## 📁 Estrutura do Projeto

```
src/
  ├── app/              # Configuração da aplicação
  ├── components/       # Componentes reutilizáveis
  ├── hooks/           # Hooks customizados
  ├── pages/           # Páginas da aplicação
  ├── services/        # Serviços de API
  ├── types/           # Tipos TypeScript
  ├── utils/           # Funções utilitárias
  └── main.tsx         # Entrada da aplicação
```

## 🔗 API Integration

O frontend consome a API em:
- `GET /api/categories` - Lista categorias
- `POST /api/categories` - Cria categoria
- `PUT /api/categories/:id` - Atualiza categoria
- `DELETE /api/categories/:id` - Deleta categoria
- `PATCH /api/categories/:id/reorder` - Reordena categoria
