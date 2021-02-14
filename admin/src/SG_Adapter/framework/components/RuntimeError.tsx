import { Box } from '@material-ui/core';
import React from 'react';

export interface RuntimeErrorProps {
    errorMessage: string;
}

export const RuntimeError = (props: RuntimeErrorProps): any => (
    <Box
        display="flex"
        justifyContent="center"
        m={1}
        p={1}
        bgcolor="background.paper"
        color="error.main"
        fontSize="h6.fontSize"
    >
        {props.errorMessage}
    </Box>
);
