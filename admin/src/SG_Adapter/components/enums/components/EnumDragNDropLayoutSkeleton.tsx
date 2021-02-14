/**
 * Creates the Skeleton for the loading process
 */

import React from 'react';
import { Box, Card, CardContent, CardHeader, Grid, IconButton } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';

export const EnumDragNDropLayoutSkeleton = (): JSX.Element => {
    // Normally you would want to split things out into separate components.
    // But in this example everything is just done in one place for simplicity
    return (
        <Grid container>
            <Grid item xs={6}>
                <Box margin="1px">
                    <Skeleton animation="wave" width="100%">
                        <Card>
                            <CardHeader>
                                <IconButton></IconButton>
                            </CardHeader>
                            <CardContent>
                                <Box />
                            </CardContent>
                        </Card>
                    </Skeleton>
                </Box>
            </Grid>
            <Grid item xs={6}>
                <Box margin="1px">
                    <Skeleton animation="wave" width="100%">
                        <Card>
                            <CardHeader>
                                <IconButton></IconButton>
                            </CardHeader>
                            <CardContent>
                                <Box />
                            </CardContent>
                        </Card>
                    </Skeleton>
                </Box>
                <Box margin="1px">
                    <Skeleton animation="wave" width="100%">
                        <Card>
                            <CardHeader>
                                <IconButton></IconButton>
                            </CardHeader>
                            <CardContent>
                                <Box />
                            </CardContent>
                        </Card>
                    </Skeleton>
                </Box>
                <Box margin="1px">
                    <Skeleton animation="wave" width="100%">
                        <Card>
                            <CardHeader>
                                <IconButton></IconButton>
                            </CardHeader>
                            <CardContent>
                                <Box />
                            </CardContent>
                        </Card>
                    </Skeleton>
                </Box>
            </Grid>
        </Grid>
    );
};
