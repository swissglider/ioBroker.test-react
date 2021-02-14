"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allFunctionsStateListe = void 0;
exports.allFunctionsStateListe = {};
const generateAllFunctionsStateList = (adapter) => {
    return new Promise((resolve, reject) => {
        try {
            const startTime = Date.now();
            adapter.getForeignObjectsAsync('enum.functions.*', 'enum').then((allEnums) => {
                exports.allFunctionsStateListe = { ...allEnums };
                const endTime = Date.now();
                console.log(`allFunctionStateListe loaded in ${endTime - startTime}ms`);
                resolve();
            });
        }
        catch (err) {
            // TODO ERRORHANDLING
            reject(err);
        }
    });
};
const getMachingStateMembers = (id) => {
    let result = undefined;
    for (const [fId, fValue] of Object.entries(exports.allFunctionsStateListe)) {
        const tArray = fValue.common.members.filter((e) => e.startsWith(id));
        if (tArray.length > 0) {
            if (result === undefined)
                result = {};
            if (result[fId] === undefined)
                result[fId] = { members: tArray };
            else
                result[fId].members = tArray;
        }
    }
    return result;
};
const FunctionHelper = {
    generateAllFunctionsStateList: generateAllFunctionsStateList,
    getMachingStateMembers: getMachingStateMembers,
};
exports.default = FunctionHelper;