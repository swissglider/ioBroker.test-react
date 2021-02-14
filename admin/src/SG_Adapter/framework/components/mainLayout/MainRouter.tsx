import React, { useEffect } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import pageConfiguration, { I_PageConfiguration, startURL } from '../../../configs/RouterConfig';
import { MainContent } from './MainContent';

export const MainRouter = (props: {
    setTitelBarOn: (titelBarOn: boolean) => void;
    titelBarOn: boolean;
}): JSX.Element => {
    useEffect(() => {
        if (location.pathname === '/homepage') props.setTitelBarOn(true);
        else props.setTitelBarOn(false);
    });

    return (
        <Switch>
            {startURL.map((e: string) => (
                <Route key={e} path={e}>
                    <Redirect to="/homepage" />
                </Route>
            ))}
            <Route exact path="/">
                <Redirect to="/homepage" />
            </Route>
            <Route path="/home" exact>
                <Redirect to="/homepage" />
            </Route>
            <Route path="/homepage" component={MainContent} />
            {pageConfiguration.map((page: I_PageConfiguration, index: number) =>
                page.mainComponent !== undefined ? (
                    <Route key={index} path={page.path} component={page.mainComponent} />
                ) : page.component === undefined ? (
                    <Route key={index} path={page.path} component={MainContent} />
                ) : (
                    <Route key={index} path={page.path} component={page.component} />
                ),
            )}
        </Switch>
    );
};
