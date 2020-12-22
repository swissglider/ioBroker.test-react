/**
 * the CategoryContainer holds the states, update the states
 * For this it also handles with the ioBroker backend (only the CategoryContainer)
 */

import { CircularProgress } from '@material-ui/core';
import { Box } from '@material-ui/core';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { I_IOBrokerConsumerType } from '../../../../framework/context/IOBrokerContext';
import { EnumHelper } from '../../../../framework/utils/EnumHelper';
import { I_EnumLayoutDefinition, I_EnumCategory } from '../interfaces/Interfaces';
import { ChangeEnumChildCategoryHelper } from '../services/ChangeEnumChildCategoryHelper';
import { EnumCategoryCreationHelper } from '../services/EnumCategoryCreationHelper';
import { EnumDragNDropLayout } from './EnumDragNDropLayout';

export const CategoryContainer = (props: {
    ioBContext: I_IOBrokerConsumerType;
    toBeRendered: boolean;
    enumLayoutDefinition: I_EnumLayoutDefinition;
}): JSX.Element | null => {
    if (!props.toBeRendered) return null;

    const [stateloaded, setStateLoaded] = useState(false);
    const [stateEnumCategory, setStateEnumCategory] = useState({
        categoriePairName: props.enumLayoutDefinition.categoriePairName,
        enumCategoryID: props.enumLayoutDefinition.enumCategoryID,
        enumChildCategoryID: props.enumLayoutDefinition.enumChildCategoryID,
    });

    const changeEnumChildCategory = (
        fromEnumChildCategory: string,
        toEnumChildCategory: string,
        EnumItemID: string,
        enumCategory: I_EnumCategory,
    ): void => {
        ChangeEnumChildCategoryHelper.changeEnumChildCategory(
            fromEnumChildCategory,
            toEnumChildCategory,
            EnumItemID,
            enumCategory,
            setStateEnumCategory,
            props,
        );
    };

    useEffect(() => {
        let mounted = true;

        const calculateEnumCategory = async () => {
            const enumPlainCategories = await EnumHelper.getAllSubEnums(
                props.ioBContext,
                props.enumLayoutDefinition.enumCategoryID,
            );
            const enumCategory: I_EnumCategory = stateEnumCategory;
            enumCategory.enumCategoryName = await EnumHelper.getEnumNameByIDByLanguage(
                props.ioBContext,
                props.enumLayoutDefinition.enumCategoryID,
            );
            enumCategory.enumChildCategory = await EnumCategoryCreationHelper.createEnumChildCategoryWithId(
                props.ioBContext,
                props.enumLayoutDefinition.enumChildCategoryID,
            );
            enumCategory.enumCategories = await EnumCategoryCreationHelper.createEnumCategories(
                props.ioBContext,
                enumPlainCategories,
            );

            if (mounted) {
                console.log(enumCategory);
                setStateEnumCategory(enumCategory);
                setStateLoaded(true);
            }
        };
        calculateEnumCategory();

        return () => {
            mounted = false;
        };
    }, []);

    return (
        <>
            {!stateloaded ? (
                <Box alignSelf="center" alignItems="center" justifyContent="center">
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    {/* <div>{props.enumLayoutDefinition.categoriePairName}</div> */}
                    <EnumDragNDropLayout
                        enumCategory={stateEnumCategory}
                        changeEnumChildCategory={changeEnumChildCategory}
                    />
                </>
            )}
        </>
    );
};
