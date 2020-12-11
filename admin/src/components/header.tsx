import React, { Component } from 'react';

export interface Props {
    title?: string;
}

export default class Header extends Component<Props> {
    static defaultProps: Props = {
        title: 'This is a title',
    };
    constructor(props: Props) {
        super(props);
    }

    componentDidMount() {}

    componentWillUnmount() {}

    render(): JSX.Element {
        return (
            <div className="App-header">
                <h2>{this.props.title}</h2>
            </div>
        );
    }
}
