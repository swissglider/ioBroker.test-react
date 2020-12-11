import React from 'react';

export interface Props {
    dummy?: number;
}

interface State {
    showSidebar: boolean;
}

export default class ExampleDnD extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            showSidebar: false,
        };
    }
    render(): JSX.Element {
        return <h1>Hallo 1</h1>;
    }
}
