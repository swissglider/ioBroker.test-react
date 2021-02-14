// import React, { useEffect, useState } from 'react';
import Connection from '@iobroker/adapter-react/Connection';
import GenericApp from '@iobroker/adapter-react/GenericApp';

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
