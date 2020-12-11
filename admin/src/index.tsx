import React from 'react';
import ReactDOM from 'react-dom';
import { MuiThemeProvider } from '@material-ui/core/styles';
import theme from '@iobroker/adapter-react/Theme';
import Utils from '@iobroker/adapter-react/Components/Utils';
import App from './app';
import AppTabed from './tabbed_components/app';
import * as tabApp from './main_tab/App';

let themeName = Utils.getThemeName();

function build(): void {
    const rootElement = document.getElementById('root');
    if (rootElement && rootElement.hasAttribute('rootType')) {
        const rootType = rootElement.getAttribute('rootType');
        if (rootType === 'tabed') {
            ReactDOM.render(
                <MuiThemeProvider theme={theme(themeName)}>
                    <AppTabed
                        onThemeChange={(_theme) => {
                            themeName = _theme;
                            build();
                        }}
                    />
                </MuiThemeProvider>,
                rootElement,
            );
            return;
        } else if (rootType === 'mainTab') {
            ReactDOM.render(
                <MuiThemeProvider theme={theme(themeName)}>
                    <tabApp.default
                        onThemeChange={(_theme) => {
                            themeName = _theme;
                            build();
                        }}
                    />
                </MuiThemeProvider>,
                rootElement,
            );
            return;
        }
    }
    ReactDOM.render(
        <MuiThemeProvider theme={theme(themeName)}>
            <App
                onThemeChange={(_theme) => {
                    themeName = _theme;
                    build();
                }}
            />
        </MuiThemeProvider>,
        rootElement,
    );
}

build();
