import React from 'react';
import {
    Breadcrumbs,
    createMuiTheme,
    createStyles,
    Link as MLink,
    makeStyles,
    Theme,
    ThemeProvider,
    Typography,
} from '@material-ui/core';
import I18n from '@iobroker/adapter-react/i18n';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        Breadcrumbs: {
            height: theme.spacing(3),
            margin: theme.spacing(1, 0, 0.5),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
    }),
);

const theme = createMuiTheme();
theme.typography.h6 = {
    fontSize: '0.8rem',
    '@media (min-width:600px)': {
        fontSize: '1.5rem',
    },
    [theme.breakpoints.up('md')]: {
        fontSize: '1.5rem',
    },
};

export const SubTitle = (props: { titles: { name: string; link: string }[] }): JSX.Element => {
    const classes = useStyles();
    return (
        <div className={classes.Breadcrumbs}>
            <Breadcrumbs aria-label="breadcrumb">
                {props.titles.map((e, index) => (
                    <MLink key={index} color="inherit" component={Link} to={e.link}>
                        <ThemeProvider theme={theme}>
                            <Typography variant="h6" align="center" color="textSecondary">
                                {I18n.t(e.name)}
                            </Typography>
                        </ThemeProvider>
                    </MLink>
                ))}
            </Breadcrumbs>
        </div>
    );
};
