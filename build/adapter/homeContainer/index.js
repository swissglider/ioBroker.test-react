"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const FunctionHelper_1 = __importStar(require("./FunctionHelper"));
const HomeContainer_1 = require("./HomeContainer");
let _homeContainers;
let _adapter;
// const enumChanged = (adapter: any, id: string, obj: ioBroker.Object | null | undefined): void => {};
const _loadHomeContainerAsync = async () => {
    await FunctionHelper_1.default.generateAllFunctionsStateList(_adapter);
    const allEnums = await _adapter.getForeignObjectsAsync('enum.home.*', 'enum');
    const homeContainers = [];
    const promises = [];
    for (const [id, value] of Object.entries(allEnums)) {
        const tmpHC = new HomeContainer_1.HomeContainer(id, value, _adapter);
        promises.push(tmpHC.init().then(() => homeContainers.push(tmpHC)));
    }
    if (promises.length > 0)
        await Promise.allSettled(promises);
    _homeContainers = homeContainers;
};
const getAllImpactingStates = () => {
    return [...new Set(_homeContainers.map((hc) => hc.getAllRecursiceStateID()).reduce((acc, cV) => [...acc, ...cV]))];
};
const getAllImpactingObjects = async () => {
    const statesIDs = _homeContainers.map((hc) => hc.getAllRecursiceStateID()).reduce((acc, cV) => [...acc, ...cV]);
    const allEnums = await _adapter.getForeignObjectsAsync('enum.*', 'enum');
    const objectIDs = Object.keys(allEnums);
    return [...new Set([...statesIDs, ...objectIDs])];
};
const onReady = async () => {
    try {
        await _loadHomeContainerAsync();
        _adapter.subscribeForeignObjects('enum.*');
    }
    catch (err) {
        // TODO ERRORHANDLING
        console.log('***********************');
        console.log('ERROR !!!!!');
        console.log(err.message);
        console.log(err.name);
        console.log(err.stack);
        console.log('***********************');
    }
};
const onMessage = async (obj) => {
    if (typeof obj === 'object' && obj.message) {
        if (obj.command == 'home_container::getHomeContainer') {
            if (obj.callback)
                _adapter.sendTo(obj.from, obj.command, _homeContainers, obj.callback);
        }
        if (obj.command == 'home_container::getAllFunctionsStateListe') {
            if (obj.callback)
                _adapter.sendTo(obj.from, obj.command, FunctionHelper_1.allFunctionsStateListe, obj.callback);
        }
        if (obj.command == 'home_container::getAllImpactingStates') {
            if (obj.callback)
                _adapter.sendTo(obj.from, obj.command, getAllImpactingStates(), obj.callback);
        }
        if (obj.command == 'home_container::getAllImpactingObjects') {
            const t = await getAllImpactingObjects();
            if (obj.callback)
                _adapter.sendTo(obj.from, obj.command, t, obj.callback);
        }
    }
};
const onObjectChange = (id, obj) => {
    if (obj) {
        // The object was changed
        if (id.startsWith('enum.')) {
            console.log(`object ${id}`);
            _loadHomeContainerAsync();
        }
        // console.log(`object ${id} changed: ${JSON.stringify(obj)}`);
    }
    else {
        // The object was deleted
        console.log(`object ${id} deleted`);
    }
};
const init = (adapter) => {
    _adapter = adapter;
    _adapter.on('ready', onReady);
    _adapter.on('message', onMessage);
    _adapter.on('objectChange', onObjectChange);
    // _adapter.on('unload', onUnload);
};
const HomeContainerHelper = {
    init: init,
};
exports.default = HomeContainerHelper;
