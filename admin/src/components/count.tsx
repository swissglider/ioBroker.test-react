import * as React from 'react';

export interface Props {
    count?: number;
}

export default class Count extends React.Component<Props> {
    static defaultProps: Props = {
        count: 10,
    };

    render(): JSX.Element {
        return <h1>{this.props.count}</h1>;
    }
}
