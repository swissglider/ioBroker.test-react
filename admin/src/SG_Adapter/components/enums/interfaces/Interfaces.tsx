export interface I_EnumItem {
    id: string;
    name: string;
    orgName: any;
    icon?: string;
    color?: string;
}

export interface I_Enum {
    enumID: string;
    enumName: string;
    orgName: any;
    members: I_EnumItem[];
    icon?: string;
    color?: string;
}

export interface I_EnumCategories {
    [key: string]: I_Enum;
}

export interface I_EnumCategory {
    categoriePairName: string;
    enumCategoryID: string | undefined;
    enumCategoryName?: string;
    enumCategories?: I_EnumCategories;
    enumChildCategoryID: string;
    enumChildCategory?: I_Enum;
}

export interface I_EnumLayoutDefinition {
    categoriePairName: string;
    enumCategoryID: string | undefined;
    enumChildCategoryID: string;
}
