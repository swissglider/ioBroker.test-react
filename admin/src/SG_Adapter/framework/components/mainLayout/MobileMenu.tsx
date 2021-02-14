import i18n from '@iobroker/adapter-react/i18n';
import {
    AppBar,
    Collapse,
    createStyles,
    Divider,
    IconButton,
    Link,
    List,
    ListItem,
    ListItemText,
    makeStyles,
    MuiThemeProvider,
    Theme,
    Toolbar,
    Tooltip,
} from '@material-ui/core';
import { Link as MLink } from 'react-router-dom';
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';
import IconExpandLess from '@material-ui/icons/ExpandLess';
import IconExpandMore from '@material-ui/icons/ExpandMore';
import React, { useEffect, useState } from 'react';
import pageConfiguration, { I_PageConfiguration } from '../../../configs/RouterConfig';
import theme from '@iobroker/adapter-react/Theme';
import { I_ioBrokerContextValue } from '../../interfaces/I_ioBrokerContextValue';

const drawerWidth = 240;

const useStylesMobileMenuProps = makeStyles((theme: Theme) =>
    createStyles({
        menuItem: {
            width: drawerWidth,
            paddingLeft: 0,
        },
        menuItemIcon: {
            // color: '#97c05c',
            opacity: '30%',
            paddingRight: 0,
        },
        menuItemText: (props: { inset: boolean; level: number; fontSize: string }) => ({
            // color: '#97c05c',
            // opacity: '30%',
            color: theme.palette.secondary.dark,
            paddingLeft: (props.inset ? 0 : 49) + props.level * 20,
            '& span, & svg': {
                fontSize: props.fontSize,
            },
        }),
    }),
);

export interface MobileMenuProps {
    toggleDrawer: (event: any, open: boolean) => void;
    ioBContext: I_ioBrokerContextValue;
}

// <ListItem button key={route.id} component={Link} to={route.path}>

const themeName = window.localStorage ? window.localStorage.getItem('App.theme') || 'light' : 'light';

const MMenuITem = (props: {
    page: I_PageConfiguration;
    level?: number;
    parentPath?: string;
    closeToggle: (e: any) => void;
}): JSX.Element => {
    const [open, setOpen] = useState<boolean>(false);

    const level = props.level === undefined ? 0 : props.level;
    const hasSubPages = props.page.subPages !== undefined && props.page.subPages.length > 0;
    const asTab = props.page.asTab === undefined ? true : props.page.asTab;
    const name = props.page.tabName !== undefined ? props.page.tabName : props.page.name;
    const fontSize = (100 - level * 15).toString() + '%';

    const classes = useStylesMobileMenuProps({ inset: hasSubPages, level: level, fontSize: fontSize });

    const listItemProps =
        props.page.path !== undefined
            ? {
                  component: MLink,
                  to: props.parentPath ? props.parentPath + props.page.path : props.page.path,
                  onClick: props.closeToggle,
              }
            : {};

    return (
        <>
            {asTab && (
                <>
                    <ListItem className={classes.menuItem} dense>
                        {hasSubPages && (
                            <IconButton onClick={() => setOpen(!open)}>
                                {open ? <IconExpandLess /> : <IconExpandMore />}
                            </IconButton>
                        )}
                        <Tooltip title={props.page.name} aria-label={props.page.name}>
                            <Link {...listItemProps}>
                                <ListItemText primary={i18n.t(name)} className={classes.menuItemText} />
                            </Link>
                            {/* )} */}
                        </Tooltip>
                    </ListItem>
                    {hasSubPages && (
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            <Divider />
                            {props.page.subPages !== undefined &&
                                props.page.subPages.map((page: I_PageConfiguration, index: number) => (
                                    <MMenuITem
                                        key={index}
                                        page={page}
                                        level={level + 1}
                                        parentPath={
                                            props.parentPath ? props.parentPath + props.page.path : props.page.path
                                        }
                                        closeToggle={props.closeToggle}
                                    />
                                ))}
                        </Collapse>
                    )}
                </>
            )}
        </>
    );
};

const useStylesMobileMenu = makeStyles((theme: Theme) =>
    createStyles({
        menuButton: {
            marginRight: theme.spacing(2),
        },
        appMenu: {
            width: '100%',
        },
    }),
);

export const MobileMenu = (props: MobileMenuProps): JSX.Element => {
    const [selectedTheme, setSelectedTheme] = useState(theme(themeName));
    const classes = useStylesMobileMenu();

    useEffect(() => {
        if (props.ioBContext.ioBrokerConfig?.genericApp.state.theme !== undefined) {
            setSelectedTheme(props.ioBContext.ioBrokerConfig.genericApp.state.theme);
        }
    }, [props.ioBContext]);

    return (
        <MuiThemeProvider theme={selectedTheme}>
            <div>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton
                            onClick={(e) => props.toggleDrawer(e, false)}
                            className={classes.menuButton}
                            color="inherit"
                        >
                            <CloseOutlinedIcon />
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <List component="nav" className={classes.appMenu} disablePadding>
                    {pageConfiguration.map((page: I_PageConfiguration, index: number) => (
                        <MMenuITem key={index} page={page} closeToggle={(e: any) => props.toggleDrawer(e, false)} />
                    ))}
                </List>
            </div>
        </MuiThemeProvider>
    );
};
