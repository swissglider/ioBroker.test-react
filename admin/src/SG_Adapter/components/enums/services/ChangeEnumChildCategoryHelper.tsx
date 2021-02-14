import { I_ioBrokerContextValue } from '../../../framework/interfaces/I_ioBrokerContextValue';
import { EnumHelper } from '../../../framework/utils/EnumHelper';
import { I_EnumCategory, I_EnumLayoutDefinition } from '../interfaces/Interfaces';

const changeEnumChildCategory = (
    fromEnumChildCategory: string,
    toEnumChildCategory: string,
    EnumItemID: string,
    enumCategory: I_EnumCategory,
    setStateEnumCategory: (enumCategory: I_EnumCategory) => void,
    props: {
        ioBContext: I_ioBrokerContextValue;
        enumLayoutDefinition: I_EnumLayoutDefinition;
    },
): void => {
    // dropped outside the list
    if (!toEnumChildCategory) return;

    // it is not sortable
    if (fromEnumChildCategory === toEnumChildCategory) return;

    // no longer any EnumChildCategory
    if (toEnumChildCategory === enumCategory.enumCategoryID) {
        if (!enumCategory.enumCategories) return;
        enumCategory.enumCategories[fromEnumChildCategory].members = enumCategory.enumCategories[
            fromEnumChildCategory
        ].members.filter((item) => item.id != EnumItemID);

        setStateEnumCategory(enumCategory);
        EnumHelper.getEnumByID(props.ioBContext, fromEnumChildCategory).then((_enum) => {
            if (_enum && _enum !== undefined && enumCategory.enumCategories) {
                _enum.common.members = enumCategory.enumCategories[fromEnumChildCategory].members.map(
                    (item): string => item.id,
                );
                EnumHelper.saveEnumChangesByObject(props.ioBContext, fromEnumChildCategory, _enum);
            }
        });
    }
    // if new set to a EnumChildCategory
    else if (fromEnumChildCategory === enumCategory.enumCategoryID) {
        if (!enumCategory.enumCategories || !enumCategory.enumChildCategory) return;
        const item = enumCategory.enumChildCategory.members.find((item) => item.id === EnumItemID);
        if (!(item && item !== undefined)) return;
        enumCategory.enumCategories[toEnumChildCategory].members.push(item);

        setStateEnumCategory(enumCategory);
        EnumHelper.getEnumByID(props.ioBContext, toEnumChildCategory).then((_enum) => {
            if (_enum && _enum !== undefined && enumCategory.enumCategories) {
                _enum.common.members = enumCategory.enumCategories[toEnumChildCategory].members.map(
                    (item): string => item.id,
                );
                EnumHelper.saveEnumChangesByObject(props.ioBContext, toEnumChildCategory, _enum);
            }
        });
    }
    // from one EnumChildCategory to another
    else {
        if (!enumCategory.enumCategories || !enumCategory.enumChildCategory) return;
        const item = enumCategory.enumChildCategory.members.find((item) => item.id === EnumItemID);
        if (!(item && item !== undefined)) return;
        enumCategory.enumCategories[toEnumChildCategory].members.push(item);
        enumCategory.enumCategories[fromEnumChildCategory].members = enumCategory.enumCategories[
            fromEnumChildCategory
        ].members.filter((item) => item.id != EnumItemID);

        setStateEnumCategory(enumCategory);
        EnumHelper.getEnumByID(props.ioBContext, fromEnumChildCategory).then((_enum) => {
            if (_enum && _enum !== undefined && enumCategory.enumCategories) {
                _enum.common.members = enumCategory.enumCategories[fromEnumChildCategory].members.map(
                    (item): string => item.id,
                );
                EnumHelper.saveEnumChangesByObject(props.ioBContext, fromEnumChildCategory, _enum);
            }
        });
        EnumHelper.getEnumByID(props.ioBContext, toEnumChildCategory).then((_enum) => {
            if (_enum && _enum !== undefined && enumCategory.enumCategories) {
                _enum.common.members = enumCategory.enumCategories[toEnumChildCategory].members.map(
                    (item): string => item.id,
                );
                EnumHelper.saveEnumChangesByObject(props.ioBContext, toEnumChildCategory, _enum);
            }
        });
    }
};

export const ChangeEnumChildCategoryHelper = {
    changeEnumChildCategory: changeEnumChildCategory,
};
