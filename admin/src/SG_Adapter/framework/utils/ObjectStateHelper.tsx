/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export interface I_ObjectStateInformations {
    object: ioBroker.Object;
    state: ioBroker.State;
    stateValue: any;
    displayName: string;
}

const getObjectByID = (ioBContext: any, id: string): ioBroker.GetObjectPromise => {
    if (
        ioBContext.ioBrokerConfig.configuration.socket.objects &&
        ioBContext.ioBrokerConfig.configuration.socket.objects[id]
    ) {
        return Promise.resolve(ioBContext.ioBrokerConfig.configuration.socket.objects[id]);
    } else {
        return ioBContext.ioBrokerConfig.configuration.socket.getObject(id);
    }
};

const getStateByID = (ioBContext: any, id: string): Promise<ioBroker.State | null | undefined> => {
    if (
        ioBContext.ioBrokerConfig.configuration.socket.states &&
        ioBContext.ioBrokerConfig.configuration.socket.states[id]
    ) {
        return Promise.resolve(ioBContext.ioBrokerConfig.configuration.socket.states[id]);
    } else {
        return ioBContext.ioBrokerConfig.configuration.socket.getState(id);
    }
    // return ioBContext.ioBrokerConfig.configuration.socket.getState(id);
};

const getStateValueByID = (ioBContext: any, id: string): any => {
    return getStateByID(ioBContext, id).then((state) => {
        return state && state !== undefined ? state.val : undefined;
    });
};

const setMemebersIDForEnumByID = (ioBContext: any, id: string, cb: (members: string[]) => void): void => {
    getObjectByID(ioBContext, id).then((obj) => {
        if (obj && 'members' in obj.common) {
            cb(obj.common.members);
        } else {
            cb([]);
        }
    });
};

const isIDExisting = async (ioBContext: any, id: string): Promise<boolean> => {
    return getObjectByID(ioBContext, id).then(
        (result) => {
            return result && result !== null && result !== undefined ? true : false;
        },
        (error) => {
            error;
            return false;
        },
    );
};

export const ObjectStateHelper = {
    getObjectByID: getObjectByID,
    getStateByID: getStateByID,
    getStateValueByID: getStateValueByID,
    setMemebersIDForEnumByID: setMemebersIDForEnumByID,
    isIDExisting: isIDExisting,
};
