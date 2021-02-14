import { I_ioBrokerConfig } from './I_ioBrokerConfig';

export interface I_ioBrokerContextProviderProps {
    ioBrokerConfig: I_ioBrokerConfig;
    configChanged: (systemConfig: ioBroker.Object) => void;
    [key: string]: any;
}
