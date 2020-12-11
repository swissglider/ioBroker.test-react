import React, { Component } from 'react';

import { DebugMode } from '../..';

interface Props {
    dummy?: string;
}

interface State {
    dummy?: boolean;
}

export class Page2 extends Component<Props, State> {
    static defaultProps: Props = {};
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
        return (
            <DebugMode name="Page2">
                <div>Page 2</div>
            </DebugMode>
        );
    }
}
