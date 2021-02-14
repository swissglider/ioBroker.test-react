import React, { useEffect, useState } from 'react';
import { loadCSS } from 'fg-loadcss';
import i18n from '@iobroker/adapter-react/i18n';
import { Checkbox, createStyles, Icon, makeStyles, Theme, Tooltip } from '@material-ui/core';
import { ListItem } from '@material-ui/core';
import { TextField } from '@material-ui/core';
import { FormControlLabel } from '@material-ui/core';
import { List } from '@material-ui/core';
import { IoBContextWrapper } from '../../../framework/components/IoBContextWrapper';
import { RuntimeError } from '../../../framework/components/RuntimeError';
import {
    I_ioBrokerContextValue,
    I_ioBrokerContextValuePair,
} from '../../../framework/interfaces/I_ioBrokerContextValue';
import PageHelper from '../../../framework/utils/PageHelper';
import { defaultMSConverterDialogProps, MSConverterDialog, MSConverterDialogProps } from './MSConverterDialog';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            '& > .fa': {
                margin: theme.spacing(2),
            },
        },
    }),
);

const allNeededProps: string[] = ['prefix'];

export interface StandardConfigProps {
    [key: string]: any;
}

const StandardConfig_ = (props: StandardConfigProps): JSX.Element => {
    const classes = useStyles();
    const [pageProps, setPageProps] = useState<{ [key: string]: any }>([]);
    const [allNeededPropsAvailable, setAllNeededPropsAvailable] = useState<boolean>(false);
    const [msConverterDialogProps, setMSConverterDialogProps] = useState<MSConverterDialogProps>(
        defaultMSConverterDialogProps,
    );

    const onMSConverteDialogClose = (ms: number, parameter: string, iobContext: I_ioBrokerContextValue): void => {
        setMSConverterDialogProps(defaultMSConverterDialogProps);
        if (iobContext.saveParameter) {
            iobContext.saveParameter(parameter, ms);
        }
    };

    const onMSConverteDialogCancel = (): void => {
        setMSConverterDialogProps(defaultMSConverterDialogProps);
    };

    useEffect(() => {
        const pageProps = PageHelper.getPageProps(location.pathname, props);
        const allOk = PageHelper.allNeededPropsAvailable(allNeededProps, pageProps);
        allOk && pageProps !== undefined ? setPageProps(pageProps) : setPageProps([]);
        setAllNeededPropsAvailable(allOk);
    }, [props]);

    React.useEffect(() => {
        const node = loadCSS(
            'https://use.fontawesome.com/releases/v5.12.0/css/all.css',
            document.querySelector('#font-awesome-css') === null
                ? undefined
                : (document.querySelector('#font-awesome-css') as HTMLElement),
        );

        return () => {
            node.parentNode!.removeChild(node);
        };
    }, []);

    const openMSConverter = (valuePair: I_ioBrokerContextValuePair, iobContext: I_ioBrokerContextValue): void => {
        setMSConverterDialogProps({
            open: true,
            initMSValue: valuePair.value as number,
            parameter: valuePair.name,
            iobContext: iobContext,
            onClose: onMSConverteDialogClose,
            onCancel: onMSConverteDialogCancel,
        });
    };

    return (
        <>
            {!allNeededPropsAvailable ? (
                <RuntimeError errorMessage="not all the Properties are configured ..." />
            ) : (
                <IoBContextWrapper>
                    {(context: I_ioBrokerContextValue) => {
                        return (
                            <List>
                                {context.getParameterList === undefined ? (
                                    <div>Name </div>
                                ) : (
                                    context
                                        .getParameterList()
                                        .filter((paramPair) => paramPair.name.startsWith(pageProps['prefix']))
                                        .map((paramPair, index) => (
                                            <div key={index}>
                                                {['string', 'number'].includes(typeof paramPair.value) && (
                                                    <ListItem divider={true}>
                                                        <TextField
                                                            label={i18n.t(paramPair.name)}
                                                            style={{ margin: 8 }}
                                                            value={paramPair.value}
                                                            fullWidth
                                                            margin="normal"
                                                            InputLabelProps={{
                                                                shrink: true,
                                                            }}
                                                            onChange={(event) => {
                                                                if (context.saveParameter) {
                                                                    context.saveParameter(
                                                                        paramPair.name,
                                                                        event.target.value,
                                                                    );
                                                                }
                                                            }}
                                                        />
                                                        {pageProps['parametersWithMs'].includes(paramPair.name) && (
                                                            <Tooltip title={i18n.t('milliseconds converter')}>
                                                                <div className={classes.root}>
                                                                    <Icon
                                                                        onClick={() =>
                                                                            openMSConverter(paramPair, context)
                                                                        }
                                                                        className="fas fa-calculator"
                                                                        fontSize="small"
                                                                    />
                                                                </div>
                                                            </Tooltip>
                                                        )}
                                                    </ListItem>
                                                )}
                                                {typeof paramPair.value === 'boolean' && (
                                                    <ListItem divider={true}>
                                                        <FormControlLabel
                                                            style={{ margin: 8 }}
                                                            control={
                                                                <Checkbox
                                                                    checked={paramPair.value}
                                                                    onChange={(event) => {
                                                                        if (context.saveParameter) {
                                                                            context.saveParameter(
                                                                                paramPair.name,
                                                                                event.target.checked,
                                                                            );
                                                                        }
                                                                    }}
                                                                    name={paramPair.name}
                                                                />
                                                            }
                                                            label={i18n.t(paramPair.name)}
                                                        />
                                                    </ListItem>
                                                )}
                                            </div>
                                        ))
                                )}
                            </List>
                        );
                    }}
                </IoBContextWrapper>
            )}
            <MSConverterDialog {...msConverterDialogProps} />
        </>
    );
};

const StandardConfig = (props: StandardConfigProps): JSX.Element => <StandardConfig_ {...props} />;

export default StandardConfig;
