import React, {Component} from 'react';
import './liveDataShown.css';

class LiveDataShown extends Component {

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
