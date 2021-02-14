/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { I_ioBrokerContextValue } from '../interfaces/I_ioBrokerContextValue';
import { I_ioBrokerConfig } from '../interfaces/I_ioBrokerConfig';
import { I_ioBrokerContextProviderProps } from '../interfaces/I_ioBrokerContextProviderProps';

export const IOBrokerContext = React.createContext<I_ioBrokerContextValue>({});

export type FN_ConfigChanged = (systemConfig: ioBroker.Object) => void;

export const IOBrokerContextProvider = (props: I_ioBrokerContextProviderProps): JSX.Element => {
    const ioBrokerConfig: I_ioBrokerConfig = props['ioBrokerConfig'];
    const socket = ioBrokerConfig.configuration.socket;

    const [systemConfig, updateSystemConfig] = useState<ioBroker.Object | undefined>(undefined);
    const [title_, updateTitle] = useState<string>('');
    const [icon_, updateIcon] = useState<string>('');

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

    const saveParameter = (parameterName: string, parametervalue: boolean | string | number | string[]) => {
        // console.log(parameterName, parametervalue);
        ioBrokerConfig.genericApp.updateNativeValue(parameterName, parametervalue);
    };

    const render = (): JSX.Element => {
        const title = title_;
        const icon = icon_;
        return (
            <IOBrokerContext.Provider
                value={{
                    title: title,
                    icon: icon,
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
        getSystemConfig().then((e: ioBroker.Object) => {
            if (mounted) {
                updateSystemConfig(e);
                const title = !(typeof ioBrokerConfig.configuration.common.titleLang === 'object')
                    ? ioBrokerConfig.configuration.common.titleLang
                    : e.common.language in ioBrokerConfig.configuration.common.titleLang
                    ? ioBrokerConfig.configuration.common.titleLang[e.common.language]
                    : 'en' in ioBrokerConfig.configuration.common.titleLang
                    ? ioBrokerConfig.configuration.common.titleLang['en']
                    : ioBrokerConfig.configuration.common.title;
                updateTitle(title);
                updateIcon(ioBrokerConfig.configuration.common.extIcon);
                props['configChanged'](e);
                // ioBrokerConfig.genericApp.showToast('SystemConfig updated');
                // ioBrokerConfig.genericApp.showError('SystemConfig updated');
            }
        });
        return () => {
            mounted = false;
        };
    }, []);

    return render();
};
