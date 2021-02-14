import React from 'react';
import i18n from '@iobroker/adapter-react/i18n';
import { createStyles, IconButton, makeStyles, Tab, Tabs, Theme, Tooltip, useMediaQuery } from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';
import { Link } from 'react-router-dom';
import pageConfiguration, { I_PageConfiguration, notInTabsList } from '../../../configs/RouterConfig';

const useStylesMainTab = makeStyles((theme: Theme) =>
    createStyles({
        tab: {
            [theme.breakpoints.down('md')]: {
                // fontSize: '1rem',
                padding: 0,
                margin: 0,
                minWidth: 150,
                width: 150,
            },
        },
    }),
);

const useStylesMainTabs = makeStyles(() =>
    createStyles({
        tabsContainer: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
    }),
);

const getTabsValue = (): any => {
    const result = '/' + location.pathname.split('/')[1];
    if (notInTabsList.includes(result)) return false;
    return result;
};

export const MainTabs = (): JSX.Element | null => {
    const classes = useStylesMainTabs();
    const classes1 = useStylesMainTab();
    if (!useMediaQuery('(min-width:600px)')) return null;

    return (
        <div className={classes.tabsContainer}>
            <IconButton component={Link} to="/home" edge="start" color="inherit" aria-label="menu">
                <HomeIcon />
            </IconButton>
            <Tabs value={getTabsValue()} variant="scrollable">
                {pageConfiguration.map(
                    (page: I_PageConfiguration, index: number) =>
                        (page.asTab === undefined || page.asTab) && (
                            <Tab
                                className={classes1.tab}
                                key={index}
                                label={
                                    <Tooltip placement="top" title={page.name}>
                                        <span>{i18n.t(page.tabName !== undefined ? page.tabName : page.name)}</span>
                                    </Tooltip>
                                }
                                value={page.path}
                                component={Link}
                                to={page.path}
                            />
                        ),
                )}
            </Tabs>
        </div>
    );
};
