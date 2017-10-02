import React, {Component} from 'react';
import {IndexLink, Link} from 'react-router';
import './App.css';
import $ from 'jquery';

class App extends Component {
    componentDidMount() {
        /*  var data = {1727710 : {
         team: "Team Waage",
         name: "Øystein Waage",
         round5: {
         score: 65,
         captain: 24},
         }
         }; */
        // $.get("/api/score").done(function (result) {
        //     var dataz = result.map(player => {
        //         return player.map(round => {
        //                 var roundKey = 'round' + round.event;
        //                 // console.log(roundKey);
        //                 //TODO overskriver tydeligivs hele skjiten hver gang.. fix it
        //                 return {
        //                     [round.entry]: {
        //                         [roundKey]: {
        //                             points: round.points,
        //                             pointsOnBench: round.points_on_bench,
        //                         }
        //                     }
        //                 };
        //             }
        //         )
        //     })
        // });
        console.log('result: ', result);
        console.log('dataz: ', dataz);
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
