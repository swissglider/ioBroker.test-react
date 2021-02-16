import { AdapterInstance } from '@iobroker/adapter-core';
import { HomeContainer } from './HomeContainer';

export const calculateHomeContainerValues = (homeContainer: HomeContainer[]): Promise<void | Error> => {
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
                    } else {
                        // TODO ERRORHANDLING
                        console.log(arr);
                        reject(new Error('error while calculating the HomeContainers values'));
                    }
                })
                .catch((err: any) => {
                    // TODO ERRORHANDLING
                    reject(err);
                });
        } catch (err) {
            // TODO ERRORHANDLING
            reject(err);
        }
    });
};

export const unsubscribeToAllStates = async (
    adapter: AdapterInstance,
    homeContainer: HomeContainer[],
): Promise<void> => {
    const ids = homeContainer.map((hc) => hc.getAllStates()).reduce((values, ids) => [...values, ...ids]);
    for (const id of ids) {
        await adapter.unsubscribeForeignStatesAsync(id);
    }
};

export const subscribeToAllStates = (adapter: AdapterInstance, homeContainer: HomeContainer[]): void => {
    const initV: string[] = [];
    homeContainer
        .map((hc) => hc.getAllStates())
        .reduce((values, ids) => [...values, ...ids], initV)
        .map((id) => adapter.subscribeForeignStates(id));
};

export const generateHomeEnums = (adapter: AdapterInstance): Promise<HomeContainer[]> => {
    return new Promise((resolve, reject) => {
        try {
            const startTime = Date.now();
            adapter
                .getForeignObjectsAsync('enum.home.*', 'enum')
                .then((allEnums: any) => {
                    const homeContainers: HomeContainer[] = [];
                    const promises = [];
                    for (const [id, value] of Object.entries(allEnums)) {
                        const tmpHC = new HomeContainer(id, value as ioBroker.Object, undefined, adapter);
                        promises.push(tmpHC.init().then(() => homeContainers.push(tmpHC)));
                    }
                    Promise.allSettled(promises)
                        .then((arr) => {
                            if (arr.map((r) => r.status).every((s) => s === 'fulfilled')) {
                                const endTime = Date.now();
                                console.log(`HomeContainers loaded in ${endTime - startTime}ms`);
                                resolve(homeContainers);
                            } else {
                                // TODO ERRORHANDLING
                                reject(new Error('not all children are successfully loaded'));
                            }
                        })
                        .catch((err: any) => {
                            // TODO ERRORHANDLING
                            reject(err);
                        });
                })
                .catch((err: any) => {
                    // TODO ERRORHANDLING
                    reject(err);
                });
        } catch (err) {
            // TODO ERRORHANDLING
            reject(err);
        }
    });
};

export const aChangedStateToCheck = (homeContainer: HomeContainer[], id: string, state: ioBroker.State): void =>
    homeContainer.forEach((hc: HomeContainer) => hc.aChangedStateToCheck(id, state));

export const aDeleteStateToCheck = (homeContainer: HomeContainer[], id: string): void =>
    homeContainer.forEach((hc: HomeContainer) => hc.aDeleteStateToCheck(id));
