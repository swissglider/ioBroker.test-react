import React from 'react';
import { Theme, withStyles } from '@material-ui/core/styles';

import GenericApp from '@iobroker/adapter-react/GenericApp';
import { GenericAppProps, GenericAppSettings } from '@iobroker/adapter-react/types';
import { StyleRules } from '@material-ui/core/styles';
import { Grommet, Tab, Tabs, Box } from 'grommet';

import NameForm from './NameForm';
import AppStructure from './AppStructure';
import Calculator from './temp_calculator/calculator';
import ExampleDnD from './ExampleDnD';

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
    tab: {
        border: {
            side: 'bottom',
            size: 'small',
            color: {
                dark: 'accent-1',
                light: 'brand',
            },
            active: {
                color: {
                    dark: 'white',
                    light: 'black',
                },
            },
            disabled: {},
            hover: {
                color: {
                    dark: 'white',
                    light: 'black',
                },
            },
        },
    },
    tabs: {
        header: {
            background: 'light-2',
        },
    },
};

const styles = (_theme: Theme): StyleRules => ({
    root: {},
});

class AppTabed extends GenericApp {
    constructor(props: GenericAppProps) {
        const extendedProps: GenericAppSettings = {
            ...props,
            encryptedFields: [],
        };
        // get actual admin port
        extendedProps.socket = { port: parseInt(window.location.port, 10) };
        extendedProps.bottomButtons = false;
        super(props, extendedProps);
    }

    onConnectionReady() {
        console.log('==================== Connection ok ===============');
        console.log(this.socket.isConnected());
        this.socket.getState('device-availability.0.lastCheck').then((e) => console.log(`Result from State : ${e}`));
        this.socket
            .sendTo(`${this.adapterName}.${this.instance}`, 'send', {
                message: 'Hallo Guido',
                title: 'Device not reable',
                priority: 1,
            })
            .then((e) => console.error('Result: ' + e));
    }

    render() {
        if (!this.state.loaded) {
            return super.render();
        }

        console.log('-- props --');
        console.warn(this.props);
        console.log('-- state --');
        console.warn(this.state);
        console.log('-- context --');
        console.warn(this.context);
        console.log('-- refs --');
        console.warn(this.refs);
        console.log('-- instance --');
        console.warn(this.instance);
        console.log('-- adapterName --');
        console.warn(this.adapterName);
        console.log('-- instanceId --');
        console.warn(this.instanceId);
        console.log('-- isIFrame --');
        console.warn(this.isIFrame);
        console.log('-- encryptedFields --');
        console.warn(this.encryptedFields);
        console.log('-- common --');
        console.warn(this.common);
        console.log('-- _secret --');
        console.warn(this._secret);
        this.getExtendableInstances().then((e) => {
            console.log('-- getExtendableInstances --');
            console.warn(e);
        });
        this.getSystemConfig().then((e) => {
            console.log('-- getSystemConfig --');
            console.warn(e);
        });

        const tab1 = (
            <Box pad="medium">
                <NameForm />
                <Calculator />
            </Box>
        );

        const tab2 = (
            <Box pad="medium">
                <ExampleDnD />
            </Box>
        );

        return (
            <Grommet theme={theme} themeMode="dark" full>
                <AppStructure>
                    <Tabs>
                        <Tab title="tab 1">{tab1}</Tab>
                        <Tab title="tab 2">{tab2}</Tab>
                    </Tabs>
                    {/* {this.renderSaveCloseButtons()} */}
                </AppStructure>
            </Grommet>
        );
    }
}

export default withStyles(styles)(AppTabed);
