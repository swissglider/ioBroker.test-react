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
const onReady = async () => {
    try {
        await FunctionHelper_1.default.generateAllFunctionsStateList(_adapter);
        _homeContainers = await generateHomeEnums_1.generateHomeEnums(_adapter);
        await generateHomeEnums_1.calculateHomeContainerValues(_homeContainers);
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
        if (obj.command == 'home_container::getHomeContainer') {
            if (obj.callback)
                _adapter.sendTo(obj.from, obj.command, _homeContainers, obj.callback);
        }
        if (obj.command == 'home_container::getAllFunctionsStateListe') {
            if (obj.callback)
                _adapter.sendTo(obj.from, obj.command, FunctionHelper_1.allFunctionsStateListe, obj.callback);
        }
    }
};
const init = (adapter) => {
    _adapter = adapter;
    _adapter.on('ready', onReady);
    _adapter.on('message', onMessage);
};
const HomeContainerHelper = {
    init: init,
};
exports.default = HomeContainerHelper;
