/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

const getAllSubEnums = (ioBContext: any, parenEnumID: string): ioBroker.GetObjectsPromise => {
    return ioBContext.ioBrokerConfig.configuration.socket.getForeignObjects(parenEnumID + '.*', 'enum');
};

const getEnumNameByObjectByLanguage = (ioBContext: any, obj: ioBroker.Object): string => {
    if (typeof obj.common.name === 'string') {
        return obj.common.name;
    }
    if (typeof obj.common.name === 'object') {
        if (ioBContext.systemConfig.common.language in obj.common.name) {
            return obj.common.name[ioBContext.systemConfig.common.language];
        } else if ('en' in obj.common.name && obj.common.name.en !== undefined) {
            return obj.common.name.en;
        }
    }
    return obj._id;
};

const getEnumByID = (ioBContext: any, id: string): ioBroker.GetObjectPromise => {
    return ioBContext.ioBrokerConfig.configuration.socket.getObject(id);
};

const getEnumNameByIDByLanguage = (ioBContext: any, id: string): Promise<string> => {
    return getEnumByID(ioBContext, id).then((obj) =>
        obj && obj !== undefined ? getEnumNameByObjectByLanguage(ioBContext, obj) : id,
    );
};

const saveEnumChangesByObject = (ioBContext: any, enumID: string, newEnum: ioBroker.SettableObject): Promise<void> => {
    return ioBContext.ioBrokerConfig.configuration.socket.setObject(enumID, newEnum);
};

export const EnumHelper = {
    getAllSubEnums: getAllSubEnums,
    getEnumNameByObjectByLanguage: getEnumNameByObjectByLanguage,
    getEnumByID: getEnumByID,
    getEnumNameByIDByLanguage: getEnumNameByIDByLanguage,
    saveEnumChangesByObject: saveEnumChangesByObject,
};
