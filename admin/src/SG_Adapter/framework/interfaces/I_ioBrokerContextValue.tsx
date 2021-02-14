import { I_ioBrokerConfig } from './I_ioBrokerConfig';

export interface I_ioBrokerContextValuePair {
    name: string;
    value: string | number | boolean;
}

export interface I_ioBrokerContextValue {
    title?: string;
    icon?: string;
    ioBrokerConfig?: I_ioBrokerConfig;
    systemConfig?: ioBroker.Object;
    getParameterList?: () => I_ioBrokerContextValuePair[];
    saveParameter?: (parameterName: string, parametervalue: string | number | boolean | string[]) => void;
}
