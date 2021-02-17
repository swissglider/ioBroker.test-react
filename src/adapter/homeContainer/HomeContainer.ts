import FunctionHelper from './FunctionHelper';

export type T_STATE_MEMBERS = { id: string; fType: string }[];
export type T_STATE_MEMBERS_VALUE = {
    [fType: string]: {
        av?: number;
        max?: number;
        min?: number;
        sum?: number;
        on?: boolean;
        all: { id: string; state?: ioBroker.State; fromChild: boolean }[]; // fromChild if the state is from a child
    };
};

export class HomeContainer {
    id: string;
    object: ioBroker.Object;
    #parentContainer: HomeContainer | undefined;
    childrenHomeContainers: HomeContainer[] = [];
    #adapter: any;
    stateMembersValue: T_STATE_MEMBERS_VALUE = {};
    #initialized: 'none' | 'loading' | 'ok' | 'error' = 'none';
    #error: string | undefined = '';

    public constructor(
        id: string,
        object: ioBroker.Object,
        parentContainer: HomeContainer | undefined = undefined,
        adapter: ioBroker.Adapter,
    ) {
        this.id = id;
        this.object = object;
        this.#parentContainer = parentContainer;
        this.#adapter = adapter;
    }

    public init = (): Promise<void> => {
        const generateHomeContainers = (): Promise<void> => {
            const _initChildHC = (member: string): Promise<void> => {
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

            return new Promise((resolve, reject) => {
                try {
                    //generate Object for the HC
                    const folderName = this.#adapter.namespace + '.homeContainers.' + this.id.replace(/\./g, '_');
                    this.#adapter
                        .setObjectNotExistsAsync(folderName, {
                            type: 'device',
                            common: {
                                name: `${this.id.replace('enum.', '')}`,
                            },
                            native: {},
                        })
                        .then(() => {
                            if (this.object.common.members === null || this.object.common.members === undefined) {
                                this.#initialized = 'ok';
                                resolve();
                            }
                            const promises = [];
                            for (const member of this.object.common.members) {
                                if (member.startsWith('enum.')) {
                                    promises.push(_initChildHC(member));
                                } else {
                                    promises.push(this.addStateMember(member));
                                }
                            }
                            Promise.allSettled(promises)
                                .then((arr) => {
                                    if (arr.map((r) => r.status).every((s) => s === 'fulfilled')) {
                                        this.#initialized = 'ok';
                                        this.#adapter
                                            .setObjectNotExistsAsync(folderName + '.childrenList', {
                                                type: 'state',
                                                common: {
                                                    name: `${this.id.replace('enum_', '')} - children list`,
                                                },
                                                native: {},
                                            })
                                            .then(() => {
                                                this.#adapter.setStateChangedAsync(folderName + '.childrenList', {
                                                    val: this.childrenHomeContainers.map((hc) => hc.id),
                                                    ack: true,
                                                });
                                            });
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
                        });
                } catch (err) {
                    // TODO ERRORHANDLING
                    this.#initialized = 'error';
                    this.#error = err.message;
                    reject(new Error(this.#error));
                }
            });
        };

        return generateHomeContainers();
    };

    /**
     *
     * @param memberID
     * @param fromChild fromChild if the state is from a child
     * @param memberIDs already calculated memeberIDS from a child
     */
    public addStateMember(memberID: string, fromChild = false): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                const fTypes: T_STATE_MEMBERS | undefined = FunctionHelper.getMachingStateMembers(memberID);
                if (fTypes === undefined) resolve();
                for (const { id, fType } of fTypes as T_STATE_MEMBERS) {
                    if (!(fType in this.stateMembersValue)) {
                        this.stateMembersValue[fType] = { all: [{ id: id, fromChild: fromChild }] };
                    } else {
                        if (this.stateMembersValue[fType].all.findIndex((a) => a.id === id) === -1) {
                            this.stateMembersValue[fType].all.push({ id: id, fromChild: fromChild });
                        }
                    }
                }

                if (this.#parentContainer !== undefined) {
                    this.#parentContainer
                        .addStateMember(memberID, true)
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

    /**
     * Update the stateMembersValue. If id and value is given it changes first the value and then updates
     * if id or state are null/undefined, all the value will be new calculated.
     * @param fType function type to calculate
     * @param id id to update
     * @param state state to update
     */
    private _updateValue = (fType: string, id: string | undefined, state: ioBroker.State | undefined): void => {
        //check if id or state is null/undefined if not, the state will be set to the new state
        if (id !== null && id !== undefined && state !== null && state !== undefined) {
            this.stateMembersValue[fType].all.some((e) => e.id === id && (e.state = state));
        }

        const oldValue = { ...this.stateMembersValue[fType] };

        const allValues = this.stateMembersValue[fType].all
            .filter((e) => e.state !== undefined)
            .map((ee) => (ee.state !== undefined ? ee.state.val : undefined));
        if (allValues.every((e) => typeof e === 'boolean')) {
            this.stateMembersValue[fType]['on'] = allValues.some((e) => e);
        } else if (allValues.every((e) => typeof e === 'number')) {
            this.stateMembersValue[fType]['av'] =
                Math.round(((allValues as number[]).reduce((a, b) => a + b, 0) / allValues.length) * 10) / 10;
            this.stateMembersValue[fType]['max'] = Math.round(Math.max(...(allValues as number[])) * 10) / 10;
            this.stateMembersValue[fType]['min'] = Math.round(Math.min(...(allValues as number[])) * 10) / 10;
            // this.stateMembersValue[fType]['sum'] =
            //     Math.round((allValues as number[]).reduce((a, b) => a + b, 0) * 10) / 10;
        }
        // write to states
        const folderName = this.#adapter.namespace + '.homeContainers.' + this.id.replace(/\./g, '_');
        const stateFolderID = folderName + '.' + fType.replace(/\./g, '_');

        let same = true;
        if (Object.keys(oldValue).length === Object.keys(this.stateMembersValue[fType]).length) {
            for (const key of Object.keys(oldValue)) {
                if (
                    key !== 'all' &&
                    key !== 'sum' &&
                    key in oldValue &&
                    key in this.stateMembersValue[fType] &&
                    (oldValue as Record<string, any>)[key] !==
                        (this.stateMembersValue[fType] as Record<string, any>)[key]
                ) {
                    same = false;
                }
            }
        }
        // if (same) return;
        this.#adapter.getForeignObjectAsync(fType, 'enum').then((enumT: ioBroker.Enum) => {
            const enumFunction = { ...enumT };
            delete enumFunction.native;
            delete enumFunction.common.members;
            delete enumFunction.enums;
            delete enumFunction.acl;
            delete enumFunction.ts;
            delete enumFunction.user;
            delete enumFunction.from;
            delete enumFunction.type;
            this.#adapter
                .getForeignObjectAsync(this.stateMembersValue[fType].all[0].id)
                .then((sampleObject: ioBroker.Object) => {
                    this.#adapter
                        .setObjectNotExistsAsync(stateFolderID, {
                            type: 'channel',
                            common: {
                                name: 'Overall Values for Type: ' + fType,
                                type: sampleObject.common.type,
                                role: sampleObject.common.role,
                                read: sampleObject.common.read,
                                write: sampleObject.common.write,
                                desc: sampleObject.common.desc !== undefined ? sampleObject.common.desc : undefined,
                                max: sampleObject.common.max !== undefined ? sampleObject.common.max : undefined,
                                min: sampleObject.common.min !== undefined ? sampleObject.common.min : undefined,
                                unit: sampleObject.common.unit !== undefined ? sampleObject.common.unit : undefined,
                            },
                            native: {
                                enumFunction: enumFunction,
                            },
                        })
                        .then(() => {
                            for (const [key, value] of Object.entries(this.stateMembersValue[fType])) {
                                if (key !== 'all') {
                                    const stateID = stateFolderID + '.' + key;
                                    this.#adapter
                                        .setObjectNotExistsAsync(stateID, {
                                            type: 'state',
                                            common: {
                                                name: `${key}`,
                                                type: sampleObject.common.type,
                                                role: sampleObject.common.role,
                                                read: sampleObject.common.read,
                                                write: sampleObject.common.write,
                                                desc:
                                                    sampleObject.common.desc !== undefined
                                                        ? sampleObject.common.desc
                                                        : undefined,
                                                max:
                                                    sampleObject.common.max !== undefined
                                                        ? sampleObject.common.max
                                                        : undefined,
                                                min:
                                                    sampleObject.common.min !== undefined
                                                        ? sampleObject.common.min
                                                        : undefined,
                                                unit:
                                                    sampleObject.common.unit !== undefined
                                                        ? sampleObject.common.unit
                                                        : undefined,
                                            },
                                            native: {
                                                enumFunction: enumFunction,
                                            },
                                        })
                                        .then(() => {
                                            this.#adapter.setStateChangedAsync(stateID, {
                                                val: value,
                                                ack: true,
                                            });
                                        });
                                }
                            }
                            // console.log(
                            //     `${
                            //         typeof this.object.common.name === 'string'
                            //             ? this.object.common.name
                            //             : 'de' in this.object.common.name
                            //             ? this.object.common.name.de
                            //             : this.object.common.name.en
                            //     } -> ${fType} -> ${JSON.stringify(
                            //         Object.fromEntries(
                            //             Object.entries(this.stateMembersValue[fType]).filter(([key]) => key !== 'all'),
                            //         ),
                            //     )}`,
                            // );
                            // console.log(
                            //     `${fType} -> ${JSON.stringify(
                            //         Object.fromEntries(
                            //             Object.entries(this.stateMembersValue[fType]).filter(([key]) => key !== 'all'),
                            //         ),
                            //     )} --- ${JSON.stringify(
                            //         Object.fromEntries(Object.entries(oldValue).filter(([key]) => key !== 'all')),
                            //     )}`,
                            // );
                        });
                });
        });
    };

    /**
     * calculates all the values (av, max, min, sum, on) for the first time and the same for all the childrens
     */
    public initValuesCalculation = async (): Promise<void | Error> => {
        /**
         * calculates all the values (av, max, min, sum, on) for the first time
         */
        const _initValuesCalculationAllTpyes = (): Promise<void | Error> => {
            /**
             * Calculate all the the values (av, max, min, sum, on) tor a specific function Type (fType)
             * @param fType type to by calculated
             * @param members
             */
            const _initValuesCalculationPerType = (fType: string): Promise<void | Error> => {
                const _getForeignStateAsync = (id: string): Promise<{ id: string; state: ioBroker.State }> => {
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

                return new Promise((resolve, reject) => {
                    try {
                        const promises = [];
                        for (const ins of this.stateMembersValue[fType].all) {
                            promises.push(_getForeignStateAsync(ins.id));
                        }
                        Promise.all(promises)
                            .then((states: { id: string; state: ioBroker.State }[]) => {
                                states
                                    .filter((stateV) => stateV.state !== null)
                                    .forEach((stateV) => this._updateValue(fType, stateV.id, stateV.state));
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

            return new Promise((resolve, reject) => {
                try {
                    const promises = [];
                    for (const [key, value] of Object.entries(this.stateMembersValue)) {
                        if (value !== undefined) promises.push(_initValuesCalculationPerType(key));
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
        return new Promise((resolve, reject) => {
            if (!this.isReady) reject('Not yet ready');
            try {
                const promises = [_initValuesCalculationAllTpyes()];
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

    public aChangedStateToCheck = (id: string, state: ioBroker.State): void => {
        const type = this._getTypeOfState(id);
        if (type === undefined) return;
        if (state !== null && state !== undefined) this._updateValue(type, id, state);
        for (const hc of this.childrenHomeContainers) {
            hc.aChangedStateToCheck(id, state);
        }
    };

    public aDeleteStateToCheck = (id: string): void => {
        const type = this._getTypeOfState(id);
        if (type === undefined) return;
        this.stateMembersValue[type].all = this.stateMembersValue[type].all.filter((e) => e.id !== id);
        this._updateValue(type, undefined, undefined);
        for (const hc of this.childrenHomeContainers) {
            hc.aDeleteStateToCheck(id);
        }
    };

    public getAllStates = (): string[] => {
        return Object.values(this.stateMembersValue)
            .map((v) => v.all.map((e) => e.id))
            .reduce((values, ids) => [...values, ...ids], []);
    };

    private _getTypeOfState = (id: string): string | undefined => {
        for (const [key, value] of Object.entries(this.stateMembersValue)) {
            if (value.all.map((e) => e.id).includes(id)) return key;
        }
        return undefined;
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
