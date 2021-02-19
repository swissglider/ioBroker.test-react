import FunctionHelper, { allFunctionsStateListe } from './FunctionHelper';
import {
    aChangedStateToCheck,
    aDeleteStateToCheck,
    calculateHomeContainerValues,
    generateHomeEnums,
    subscribeToAllStates,
    unsubscribeToAllStates,
} from './generateHomeEnums';
import { HomeContainer } from './HomeContainer';

let _homeContainers: HomeContainer[];
let _adapter: ioBroker.Adapter;

// const enumChanged = (adapter: any, id: string, obj: ioBroker.Object | null | undefined): void => {};

const _loadHomeContainerAsync = async (): Promise<void> => {
    console.log('_loadHomeContainerAsync');
    const obs = await _adapter.getAdapterObjectsAsync();
    for (const key of Object.keys(obs)) {
        await _adapter.delObjectAsync(key);
    }
    if (_homeContainers !== null && _homeContainers !== undefined) {
        await unsubscribeToAllStates(_adapter, _homeContainers);
    }
    await _adapter.setObjectNotExistsAsync('homeContainers', {
        type: 'folder',
        common: {
            name: 'homeContainers',
        },
        native: {},
    });
    await FunctionHelper.generateAllFunctionsStateList(_adapter);
    _homeContainers = await generateHomeEnums(_adapter);
    await calculateHomeContainerValues(_homeContainers);
    subscribeToAllStates(_adapter, _homeContainers);
};

const onReady = async (): Promise<void> => {
    try {
        await _loadHomeContainerAsync();
        _adapter.subscribeForeignObjects('enum.*');
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
        if (obj.command == 'home_container_org::getHomeContainer') {
            if (obj.callback) _adapter.sendTo(obj.from, obj.command, _homeContainers, obj.callback);
        }
        if (obj.command == 'home_container_org::getAllFunctionsStateListe') {
            if (obj.callback) _adapter.sendTo(obj.from, obj.command, allFunctionsStateListe, obj.callback);
        }
    }
};

const onObjectChange = (id: string, obj: ioBroker.Object | null | undefined): void => {
    if (obj) {
        // The object was changed
        if (id.startsWith('enum.')) {
            console.log(`object ${id}`);
            _loadHomeContainerAsync();
        }
        // console.log(`object ${id} changed: ${JSON.stringify(obj)}`);
    } else {
        // The object was deleted
        console.log(`object ${id} deleted`);
    }
};

const onStateChange = (id: string, state: ioBroker.State | null | undefined): void => {
    if (state) {
        if (_homeContainers !== undefined && _homeContainers !== null) aChangedStateToCheck(_homeContainers, id, state);
    } else {
        //TODO: The state was deleted
        console.log(`deleted state : ${id}`);
        if (_homeContainers !== undefined && _homeContainers !== null) aDeleteStateToCheck(_homeContainers, id);
    }
};

const init = (adapter: ioBroker.Adapter): void => {
    _adapter = adapter;
    _adapter.on('ready', onReady);
    _adapter.on('message', onMessage);
    _adapter.on('objectChange', onObjectChange);
    _adapter.on('stateChange', onStateChange);
    // _adapter.on('unload', onUnload);
};

const HomeContainerHelper = {
    init: init,
    // enumChanged: enumChanged,
};

export default HomeContainerHelper;
