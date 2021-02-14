import React from 'react';
import PageHelper from '../framework/utils/PageHelper';

export const Page1 = (): JSX.Element => {
    return (
        <div>
            <div>Hallo</div>
            <pre>{JSON.stringify(history, null, 4)}</pre>
            <pre>{JSON.stringify(location, null, 4)}</pre>
            <pre>{JSON.stringify(PageHelper.getPageByPath(location.pathname), null, 4)}</pre>
        </div>
    );
};
