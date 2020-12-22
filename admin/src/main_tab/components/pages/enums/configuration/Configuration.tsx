/**
 * Containes the EnumLayout definition
 */

import { I_EnumLayoutDefinitions } from '../interfaces/Interfaces';

export const EnumLayoutDefinitions: I_EnumLayoutDefinitions = {
    homeAreaData: {
        categoriePairName: 'homeAreaData',
        enumCategoryID: 'enum.home',
        enumChildCategoryID: 'enum.area',
    },
    homeZoneData: {
        categoriePairName: 'homeZoneData',
        enumCategoryID: 'enum.home',
        enumChildCategoryID: 'enum.zone',
    },
    areaFloorData: {
        categoriePairName: 'areaFloorData',
        enumCategoryID: 'enum.area',
        enumChildCategoryID: 'enum.floor',
    },
    floorRoomData: {
        categoriePairName: 'floorRoomData',
        enumCategoryID: 'enum.floor',
        enumChildCategoryID: 'enum.rooms',
    },
};
