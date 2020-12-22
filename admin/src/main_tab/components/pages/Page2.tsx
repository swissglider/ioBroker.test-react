import { Box, CheckBox, List, Text, TextInput } from 'grommet';
import React from 'react';

import I18n from '@iobroker/adapter-react/i18n';
import { IOBrokerContext } from '../../framework/context/IOBrokerContext';
import { MainPageWrapper } from '../../framework/utils/MainPageWrapper';

export const Page2 = (): JSX.Element => {
    return (
        <MainPageWrapper pageName="page2">
            <>
                <IOBrokerContext.Consumer>
                    {(context) => {
                        return (
                            <List
                                data={context.getParameterList()}
                                pad={{ left: 'small', right: 'none' }}
                                primaryKey={(item) => (
                                    <Text size="large" weight="bold">
                                        {I18n.t(item.name)}
                                    </Text>
                                )}
                                secondaryKey={(item) => (
                                    <Box>
                                        {['string', 'number'].includes(typeof item.value) ? (
                                            <TextInput
                                                plain="full"
                                                value={item.value}
                                                size="small"
                                                onChange={(event) =>
                                                    context.saveParameter(item.name, event.target.value)
                                                }
                                            />
                                        ) : typeof item.value === 'boolean' ? (
                                            <CheckBox
                                                checked={item.value}
                                                onChange={(event) =>
                                                    context.saveParameter(item.name, event.target.checked)
                                                }
                                            />
                                        ) : (
                                            <Text size="small" color="dark-4">
                                                {item.value.toString()}
                                            </Text>
                                        )}
                                    </Box>
                                )}
                            />
                        );
                    }}
                </IOBrokerContext.Consumer>
            </>
        </MainPageWrapper>
    );
};
