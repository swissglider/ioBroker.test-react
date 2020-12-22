/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import Connection from '@iobroker/adapter-react/Connection';
import GenericApp from '@iobroker/adapter-react/GenericApp';

export const IOBrokerContext = React.createContext();

export interface I_ioBrokerConfig {
    configuration: {
        instance: number;
        adapterName: any;
        instanceId: string;
        savedNative: any;
        encryptedFields: string[];
        socket: Connection;
        _secret: any;
        common:
            | (ioBroker.StateCommon & Record<string, any>)
            | (ioBroker.ChannelCommon & Record<string, any>)
            | (ioBroker.DeviceCommon & Record<string, any>)
            | (ioBroker.OtherCommon & Record<string, any>)
            | (ioBroker.EnumCommon & Record<string, any>);
    };
    parameter: ioBroker.AdapterConfig;
    genericApp: GenericApp;
}

export interface I_IOBrokerConsumerType {
    title: string;
    icon: string;
    ioBrokerConfig: I_ioBrokerConfig;
    systemConfig: ioBroker.Object;
    getParameterList: any;
    saveParameter: any;
}

export type FN_ConfigChanged = (systemConfig: any) => void;

export const IOBrokerContextProvider = (props: { [key: string]: any }): JSX.Element => {
    const ioBrokerConfig: I_ioBrokerConfig = props['ioBrokerConfig'];
    const socket = ioBrokerConfig.configuration.socket;

    const [systemConfig, updateSystemConfig] = useState(undefined);
    const [title_, updateTitle] = useState(ioBrokerConfig.configuration.common.title);

    const getSystemConfig = (): Promise<ioBroker.Object> => {
        if (socket.objects && socket.objects['system.config']) {
            return Promise.resolve(socket.objects['system.config']);
        } else {
            return socket.getObject('system.config').then((obj_) => {
                if (obj_ && obj_ !== undefined) return Promise.resolve(obj_ as ioBroker.Object);
                return Promise.reject('Error while getting System Config');
            });
        }
    };

    const saveParameter = (parameterName: string, parametervalue: any) => {
        ioBrokerConfig.genericApp.updateNativeValue(parameterName, parametervalue);
    };

    const render = (): JSX.Element => {
        const title = title_;
        return (
            <IOBrokerContext.Provider
                value={{
                    title: title,
                    icon: ioBrokerConfig.configuration.common.extIcon,
                    ioBrokerConfig: ioBrokerConfig,
                    systemConfig: systemConfig,
                    getParameterList: () => {
                        return Object.entries(ioBrokerConfig.parameter).map(([key, value]) => {
                            return { name: key, value: value };
                        });
                    },
                    saveParameter: saveParameter,
                }}
            >
                {props['children']}
            </IOBrokerContext.Provider>
        );
    };

    useEffect(() => {
        let mounted = true;
        console.debug('IOBrokerContextProvider:useEffect1');
        getSystemConfig().then((e: ioBroker.Object) => {
            if (mounted) {
                console.debug('IOBrokerContextProvider:useEffect2');
                console.log(ioBrokerConfig);
                // ioBrokerConfig.genericApp.updateNativeValue('option3', 45, () => {
                //     ioBrokerConfig.genericApp.onSave(false);
                //     console.log('saved');
                // });
                updateSystemConfig(e);
                const title = !(typeof ioBrokerConfig.configuration.common.titleLang === 'object')
                    ? ioBrokerConfig.configuration.common.titleLang
                    : e.common.language in ioBrokerConfig.configuration.common.titleLang
                    ? ioBrokerConfig.configuration.common.titleLang[e.common.language]
                    : 'en' in ioBrokerConfig.configuration.common.titleLang
                    ? ioBrokerConfig.configuration.common.titleLang['en']
                    : ioBrokerConfig.configuration.common.title;
                updateTitle(title);
                props['configChanged'](e);
                ioBrokerConfig.genericApp.showToast('SystemConfig updated');
                ioBrokerConfig.genericApp.showError('SystemConfig updated');
            }
        });
        return () => {
            mounted = false;
        };
    }, []);

    return render();
};
