import React from 'react';

export const TitelBarOnContext = React.createContext({
    titelBarOn: true,
    setTitelBarOn: (titelBarOn: boolean) => {
        titelBarOn;
    },
});
