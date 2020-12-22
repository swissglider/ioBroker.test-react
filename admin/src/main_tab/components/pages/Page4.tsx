import { Box, Card, CardBody, CardHeader, Grid } from 'grommet';
import React, { useEffect, useState } from 'react';
import { IOBrokerContext } from '../../framework/context/IOBrokerContext';
import { MainPageWrapper } from '../../framework/utils/MainPageWrapper';
import { ObjectStateHelper } from '../../framework/utils/ObjectStateHelper';

const Page4_ = (props: { ioBContext }): JSX.Element => {
    const [members, setMemebers] = useState([{ name: 'dummy', id: 'dummy' }]);

    useEffect(() => {
        let mounted = true;
        ObjectStateHelper.getObjectByID(props.ioBContext, 'enum.home.wollerau').then(async (obj) => {
            if (mounted) {
                if (obj && 'members' in obj.common) {
                    const membersArray: { name: string; id: string }[] = [];
                    for (const mID of obj.common.members) {
                        const name = await ObjectStateHelper.getDisplayNameByID(props.ioBContext, mID);
                        membersArray.push({ name: name, id: mID });
                    }
                    setMemebers(membersArray);
                } else {
                    setMemebers([]);
                }
            }
        });
        return () => {
            mounted = false;
        };
    }, []);

    const allowDrop = (ev) => {
        ev.preventDefault();
    };

    const drag = (ev) => {
        ev.dataTransfer.setData('text', ev.target.id);
    };

    const drop = (ev) => {
        ev.preventDefault();
        const data = ev.dataTransfer.getData('text');
        ev.target.appendChild(document.getElementById(data));
    };

    return (
        <Grid
            fill
            gap="small"
            alignSelf="center"
            rows={['xsmall', 'xsmall', 'xsmall', 'xsmall']}
            columns={['flex', 'flex']}
            areas={[
                { name: 'home', start: [0, 0], end: [1, 0] },
                { name: 'area', start: [0, 1], end: [0, 1] },
                { name: 'zone', start: [1, 1], end: [1, 1] },
                { name: 'floor', start: [0, 2], end: [1, 2] },
                { name: 'room', start: [0, 3], end: [1, 3] },
            ]}
        >
            <br></br>
            <Card gridArea="home" background="light-1">
                <CardHeader background="light-2" pad="xsmall" align="center" alignContent="center">
                    Home
                </CardHeader>
                <CardBody
                    id="CardBody1"
                    ondrop="drop(event)"
                    ondragover="allowDrop(event)"
                    pad="xxsmall"
                    direction="row"
                    alignSelf="center"
                    gap="xsmall"
                >
                    {members.map((member) => (
                        <Box
                            id="drag1"
                            draggable="true"
                            ondragstart="drag(event)"
                            key={member.id}
                            alignSelf="center"
                            pad="xsmall"
                            border={{ color: 'brand', size: 'xsmall' }}
                        >
                            {member.name}
                        </Box>
                    ))}
                </CardBody>
            </Card>
            <Card gridArea="area" background="light-1">
                <CardHeader background="light-2" pad="xsmall">
                    Area
                </CardHeader>
                <CardBody
                    id="CardBody2"
                    ondrop="drop(event)"
                    ondragover="allowDrop(event)"
                    pad="xxsmall"
                    direction="row"
                    alignSelf="center"
                    gap="xsmall"
                >
                    <Box alignSelf="center" pad="xsmall" border={{ color: 'brand', size: 'xsmall' }}>
                        Body
                    </Box>
                    <Box alignSelf="center" pad="xsmall" border={{ color: 'brand', size: 'xsmall' }}>
                        Body
                    </Box>
                    <Box alignSelf="center" pad="xsmall" border={{ color: 'brand', size: 'xsmall' }}>
                        Body
                    </Box>
                    <Box alignSelf="center" pad="xsmall" border={{ color: 'brand', size: 'xsmall' }}>
                        Body
                    </Box>
                    <Box alignSelf="center" pad="xsmall" border={{ color: 'brand', size: 'xsmall' }}>
                        Body
                    </Box>
                    <Box alignSelf="center" pad="xsmall" border={{ color: 'brand', size: 'xsmall' }}>
                        Body
                    </Box>
                    <Box alignSelf="center" pad="xsmall" border={{ color: 'brand', size: 'xsmall' }}>
                        Body
                    </Box>
                    <Box alignSelf="center" pad="xsmall" border={{ color: 'brand', size: 'xsmall' }}>
                        Body
                    </Box>
                </CardBody>
            </Card>
            <Card gridArea="zone" background="light-1">
                <CardHeader background="light-2" pad="xsmall">
                    Zone
                </CardHeader>
                <CardBody pad="xxsmall" direction="row" alignSelf="center" gap="xsmall">
                    <Box alignSelf="center" pad="xsmall" border={{ color: 'brand', size: 'xsmall' }}>
                        Body
                    </Box>
                    <Box alignSelf="center" pad="xsmall" border={{ color: 'brand', size: 'xsmall' }}>
                        Body
                    </Box>
                    <Box alignSelf="center" pad="xsmall" border={{ color: 'brand', size: 'xsmall' }}>
                        Body
                    </Box>
                    <Box alignSelf="center" pad="xsmall" border={{ color: 'brand', size: 'xsmall' }}>
                        Body
                    </Box>
                    <Box alignSelf="center" pad="xsmall" border={{ color: 'brand', size: 'xsmall' }}>
                        Body
                    </Box>
                </CardBody>
            </Card>
            <Card gridArea="floor" background="light-1">
                <CardHeader background="light-2" pad="xsmall">
                    Floor
                </CardHeader>
                <CardBody pad="medium">Body</CardBody>
            </Card>
            <Card gridArea="room" background="light-1">
                <CardHeader background="light-2" pad="xsmall">
                    Room
                </CardHeader>
                <CardBody pad="medium">Body</CardBody>
            </Card>
        </Grid>
    );
};

export const Page4 = (): JSX.Element => {
    return (
        <MainPageWrapper pageName="page4">
            <IOBrokerContext.Consumer>{(ioBContext) => <Page4_ ioBContext={ioBContext} />}</IOBrokerContext.Consumer>
        </MainPageWrapper>
    );
};
