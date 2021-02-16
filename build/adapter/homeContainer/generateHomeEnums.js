"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aDeleteStateToCheck = exports.aChangedStateToCheck = exports.generateHomeEnums = exports.subscribeToAllStates = exports.unsubscribeToAllStates = exports.calculateHomeContainerValues = void 0;
const HomeContainer_1 = require("./HomeContainer");
const calculateHomeContainerValues = (homeContainer) => {
    return new Promise((resolve, reject) => {
        try {
            const startTime = Date.now();
            const promises = [];
            for (const hc of homeContainer) {
                promises.push(hc.initValuesCalculation());
            }
            Promise.allSettled(promises)
                .then((arr) => {
                if (arr.map((r) => r.status).every((s) => s === 'fulfilled')) {
                    const endTime = Date.now();
                    console.log(`calculateHomeContainerValues in ${endTime - startTime}ms`);
                    resolve();
                }
                else {
                    // TODO ERRORHANDLING
                    console.log(arr);
                    reject(new Error('error while calculating the HomeContainers values'));
                }
            })
                .catch((err) => {
                // TODO ERRORHANDLING
                reject(err);
            });
        }
        catch (err) {
            // TODO ERRORHANDLING
            reject(err);
        }
    });
};
exports.calculateHomeContainerValues = calculateHomeContainerValues;
const unsubscribeToAllStates = async (adapter, homeContainer) => {
    const ids = homeContainer.map((hc) => hc.getAllStates()).reduce((values, ids) => [...values, ...ids]);
    for (const id of ids) {
        await adapter.unsubscribeForeignStatesAsync(id);
    }
};
exports.unsubscribeToAllStates = unsubscribeToAllStates;
const subscribeToAllStates = (adapter, homeContainer) => {
    const initV = [];
    homeContainer
        .map((hc) => hc.getAllStates())
        .reduce((values, ids) => [...values, ...ids], initV)
        .map((id) => adapter.subscribeForeignStates(id));
};
exports.subscribeToAllStates = subscribeToAllStates;
const generateHomeEnums = (adapter) => {
    return new Promise((resolve, reject) => {
        try {
            const startTime = Date.now();
            adapter
                .getForeignObjectsAsync('enum.home.*', 'enum')
                .then((allEnums) => {
                const homeContainers = [];
                const promises = [];
                for (const [id, value] of Object.entries(allEnums)) {
                    const tmpHC = new HomeContainer_1.HomeContainer(id, value, undefined, adapter);
                    promises.push(tmpHC.init().then(() => homeContainers.push(tmpHC)));
                }
                Promise.allSettled(promises)
                    .then((arr) => {
                    if (arr.map((r) => r.status).every((s) => s === 'fulfilled')) {
                        const endTime = Date.now();
                        console.log(`HomeContainers loaded in ${endTime - startTime}ms`);
                        resolve(homeContainers);
                    }
                    else {
                        // TODO ERRORHANDLING
                        reject(new Error('not all children are successfully loaded'));
                    }
                })
                    .catch((err) => {
                    // TODO ERRORHANDLING
                    reject(err);
                });
            })
                .catch((err) => {
                // TODO ERRORHANDLING
                reject(err);
            });
        }
        catch (err) {
            // TODO ERRORHANDLING
            reject(err);
        }
    });
};
exports.generateHomeEnums = generateHomeEnums;
const aChangedStateToCheck = (homeContainer, id, state) => homeContainer.forEach((hc) => hc.aChangedStateToCheck(id, state));
exports.aChangedStateToCheck = aChangedStateToCheck;
const aDeleteStateToCheck = (homeContainer, id) => homeContainer.forEach((hc) => hc.aDeleteStateToCheck(id));
exports.aDeleteStateToCheck = aDeleteStateToCheck;
