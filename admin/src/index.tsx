import React from 'react';
import ReactDOM from 'react-dom';
import { MuiThemeProvider } from '@material-ui/core/styles';
import theme from '@iobroker/adapter-react/Theme';
import Utils from '@iobroker/adapter-react/Components/Utils';
// import App from './app';
import { SG_Adapter as App } from './SG_Adapter/App';

let themeName = Utils.getThemeName();

function build(): void {
    const rootElement = document.getElementById('root');
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
