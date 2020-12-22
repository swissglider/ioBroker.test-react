import { CardHeader, IconButton, styled, Tooltip } from '@material-ui/core';
import React from 'react';
import { I_Enum } from '../interfaces/Interfaces';
import { ItemAvatar } from './ItemAvatar';
import AddIcon from '@material-ui/icons/Add';

const _EnumCardHeader = styled(CardHeader)({
    background: (props: { bgcolor }) =>
        'bgcolor' in props && props.bgcolor && props.bgcolor !== undefined
            ? props.bgcolor
            : 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    border: 0,
    borderRadius: 5,
    // boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'white',
    height: 40,
    padding: '0 15px',
});

export const EnumCardHeader = (props: {
    enumChildCCategory: I_Enum;
    handleAddChildCategory: ((item: I_Enum) => void) | null | undefined;
}): JSX.Element => {
    let action: JSX.Element | undefined = undefined;
    if (props.handleAddChildCategory && props.handleAddChildCategory !== undefined) {
        const handleAddChildCategory = props.handleAddChildCategory;
        action = (
            <IconButton aria-label="settings">
                <Tooltip title={`Add new ${props.enumChildCCategory.enumName}`}>
                    <AddIcon onClick={() => handleAddChildCategory(props.enumChildCCategory)} />
                </Tooltip>
            </IconButton>
        );
    }

    return (
        <_EnumCardHeader
            title={props.enumChildCCategory.enumName}
            bgcolor={props.enumChildCCategory.color}
            avatar={<ItemAvatar icon={props.enumChildCCategory.icon} />}
            action={action}
        />
    );
};
