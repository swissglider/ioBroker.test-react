import React from 'react';
import { Theme, withStyles } from '@material-ui/core/styles';

import GenericApp from '@iobroker/adapter-react/GenericApp';
import { GenericAppProps, GenericAppSettings } from '@iobroker/adapter-react/types';
import { StyleRules } from '@material-ui/core/styles';

import { BrowserRouter as Router } from 'react-router-dom';
import { Grommet } from 'grommet';

import { RouterSG, DebugModeProvider, DebugMode, NotificationProvider, GlobalErrorBoundary } from './';

const styles = (_theme: Theme): StyleRules => ({
    root: {},
});

const theme = {
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
};

class App extends GenericApp {
    private classes: any;
    ioBrokerConfig: any;
    constructor(props: GenericAppProps) {
        const extendedProps: GenericAppSettings = {
            ...props,
            encryptedFields: [],
        };
        // get actual admin port
        extendedProps.socket = { port: parseInt(window.location.port, 10) };
        extendedProps.bottomButtons = false;
        super(props, extendedProps);
        this.ioBrokerConfig = {
            configuration: {
                instance: this.instance,
                adapterName: this.adapterName,
                instanceId: this.instanceId,
            },
            parameter: this.state.native,
        };
    }

    render() {
        if (!this.state.loaded || !this.state.connected) {
            return super.render();
        }
        return (
            <GlobalErrorBoundary>
                <Grommet theme={theme} themeMode="dark" full>
                    <DebugModeProvider value={{ debugMode: true, title: 'This is a title' }}>
                        <DebugMode name="App">
                            <NotificationProvider>
                                <Router>
                                    <RouterSG />
                                </Router>
                            </NotificationProvider>
                        </DebugMode>
                    </DebugModeProvider>
                </Grommet>
            </GlobalErrorBoundary>
        );
    }
}

export default withStyles(styles)(App);
