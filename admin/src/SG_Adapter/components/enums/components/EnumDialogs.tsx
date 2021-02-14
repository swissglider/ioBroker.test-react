import I18n from '@iobroker/adapter-react/i18n';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
    Button,
    List,
    ListItemText,
    ListItemIcon,
} from '@material-ui/core';
import { SwatchesPicker } from 'react-color';
import React, { useEffect, useState } from 'react';
import { I_EnumItem } from '../interfaces/Interfaces';
import { IDGenerator } from '../services/IDGenerator';
import { InputAdornment } from '@material-ui/core';
import { ItemAvatar } from './ItemAvatar';
import { I_ioBrokerContextValue } from '../../../framework/interfaces/I_ioBrokerContextValue';
import { EnumHelper } from '../../../framework/utils/EnumHelper';
import { ObjectStateHelper } from '../../../framework/utils/ObjectStateHelper';
import { ListItem } from '@material-ui/core';
import { ChevronRight } from '@material-ui/icons';

export interface I_EditEnumDialogProps {
    open: boolean;
    item: I_EnumItem | undefined;
    parentID: string;
    onClose: (item: I_EnumItem) => void;
    onCancel: () => void;
    ioBContext: I_ioBrokerContextValue;
}

interface I_TextFieldProps {
    error?: boolean;
    helperText?: string;
}

const defaultItem: I_EnumItem = {
    id: '',
    name: '',
    orgName: { de: '', en: '' },
    icon: '',
    color: '',
};

const dTextFieldP = {
    autoFocus: true,
    // margin: 'dense',
    type: 'text',
    fullWidth: true,
};

const EditEnumDialog = (props: I_EditEnumDialogProps): JSX.Element => {
    const { onClose, onCancel, open } = props;

    const [itemNameENState, setItemNameENState] = useState<string>('');
    const [itemNameENStateProps, setItemNameENStateProps] = useState<I_TextFieldProps>({ error: false });

    const [itemNameDEState, setItemNameDEState] = useState<string>('');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [itemNameDEStateProps, setItemNameDEStateProps] = useState<I_TextFieldProps>({ error: false });

    const [itemIDState, setItemIDState] = useState<string>('');
    const [itemIDStateProps, setItemIDStateProps] = useState<I_TextFieldProps>({ error: false });
    const [idDisabledState, setIdDisabledState] = useState({ disabled: true });

    const [itemIconState, setItemIconState] = useState<string>('');
    const [itemIconStateProps, setItemIconStateProps] = useState<I_TextFieldProps>({
        error: false,
        helperText: '(path or base64)',
    });
    const [itemIconCorrectState, setItemCorrectrIconState] = useState<boolean>(true);

    const [itemColorState, setItemColorState] = useState('');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [itemColorStateProps, setItemColorStateProps] = useState<I_TextFieldProps>({ error: false });

    const getValidationErrors = (): JSX.Element => {
        const errorArray: string[] = [];
        if (itemNameENStateProps.error === true && itemNameENStateProps.helperText !== undefined)
            errorArray.push('name english: ' + itemNameENStateProps.helperText);
        if (itemNameDEStateProps.error === true && itemNameDEStateProps.helperText !== undefined)
            errorArray.push('Name Deutsch: ' + itemNameDEStateProps.helperText);
        if (itemIDStateProps.error === true && itemIDStateProps.helperText !== undefined)
            errorArray.push('ID: ' + itemIDStateProps.helperText);
        if (itemIconStateProps.error === true && itemIconStateProps.helperText !== undefined)
            errorArray.push('Icon: ' + itemIconStateProps.helperText);
        if (itemColorStateProps.error === true && itemColorStateProps.helperText !== undefined)
            errorArray.push('Color: ' + itemColorStateProps.helperText);

        if (errorArray.length === 0) return <></>;
        return (
            <DialogContent>
                <List dense={true}>
                    {errorArray.map((errorString, index) => (
                        <ListItem key={index}>
                            <ListItemIcon>
                                <ChevronRight style={{ color: 'red' }} />
                            </ListItemIcon>
                            <ListItemText style={{ color: 'red' }} primary={errorString} />
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
        );
    };

    const setItemStates = (item: I_EnumItem): void => {
        // set ID
        if (item.id && item.id !== undefined && item.id !== '' && props.parentID !== undefined) {
            setItemIDState(item.id.split(props.parentID + '.').pop() || '');
        }
        // set orgName en
        setItemNameENState(item.orgName.en);
        // set orgName de
        setItemNameDEState(item.orgName.de);
        // set color
        setItemColorState(item.color || '');
        // set icon
        setItemIconState(item.icon || '');
    };

    useEffect(() => {
        if (props.item !== undefined) {
            const t_item = props.item;
            t_item.orgName = IDGenerator.generateOrgName(t_item.orgName, t_item.name);
            setIdDisabledState({ disabled: true });
            setItemStates(t_item);
        } else {
            defaultItem.id = props.parentID + '.';
            setItemStates(defaultItem);
            setIdDisabledState({ disabled: false });
        }
    }, [props.item]);

    const getID = (name: string): string => {
        let id = name.toLocaleLowerCase();
        // let id = name.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
        id = id.replace('\\W+', '');
        id = id.replace(/\s/g, '_');
        id = id.replace('.', '_');
        id = id.replace('-', '_');
        return IDGenerator.getGoodID(id);
    };

    const setIDInUse = (): void => {
        setItemIDStateProps({
            error: true,
            helperText: 'ID already in use',
        });
    };

    const checkIfIdOk = async (id: string): Promise<boolean> => {
        if (props.item !== undefined && props.parentID + '.' + id === props.item.id) return true;
        return !(await ObjectStateHelper.isIDExisting(props.ioBContext, props.parentID + '.' + id));
    };

    const handleClose = async () => {
        let allOK = true;
        // check english name - it is required
        if (itemNameENState === '') {
            setItemNameENStateProps({
                error: true,
                helperText: 'required',
            });
            allOK = false;
        } else {
            setItemNameENStateProps({
                error: false,
            });
        }
        // check ID
        if (itemIDState === '') {
            setItemIDState(getID(itemNameENState));
            if (!(await checkIfIdOk(itemNameENState))) {
                setIDInUse();
            } else {
                setItemIDStateProps({
                    error: true,
                    helperText: 'auto set please check and if ok, save',
                });
            }
            allOK = false;
        } else {
            if (!(await checkIfIdOk(itemIDState))) {
                setIDInUse();
                allOK = false;
            } else {
                setItemIDStateProps({
                    error: false,
                });
            }
        }
        // TODO: check if id already exists !!
        //check icon
        if (!itemIconCorrectState && itemIconState !== '') {
            setItemIconStateProps({
                error: true,
                helperText: '(path or base64) incorrect',
            });
            allOK = false;
        } else {
            setItemIconStateProps({
                error: false,
                helperText: '(path or base64)',
            });
        }

        if (allOK === false) {
            return;
        }
        const orgName = { en: itemNameENState, de: itemNameDEState };
        const t_item = {
            id: props.parentID + '.' + itemIDState,
            name: EnumHelper.getEnumNameByOrgName(props.ioBContext, orgName),
            orgName: orgName,
            icon: itemIconState,
            color: itemColorState,
        };
        onClose(t_item);
    };

    const handleCancel = () => {
        onCancel();
    };

    const enOnChange = (event: { [key: string]: any }): void => {
        // if (event.key !== undefined) console.log(event.key);
        if (event.target !== undefined) {
            if (!(props.item !== undefined && props.item.id !== '')) {
                if (itemIDState === getID(event.target.value.slice(0, -1))) {
                    setItemIDState(getID(event.target.value));
                }
            }
            setItemNameENState(event.target.value);
            if (itemNameENState !== '') {
                setItemNameENStateProps({
                    error: false,
                });
            } else {
                setItemNameENStateProps({
                    error: true,
                    helperText: 'required',
                });
            }
        }
    };

    const deOnChange = (event: { target: { value: any } }): void => {
        setItemNameDEState(event.target.value);
    };

    const iconOnChange = (event: { target: { value: any } }): void => {
        setItemIconState(event.target.value);
    };

    const wrongIconPath = (): void => {
        setItemIconStateProps({
            error: true,
            helperText: '(path or base64) incorrect',
        });
        setItemCorrectrIconState(false);
    };

    const validIconPath = (): void => {
        setItemIconStateProps({
            error: false,
            helperText: '(path or base64)',
        });
        setItemCorrectrIconState(true);
    };

    const colorOnChange = (color: string): void => {
        setItemColorState(color);
    };

    const idOnChange = async (event: { target: { value: any } }): Promise<void> => {
        setItemIDState(getID(event.target.value));
        if (!(await checkIfIdOk(event.target.value))) {
            setIDInUse();
        } else {
            setItemIDStateProps({
                error: false,
            });
        }
    };

    return (
        <Dialog open={open} onClose={handleCancel} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">{I18n.t('change_item_configuratrion')}</DialogTitle>
            {getValidationErrors()}
            <DialogContent>
                <TextField
                    onChange={enOnChange}
                    // onKeyDown={enOnChange}
                    {...itemNameENStateProps}
                    label="name english"
                    value={itemNameENState}
                    required={true}
                    {...dTextFieldP}
                />
                <TextField
                    onChange={deOnChange}
                    {...itemNameDEStateProps}
                    label="Name Deutsch"
                    value={itemNameDEState}
                    {...dTextFieldP}
                />
                <TextField
                    onChange={idOnChange}
                    label="ID"
                    {...itemIDStateProps}
                    {...idDisabledState}
                    value={itemIDState}
                    required={true}
                    InputProps={{
                        startAdornment: <InputAdornment position="start">{props.parentID + '.' || ''}</InputAdornment>,
                    }}
                    {...dTextFieldP}
                />
                <TextField
                    onChange={iconOnChange}
                    label="Icon"
                    {...itemIconStateProps}
                    defaultValue={itemIconState}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <ItemAvatar
                                    icon={itemIconState}
                                    imgProps={{
                                        onError: (e: any) => {
                                            if (e !== null || e !== undefined) wrongIconPath();
                                        },
                                        onLoad: (e: any) => {
                                            if (e !== null || e !== undefined) validIconPath();
                                        },
                                    }}
                                />
                            </InputAdornment>
                        ),
                    }}
                    {...dTextFieldP}
                />
                <TextField
                    style={{ backgroundColor: itemColorState }}
                    {...itemColorStateProps}
                    margin="dense"
                    label="Color"
                    disabled
                    type="text"
                    value={itemColorState}
                    fullWidth
                />
                <SwatchesPicker
                    // label="ColorPicker"
                    // autoFocus
                    // margin="dense"
                    // fullWidth
                    color={itemColorState}
                    onChange={(color) => {
                        colorOnChange(color.hex);
                    }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCancel} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleClose} color="primary">
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export const EnumDialogs = {
    EditEnumDialog: EditEnumDialog,
};
