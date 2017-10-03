import React, {Component} from 'react';
import {IndexLink, Link} from 'react-router';
import './App.css';
import $ from 'jquery';
import {groups, gamesPrGroupAndRound, getRoundNr} from './matches/Runder.js';
import {playerIds, participatingRounds} from './utils.js';

var dataz = {};
var groupData = {};
export var currentRound = 5;

const reducer2 = (a, b) => {
    Object.assign(a, {
        ['round' + b.event]: {
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

export function score(t1, t2, round) {
    return dataz[t1] && dataz[t1][round] ? dataz[t1][round].points + ' - ' + dataz[t2][round].points : ' - ';
}

//const makeGroupData = data =>
function makeGroupData() {
    participatingRounds.forEach(r => {
        groups.forEach(function (groupLetter) {
            const groupId = 'group' + groupLetter;
            gamesPrGroupAndRound[getRoundNr(r)][groupId].forEach(match => {
                if (groupData[match[0]]) {
                    groupData[match[0]].matches += 1;
                    groupData[match[0]].points += 3;
                } else {

                }
            })
        })
    })
    console.log('makeGroup', groupData);

    /* groups.map(function (groupLetter) {
         const groupId = 'group' + groupLetter;
         return {gamesPrGroupAndRound[round][groupId].map(function (match) {
                 return <Match key={match[0] + match[1]}
                               team1={match[0]}
                               team2={match[1]}
                               round={'round' + props.chosenRound}/>;
             })};
     }*/
}

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {points: {}, currentRound: 3};
        this.setData = this.setData.bind(this);
        this.setCurrentRound = this.setCurrentRound.bind(this);
    };

    setData(data) {
        this.setState({points: data});
        console.log(this.state);
    }

    setCurrentRound(cur) {
        this.setState({currentRound: cur});
        currentRound = cur;
        console.log(this.state);
    }

    componentDidMount() {
        var that = this;
        $.get("/api/score").done(function (result) {
            if (result || []) {
                console.log('result: ', result);
                dataz = transformData(result);
                console.log('mineData: ', dataz);
                that.setData(dataz);
                that.setCurrentRound(result[0].length);
                // this.setState({points: transformData(result)})
                // that.forceUpdate();
                //groupData = makeGroupData(dataz);
                makeGroupData();
            }
        });
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
