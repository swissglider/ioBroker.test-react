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
const generateHomeEnums_1 = require("./generateHomeEnums");
let _homeContainers;
let _adapter;
// const enumChanged = (adapter: any, id: string, obj: ioBroker.Object | null | undefined): void => {};
const _loadHomeContainerAsync = async () => {
    console.log('_loadHomeContainerAsync');
    const obs = await _adapter.getAdapterObjectsAsync();
    for (const key of Object.keys(obs)) {
        await _adapter.delObjectAsync(key);
    }
    if (_homeContainers !== null && _homeContainers !== undefined) {
        await generateHomeEnums_1.unsubscribeToAllStates(_adapter, _homeContainers);
    }
    await _adapter.setObjectNotExistsAsync('homeContainers', {
        type: 'folder',
        common: {
            name: 'homeContainers',
        },
        native: {},
    });
    await FunctionHelper_1.default.generateAllFunctionsStateList(_adapter);
    _homeContainers = await generateHomeEnums_1.generateHomeEnums(_adapter);
    await generateHomeEnums_1.calculateHomeContainerValues(_homeContainers);
    generateHomeEnums_1.subscribeToAllStates(_adapter, _homeContainers);
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
const onMessage = (obj) => {
    if (typeof obj === 'object' && obj.message) {
        if (obj.command == 'home_container_org::getHomeContainer') {
            if (obj.callback)
                _adapter.sendTo(obj.from, obj.command, _homeContainers, obj.callback);
        }
        if (obj.command == 'home_container_org::getAllFunctionsStateListe') {
            if (obj.callback)
                _adapter.sendTo(obj.from, obj.command, FunctionHelper_1.allFunctionsStateListe, obj.callback);
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
const onStateChange = (id, state) => {
    if (state) {
        if (_homeContainers !== undefined && _homeContainers !== null)
            generateHomeEnums_1.aChangedStateToCheck(_homeContainers, id, state);
    }
    else {
        //TODO: The state was deleted
        console.log(`deleted state : ${id}`);
        if (_homeContainers !== undefined && _homeContainers !== null)
            generateHomeEnums_1.aDeleteStateToCheck(_homeContainers, id);
    }
};
const init = (adapter) => {
    _adapter = adapter;
    _adapter.on('ready', onReady);
    _adapter.on('message', onMessage);
    _adapter.on('objectChange', onObjectChange);
    _adapter.on('stateChange', onStateChange);
    // _adapter.on('unload', onUnload);
};
const HomeContainerHelper = {
    init: init,
};
exports.default = HomeContainerHelper;
