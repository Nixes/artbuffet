import React from "react";
import './ErrorHandlerStyle.css'

export class ErrorHandler extends React.PureComponent<any,{hasError:boolean,lastError:string,visible:boolean}> {
    constructor(props) {
        super(props);
        this.state = { visible:false, hasError: false, lastError: '' };
    }

    componentDidMount () {
        window.addEventListener("error",  (e) => {
            this.logError(e.error.message);
            return false;
        });

        window.addEventListener('unhandledrejection', (e) => {
            this.logError(e.reason.message);
        });
    }

    logError(error: string) {
        this.setState({visible: true, hasError: true, lastError:error });
        console.error("React caught an error: ");
        console.error(error);
        return true;
    }

    hide = () => {
        this.setState({ visible: false });
    }

    render() {
        if (this.state.hasError && this.state.visible) {
            // You can render any custom fallback UI
            return <div id='error-message-container'>
                    <div id='error-message'>
                        <a onClick={this.hide}>X</a>
                        <h5>An error has occurred:</h5>
                        <code>{this.state.lastError}</code>
                    </div>
            </div>;
        }
        return '';
    }
}