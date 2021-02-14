/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react';

export class GlobalErrorBoundary extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: any): { hasError: boolean } {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    componentDidCatch(error: any, errorInfo: any): void {
        // You can also log the error to an error reporting service
        console.error(error, errorInfo);
    }

    render(): JSX.Element | React.ReactNode {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return <h1>Something went wrong.</h1>;
        }

        return this.props.children;
    }
}
