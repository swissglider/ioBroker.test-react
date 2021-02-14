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
        this.stateMembers = {};
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
        this._initValuesCalculationPerType = (type, members) => {
            return new Promise((resolve, reject) => {
                try {
                    const promises = [];
                    for (const id of members) {
                        promises.push(this._getForeignStateAsync(id));
                    }
                    Promise.all(promises)
                        .then((states) => {
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
                        }
                        else if (allValues.every((e) => typeof e === 'number')) {
                            this.stateMembersValue[type]['av'] =
                                allValues.reduce((a, b) => a + b, 0) / allValues.length;
                            this.stateMembersValue[type]['max'] = Math.max(...allValues);
                            this.stateMembersValue[type]['min'] = Math.min(...allValues);
                            this.stateMembersValue[type]['sum'] = allValues.reduce((a, b) => a + b, 0);
                        }
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
        this._initValuesCalculationAllTpyes = () => {
            return new Promise((resolve, reject) => {
                try {
                    const promises = [];
                    for (const [key, value] of Object.entries(this.stateMembers)) {
                        if (value !== undefined)
                            promises.push(this._initValuesCalculationPerType(key, value.members));
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
        this.getAllStates = () => {
            return Object.values(this.stateMembers)
                .map((v) => v.members)
                .reduce((values, ids) => ({ ...values, ...ids }));
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
     * @param fresh if the same members has not yet been asked for by any children
     * @param memberIDs already calculated memeberIDS from a child
     */
    addStateMember(memberID, fresh = true, memberIDs) {
        return new Promise((resolve, reject) => {
            try {
                if (fresh || memberIDs === undefined) {
                    const fTypes = FunctionHelper_1.default.getMachingStateMembers(memberID);
                    if (fTypes === undefined)
                        resolve();
                    for (const fType of Object.keys(fTypes)) {
                        if (!(fType in this.stateMembers)) {
                            this.stateMembers[fType] = { members: [] };
                        }
                    }
                    memberIDs = fTypes;
                }
                for (const fType of Object.keys(memberIDs)) {
                    if (this.stateMembers[fType] === undefined)
                        this.stateMembers[fType] = { members: [] };
                    this.stateMembers[fType].members = [
                        ...new Set([...this.stateMembers[fType].members, ...memberIDs[fType].members]),
                    ];
                }
                if (__classPrivateFieldGet(this, _parentContainer) !== undefined) {
                    __classPrivateFieldGet(this, _parentContainer).addStateMember(memberID, false)
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
