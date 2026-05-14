import React, {Component} from 'react';
import './liveDataShown.css';

interface LiveDataShownProps {
    text?: string;
}

class LiveDataShown extends Component<LiveDataShownProps, {}> {

    render() {
        return (
            <div className="liveDataContainer">
                <div className="liveDataShownComponent">
                    <div className="circle green" />
                    <span className="liveText">Live</span>
                </div>
                <div className="disclaimerText"><span>{this.props.text}</span></div>
            </div>
        );
    }
}

export default LiveDataShown;
