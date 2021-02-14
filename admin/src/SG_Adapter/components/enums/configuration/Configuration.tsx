/**
 * Containes the EnumLayout definition
 */

import { I_EnumLayoutDefinition } from '../interfaces/Interfaces';

export const EnumLayoutDefinitions: I_EnumLayoutDefinition[] = [
    {
        categoriePairName: 'homeData',
        enumCategoryID: undefined,
        enumChildCategoryID: 'enum.home',
    },
    {
        categoriePairName: 'homeAreaData',
        enumCategoryID: 'enum.home',
        enumChildCategoryID: 'enum.area',
    },
    {
        categoriePairName: 'homeZoneData',
        enumCategoryID: 'enum.home',
        enumChildCategoryID: 'enum.zone',
    },
    {
        categoriePairName: 'areaFloorData',
        enumCategoryID: 'enum.area',
        enumChildCategoryID: 'enum.floor',
    },
    {
        categoriePairName: 'floorRoomData',
        enumCategoryID: 'enum.floor',
        enumChildCategoryID: 'enum.rooms',
    },
];
