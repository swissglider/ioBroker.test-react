import { makeStyles, createStyles } from '@material-ui/core';
import { blue } from '@material-ui/core/colors';
import { I_ConfigDnDListStyleProps } from '../interfaces/I_ConfigDnDList';

export const ConfigDnDListStyle = makeStyles(() =>
    createStyles({
        list: (props: I_ConfigDnDListStyleProps) => ({
            paddingLeft: 5,
            paddingRight: 12,
            paddingTop: 8,
            paddingButtom: 20,
            margin: 0,
            border: 0,
            borderRadius: 5,
            background:
                props.withBackgroundColor !== undefined && props.withBackgroundColor === false
                    ? ''
                    : props.isDraggingOver &&
                      (props.droppableItemOtherColor === undefined || props.droppableItemOtherColor === true)
                    ? blue[200]
                    : props.backgroundColor !== undefined
                    ? props.backgroundColor
                    : blue[100],
        }),
    }),
);
