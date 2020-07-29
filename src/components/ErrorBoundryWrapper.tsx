import React from "react";
import './ErrorBoundryStyle.css'

export class ErrorBoundryWrapper extends React.Component<any,any> {
    constructor(props) {
        super(props);
        this.state = { hasError: false, lastError: '' };
    }

    componentDidCatch(error, info) {
        // Display fallback UI
        this.setState({ hasError: true, lastError:error });
        console.log("React caught an error: ");
        console.log(error);
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return <div>
                <div id='error-message'>
                    <h1>Error: An error has occured</h1>
                </div>

            </div>;
        }
        return this.props.children;
    }
}