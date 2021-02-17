"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _parentContainer, _adapter, _initialized, _error;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeContainer = void 0;
const FunctionHelper_1 = __importDefault(require("./FunctionHelper"));
class HomeContainer {
    constructor(id, object, parentContainer = undefined, adapter) {
        _parentContainer.set(this, void 0);
        this.childrenHomeContainers = [];
        _adapter.set(this, void 0);
        this.stateMembersValue = {};
        _initialized.set(this, 'none');
        _error.set(this, '');
        this.init = () => {
            const generateHomeContainers = () => {
                const _initChildHC = (member) => {
                    return new Promise((resolve, reject) => {
                        try {
                            __classPrivateFieldGet(this, _adapter).getForeignObjectAsync(member, 'enum')
                                .then((obj) => {
                                const tempHC = new HomeContainer(member, obj, this, __classPrivateFieldGet(this, _adapter));
                                tempHC
                                    .init()
                                    .then(() => {
                                    this.childrenHomeContainers.push(tempHC);
                                    resolve();
                                })
                                    .catch((err) => {
                                    // TODO ERRORHANDLING
                                    __classPrivateFieldSet(this, _initialized, 'error');
                                    __classPrivateFieldSet(this, _error, err.message);
                                    reject(new Error(__classPrivateFieldGet(this, _error)));
                                });
                            })
                                .catch((err) => {
                                // TODO ERRORHANDLING
                                __classPrivateFieldSet(this, _initialized, 'error');
                                __classPrivateFieldSet(this, _error, err.message);
                                reject(new Error(__classPrivateFieldGet(this, _error)));
                            });
                        }
                        catch (err) {
                            // TODO ERRORHANDLING
                            __classPrivateFieldSet(this, _initialized, 'error');
                            __classPrivateFieldSet(this, _error, err.message);
                            reject(new Error(__classPrivateFieldGet(this, _error)));
                        }
                    });
                };
                return new Promise((resolve, reject) => {
                    try {
                        //generate Object for the HC
                        const folderName = __classPrivateFieldGet(this, _adapter).namespace + '.homeContainers.' + this.id.replace(/\./g, '_');
                        __classPrivateFieldGet(this, _adapter).setObjectNotExistsAsync(folderName, {
                            type: 'device',
                            common: {
                                name: `${this.id.replace('enum.', '')}`,
                            },
                            native: {},
                        })
                            .then(() => {
                            if (this.object.common.members === null || this.object.common.members === undefined) {
                                __classPrivateFieldSet(this, _initialized, 'ok');
                                resolve();
                            }
                            const promises = [];
                            for (const member of this.object.common.members) {
                                if (member.startsWith('enum.')) {
                                    promises.push(_initChildHC(member));
                                }
                                else {
                                    promises.push(this.addStateMember(member));
                                }
                            }
                            Promise.allSettled(promises)
                                .then((arr) => {
                                if (arr.map((r) => r.status).every((s) => s === 'fulfilled')) {
                                    __classPrivateFieldSet(this, _initialized, 'ok');
                                    __classPrivateFieldGet(this, _adapter).setObjectNotExistsAsync(folderName + '.childrenList', {
                                        type: 'state',
                                        common: {
                                            name: `${this.id.replace('enum_', '')} - children list`,
                                        },
                                        native: {},
                                    })
                                        .then(() => {
                                        __classPrivateFieldGet(this, _adapter).setStateChangedAsync(folderName + '.childrenList', {
                                            val: this.childrenHomeContainers.map((hc) => hc.id),
                                            ack: true,
                                        });
                                    });
                                    resolve();
                                }
                                else {
                                    // TODO ERRORHANDLING
                                    __classPrivateFieldSet(this, _initialized, 'error');
                                    __classPrivateFieldSet(this, _error, 'not all children are successfully loaded');
                                    reject(new Error(__classPrivateFieldGet(this, _error)));
                                }
                            })
                                .catch((err) => {
                                // TODO ERRORHANDLING
                                __classPrivateFieldSet(this, _initialized, 'error');
                                __classPrivateFieldSet(this, _error, err.message);
                                reject(new Error(__classPrivateFieldGet(this, _error)));
                            });
                        });
                    }
                    catch (err) {
                        // TODO ERRORHANDLING
                        __classPrivateFieldSet(this, _initialized, 'error');
                        __classPrivateFieldSet(this, _error, err.message);
                        reject(new Error(__classPrivateFieldGet(this, _error)));
                    }
                });
            };
            return generateHomeContainers();
        };
        /**
         * Update the stateMembersValue. If id and value is given it changes first the value and then updates
         * if id or state are null/undefined, all the value will be new calculated.
         * @param fType function type to calculate
         * @param id id to update
         * @param state state to update
         */
        this._updateValue = (fType, id, state) => {
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
            }
            else if (allValues.every((e) => typeof e === 'number')) {
                this.stateMembersValue[fType]['av'] =
                    Math.round((allValues.reduce((a, b) => a + b, 0) / allValues.length) * 10) / 10;
                this.stateMembersValue[fType]['max'] = Math.round(Math.max(...allValues) * 10) / 10;
                this.stateMembersValue[fType]['min'] = Math.round(Math.min(...allValues) * 10) / 10;
                // this.stateMembersValue[fType]['sum'] =
                //     Math.round((allValues as number[]).reduce((a, b) => a + b, 0) * 10) / 10;
            }
            // write to states
            const folderName = __classPrivateFieldGet(this, _adapter).namespace + '.homeContainers.' + this.id.replace(/\./g, '_');
            const stateFolderID = folderName + '.' + fType.replace(/\./g, '_');
            let same = true;
            if (Object.keys(oldValue).length === Object.keys(this.stateMembersValue[fType]).length) {
                for (const key of Object.keys(oldValue)) {
                    if (key !== 'all' &&
                        key !== 'sum' &&
                        key in oldValue &&
                        key in this.stateMembersValue[fType] &&
                        oldValue[key] !==
                            this.stateMembersValue[fType][key]) {
                        same = false;
                    }
                }
            }
            // if (same) return;
            __classPrivateFieldGet(this, _adapter).getForeignObjectAsync(fType, 'enum').then((enumT) => {
                const enumFunction = { ...enumT };
                delete enumFunction.native;
                delete enumFunction.common.members;
                delete enumFunction.enums;
                delete enumFunction.acl;
                delete enumFunction.ts;
                delete enumFunction.user;
                delete enumFunction.from;
                delete enumFunction.type;
                __classPrivateFieldGet(this, _adapter).getForeignObjectAsync(this.stateMembersValue[fType].all[0].id)
                    .then((sampleObject) => {
                    __classPrivateFieldGet(this, _adapter).setObjectNotExistsAsync(stateFolderID, {
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
                            icon: enumFunction.common.icon,
                        },
                        native: {
                            enumFunction: enumFunction,
                        },
                    })
                        .then(() => {
                        for (const [key, value] of Object.entries(this.stateMembersValue[fType])) {
                            if (key !== 'all') {
                                const stateID = stateFolderID + '.' + key;
                                __classPrivateFieldGet(this, _adapter).setObjectNotExistsAsync(stateID, {
                                    type: 'state',
                                    common: {
                                        name: `${key}`,
                                        type: sampleObject.common.type,
                                        role: sampleObject.common.role,
                                        read: sampleObject.common.read,
                                        write: sampleObject.common.write,
                                        desc: sampleObject.common.desc !== undefined
                                            ? sampleObject.common.desc
                                            : undefined,
                                        max: sampleObject.common.max !== undefined
                                            ? sampleObject.common.max
                                            : undefined,
                                        min: sampleObject.common.min !== undefined
                                            ? sampleObject.common.min
                                            : undefined,
                                        unit: sampleObject.common.unit !== undefined
                                            ? sampleObject.common.unit
                                            : undefined,
                                        icon: enumFunction.common.icon,
                                    },
                                    native: {
                                        enumFunction: enumFunction,
                                    },
                                })
                                    .then(() => {
                                    __classPrivateFieldGet(this, _adapter).setStateChangedAsync(stateID, {
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
        this.initValuesCalculation = async () => {
            /**
             * calculates all the values (av, max, min, sum, on) for the first time
             */
            const _initValuesCalculationAllTpyes = () => {
                /**
                 * Calculate all the the values (av, max, min, sum, on) tor a specific function Type (fType)
                 * @param fType type to by calculated
                 * @param members
                 */
                const _initValuesCalculationPerType = (fType) => {
                    const _getForeignStateAsync = (id) => {
                        return new Promise((resolve, reject) => {
                            __classPrivateFieldGet(this, _adapter).getForeignStateAsync(id)
                                .then((state) => {
                                resolve({ id: id, state: state });
                            })
                                .catch((err) => {
                                // TODO ERRORHANDLING
                                __classPrivateFieldSet(this, _initialized, 'error');
                                __classPrivateFieldSet(this, _error, err.message);
                                reject(new Error(__classPrivateFieldGet(this, _error)));
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
                                .then((states) => {
                                states
                                    .filter((stateV) => stateV.state !== null)
                                    .forEach((stateV) => this._updateValue(fType, stateV.id, stateV.state));
                                resolve();
                            })
                                .catch((err) => {
                                // TODO ERRORHANDLING
                                __classPrivateFieldSet(this, _initialized, 'error');
                                __classPrivateFieldSet(this, _error, err.message);
                                reject(new Error(__classPrivateFieldGet(this, _error)));
                            });
                        }
                        catch (err) {
                            // TODO ERRORHANDLING
                            reject(err);
                        }
                    });
                };
                return new Promise((resolve, reject) => {
                    try {
                        const promises = [];
                        for (const [key, value] of Object.entries(this.stateMembersValue)) {
                            if (value !== undefined)
                                promises.push(_initValuesCalculationPerType(key));
                        }
                        Promise.allSettled(promises)
                            .then((arr) => {
                            if (arr.map((r) => r.status).every((s) => s === 'fulfilled')) {
                                resolve();
                            }
                            else {
                                // TODO ERRORHANDLING
                                reject(new Error('error while calculating the HomeContainers values'));
                            }
                        })
                            .catch((err) => {
                            // TODO ERRORHANDLING
                            __classPrivateFieldSet(this, _initialized, 'error');
                            __classPrivateFieldSet(this, _error, err.message);
                            reject(new Error(__classPrivateFieldGet(this, _error)));
                        });
                    }
                    catch (err) {
                        // TODO ERRORHANDLING
                        reject(err);
                    }
                });
            };
            return new Promise((resolve, reject) => {
                if (!this.isReady)
                    reject('Not yet ready');
                try {
                    const promises = [_initValuesCalculationAllTpyes()];
                    for (const hc of this.childrenHomeContainers) {
                        promises.push(hc.initValuesCalculation());
                    }
                    Promise.allSettled(promises)
                        .then((arr) => {
                        if (arr.map((r) => r.status).every((s) => s === 'fulfilled')) {
                            resolve();
                        }
                        else {
                            // TODO ERRORHANDLING
                            reject(new Error('error while calculating the HomeContainers values'));
                        }
                    })
                        .catch((err) => {
                        // TODO ERRORHANDLING
                        __classPrivateFieldSet(this, _initialized, 'error');
                        __classPrivateFieldSet(this, _error, err.message);
                        reject(new Error(__classPrivateFieldGet(this, _error)));
                    });
                }
                catch (err) {
                    // TODO ERRORHANDLING
                    reject(err);
                }
            });
        };
        this.aChangedStateToCheck = (id, state) => {
            const type = this._getTypeOfState(id);
            if (type === undefined)
                return;
            if (state !== null && state !== undefined)
                this._updateValue(type, id, state);
            for (const hc of this.childrenHomeContainers) {
                hc.aChangedStateToCheck(id, state);
            }
        };
        this.aDeleteStateToCheck = (id) => {
            const type = this._getTypeOfState(id);
            if (type === undefined)
                return;
            this.stateMembersValue[type].all = this.stateMembersValue[type].all.filter((e) => e.id !== id);
            this._updateValue(type, undefined, undefined);
            for (const hc of this.childrenHomeContainers) {
                hc.aDeleteStateToCheck(id);
            }
        };
        this.getAllStates = () => {
            return Object.values(this.stateMembersValue)
                .map((v) => v.all.map((e) => e.id))
                .reduce((values, ids) => [...values, ...ids], []);
        };
        this._getTypeOfState = (id) => {
            for (const [key, value] of Object.entries(this.stateMembersValue)) {
                if (value.all.map((e) => e.id).includes(id))
                    return key;
            }
            return undefined;
        };
        this.id = id;
        this.object = object;
        __classPrivateFieldSet(this, _parentContainer, parentContainer);
        __classPrivateFieldSet(this, _adapter, adapter);
    }
    /**
     *
     * @param memberID
     * @param fromChild fromChild if the state is from a child
     * @param memberIDs already calculated memeberIDS from a child
     */
    addStateMember(memberID, fromChild = false) {
        return new Promise((resolve, reject) => {
            try {
                const fTypes = FunctionHelper_1.default.getMachingStateMembers(memberID);
                if (fTypes === undefined)
                    resolve();
                for (const { id, fType } of fTypes) {
                    if (!(fType in this.stateMembersValue)) {
                        this.stateMembersValue[fType] = { all: [{ id: id, fromChild: fromChild }] };
                    }
                    else {
                        if (this.stateMembersValue[fType].all.findIndex((a) => a.id === id) === -1) {
                            this.stateMembersValue[fType].all.push({ id: id, fromChild: fromChild });
                        }
                    }
                }
                if (__classPrivateFieldGet(this, _parentContainer) !== undefined) {
                    __classPrivateFieldGet(this, _parentContainer).addStateMember(memberID, true)
                        .then(() => {
                        resolve();
                    })
                        .catch((err) => {
                        // TODO ERRORHANDLING
                        __classPrivateFieldSet(this, _initialized, 'error');
                        __classPrivateFieldSet(this, _error, err.message);
                        reject(new Error(__classPrivateFieldGet(this, _error)));
                    });
                }
                else {
                    resolve();
                }
            }
            catch (err) {
                // TODO ERRORHANDLING
                __classPrivateFieldSet(this, _initialized, 'error');
                __classPrivateFieldSet(this, _error, err.message);
                reject(new Error(__classPrivateFieldGet(this, _error)));
            }
        });
    }
    getID() {
        if (!this.isReady)
            return undefined;
        return this.id;
    }
    isReady() {
        return __classPrivateFieldGet(this, _initialized) === 'ok';
    }
    isRError() {
        return __classPrivateFieldGet(this, _error);
    }
}
exports.HomeContainer = HomeContainer;
_parentContainer = new WeakMap(), _adapter = new WeakMap(), _initialized = new WeakMap(), _error = new WeakMap();
