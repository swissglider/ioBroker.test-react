import { AppBar, createStyles, makeStyles, Theme } from '@material-ui/core';
import React from 'react';
import { TitelBarOnContext } from '../../context/TitelBarOnContext';
import { MainTabs } from './MainTabs';
import { TitelBar } from './TitelBar';

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

export const MainHeader = (): JSX.Element => {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <AppBar position="static" className={classes.appbar}>
                <TitelBarOnContext.Consumer>
                    {({ titelBarOn }) => <>{titelBarOn && <TitelBar />}</>}
                </TitelBarOnContext.Consumer>
                <MainTabs />
            </AppBar>
        </div>
    );
};
