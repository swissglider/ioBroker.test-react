import React, { useState } from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { BrowserRouter, BrowserRouter as Router, Route } from 'react-router-dom';
import { useMediaQuery } from '@material-ui/core';
import { MainHeader } from './mainLayout/MainHeader';
import { MainRouter } from './mainLayout/MainRouter';
import { TitelBarOnContext } from '../context/TitelBarOnContext';

export const MainLayout = (): JSX.Element => {
    const [titelBarOn, setTitleBarOn_] = useState<boolean>(true);
    const matches = useMediaQuery('(min-width:600px)');

    const setTitelBarOn = (titelBarOn: boolean) => {
        if (!matches) {
            setTitleBarOn_(true);
            return;
        }
        setTitleBarOn_(titelBarOn);
    };
    return (
        <BrowserRouter>
            <Route
                path="/"
                render={() => (
                    <>
                        <TitelBarOnContext.Provider value={{ setTitelBarOn: setTitelBarOn, titelBarOn: titelBarOn }}>
                            <MainHeader />
                            <TitelBarOnContext.Consumer>
                                {({ titelBarOn, setTitelBarOn }) => (
                                    <MainRouter titelBarOn={titelBarOn} setTitelBarOn={setTitelBarOn} />
                                )}
                            </TitelBarOnContext.Consumer>
                        </TitelBarOnContext.Provider>
                    </>
                )}
            />
        </BrowserRouter>
    );
};
