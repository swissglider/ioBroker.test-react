import React, { Component } from 'react';

export const NotificationContext = React.createContext();

export class NotificationProvider extends Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            notificationCount: 0,
            notificationListOpen: false,
        };
    }

    openNotificationList = (): void => {
        this.setState((prevState) => {
            return {
                notificationListOpen: true,
                notificationCount: prevState['notificationCount'],
            };
        });
    };

    closeNotificationList = (): void => {
        this.setState((prevState) => {
            return {
                notificationListOpen: false,
                notificationCount: prevState['notificationCount'],
            };
        });
    };

    toggleNotificationList = (): void => {
        this.setState((prevState) => {
            return {
                notificationListOpen: !prevState['notificationListOpen'],
                notificationCount: prevState['notificationCount'],
            };
        });
    };

    render(): JSX.Element {
        return (
            <NotificationContext.Provider
                value={{
                    notificationCount: this.state.notificationCount,
                    notificationListOpen: this.state.notificationListOpen,
                    openNotificationList: this.openNotificationList,
                    closeNotificationList: this.closeNotificationList,
                    toggleNotificationList: this.toggleNotificationList,
                }}
            >
                {this.props.children}
            </NotificationContext.Provider>
        );
    }
}
