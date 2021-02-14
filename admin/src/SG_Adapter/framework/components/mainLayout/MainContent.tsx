import React, { useEffect, useState } from 'react';
import { createStyles, makeStyles, Tab, Tabs, Theme, Tooltip, useMediaQuery } from '@material-ui/core';
import { SubTitle } from './SubTitle';
import { MainHomePage } from './MainHomePage';
import { I_PageConfiguration } from '../../../configs/RouterConfig';
import { Link, useHistory } from 'react-router-dom';
import i18n from '@iobroker/adapter-react/i18n';
import { MainContentHideOnScroll } from './MainContentHideOnScroll';
import PageHelper from '../../utils/PageHelper';

const useStyleMainContent = makeStyles((theme: Theme) =>
    createStyles({
        root: (props: { isHomePage: boolean }) => ({
            // background: lightBlue[50],
            background: theme.palette.background.default,
            minHeight: props.isHomePage ? 'calc(100% - 260px)' : 'calc(100% - 200px)',
            maxHeight: props.isHomePage ? 'calc(100% - 260px)' : 'calc(100% - 200px)',
            padding: 10,
            borderRadius: '20px',
            marginRight: 10,
            marginLeft: 10,
            'box-shadow': 'rgba(0, 0, 0, 0.1) 0px 0px 5px 0px, rgba(0, 0, 0, 0.1) 0px 0px 1px 0px',
            [theme.breakpoints.down('xs')]: {
                minHeight: props.isHomePage ? 'calc(100% - 220px)' : 'calc(100% - 220px)',
                maxHeight: props.isHomePage ? 'calc(100% - 220px)' : 'calc(100% - 220px)',
            },
            // overflowY: 'hidden',
            // overflowX: 'hidden',
        }),
        tabs: {
            // height: theme.spacing(3),
            margin: theme.spacing(-1, 0, 0.5),
        },
    }),
);

export const MainContent1 = (props: { history: any; location: any; match: any; staticContext: any }): JSX.Element => {
    // console.log(props);
    return (
        <>
            <>
                <div>Page: {props.location.pathname}</div>
                <pre>{JSON.stringify(PageHelper.getPageByPath(props.location.pathname), null, 4)}</pre>
            </>
        </>
    );
};

export interface MainContentProps {
    history: any;
    location: any;
    match: any;
    staticContext: any;
}

const MainContent_ = (props: MainContentProps): JSX.Element => {
    // const [name, setName] = useState<string>('');
    const [tabsPath, setTabsPath] = useState<string | false>(false);
    // const [page, setPage] = useState<I_PageConfiguration>();
    const [matchPage, setMatchPage] = useState<I_PageConfiguration>();
    const [componentToLoad, setComponentToLoad] = useState<any>();
    const [subTitle, setSubTitle] = useState<{ name: string; link: string }[]>([]);
    const [isHomePage, setIsHomePage] = useState<boolean>(true);
    const classes = useStyleMainContent({ isHomePage: isHomePage });

    const history_ = useHistory();

    useEffect(() => {
        const page_ = PageHelper.getPageByPath(props.location.pathname);
        if (page_ !== undefined) {
            const matchPage_ = PageHelper.getPageByPath(props.match.path);
            if (matchPage_ !== undefined) {
                setMatchPage(matchPage_);
            }
            // setPage(page_);
            // setName(page_.name);
            // if link is a 1st level link
            if (page_ === matchPage_ && page_.subPages !== undefined && page_.subPages.length > 0) {
                // setTabsPath(matchPage_.path + page_.subPages[0].path);
                // setSubTitle([
                //     { name: matchPage_.name, link: matchPage_.path },
                //     { name: page_.subPages[0].name, link: matchPage_.path + page_.subPages[0].path },
                // ]);
                // setComponentToLoad(page_.subPages[0].component);
                history_.push(matchPage_.path + page_.subPages[0].path);
            }
            // link is a 2nd Level link
            else if (page_ !== matchPage_ && matchPage_ !== undefined) {
                setSubTitle([
                    { name: matchPage_.name, link: matchPage_.path },
                    { name: page_.name, link: matchPage_.path + page_.path },
                ]);
                setTabsPath(props.location.pathname);
                setComponentToLoad(page_.component);
            }
            setIsHomePage(false);
        } else if (props.match.path === '/homepage') {
            // setName('Home Page');
            setSubTitle([{ name: 'Homepage', link: props.location.pathname }]);
            setComponentToLoad(<MainHomePage />);
            setIsHomePage(true);
        } else {
            // setName('Home Page');
            setSubTitle([{ name: 'Homepage', link: props.location.pathname }]);
            setComponentToLoad(<MainHomePage />);
            setIsHomePage(true);
        }
    }, [props]);

    const matchScreen = useMediaQuery('(min-width:600px)');

    const getTitleChild = (): JSX.Element => {
        return (
            <div>
                {matchPage !== undefined &&
                    matchPage.subPages !== undefined &&
                    Array.isArray(matchPage.subPages) &&
                    matchPage.subPages.length > 0 &&
                    matchScreen && (
                        <div className={classes.tabs}>
                            <Tabs value={tabsPath} centered>
                                {matchPage.subPages.map(
                                    (page_: I_PageConfiguration, index: number) =>
                                        (page_.asTab === undefined || page_.asTab) && (
                                            <Tab
                                                key={index}
                                                label={
                                                    <Tooltip placement="top" title={page_.name}>
                                                        <span>
                                                            {i18n.t(
                                                                page_.tabName !== undefined
                                                                    ? page_.tabName
                                                                    : page_.name,
                                                            )}
                                                        </span>
                                                    </Tooltip>
                                                }
                                                value={matchPage.path + page_.path}
                                                component={Link}
                                                to={matchPage.path + page_.path}
                                            />
                                        ),
                                )}
                            </Tabs>
                        </div>
                    )}
            </div>
        );
    };

    return (
        <>
            <SubTitle titles={subTitle} />
            <div className={classes.root}>
                {componentToLoad !== undefined && (
                    <MainContentHideOnScroll titleChild={getTitleChild()}>{componentToLoad}</MainContentHideOnScroll>
                )}
            </div>
        </>
    );
};

const checkifEqual = (p: MainContentProps, n: MainContentProps): boolean => {
    return p.location.pathname === n.location.pathname;
};

export const MainContent = React.memo(MainContent_, checkifEqual);
