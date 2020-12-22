import React from 'react';
import { Button, ButtonGroup } from '@material-ui/core';
import I18n from '@iobroker/adapter-react/i18n';
import { Link, useLocation } from 'react-router-dom';
import { DebugMode } from '../../context/DebugModeContext';

export function HeaderSGTabs(props): JSX.Element {
    return render();

    function isMatching1(new_path: string): boolean {
        return useLocation().pathname == new_path;
    }

    function render(): JSX.Element {
        return (
            <DebugMode name="HeaderSGTabs">
                <ButtonGroup variant="text" fullWidth={true}>
                    {props.routerParams.routerConfig.map((item) => (
                        <Button
                            key={item.path}
                            component={Link}
                            to={item.path}
                            style={
                                isMatching1(item.path)
                                    ? {
                                          color: '#343212',
                                          fontSize: '12px',
                                      }
                                    : {
                                          color: '#21b6ae',
                                          fontSize: '12px',
                                      }
                            }
                        >
                            {I18n.t(item.name)}
                        </Button>
                    ))}
                </ButtonGroup>
            </DebugMode>
        );
    }
}
