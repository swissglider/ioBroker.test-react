"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allFunctionsStateListe = void 0;
exports.allFunctionsStateListe = {};
const generateAllFunctionsStateList = async (adapter) => {
    const allEnums = await adapter.getForeignObjectsAsync('enum.functions.*', 'enum');
    exports.allFunctionsStateListe = { ...allEnums };
};
const getMachingStateMembers = (id) => {
    const result = {};
    for (const [fType, fValue] of Object.entries(exports.allFunctionsStateListe)) {
        const tArray = fValue.common.members.filter((e) => e.startsWith(id));
        if (tArray.length > 0) {
            if (!(fType in result))
                result[fType] = [];
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
exports.default = FunctionHelper;
