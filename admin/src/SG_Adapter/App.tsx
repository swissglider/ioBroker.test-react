import React, { ReactNode, useState } from 'react';
import { Theme } from '@material-ui/core/styles';
import { createStyles, FormControlLabel, IconButton, makeStyles, StyleRules, withStyles } from '@material-ui/core';
import theme from '@iobroker/adapter-react/Theme';

import GenericApp from '@iobroker/adapter-react/GenericApp';
import Loader from '@iobroker/adapter-react/Components/Loader';
import { GenericAppProps, GenericAppSettings } from '@iobroker/adapter-react/types';
import { I_ioBrokerConfig } from './framework/interfaces/I_ioBrokerConfig';
import { MainLayout } from './framework/components/MainLayout';
import { IOBrokerContextProvider } from './framework/context/IOBrokerContext';
import { MuiThemeProvider } from '@material-ui/core';
import Switch from '@material-ui/core/Switch';
import SettingsIcon from '@material-ui/icons/Settings';

const styles = (_theme: Theme): StyleRules => ({
    root: {},
});

interface I_appProps {
    ioBrokerConfig: I_ioBrokerConfig;
    children: any;
    superRender: () => void;
    themeType: string;
    [key: string]: any;
}

export const App_ = (props: I_appProps): JSX.Element => {
    const [systemConfigUpToDate, setSystemConfigUpToDate] = useState<boolean>(false);
    const systemConfigChanged = (systemConfig: ioBroker.Object): void => {
        if (systemConfig) {
            setSystemConfigUpToDate(true);
            return;
        }
        setSystemConfigUpToDate(false);
    };

    return (
        <>
            <IOBrokerContextProvider configChanged={systemConfigChanged} {...props}>
                {!systemConfigUpToDate ? <Loader theme={props.themeType} /> : <MainLayout />}
            </IOBrokerContextProvider>
            {props.children}
        </>
    );
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
class AppWithIOBConnection extends GenericApp {
    private ioBrokerConfig: I_ioBrokerConfig;
    constructor(props: GenericAppProps) {
        // console.log(props);
        const extendedProps: GenericAppSettings = {
            ...props,
            encryptedFields: [],
            adapterName: 'test-react',
            socket: { host: '192.168.90.1' },
            bottomButtons: true,
            translations: {
                en: require('../i18n/en.json'),
                de: require('../i18n/de.json'),
                //     ru: require('../i18n/ru.json'),
                //     pt: require('../i18n/pt.json'),
                //     nl: require('../i18n/nl.json'),
                //     fr: require('../i18n/fr.json'),
                //     it: require('../i18n/it.json'),
                //     es: require('../i18n/es.json'),
                //     pl: require('../i18n/pl.json'),
                //     'zh-cn': require('../i18n/zh-cn.json'),
            },
        };
        super(props, extendedProps);
        this.ioBrokerConfig = {
            configuration: {
                instance: this.instance,
                adapterName: this.adapterName,
                instanceId: this.instanceId,
                savedNative: this.savedNative,
                encryptedFields: this.encryptedFields,
                socket: this.socket,
                _secret: this._secret,
                common: this.common,
            },
            parameter: this.state.native,
            genericApp: this,
        };
    }

    componentDidMount(): void {
        return;
    }

    onConnectionReady(): void {
        // executed when connection is ready
    }

    superRender(): ReactNode {
        return <Loader theme={this.state.themeType} />;
    }

    render(): JSX.Element | React.ReactNode {
        if (!this.state.loaded || !this.state.connected) {
            return super.render();
        }
        const themeName = window.localStorage ? window.localStorage.getItem('App.theme') || 'light' : 'light';
        this.ioBrokerConfig = {
            configuration: {
                instance: this.instance,
                adapterName: this.adapterName,
                instanceId: this.instanceId,
                savedNative: this.savedNative,
                encryptedFields: this.encryptedFields,
                socket: this.socket,
                _secret: this._secret,
                common: this.common,
            },
            parameter: this.state.native,
            genericApp: this,
        };
        return (
            <MuiThemeProvider theme={theme(themeName)}>
                <App_
                    ioBrokerConfig={this.ioBrokerConfig}
                    superRender={this.superRender}
                    {...super.props}
                    {...this.state}
                >
                    {this.renderSaveCloseButtons()}
                    {this.renderError()}
                    {this.renderToast()}
                </App_>
            </MuiThemeProvider>
        );
    }
}

const AppWithoutIOBConnection = (): JSX.Element => {
    const themeName = window.localStorage ? window.localStorage.getItem('App.theme') || 'light' : 'light';
    return (
        <MuiThemeProvider theme={theme(themeName)}>
            <MainLayout />
        </MuiThemeProvider>
    );
};

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            // '& > *': {
            '&': {
                zIndex: 1300,
                margin: theme.spacing(0),
                position: 'absolute',
                top: theme.spacing(0),
                right: theme.spacing(0),
                opacity: '0%',
            },
            '&:hover': {
                zIndex: 1300,
                opacity: '50%',
            },
        },
    }),
);

const App = (): JSX.Element => {
    const classes = useStyles();
    const [withIOBConnection, setWithIOBConnection] = useState<boolean>(true);
    const [hiddeSwitch, setHiddeSwitch] = useState<boolean>(true);
    return (
        <>
            <div className={classes.root}>
                <IconButton size="small" onClick={() => setHiddeSwitch(!hiddeSwitch)}>
                    <SettingsIcon fontSize="inherit" />
                </IconButton>
            </div>
            <span hidden={hiddeSwitch}>
                <FormControlLabel
                    style={{ paddingLeft: 20 }}
                    control={
                        <Switch
                            checked={withIOBConnection}
                            onChange={(event) => setWithIOBConnection(event.target.checked)}
                            name="iob"
                        />
                    }
                    label="With ioBroker Connection"
                />
            </span>
            {withIOBConnection ? <AppWithIOBConnection /> : <AppWithoutIOBConnection />}
        </>
    );
};

export const SG_Adapter = withStyles(styles)(App);
