import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Category } from '@/types';

interface CategoryCardProps {
    category: Category;
    onEdit: (category: Category) => void;
    onDelete: (id: string) => void;
    onAddChild: (parentId: string) => void;
    children?: React.ReactNode;
    level?: number;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
    category,
    onEdit,
    onDelete,
    onAddChild,
    children,
    level = 0
}) => {
    const [showMenu, setShowMenu] = useState(false);
    const [expanded, setExpanded] = useState(true);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
    const menuRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const childCount = category.children?.length ?? React.Children.count(children);
    const hasChildren = childCount > 0;

    const levelColors = ['#3498db', '#27ae60', '#9b59b6', '#e67e22', '#e74c3c'];
    const borderColor = levelColors[level % levelColors.length];

    useEffect(() => {
        if (showMenu && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            const menuWidth = 160;
            let left = rect.right - menuWidth;
            if (left < 10) left = rect.left;
            setMenuPosition({ top: rect.bottom + 4, left: left });
        }
    }, [showMenu]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            if (menuRef.current && !menuRef.current.contains(target) &&
                buttonRef.current && !buttonRef.current.contains(target)) {
                setShowMenu(false);
            }
        };
        if (showMenu) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showMenu]);

    const dropdownMenu = showMenu ? createPortal(
        <div ref={menuRef} style={{
            position: 'fixed', top: menuPosition.top, left: menuPosition.left,
            zIndex: 99999, minWidth: '160px', backgroundColor: '#fff',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)', border: '1px solid #e5e5e5',
            borderRadius: '6px', overflow: 'hidden',
        }}>
            <button onClick={() => { onEdit(category); setShowMenu(false); }}
                style={{
                    display: 'flex', alignItems: 'center', gap: '8px', width: '100%',
                    padding: '10px 14px', border: 'none', backgroundColor: 'transparent',
                    cursor: 'pointer', fontSize: '14px', textAlign: 'left'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                ✎ Editar
            </button>
            {level < 2 && (
                <button onClick={() => { onAddChild(category.id); setShowMenu(false); }}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '8px', width: '100%',
                        padding: '10px 14px', border: 'none', backgroundColor: 'transparent',
                        cursor: 'pointer', fontSize: '14px', textAlign: 'left'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                    ➕ Subcategoria
                </button>
            )}
            <button onClick={() => { if (window.confirm(`Deletar "${category.title}"?`)) { onDelete(category.id); setShowMenu(false); } }}
                style={{
                    display: 'flex', alignItems: 'center', gap: '8px', width: '100%',
                    padding: '10px 14px', border: 'none', backgroundColor: 'transparent',
                    cursor: 'pointer', fontSize: '14px', textAlign: 'left', color: '#dc3545'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fff5f5'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                🗑 Deletar
            </button>
        </div>,
        document.body
    ) : null;

    return (
        <div
            className="category-item"
            data-category-id={category.id}
            data-parent-id={category.parent || ''}
            data-level={level}
            style={{
                marginLeft: level > 0 ? '28px' : '0',
                borderLeft: level > 0 ? `3px solid ${borderColor}` : 'none',
                backgroundColor: level > 0 ? 'rgba(0,0,0,0.01)' : 'transparent',
            }}
        >
            <div
                className="category-header"
                style={{
                    display: 'flex', alignItems: 'center', padding: '12px 16px',
                    backgroundColor: '#fff', borderBottom: '1px solid #e9ecef',
                    cursor: 'grab', transition: 'background-color 0.15s', userSelect: 'none',
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#fff'}
            >
                <div className="drag-handle" style={{
                    display: 'flex', marginRight: '12px', cursor: 'grab', opacity: 0.4, fontSize: '14px'
                }}>⋮⋮</div>

                <div onClick={(e) => { e.stopPropagation(); if (hasChildren) setExpanded(!expanded); }}
                    style={{
                        width: '20px', height: '20px', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', marginRight: '8px', cursor: hasChildren ? 'pointer' : 'default',
                        opacity: hasChildren ? 1 : 0.2, transition: 'transform 0.2s',
                        transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)', fontSize: '10px',
                    }}>▶</div>

                <div style={{ flex: 1, minWidth: 0, cursor: 'pointer' }}
                    onClick={(e) => { e.stopPropagation(); onEdit(category); }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: 600, fontSize: '14px', color: '#212529' }}>{category.title}</span>
                        {category.section && (
                            <span style={{
                                padding: '2px 8px', backgroundColor: '#e7f1ff', color: '#0d6efd',
                                borderRadius: '4px', fontSize: '11px', fontWeight: 500
                            }}>{category.section}</span>
                        )}
                        {hasChildren && (
                            <span style={{
                                padding: '2px 8px', backgroundColor: borderColor, color: '#fff',
                                borderRadius: '4px', fontSize: '11px', fontWeight: 600
                            }}>
                                {childCount} {childCount === 1 ? 'filho' : 'filhos'}
                            </span>
                        )}
                    </div>
                </div>

                <button ref={buttonRef} onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
                    style={{
                        background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer',
                        padding: '4px 8px', borderRadius: '4px', color: '#6c757d', marginLeft: '8px'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e9ecef'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>⋮</button>
            </div>

            {/* Sempre renderizar container de filhos para permitir drops */}
            {expanded && (
                <div
                    className="category-children"
                    data-sortable-group={`children-${category.id}`}
                    data-parent-id={category.id}
                    data-parent-level={level}
                    style={{
                        borderLeft: hasChildren ? `1px dashed ${borderColor}` : 'none',
                        marginLeft: '8px',
                        minHeight: hasChildren ? 'auto' : '8px', // Área mínima para drop quando vazio
                    }}
                >
                    {children}
                </div>
            )}
            {dropdownMenu}
        </div>
    );
};
