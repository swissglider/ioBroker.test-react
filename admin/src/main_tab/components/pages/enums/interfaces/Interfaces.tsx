export interface I_EnumItem {
    id: string;
    name: string;
    icon?: string;
    color?: string;
}

export interface I_Enum {
    enumID: string;
    enumName: string;
    members: I_EnumItem[];
    icon?: string;
    color?: string;
}

export interface I_EnumCategories {
    [key: string]: I_Enum;
}

export interface I_EnumCategory {
    categoriePairName: string;
    enumCategoryID: string;
    enumCategoryName?: string;
    enumChildCategoryID: string;
    enumChildCategory?: I_Enum;
    enumCategories?: I_EnumCategories;
}

export interface I_EnumLayoutDefinition {
    categoriePairName: string;
    enumCategoryID: string;
    enumChildCategoryID: string;
}

export interface I_EnumLayoutDefinitions {
    [key: string]: I_EnumLayoutDefinition;
}
