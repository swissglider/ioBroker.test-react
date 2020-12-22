import React, { Component } from 'react';
import I18n from '@iobroker/adapter-react/i18n';

export const DebugModeContext = React.createContext({
    debugMode: false,
    switchDebugMode: () => {
        return;
    },
});
DebugModeContext.displayName = 'DebugMode : false';

export interface I_DebugModeProvider {
    value: {
        debugMode: boolean;
    };
    [key: string]: any;
}

export class DebugModeProvider extends Component<I_DebugModeProvider, any> {
    constructor(props: I_DebugModeProvider) {
        super(props);
        const newDebugMode = props && 'value' in props && 'debugMode' in props['value'] ? props.value.debugMode : false;
        this.changeDisplayName(newDebugMode);
        this.state = {
            debugMode: newDebugMode,
        };
    }

    changeDisplayName = (newDebugMode: boolean): void => {
        DebugModeContext.displayName = `DebugMode : ${newDebugMode}`;
    };

    switchDebugMode = (): void => {
        this.setState((prevState) => {
            const newDebugMode = !prevState['debugMode'];
            this.changeDisplayName(newDebugMode);
            return {
                debugMode: newDebugMode,
            };
        });
    };

    render(): JSX.Element {
        return (
            <DebugModeContext.Provider
                value={{
                    debugMode: this.state.debugMode,
                    switchDebugMode: this.switchDebugMode,
                }}
            >
                {this.props.children}
            </DebugModeContext.Provider>
        );
    }
}

export interface I_DebugMode {
    name: any;
    children: any;
    [key: string]: any;
}

export function DebugMode(props: I_DebugMode): JSX.Element {
    return (
        <DebugModeContext.Consumer>
            {(context) =>
                context.debugMode ? (
                    <fieldset>
                        <legend>{I18n.t(props.name)}</legend>
                        {props.children}
                    </fieldset>
                ) : (
                    props.children
                )
            }
        </DebugModeContext.Consumer>
    );
}
