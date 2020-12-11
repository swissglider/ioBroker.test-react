import React, { Component } from 'react';

import Count, { Props } from './Count';

interface State {
    count: number;
}

export default class Counter extends Component<Props, State> {
    state: State = {
        count: 0,
    };

    increment = (): void => {
        this.setState({
            count: this.state.count + 1,
        });
    };

    decrement = (): void => {
        this.setState({
            count: this.state.count - 1,
        });
    };

    render(): JSX.Element {
        return (
            <div>
                <Count />
                <button onClick={this.increment}>Increment</button>
                <button onClick={this.decrement}>Decrement</button>
            </div>
        );
    }
}
