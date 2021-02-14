import { Box, IconButton, styled } from '@material-ui/core';
import React from 'react';
import { I_EnumItem } from '../interfaces/Interfaces';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { ItemAvatar } from './ItemAvatar';
import { fade } from '@material-ui/core/styles/colorManipulator';

const InnerBox = styled(Box)({
    border: 0,
    borderRadius: 5,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .1)',
    padding: '7px 7px',
    margin: '7px',
    height: 32,
});

export const EnumDnDItem = (props: {
    provided: any;
    snapshot: any;
    item: I_EnumItem;
    handleEdit: (item: I_EnumItem) => void;
    handleRemove: (item: I_EnumItem) => void;
}): JSX.Element => {
    const [bgcolor, color] =
        'color' in props.item && props.item.color && props.item.color !== undefined
            ? [props.item.color, 'black']
            : ['#ffbf81', 'black'];
    return (
        <InnerBox
            ref={props.provided.innerRef}
            {...props.provided.draggableProps}
            {...props.provided.dragHandleProps}
            color={color}
            bgcolor={fade(bgcolor, 0.7)}
            display="flex"
            alignItems="center"
            p={1}
            m={1}
        >
            <Box p={1}>
                <ItemAvatar icon={props.item.icon} />
            </Box>
            <Box p={1} flexGrow={1}>
                {props.item.name}
            </Box>
            <Box p={1}>
                <IconButton onClick={() => props.handleEdit(props.item)}>
                    <EditIcon fontSize="small" />
                </IconButton>
                <IconButton onClick={() => props.handleRemove(props.item)}>
                    <DeleteIcon fontSize="small" />
                </IconButton>
            </Box>
        </InnerBox>
    );
};
