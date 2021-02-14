import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import I18n from '@iobroker/adapter-react/i18n';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import { I_ioBrokerContextValue } from '../../../framework/interfaces/I_ioBrokerContextValue';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import i18n from '@iobroker/adapter-react/i18n';
import TextField from '@material-ui/core/TextField/TextField';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Theme } from '@iobroker/adapter-react/types';
import Grid from '@material-ui/core/Grid/Grid';
import Paper from '@material-ui/core/Paper/Paper';
import List from '@material-ui/core/List/List';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
        },
        paper: {
            padding: theme.spacing(2),
            textAlign: 'center',
            color: theme.palette.text.secondary,
        },
        formControlItem: {
            padding: theme.spacing(0, 0, 3),
        },
    }),
);

export interface MSConverterDialogProps {
    open: boolean;
    initMSValue?: number;
    parameter?: string;
    iobContext?: I_ioBrokerContextValue;
    onClose: (ms: number, parameter: string, iobContext: I_ioBrokerContextValue) => void;
    onCancel: () => void;
}

export const defaultMSConverterDialogProps: MSConverterDialogProps = {
    open: false,
    onClose: () => {
        return;
    },
    onCancel: () => {
        return;
    },
};

type timeUnits = 'ms' | 's' | 'm' | 'h' | 'd';

export const MSConverterDialog = (props: MSConverterDialogProps): JSX.Element => {
    const [returnValue, setReturnValue] = useState<number>(props.initMSValue === undefined ? 0 : props.initMSValue);
    const [selectedTimeUnit, setSelectedTimeUnit] = useState<timeUnits>('ms');
    const [inputValue, setInputValue] = useState<number>(props.initMSValue === undefined ? 0 : props.initMSValue);

    const classes = useStyles();

    let open = props.open;

    useEffect(() => {
        if (props.initMSValue !== undefined) setReturnValue(props.initMSValue);
        if (props.initMSValue !== undefined) setInputValue(props.initMSValue);
        setSelectedTimeUnit('ms');
    }, [props]);

    const handleUnitChange = (event: React.ChangeEvent<{ value: unknown }>): void => {
        const unit_: timeUnits = event.target.value as timeUnits;
        console.log('unit_');
        switch (unit_) {
            case 'ms':
                console.log('ms');
                setInputValue(returnValue);
                break;
            case 's':
                console.log('s');
                setInputValue(returnValue / 1000);
                break;
            case 'm':
                console.log('m');
                setInputValue(returnValue / 1000 / 60);
                break;
            case 'h':
                console.log('h');
                setInputValue(returnValue / 1000 / 60 / 60);
                break;
            case 'd':
                console.log('d');
                setInputValue(returnValue / 1000 / 60 / 60 / 24);
                break;
        }
        setSelectedTimeUnit(unit_);
    };

    const handleValueChange = (event: React.ChangeEvent<{ value: unknown }>): void => {
        const value_: number = event.target.value as number;
        setInputValue(value_);
        switch (selectedTimeUnit) {
            case 'ms':
                setReturnValue(value_);
                break;
            case 's':
                setReturnValue(value_ * 1000);
                break;
            case 'm':
                setReturnValue(value_ * 1000 * 60);
                break;
            case 'h':
                setReturnValue(value_ * 1000 * 60 * 60);
                break;
            case 'd':
                setReturnValue(value_ * 1000 * 60 * 60 * 24);
                break;
        }
    };

    if (props.parameter === undefined || props.iobContext === undefined) {
        open = false;
    }

    return (
        <Dialog open={open} onClose={props.onCancel}>
            <DialogTitle id="alert-dialog-title">{I18n.t('milliseconds converter')}</DialogTitle>
            <DialogContent>
                <Grid container className={classes.root} spacing={2}>
                    <Grid item>
                        <Paper className={classes.paper}>
                            <FormControl>
                                <div className={classes.formControlItem}>
                                    <InputLabel>{i18n.t('select unit')}</InputLabel>
                                    <Select value={selectedTimeUnit} onChange={handleUnitChange}>
                                        <MenuItem value="ms">{i18n.t('ms')}</MenuItem>
                                        <MenuItem value="s">{i18n.t('s')}</MenuItem>
                                        <MenuItem value="m">{i18n.t('m')}</MenuItem>
                                        <MenuItem value="h">{i18n.t('h')}</MenuItem>
                                        <MenuItem value="d">{i18n.t('d')}</MenuItem>
                                    </Select>
                                </div>
                                <TextField
                                    className={classes.formControlItem}
                                    required
                                    id="inputValue"
                                    label={i18n.t('inputValue')}
                                    value={inputValue}
                                    onChange={handleValueChange}
                                    type="number"
                                />
                            </FormControl>
                        </Paper>
                    </Grid>
                    <Grid item>
                        <Paper className={classes.paper}>
                            <List dense={true}>
                                <ListItem>
                                    <Typography variant="body2" noWrap>
                                        {returnValue + ' ' + i18n.t('ms')}
                                    </Typography>
                                </ListItem>
                                <ListItem>
                                    <Typography variant="body2" noWrap>
                                        {returnValue / 1000 + ' ' + i18n.t('s')}
                                    </Typography>
                                </ListItem>
                                <ListItem>
                                    <Typography variant="body2" noWrap>
                                        {returnValue / 1000 / 60 + ' ' + i18n.t('m')}
                                    </Typography>
                                </ListItem>
                                <ListItem>
                                    <Typography variant="body2" noWrap>
                                        {returnValue / 1000 / 60 / 60 + ' ' + i18n.t('h')}
                                    </Typography>
                                </ListItem>
                                <ListItem>
                                    <Typography variant="body2" noWrap>
                                        {returnValue / 1000 / 60 / 60 / 24 + ' ' + i18n.t('d')}
                                    </Typography>
                                </ListItem>
                            </List>
                        </Paper>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                {props.parameter !== undefined && props.iobContext !== undefined && (
                    <Button
                        onClick={() =>
                            props.onClose(
                                returnValue,
                                props.parameter as string,
                                props.iobContext as I_ioBrokerContextValue,
                            )
                        }
                        color="primary"
                    >
                        Ok
                    </Button>
                )}
                <Button onClick={props.onCancel} color="primary" autoFocus>
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
};
