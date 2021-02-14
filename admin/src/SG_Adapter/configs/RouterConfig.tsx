import React from 'react';
import { Page1 } from '../components/Page1';
import StandardConfig from '../components/standard_config/components/StandardConfig';
import { Page5 } from '../components/Page5';
import Enums from '../components/enums/components/Enums';

export const startURL = ['/adapter/test-react/tab_m.html', '/adapter/test-react/index_m.html'];

export interface I_PageConfiguration {
    name: string;
    tabName?: string;
    asTab?: boolean;
    path: string;
    component?: any;
    mainComponent?: () => any;
    componentProps?: { [key: string]: any };
    subPages?: I_PageConfiguration[];
}

export const notInTabsList = ['/', '/home', '/homepage', startURL];

const pageConfiguration: I_PageConfiguration[] = [
    {
        name: 'Home Floor Room Handler',
        tabName: 'Home Handler',
        path: '/home_handler',
        subPages: [
            { name: 'Router Props', tabName: 'Router Props', path: '/rprops', component: Page1 },
            {
                name: 'Adapter Konfigurationen',
                tabName: 'Configs',
                path: '/aconf',
                component: StandardConfig,
                componentProps: { prefix: 'react_', parametersWithMs: ['react_TestMS'] },
            },
            {
                name: 'Configuration List Test',
                tabName: 'List Test',
                path: '/tlist',
                component: <Page5 />,
            },
        ],
    },
    {
        name: 'Device Availability',
        tabName: 'Availability',
        path: '/availability',
        subPages: [{ name: 't1', path: '/t1_1', component: Page1 }],
    },
    { name: 'Battery State Harmonizer', tabName: 'Battery', path: '/battery', component: Page1 },
    { name: 'Swissgliders little helper', tabName: 'SG Helpers', path: '/sg_helper', subPages: [] },
    {
        name: 'DnD Tests mit Enums',
        tabName: 'Enum',
        path: '/tenum',
        subPages: [
            {
                name: 'homeData',
                tabName: 'homeData',
                path: '/tenum1',
                component: Enums,
                componentProps: {
                    categoriePairName: 'homeData',
                    enumCategoryID: undefined,
                    enumChildCategoryID: 'enum.home',
                },
            },
            {
                name: 'homeAreaData',
                tabName: 'homeAreaData',
                path: '/tenum2',
                component: Enums,
                componentProps: {
                    categoriePairName: 'homeAreaData',
                    enumCategoryID: 'enum.home',
                    enumChildCategoryID: 'enum.area',
                },
            },
            {
                name: 'homeZoneData',
                tabName: 'homeZoneData',
                path: '/tenum3',
                component: Enums,
                componentProps: {
                    categoriePairName: 'homeZoneData',
                    enumCategoryID: 'enum.home',
                    enumChildCategoryID: 'enum.zone',
                },
            },
            {
                name: 'areaFloorData',
                tabName: 'areaFloorData',
                path: '/tenum4',
                component: Enums,
                componentProps: {
                    categoriePairName: 'areaFloorData',
                    enumCategoryID: 'enum.area',
                    enumChildCategoryID: 'enum.floor',
                },
            },
            {
                name: 'floorRoomData',
                tabName: 'floorRoomData',
                path: '/tenum5',
                component: Enums,
                componentProps: {
                    categoriePairName: 'floorRoomData',
                    enumCategoryID: 'enum.floor',
                    enumChildCategoryID: 'enum.rooms',
                },
            },
        ],
    },
    { name: 'Hallo Guido1', asTab: false, tabName: 'React1', path: '/react2', subPages: [] },
    {
        name: 'Blick',
        path: '/blick',
        mainComponent: (): any => {
            window.location.href = 'https://www.blick.ch/';
            return null;
        },
        subPages: [],
    },
];

export default pageConfiguration;
