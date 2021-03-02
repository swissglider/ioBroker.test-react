import FunctionHelper from './FunctionHelper';

export type T_MEMBER_STATE_IDS = {
    [fType: string]: string[];
};

export class HomeContainer {
    memberEnumsIDs: string[] = [];
    localMemberStateIDs: T_MEMBER_STATE_IDS = {};
    recursiveMemberStateIDs: T_MEMBER_STATE_IDS = {};
    childrenHomeContainers: HomeContainer[] = [];
    initialized: 'none' | 'loading' | 'ok' | 'error' = 'none';
    error: string | undefined = '';
    #enumObject;
    #adapter;

    constructor(public id: string, enumObject: ioBroker.Object, adapter: ioBroker.Adapter) {
        this.#enumObject = enumObject;
        this.#adapter = adapter;
    }

    public init = async (): Promise<void> => {
        const promises = [];
        for (const subMemberID of this.#enumObject.common.members) {
            subMemberID.startsWith('enum.') ? promises.push(this._addEnum(subMemberID)) : this._addStateID(subMemberID);
        }
        await Promise.allSettled(promises);
        this.getRecursiveMemberStateIDs();
        this.initialized = 'ok';
    };

    public getAllRecursiceStateID = (): string[] => {
        return [
            ...new Set(
                Object.values(this.recursiveMemberStateIDs).reduce(
                    (accumulator, currentValue) => [...accumulator, ...currentValue],
                    [],
                ),
            ),
        ];
    };

    private _addEnum = async (id: string): Promise<void> => {
        this.memberEnumsIDs.push(id);
        const enumObj = await this.#adapter.getForeignObjectAsync(id, 'enum');
        if (enumObj !== null && enumObj !== undefined) {
            const childHC = new HomeContainer(id, enumObj, this.#adapter);
            await childHC.init();
            this.childrenHomeContainers.push(childHC);
        }
    };

    private _addStateID = (id: string): void => {
        const msm = FunctionHelper.getMachingStateMembers(id);
        this._mergeMemberStateIDTypesWithLocalOnes(msm);
        this.localMemberStateIDs = { ...this.recursiveMemberStateIDs };
    };

    public getRecursiveMemberStateIDs = (): T_MEMBER_STATE_IDS => {
        for (const hc of this.childrenHomeContainers) {
            this._mergeMemberStateIDTypesWithLocalOnes(hc.getRecursiveMemberStateIDs());
        }
        return this.recursiveMemberStateIDs;
    };

    private _mergeMemberStateIDTypesWithLocalOnes = (additionalMSIDs: T_MEMBER_STATE_IDS): void => {
        for (const [newKey, newValues] of Object.entries(additionalMSIDs)) {
            if (!(newKey in this.recursiveMemberStateIDs)) this.recursiveMemberStateIDs[newKey] = [];
            this.recursiveMemberStateIDs[newKey] = [
                ...new Set([...this.recursiveMemberStateIDs[newKey], ...newValues]),
            ];
        }
    };
}
