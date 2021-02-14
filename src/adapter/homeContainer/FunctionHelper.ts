import { AdapterInstance } from '@iobroker/adapter-core';
import { T_STATE_MEMBERS } from './HomeContainer';

export let allFunctionsStateListe: { [key: string]: ioBroker.Enum } = {};

const generateAllFunctionsStateList = (adapter: AdapterInstance): Promise<void> => {
    return new Promise((resolve, reject) => {
        try {
            const startTime = Date.now();
            adapter.getForeignObjectsAsync('enum.functions.*', 'enum').then((allEnums: any) => {
                allFunctionsStateListe = { ...allEnums };
                const endTime = Date.now();
                console.log(`allFunctionStateListe loaded in ${endTime - startTime}ms`);
                resolve();
            });
        } catch (err) {
            // TODO ERRORHANDLING
            reject(err);
        }
    });
};

const getMachingStateMembers = (id: string): T_STATE_MEMBERS | undefined => {
    let result: T_STATE_MEMBERS | undefined = undefined;
    for (const [fId, fValue] of Object.entries(allFunctionsStateListe)) {
        const tArray: string[] = fValue.common.members.filter((e: string) => e.startsWith(id));
        if (tArray.length > 0) {
            if (result === undefined) result = {};
            if (result[fId] === undefined) result[fId] = { members: tArray };
            else result[fId].members = tArray;
        }
    }
    return result;
};

const FunctionHelper = {
    generateAllFunctionsStateList: generateAllFunctionsStateList,
    getMachingStateMembers: getMachingStateMembers,
};

export default FunctionHelper;