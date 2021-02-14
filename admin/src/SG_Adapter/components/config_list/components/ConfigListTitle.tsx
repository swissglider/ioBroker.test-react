import React from 'react';
import {
    Button,
    ButtonGroup,
    createMuiTheme,
    createStyles,
    makeStyles,
    Theme,
    ThemeProvider,
    Toolbar,
    Tooltip,
    Typography,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import CachedIcon from '@material-ui/icons/Cached';
import { I_ConfigListParams__ } from '../interfaces/I_ConfigList';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        toolbar: {},
        button: {
            margin: theme.spacing(1, 5),
        },
    }),
);

const theme = createMuiTheme();
theme.typography.h4 = {
    background: 'transparent',
    fontSize: '1.0rem',
    '@media (min-width:600px)': {
        fontSize: '1.5rem',
    },
    [theme.breakpoints.up('md')]: {
        fontSize: '1.5rem',
    },
};

export const ConfigListTitle = (props: I_ConfigListParams__): JSX.Element => {
    const classes = useStyles();
    return (
        <ThemeProvider theme={theme}>
            <Toolbar className={classes.toolbar}>
                <Typography variant="h4">{props.listTitle !== '' && props.listTitle}</Typography>
                <ButtonGroup
                    className={classes.button}
                    variant="outlined"
                    color="primary"
                    size="small"
                    aria-label="outlined primary button group"
                >
                    {props.withAddButton && (
                        <Tooltip title="Add Item" placement="top">
                            <Button startIcon={<AddIcon />} onClick={() => props.addItem()} />
                        </Tooltip>
                    )}
                    {props.withReloadButton && (
                        <Tooltip title="Reload List" placement="top">
                            <Button startIcon={<CachedIcon />} onClick={() => props.reloadList()} />
                        </Tooltip>
                    )}
                </ButtonGroup>
            </Toolbar>
        </ThemeProvider>
    );
};
