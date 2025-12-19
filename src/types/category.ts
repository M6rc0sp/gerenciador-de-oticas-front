export interface Category {
    id: string;
    title: string;
    section: string;
    section_label?: string;
    id_slug?: string;
    description?: string;
    icon?: string;
    brand?: string;
    help?: string;
    next?: string;
    parent?: string | null;
    product?: Record<string, any>;
    children?: Category[];
    created_at?: string;
    updated_at?: string;
}

export interface CreateCategoryInput {
    title: string;
    section: string;
    description?: string;
    icon?: string;
    brand?: string;
    help?: string;
    next?: string;
    parent?: string | null;
    product?: Record<string, any>;
}

export interface UpdateCategoryInput extends Partial<CreateCategoryInput> { }
