import React, {Component} from 'react';
import '../App.css';
import './LeagueTable.css';
import {leagueStandings} from '../App.js';

function makeRow(rank, teamAndManager, gwPoints, totalPoints, extraClassname = "") {
    return (
        <div key={rank} className={"tabellRad" + extraClassname}>
            <div className="tableRank">{rank}</div>
            <div className="tableTeamAndManager">{teamAndManager}</div>
            <div className="tableGwScore">{gwPoints}</div>
            <div className="tableTotalScore">{totalPoints}</div>
        </div>
    )
}

class LeagueTable extends Component {
    render() {
        return (
            <div key="jallajalla" className="table-content">
                <p>Denne siden er ny og under konstruksjon! </p>
                {makeRow('Rank', 'Lag', 'GW', 'TOT',)}
                {leagueStandings.map(function (team) {
                    return makeRow(
                        team.rank,
                        team.entry_name,
                        team.event_total,
                        team.total,
                    );
                })}
            </div>
        );
    }
}

export default LeagueTable;
