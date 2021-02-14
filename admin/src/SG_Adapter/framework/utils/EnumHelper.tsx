/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { I_ioBrokerConfig } from '../interfaces/I_ioBrokerConfig';
import { I_ioBrokerContextValue } from '../interfaces/I_ioBrokerContextValue';
import { ObjectStateHelper } from './ObjectStateHelper';

const getAllSubEnums = (ioBContext: I_ioBrokerContextValue, parenEnumID: string): ioBroker.GetObjectsPromise => {
    return (ioBContext['ioBrokerConfig'] as I_ioBrokerConfig).configuration.socket.getForeignObjects(
        parenEnumID + '.*',
        'enum',
    );
};

const getEnumNameByOrgName = (ioBContext: I_ioBrokerContextValue, orgName: { [key: string]: any } | string): string => {
    if (typeof orgName === 'string') {
        return orgName;
    }
    if (typeof orgName === 'object' && ioBContext.systemConfig !== undefined) {
        if (
            ioBContext.systemConfig.common.language in orgName &&
            orgName[ioBContext.systemConfig.common.language] !== ''
        ) {
            return (orgName as any)[ioBContext.systemConfig.common.language];
        } else if ('en' in orgName && orgName.en !== undefined) {
            return orgName.en;
        } else if (Object.keys(orgName).length > 0) {
            return orgName[Object.keys(orgName)[0]];
        }
    }
    throw `Error on the name ${orgName}`;
};

const getEnumNameByObjectByLanguage = (ioBContext: I_ioBrokerContextValue, obj: ioBroker.Object): string => {
    try {
        return getEnumNameByOrgName(ioBContext, obj.common.name);
    } catch (e) {
        return obj._id;
    }
};

const getEnumByID = (ioBContext: I_ioBrokerContextValue, id: string): ioBroker.GetObjectPromise => {
    return ObjectStateHelper.getObjectByID(ioBContext, id);
};

const getEnumNameByIDByLanguage = (ioBContext: I_ioBrokerContextValue, id: string): Promise<string> => {
    return getEnumByID(ioBContext, id).then((obj) =>
        obj && obj !== undefined ? getEnumNameByObjectByLanguage(ioBContext, obj) : id,
    );
};

const saveEnumChangesByObject = (
    ioBContext: I_ioBrokerContextValue,
    enumID: string,
    newEnum: ioBroker.SettableObject,
): Promise<void> => {
    try {
        return (ioBContext['ioBrokerConfig'] as I_ioBrokerConfig).configuration.socket.setObject(enumID, newEnum);
    } catch (e) {
        return e;
    }
};

const deleteObject = (ioBContext: I_ioBrokerContextValue, id: string): Promise<void> => {
    return (ioBContext['ioBrokerConfig'] as I_ioBrokerConfig).configuration.socket.delObject(id);
};

export const EnumHelper = {
    getAllSubEnums: getAllSubEnums,
    getEnumNameByObjectByLanguage: getEnumNameByObjectByLanguage,
    getEnumByID: getEnumByID,
    getEnumNameByIDByLanguage: getEnumNameByIDByLanguage,
    saveEnumChangesByObject: saveEnumChangesByObject,
    deleteObject: deleteObject,
    getEnumNameByOrgName: getEnumNameByOrgName,
};
