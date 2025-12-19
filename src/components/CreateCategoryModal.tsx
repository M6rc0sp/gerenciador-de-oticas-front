import React, { useState, useEffect } from 'react';
import { Box, Button, Input, Select, Text, Textarea, Modal } from '@nimbus-ds/components';
import { Category } from '@/types';
import { categoryService } from '@/services';

interface CreateCategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (category: Category) => void;
    parentId?: string | null;
    categories: Category[];
    editCategory?: Category | null; // Categoria para edição
}

const SECTION_OPTIONS = [
    { label: 'Tipo', value: 'tipo' },
    { label: 'Espessura', value: 'espessura' },
    { label: 'Produto', value: 'produto' },
];

export const CreateCategoryModal: React.FC<CreateCategoryModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
    parentId,
    editCategory,
}) => {
    const [title, setTitle] = useState('');
    const [section, setSection] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isEditing = !!editCategory;

    // Preencher formulário quando editar ou limpar quando criar
    useEffect(() => {
        if (isOpen && editCategory) {
            // Modo edição - preencher com dados da categoria
            setTitle(editCategory.title || '');
            setSection(editCategory.section || '');
            setDescription(editCategory.description || '');
            setError(null);
        } else if (!isOpen) {
            // Modal fechou - limpar tudo
            setTitle('');
            setSection('');
            setDescription('');
            setError(null);
        }
    }, [isOpen, editCategory]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!title || !section) {
            setError('Preencha todos os campos obrigatórios');
            return;
        }

        try {
            setLoading(true);

            if (isEditing && editCategory) {
                // Atualizar categoria existente
                await categoryService.update(editCategory.id, {
                    title,
                    section,
                    description: description || undefined,
                });
            } else {
                // Criar nova categoria
                await categoryService.create({
                    title,
                    section,
                    description: description || undefined,
                    parent: parentId || undefined,
                });
            }

            onSuccess({} as Category);
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : `Erro ao ${isEditing ? 'atualizar' : 'criar'} categoria`;
            setError(errorMsg);
            console.error('Erro:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal open={isOpen} onDismiss={onClose}>
            <Modal.Header>
                <Text fontWeight="bold">{isEditing ? 'Editar Categoria' : 'Nova Categoria'}</Text>
            </Modal.Header>

            <Modal.Body>
                <form onSubmit={handleSubmit}>
                    <Box display="flex" flexDirection="column" gap="3">
                        {/* Erro */}
                        {error && (
                            <Box
                                padding="2"
                                backgroundColor="danger-surface"
                                borderRadius="1"
                            >
                                <Text color="danger-textLow">{error}</Text>
                            </Box>
                        )}

                        {/* Título */}
                        <Box display="flex" flexDirection="column" gap="1">
                            <Text fontWeight="bold">Título *</Text>
                            <Input
                                placeholder="Ex: Lentes Premium"
                                value={title}
                                onChange={(e) => setTitle((e.target as HTMLInputElement).value)}
                                disabled={loading}
                            />
                        </Box>

                        {/* Seção */}
                        <Box display="flex" flexDirection="column" gap="1">
                            <Text fontWeight="bold">Seção *</Text>
                            <Select
                                id="section"
                                name="section"
                                value={section}
                                onChange={(e) => setSection((e.target as HTMLSelectElement).value)}
                                disabled={loading}
                            >
                                <option value="">Selecione a seção</option>
                                {SECTION_OPTIONS.map((o) => (
                                    <option key={o.value} value={o.value}>
                                        {o.label}
                                    </option>
                                ))}
                            </Select>
                        </Box>

                        {/* Descrição */}
                        <Box display="flex" flexDirection="column" gap="1">
                            <Text fontWeight="bold">Descrição</Text>
                            <Textarea
                                id="description"
                                placeholder="Descrição da categoria"
                                value={description}
                                onChange={(e) => setDescription((e.target as HTMLTextAreaElement).value)}
                                disabled={loading}
                                style={{ minHeight: '80px' }}
                            />
                        </Box>
                    </Box>
                </form>
            </Modal.Body>

            <Modal.Footer>
                <Button
                    appearance="neutral"
                    onClick={onClose}
                    disabled={loading}
                >
                    Cancelar
                </Button>
                <Button
                    appearance="primary"
                    onClick={handleSubmit}
                    disabled={loading || !title || !section}
                >
                    {loading ? (isEditing ? 'Salvando...' : 'Criando...') : (isEditing ? 'Salvar' : 'Criar')}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
