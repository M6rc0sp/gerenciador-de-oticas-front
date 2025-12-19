import { useState, useEffect, useCallback } from 'react';
import { Category } from '@/types';
import { categoryService } from '@/services';

export const useCategories = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCategories = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await categoryService.getAll();
            setCategories(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao carregar categorias');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const addCategory = useCallback(
        async (categoryData: Category) => {
            setCategories([...categories, categoryData]);
        },
        [categories],
    );

    const updateCategory = useCallback(
        async (id: string, categoryData: Partial<Category>) => {
            setCategories(
                categories.map((cat) => (cat.id === id ? { ...cat, ...categoryData } : cat)),
            );
        },
        [categories],
    );

    const deleteCategory = useCallback(
        async (id: string) => {
            setCategories(categories.filter((cat) => cat.id !== id));
        },
        [categories],
    );

    const reorderCategory = useCallback(
        async (id: string, parentId: string | null) => {
            setCategories(
                categories.map((cat) => (cat.id === id ? { ...cat, parent_id: parentId } : cat)),
            );
        },
        [categories],
    );

    return {
        categories,
        loading,
        error,
        fetchCategories,
        addCategory,
        updateCategory,
        deleteCategory,
        reorderCategory,
    };
};
