import React, {Component} from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import '../App.css';
import './Groups.css';
import {groups} from '../matches/Runder.js';

const groupsMenmbers = {
    groupA: [737536, 1259705, 1618273, 130438, 2249091, 3958980],
    groupB: [3930276, 126466, 3034647, 1025143, 3524888, 1],
    groupC: [18575, 2, 1260577, 444051, 552453, 210166],
    groupD: [531121, 1884253, 4984122, 131342, 1159430, 3],
    groupE: [2218701, 493380, 219691, 3126178, 404123, 0],
};

function makeRow(team, matches, wins, draws, lost, goalDiff, points, extraClassname = "") {
    return (
        <div key={team} className={"gruppeRad" + extraClassname}>
            <div className="groupTeam">{team}</div>
            <div className="groupMatches">{matches}</div>
            <div className="groupMatches">{wins}</div>
            <div className="groupMatches">{draws}</div>
            <div className="groupMatches">{lost}</div>
            <div className="groupGoalDiff">{goalDiff}</div>
            <div className="groupPoints">{points}</div>
        </div>
    )
}

class Grupper extends Component {
    tempNullCheck = (teamId) => this.props.groupData[teamId] || {};

    render() {
        const { players } = this.props;
        let that = this;
        return (
            <div className="group-content">
                {groups.map(function (groupLetter) {
                    const groupId = 'group' + groupLetter;
                    const sortedGroupMembers = groupsMenmbers[groupId].sort(function (a, b) {
                        return that.tempNullCheck(b).difference - that.tempNullCheck(a).difference;
                    }).sort(function (a, b) {
                        return that.tempNullCheck(b).points - that.tempNullCheck(a).points;
                    });
                    return (<div key={groupId}>
                        <div className='groupName'>{'Gruppe ' + groupLetter}</div>
                        {makeRow('Lag', 'K', 'S', 'U', 'T', 'Diff', 'Poeng', 'Header')}
                        {sortedGroupMembers.map(team => {
                            const teamData = that.tempNullCheck(team);
                            const diff = teamData.difference > 0 ? '+' + teamData.difference : teamData.difference;
                            return makeRow(
                                team < 4  ? "Fantasy Average" : players[team],
                                teamData.matches,
                                teamData.matchesWon,
                                teamData.matchesDrawn,
                                teamData.matchesLost,
                                diff,
                                teamData.points
                            );
                        })}
                    </div>);
                })}
            </div>
        );
    }
}

Grupper.propTypes = {
    groupData: PropTypes.object,
    players: PropTypes.object
};

const mapStateToProps = state => ({
    groupData: state.data.groupData,
    players: state.data.players
});

export default connect(mapStateToProps)(Grupper);
