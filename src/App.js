import React, {Component} from 'react';
import {IndexLink, Link} from 'react-router';
import './App.css';
import $ from 'jquery';

import { playerIds } from './utils.js';

const reducer2 = (a, b) => {
    Object.assign(a, {
        ['round' + b.event] : {
            points: b.points - b.event_transfers_cost,
            pointsOnBench: b.points_on_bench,
        }
    })
    return a;
};

const reducer1 = data => (acc, current) => {
    acc[current] = data[Object.keys(acc).length].reduce(reducer2, {});
    return acc;
};

const transformData = data =>
    playerIds.reduce(reducer1(data), {})

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {points: {}};
    };

    componentDidMount() {
        var x = {};
        $.get("/api/score").done(function (result) {
            console.log('result: ', result);
            console.log('mineData: ', transformData(result));
            x = transformData(result);
        });
        this.setState({points: x});
        console.log('state: ', this.state);
    }

    render() {
        return (
            <div>
                <div className="overHeader">
                    <div className="headerText">
                        <h1>For Fame And Glory FPL'17 Cup-O-Rama</h1>
                    </div>
                    <div className="headerArt"></div>
                </div>
                <ul className="header">
                    <li><IndexLink to="/" activeClassName="active">Kamper</IndexLink></li>
                    <li><Link to="/grupper" activeClassName="active">Grupper</Link></li>
                    <li><Link to="/funfacts" activeClassName="active">Funfacts</Link></li>
                </ul>
                <div className="content">
                    {this.props.children}
                </div>
            </div>
        );
    }
}

export default App;
