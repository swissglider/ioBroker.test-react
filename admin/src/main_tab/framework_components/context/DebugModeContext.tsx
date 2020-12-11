import React, { Component } from 'react';

export const DebugModeContext = React.createContext();

export class DebugModeProvider extends Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            debugMode: props && 'value' in props && 'debugMode' in props['value'] ? props.value.debugMode : false,
            title: props && 'value' in props && 'title' in props['value'] ? props.value.title : 'Hallo Guido',
        };
    }

    changeTitle = (newTitle: string): void => {
        this.setState((prevState) => {
            return {
                debugMode: prevState['debugMode'],
                title: newTitle,
            };
        });
    };

    switchDebugMode = (): void => {
        this.setState((prevState) => {
            return {
                debugMode: !prevState['debugMode'],
                title: prevState['title'],
            };
        });
    };

    render(): JSX.Element {
        return (
            <DebugModeContext.Provider
                value={{
                    debugMode: this.state.debugMode,
                    title: this.state.title,
                    switchDebugMode: this.switchDebugMode,
                    changeTitle: this.changeTitle,
                }}
            >
                {this.props.children}
            </DebugModeContext.Provider>
        );
    }
}

export function DebugMode(props): JSX.Element {
    return (
        <DebugModeContext.Consumer>
            {(context) =>
                context.debugMode ? (
                    <fieldset>
                        <legend>{props.name}</legend>
                        {props.children}
                    </fieldset>
                ) : (
                    props.children
                )
            }
        </DebugModeContext.Consumer>
    );
}
