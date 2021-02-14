import { AdapterInstance } from '@iobroker/adapter-core';
import FunctionHelper from './FunctionHelper';

export type T_STATE_MEMBERS = { [key: string]: { members: string[] } };
export type T_STATE_MEMBERS_VALUE = {
    [key: string]: {
        av?: number;
        max?: number;
        min?: number;
        sum?: number;
        on?: boolean;
        all: { id: string; val: any }[];
    };
};

export class HomeContainer {
    id: string;
    object: ioBroker.Object;
    #parentContainer: HomeContainer | undefined;
    childrenHomeContainers: HomeContainer[] = [];
    #adapter: any;
    stateMembers: T_STATE_MEMBERS = {};
    stateMembersValue: T_STATE_MEMBERS_VALUE = {};
    #initialized: 'none' | 'loading' | 'ok' | 'error' = 'none';
    #error: string | undefined = '';

    public constructor(
        id: string,
        object: ioBroker.Object,
        parentContainer: HomeContainer | undefined = undefined,
        adapter: AdapterInstance,
    ) {
        this.id = id;
        this.object = object;
        this.#parentContainer = parentContainer;
        this.#adapter = adapter;
    }

    public init(): Promise<void> {
        return this.generateChildrenHomeContainers();
    }

    private _initChildHC = (member: string): Promise<void> => {
        return new Promise((resolve, reject) => {
            try {
                this.#adapter
                    .getForeignObjectAsync(member, 'enum')
                    .then((obj: ioBroker.Object) => {
                        const tempHC = new HomeContainer(member, obj, this, this.#adapter);
                        tempHC
                            .init()
                            .then(() => {
                                this.childrenHomeContainers.push(tempHC);
                                resolve();
                            })
                            .catch((err: any) => {
                                // TODO ERRORHANDLING
                                this.#initialized = 'error';
                                this.#error = err.message;
                                reject(new Error(this.#error));
                            });
                    })
                    .catch((err: any) => {
                        // TODO ERRORHANDLING
                        this.#initialized = 'error';
                        this.#error = err.message;
                        reject(new Error(this.#error));
                    });
            } catch (err) {
                // TODO ERRORHANDLING
                this.#initialized = 'error';
                this.#error = err.message;
                reject(new Error(this.#error));
            }
        });
    };

    private generateChildrenHomeContainers(): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                if (this.object.common.members === null || this.object.common.members === undefined) {
                    this.#initialized = 'ok';
                    resolve();
                }
                const promises = [];
                for (const member of this.object.common.members) {
                    if (member.startsWith('enum.')) {
                        promises.push(this._initChildHC(member));
                    } else {
                        promises.push(this.addStateMember(member));
                    }
                }
                Promise.allSettled(promises)
                    .then((arr) => {
                        if (arr.map((r) => r.status).every((s) => s === 'fulfilled')) {
                            this.#initialized = 'ok';
                            resolve();
                        } else {
                            // TODO ERRORHANDLING
                            this.#initialized = 'error';
                            this.#error = 'not all children are successfully loaded';
                            reject(new Error(this.#error));
                        }
                    })
                    .catch((err: any) => {
                        // TODO ERRORHANDLING
                        this.#initialized = 'error';
                        this.#error = err.message;
                        reject(new Error(this.#error));
                    });
            } catch (err) {
                // TODO ERRORHANDLING
                this.#initialized = 'error';
                this.#error = err.message;
                reject(new Error(this.#error));
            }
        });
    }

    /**
     *
     * @param memberID
     * @param fresh if the same members has not yet been asked for by any children
     * @param memberIDs already calculated memeberIDS from a child
     */
    public addStateMember(memberID: string, fresh = true, memberIDs?: T_STATE_MEMBERS): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                if (fresh || memberIDs === undefined) {
                    const fTypes: T_STATE_MEMBERS | undefined = FunctionHelper.getMachingStateMembers(memberID);
                    if (fTypes === undefined) resolve();
                    for (const fType of Object.keys(fTypes as T_STATE_MEMBERS)) {
                        if (!(fType in this.stateMembers)) {
                            this.stateMembers[fType] = { members: [] };
                        }
                    }
                    memberIDs = fTypes as T_STATE_MEMBERS;
                }

                for (const fType of Object.keys(memberIDs)) {
                    if (this.stateMembers[fType] === undefined) this.stateMembers[fType] = { members: [] };
                    this.stateMembers[fType].members = [
                        ...new Set([...this.stateMembers[fType].members, ...memberIDs[fType].members]),
                    ];
                }

                if (this.#parentContainer !== undefined) {
                    this.#parentContainer
                        .addStateMember(memberID, false)
                        .then(() => {
                            resolve();
                        })
                        .catch((err: any) => {
                            // TODO ERRORHANDLING
                            this.#initialized = 'error';
                            this.#error = err.message;
                            reject(new Error(this.#error));
                        });
                } else {
                    resolve();
                }
            } catch (err) {
                // TODO ERRORHANDLING
                this.#initialized = 'error';
                this.#error = err.message;
                reject(new Error(this.#error));
            }
        });
    }

    private _getForeignStateAsync = (id: string): Promise<{ id: string; state: ioBroker.State }> => {
        return new Promise((resolve, reject) => {
            this.#adapter
                .getForeignStateAsync(id)
                .then((state: ioBroker.State) => {
                    resolve({ id: id, state: state });
                })
                .catch((err: any) => {
                    // TODO ERRORHANDLING
                    this.#initialized = 'error';
                    this.#error = err.message;
                    reject(new Error(this.#error));
                });
        });
    };

    private _initValuesCalculationPerType = (type: string, members: string[]): Promise<void | Error> => {
        return new Promise((resolve, reject) => {
            try {
                const promises = [];
                for (const id of members) {
                    promises.push(this._getForeignStateAsync(id));
                }
                Promise.all(promises)
                    .then((states: { id: string; state: ioBroker.State }[]) => {
                        const allValues = states
                            .filter((stateV) => stateV.state !== null)
                            .map((stateV) => stateV.state.val);
                        const allValuesID = states
                            .filter((stateV) => stateV.state !== null)
                            .map((stateV) => ({
                                id: stateV.id,
                                val: stateV.state.val,
                            }));
                        this.stateMembersValue[type] = { all: allValuesID };
                        if (allValues.every((e) => typeof e === 'boolean')) {
                            this.stateMembersValue[type]['on'] = allValues.some((e) => e);
                        } else if (allValues.every((e) => typeof e === 'number')) {
                            this.stateMembersValue[type]['av'] =
                                (allValues as number[]).reduce((a, b) => a + b, 0) / allValues.length;
                            this.stateMembersValue[type]['max'] = Math.max(...(allValues as number[]));
                            this.stateMembersValue[type]['min'] = Math.min(...(allValues as number[]));
                            this.stateMembersValue[type]['sum'] = (allValues as number[]).reduce((a, b) => a + b, 0);
                        }
                        resolve();
                    })
                    .catch((err: any) => {
                        // TODO ERRORHANDLING
                        this.#initialized = 'error';
                        this.#error = err.message;
                        reject(new Error(this.#error));
                    });
            } catch (err) {
                // TODO ERRORHANDLING
                reject(err);
            }
        });
    };

    private _initValuesCalculationAllTpyes = (): Promise<void | Error> => {
        return new Promise((resolve, reject) => {
            try {
                const promises = [];
                for (const [key, value] of Object.entries(this.stateMembers)) {
                    if (value !== undefined) promises.push(this._initValuesCalculationPerType(key, value.members));
                }
                Promise.allSettled(promises)
                    .then((arr) => {
                        if (arr.map((r) => r.status).every((s) => s === 'fulfilled')) {
                            resolve();
                        } else {
                            // TODO ERRORHANDLING
                            reject(new Error('error while calculating the HomeContainers values'));
                        }
                    })
                    .catch((err: any) => {
                        // TODO ERRORHANDLING
                        this.#initialized = 'error';
                        this.#error = err.message;
                        reject(new Error(this.#error));
                    });
            } catch (err) {
                // TODO ERRORHANDLING
                reject(err);
            }
        });
    };

    public initValuesCalculation = async (): Promise<void | Error> => {
        return new Promise((resolve, reject) => {
            if (!this.isReady) reject('Not yet ready');
            try {
                const promises = [this._initValuesCalculationAllTpyes()];
                for (const hc of this.childrenHomeContainers) {
                    promises.push(hc.initValuesCalculation());
                }
                Promise.allSettled(promises)
                    .then((arr) => {
                        if (arr.map((r) => r.status).every((s) => s === 'fulfilled')) {
                            resolve();
                        } else {
                            // TODO ERRORHANDLING
                            reject(new Error('error while calculating the HomeContainers values'));
                        }
                    })
                    .catch((err: any) => {
                        // TODO ERRORHANDLING
                        this.#initialized = 'error';
                        this.#error = err.message;
                        reject(new Error(this.#error));
                    });
            } catch (err) {
                // TODO ERRORHANDLING
                reject(err);
            }
        });
    };

    public getAllStates = (): string[] => {
        return Object.values(this.stateMembers)
            .map((v) => v.members)
            .reduce((values, ids) => ({ ...values, ...ids }));
    };

    public getID(): string | undefined {
        if (!this.isReady) return undefined;
        return this.id;
    }

    public isReady(): boolean {
        return this.#initialized === 'ok';
    }

    public isRError(): string | undefined {
        return this.#error;
    }
}
