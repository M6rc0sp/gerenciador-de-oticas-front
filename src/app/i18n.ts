import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
    'pt-BR': {
        translation: {
            'categories.title': 'Gerenciador de Óticas',
            'categories.subtitle': 'Suas Categorias',
            'categories.empty': 'Nenhuma categoria criada ainda.',
            'categories.create': 'Nova Categoria',
            'categories.edit': 'Editar Categoria',
            'categories.delete': 'Deletar Categoria',
            'categories.add_subcategory': 'Adicionar Subcategoria',
            'common.save': 'Salvar',
            'common.cancel': 'Cancelar',
            'common.delete': 'Deletar',
            'common.edit': 'Editar',
            'common.loading': 'Carregando...',
            'common.error': 'Erro ao executar ação',
            'common.success': 'Ação executada com sucesso',
        },
    },
};

i18next
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'pt-BR',
        interpolation: {
            escapeValue: false,
        },
    });

export default i18next;
