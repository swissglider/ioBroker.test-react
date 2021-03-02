import FunctionHelper, { allFunctionsStateListe } from './FunctionHelper';
import { HomeContainer } from './HomeContainer';

let _homeContainers: HomeContainer[];
let _adapter: ioBroker.Adapter;

// const enumChanged = (adapter: any, id: string, obj: ioBroker.Object | null | undefined): void => {};

const _loadHomeContainerAsync = async (): Promise<void> => {
    await FunctionHelper.generateAllFunctionsStateList(_adapter);
    const allEnums = await _adapter.getForeignObjectsAsync('enum.home.*', 'enum');
    const homeContainers: HomeContainer[] = [];
    const promises = [];
    for (const [id, value] of Object.entries(allEnums)) {
        const tmpHC = new HomeContainer(id, value, _adapter);
        promises.push(tmpHC.init().then(() => homeContainers.push(tmpHC)));
    }
    if (promises.length > 0) await Promise.allSettled(promises);
    _homeContainers = homeContainers;
};

const getAllImpactingStates = (): string[] => {
    return [...new Set(_homeContainers.map((hc) => hc.getAllRecursiceStateID()).reduce((acc, cV) => [...acc, ...cV]))];
};

const getAllImpactingObjects = async (): Promise<string[]> => {
    const statesIDs = _homeContainers.map((hc) => hc.getAllRecursiceStateID()).reduce((acc, cV) => [...acc, ...cV]);
    const allEnums = await _adapter.getForeignObjectsAsync('enum.*', 'enum');
    const objectIDs = Object.keys(allEnums);
    return [...new Set([...statesIDs, ...objectIDs])];
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

const onMessage = async (obj: ioBroker.Message): Promise<void> => {
    if (typeof obj === 'object' && obj.message) {
        if (obj.command == 'home_container::getHomeContainer') {
            if (obj.callback) _adapter.sendTo(obj.from, obj.command, _homeContainers, obj.callback);
        }
        if (obj.command == 'home_container::getAllFunctionsStateListe') {
            if (obj.callback) _adapter.sendTo(obj.from, obj.command, allFunctionsStateListe, obj.callback);
        }
        if (obj.command == 'home_container::getAllImpactingStates') {
            if (obj.callback) _adapter.sendTo(obj.from, obj.command, getAllImpactingStates(), obj.callback);
        }
        if (obj.command == 'home_container::getAllImpactingObjects') {
            const t = await getAllImpactingObjects();
            if (obj.callback) _adapter.sendTo(obj.from, obj.command, t, obj.callback);
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

const init = (adapter: ioBroker.Adapter): void => {
    _adapter = adapter;
    _adapter.on('ready', onReady);
    _adapter.on('message', onMessage);
    _adapter.on('objectChange', onObjectChange);
    // _adapter.on('unload', onUnload);
};

const HomeContainerHelper = {
    init: init,
    // enumChanged: enumChanged,
};

export default HomeContainerHelper;
