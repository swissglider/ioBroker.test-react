import { AdapterInstance } from '@iobroker/adapter-core';
import FunctionHelper, { allFunctionsStateListe } from './FunctionHelper';
import { calculateHomeContainerValues, generateHomeEnums } from './generateHomeEnums';
import { HomeContainer } from './HomeContainer';

let _homeContainers: HomeContainer[];
let _adapter: AdapterInstance;

// const enumChanged = (adapter: any, id: string, obj: ioBroker.Object | null | undefined): void => {};

const onReady = async (): Promise<void> => {
    try {
        await FunctionHelper.generateAllFunctionsStateList(_adapter);
        _homeContainers = await generateHomeEnums(_adapter);
        await calculateHomeContainerValues(_homeContainers);
    } catch (err) {
        // TODO ERRORHANDLING
        console.log('***********************');
        console.log('ERROR !!!!!');
        console.log(err.message);
        console.log(err.name);
        console.log(err.stack);
        console.log('***********************');
    }
};

const onMessage = (obj: ioBroker.Message): void => {
    if (typeof obj === 'object' && obj.message) {
        if (obj.command == 'home_container::getHomeContainer') {
            if (obj.callback) _adapter.sendTo(obj.from, obj.command, _homeContainers, obj.callback);
        }
        if (obj.command == 'home_container::getAllFunctionsStateListe') {
            if (obj.callback) _adapter.sendTo(obj.from, obj.command, allFunctionsStateListe, obj.callback);
        }
    }
};

const init = (adapter: AdapterInstance): void => {
    _adapter = adapter;
    _adapter.on('ready', onReady);
    _adapter.on('message', onMessage);
};

const HomeContainerHelper = {
    init: init,
    // enumChanged: enumChanged,
};

export default HomeContainerHelper;
