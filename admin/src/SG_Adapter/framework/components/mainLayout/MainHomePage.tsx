import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core';
import { RouteGeneratorProps } from './interfaces/RouterInterfaces';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
            [theme.breakpoints.up('sm')]: {
                padding: '5px 10px 0',
            },
        },
        appbar: {
            [theme.breakpoints.up('sm')]: {
                borderRadius: '20px',
            },
        },
    }),
);

export const MainHomePage = (props: RouteGeneratorProps): JSX.Element => {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <pre>{JSON.stringify(props, null, 4)}</pre>
        </div>
    );
};
