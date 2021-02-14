/**
 * the CategoryContainer holds the states, update the states
 * For this it also handles with the ioBroker backend (only the CategoryContainer)
 */

import { Box, makeStyles } from '@material-ui/core';
import { yellow } from '@material-ui/core/colors';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { I_ioBrokerContextValue } from '../../../framework/interfaces/I_ioBrokerContextValue';
import { EnumHelper } from '../../../framework/utils/EnumHelper';
import { ObjectStateHelper } from '../../../framework/utils/ObjectStateHelper';
import { I_EnumLayoutDefinition, I_EnumCategory, I_Enum, I_EnumItem } from '../interfaces/Interfaces';
import { ChangeEnumChildCategoryHelper } from '../services/ChangeEnumChildCategoryHelper';
import { EnumCategoryCreationHelper } from '../services/EnumCategoryCreationHelper';
import { SaveEnumItemHelper } from '../services/SaveEnumItemHelper';
import { EnumDialogs, I_EditEnumDialogProps } from './EnumDialogs';
import { EnumDragNDropLayout } from './EnumDragNDropLayout';
import { EnumDragNDropLayoutSkeleton } from './EnumDragNDropLayoutSkeleton';

const getDefaultEditEnumDialogProps = (ioBContext: I_ioBrokerContextValue): I_EditEnumDialogProps => {
    return {
        open: false,
        item: { id: '', name: '', orgName: '', icon: '', color: '' },
        parentID: '',
        onClose: (item: I_EnumItem) => {
            item;
        },
        onCancel: () => {
            return;
        },
        ioBContext: ioBContext,
    };
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const useStyles = makeStyles({
    pre: {
        background: yellow[50],
        display: 'block',
        padding: '10px 30px',
        margin: '0',
        'word-wrap': 'break-word',
        'white-space': 'pre-wrap',
    },
    code: {
        display: 'flex',
        'justify-content': 'center',
        'align-items': 'center',
    },
});

export interface CategoryContainerProps {
    ioBContext: I_ioBrokerContextValue;
    enumLayoutDefinition: I_EnumLayoutDefinition;
}

const CategoryContainer_ = (props: CategoryContainerProps): JSX.Element => {
    const [stateloaded, setStateLoaded] = useState(false);
    const [editDialogState, setEditDialogState] = useState(getDefaultEditEnumDialogProps(props.ioBContext));
    const [stateEnumCategory, setStateEnumCategory] = useState<I_EnumLayoutDefinition>(props.enumLayoutDefinition);
    const [lastUpdate, setLastUpdate] = useState<number>(Date.now());
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const classes = useStyles();

    const changeEnumChildCategory = (
        fromEnumChildCategory: string,
        toEnumChildCategory: string,
        EnumItemID: string,
        enumCategory: I_EnumCategory,
    ): void => {
        console.log(fromEnumChildCategory, toEnumChildCategory);
        ChangeEnumChildCategoryHelper.changeEnumChildCategory(
            fromEnumChildCategory,
            toEnumChildCategory,
            EnumItemID,
            enumCategory,
            setStateEnumCategory,
            props,
        );
    };

    const onCloseEditDialog = async (item: I_EnumItem): Promise<void> => {
        try {
            await SaveEnumItemHelper.updateEnumByItem(props.ioBContext, item);
        } catch (e) {
            console.log(e);
        }
        setEditDialogState(getDefaultEditEnumDialogProps(props.ioBContext));
        setLastUpdate(Date.now());
    };

    const onCanceledEditDialog = (): void => {
        setEditDialogState(getDefaultEditEnumDialogProps(props.ioBContext));
    };

    const handleEdit = (item: I_EnumItem): void => {
        setEditDialogState({
            open: true,
            item: item,
            parentID: item.id.substring(0, item.id.lastIndexOf('.')),
            onClose: onCloseEditDialog,
            onCancel: onCanceledEditDialog,
            ioBContext: props.ioBContext,
        });
    };

    const handleRemove = async (e: I_EnumItem): Promise<void> => {
        if (await ObjectStateHelper.isIDExisting(props.ioBContext, e.id)) {
            await EnumHelper.deleteObject(props.ioBContext, e.id);
            setEditDialogState(getDefaultEditEnumDialogProps(props.ioBContext));
            setLastUpdate(Date.now());
        }
    };

    const handleAddChildCategory = (childCategory: I_Enum): void => {
        setEditDialogState({
            open: true,
            item: undefined,
            parentID: childCategory.enumID,
            onClose: onCloseEditDialog,
            onCancel: onCanceledEditDialog,
            ioBContext: props.ioBContext,
        });
    };

    const calculateEnumCategory = async (newCat: I_EnumCategory) => {
        const enumCategory: I_EnumCategory = newCat;
        if (enumCategory.enumCategoryID !== undefined && props.enumLayoutDefinition.enumCategoryID !== undefined) {
            const enumPlainCategories = await EnumHelper.getAllSubEnums(
                props.ioBContext,
                props.enumLayoutDefinition.enumCategoryID,
            );
            enumCategory.enumCategoryName = await EnumHelper.getEnumNameByIDByLanguage(
                props.ioBContext,
                props.enumLayoutDefinition.enumCategoryID,
            );
            enumCategory.enumCategories = await EnumCategoryCreationHelper.createEnumCategories(
                props.ioBContext,
                enumPlainCategories,
            );
        }
        enumCategory.enumChildCategory = await EnumCategoryCreationHelper.createEnumChildCategoryWithId(
            props.ioBContext,
            props.enumLayoutDefinition.enumChildCategoryID,
        );
        setStateEnumCategory(enumCategory);
        setStateLoaded(true);
    };

    useEffect(() => {
        calculateEnumCategory(props.enumLayoutDefinition);
    }, [props]);

    useEffect(() => {
        if (stateloaded) {
            setStateLoaded(false);
            // calculateEnumCategory(stateEnumCategory);
        }
    }, [lastUpdate]);

    return (
        <>
            {!stateloaded ? (
                <Box alignSelf="center" alignItems="center" justifyContent="center">
                    <EnumDragNDropLayoutSkeleton />
                </Box>
            ) : (
                <EnumDragNDropLayout
                    enumCategory={stateEnumCategory}
                    changeEnumChildCategory={changeEnumChildCategory}
                    handleEdit={handleEdit}
                    handleRemove={handleRemove}
                    handleAddChildCategory={handleAddChildCategory}
                />
            )}
            {/* <div className={classes.code}>
                <pre className={classes.pre}>{JSON.stringify(stateEnumCategory, null, 4)}</pre>
            </div> */}
            <EnumDialogs.EditEnumDialog {...editDialogState} />
        </>
    );
};

const checkifEqual = (p: CategoryContainerProps, n: CategoryContainerProps): boolean => {
    return p.enumLayoutDefinition.categoriePairName === n.enumLayoutDefinition.categoriePairName;
};

// export const CategoryContainer = CategoryContainer_;
export const CategoryContainer = React.memo(CategoryContainer_, checkifEqual);
