import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { DebugMode } from '../../context/DebugModeContext';

interface State {
    dummy?: boolean;
}

export class PageSG extends Component<any, State> {
    constructor(props) {
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
            <DebugMode name="PageSG">
                <Switch>
                    <Route path={this.props.routerParams.startURL}>
                        <Redirect to={this.props.routerParams.defaultURL} />
                    </Route>
                    <Route exact path="/">
                        <Redirect to={this.props.routerParams.defaultURL} />
                    </Route>
                    <Route path="/home">
                        <Redirect to={this.props.routerParams.defaultURL} />
                    </Route>
                    {this.props.routerParams.routerConfig.map((item) => (
                        <Route key={item.path} path={item.path}>
                            {item.component}
                        </Route>
                    ))}
                </Switch>
            </DebugMode>
        );
    }
}
