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
var _enumObject, _adapter;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeContainer = void 0;
const FunctionHelper_1 = __importDefault(require("./FunctionHelper"));
class HomeContainer {
    constructor(id, enumObject, adapter) {
        this.id = id;
        this.memberEnumsIDs = [];
        this.localMemberStateIDs = {};
        this.recursiceMemberStateIDs = {};
        this.childrenHomeContainers = [];
        this.initialized = 'none';
        this.error = '';
        _enumObject.set(this, void 0);
        _adapter.set(this, void 0);
        this.init = async () => {
            console.log(this.id + ' - init:1');
            const promises = [];
            for (const subMemberID of __classPrivateFieldGet(this, _enumObject).common.members) {
                subMemberID.startsWith('enum.') ? promises.push(this._addEnum(subMemberID)) : this._addStateID(subMemberID);
            }
            await Promise.allSettled(promises);
            this.getRecursiveMemberStateIDs();
            this.initialized = 'ok';
        };
        this._addEnum = async (id) => {
            console.log(this.id + ' - _addEnum:1');
            this.memberEnumsIDs.push(id);
            const enumObj = await __classPrivateFieldGet(this, _adapter).getForeignObjectAsync(id, 'enum');
            if (enumObj !== null && enumObj !== undefined) {
                const childHC = new HomeContainer(id, enumObj, __classPrivateFieldGet(this, _adapter));
                await childHC.init();
                this.childrenHomeContainers.push(childHC);
            }
        };
        this._addStateID = (id) => {
            console.log(this.id + ' - _addStateID:1');
            const msm = FunctionHelper_1.default.getMachingStateMembers(id);
            this._mergeMemberStateIDTypesWithLocalOnes(msm);
            this.localMemberStateIDs = { ...this.recursiceMemberStateIDs };
        };
        this.getRecursiveMemberStateIDs = () => {
            console.log(this.id + ' - getRecursiveMemberStateIDs:1');
            for (const hc of this.childrenHomeContainers) {
                this._mergeMemberStateIDTypesWithLocalOnes(hc.getRecursiveMemberStateIDs());
            }
            return this.recursiceMemberStateIDs;
        };
        this._mergeMemberStateIDTypesWithLocalOnes = (additionalMSIDs) => {
            console.log(this.id + ' - _mergeMemberStateIDTypesWithLocalOnes:1');
            for (const [newKey, newValues] of Object.entries(additionalMSIDs)) {
                if (!(newKey in this.recursiceMemberStateIDs))
                    this.recursiceMemberStateIDs[newKey] = [];
                this.recursiceMemberStateIDs[newKey] = [
                    ...new Set([...this.recursiceMemberStateIDs[newKey], ...newValues]),
                ];
            }
        };
        __classPrivateFieldSet(this, _enumObject, enumObject);
        __classPrivateFieldSet(this, _adapter, adapter);
    }
}
exports.HomeContainer = HomeContainer;
_enumObject = new WeakMap(), _adapter = new WeakMap();
