import {
    createStyles,
    IconButton,
    makeStyles,
    SwipeableDrawer,
    Theme,
    Toolbar,
    useMediaQuery,
    Avatar,
    Typography,
    ThemeProvider,
    createMuiTheme,
} from '@material-ui/core';
import React from 'react';
import MenuIcon from '@material-ui/icons/MoreVert';
import i18n from '@iobroker/adapter-react/i18n';
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';
import { IOBrokerContext } from '../../context/IOBrokerContext';
import { MobileMenu } from './MobileMenu';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        toolbar: {},
        menuButton: {
            marginRight: theme.spacing(0),
        },
        title: {
            flexGrow: 1,
            marginLeft: theme.spacing(2),
            '@media (min-width:600px)': {
                marginLeft: theme.spacing(4),
            },
        },
        drawerPaper: {
            width: '100%',
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

export const TitelBar = (): JSX.Element => {
    const [openMenuState, setOpenMenuState] = React.useState<boolean>(false);
    const classes = useStyles();
    const matches = useMediaQuery('(min-width:600px)');

    const toggleDrawer = (event: any, open: boolean) => {
        if (
            event &&
            event.type === 'keydown' &&
            ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
        ) {
            return;
        }
        setOpenMenuState(open);
    };

    return (
        <IOBrokerContext.Consumer>
            {(ioBContext) => (
                <ThemeProvider theme={theme}>
                    <Toolbar className={classes.toolbar}>
                        {!matches && (
                            <>
                                <IconButton
                                    edge="start"
                                    className={classes.menuButton}
                                    color="inherit"
                                    aria-label="menu"
                                    onClick={(e) => toggleDrawer(e, true)}
                                >
                                    <MenuIcon />
                                </IconButton>
                                <SwipeableDrawer
                                    anchor={'left'}
                                    open={openMenuState}
                                    onClose={(e) => toggleDrawer(e, true)}
                                    onOpen={(e) => toggleDrawer(e, true)}
                                    classes={{
                                        paper: classes.drawerPaper,
                                    }}
                                >
                                    <MobileMenu toggleDrawer={toggleDrawer} ioBContext={ioBContext} />
                                </SwipeableDrawer>
                            </>
                        )}
                        <IconButton edge="start" component={Link} to="/home">
                            <Avatar src={ioBContext.icon} />
                        </IconButton>
                        <Typography variant="h4" className={classes.title}>
                            {i18n.t('adapter')} : {ioBContext.title}
                        </Typography>
                        <IconButton color="inherit">
                            <NotificationsNoneIcon />
                        </IconButton>
                    </Toolbar>
                </ThemeProvider>
            )}
        </IOBrokerContext.Consumer>
    );
};
