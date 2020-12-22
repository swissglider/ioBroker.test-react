/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export interface I_ObjectStateInformations {
    object: ioBroker.Object;
    state: ioBroker.State;
    stateValue: any;
    displayName: string;
}

const getObjectByID = (ioBContext: any, id: string): ioBroker.GetObjectPromise => {
    return ioBContext.ioBrokerConfig.configuration.socket.getObject(id);
};

const getStateByID = (ioBContext: any, id: string): Promise<ioBroker.State | null | undefined> => {
    return ioBContext.ioBrokerConfig.configuration.socket.getState(id);
};

const getDisplayNameByObject = (ioBContext: any, obj: ioBroker.Object): string => {
    if (
        obj &&
        'native' in obj &&
        obj.native &&
        obj.native !== undefined &&
        'swissglider' in obj.native &&
        'general' in obj.native.swissglider &&
        'displayName' in obj.native.swissglider.general
    ) {
        return obj.native.swissglider.general.displayName;
    } else if (obj && 'common' in obj && 'name' in obj.common) {
        return typeof obj.common.name === 'string'
            ? obj.common.name
            : typeof obj.common.name === 'object'
            ? obj.common.name[ioBContext.systemConfig.common.language]
            : obj.common.name;
    }
    return obj._id;
};

const getDisplayNameByID = (ioBContext: any, id: string): Promise<string> => {
    return getObjectByID(ioBContext, id).then((obj) => {
        return obj && obj !== undefined ? getDisplayNameByObject(ioBContext, obj) : id;
    });
};

const getStateValueByID = (ioBContext: any, id: string): any => {
    return getStateByID(ioBContext, id).then((state) => {
        return state && state !== undefined ? state.val : undefined;
    });
};

const getObjectStateInformationsByID = (
    ioBContext: any,
    id: string,
): Promise<I_ObjectStateInformations | undefined> => {
    return getObjectByID(ioBContext, id).then((obj) => {
        return getStateByID(ioBContext, id).then((state) => {
            if (obj && obj !== undefined && state && state !== undefined) {
                return {
                    object: obj,
                    state: state,
                    stateValue: state.val,
                    displayName: getDisplayNameByObject(ioBContext, obj),
                };
            }
            return undefined;
        });
    });
};

const setMemebersIDForEnumByID = (ioBContext: any, id: string, cb): void => {
    getObjectByID(ioBContext, id).then((obj) => {
        if (obj && 'members' in obj.common) {
            cb(obj.common.members);
        } else {
            cb([]);
        }
    });
};

export const ObjectStateHelper = {
    getObjectByID: getObjectByID,
    getStateByID: getStateByID,
    getDisplayNameByObject: getDisplayNameByObject,
    getDisplayNameByID: getDisplayNameByID,
    getStateValueByID: getStateValueByID,
    getObjectStateInformationsByID: getObjectStateInformationsByID,
    setMemebersIDForEnumByID: setMemebersIDForEnumByID,
};
