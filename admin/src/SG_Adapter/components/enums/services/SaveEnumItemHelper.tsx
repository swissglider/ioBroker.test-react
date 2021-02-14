import { I_ioBrokerContextValue } from '../../../framework/interfaces/I_ioBrokerContextValue';
import { EnumHelper } from '../../../framework/utils/EnumHelper';
import { I_EnumItem } from '../interfaces/Interfaces';

const updateEnumByItem = async (ioBContext: I_ioBrokerContextValue, item: I_EnumItem): Promise<void> => {
    let _enum = await EnumHelper.getEnumByID(ioBContext, item.id);
    if (_enum === null || _enum === undefined) {
        _enum = {
            _id: item.id,
            common: { name: '', members: [] },
            native: {},
            type: 'enum',
        };
    }
    _enum.common.name = item.orgName;
    _enum.common.icon = item.icon;
    _enum.common.color = item.color;
    await EnumHelper.saveEnumChangesByObject(ioBContext, item.id, _enum);
};

export const SaveEnumItemHelper = {
    updateEnumByItem: updateEnumByItem,
};
