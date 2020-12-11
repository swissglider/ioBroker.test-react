import React, { Component } from 'react';

export const IOBrokerContext = React.createContext();

export class IOBrokerProvider extends Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            configuration: {},
            parameter: {},
        };
    }

    render(): JSX.Element {
        return (
            <IOBrokerContext.Provider
                value={{
                    configuration: {},
                    parameter: {},
                }}
            >
                {this.props.children}
            </IOBrokerContext.Provider>
        );
    }
}
