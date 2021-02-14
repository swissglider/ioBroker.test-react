import React, { useState } from 'react';
import Slide from '@material-ui/core/Slide';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import makeStyles from '@material-ui/core/styles/makeStyles';
import createStyles from '@material-ui/core/styles/createStyles';

export interface MainContentHideOnScrollProps {
    window?: () => Window;
    children: React.ReactElement;
    titleChild: React.ReactElement;
}

const useStyleMainContent = makeStyles(() =>
    createStyles({
        root: {
            // minHeight: 'calc(100% - 330px)',
            // maxHeight: 'calc(100% - 330px)',
            // [theme.breakpoints.down('xs')]: {
            //     minHeight: 'calc(100% - 220px)',
            //     maxHeight: 'calc(100% - 220px)',
            // },
        },
        child: {
            overflowY: 'auto',
            overflowX: 'hidden',
            'min-height': 'calc(100vh - 225px)',
            'max-height': 'calc(100vh - 225px)',
        },
        title: {
            // background: 'blue',
        },
    }),
);

export const MainContentHideOnScroll = (props: MainContentHideOnScrollProps): JSX.Element => {
    const [scrollTarget, setScrollTarget] = useState<HTMLDivElement | undefined>(undefined);
    const scrollTrigger = useScrollTrigger({ target: scrollTarget });
    const classes = useStyleMainContent();

    return (
        <>
            <div className={classes.root}>
                <Slide appear={false} direction="down" in={!scrollTrigger} mountOnEnter={true} unmountOnExit={true}>
                    <div className={classes.title}>{props.titleChild}</div>
                </Slide>

                <div
                    className={classes.child}
                    ref={(node) => {
                        if (node) {
                            setScrollTarget(node);
                        }
                    }}
                >
                    {/* {React.cloneElement(children)} */}
                    {props.children}
                </div>
            </div>
        </>
    );
};
