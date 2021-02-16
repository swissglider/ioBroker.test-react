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
        this._initChildHC = (member) => {
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
        this._getForeignStateAsync = (id) => {
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
                this.stateMembersValue[fType]['sum'] =
                    Math.round(allValues.reduce((a, b) => a + b, 0) * 10) / 10;
            }
            console.log(`${JSON.stringify(this.object.common.name)} -> ${fType} -> ${JSON.stringify(Object.fromEntries(Object.entries(this.stateMembersValue[fType]).filter(([key]) => key !== 'all')))}`);
        };
        /**
         * Calculate all the the values (av, max, min, sum, on) tor a specific function Type (fType)
         * @param fType type to by calculated
         * @param members
         */
        this._initValuesCalculationPerType = (fType) => {
            return new Promise((resolve, reject) => {
                try {
                    const promises = [];
                    for (const ins of this.stateMembersValue[fType].all) {
                        promises.push(this._getForeignStateAsync(ins.id));
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
        /**
         * calculates all the values (av, max, min, sum, on) for the first time
         */
        this._initValuesCalculationAllTpyes = () => {
            return new Promise((resolve, reject) => {
                try {
                    const promises = [];
                    for (const [key, value] of Object.entries(this.stateMembersValue)) {
                        if (value !== undefined)
                            promises.push(this._initValuesCalculationPerType(key));
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
        /**
         * calculates all the values (av, max, min, sum, on) for the first time and the same for all the childrens
         */
        this.initValuesCalculation = async () => {
            return new Promise((resolve, reject) => {
                if (!this.isReady)
                    reject('Not yet ready');
                try {
                    const promises = [this._initValuesCalculationAllTpyes()];
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
    init() {
        return this.generateChildrenHomeContainers();
    }
    generateChildrenHomeContainers() {
        return new Promise((resolve, reject) => {
            try {
                if (this.object.common.members === null || this.object.common.members === undefined) {
                    __classPrivateFieldSet(this, _initialized, 'ok');
                    resolve();
                }
                const promises = [];
                for (const member of this.object.common.members) {
                    if (member.startsWith('enum.')) {
                        promises.push(this._initChildHC(member));
                    }
                    else {
                        promises.push(this.addStateMember(member));
                    }
                }
                Promise.allSettled(promises)
                    .then((arr) => {
                    if (arr.map((r) => r.status).every((s) => s === 'fulfilled')) {
                        __classPrivateFieldSet(this, _initialized, 'ok');
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
            }
            catch (err) {
                // TODO ERRORHANDLING
                __classPrivateFieldSet(this, _initialized, 'error');
                __classPrivateFieldSet(this, _error, err.message);
                reject(new Error(__classPrivateFieldGet(this, _error)));
            }
        });
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
