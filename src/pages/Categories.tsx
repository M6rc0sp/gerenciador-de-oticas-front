import React, { useState, useEffect, useRef } from 'react';
import { Box, Button, Card, Spinner, Text } from '@nimbus-ds/components';
import Sortable from 'sortablejs';
import { useCategories } from '@/hooks';
import { CreateCategoryModal, CategoryCard } from '@/components';
import { Category } from '@/types';
import { categoryService } from '@/services';

const Categories: React.FC = () => {
    const { categories, loading, error, fetchCategories } = useCategories();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedParentId, setSelectedParentId] = useState<string | null>(null);
    const [editCategory, setEditCategory] = useState<Category | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const sortablesRef = useRef<Sortable[]>([]);

    // Construir árvore de categorias
    const buildCategoryTree = (cats: Category[], parentId: string | null = null, level: number = 0): any[] => {
        return cats
            .filter((cat) => (parentId ? cat.parent === parentId : !cat.parent))
            .map((cat) => ({
                ...cat,
                children: buildCategoryTree(cats, cat.id, level + 1),
                level: level,
            }));
    };

    const handleAddCategory = (parentId?: string) => {
        setEditCategory(null); // Modo criação
        setSelectedParentId(parentId || null);
        setIsModalOpen(true);
    };

    const handleModalSuccess = async () => {
        setIsModalOpen(false);
        setEditCategory(null);
        await fetchCategories();
    };

    const handleDelete = async (id: string) => {
        try {
            await categoryService.delete(id);
            await fetchCategories();
        } catch (err) {
            console.error('Erro ao deletar:', err);
            alert('Erro ao deletar categoria');
        }
    };

    const handleEdit = (category: Category) => {
        setEditCategory(category); // Modo edição
        setSelectedParentId(category.parent || null);
        setIsModalOpen(true);
    };

    // Inicializar Sortable.js igual ao Laravel
    useEffect(() => {
        if (!containerRef.current || loading) return;

        // Limpar Sortables antigos
        sortablesRef.current.forEach((s) => s.destroy());
        sortablesRef.current = [];

        // Rastrear informações do arrasto (igual Laravel)
        let dragStartY = 0;
        let lastItemPassedId: string | null = null;
        let dragDirection: 'up' | 'down' | null = null;

        // Timeout para garantir que DOM está pronto
        const timer = setTimeout(() => {
            // Incluir o próprio containerRef (raiz) + todos os containers de filhos
            const childContainers = containerRef.current?.querySelectorAll('[data-sortable-group]') || [];
            const allContainers: HTMLElement[] = [];

            // Adicionar o container raiz primeiro
            if (containerRef.current) {
                allContainers.push(containerRef.current);
            }

            // Adicionar containers de filhos
            childContainers.forEach((el) => {
                allContainers.push(el as HTMLElement);
            });

            console.log('📦 Inicializando', allContainers.length, 'containers (incluindo raiz)');

            allContainers.forEach((container) => {
                const sortable = new Sortable(container, {
                    group: 'categories',
                    animation: 150,
                    ghostClass: 'sortable-ghost',
                    dragClass: 'sortable-drag',
                    handle: '.drag-handle',
                    fallbackClass: 'sortable-fallback',
                    draggable: '.category-item',
                    onStart: function (evt: Sortable.SortableEvent) {
                        dragStartY = (evt as any).originalEvent?.clientY || 0;
                        lastItemPassedId = null;
                        dragDirection = null;

                        const categoryId = (evt.item as HTMLElement).dataset.categoryId;
                        console.log('🔴 DRAG START - Item ID:', categoryId, 'Y:', dragStartY);
                    },
                    onMove: function (evt: Sortable.MoveEvent) {
                        const currentY = (evt as any).originalEvent?.clientY || 0;

                        if (!dragDirection) {
                            dragDirection = currentY > dragStartY ? 'down' : 'up';
                            console.log('📍 Direção detectada:', dragDirection);
                        }

                        // Se há um item sendo sobreposto
                        if (evt.related && evt.related !== evt.dragged) {
                            const relatedId = (evt.related as HTMLElement).dataset.categoryId;
                            if (relatedId && relatedId !== lastItemPassedId) {
                                lastItemPassedId = relatedId;
                                console.log('👉 Passou por item ID:', lastItemPassedId);
                            }
                        }
                        return true;
                    },
                    onEnd: async function (evt: Sortable.SortableEvent) {
                        const item = evt.item as HTMLElement;
                        const categoryId = item.dataset.categoryId;

                        // O container de destino determina o novo pai
                        const to = evt.to as HTMLElement | null;
                        const from = evt.from as HTMLElement | null;
                        const destGroup = to?.dataset.sortableGroup || null;
                        const fromGroup = from?.dataset.sortableGroup || null;

                        console.log('🔵 DRAG END - Item ID:', categoryId);
                        console.log('📍 FROM:', fromGroup, '→ TO:', destGroup);
                        console.log('📍 to.dataset.parentId:', to?.dataset.parentId);

                        // Detectar pai antigo (string vazia = raiz)
                        const oldParentId = item.dataset.parentId === '' ? null : (item.dataset.parentId || null);

                        let newParentId: string | null = null;

                        // Lógica:
                        // 1. Se destGroup === 'root', vai para raiz
                        // 2. Se destGroup começa com 'children-', extrai o parentId do dataset
                        // 3. Se não identificado, mantém o pai atual
                        if (destGroup === 'root') {
                            newParentId = null;
                            console.log('🏷️ Destino: RAIZ');
                        } else if (destGroup && destGroup.startsWith('children-')) {
                            // O data-parent-id do container indica quem é o pai
                            newParentId = to?.dataset.parentId || null;
                            console.log('🏷️ Destino: filho de', newParentId);
                        } else {
                            // Fallback: manter pai atual
                            console.log('⚠️ Container não identificado, mantendo pai atual');
                            newParentId = oldParentId;
                        }

                        let destinationParentLevel = -1;
                        if (destGroup === 'root') {
                            destinationParentLevel = -1;
                        } else if (destGroup && destGroup.startsWith('children-')) {
                            const parsedLevel = Number(to?.dataset.parentLevel ?? '');
                            destinationParentLevel = Number.isNaN(parsedLevel) ? -1 : parsedLevel;
                        } else if (newParentId) {
                            const parentElement = document.querySelector(`[data-category-id="${newParentId}"]`) as HTMLElement | null;
                            destinationParentLevel = Number(parentElement?.dataset.level ?? '-1');
                        }

                        const targetLevel = destinationParentLevel + 1;
                        if (targetLevel > 2) {
                            console.warn('⚠️ Profundidade máxima (3 níveis) atingida. Revertendo.');
                            await fetchCategories();
                            return;
                        }

                        // Prevenir ciclos: novo pai não pode ser o próprio item nem um descendente
                        const isDescendantOf = (candidateId: string | null, ancestorId: string): boolean => {
                            if (!candidateId) return false;
                            let currentId: string | null = candidateId;
                            const visited = new Set<string>();
                            while (currentId) {
                                if (currentId === ancestorId) return true;
                                if (visited.has(currentId)) break;
                                visited.add(currentId);
                                const el = document.querySelector(`[data-category-id="${currentId}"]`) as HTMLElement | null;
                                if (!el) break;
                                currentId = el.dataset.parentId || null;
                            }
                            return false;
                        };

                        if (newParentId && categoryId) {
                            if (newParentId === categoryId || isDescendantOf(newParentId, categoryId)) {
                                console.warn('⚠️ Movimento criaria ciclo. Ignorando.');
                                await fetchCategories(); // Reverter visual
                                return;
                            }
                        }

                        console.log('Pai anterior:', oldParentId, '→ Novo pai:', newParentId);

                        // Atualizar apenas se mudou de pai
                        // Normalizar: string vazia = null
                        const oldNormalized = oldParentId === '' ? null : oldParentId;
                        const newNormalized = newParentId === '' ? null : newParentId;

                        console.log('Comparação: oldNormalized:', oldNormalized, '!== newNormalized:', newNormalized, '?', oldNormalized !== newNormalized);

                        if (categoryId && oldNormalized !== newNormalized) {
                            try {
                                // IMPORTANTE: passar parent: null explicitamente para mover para raiz
                                console.log('🚀 Enviando UPDATE com parent:', newParentId);
                                await categoryService.update(categoryId, {
                                    parent: newParentId, // null = raiz, string = id do pai
                                });
                                console.log('✅ Categoria atualizada!');
                                await fetchCategories();
                            } catch (error) {
                                console.error('❌ Erro ao atualizar:', error);
                                await fetchCategories(); // Reverter
                            }
                        } else {
                            console.log('ℹ️ Sem mudança de pai, apenas reordenação visual');
                            // Não precisamos reverter - o React vai re-renderizar na próxima atualização
                        }
                    },
                });

                sortablesRef.current.push(sortable);
                console.log('🔧 Sortable configurado para:', container.dataset.sortableGroup);
            });
        }, 100);

        return () => {
            clearTimeout(timer);
            sortablesRef.current.forEach((s) => s.destroy());
            sortablesRef.current = [];
        };
    }, [categories, loading, fetchCategories]);

    // Renderizar árvore de categorias recursivamente
    const renderCategoryTree = (cats: any[], parentLevel: number = 0): React.ReactNode => {
        return cats.map((category) => (
            <CategoryCard
                key={category.id}
                category={category}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onAddChild={handleAddCategory}
                level={parentLevel}
            >
                {category.children && category.children.length > 0 &&
                    renderCategoryTree(category.children, parentLevel + 1)
                }
            </CategoryCard>
        ));
    };

    const tree = buildCategoryTree(categories);

    return (
        <Box padding="5">
            <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="6">
                <Box>
                    <Text fontWeight="bold" fontSize="highlight">
                        Meu Filtro
                    </Text>
                    <Text>Gerencie suas categorias</Text>
                </Box>
                <Button appearance="primary" onClick={() => handleAddCategory()}>
                    Nova Categoria
                </Button>
            </Box>

            {error && (
                <Box padding="2" backgroundColor="danger-surface" marginBottom="4" borderRadius="1">
                    <Text color="danger-textLow">Erro: {error}</Text>
                </Box>
            )}

            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                    <Spinner size="large" />
                </Box>
            ) : categories.length === 0 ? (
                <Card padding="small">
                    <Text fontWeight="bold">Nenhuma categoria</Text>
                    <Box marginTop="2">
                        <Text>Crie sua primeira categoria para começar</Text>
                    </Box>
                    <Button appearance="primary" onClick={() => handleAddCategory()} style={{ marginTop: '12px' }}>
                        Criar Primeira
                    </Button>
                </Card>
            ) : (
                <Card padding="none">
                    <div ref={containerRef} data-sortable-group="root" data-parent-level="-1" className="category-list">
                        {renderCategoryTree(tree)}
                    </div>
                </Card>
            )}

            <CreateCategoryModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditCategory(null);
                }}
                onSuccess={handleModalSuccess}
                parentId={selectedParentId}
                categories={categories}
                editCategory={editCategory}
            />
        </Box>
    );
};

export default Categories;
