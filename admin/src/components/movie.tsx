import React, { Component } from 'react';

export interface Props {
    meta?: any;
}

export default class Movie extends Component<Props> {
    static defaultProps: Props = {};
    constructor(props: Props) {
        super(props);
    }
    render(): JSX.Element {
        return (
            <div className="movie">
                <h2>{this.props.meta.title}</h2>
                <div>
                    <img width="200" src={this.props.meta.poster} />
                </div>
                <p>({this.props.meta.year})</p>
                <p>{this.props.meta.description}</p>
            </div>
        );
    }
}
