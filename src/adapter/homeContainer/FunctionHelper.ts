import { T_MEMBER_STATE_IDS } from './HomeContainer';

export let allFunctionsStateListe: { [key: string]: ioBroker.Enum } = {};

const generateAllFunctionsStateList = async (adapter: ioBroker.Adapter): Promise<void> => {
    const allEnums = await adapter.getForeignObjectsAsync('enum.functions.*', 'enum');
    allFunctionsStateListe = { ...allEnums };
};

const getMachingStateMembers = (id: string): T_MEMBER_STATE_IDS => {
    const result: T_MEMBER_STATE_IDS = {};
    for (const [fType, fValue] of Object.entries(allFunctionsStateListe)) {
        const tArray: string[] = fValue.common.members.filter((e: string) => e.startsWith(id));
        if (tArray.length > 0) {
            if (!(fType in result)) result[fType] = [];
            for (const _id of tArray) {
                result[fType].push(_id);
            }
        }
    }
    return result;
};

const FunctionHelper = {
    generateAllFunctionsStateList: generateAllFunctionsStateList,
    getMachingStateMembers: getMachingStateMembers,
};

export default FunctionHelper;
