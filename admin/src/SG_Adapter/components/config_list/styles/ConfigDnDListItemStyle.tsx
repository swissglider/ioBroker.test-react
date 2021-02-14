import { makeStyles, Theme, createStyles } from '@material-ui/core';
import { pink, blueGrey, green, deepOrange } from '@material-ui/core/colors';
import {
    I_ConfigDnDListItemTextStyleProps,
    newItemString,
    prefixTitelItem,
    prefixCommentItem,
} from '../interfaces/I_ConfigDnDListItem';

export const ConfigDnDListItemStyle = makeStyles(() =>
    createStyles({
        listItem: {
            padding: 2,
            margin: 0,
        },
    }),
);

export const ConfigDnDListItemTextStyle = makeStyles((theme: Theme) =>
    createStyles({
        paper: (props: I_ConfigDnDListItemTextStyleProps) => ({
            padding: '1px 4px',
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            backgroundColor:
                props.isDragging && props.draggibleItemOtherColor
                    ? pink[800]
                    : props.name.startsWith(prefixTitelItem)
                    ? blueGrey[400]
                    : props.name.startsWith(prefixCommentItem)
                    ? green[50]
                    : props.name === newItemString
                    ? deepOrange[100]
                    : '',
        }),
        input: (props: I_ConfigDnDListItemTextStyleProps) => ({
            marginLeft: theme.spacing(1),
            flex: 1,
            color: props.name.startsWith(prefixTitelItem)
                ? blueGrey[50]
                : props.name.startsWith(prefixCommentItem)
                ? green[900]
                : '',
        }),
        iconButton: (props: I_ConfigDnDListItemTextStyleProps) => ({
            padding: 1,
            backgroundColor: props.isDragging
                ? 'primary'
                : props.name.startsWith(prefixTitelItem)
                ? 'secondary'
                : props.name.startsWith(prefixCommentItem)
                ? 'primary'
                : 'primary',
        }),
        listItemText: {
            padding: 0,
            margin: 0,
        },
        divider: {
            height: 28,
            margin: 1,
        },
    }),
);
