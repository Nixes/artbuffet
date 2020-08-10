import React from "react";
import './ErrorBoundryStyle.css'

export class ErrorBoundryWrapper extends React.Component<any,any> {
    constructor(props) {
        super(props);
        this.state = { hasError: false, lastError: '' };
    }

    componentDidMount () {
        // window.onunhandledrejection
        // window.onerror = (event: Event | string, source?: string, lineno?: number, colno?: number, error?: Error) => {
        //     // @ts-ignore
        //     this.logError(error.toString());
        //     return false;
        // };

        // window.addEventListener("error", (event: Event | string, source?: string, lineno?: number, colno?: number, error?: Error) => {
        //     // error handling code here!
        //     console.log('Something bad happened');
        //     if (error) {
        //         this.logError(error.message);
        //     }
        //     return true;
        // });
        // window.onunhandledrejection = (e) => {
        //     // error handling code here!
        //     console.log('Something bad happened');
        //     this.logError(e.reason);
        // }

        // window.addEventListener("unhandledrejection", (event) => {
        //     // error handling code here!
        //     console.log('Something bad happened');
        //         this.logError(event.reason);
        //     return true;
        // });
        // the wonders of js scoping
        // let thing = this;
        // window.addEventListener('error', function(e){
        //     console.log("Error:");
        //     console.log(e);
        //
        //     // prevent React's listener from firing
        //     e.stopImmediatePropagation();
        //     // prevent the browser's console error message
        //     e.preventDefault();
        //
        //     thing.logError(e);
        // });

        window.addEventListener("error", function (e) {
            alert("Error occurred: " + e.error.message);
            return false;
        });

        window.addEventListener('unhandledrejection', function (e) {
            alert("Error occurred: " + e.reason.message);
        });

        console.log("Registered handlers");
    }

    logError(error) {
        this.setState({ hasError: true, lastError:error });
            console.log("React caught an error: ");
            console.log(error);
            return true;
    }

    // componentDidCatch(error, info) {
    //     // Display fallback UI
    //     this.setState({ hasError: true, lastError:error });
    //     console.log("React caught an error: ");
    //     console.log(error);
    // }

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