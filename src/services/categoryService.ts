import { axios } from '@/app';
import { Category, CreateCategoryInput, UpdateCategoryInput } from '@/types';

export const categoryService = {
    async getAll(): Promise<Category[]> {
        try {
            const response = await axios.get('/categories');
            return response.data;
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw error;
        }
    },

    async getById(id: string): Promise<Category> {
        try {
            const response = await axios.get(`/categories/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching category ${id}:`, error);
            throw error;
        }
    },

    async create(data: CreateCategoryInput): Promise<Category> {
        try {
            const response = await axios.post(`/categories`, data);
            return response.data;
        } catch (error: any) {
            // Melhorar logging para expor validações do servidor sem tentar adivinhar dados
            if (error.response && error.response.data) {
                console.error('Error creating category - server response:', error.response.data);
                // Repasse mensagem amigável para UI
                const message = (error.response.data && error.response.data.message) ? error.response.data.message : 'Erro do servidor ao criar categoria';
                throw new Error(message);
            }
            console.error('Error creating category:', error);
            throw error;
        }
    },

    async update(id: string, data: UpdateCategoryInput): Promise<Category> {
        try {
            const response = await axios.put(`/categories/${id}`, data);
            return response.data;
        } catch (error) {
            console.error(`Error updating category ${id}:`, error);
            throw error;
        }
    },

    async delete(id: string): Promise<void> {
        try {
            await axios.delete(`/categories/${id}`);
        } catch (error) {
            console.error(`Error deleting category ${id}:`, error);
            throw error;
        }
    },

    async reorder(id: string, parentId: string | null): Promise<Category> {
        try {
            const response = await axios.patch(`/categories/${id}/reorder`, {
                parent_id: parentId,
            });
            return response.data;
        } catch (error) {
            console.error(`Error reordering category ${id}:`, error);
            throw error;
        }
    },
};
