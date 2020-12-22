import React from 'react';
import { Theme, withStyles } from '@material-ui/core/styles';
import { css } from 'styled-components';

import GenericApp from '@iobroker/adapter-react/GenericApp';
import { GenericAppProps, GenericAppSettings } from '@iobroker/adapter-react/types';
import { StyleRules } from '@material-ui/core/styles';

import { BrowserRouter as Router } from 'react-router-dom';
import { Grommet, ThemeType } from 'grommet';

import { GlobalErrorBoundary } from './framework/components/error_boundary';
import { RouterSG } from './framework/components';
import { IOBrokerContextProvider, I_ioBrokerConfig } from './framework/context/IOBrokerContext';
import { DebugMode, DebugModeProvider } from './framework/context/DebugModeContext';
import { NotificationProvider } from './framework/context/NotificationContext';

const styles = (_theme: Theme): StyleRules => ({
    root: {},
});

const theme: ThemeType = {
    global: {
        colors: {
            brand: '#228BE6',
        },
        font: {
            family: 'Roboto',
            size: '18px',
            height: '20px',
        },
    },
    textInput: {
        extend: (pops) => css`
            text-align: right;
        `,
    },
};

class App extends GenericApp {
    private ioBrokerConfig: I_ioBrokerConfig;

    constructor(props: GenericAppProps) {
        const extendedProps: GenericAppSettings = {
            ...props,
            encryptedFields: [],
            translations: {
                en: require('../i18n/en.json'),
                de: require('../i18n/de.json'),
                ru: require('../i18n/ru.json'),
                pt: require('../i18n/pt.json'),
                nl: require('../i18n/nl.json'),
                fr: require('../i18n/fr.json'),
                it: require('../i18n/it.json'),
                es: require('../i18n/es.json'),
                pl: require('../i18n/pl.json'),
                'zh-cn': require('../i18n/zh-cn.json'),
            },
        };
        // get actual admin port
        extendedProps.socket = { port: parseInt(window.location.port, 10) };
        extendedProps.bottomButtons = true;
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

    ioBrokerSystemConfigRequestFinished(systemConfig: any) {
        console.log('App:ioBrokerSystemConfigRequestFinished');
        console.log(systemConfig);
    }

    render() {
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
        if (!this.state.loaded || !this.state.connected) {
            return super.render();
        }

        return (
            <GlobalErrorBoundary>
                <IOBrokerContextProvider
                    ioBrokerConfig={this.ioBrokerConfig}
                    configChanged={this.ioBrokerSystemConfigRequestFinished}
                    {...this.props}
                >
                    <Grommet theme={theme} themeMode="dark" full>
                        <DebugModeProvider value={{ debugMode: false }}>
                            <DebugMode name="App">
                                <NotificationProvider>
                                    <Router>
                                        <>
                                            <RouterSG />
                                            {/* {this.renderError()}
                                            {this.renderToast()}
                                            {this.renderSaveCloseButtons()} */}
                                        </>
                                    </Router>
                                </NotificationProvider>
                            </DebugMode>
                        </DebugModeProvider>
                    </Grommet>
                </IOBrokerContextProvider>
            </GlobalErrorBoundary>
        );
    }
}

export default withStyles(styles)(App);
