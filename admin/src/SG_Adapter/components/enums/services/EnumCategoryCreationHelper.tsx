import { I_ioBrokerContextValue } from '../../../framework/interfaces/I_ioBrokerContextValue';
import { EnumHelper } from '../../../framework/utils/EnumHelper';
import { ObjectStateHelper } from '../../../framework/utils/ObjectStateHelper';
import { I_Enum, I_EnumCategories, I_EnumItem } from '../interfaces/Interfaces';

const createEnumItemFromMembers = async (
    ioBContext: I_ioBrokerContextValue,
    members: string[],
): Promise<I_EnumItem[]> => {
    const newMembers: I_EnumItem[] = [];
    for (const id of members) {
        const obj = await ObjectStateHelper.getObjectByID(ioBContext, id);
        if (obj && obj !== undefined) {
            const newItem: I_EnumItem = {
                id: id,
                name: EnumHelper.getEnumNameByObjectByLanguage(ioBContext, obj),
                orgName: obj.common.name,
            };
            if ('color' in obj.common && obj.common.color !== undefined && obj.common.color !== '') {
                newItem.color = obj.common.color;
            }
            if ('icon' in obj.common && obj.common.icon !== undefined && obj.common.icon !== '') {
                newItem.icon = obj.common.icon;
            }
            newMembers.push(newItem);
        } else {
            newMembers.push({ id: id, name: id, orgName: id });
        }
    }
    return newMembers;
};

const createEnumItemFromSub = async (ioBContext: I_ioBrokerContextValue, parentID: string): Promise<I_EnumItem[]> => {
    const newMembers: I_EnumItem[] = [];
    const enumChilds = await EnumHelper.getAllSubEnums(ioBContext, parentID);
    if (enumChilds === null || enumChilds === undefined) return newMembers;

    for (const [childID, childValue] of Object.entries(enumChilds)) {
        if (childValue && childValue !== undefined) {
            const newItem: I_EnumItem = {
                id: childID,
                name: EnumHelper.getEnumNameByObjectByLanguage(ioBContext, childValue),
                orgName: childValue.common.name,
            };
            if (
                'color' in childValue.common &&
                childValue.common.color !== undefined &&
                childValue.common.color !== ''
            ) {
                newItem.color = childValue.common.color;
            }
            if ('icon' in childValue.common && childValue.common.icon !== undefined && childValue.common.icon !== '') {
                newItem.icon = childValue.common.icon;
            }
            newMembers.push(newItem);
        } else {
            newMembers.push({ id: childID, name: childID, orgName: childID });
        }
    }
    return newMembers;
};

const createEnumCategoryWithObject = async (
    ioBContext: I_ioBrokerContextValue,
    enumCategoryObject: ioBroker.Object,
    childOrSubEnums = 'sub',
): Promise<I_Enum> => {
    const eCs: I_Enum = {
        enumID: enumCategoryObject._id,
        enumName: EnumHelper.getEnumNameByObjectByLanguage(ioBContext, enumCategoryObject),
        orgName: enumCategoryObject.common.name,
        members:
            childOrSubEnums === 'sub'
                ? enumCategoryObject.common.members && enumCategoryObject.common.members !== undefined
                    ? await createEnumItemFromMembers(ioBContext, enumCategoryObject.common.members)
                    : []
                : await createEnumItemFromSub(ioBContext, enumCategoryObject._id),
    };
    if (
        'color' in enumCategoryObject.common &&
        enumCategoryObject.common.color !== undefined &&
        enumCategoryObject.common.color !== ''
    ) {
        eCs.color = enumCategoryObject.common.color;
    }
    if (
        'icon' in enumCategoryObject.common &&
        enumCategoryObject.common.icon !== undefined &&
        enumCategoryObject.common.icon !== ''
    ) {
        eCs.icon = enumCategoryObject.common.icon;
    }
    return eCs;
};

const createEnumCategories = async (
    ioBContext: I_ioBrokerContextValue,
    enumPlainCategories: Record<string, ioBroker.Object>,
): Promise<I_EnumCategories> => {
    const enumCategories: { [key: string]: I_Enum } = {};
    for (const [enumCategoryID, enumCategoryObject] of Object.entries(enumPlainCategories)) {
        enumCategories[enumCategoryID] = await createEnumCategoryWithObject(ioBContext, enumCategoryObject);
    }
    return enumCategories;
};

const createEnumChildCategoryWithId = async (ioBContext: I_ioBrokerContextValue, id: string): Promise<I_Enum> => {
    const obj = await ObjectStateHelper.getObjectByID(ioBContext, id);
    if (!(obj && obj !== undefined)) throw Error('Wrong enum id');
    return createEnumCategoryWithObject(ioBContext, obj, 'child');
};

export const EnumCategoryCreationHelper = {
    createEnumCategories: createEnumCategories,
    createEnumChildCategoryWithId: createEnumChildCategoryWithId,
};
