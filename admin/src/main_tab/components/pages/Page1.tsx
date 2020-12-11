import React, { Component } from 'react';

import { DebugModeContext, DebugMode } from '../..';

interface Props {
    dummy?: string;
}

interface State {
    dummy?: boolean;
}

export class Page1 extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {};
    }

    componentDidMount(): void {
        return;
    }

    componentWillUnmount(): void {
        return;
    }

    render(): JSX.Element {
        const debuMode = this.context;
        return (
            <DebugMode name="Page1">
                {/* <DebugModeContextConsumer>{(context) => context}</DebugModeContextConsumer> */}
                <DebugModeContext.Consumer>
                    {(context) => (
                        <div>
                            <div>
                                Context: {context.title} - DebuggMode: {context.debugMode.toString()}
                            </div>
                            <button onClick={() => context.changeTitle('Hallo Arvian')}>&uarr;</button>
                            <button onClick={() => context.switchDebugMode()}>&uarr;</button>
                        </div>
                    )}
                </DebugModeContext.Consumer>
            </DebugMode>
        );
    }
}
