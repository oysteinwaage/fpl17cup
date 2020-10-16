import React, {Component} from 'react';
import './liveDataShown.css';

class LiveDataShown extends Component{

    render() {
        return (
            <div className="liveDataShownComponent">
                <div className="circle green"></div>
                <span className="liveText">Live</span>
            </div>
        );
    }
}

export default LiveDataShown;
